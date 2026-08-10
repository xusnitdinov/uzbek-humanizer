/**
 * Extract Uzbek-facing text from bilingual / i18n source for linting.
 * Avoids EN locale strings, 2nd+ tx() args, and en:/ru: JSON values.
 */
export function extractUzbekForLint(text, { filePath = "" } = {}) {
  const lower = filePath.replace(/\\/g, "/").toLowerCase();
  if (
    /(^|\/)en(\.json|\.ya?ml|\/)|locales\/en|messages\/en|\/en-us\b/.test(lower)
  ) {
    return { text: "", skipped: "en-locale-path" };
  }

  const chunks = [];

  // tx("uz…", "en…") / t("…") — keep first string arg only
  const callRe =
    /\b(?:tx|t|i18n\.t)\(\s*(["'`])((?:\\.|(?!\1).)*)\1/g;
  let m;
  while ((m = callRe.exec(text))) {
    chunks.push(unescapeStr(m[2]));
  }

  // "uz": "…", 'uz-UZ': '…'
  const uzKeyRe =
    /(["'])(?:uz|uz-UZ|uz_Latn|o['ʻʼ]?zbek(?:cha)?)\1\s*:\s*(["'])((?:\\.|(?!\2).)*)\2/gi;
  while ((m = uzKeyRe.exec(text))) {
    chunks.push(unescapeStr(m[3]));
  }

  // ## Matn blocks
  const parts = text.split(/^##\s+/m);
  for (const part of parts) {
    if (/^Matn\b/i.test(part.trim())) {
      chunks.push(part.replace(/^Matn[^\n]*\n?/i, ""));
    }
  }

  if (chunks.length) {
    return { text: chunks.join("\n"), skipped: null };
  }

  // Strip obvious EN/RU locale value lines, then lint remainder
  let stripped = text
    .replace(
      /(["'])(?:en|en-US|en-GB|ru|ru-RU)\1\s*:\s*(["'])(?:\\.|(?!\2).)*\2/gi,
      ""
    )
    // drop 2nd+ args of tx/t after we've already extracted first if any
    .replace(
      /\b(?:tx|t|i18n\.t)\(\s*(["'`])(?:\\.|(?!\1).)*\1\s*((?:,\s*(["'`])(?:\\.|(?!\3).)*\3)+)/g,
      (full, q1, rest) => {
        const first = full.match(
          /\b(?:tx|t|i18n\.t)\(\s*(["'`])((?:\\.|(?!\1).)*)\1/
        );
        return first ? first[0] + ")" : full;
      }
    );

  return { text: stripped, skipped: null };
}

function unescapeStr(s) {
  return s
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\");
}
