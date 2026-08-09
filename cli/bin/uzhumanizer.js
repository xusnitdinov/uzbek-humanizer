#!/usr/bin/env node
import { init, uninstall, update, versions } from "../lib/init.js";

const args = process.argv.slice(2);
const cmd = args[0];

function help() {
  console.log(`uzhumanizer - install both Agent Skills (uzbek-humanizer + /uzbek-humanize)

Usage:
  uzhumanizer init --ai <name> [--global]
  uzhumanizer update --ai <name> [--global]
  uzhumanizer uninstall --ai <name> [--global]
  uzhumanizer versions
  uzhumanizer --help

--ai: cursor | claude | windsurf | agents | all | …
      (also: codex, copilot, cline, roo, amp, goose, trae, kilo,
       opencode, continue, gemini-cli, antigravity + aliases)

Examples:
  uzhumanizer init --ai cursor
  uzhumanizer init --ai claude --global
  uzhumanizer init --ai all --global
  uzhumanizer update --ai cursor
  uzhumanizer uninstall --ai cursor
`);
}

function parseFlags(list) {
  let ai = "cursor";
  let globalInstall = false;
  for (let i = 0; i < list.length; i++) {
    if (list[i] === "--ai") ai = list[++i] || "cursor";
    else if (list[i] === "--global") globalInstall = true;
  }
  return { ai, globalInstall };
}

if (!cmd || cmd === "--help" || cmd === "-h") {
  help();
  process.exit(0);
}

try {
  if (cmd === "init") {
    const { ai, globalInstall } = parseFlags(args.slice(1));
    await init({ ai, globalInstall });
  } else if (cmd === "update") {
    const { ai, globalInstall } = parseFlags(args.slice(1));
    await update({ ai, globalInstall });
  } else if (cmd === "uninstall") {
    const { ai, globalInstall } = parseFlags(args.slice(1));
    await uninstall({ ai, globalInstall });
  } else if (cmd === "versions" || cmd === "version" || cmd === "-V") {
    versions();
  } else {
    console.error(`Unknown command: ${cmd}`);
    help();
    process.exit(1);
  }
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}
