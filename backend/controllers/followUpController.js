import { ApiError } from "../middleware/errorMiddleware.js";
import { FollowUpModel } from "../models/followUpModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createFollowUp = asyncHandler(async (req, res) => {
  const followUp = await FollowUpModel.create({
    ...req.body,
    agent_id: req.user.id,
  });

  res.status(201).json(followUp);
});

export const listFollowUps = asyncHandler(async (req, res) => {
  const followUps = await FollowUpModel.list(req.query, req.user);
  res.json(followUps);
});

export const updateFollowUpStatus = asyncHandler(async (req, res) => {
  const followUp = await FollowUpModel.updateStatus(req.params.id, req.body);

  if (!followUp) {
    throw new ApiError(404, "Follow-up not found.");
  }

  res.json(followUp);
});
