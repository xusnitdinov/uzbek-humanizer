import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BUNDLED_SKILLS = path.resolve(__dirname, "../skills");
const BUNDLED_LEGACY = path.resolve(__dirname, "../skill");
const REPO_SKILLS = path.resolve(__dirname, "../../skills");

/** Packs this CLI always installs / removes. */
const REQUIRED_PACKS = ["uzbek-humanizer", "uzbek-humanize"];

function listSkillPacks(root) {
  if (!fs.existsSync(root)) return [];
  const allow = new Set(REQUIRED_PACKS);
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory() && allow.has(e.name))
    .map((e) => ({ name: e.name, root: path.join(root, e.name) }))
    .filter((p) => fs.existsSync(path.join(p.root, "SKILL.md")));
}

function assertRequiredPacks(packs, sourceLabel) {
  const names = new Set(packs.map((p) => p.name));
  const missing = REQUIRED_PACKS.filter((n) => !names.has(n));
  if (missing.length) {
    throw new Error(
      `Incomplete skill payload from ${sourceLabel} (missing: ${missing.join(", ")}). ` +
        `Reinstall uzbek-humanizer-cli or run sync-skill from the repo.`
    );
  }
  return REQUIRED_PACKS.map((name) => packs.find((p) => p.name === name));
}

/**
 * Prefer monorepo skills/, then bundled cli/skills/, then legacy cli/skill flat.
 * Multi-skill installs require both uzbek-humanizer and uzbek-humanize.
 * @returns {{ name: string, root: string }[]}
 */
function resolveSkillPacks() {
  const fromRepo = listSkillPacks(REPO_SKILLS);
  if (fromRepo.some((p) => p.name === "uzbek-humanizer")) {
    return assertRequiredPacks(fromRepo, "skills/");
  }

  const fromBundled = listSkillPacks(BUNDLED_SKILLS);
  if (fromBundled.some((p) => p.name === "uzbek-humanizer")) {
    return assertRequiredPacks(fromBundled, "cli/skills/");
  }

  if (fs.existsSync(path.join(BUNDLED_LEGACY, "SKILL.md"))) {
    console.warn(
      "Warning: legacy cli/skill only has uzbek-humanizer - slash companion missing. Prefer a full package rebuild."
    );
    return [{ name: "uzbek-humanizer", root: BUNDLED_LEGACY }];
  }

  throw new Error(
    "Skill payload not found. Reinstall uzbek-humanizer-cli or clone the repo and run from source."
  );
}

