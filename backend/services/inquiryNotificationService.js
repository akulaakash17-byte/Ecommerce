import nodemailer from "nodemailer";

import { env } from "../config/env.js";
import { NotificationLogModel } from "../models/notificationLogModel.js";

const REQUEST_TIMEOUT_MS = 8000;

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function truncate(text, maxLength) {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildInquiryMessage(inquiry) {
  const lines = [
    "New property inquiry",
    `Inquiry ID: ${inquiry.id || "Not available"}`,
    `Name: ${inquiry.name || "Not provided"}`,
    `Phone: ${inquiry.phone || "Not provided"}`,
    `Property ID: ${inquiry.property_id || "General inquiry"}`,
    `Message: ${truncate(inquiry.message || "No message", 500)}`,
  ];

  return lines.join("\n");
}

function getTemplateFieldValue(inquiry, field, message) {
  const normalizedField = String(field || "").trim().toLowerCase();
  const values = {
    inquiry_id: inquiry.id || "",
    name: inquiry.name || "Not provided",
    phone: inquiry.phone || "Not provided",
    property_id: inquiry.property_id || "General inquiry",
    message: inquiry.message || "No message",
    full_message: message,
  };

  return truncate(String(values[normalizedField] ?? ""), 900);
}

function buildWhatsAppTemplatePayload(inquiry, message, whatsapp) {
  const template = {
    name: whatsapp.templateName,
    language: {
      code: whatsapp.templateLanguage,
    },
  };

  if (whatsapp.templateFields.length) {
    template.components = [
      {
        type: "body",
        parameters: whatsapp.templateFields.map((field) => ({
          type: "text",
          text: getTemplateFieldValue(inquiry, field, message),
        })),
      },
    ];
  }

  return {
    messaging_product: "whatsapp",
    type: "template",
    template,
  };
}

function buildInquiryEmailHtml(inquiry) {
  const rows = [
    ["Name", inquiry.name || "Not provided"],
    ["Phone", inquiry.phone || "Not provided"],
    ["Property ID", inquiry.property_id || "General inquiry"],
    ["Message", inquiry.message || "No message"],
  ];

  return `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.5;">
      <h2 style="margin: 0 0 16px;">New property inquiry</h2>
      <table cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 640px;">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <td style="border: 1px solid #e2e8f0; font-weight: 700; width: 140px;">${label}</td>
                <td style="border: 1px solid #e2e8f0;">${escapeHtml(value).replace(/\n/g, "<br>")}</td>
              </tr>
            `
          )
          .join("")}
      </table>
    </div>
  `;
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
      // Some notification providers return plain text responses.
    }

    if (!response.ok) {
      throw new Error(`Notification request failed with ${response.status}: ${responseText}`);
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
}

async function sendWhatsAppNotification(inquiry, message) {
  const { whatsapp } = env.notifications;
  const recipientPhones = whatsapp.recipientPhones.map(normalizePhone).filter(Boolean);

  if (!whatsapp.enabled || !whatsapp.phoneNumberId || !whatsapp.accessToken || recipientPhones.length === 0) {
    return null;
  }

  if (whatsapp.messageType === "template" && !whatsapp.templateName) {
    throw new Error("WHATSAPP_TEMPLATE_NAME is required when WHATSAPP_MESSAGE_TYPE=template.");
  }

  const url = `https://graph.facebook.com/${whatsapp.apiVersion}/${whatsapp.phoneNumberId}/messages`;
  const basePayload =
    whatsapp.messageType === "template"
      ? buildWhatsAppTemplatePayload(inquiry, message, whatsapp)
      : {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          type: "text",
          text: {
            preview_url: false,
            body: message,
          },
        };

  return Promise.all(
    recipientPhones.map((recipientPhone) =>
      postJson(
        url,
        {
          to: recipientPhone,
          ...basePayload,
        },
        {
          Authorization: `Bearer ${whatsapp.accessToken}`,
        }
      )
    )
  );
}

async function sendTelegramNotification(message) {
  const { telegram } = env.notifications;

  if (!telegram.enabled || !telegram.botToken || telegram.chatIds.length === 0) {
    return null;
  }

  const url = `https://api.telegram.org/bot${telegram.botToken}/sendMessage`;

  return Promise.all(
    telegram.chatIds.map((chatId) =>
      postJson(url, {
        chat_id: chatId,
        text: message,
        disable_web_page_preview: true,
      })
    )
  );
}

async function sendEmailNotification(inquiry, message) {
  const { email } = env.notifications;

  if (!email.enabled || !email.to || !email.host || !email.user || !email.password) {
    return null;
  }

  const transporter = nodemailer.createTransport({
    host: email.host,
    port: email.port,
    secure: email.secure,
    auth: {
      user: email.user,
      pass: email.password,
    },
  });

  return transporter.sendMail({
    from: email.from || email.user,
    to: email.to,
    subject: `New property inquiry from ${inquiry.name || "website"}`,
    text: message,
    html: buildInquiryEmailHtml(inquiry),
  });
}

function stringifyProviderResponse(value) {
  if (!value) return "";

  try {
    return JSON.stringify(value).slice(0, 2000);
  } catch {
    return String(value).slice(0, 2000);
  }
}

async function recordNotification({ inquiryId, channel, recipient = "", result }) {
  const status =
    result.status === "fulfilled" && result.value !== null
      ? "sent"
      : result.status === "fulfilled"
        ? "skipped"
        : "failed";

  await NotificationLogModel.create({
    inquiry_id: inquiryId,
    channel,
    recipient,
    status,
    provider_response: status === "sent" ? stringifyProviderResponse(result.value) : "",
    error_message: result.status === "rejected" ? result.reason.message : "",
  }).catch((error) => {
    console.error("Notification log write failed:", error.message);
  });
}

export async function notifyInquiryCreated(inquiry) {
  const message = buildInquiryMessage(inquiry);
  const { telegram, email } = env.notifications;
  const whatsappRecipients = env.notifications.whatsapp.recipientPhones;
  const tasks = [
    {
      channel: "whatsapp",
      recipient: whatsappRecipients.join(","),
      promise: sendWhatsAppNotification(inquiry, message),
    },
    {
      channel: "telegram",
      recipient: telegram.chatIds.join(","),
      promise: sendTelegramNotification(message),
    },
    {
      channel: "email",
      recipient: email.to,
      promise: sendEmailNotification(inquiry, message),
    },
  ];
  const results = await Promise.allSettled(tasks.map((task) => task.promise));

  await Promise.all(
    results.map((result, index) =>
      recordNotification({
        inquiryId: inquiry.id,
        channel: tasks[index].channel,
        recipient: tasks[index].recipient,
        result,
      })
    )
  );

  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error("Inquiry notification failed:", result.reason.message);
    }
  });

  return results;
}
