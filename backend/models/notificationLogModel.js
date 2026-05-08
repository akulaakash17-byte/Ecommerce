import { query } from "../config/db.js";

const notificationLogColumns = `
  n.id, n.inquiry_id, n.channel, n.recipient, n.status, n.provider_response,
  n.error_message, n.created_at,
  i.name AS inquiry_name, i.phone AS inquiry_phone
`;

export const NotificationLogModel = {
  async create({ inquiry_id, channel, recipient = "", status = "skipped", provider_response = "", error_message = "" }) {
    const result = await query(
      `INSERT INTO notification_logs (
        inquiry_id, channel, recipient, status, provider_response, error_message
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, inquiry_id, channel, recipient, status, provider_response, error_message, created_at`,
      [inquiry_id || null, channel, recipient, status, provider_response, error_message]
    );
    return result.rows[0];
  },

  async list({ page = 1, limit = 20, status = "", channel = "" } = {}) {
    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const offset = (currentPage - 1) * pageSize;
    const clauses = [];
    const values = [];

    if (status) {
      values.push(status);
      clauses.push(`n.status = $${values.length}`);
    }

    if (channel) {
      values.push(channel);
      clauses.push(`n.channel = $${values.length}`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const countResult = await query(`SELECT COUNT(*)::int AS total FROM notification_logs n ${where}`, values);
    const result = await query(
      `SELECT ${notificationLogColumns}
       FROM notification_logs n
       LEFT JOIN inquiries i ON i.id = n.inquiry_id
       ${where}
       ORDER BY n.created_at DESC
       LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
      [...values, pageSize, offset]
    );

    return {
      data: result.rows,
      meta: {
        page: currentPage,
        limit: pageSize,
        total: countResult.rows[0].total,
        totalPages: Math.ceil(countResult.rows[0].total / pageSize) || 1,
      },
    };
  },
};
