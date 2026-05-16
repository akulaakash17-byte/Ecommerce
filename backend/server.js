import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import followUpRoutes from "./routes/followUpRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const allowedOrigins = new Set(env.clientUrls);

if (env.isProduction) {
  app.set("trust proxy", 1);
}

app.disable("x-powered-by");
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    hsts: env.isProduction ? { maxAge: 15552000, includeSubDomains: true } : false,
  })
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin is not allowed."));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: env.maxJsonBodySize }));
app.use(express.urlencoded({ extended: true, limit: env.maxJsonBodySize }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 250,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(
  "/api/auth/login",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many login attempts. Please try again later." },
  })
);
app.use(
  "/api/chatbot",
  rateLimit({
    windowMs: 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many chatbot messages. Please wait a moment." },
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/follow-ups", followUpRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/properties", propertyRoutes);

app.get("/", (req, res) => {
  res.json({
    name: "Siddipet Real Estate API",
    status: "running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server running on http://127.0.0.1:${env.port}`);
});
