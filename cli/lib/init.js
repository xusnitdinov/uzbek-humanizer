import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Bundled with the npm package (preferred). */
const BUNDLED_SKILL = path.resolve(__dirname, "../skill");
/** Monorepo checkout fallback. */
const REPO_SKILL = path.resolve(__dirname, "../../skills/uzbek-humanizer");

function resolveSkillRoot() {
  if (fs.existsSync(path.join(BUNDLED_SKILL, "SKILL.md"))) return BUNDLED_SKILL;
  if (fs.existsSync(path.join(REPO_SKILL, "SKILL.md"))) return REPO_SKILL;
  throw new Error(
    "Skill payload not found. Reinstall uzbek-humanizer-cli or clone the repo and run from source."
  );
}

const HOME = os.homedir();

/**
 * Install destinations for Agent Skills-compatible tools.
 * Project paths are relative to cwd; global paths are absolute under home.
 */
const TARGETS = {
  cursor: {
    project: [".cursor/skills/uzbek-humanizer"],
    global: [path.join(HOME, ".cursor/skills/uzbek-humanizer")],
  },
  claude: {
    project: [".claude/skills/uzbek-humanizer", ".agents/skills/uzbek-humanizer"],
    global: [
      path.join(HOME, ".claude/skills/uzbek-humanizer"),
      path.join(HOME, ".agents/skills/uzbek-humanizer"),
    ],
  },
  codex: {
    project: [".agents/skills/uzbek-humanizer"],
    global: [path.join(HOME, ".agents/skills/uzbek-humanizer")],
  },
  copilot: {
    project: [".github/skills/uzbek-humanizer", ".agents/skills/uzbek-humanizer"],
    global: [path.join(HOME, ".agents/skills/uzbek-humanizer")],
  },
  windsurf: {
    project: [".windsurf/skills/uzbek-humanizer", ".agents/skills/uzbek-humanizer"],
    global: [
      path.join(HOME, ".codeium/windsurf/skills/uzbek-humanizer"),
      path.join(HOME, ".agents/skills/uzbek-humanizer"),
    ],
  },
  cline: {
    project: [".cline/skills/uzbek-humanizer", ".agents/skills/uzbek-humanizer"],
    global: [
      path.join(HOME, ".cline/skills/uzbek-humanizer"),
      path.join(HOME, ".agents/skills/uzbek-humanizer"),
    ],
  },
  roo: {
    project: [".roo/skills/uzbek-humanizer", ".agents/skills/uzbek-humanizer"],
    global: [
      path.join(HOME, ".roo/skills/uzbek-humanizer"),
      path.join(HOME, ".agents/skills/uzbek-humanizer"),
    ],
  },
  amp: {
    project: [".agents/skills/uzbek-humanizer"],
    global: [path.join(HOME, ".agents/skills/uzbek-humanizer")],
  },
  goose: {
    project: [".goose/skills/uzbek-humanizer", ".agents/skills/uzbek-humanizer"],
    global: [
      path.join(HOME, ".goose/skills/uzbek-humanizer"),
      path.join(HOME, ".agents/skills/uzbek-humanizer"),
    ],
  },
  trae: {
    project: [".trae/skills/uzbek-humanizer", ".agents/skills/uzbek-humanizer"],
    global: [
      path.join(HOME, ".trae/skills/uzbek-humanizer"),
      path.join(HOME, ".agents/skills/uzbek-humanizer"),
    ],
  },
  kilo: {
    project: [".kilocode/skills/uzbek-humanizer", ".agents/skills/uzbek-humanizer"],
    global: [
      path.join(HOME, ".kilocode/skills/uzbek-humanizer"),
      path.join(HOME, ".agents/skills/uzbek-humanizer"),
    ],
  },
  opencode: {
    project: [".opencode/skills/uzbek-humanizer", ".agents/skills/uzbek-humanizer"],
    global: [
      path.join(HOME, ".opencode/skills/uzbek-humanizer"),
      path.join(HOME, ".agents/skills/uzbek-humanizer"),
    ],
  },
  continue: {
    project: [".continue/skills/uzbek-humanizer", ".agents/skills/uzbek-humanizer"],
    global: [
      path.join(HOME, ".continue/skills/uzbek-humanizer"),
      path.join(HOME, ".agents/skills/uzbek-humanizer"),
    ],
  },
  agents: {
    project: [".agents/skills/uzbek-humanizer"],
    global: [path.join(HOME, ".agents/skills/uzbek-humanizer")],
  },
};

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function resolveTargets(ai, globalInstall) {
  const keys = ai === "all" ? Object.keys(TARGETS) : [ai];
  const out = [];
  const seen = new Set();
  for (const key of keys) {
    const spec = TARGETS[key];
    if (!spec) {
      throw new Error(
        `Unknown --ai value: ${key}. Use: ${["all", ...Object.keys(TARGETS)].join(", ")}`
      );
    }
    const list = globalInstall ? spec.global : spec.project;
    for (const p of list) {
      if (seen.has(p)) continue;
      seen.add(p);
      out.push({ ai: key, dest: p });
    }
  }
  return out;
}

export async function init({ ai, globalInstall }) {
  const skillRoot = resolveSkillRoot();
  const targets = resolveTargets(ai, globalInstall);
  for (const t of targets) {
    const dest = path.isAbsolute(t.dest) ? t.dest : path.resolve(process.cwd(), t.dest);
    copyDir(skillRoot, dest);
    console.log(`Installed uzbek-humanizer for ${t.ai} → ${dest}`);
  }
  console.log(`\nSkill source: ${skillRoot}`);
  console.log("Done. Open a new agent chat and ask for Uzbek copy help.");
}

export { TARGETS, resolveSkillRoot };
