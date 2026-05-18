import { ApiError } from "../middleware/errorMiddleware.js";
import { InquiryModel } from "../models/inquiryModel.js";
import { notifyInquiryCreated } from "../services/inquiryNotificationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createInquiry = asyncHandler(async (req, res) => {
  const inquiry = await InquiryModel.create(req.body);
  notifyInquiryCreated(inquiry).catch((error) => {
    console.error("Inquiry notification failed:", error.message);
  });
  res.status(201).json(inquiry);
});

export const listInquiries = asyncHandler(async (req, res) => {
  const inquiries = await InquiryModel.list(req.query);
  res.json(inquiries);
});

export const updateInquiryStatus = asyncHandler(async (req, res) => {
  const inquiry = await InquiryModel.updateStatus(req.params.id, req.body);

  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found.");
  }

  res.json(inquiry);
});

export const deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await InquiryModel.remove(req.params.id);

  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found.");
  }

  res.json({ message: "Inquiry deleted.", inquiry });
});
