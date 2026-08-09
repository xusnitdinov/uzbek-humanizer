import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Bundled with the npm package. */
const BUNDLED_SKILL = path.resolve(__dirname, "../skill");
/** Monorepo checkout - preferred when present so local edits win. */
const REPO_SKILL = path.resolve(__dirname, "../../skills/uzbek-humanizer");

function resolveSkillRoot() {
  if (fs.existsSync(path.join(REPO_SKILL, "SKILL.md"))) return REPO_SKILL;
  if (fs.existsSync(path.join(BUNDLED_SKILL, "SKILL.md"))) return BUNDLED_SKILL;
  throw new Error(
    "Skill payload not found. Reinstall uzbek-humanizer-cli or clone the repo and run from source."
  );
}

const HOME = os.homedir();

function configHome() {
  if (process.env.XDG_CONFIG_HOME) return process.env.XDG_CONFIG_HOME;
  if (process.platform === "win32") {
    return process.env.APPDATA || path.join(HOME, "AppData", "Roaming");
  }
  return path.join(HOME, ".config");
}

const XDG = configHome();
const CODEX_HOME = process.env.CODEX_HOME || path.join(HOME, ".codex");
const CLAUDE_HOME = process.env.CLAUDE_CONFIG_DIR || path.join(HOME, ".claude");

/**
 * Install destinations aligned with vercel-labs/skills agents.ts conventions.
 */
const TARGETS = {
  cursor: {
    project: [".cursor/skills/uzbek-humanizer", ".agents/skills/uzbek-humanizer"],
    global: [path.join(HOME, ".cursor/skills/uzbek-humanizer")],
  },
  claude: {
    project: [".claude/skills/uzbek-humanizer", ".agents/skills/uzbek-humanizer"],
    global: [path.join(CLAUDE_HOME, "skills/uzbek-humanizer")],
  },
  codex: {
    project: [".agents/skills/uzbek-humanizer"],
    global: [path.join(CODEX_HOME, "skills/uzbek-humanizer")],
  },
  copilot: {
    project: [".agents/skills/uzbek-humanizer"],
    global: [path.join(HOME, ".copilot/skills/uzbek-humanizer")],
  },
  windsurf: {
    project: [".windsurf/skills/uzbek-humanizer", ".agents/skills/uzbek-humanizer"],
    global: [path.join(HOME, ".codeium/windsurf/skills/uzbek-humanizer")],
  },
  cline: {
    project: [".agents/skills/uzbek-humanizer"],
    global: [path.join(HOME, ".agents/skills/uzbek-humanizer")],
  },
  roo: {
    project: [".roo/skills/uzbek-humanizer", ".agents/skills/uzbek-humanizer"],
    global: [path.join(HOME, ".roo/skills/uzbek-humanizer")],
  },
  amp: {
    project: [".agents/skills/uzbek-humanizer"],
    global: [path.join(XDG, "agents/skills/uzbek-humanizer")],
  },
  goose: {
    project: [".goose/skills/uzbek-humanizer", ".agents/skills/uzbek-humanizer"],
    global: [path.join(XDG, "goose/skills/uzbek-humanizer")],
  },
  trae: {
    project: [".trae/skills/uzbek-humanizer", ".agents/skills/uzbek-humanizer"],
    global: [path.join(HOME, ".trae/skills/uzbek-humanizer")],
  },
  kilo: {
    project: [".kilocode/skills/uzbek-humanizer", ".agents/skills/uzbek-humanizer"],
    global: [path.join(HOME, ".kilocode/skills/uzbek-humanizer")],
  },
  opencode: {
    project: [".agents/skills/uzbek-humanizer"],
    global: [path.join(XDG, "opencode/skills/uzbek-humanizer")],
  },
  continue: {
    project: [".continue/skills/uzbek-humanizer", ".agents/skills/uzbek-humanizer"],
    global: [path.join(HOME, ".continue/skills/uzbek-humanizer")],
  },
  "gemini-cli": {
    project: [".agents/skills/uzbek-humanizer"],
    global: [path.join(HOME, ".gemini/skills/uzbek-humanizer")],
  },
  antigravity: {
    project: [".agents/skills/uzbek-humanizer"],
    global: [path.join(HOME, ".gemini/antigravity/skills/uzbek-humanizer")],
  },
  agents: {
    project: [".agents/skills/uzbek-humanizer"],
    global: [path.join(XDG, "agents/skills/uzbek-humanizer")],
  },
};

