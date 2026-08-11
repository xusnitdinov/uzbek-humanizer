# Native review protocol

Use this protocol for every release that changes Uzbek-facing copy, the rewrite rules, or evaluation fixtures. Automated gates catch fixture and score regressions; they do not replace native judgment.

## Release sample

- Sample **30 lines per release**. Include changed lines first, then fill the sample across product UI, quiz, assistant, and marketing copy.
- Include at least five Oria-style career-quiz situations when those rules or examples changed.
- Add legal, medical, bank, or youth copy whenever the release touches that domain. These lines require the relevant specialist review in addition to a native Uzbek pass.
- Record the prompt, candidate, preset/domain, reviewer, date, pass/fail, and a short reason in the release notes or review issue.

## Three-pass checklist

### Pass 1 — Mechanical and contract checks

- Latin Uzbek only unless Cyrillic was explicitly requested.
- `oʻ` and `gʻ` use U+02BB; tutuq uses U+02BC. No ASCII apostrophe twins.
- Product, UI, and quiz copy uses `Siz`; no accidental `-san`, bare `Kel`, or mixed address lane.
- Keep placeholders, links, prices, dates, and security terms intact. Never alter English arguments in bilingual content.
- Run `npm run test:normalize`, the regular eval suite, and the live-bakeoff/pairwise scripts.

### Pass 2 — Native read-aloud pass

One fluent native Uzbek reviewer reads each sampled line aloud without seeing the source first.

- Does it sound like something a real Uzbek product, quiz, or helpful assistant would say?
- Is the sentence order natural, without English calques or needless formal nouns such as `amalga oshirish`?
- Is the verb right for the situation (`oʻxshamadi` for a group effort that did not work out, for example)?
- Is the tone calm, clear, and appropriately brief for its surface?
- Would the reviewer change it before shipping? If yes, mark it fail and propose the replacement.

### Pass 3 — Context and risk pass

A second reviewer checks the line in its real screen, prompt, or surrounding copy.

- Does it fit the preset: concise product default, formal quiz, friendly assistant, or warm marketing?
- Is the quiz question neutral and does it avoid steering the respondent?
- Do buttons, errors, confirmations, and empty states stay short enough for UI?
- Is there an unsafe legal, medical, banking, consent, or career claim? These must remain `draft/native_review_required` until the appropriate domain reviewer approves them.
- Check that the final line did not become grammatically correct but emotionally stiff.

## Decisions and release claims

- **Pass:** all sampled lines pass all three checks, and any domain-specific reviewer has signed off where required.
- **Revise:** fix failed lines, replace them in the sample, and rerun the affected passes.
- **S++ rule:** do **not** claim `S++` unless at least one fluent native reviewer has completed a recorded pass on the release sample. Without that pass, label the output **`draft/unverified`**—even if automated gates are green.

## Automated evidence

Run these from the repository root:

```bash
npm run test:eval
npm run test:normalize
node skills/uzbek-humanizer/scripts/run-live-bakeoff.mjs
node skills/uzbek-humanizer/scripts/run-pairwise.mjs
```

The [live bakeoff](./live-bakeoff/prompts.jsonl) gate requires a four-dimension average of **at least 4.70/5** and a `native_yes` rate of **at least 95%**. The pairwise gate requires the spoken candidate (`b`) to win **at least 80%** of labeled pairs. These thresholds are release evidence, not a substitute for the three human passes.
