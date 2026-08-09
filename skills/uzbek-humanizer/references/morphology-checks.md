# Morphology checks

Uzbek is agglutinative. Suffix order matters.

## Order (inflection stack)

Teach this concrete stack for nouns:

`oʻzak + koʻplik + egalik + kelishik`

Example rebuild: `kitob + lar + imiz + ga` → `kitoblarimizga`

Broader (derivational then inflectional):

`oʻzak + soʻz yasovchi + lugʻaviy shakl + sintaktik`

Example: `kitob + xon + lar + ga` → `kitobxonlarga`

## Common LLM fails

| Bad | Good | Issue |
|---|---|---|
| berdimga | berdim | Extra case on already-finished verb |
| kitoblerimiz | kitoblarimiz | Vowel harmony |
| doʻstimning fikr | doʻstimning fikri | Missing possessive agreement |
| fikrlarinigaga | fikrlariga | Double case / broken `-ning`+`-ga` soup - rebuild `fikr + lar + i + ga` |
| qildiklar | qildik | Extra plural on a verb that already marks 1pl (`-dik`) |
| kitobxonlargaga | kitobxonlarga | Double dative `-ga` |
| Broken stacking | Rebuild from stem outward | Random suffix soup |

## Checklist

1. Identify stem (`oʻzak`)
2. Add plural (`koʻplik`) then possessive (`egalik`) then case (`kelishik`)
3. Derivational pieces (`-xon`, `-chi`, …) sit before that inflection stack
4. Check plural/possessive/case harmony
5. Read aloud - if it feels stacked wrong, it probably is

## Possessive pattern

`doʻstimning fikri` - possessor marked, possessed agrees.