function isSymlink(p) {
  try {
    return fs.lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
}

/** Copy tree without following symlinks. Skip symlink entries. */
function copyDirSafe(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    if (entry.name.startsWith("_audit-probe")) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isSymbolicLink()) {
      console.warn(`Skipping symlink in skill payload: ${from}`);
      continue;
    }
    if (entry.isDirectory()) copyDirSafe(from, to);
    else if (entry.isFile()) fs.copyFileSync(from, to);
  }
}

function rmDir(dir) {
  if (!fs.existsSync(dir)) return;
  fs.rmSync(dir, { recursive: true, force: true });
}

function assertContained(root, target) {
  const rootReal = fs.realpathSync(root);
  let check = target;
  // Walk up until an existing ancestor, then realpath
  while (!fs.existsSync(check)) {
    const parent = path.dirname(check);
    if (parent === check) break;
    check = parent;
  }
  const real = fs.existsSync(check) ? fs.realpathSync(check) : path.resolve(check);
  const rel = path.relative(rootReal, real);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error(
      `Refusing install outside project root.\n  root: ${rootReal}\n  dest: ${target}\n(Is a parent dir a symlink to somewhere else?)`
    );
  }
}

function resolveTargets(ai, globalInstall) {
  const keys =
    ai === "all"
      ? Object.keys(TARGETS).filter((k) => k !== "agents") // agents paths covered by others
      : [ai];
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

function prepareDest(dest, { globalInstall }) {
  if (!globalInstall) {
    const cwd = process.cwd();
    assertContained(cwd, dest);
    // Reject if any path component under cwd is a symlink escaping intent
    const parts = path.resolve(dest).split(path.sep);
    let acc = parts[0] === "" ? path.sep : parts[0] + path.sep;
    for (let i = 1; i < parts.length; i++) {
      acc = path.join(acc, parts[i]);
      if (fs.existsSync(acc) && isSymlink(acc)) {
        const real = fs.realpathSync(acc);
        const rel = path.relative(fs.realpathSync(cwd), real);
        if (rel.startsWith("..") || path.isAbsolute(rel)) {
          throw new Error(`Refusing to follow symlink escape: ${acc} → ${real}`);
        }
      }
    }
  }
  if (fs.existsSync(dest) && isSymlink(dest)) {
    throw new Error(`Refusing to install into symlinked destination: ${dest}`);
  }
  rmDir(dest);
}

export async function init({ ai, globalInstall }) {
  const skillRoot = resolveSkillRoot();
  const targets = resolveTargets(ai, globalInstall);
  for (const t of targets) {
    const dest = path.isAbsolute(t.dest) ? t.dest : path.resolve(process.cwd(), t.dest);
    prepareDest(dest, { globalInstall });
    copyDirSafe(skillRoot, dest);
    console.log(`Installed uzbek-humanizer for ${t.ai} → ${dest}`);
  }
  console.log(`\nSkill source: ${skillRoot}`);
  console.log("Done. Open a new agent chat and ask for Uzbek copy help.");
}

export async function uninstall({ ai, globalInstall }) {
  const targets = resolveTargets(ai, globalInstall);
  for (const t of targets) {
    const dest = path.isAbsolute(t.dest) ? t.dest : path.resolve(process.cwd(), t.dest);
    if (!globalInstall) {
      try {
        assertContained(process.cwd(), dest);
      } catch (e) {
        console.warn(`Skip unsafe path: ${dest} (${e.message})`);
        continue;
      }
    }
    if (fs.existsSync(dest)) {
      rmDir(dest);
      console.log(`Removed ${t.ai} → ${dest}`);
    } else {
      console.log(`Missing (ok) ${t.ai} → ${dest}`);
    }
  }
  console.log("\nUninstall done.");
}

export { TARGETS, resolveSkillRoot };
