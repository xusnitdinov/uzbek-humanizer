# uzbek-humanizer

### The Agent Skill that makes AI sound like it actually speaks Uzbek

AI assistants are fluent. They are also weirdly stiff in Latin Uzbek - wrong apostrophes, English word order, broken suffixes, and `Siz` mixed with `-san`.

**uzbek-humanizer** is a real [Agent Skill](https://agentskills.io) (not a README cosplay). Install it once. Cursor, Claude, Codex, Copilot and friends load it when you ask for Uzbek copy - then rewrite like a human.

```text
Bad:  Men haqiqatan ham bu ilovani yoqtiraman. To'g'ri javobni select qiling.
Good: Bu ilova menga juda yoqadi. Toʻgʻri javobni belgilang.
```

MIT. Honest quality bar: **much more natural**. Heavy slang / legal / medical still needs a native pass.

---

## Install in 10 seconds

```bash
npx skills add xusnitdinov/uzbek-humanizer
```

Or the branded CLI ([npmjs](https://www.npmjs.com/package/uzbek-humanizer-cli)):

```bash
npm i -g uzbek-humanizer-cli
uzhumanizer init --ai all --global
```

Same CLI on [GitHub Packages](https://github.com/xusnitdinov/uzbek-humanizer/pkgs/npm/uzbek-humanizer-cli) (needs a GitHub token with `read:packages`):

```bash
npm i -g @xusnitdinov/uzbek-humanizer-cli --registry=https://npm.pkg.github.com
uzhumanizer init --ai all --global
```

From source:

```bash
git clone https://github.com/xusnitdinov/uzbek-humanizer.git
cd uzbek-humanizer/cli
npm install -g .
uzhumanizer init --ai all --global
```

| Flag | Meaning |
|---|---|
| `--ai cursor\|claude\|codex\|copilot\|windsurf\|cline\|roo\|amp\|goose\|trae\|kilo\|opencode\|continue\|agents\|all` | where to install |
| `--global` | home skills dir instead of project |

Quality check from repo root: `npm run test:eval`

More detail: [INSTALL.md](./INSTALL.md) · bakeoff: `skills/uzbek-humanizer/eval/bakeoff-rubric.md`

---

## What you get

| Piece | Job |
|---|---|
| `skills/uzbek-humanizer/SKILL.md` | Lean agent brain - triggers, workflow, gotchas, output template |
| `references/` | On-demand packs: orthography, morphology, UI, quiz, bank SMS, slang… |
| `scripts/` | Apostrophe normalize, banned + stiff linters, eval runner |
| `examples/` | Product UI, quiz, marketing rewrites |
| `eval/` | Quality cases, trigger queries, native bakeoff rubric |
| `cli/` | `uzhumanizer` multi-agent installer (bundles the skill) |

Progressive disclosure (Agent Skills spec):

1. Agent sees **name + description** (~100 tokens)
2. Activates → loads **SKILL.md**
3. Loads **references/scripts** only when the skill says *when*

---

## Quick demo

**Ask**

> Localize to natural Uzbek Latin: Save / Cancel / No results found / Invalid password

**Expect**

```text
Saqlash
Bekor qilish
Soʻrovingiz boʻyicha hech narsa topilmadi
Notoʻgʻri parol
```

**Ask**

> Humanize this Uzbek: Siz eshikni yopishga qarshi emasmisiz? Keyinroq urinib ko'ring.

**Expect**

```text
Iltimos, eshikni yopib qoʻying. Keyinroq qayta urinib koʻring.
```

Output contract:

```markdown
## Matn
...

## Oʻzgarishlar
- ...

## Holat
final | draft/native_review_required
```

---

## What it fixes

- `ʻ` vs `ʼ` orthography (ban ASCII `'` spam)
- Morphology fails (`berdimga`, `kitoblerimiz`)
- EN word-order mush → natural SOV
- Literal idioms (`chelakni tepdi` → real meaning)
- Register: one `Siz` / `sen` lane
- Product microcopy (Payme / my.gov / Flutter-style labels)
- Quiz stems (`Toʻgʻri javobni belgilang`)
- Bank / OTP safety voice
- Youth slang **only when asked** (otherwise clean UZ)

Grounded in published LLM Uzbek error research (morphology ~35% of failures) plus product corpora and Agent Skills best practices.

---

## Repo map

```text
uzbek-humanizer/
├── skills/uzbek-humanizer/   ← the skill
│   ├── SKILL.md
│   ├── references/
│   ├── examples/
│   ├── eval/
│   └── scripts/
├── cli/                      ← uzhumanizer installer
├── INSTALL.md
└── README.md
```

---

## For skill authors / agents

This is a **workflow package**:

- Killer `description` for discovery (EN + UZ triggers)
- Gotchas live in `SKILL.md` (not buried)
- Explicit `Load references/X.md when Y`
- Validate loop via `scripts/`
- `eval/cases.jsonl` for quality iteration
- `eval/trigger-queries.json` for description tuning

See `references/sources.md` for research links.

---

## Honesty

- Default voice: spoken clear **product / student** Latin Uzbek
- Not a presidential speech generator
- Not a full slang dictionary
- Not "native-perfect forever"
- Invented idioms are banned on purpose
- Legal / medical / slang-heavy → `draft/native_review_required`
- Native bakeoff protocol: `skills/uzbek-humanizer/eval/bakeoff-rubric.md`

If you need youth Telegram mix, ask for it - the skill will label draft.

---

## License

[MIT](./LICENSE) © 2026 [xusnitdinov](https://github.com/xusnitdinov)

---

<p align="center">
  <b>Oʻzbekcha yoz. Odamiy yoz.</b><br/>
  <sub>Install the skill. Let the agents catch up.</sub>
</p>
