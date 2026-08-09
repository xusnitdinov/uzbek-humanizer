# Morphology checks

Uzbek is agglutinative. Suffix order matters.

## Order

`oʻzak + soʻz yasovchi + lugʻaviy shakl + sintaktik`

Example: `kitob + xon + lar + ga` → `kitobxonlarga`

## Common LLM fails

| Bad | Good | Issue |
|---|---|---|
| berdimga | berdim | Extra case on already-finished verb |
| kitoblerimiz | kitoblarimiz | Vowel harmony |
| doʻstimning fikr | doʻstimning fikri | Missing possessive agreement |
| Broken stacking | Rebuild from stem outward | Random suffix soup |

## Checklist

1. Identify stem
2. Add derivational then inflectional suffixes in order
3. Check plural/possessive/case harmony
4. Read aloud - if it feels stacked wrong, it probably is

## Possessive pattern

`doʻstimning fikri` - possessor marked, possessed agrees.
