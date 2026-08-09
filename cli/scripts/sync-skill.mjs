#!/usr/bin/env node
/**
 * Sync skills/* → cli/skills/* so npm pack ships every skill
 * (uzbek-humanizer + uzbek-humanize slash companion, …).
 * Hard-fails if sources are missing.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.resolve(__dirname, "../../skills");
const destRoot = path.resolve(__dirname, "../skills");
const legacyDest = path.resolve(__dirname, "../skill");

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

function listSkillDirs(root) {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((name) => fs.existsSync(path.join(root, name, "SKILL.md")));
}

const names = listSkillDirs(srcRoot);
if (!names.includes("uzbek-humanizer")) {
  console.error(`Missing skills/uzbek-humanizer under ${srcRoot}`);
  process.exit(1);
}
if (!names.includes("uzbek-humanize")) {
  console.error(`Missing skills/uzbek-humanize (slash companion) under ${srcRoot}`);
  process.exit(1);
}

rmDir(destRoot);
rmDir(legacyDest);
fs.mkdirSync(destRoot, { recursive: true });

for (const name of names) {
  const from = path.join(srcRoot, name);
  const to = path.join(destRoot, name);
  copyDirSafe(from, to);
  console.log(`Synced ${name} → ${to}`);
}

// Backward-compatible flat copy of the main skill for older tooling
copyDirSafe(path.join(srcRoot, "uzbek-humanizer"), legacyDest);
console.log(`Synced legacy flat skill → ${legacyDest}`);
