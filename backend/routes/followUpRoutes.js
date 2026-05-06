import express from "express";
import {
  createFollowUp,
  listFollowUps,
  updateFollowUpStatus,
} from "../controllers/followUpController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";
import { followUpRules, followUpStatusRules, idParamRule } from "../middleware/validators.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin", "agent"), listFollowUps);
router.post("/", protect, authorizeRoles("admin", "agent"), followUpRules, validateRequest, createFollowUp);
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  idParamRule,
  followUpStatusRules,
  validateRequest,
  updateFollowUpStatus
);

export default router;
