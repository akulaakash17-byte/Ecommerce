import { query } from "../config/db.js";

const userColumns = "id, name, phone, email, role, created_at";

export const UserModel = {
  async findByEmail(email) {
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0] || null;
  },

  async findById(id) {
    const result = await query(`SELECT ${userColumns} FROM users WHERE id = $1`, [id]);
    return result.rows[0] || null;
  },

  async create({ name, phone, email, password, role = "agent" }) {
    const result = await query(
      `INSERT INTO users (name, username, phone, email, password, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING ${userColumns}`,
      [name, email, phone, email, password, role]
    );
    return result.rows[0];
  },

  async list() {
    const result = await query(`SELECT ${userColumns} FROM users ORDER BY created_at DESC`);
    return result.rows;
  },
};
