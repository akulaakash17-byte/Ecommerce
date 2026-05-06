import express from "express";
import { createUser, getMe, login } from "../controllers/authController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";
import { loginRules, userRules } from "../middleware/validators.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/login", loginRules, validateRequest, login);
router.get("/me", protect, getMe);
router.post("/users", protect, authorizeRoles("admin"), userRules, validateRequest, createUser);

export default router;
