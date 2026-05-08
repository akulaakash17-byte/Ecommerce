import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import multer from "multer";
import { env } from "../config/env.js";
import { ApiError } from "./errorMiddleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, "../uploads");
const allowedImageTypes = new Map([
  ["image/jpeg", [".jpg", ".jpeg"]],
  ["image/png", [".png"]],
  ["image/webp", [".webp"]],
]);

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${randomUUID()}${extension}`);
  },
});

const fileFilter = (req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const validExtensions = allowedImageTypes.get(file.mimetype);

  if (!validExtensions || !validExtensions.includes(extension)) {
    return callback(new ApiError(400, "Only JPG, PNG, and WebP image uploads are allowed."));
  }

  return callback(null, true);
};

export const uploadPropertyImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.upload.maxFileSizeMb * 1024 * 1024,
    files: env.upload.maxFiles,
  },
}).array("images", env.upload.maxFiles);