function resolveSkillRoot() {
  const packs = resolveSkillPacks();
  const main = packs.find((p) => p.name === "uzbek-humanizer") || packs[0];
  return main.root;
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
 * Older CLI layouts wrote into bases TARGETS no longer uses.
 * Uninstall still cleans these so leftovers do not linger.
 */
const LEGACY_UNINSTALL_BASES = {
  project: [".github/skills", ".cline/skills", ".opencode/skills"],
  global: [
    path.join(HOME, ".cline/skills"),
    path.join(HOME, ".opencode/skills"),
  ],
};

/**
 * Base skills directories (skill folders are created inside these).
 */
const TARGETS = {
  cursor: {
    project: [".cursor/skills", ".agents/skills"],
    global: [path.join(HOME, ".cursor/skills")],
  },
  claude: {
    project: [".claude/skills", ".agents/skills"],
    global: [path.join(CLAUDE_HOME, "skills")],
  },
  codex: {
    project: [".agents/skills"],
    global: [path.join(CODEX_HOME, "skills")],
  },
  copilot: {
    project: [".agents/skills"],
    global: [path.join(HOME, ".copilot/skills")],
  },
  windsurf: {
    project: [".windsurf/skills", ".agents/skills"],
    global: [path.join(HOME, ".codeium/windsurf/skills")],
  },
  cline: {
    project: [".agents/skills"],
    global: [path.join(HOME, ".agents/skills")],
  },
  roo: {
    project: [".roo/skills", ".agents/skills"],
    global: [path.join(HOME, ".roo/skills")],
  },
  amp: {
    project: [".agents/skills"],
    global: [path.join(XDG, "agents/skills")],
  },
  goose: {
    project: [".goose/skills", ".agents/skills"],
    global: [path.join(XDG, "goose/skills")],
  },
  trae: {
    project: [".trae/skills", ".agents/skills"],
    global: [path.join(HOME, ".trae/skills")],
  },
  kilo: {
    project: [".kilocode/skills", ".agents/skills"],
    global: [path.join(HOME, ".kilocode/skills")],
  },
  opencode: {
    project: [".agents/skills"],
    global: [path.join(XDG, "opencode/skills")],
  },
  continue: {
    project: [".continue/skills", ".agents/skills"],
    global: [path.join(HOME, ".continue/skills")],
  },
  "gemini-cli": {
    project: [".agents/skills"],
    global: [path.join(HOME, ".gemini/skills")],
  },
  antigravity: {
    project: [".agents/skills"],
    global: [path.join(HOME, ".gemini/antigravity/skills")],
  },
  agents: {
    project: [".agents/skills"],
    global: [path.join(XDG, "agents/skills")],
  },
};

const ALIASES = {
  gemini: "gemini-cli",
  roocode: "roo",
  kilocode: "kilo",
  universal: "agents",
  "github-copilot": "copilot",
  "claude-code": "claude",
};

function isSymlink(p) {
  try {
    return fs.lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
}

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
  const normalized = ALIASES[ai] || ai;
  const keys =
    normalized === "all"
      ? Object.keys(TARGETS).filter((k) => k !== "agents")
      : [normalized];
  const out = [];
  const seen = new Set();
  for (const key of keys) {
    const spec = TARGETS[key];
    if (!spec) {
      throw new Error(
        `Unknown --ai value: ${ai}. Use: ${["all", ...Object.keys(TARGETS), ...Object.keys(ALIASES)].join(", ")}`
      );
    }
    const list = globalInstall ? spec.global : spec.project;
    for (const p of list) {
      if (seen.has(p)) continue;
      seen.add(p);
      out.push({ ai: key, base: p });
    }
  }
  return out;
}

function prepareDest(dest, { globalInstall }) {
  if (!globalInstall) {
    const cwd = process.cwd();
    assertContained(cwd, dest);
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
  const packs = resolveSkillPacks();
  const targets = resolveTargets(ai, globalInstall);
  for (const t of targets) {
    const base = path.isAbsolute(t.base) ? t.base : path.resolve(process.cwd(), t.base);
    for (const pack of packs) {
      const dest = path.join(base, pack.name);
      prepareDest(dest, { globalInstall });
      copyDirSafe(pack.root, dest);
      console.log(`Installed ${pack.name} for ${t.ai} → ${dest}`);
    }
  }
  const names = packs.map((p) => p.name).join(", ");
  console.log(`\nSkill source packs: ${names}`);
  console.log(
    "Done. New chat → try /uzbek-humanize add Uzbek to this site, or ask for natural Uzbek copy."
  );
}

function packNamesForUninstall() {
  // Always remove both known packs, even if resolve fell back to legacy-only.
  return [...REQUIRED_PACKS];
}

function uninstallBases({ ai, globalInstall }) {
  const targets = resolveTargets(ai, globalInstall);
  const bases = targets.map((t) => ({
    ai: t.ai,
    base: path.isAbsolute(t.base) ? t.base : path.resolve(process.cwd(), t.base),
  }));
  const legacyList = globalInstall
    ? LEGACY_UNINSTALL_BASES.global
    : LEGACY_UNINSTALL_BASES.project;
  for (const raw of legacyList) {
    const base = path.isAbsolute(raw) ? raw : path.resolve(process.cwd(), raw);
    if (bases.some((b) => b.base === base)) continue;
    bases.push({ ai: "legacy", base });
  }
  return bases;
}

export async function uninstall({ ai, globalInstall }) {
  const names = packNamesForUninstall();
  const targets = uninstallBases({ ai, globalInstall });
  for (const t of targets) {
    for (const name of names) {
      const dest = path.join(t.base, name);
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
        console.log(`Removed ${name} (${t.ai}) → ${dest}`);
      } else if (t.ai !== "legacy") {
        console.log(`Missing (ok) ${name} (${t.ai}) → ${dest}`);
      }
    }
  }
  console.log("\nUninstall done.");
}

export async function update({ ai, globalInstall }) {
  console.log("Refreshing skills from packaged payload...\n");
  await init({ ai, globalInstall });
}

export function versions() {
  const pkgPath = path.resolve(__dirname, "../package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  console.log(`uzbek-humanizer-cli  ${pkg.version}`);
  try {
    for (const pack of resolveSkillPacks()) {
      const raw = fs.readFileSync(path.join(pack.root, "SKILL.md"), "utf8");
      const m = raw.match(/version:\s*"([^"]+)"/);
      console.log(`skill ${pack.name.padEnd(16)} ${m ? m[1] : "?"}`);
    }
  } catch (e) {
    console.log(`skill packs         (unavailable: ${e.message})`);
  }
  console.log(`npm package          https://www.npmjs.com/package/uzbek-humanizer-cli`);
}

export {
  TARGETS,
  ALIASES,
  REQUIRED_PACKS,
  resolveSkillRoot,
  resolveSkillPacks,
};
