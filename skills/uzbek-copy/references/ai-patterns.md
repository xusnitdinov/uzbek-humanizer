# AI patterns

Typical LLM Uzbek tells and how to kill them.

## Surface fluency, broken core

Models often sound fluent while failing:
- morphology (suffix order, vowel harmony)
- sen/Siz register
- literal idioms
- EN word order
- missing oʻ/gʻ marks

## Patterns to rewrite

| Pattern | Fix |
|---|---|
| EN SVO in UZ | Restore natural SOV: object before verb |
| Article ghosts (`bir` everywhere) | Drop unless indefiniteness matters |
| Textbook stiff (`Siz eshikni yopishga qarshi emasmisiz?`) | Soft direct: `Iltimos, eshikni yopib qoʻying` |
| Collocation mush (`kuchli tayyorgarlik`) | Real collocation (`puxta tayyorgarlik`) |
| Formal pronoun + informal ending | One lane only |
| Empty intensifiers | Prefer concrete verbs |
| RU discourse particles for "local flavor" | Remove unless youth mode requested |
| Over-explaining UI buttons | Short verb labels: `Saqlash`, `Bekor qilish` |

## Rewrite priorities

1. Meaning first
2. Morphology correct
3. Register correct
4. Orthography clean
5. Natural voice (auxiliaries, light particles)

## Evidence note

Solidjonov & Najmiddinov 2026 found morphology ~35% of LLM Uzbek errors, then lexical-semantic, syntax, orthography, pragmatics. Fight that distribution.
