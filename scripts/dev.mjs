import { spawn } from "node:child_process";

const commands = [
  {
    name: "api",
    command: "npm",
    args: ["--prefix", "backend", "start"],
  },
  {
    name: "ui",
    command: "npm",
    args: ["run", "dev:ui"],
  },
];

const children = commands.map(({ name, command, args }) => {
  const child = spawn(command, args, {
    stdio: ["inherit", "pipe", "pipe"],
    shell: process.platform === "win32",
  });

  child.stdout.on("data", (chunk) => {
    process.stdout.write(`[${name}] ${chunk}`);
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(`[${name}] ${chunk}`);
  });

  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`[${name}] exited with code ${code}`);
      shutdown(code);
    }
  });

  return child;
});

const shutdown = (code = 0) => {
  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }

  process.exit(code);
};

process.on("SIGINT", () => shutdown());
process.on("SIGTERM", () => shutdown());
