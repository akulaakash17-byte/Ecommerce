import { validationResult } from "express-validator";
import { ApiError } from "./errorMiddleware.js";

export function validateRequest(req, res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return next(new ApiError(422, "Validation failed.", result.array()));
  }

  return next();
}
