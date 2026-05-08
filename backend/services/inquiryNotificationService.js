import nodemailer from "nodemailer";
import twilio from "twilio";

import { env } from "../config/env.js";
import { NotificationLogModel } from "../models/notificationLogModel.js";

const REQUEST_TIMEOUT_MS = 8000;

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function normalizeE164Phone(phone) {
  const normalized = normalizePhone(phone);
  return normalized ? `+${normalized}` : "";
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
    `Name: ${inquiry.name || "Not provided"}`,
    `Phone: ${inquiry.phone || "Not provided"}`,
    `Property ID: ${inquiry.property_id || "General inquiry"}`,
    `Message: ${truncate(inquiry.message || "No message", 500)}`,
  ];

  return lines.join("\n");
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
  const { whatsapp, inquiryPhones } = env.notifications;
  const recipientPhones = inquiryPhones.map(normalizePhone).filter(Boolean);

  if (!whatsapp.enabled || !whatsapp.phoneNumberId || !whatsapp.accessToken || recipientPhones.length === 0) {
    return null;
  }

  const url = `https://graph.facebook.com/${whatsapp.apiVersion}/${whatsapp.phoneNumberId}/messages`;

  return Promise.all(
    recipientPhones.map((recipientPhone) =>
      postJson(
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
      )
    )
  );
}

async function sendSmsWebhookNotification(message) {
  const { sms, inquiryPhones } = env.notifications;
  const recipientPhones = inquiryPhones.map(normalizePhone).filter(Boolean);

  if (!sms.webhookUrl || recipientPhones.length === 0) {
    return null;
  }

  const headers = sms.apiKey ? { Authorization: `Bearer ${sms.apiKey}` } : {};

  return Promise.all(
    recipientPhones.map((recipientPhone) =>
      postJson(
        sms.webhookUrl,
        {
          to: recipientPhone,
          message,
        },
        headers
      )
    )
  );
}

async function sendTwilioSmsNotification(message) {
  const { twilioSms, inquiryPhones } = env.notifications;
  const recipients = inquiryPhones.map(normalizeE164Phone).filter(Boolean);
  const from = normalizeE164Phone(twilioSms.fromNumber);

  if (!twilioSms.enabled || !twilioSms.accountSid || !twilioSms.authToken || !from || recipients.length === 0) {
    return null;
  }

  const client = twilio(twilioSms.accountSid, twilioSms.authToken);

  const results = await Promise.allSettled(
    recipients.map((to) =>
      client.messages.create({
        body: message,
        from,
        to,
      })
    )
  );

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(`Twilio SMS notification failed for ${recipients[index]}:`, result.reason.message);
    }
  });

  return results;
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
  const { inquiryPhones, email } = env.notifications;
  const tasks = [
    {
      channel: "whatsapp",
      recipient: inquiryPhones.join(","),
      promise: sendWhatsAppNotification(message),
    },
    {
      channel: "sms_webhook",
      recipient: inquiryPhones.join(","),
      promise: sendSmsWebhookNotification(message),
    },
    {
      channel: "twilio_sms",
      recipient: inquiryPhones.join(","),
      promise: sendTwilioSmsNotification(message),
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
