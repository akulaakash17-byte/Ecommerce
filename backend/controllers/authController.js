import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../middleware/errorMiddleware.js";
import { AuditLogModel } from "../models/auditLogModel.js";
import { UserModel } from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

function setAuthCookie(res, token) {
  res.cookie(env.authCookieName, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.authCookieSameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

function clearAuthCookie(res) {
  res.clearCookie(env.authCookieName, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.authCookieSameSite,
    path: "/",
  });
}

function recordAudit(entry) {
  AuditLogModel.create(entry).catch((error) => {
    console.error("Audit log write failed:", error.message);
  });
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  };

  setAuthCookie(res, signToken(user));
  res.json({ user: safeUser });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

export const createUser = asyncHandler(async (req, res) => {
  const existing = await UserModel.findByEmail(req.body.email);

  if (existing) {
    throw new ApiError(409, "A user with this email already exists.");
  }

  const password = await bcrypt.hash(req.body.password, 12);
  const user = await UserModel.create({ ...req.body, password });

  recordAudit({
    actor_id: req.user.id,
    action: "user.created",
    entity_type: "user",
    entity_id: user.id,
    entity_label: user.email,
    metadata: { role: user.role },
  });

  res.status(201).json(user);
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.list();
  res.json(users);
});

export const listAgents = asyncHandler(async (req, res) => {
  const agents = await UserModel.listAgents();
  res.json(agents);
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await UserModel.findWithPasswordById(req.user.id);

  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    throw new ApiError(401, "Current password is incorrect.");
  }

  const password = await bcrypt.hash(newPassword, 12);
  await UserModel.updatePasswordById(req.user.id, password);

  recordAudit({
    actor_id: req.user.id,
    action: "user.password_changed",
    entity_type: "user",
    entity_id: req.user.id,
    entity_label: req.user.email,
  });

  res.json({ message: "Password changed." });
});

export const resetUserPassword = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const password = await bcrypt.hash(req.body.password, 12);
  const updatedUser = await UserModel.updatePasswordById(req.params.id, password);

  recordAudit({
    actor_id: req.user.id,
    action: "user.password_reset",
    entity_type: "user",
    entity_id: updatedUser.id,
    entity_label: updatedUser.email,
    metadata: { resetBy: req.user.email },
  });

  res.json({ message: "Password reset.", user: updatedUser });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out." });
});
