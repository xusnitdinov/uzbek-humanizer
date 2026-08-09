#!/usr/bin/env node
/**
 * Copy skills/uzbek-humanizer → cli/skill so npm pack/publish ships the skill.
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

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const a = path.join(from, entry.name);
    const b = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(a, b);
    else fs.copyFileSync(a, b);
  }
}

if (!fs.existsSync(path.join(src, "SKILL.md"))) {
  if (fs.existsSync(path.join(dest, "SKILL.md"))) {
    console.log(`Skill already bundled at ${dest} (skip sync)`);
    process.exit(0);
  }
  console.error(`Missing skill at ${src}`);
  process.exit(1);
}

rmDir(dest);
copyDir(src, dest);
console.log(`Synced skill → ${dest}`);
