#!/usr/bin/env node
import { init, TARGETS } from "../lib/init.js";

const args = process.argv.slice(2);
const cmd = args[0];
const aiList = ["all", ...Object.keys(TARGETS)].join("|");

function help() {
  console.log(`uzhumanizer - install uzbek-humanizer Agent Skill

Usage:
  uzhumanizer init --ai <${aiList}> [--global]
  uzhumanizer --help

Examples:
  uzhumanizer init --ai cursor
  uzhumanizer init --ai windsurf
  uzhumanizer init --ai all --global
`);
}

if (!cmd || cmd === "--help" || cmd === "-h") {
  help();
  process.exit(0);
}

if (cmd !== "init") {
  console.error(`Unknown command: ${cmd}`);
  help();
  process.exit(1);
}

let ai = "cursor";
let globalInstall = false;
for (let i = 1; i < args.length; i++) {
  if (args[i] === "--ai") ai = args[++i] || "cursor";
  else if (args[i] === "--global") globalInstall = true;
}

try {
  await init({ ai, globalInstall });
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}
