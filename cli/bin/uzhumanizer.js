#!/usr/bin/env node
import { init, uninstall, update, versions, TARGETS, ALIASES } from "../lib/init.js";

const args = process.argv.slice(2);
const cmd = args[0];
const aiKeys = ["all", ...Object.keys(TARGETS), ...Object.keys(ALIASES)];
const aiList = aiKeys.join("|");

function help() {
  console.log(`uzhumanizer - install / refresh / remove uzbek-humanizer Agent Skill

Usage:
  uzhumanizer init --ai <${aiList}> [--global]
  uzhumanizer update --ai <${aiList}> [--global]
  uzhumanizer uninstall --ai <${aiList}> [--global]
  uzhumanizer versions
  uzhumanizer --help

Examples:
  uzhumanizer init --ai cursor
  uzhumanizer init --ai claude
  uzhumanizer init --ai windsurf --global
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
