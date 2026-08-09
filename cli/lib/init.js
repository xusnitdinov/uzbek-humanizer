import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_SKILL = path.resolve(__dirname, "../../skills/uzbek-humanizer");

const TARGETS = {
  cursor: {
    project: [".cursor/skills/uzbek-humanizer"],
    global: [path.join(os.homedir(), ".cursor/skills/uzbek-humanizer")],
  },
  claude: {
    project: [".claude/skills/uzbek-humanizer", ".agents/skills/uzbek-humanizer"],
    global: [
      path.join(os.homedir(), ".claude/skills/uzbek-humanizer"),
      path.join(os.homedir(), ".agents/skills/uzbek-humanizer"),
    ],
  },
  codex: {
    project: [".agents/skills/uzbek-humanizer"],
    global: [path.join(os.homedir(), ".agents/skills/uzbek-humanizer")],
  },
  copilot: {
    project: [".github/skills/uzbek-humanizer", ".agents/skills/uzbek-humanizer"],
    global: [path.join(os.homedir(), ".agents/skills/uzbek-humanizer")],
  },
};

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function resolveTargets(ai, globalInstall) {
  const keys = ai === "all" ? Object.keys(TARGETS) : [ai];
  const out = [];
  for (const key of keys) {
    const spec = TARGETS[key];
    if (!spec) throw new Error(`Unknown --ai value: ${key}`);
    const list = globalInstall ? spec.global : spec.project;
    for (const p of list) out.push({ ai: key, dest: p });
  }
  return out;
}

export async function init({ ai, globalInstall }) {
  if (!fs.existsSync(path.join(REPO_SKILL, "SKILL.md"))) {
    throw new Error(`Skill not found at ${REPO_SKILL}. Run from the cloned repo.`);
  }
  const targets = resolveTargets(ai, globalInstall);
  for (const t of targets) {
    const dest = path.isAbsolute(t.dest) ? t.dest : path.resolve(process.cwd(), t.dest);
    copyDir(REPO_SKILL, dest);
    console.log(`Installed uzbek-humanizer for ${t.ai} → ${dest}`);
  }
  console.log("\nDone. Open a new agent chat and ask for Uzbek copy help.");
}
