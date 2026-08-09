#!/usr/bin/env node
/**
 * Copy skills/uzbek-humanizer → cli/skill so npm pack/publish ships the skill.
 * Hard-fails if source is missing (never silently ships a stale bundle).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(__dirname, "../../skills/uzbek-humanizer");
const dest = path.resolve(__dirname, "../skill");

function rmDir(dir) {
  if (!fs.existsSync(dir)) return;
  fs.rmSync(dir, { recursive: true, force: true });
}

function copyDirSafe(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    if (entry.name.startsWith("_audit-probe")) continue;
    const a = path.join(from, entry.name);
    const b = path.join(to, entry.name);
    if (entry.isSymbolicLink()) {
      console.error(`Refusing to pack symlink in skill tree: ${a}`);
      process.exit(1);
    }
    if (entry.isDirectory()) copyDirSafe(a, b);
    else if (entry.isFile()) fs.copyFileSync(a, b);
  }
}

if (!fs.existsSync(path.join(src, "SKILL.md"))) {
  console.error(`Missing skill source at ${src}`);
  console.error("Publish/pack must run from the monorepo checkout (skills/uzbek-humanizer present).");
  process.exit(1);
}

rmDir(dest);
copyDirSafe(src, dest);

if (!fs.existsSync(path.join(dest, "SKILL.md"))) {
  console.error("Sync produced no SKILL.md - abort");
  process.exit(1);
}

console.log(`Synced skill → ${dest}`);
