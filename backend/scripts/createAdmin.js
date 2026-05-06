import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";
import { env } from "../config/env.js";
import { UserModel } from "../models/userModel.js";

try {
  const existing = await UserModel.findByEmail(env.admin.email);

  if (existing) {
    console.log(`Admin already exists: ${env.admin.email}`);
  } else {
    const password = await bcrypt.hash(env.admin.password, 12);
    await UserModel.create({
      name: env.admin.name,
      phone: env.admin.phone,
      email: env.admin.email,
      password,
      role: "admin",
    });
    console.log(`Admin created: ${env.admin.email}`);
  }
} catch (error) {
  console.error("Admin seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
