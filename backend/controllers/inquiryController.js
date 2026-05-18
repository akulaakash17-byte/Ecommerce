import { ApiError } from "../middleware/errorMiddleware.js";
import { AuditLogModel } from "../models/auditLogModel.js";
import { InquiryModel } from "../models/inquiryModel.js";
import { UserModel } from "../models/userModel.js";
import { notifyInquiryCreated } from "../services/inquiryNotificationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function recordAudit(entry) {
  AuditLogModel.create(entry).catch((error) => {
    console.error("Audit log write failed:", error.message);
  });
}

export const createInquiry = asyncHandler(async (req, res) => {
  const inquiry = await InquiryModel.create(req.body);
  recordAudit({
    action: "inquiry.created",
    entity_type: "inquiry",
    entity_id: inquiry.id,
    entity_label: inquiry.name,
    metadata: { property_id: inquiry.property_id, source: "public" },
  });
  notifyInquiryCreated(inquiry).catch((error) => {
    console.error("Inquiry notification failed:", error.message);
  });
  res.status(201).json(inquiry);
});

export const listInquiries = asyncHandler(async (req, res) => {
  const inquiries = await InquiryModel.list(req.query, req.user);
  res.json(inquiries);
});

export const updateInquiryStatus = asyncHandler(async (req, res) => {
  const inquiry = await InquiryModel.updateStatus(req.params.id, req.body);

  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found.");
  }

  recordAudit({
    actor_id: req.user.id,
    action: "inquiry.status_updated",
    entity_type: "inquiry",
    entity_id: inquiry.id,
    entity_label: inquiry.name,
    metadata: { status: inquiry.status, status_note: inquiry.status_note },
  });

  res.json(inquiry);
});

export const assignInquiry = asyncHandler(async (req, res) => {
  const assignedTo = req.body.assigned_to || null;

  if (assignedTo) {
    const agent = await UserModel.findById(assignedTo);

    if (!agent || agent.role !== "agent") {
      throw new ApiError(422, "Assigned user must be an agent.");
    }
  }

  const inquiry = await InquiryModel.updateAssignment(req.params.id, assignedTo);

  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found.");
  }

  recordAudit({
    actor_id: req.user.id,
    action: "inquiry.assigned",
    entity_type: "inquiry",
    entity_id: inquiry.id,
    entity_label: inquiry.name,
    metadata: { assigned_to: inquiry.assigned_to },
  });

  res.json(inquiry);
});

export const deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await InquiryModel.remove(req.params.id);

  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found.");
  }

  recordAudit({
    actor_id: req.user.id,
    action: "inquiry.deleted",
    entity_type: "inquiry",
    entity_id: inquiry.id,
    entity_label: inquiry.name,
    metadata: { property_id: inquiry.property_id, assigned_to: inquiry.assigned_to },
  });

  res.json({ message: "Inquiry deleted.", inquiry });
});
