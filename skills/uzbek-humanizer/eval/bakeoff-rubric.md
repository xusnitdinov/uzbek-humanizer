# Native-speaker bakeoff rubric

Blind compare **AI-only** Uzbek vs **skill-assisted** Uzbek on the same hard items.
Goal: see if the skill cuts calques, fixes morphology, and keeps honesty labels on legal/medical.

No gold answers in `bakeoff-items.jsonl` - humans score live.

## Scoring dimensions (1-5)

| Dimension | 1 | 3 | 5 |
|---|---|---|---|
| **Orthography** | Broken oʻ/gʻ, ASCII apostrophe spam, place-name English | Mixed marks; mostly readable | Consistent ʻ/ʼ; place names in UZ form |
| **Morphology** | Broken suffixes, harmony fails, stacked cases | Small slips; meaning clear | Natural agglutination; suffix order clean |
| **Naturalness** | Stiff textbook / MT mush | Usable but flat | Sounds like a real person said it |
| **Register** | Siz/sen mix; wrong formality | Mostly right lane | Address + tone fit the task |
| **Calques** | EN slang, literal idioms, hybrid verbs | A few light hybrids | Clean UZ verbs; idioms remapped or plain |
| **Honesty** | Fake certainty on legal/medical/slang | Soft hedge somewhere | Clear `draft/native_review` when needed |

Score each dimension independently. Do not average away a 1 on honesty or morphology.

## How to run a 10-item blind bakeoff

1. Pick 10 items from `bakeoff-items.jsonl` (or the whole file).
2. For each item, produce two outputs with the **same model**:
   - **A**: AI-only (no skill / no uzbek-humanizer refs)
   - **B**: skill-assisted (skill loaded; follow output template)
3. Shuffle labels. Show raters only `input` + anonymized `Output X` / `Output Y`.
4. Each rater scores both outputs on all six dimensions (table below).
5. Optional: forced choice - which output would you ship?
6. Unblind after scoring. Summarize mean per dimension and win rate.

Raters: at least one native (or near-native) Latin Uzbek reader. Two raters is better.

## Score sheet template

Copy one block per item. Fill X/Y without knowing which is skill-assisted.

```md
### Item id: ________

| Dimension | Output X (1-5) | Output Y (1-5) | Notes |
|---|---|---|---|
| Orthography | | | |
| Morphology | | | |
| Naturalness | | | |
| Register | | | |
| Calques | | | |
| Honesty | | | |
| **Total (max 30)** | | | |
| Ship preference (X/Y/tie) | | | |
```

Summary table (after unblind):

```md
| Item | AI-only total | Skill total | Winner |
|---|---|---|---|
| | | | |
| **Mean** | | | |
```

## Pass bar (suggestion)

Treat the skill as a **win** on an item if:

- Skill total ≥ AI-only total, and
- Skill has **no dimension ≤ 2**, and
- On legal/medical items, Honesty ≥ 4

Bakeoff pass suggestion for a 10-item set:

- Skill wins (or ties with higher honesty) on **≥ 7 / 10** items
- Mean skill score ≥ **22 / 30**
- Zero skill outputs with Honesty ≤ 2 on legal/medical prompts

If the skill loses on naturalness but wins on morphology + calques + honesty, still count it as useful - note the tradeoff in the writeup.

## Tips

- Same temperature / sampling settings for A and B.
- Do not post-edit either side before rating.
- Youth-mode items: score slang honesty (draft label) under Honesty, not Naturalness alone.
- Cyrillic requests: reward script compliance under Orthography + Register.
