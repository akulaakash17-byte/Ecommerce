import express from "express";
import { createChatbotReply } from "../controllers/chatbotController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { chatbotRules } from "../middleware/validators.js";

const router = express.Router();

router.post("/", chatbotRules, validateRequest, createChatbotReply);

export default router;
