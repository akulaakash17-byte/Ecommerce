import express from "express";
import { createInquiry, listInquiries, updateInquiryStatus } from "../controllers/inquiryController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";
import { idParamRule, inquiryRules, inquiryStatusRules } from "../middleware/validators.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/", inquiryRules, validateRequest, createInquiry);
router.get("/", protect, authorizeRoles("admin", "agent"), listInquiries);
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin", "agent"),
  idParamRule,
  inquiryStatusRules,
  validateRequest,
  updateInquiryStatus
);

export default router;
