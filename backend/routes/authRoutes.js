import express from "express";
import { createUser, getMe, listUsers, login, logout } from "../controllers/authController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";
import { loginRules, userRules } from "../middleware/validators.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/login", loginRules, validateRequest, login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.get("/users", protect, authorizeRoles("admin"), listUsers);
router.post("/users", protect, authorizeRoles("admin"), userRules, validateRequest, createUser);

export default router;
