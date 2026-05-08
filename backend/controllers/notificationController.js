import { NotificationLogModel } from "../models/notificationLogModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listNotificationLogs = asyncHandler(async (req, res) => {
  const logs = await NotificationLogModel.list(req.query);
  res.json(logs);
});
