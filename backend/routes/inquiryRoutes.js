import express from "express";
import { createInquiry, listInquiries } from "../controllers/inquiryController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";
import { inquiryRules } from "../middleware/validators.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/", inquiryRules, validateRequest, createInquiry);
router.get("/", protect, authorizeRoles("admin", "agent"), listInquiries);

export default router;
