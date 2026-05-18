import { query } from "../config/db.js";

const followUpColumns = `
  f.id, f.agent_id, f.property_id, f.inquiry_id, f.customer_name, f.phone, f.email,
  f.message, f.next_action, f.status, f.admin_note, f.created_at, f.updated_at,
  u.name AS agent_name, u.email AS agent_email,
  p.title AS property_title, p.slug AS property_slug,
  i.message AS inquiry_message
`;

export const FollowUpModel = {
  async create({ agent_id, property_id, inquiry_id, customer_name, phone, email, message, next_action }) {
    const result = await query(
      `INSERT INTO agent_followups (
        agent_id, property_id, inquiry_id, customer_name, phone, email, message, next_action
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, agent_id, property_id, inquiry_id, customer_name, phone, email, message,
        next_action, status, admin_note, created_at, updated_at`,
      [
        agent_id,
        property_id || null,
        inquiry_id || null,
        customer_name,
        phone || "",
        email || "",
        message,
        next_action || "",
      ]
    );

    return result.rows[0];
  },

  async list({ page = 1, limit = 20, q = "", status = "" } = {}, user) {
    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const offset = (currentPage - 1) * pageSize;
    const clauses = [];
    const values = [];

    if (user.role !== "admin") {
      values.push(user.id);
      clauses.push(`f.agent_id = $${values.length}`);
    }

    if (status) {
      values.push(status);
      clauses.push(`f.status = $${values.length}`);
    }

    if (q) {
      values.push(`%${q}%`);
      const index = `$${values.length}`;
      clauses.push(
        `(f.customer_name ILIKE ${index} OR f.phone ILIKE ${index} OR f.email ILIKE ${index} OR f.message ILIKE ${index} OR p.title ILIKE ${index})`
      );
    }

    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const countResult = await query(
      `SELECT COUNT(*)::int AS total
       FROM agent_followups f
       LEFT JOIN properties p ON p.id = f.property_id
       ${where}`,
      values
    );
    const result = await query(
      `SELECT ${followUpColumns}
       FROM agent_followups f
       LEFT JOIN users u ON u.id = f.agent_id
       LEFT JOIN properties p ON p.id = f.property_id
       LEFT JOIN inquiries i ON i.id = f.inquiry_id
       ${where}
       ORDER BY f.created_at DESC
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

  async updateStatus(id, { status, admin_note }) {
    const result = await query(
      `UPDATE agent_followups
       SET status = $1, admin_note = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING id, agent_id, property_id, inquiry_id, customer_name, phone, email, message,
        next_action, status, admin_note, created_at, updated_at`,
      [status, admin_note || "", id]
    );

    return result.rows[0] || null;
  },

  async countPending(user) {
    const values = ["pending"];
    const clauses = [`status = $1`];

    if (user.role !== "admin") {
      values.push(user.id);
      clauses.push(`agent_id = $${values.length}`);
    }

    const result = await query(`SELECT COUNT(*)::int AS total FROM agent_followups WHERE ${clauses.join(" AND ")}`, values);
    return result.rows[0].total;
  },
};
