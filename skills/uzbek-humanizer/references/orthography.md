# Orthography

## Two marks - do not collapse

| Use | Character | Unicode | Examples |
|---|---|---|---|
| oʻ / gʻ letter mark | `ʻ` | U+02BB | Oʻzbekiston, gʻoya |
| tutuq (ъ) | `ʼ` | U+02BC | maʼno, sanʼat, aʼlo |

## Hard ban in skill output

- ASCII apostrophe `'`
- Grave accent `` ` ``

## Acceptable alternate pair (gov sites)

Some government sites use curly `‘` (U+2018) and `’` (U+2019). Prefer U+02BB / U+02BC in skill output for consistency.

## Digraphs and Latin notes

- Digraphs: `sh`, `ch`, `ng`
- No lone Latin `C` except in `Ch`
- ALL CAPS digraphs stay digraphs: `CHIQISH`

## Place names EN → UZ

In Uzbek Latin prose, use UZ forms - not English passport spellings.

| EN (avoid in UZ prose) | UZ |
|---|---|
| Tashkent | Toshkent |
| Samarkand | Samarqand |
| Bukhara | Buxoro |
| Fergana | Fargʻona |
| Andijan | Andijon |
| Namangan | Namangan |
| Navoi | Navoiy |
| Nukus | Nukus |
| Khiva | Xiva |
| Kokand | Qoʻqon |
| Margilan | Margʻilon |
| Termez | Termiz |
| Urgench | Urganch |
| Khorezm | Xorazm |
| Kashkadarya | Qashqadaryo |
| Surkhandarya | Surxondaryo |
| Karakalpakstan | Qoraqalpogʻiston |

## Cyrillic → Latin order

Convert digraphs (`sh`/`ch`/`ng`) before singles. Map carefully: `ў→oʻ`, `ғ→gʻ`, `ҳ→h`, `х→x`, `қ→q`.

Script choice and Cyrillic pitfalls: see `cyrillic.md` (Latin default; Cyrillic only when asked).

## Quick checks

- `togri` → `toʻgʻri`
- `ozbek` → `oʻzbek`
- `manosi` (when tutuq needed) → `maʼnosi`
- `Tashkent` in UZ sentence → `Toshkent`
- `u` → `oʻ` only by lexicon (`buladi` → `boʻladi`, `togrlab` → `toʻgʻrilab`). Do not rewrite the brand **Uzum** into "Oʻzum". Reviews write "uzum nasiya" and "uzimni" side by side [GP-NASIYA][GP-ONEID].

## Seen in the wild → normalize

One post can mix several marks. Kun.uz (2021) notes a word can appear "8-9 xil koʻrinishda" [KUN-2021]. Normalize on rewrite; do not copy the prompt's mark.

| Seen | Normalize to |
|---|---|
| `'` (ASCII) | ʻ after o/g; ʼ for tutuq |
| `` ` `` (grave) | ʻ after o/g |
| `‘` U+2018 / `’` U+2019 | ʻ after o/g; ʼ when it is the tutuq (`ta’lim`) |
| `´` U+00B4 | ʻ after o/g |
| `ʼ` U+02BC after o/g | ʻ (`boʼlmayapti` → `boʻlmayapti`) [GP-HEMIS] |
| Brand or ALL-CAPS + suffix (`Payme Go'da`, `PUBG'ga`, `AIFU’da`) | ʼ before the suffix, never ʻ. `normalize-apostrophe.mjs` stoplists Go, PUBG, Uzum and other ALL-CAPS tokens |

### Chat-typing restore

Kun.uz describes the habit: "«Sh»ni yozishda «W»dan, «O‘»ni yozishda «6»dan, «Ch»ni yozishda «4»dan" and "qolgan oʻrinlarda yoppasiga «x» ishlatishga oʻtib ketgan" [KUN-2021]. Restore by lexicon, not blindly.

| Typed | Restore | Attested |
|---|---|---|
| w | sh | "yaxwi ediku", "tuwunarsz" [GP-PAYME] |
| c | ch | "deb ciqaveradi" [GP-HEMIS] |
| 4 | ch | the same chat habit [KUN-2021] |
| 6 | oʻ | the same chat habit [KUN-2021] |
| x where h is meant | h | "raxmat", "xar safar", "maxsulot" [GP-TEZKOR] |
| h where x is meant | x | "hursand bo’lamiz" [GP-YANDEX] |

Unmarked `u` for oʻ (`buladi`, `uzidan`) is the same kind of restore, lexicon only, with the Uzum stoplist above.

## 2026 reform: status + rules

The Senate approved Oʻ→Ö, Gʻ→Ğ, Sh→Ş, Ch→Ç on 10 Sep 2026 and sent the law to the president. Textbooks would follow from 2027 if it takes effect [TCA]. Signing was not confirmed as of 5 Oct 2026.

Users already type the new letters and lookalikes: "Toğri qaror qilinibdi 100% qöşilaman" [YT-UZR], "ÕZIDAN ÕZI PUL YECHIB OLADI" [GP-PAYME], "juda zõr" [GP-YANDEX], "gap yö" [GP-TEZKOR].

- **Output stays in the current alphabet** (`oʻ` `gʻ` `sh` `ch`) unless the user explicitly asks for the new letters.
- **Inbound normalize:** ö õ ó ò ō → oʻ, ğ → gʻ, ş → sh, ç → ch. `normalize-apostrophe.mjs` does this and does not emit ö/ğ/ş/ç.
- **Outbound ö/ğ/ş/ç** only on an explicit request, and the line is `draft/native_review_required`. Do not add a golden that invents reform spelling. Case `reform-out-request` stays blocked until a signed text and a native pass exist.
