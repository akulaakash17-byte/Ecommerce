import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

const poolConfig = {
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password,
  max: 10,
  idleTimeoutMillis: 30000,
};

if (env.db.connectionString) {
  poolConfig.connectionString = env.db.connectionString;
}

if (env.db.ssl) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

export const pool = new Pool(poolConfig);

export const query = (text, params) => pool.query(text, params);

export async function testConnection() {
  const result = await query("SELECT NOW() AS now");
  return result.rows[0];
}
