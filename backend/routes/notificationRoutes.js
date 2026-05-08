import express from "express";
import { listNotificationLogs } from "../controllers/notificationController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), listNotificationLogs);

export default router;
