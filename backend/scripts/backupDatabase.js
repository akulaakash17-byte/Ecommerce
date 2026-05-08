import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { env } from "../config/env.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backupDir = path.resolve(__dirname, "../backups");
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const outputPath = path.join(backupDir, `real-estate-${timestamp}.dump`);

fs.mkdirSync(backupDir, { recursive: true });

const pgDump = spawn(
  "pg_dump",
  [
    "--format=custom",
    "--no-owner",
    "--host",
    env.db.host,
    "--port",
    String(env.db.port),
    "--username",
    env.db.user,
    "--file",
    outputPath,
    env.db.database,
  ],
  {
    stdio: "inherit",
    env: { ...process.env, PGPASSWORD: env.db.password },
  }
);

pgDump.on("exit", (code) => {
  if (code === 0) {
    console.log(`Backup created: ${outputPath}`);
  } else {
    console.error(`Backup failed with code ${code}`);
    process.exitCode = code || 1;
  }
});
