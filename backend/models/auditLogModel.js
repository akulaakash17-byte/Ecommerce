import { query } from "../config/db.js";

const auditLogColumns = `
  a.id, a.actor_id, a.action, a.entity_type, a.entity_id, a.entity_label,
  a.metadata, a.created_at,
  u.name AS actor_name, u.email AS actor_email
`;

export const AuditLogModel = {
  async create({ actor_id = null, action, entity_type, entity_id = null, entity_label = "", metadata = {} }) {
    const result = await query(
      `INSERT INTO audit_logs (
        actor_id, action, entity_type, entity_id, entity_label, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6::jsonb)
      RETURNING id, actor_id, action, entity_type, entity_id, entity_label, metadata, created_at`,
      [actor_id, action, entity_type, entity_id, entity_label, JSON.stringify(metadata || {})]
    );
    return result.rows[0];
  },

  async list({ page = 1, limit = 20, action = "", entity_type = "", actor_id = "" } = {}) {
    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const offset = (currentPage - 1) * pageSize;
    const clauses = [];
    const values = [];

    if (action) {
      values.push(action);
      clauses.push(`a.action = $${values.length}`);
    }

    if (entity_type) {
      values.push(entity_type);
      clauses.push(`a.entity_type = $${values.length}`);
    }

    if (actor_id) {
      values.push(Number(actor_id));
      clauses.push(`a.actor_id = $${values.length}`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const countResult = await query(`SELECT COUNT(*)::int AS total FROM audit_logs a ${where}`, values);
    const result = await query(
      `SELECT ${auditLogColumns}
       FROM audit_logs a
       LEFT JOIN users u ON u.id = a.actor_id
       ${where}
       ORDER BY a.created_at DESC
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
