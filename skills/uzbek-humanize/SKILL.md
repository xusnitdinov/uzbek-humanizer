---
name: uzbek-humanize
description: >-
  Slash command: humanize or translate the user's prompt into natural Latin
  Uzbek. Invoke with /uzbek-humanize followed by the text or task. Also trigger
  for uzbek-humanize, /uzbek-humanize, humanize to uzbek, translate to o'zbekcha.
license: MIT
metadata:
  author: xusnitdinov
  version: "1.3.0"
disable-model-invocation: true
---

# /uzbek-humanize

Explicit slash workflow: take whatever the user wrote **after** `/uzbek-humanize` (or the rest of the message) and turn it into natural **Latin Uzbek**.

## What the user typed

Treat the remainder of the user message as the job. Examples:

```text
/uzbek-humanize Men haqiqatan ham bu ilovani yoqtiraman
/uzbek-humanize Localize: Save, Cancel, Retry
/uzbek-humanize Would you mind closing the door?
/uzbek-humanize make this bank OTP warning sound safe in Uzbek
```

If the remainder is empty, ask once for the source text or EN strings.

## Do this

1. **Detect** - rewrite stiff UZ, localize EN (or other) → UZ, or review. Default: spoken clear product/student Latin Uzbek.
2. **Load sister skill** - if `uzbek-humanizer` is installed beside this skill, follow its Router / gotchas / Holat gate / output template. Prefer loading that `SKILL.md` + needed `references/` from the sibling folder.
3. **If sister skill is missing** - still produce natural Latin Uzbek:
   - Fix ASCII `'` → proper oʻ/gʻ (`ʻ`) and tutuq (`ʼ`)
   - Ban EN cool calques (`ship`, `vibe`, `select qil`, `haqiqatan ham` filler)
   - One address lane (`Siz` vs `sen`)
   - Natural SOV, not English word order
   - Legal / medical / youth-heavy → `draft/native_review_required`
   - Never diagnose / never invent binding legal fine print
4. **Output** exactly:

```markdown
## Matn
[final Uzbek]

## Oʻzgarishlar
- ...

## Holat
final | draft/native_review_required
```

Do not overwrite project files unless the user asks.

## Defaults

- Script: Latin (Cyrillic only if the user asked)
- Register: product / student spoken UZ
- Address: `Siz` for UI / strangers; `sen` only for clear peer chat
