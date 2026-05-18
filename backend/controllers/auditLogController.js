import { AuditLogModel } from "../models/auditLogModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listAuditLogs = asyncHandler(async (req, res) => {
  const logs = await AuditLogModel.list(req.query);
  res.json(logs);
});
