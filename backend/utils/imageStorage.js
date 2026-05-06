import fs from "node:fs/promises";
import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";
import { env } from "../config/env.js";

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
