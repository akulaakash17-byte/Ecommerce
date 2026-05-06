import { env } from "../config/env.js";

const REQUEST_TIMEOUT_MS = 8000;

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function truncate(text, maxLength) {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
}

function buildInquiryMessage(inquiry) {
  const lines = [
    "New property inquiry",
    `Name: ${inquiry.name || "Not provided"}`,
    `Phone: ${inquiry.phone || "Not provided"}`,
    `Property ID: ${inquiry.property_id || "General inquiry"}`,
    `Message: ${truncate(inquiry.message || "No message", 500)}`,
  ];

  return lines.join("\n");
}

async function postJson(url, body, headers = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const responseText = await response.text();
    let data = responseText;

    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch {
      // Some SMS providers return plain text responses.
    }

    if (!response.ok) {
      throw new Error(`Notification request failed with ${response.status}: ${responseText}`);
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
}

async function sendWhatsAppNotification(message) {
  const { whatsapp, inquiryPhone } = env.notifications;
  const recipientPhone = normalizePhone(inquiryPhone);

  if (!whatsapp.enabled || !whatsapp.phoneNumberId || !whatsapp.accessToken || !recipientPhone) {
    return null;
  }

  const url = `https://graph.facebook.com/${whatsapp.apiVersion}/${whatsapp.phoneNumberId}/messages`;

  return postJson(
    url,
    {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: recipientPhone,
      type: "text",
      text: {
        preview_url: false,
        body: message,
      },
    },
    {
      Authorization: `Bearer ${whatsapp.accessToken}`,
    }
  );
}

async function sendSmsWebhookNotification(message) {
  const { sms, inquiryPhone } = env.notifications;
  const recipientPhone = normalizePhone(inquiryPhone);

  if (!sms.webhookUrl || !recipientPhone) {
    return null;
  }

  const headers = sms.apiKey ? { Authorization: `Bearer ${sms.apiKey}` } : {};

  return postJson(
    sms.webhookUrl,
    {
      to: recipientPhone,
      message,
    },
    headers
  );
}

export async function notifyInquiryCreated(inquiry) {
  const message = buildInquiryMessage(inquiry);
  const tasks = [sendWhatsAppNotification(message), sendSmsWebhookNotification(message)];
  const results = await Promise.allSettled(tasks);

  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error("Inquiry notification failed:", result.reason.message);
    }
  });

  return results;
}
