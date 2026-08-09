# uzbek-copy

### The Agent Skill that makes AI sound like it actually speaks Uzbek

AI assistants are fluent. They are also weirdly stiff in Latin Uzbek - wrong apostrophes, English calques, broken suffixes, `Siz` mixed with `-san`, and vibes like `feature portladi`.

**uzbek-copy** is a real [Agent Skill](https://agentskills.io) (not a README cosplay). Install it once. Cursor, Claude, Codex, Copilot and friends load it when you ask for Uzbek copy - then rewrite like a human.

```text
Bad:  Bu feature portladi, teammate ship qiladi.
Good: Bu imkoniyat chiqmadi. Doʻstim, topshiramiz.
```

MIT. Honest quality bar: **much more natural**. Heavy slang / legal / medical still needs a native pass.

---

## Install in 10 seconds

```bash
npx skills add xusnitdinov/uzbek-humanizer
```

Or the branded CLI:

```bash
git clone https://github.com/xusnitdinov/uzbek-humanizer.git
cd uzbek-humanizer/cli
npm install -g .
uzcopy init --ai all --global
```

| Flag | Meaning |
|---|---|
| `--ai cursor\|claude\|codex\|copilot\|all` | where to install |
| `--global` | home skills dir instead of project |

More detail: [INSTALL.md](./INSTALL.md)

---

## What you get

| Piece | Job |
|---|---|
| `skills/uzbek-copy/SKILL.md` | Lean agent brain - triggers, workflow, gotchas, output template |
| `references/` | On-demand packs: orthography, morphology, UI, quiz, bank SMS, slang… |
| `scripts/` | Apostrophe normalize + banned-calque lint |
| `examples/` | Product UI, quiz, marketing rewrites |
| `eval/` | Quality cases + skill-trigger queries |
| `cli/` | `uzcopy` multi-agent installer |

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

> Humanize: Bu feature portladi, vibe check qilaylik

**Expect** change list + final matn without `feature` / `portladi` / `vibe`.

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
├── skills/uzbek-copy/     ← the skill
│   ├── SKILL.md
│   ├── references/
│   ├── examples/
│   ├── eval/
│   └── scripts/
├── cli/                   ← uzcopy installer
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
- Not “native-perfect forever”
- Invented idioms are banned on purpose

If you need youth Telegram mix, ask for it - the skill will label `draft/native_review_required`.

---

## License

[MIT](./LICENSE) © 2026 [xusnitdinov](https://github.com/xusnitdinov)

---

<p align="center">
  <b>Oʻzbekcha yoz. Odamiy yoz.</b><br/>
  <sub>Install the skill. Let the agents catch up.</sub>
</p>
