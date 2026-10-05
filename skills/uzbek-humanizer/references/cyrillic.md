# Cyrillic

Default for this skill stays **Latin**. Load this only when the user asks for Cyrillic output or Latin↔Cyrillic conversion help.

## When to load

- User says: кирилл / Cyrillic / кириллица / "kirillcha yoz"
- Mixed script cleanup when both scripts appear
- Not: silent conversion of all Latin product copy

## Default rule

| User ask | Output script |
|---|---|
| Unspecified / normal skill use | Latin |
| Explicit Cyrillic | Cyrillic |
| "Both" / dual | Ask which is primary; label each block |

## Latin ↔ Cyrillic pitfalls

| Pitfall | Note |
|---|---|
| Digraph order | Map `sh`/`ch`/`ng` before single letters when going Latin→Cyrillic or reverse |
| ў / ғ | Latin `oʻ` / `gʻ` ↔ Cyrillic `ў` / `ғ` - do not drop the mark |
| ҳ vs х | `ҳ→h`, `х→x` - do not collapse both to `x` or both to `h`. Informal Cyrillic merges ҳ into х ("олх жуда яхши хамма нарса бор" [GP-OLX]); map by lexicon, not one-to-one |
| қ | `қ→q` - not `k` |
| ъ / tutuq | Latin `ʼ` (maʼno) ↔ Cyrillic hard sign where needed |
| Apostrophe spam | Do not leave ASCII `'` in either script output |
| RU lookalikes | Cyrillic Uzbek ≠ Russian spelling defaults - keep UZ norms |
| Names | `Тошкент` / `Toshkent` - not English Tashkent in UZ prose |
| ALL CAPS | Digraphs stay digraphs in Latin; mirror carefully in Cyrillic |

## Quick pairs (sense check)

| Latin | Cyrillic |
|---|---|
| oʻzbek | ўзбек |
| toʻgʻri | тўғри |
| gʻoya | ғоя |
| maʼno | маъно |
| Fargʻona | Фарғона |
| qabul | қабул |
| shifokor | шифокор |

## Product UI note

If the product is Latin-first, do not flip the whole glossary to Cyrillic unless asked. Mixed UI (Latin buttons + Cyrillic body) only when the user wants that mix.

Channel split is real: Kun.uz official Telegram posts in Cyrillic ("Тошкентда қисқа муддатли чанг-тўзонлар кузатилиши мумкин") while kun.uz/uz runs in Latin [TG-KUN]. Qalampir Telegram posts are Cyrillic with Latin labels: "Батафсил 👇👇👇 … RASMIY | LIVE | SPORT" [TG-QAL].

`adv-mix-12`: convert the Cyrillic body only. Leave Latin labels (RASMIY, LIVE, SPORT) as labels. No golden until a native pass; the trap is in `eval/mixed-script-traps.jsonl`.

## Review

After conversion: spot-check oʻ/gʻ/ҳ/қ and one full sentence read-aloud test. Prefer `orthography.md` for Latin mark rules.
