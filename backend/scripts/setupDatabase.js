import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool, query, testConnection } from "../config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(__dirname, "../schema.sql");

try {
  const connection = await testConnection();
  const schema = await fs.readFile(schemaPath, "utf8");
  await query(schema);
  console.log(`Database connected at ${connection.now.toISOString()}`);
  console.log("Schema is ready.");
} catch (error) {
  console.error("Database setup failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
