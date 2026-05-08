import { spawn } from "node:child_process";
import { env } from "../config/env.js";

const backupPath = process.argv[2];

if (!backupPath) {
  console.error("Usage: npm --prefix backend run db:restore -- /path/to/backup.dump");
  process.exit(1);
}

const pgRestore = spawn(
  "pg_restore",
  [
    "--clean",
    "--if-exists",
    "--no-owner",
    "--host",
    env.db.host,
    "--port",
    String(env.db.port),
    "--username",
    env.db.user,
    "--dbname",
    env.db.database,
    backupPath,
  ],
  {
    stdio: "inherit",
    env: { ...process.env, PGPASSWORD: env.db.password },
  }
);

pgRestore.on("exit", (code) => {
  if (code === 0) {
    console.log("Database restore completed.");
  } else {
    console.error(`Restore failed with code ${code}`);
    process.exitCode = code || 1;
  }
});
