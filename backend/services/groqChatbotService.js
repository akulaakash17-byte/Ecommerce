import { env } from "../config/env.js";
import { getLocalChatbotReply } from "./chatbotKnowledgeBase.js";

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 10000;

const systemPrompt = `
You are Siddipet Assistant for Siddipet Real Estate, a real estate discovery website for Siddipet district, Telangana.
Help buyers with listings, mandals, villages, property types, site visits, office contact, and inquiry form guidance.
Keep replies concise, practical, and friendly.
Do not claim online payments, legal verification, final negotiation, or document registration happen on the website.
Make clear that site visits, owner details, documentation, price discussion, and final deals happen offline through the Pragnapur office team.
Office phone numbers: +91 9849972116, +91 9704061427, +91 8897422872.
Office location: Pragnapur, Gajwel Mandal, Siddipet District, Telangana.
`.trim();

function normalizeHistory(history = []) {
  return history
    .filter((message) => ["user", "assistant"].includes(message.role) && message.text)
    .slice(-8)
    .map((message) => ({
      role: message.role,
      content: String(message.text).slice(0, 500),
    }));
}

async function postGroq(body) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(GROQ_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.groq.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message = data?.error?.message || `Groq request failed with status ${response.status}.`;
      throw new Error(message);
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
}

async function generateGroqReply({ message, history }) {
  const data = await postGroq({
    model: env.groq.model,
    temperature: 0.3,
    max_tokens: 220,
    messages: [
      { role: "system", content: systemPrompt },
      ...normalizeHistory(history),
      { role: "user", content: message },
    ],
  });

  return data?.choices?.[0]?.message?.content?.trim() || "";
}

function toPublicReply(result) {
  return {
    reply: result.reply,
    actionLabel: result.actionLabel,
    actionTo: result.actionTo,
    source: result.source,
    warning: result.warning,
  };
}

export async function generateChatbotReply({ message, history = [] }) {
  const localReply = getLocalChatbotReply(message);

  if (localReply.matched) {
    return toPublicReply(localReply);
  }

  if (!env.groq.enabled || !env.groq.apiKey) {
    return toPublicReply(localReply);
  }

  try {
    const reply = await generateGroqReply({ message, history });

    if (!reply) {
      return toPublicReply(localReply);
    }

    return toPublicReply({
      reply,
      actionLabel: localReply.actionLabel,
      actionTo: localReply.actionTo,
      source: "groq",
    });
  } catch (error) {
    console.error(`Groq chatbot failed: ${error.message}`);
    return toPublicReply({
      ...localReply,
      warning: "AI provider unavailable; returned local answer.",
    });
  }
}
