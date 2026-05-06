import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5050),
  clientUrl: process.env.CLIENT_URL || "http://127.0.0.1:5173",
  jwtSecret: process.env.JWT_SECRET || "change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  db: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || "postgres",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
  },
  admin: {
    name: process.env.ADMIN_NAME || "Srinivas",
    phone: process.env.ADMIN_PHONE || "9849972116",
    email: process.env.ADMIN_EMAIL || "akulasrinu62@gmail.com",
    password: process.env.ADMIN_PASSWORD || "admin12345",
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    folder: process.env.CLOUDINARY_FOLDER || "siddipet-real-estate",
  },
  notifications: {
    inquiryPhone: process.env.INQUIRY_NOTIFICATION_PHONE || "918897422872",
    whatsapp: {
      enabled: process.env.WHATSAPP_NOTIFICATION_ENABLED === "true",
      apiVersion: process.env.WHATSAPP_API_VERSION || "v25.0",
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
    },
    sms: {
      webhookUrl: process.env.SMS_NOTIFICATION_WEBHOOK_URL || "",
      apiKey: process.env.SMS_NOTIFICATION_API_KEY || "",
    },
  },
};
