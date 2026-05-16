import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const isProduction = process.env.NODE_ENV === "production";
const jwtSecret = process.env.JWT_SECRET || "change-me";

function splitCsv(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function requireStrongProductionSecret(name, value) {
  if (!isProduction) return;

  if (!value || value === "change-me" || value.length < 32) {
    throw new Error(`${name} must be set to a unique value of at least 32 characters in production.`);
  }
}

requireStrongProductionSecret("JWT_SECRET", jwtSecret);

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction,
  port: Number(process.env.PORT || 5050),
  clientUrl: process.env.CLIENT_URL || "http://127.0.0.1:5173",
  clientUrls: splitCsv(process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://127.0.0.1:5173"),
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  authCookieName: process.env.AUTH_COOKIE_NAME || "rew_session",
  authCookieSameSite: process.env.AUTH_COOKIE_SAME_SITE || (isProduction ? "none" : "lax"),
  maxJsonBodySize: process.env.MAX_JSON_BODY_SIZE || "100kb",
  upload: {
    maxFileSizeMb: Number(process.env.UPLOAD_MAX_FILE_SIZE_MB || 5),
    maxVideoFileSizeMb: Number(process.env.UPLOAD_MAX_VIDEO_FILE_SIZE_MB || 50),
    maxFiles: Number(process.env.UPLOAD_MAX_FILES || 10),
  },
  db: {
    connectionString: process.env.DATABASE_URL || "",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || "postgres",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    ssl: process.env.DB_SSL === "true" || Boolean(process.env.DATABASE_URL?.includes("sslmode=require")),
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
  groq: {
    enabled: process.env.GROQ_CHATBOT_ENABLED === "true",
    apiKey: process.env.GROQ_API_KEY || "",
    model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
  },
  notifications: {
    inquiryPhones: (process.env.INQUIRY_NOTIFICATION_PHONES || process.env.INQUIRY_NOTIFICATION_PHONE || "918897422872")
      .split(",")
      .map((phone) => phone.trim())
      .filter(Boolean),
    whatsapp: {
      enabled: process.env.WHATSAPP_NOTIFICATION_ENABLED === "true",
      apiVersion: process.env.WHATSAPP_API_VERSION || "v25.0",
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
    },
    telegram: {
      enabled: process.env.TELEGRAM_NOTIFICATION_ENABLED === "true",
      botToken: process.env.TELEGRAM_BOT_TOKEN || "",
      chatIds: splitCsv(process.env.TELEGRAM_CHAT_IDS || process.env.TELEGRAM_CHAT_ID),
    },
    email: {
      enabled: process.env.EMAIL_NOTIFICATION_ENABLED === "true",
      to: process.env.INQUIRY_NOTIFICATION_EMAIL || "akulaakash17@gmail.com",
      from: process.env.EMAIL_FROM || process.env.SMTP_USER || "",
      host: process.env.SMTP_HOST || "",
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      user: process.env.SMTP_USER || "",
      password: process.env.SMTP_PASSWORD || "",
    },
  },
};
