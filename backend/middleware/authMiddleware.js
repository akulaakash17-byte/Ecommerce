import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { UserModel } from "../models/userModel.js";
import { ApiError } from "./errorMiddleware.js";

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (!token) {
      throw new ApiError(401, "Authentication token is required.");
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await UserModel.findById(payload.id);

    if (!user) {
      throw new ApiError(401, "User session is no longer valid.");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.name === "JsonWebTokenError" ? new ApiError(401, "Invalid token.") : error);
  }
}

export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(new ApiError(403, "You do not have permission for this action."));
    }

    return next();
  };
}
