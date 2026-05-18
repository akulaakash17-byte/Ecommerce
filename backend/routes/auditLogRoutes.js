import express from "express";
import { listAuditLogs } from "../controllers/auditLogController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), listAuditLogs);

export default router;
