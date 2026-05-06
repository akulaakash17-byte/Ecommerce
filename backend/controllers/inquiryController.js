import { InquiryModel } from "../models/inquiryModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createInquiry = asyncHandler(async (req, res) => {
  const inquiry = await InquiryModel.create(req.body);
  res.status(201).json(inquiry);
});

export const listInquiries = asyncHandler(async (req, res) => {
  const inquiries = await InquiryModel.list(req.query);
  res.json(inquiries);
});
