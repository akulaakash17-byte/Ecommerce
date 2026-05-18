import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";
import { env } from "../config/env.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, "../uploads");

export async function storeUploadedImages(files = []) {
  if (!files.length) {
    return [];
  }

  if (!isCloudinaryConfigured) {
    return files.map((file) => `/uploads/${file.filename}`);
  }

  const uploads = await Promise.all(
    files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: env.cloudinary.folder,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      });

      await fs.unlink(file.path).catch(() => {});
      return result.secure_url;
    })
  );

  return uploads;
}

export async function storeUploadedVideo(files = []) {
  const [file] = files;
  if (!file) {
    return "";
  }

  if (!isCloudinaryConfigured) {
    return `/uploads/${file.filename}`;
  }

  const result = await cloudinary.uploader.upload(file.path, {
    folder: env.cloudinary.folder,
    resource_type: "video",
  });

  await fs.unlink(file.path).catch(() => {});
  return result.secure_url;
}

function getLocalUploadPath(mediaUrl) {
  if (!String(mediaUrl || "").startsWith("/uploads/")) {
    return "";
  }

  const fileName = path.basename(mediaUrl);
  return path.join(uploadDir, fileName);
}

function getCloudinaryPublicId(mediaUrl) {
  if (!mediaUrl || !mediaUrl.includes("res.cloudinary.com") || !mediaUrl.includes("/upload/")) {
    return "";
  }

  try {
    const url = new URL(mediaUrl);
    const [, afterUpload = ""] = url.pathname.split("/upload/");
    const parts = afterUpload.split("/").filter(Boolean);
    const withoutVersion = parts[0]?.startsWith("v") && /^\d+$/.test(parts[0].slice(1)) ? parts.slice(1) : parts;
    const publicPath = withoutVersion.join("/");
    return publicPath.replace(/\.[^/.]+$/, "");
  } catch {
    return "";
  }
}

export async function deleteStoredMedia(mediaUrl, resourceType = "image") {
  const localPath = getLocalUploadPath(mediaUrl);

  if (localPath) {
    await fs.unlink(localPath).catch(() => {});
    return;
  }

  const publicId = getCloudinaryPublicId(mediaUrl);

  if (publicId && isCloudinaryConfigured) {
    await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      resource_type: resourceType,
    }).catch(() => {});
  }
}

export async function deleteStoredMediaMany(mediaUrls = [], resourceType = "image") {
  await Promise.all(mediaUrls.filter(Boolean).map((mediaUrl) => deleteStoredMedia(mediaUrl, resourceType)));
}
