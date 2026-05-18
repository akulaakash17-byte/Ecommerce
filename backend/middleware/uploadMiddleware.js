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
const allowedVideoTypes = new Map([
  ["video/mp4", [".mp4"]],
  ["video/webm", [".webm"]],
  ["video/quicktime", [".mov"]],
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
  const allowedTypes = file.fieldname === "video" ? allowedVideoTypes : allowedImageTypes;
  const validExtensions = allowedTypes.get(file.mimetype);

  if (!validExtensions || !validExtensions.includes(extension)) {
    return callback(new ApiError(400, "Only JPG, PNG, WebP images and MP4, WebM, MOV videos are allowed."));
  }

  return callback(null, true);
};

const propertyUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: Math.max(env.upload.maxFileSizeMb, env.upload.maxVideoFileSizeMb) * 1024 * 1024,
    files: env.upload.maxFiles + 1,
  },
}).fields([
  { name: "images", maxCount: env.upload.maxFiles },
  { name: "images[]", maxCount: env.upload.maxFiles },
  { name: "video", maxCount: 1 },
]);

function getUploadedFiles(files = {}) {
  return Object.values(files).flat();
}

function removeUploadedFiles(files = {}) {
  getUploadedFiles(files).forEach((file) => {
    if (file?.path) {
      fs.unlink(file.path, () => {});
    }
  });
}

function validateUploadedFileSizes(files = {}) {
  const oversizedFile = getUploadedFiles(files).find((file) => {
    const maxSizeMb = file.fieldname === "video" ? env.upload.maxVideoFileSizeMb : env.upload.maxFileSizeMb;
    return file.size > maxSizeMb * 1024 * 1024;
  });

  if (!oversizedFile) {
    return null;
  }

  const fileKind = oversizedFile.fieldname === "video" ? "Video" : "Photo";
  const maxSizeMb = oversizedFile.fieldname === "video" ? env.upload.maxVideoFileSizeMb : env.upload.maxFileSizeMb;
  return new ApiError(400, `${fileKind} uploads can be up to ${maxSizeMb}MB.`);
}

export function uploadPropertyImages(req, res, next) {
  propertyUpload(req, res, (error) => {
    if (!error) {
      const sizeError = validateUploadedFileSizes(req.files);

      if (sizeError) {
        removeUploadedFiles(req.files);
        return next(sizeError);
      }

      return next();
    }

    if (error instanceof multer.MulterError) {
      const messages = {
        LIMIT_UNEXPECTED_FILE: "Upload field is not supported. Use the images field for photos and the video field for one property video.",
        LIMIT_FILE_SIZE: `Uploaded file is too large. Photos can be up to ${env.upload.maxFileSizeMb}MB and videos can be up to ${env.upload.maxVideoFileSizeMb}MB.`,
        LIMIT_FILE_COUNT: `Too many files uploaded. You can upload up to ${env.upload.maxFiles} photos and 1 video.`,
      };

      return next(new ApiError(400, messages[error.code] || error.message));
    }

    return next(error);
  });
}
