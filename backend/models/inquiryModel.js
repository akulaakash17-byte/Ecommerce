import { query } from "../config/db.js";

export const InquiryModel = {
  async create({ property_id, name, phone, message }) {
    const result = await query(
      `INSERT INTO inquiries (property_id, name, phone, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id, property_id, name, phone, message, created_at`,
      [property_id || null, name, phone, message]
    );
    return result.rows[0];
  },

  async list({ page = 1, limit = 20, q = "" } = {}) {
    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const offset = (currentPage - 1) * pageSize;
    const search = q ? `%${q}%` : null;
    const where = search ? "WHERE i.name ILIKE $1 OR i.phone ILIKE $1 OR p.title ILIKE $1" : "";
    const params = search ? [search] : [];

    const countResult = await query(
      `SELECT COUNT(*)::int AS total FROM inquiries i LEFT JOIN properties p ON p.id = i.property_id ${where}`,
      params
    );
    const result = await query(
      `SELECT i.id, i.property_id, i.name, i.phone, i.message, i.created_at,
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
};
