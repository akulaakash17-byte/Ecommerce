import { generateChatbotReply } from "../services/groqChatbotService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createChatbotReply = asyncHandler(async (req, res) => {
  const result = await generateChatbotReply(req.body);
  res.json(result);
});
