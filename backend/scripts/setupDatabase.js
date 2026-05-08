import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool, query, testConnection } from "../config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(__dirname, "../schema.sql");
const migrationsDir = path.resolve(__dirname, "../migrations");

async function runMigrations() {
  await query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(220) NOT NULL UNIQUE,
      run_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const migrationFiles = (await fs.readdir(migrationsDir).catch(() => []))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of migrationFiles) {
    const exists = await query("SELECT 1 FROM schema_migrations WHERE name = $1", [file]);

    if (exists.rows[0]) {
      continue;
    }

    const sql = await fs.readFile(path.join(migrationsDir, file), "utf8");
    await query("BEGIN");
    try {
      await query(sql);
      await query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
      await query("COMMIT");
      console.log(`Migration applied: ${file}`);
    } catch (error) {
      await query("ROLLBACK");
      throw error;
    }
  }
}

try {
  const connection = await testConnection();
  const schema = await fs.readFile(schemaPath, "utf8");
  await query(schema);
  await runMigrations();
  console.log(`Database connected at ${connection.now.toISOString()}`);
  console.log("Schema is ready.");
} catch (error) {
  console.error("Database setup failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
