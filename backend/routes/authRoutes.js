import express from "express";
import {
  changePassword,
  createUser,
  getMe,
  listAgents,
  listUsers,
  login,
  logout,
  resetUserPassword,
} from "../controllers/authController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";
import { changePasswordRules, idParamRule, loginRules, resetPasswordRules, userRules } from "../middleware/validators.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/login", loginRules, validateRequest, login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.patch("/password", protect, changePasswordRules, validateRequest, changePassword);
router.get("/users", protect, authorizeRoles("admin"), listUsers);
router.get("/agents", protect, authorizeRoles("admin", "agent"), listAgents);
router.post("/users", protect, authorizeRoles("admin"), userRules, validateRequest, createUser);
router.patch(
  "/users/:id/password",
  protect,
  authorizeRoles("admin"),
  idParamRule,
  resetPasswordRules,
  validateRequest,
  resetUserPassword
);

export default router;
