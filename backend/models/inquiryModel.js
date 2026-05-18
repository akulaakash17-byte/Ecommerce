import { query } from "../config/db.js";

export const InquiryModel = {
  async create({ property_id, name, phone, message }) {
    const result = await query(
      `INSERT INTO inquiries (property_id, name, phone, message, status)
       VALUES ($1, $2, $3, $4, 'new')
       RETURNING id, property_id, name, phone, message, status, status_note, created_at, updated_at`,
      [property_id || null, name, phone, message]
    );
    return result.rows[0];
  },

  async list({ page = 1, limit = 20, q = "", status = "" } = {}) {
    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const offset = (currentPage - 1) * pageSize;
    const clauses = [];
    const params = [];

    if (q) {
      params.push(`%${q}%`);
      const index = `$${params.length}`;
      clauses.push(`(i.name ILIKE ${index} OR i.phone ILIKE ${index} OR p.title ILIKE ${index})`);
    }

    if (status) {
      params.push(status);
      clauses.push(`i.status = $${params.length}`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

    const countResult = await query(
      `SELECT COUNT(*)::int AS total FROM inquiries i LEFT JOIN properties p ON p.id = i.property_id ${where}`,
      params
    );
    const result = await query(
      `SELECT i.id, i.property_id, i.name, i.phone, i.message, i.status, i.status_note, i.created_at, i.updated_at,
        p.title AS property_title, p.slug AS property_slug
       FROM inquiries i
       LEFT JOIN properties p ON p.id = i.property_id
       ${where}
       ORDER BY i.created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, pageSize, offset]
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

  async count() {
    const result = await query("SELECT COUNT(*)::int AS total FROM inquiries");
    return result.rows[0].total;
  },

  async updateStatus(id, { status, status_note }) {
    const result = await query(
      `UPDATE inquiries
       SET status = $1, status_note = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING id, property_id, name, phone, message, status, status_note, created_at, updated_at`,
      [status, status_note || "", id]
    );
    return result.rows[0] || null;
  },

  async remove(id) {
    const result = await query(
      `DELETE FROM inquiries
       WHERE id = $1
       RETURNING id, property_id, name, phone, message, status, status_note, created_at, updated_at`,
      [id]
    );
    return result.rows[0] || null;
  },
};
