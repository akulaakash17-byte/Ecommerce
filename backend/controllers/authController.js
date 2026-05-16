import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../middleware/errorMiddleware.js";
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

  res.status(201).json(user);
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.list();
  res.json(users);
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out." });
});
