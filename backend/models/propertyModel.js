import { query } from "../config/db.js";

const propertyColumns = `
  id, slug, title, description, price, district, mandal, village, property_type,
  land_area, images, owner_name, phone, is_verified, status, created_by, created_at, updated_at
`;

function buildFilters(filters = {}) {
  const clauses = [];
  const values = [];

  const add = (sql, value) => {
    values.push(value);
    clauses.push(sql.replace("?", `$${values.length}`));
  };

  if (filters.q) {
    values.push(`%${filters.q}%`);
    const index = `$${values.length}`;
    clauses.push(
      `(title ILIKE ${index} OR description ILIKE ${index} OR mandal ILIKE ${index} OR village ILIKE ${index})`
    );
  }

  if (filters.mandal) add("mandal = ?", filters.mandal);
  if (filters.village) add("village = ?", filters.village);
  if (filters.property_type) add("property_type = ?", filters.property_type);
  if (filters.status) add("status = ?", filters.status);
  if (filters.minPrice) add("price >= ?", Number(filters.minPrice));
  if (filters.maxPrice) add("price <= ?", Number(filters.maxPrice));

  return {
    where: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "",
    values,
  };
}

export const PropertyModel = {
  async list(filters = {}) {
    const page = Math.max(Number(filters.page) || 1, 1);
    const limit = Math.min(Math.max(Number(filters.limit) || 12, 1), 48);
    const offset = (page - 1) * limit;
    const { where, values } = buildFilters(filters);

    const countResult = await query(`SELECT COUNT(*)::int AS total FROM properties ${where}`, values);
    const result = await query(
      `SELECT ${propertyColumns}
       FROM properties
       ${where}
       ORDER BY is_verified DESC, created_at DESC
       LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
      [...values, limit, offset]
    );

    return {
      data: result.rows,
      meta: {
        page,
        limit,
        total: countResult.rows[0].total,
        totalPages: Math.ceil(countResult.rows[0].total / limit) || 1,
      },
    };
  },

  async findById(id) {
    const result = await query(`SELECT ${propertyColumns} FROM properties WHERE id = $1`, [id]);
    return result.rows[0] || null;
  },

  async findByIdOrSlug(idOrSlug) {
    const isId = /^\d+$/.test(String(idOrSlug));
    const result = await query(
      `SELECT ${propertyColumns} FROM properties WHERE ${isId ? "id" : "slug"} = $1`,
      [idOrSlug]
    );
    return result.rows[0] || null;
  },

  async slugExists(slug, ignoredId = null) {
    const result = await query(
      "SELECT id FROM properties WHERE slug = $1 AND ($2::int IS NULL OR id != $2)",
      [slug, ignoredId]
    );
    return Boolean(result.rows[0]);
  },

  async create(property) {
    const result = await query(
      `INSERT INTO properties (
        slug, title, description, price, district, mandal, village, property_type,
        land_area, images, owner_name, phone, is_verified, status, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11, $12, $13, $14, $15)
      RETURNING ${propertyColumns}`,
      [
        property.slug,
        property.title,
        property.description,
        property.price,
        property.district || "Siddipet",
        property.mandal,
        property.village,
        property.property_type,
        property.land_area || "",
        JSON.stringify(property.images || []),
        property.owner_name || "",
        property.phone,
        property.is_verified || false,
        property.status || "available",
        property.created_by || null,
      ]
    );
    return result.rows[0];
  },

  async update(id, property) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(property)) {
      if (value === undefined) continue;
      values.push(key === "images" ? JSON.stringify(value) : value);
      fields.push(`${key} = $${values.length}${key === "images" ? "::jsonb" : ""}`);
    }

    if (!fields.length) {
      return this.findById(id);
    }

    values.push(id);
    const result = await query(
      `UPDATE properties
       SET ${fields.join(", ")}, updated_at = NOW()
       WHERE id = $${values.length}
       RETURNING ${propertyColumns}`,
      values
    );

    return result.rows[0] || null;
  },

  async remove(id) {
    const result = await query(`DELETE FROM properties WHERE id = $1 RETURNING ${propertyColumns}`, [id]);
    return result.rows[0] || null;
  },

  async stats() {
    const result = await query(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'available')::int AS available,
        COUNT(*) FILTER (WHERE status = 'sold')::int AS sold,
        COUNT(*) FILTER (WHERE is_verified = true)::int AS verified
      FROM properties
    `);
    return result.rows[0];
  },
};
