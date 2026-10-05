import test from "node:test";
import assert from "node:assert/strict";
import { normalize, TURNED, TUTUQ } from "../skills/uzbek-humanizer/scripts/normalize-apostrophe.mjs";

test("keeps digraphs as TURNED", () => {
  assert.equal(normalize("to'g'ri"), `to${TURNED}g${TURNED}ri`);
  assert.equal(normalize(`to${TURNED}g${TURNED}ri`), `to${TURNED}g${TURNED}ri`);
});

test("handles doʻstim and tutuq words", () => {
  assert.equal(normalize("do'stim"), `do${TURNED}stim`);
  assert.equal(normalize("ma'no"), `ma${TUTUQ}no`);
  assert.equal(normalize("va'da"), `va${TUTUQ}da`);
});

test("does not touch English contractions", () => {
  assert.equal(normalize("Who's there?"), "Who's there?");
  assert.equal(normalize("I'm sure"), "I'm sure");
});

test("protects tx bilingual args", () => {
  const input = `tx("to'g'ri", "Who's right?", "Где?")`;
  const out = normalize(input);
  assert.equal(out, `tx("to${TURNED}g${TURNED}ri", "Who's right?", "Где?")`);
});

test("protects en locale values while normalizing uz values", () => {
  const input = `{"uz":"to'g'ri","en":"Who's there?","ru":"Где?"}`;
  const out = normalize(input);
  assert.equal(out, `{"uz":"to${TURNED}g${TURNED}ri","en":"Who's there?","ru":"Где?"}`);
});

test("protects placeholders, urls and code blocks", () => {
  const input =
    "Natija: {count} ta. Link: https://foo.bar/who's\n```js\nconst s = \"who's\";\n```";
  const out = normalize(input);
  assert.match(out, /\{count\}/);
  assert.match(out, /https:\/\/foo\.bar\/who's/);
  assert.match(out, /```js[\s\S]*who's[\s\S]*```/);
});

test("tx three-arg bilingual: only first Uzbek arg normalizes", () => {
  const input = `tx("do'stim", "Who's my friend?", "Кто это?")`;
  const out = normalize(input);
  assert.equal(
    out,
    `tx("do${TURNED}stim", "Who's my friend?", "Кто это?")`
  );
});

test("keeps printf and ICU-ish placeholders", () => {
  const input = "Natija: %s / %d / %(name)s / {count, plural, one {# ta} other {# ta}}";
  const out = normalize(input);
  assert.match(out, /%s/);
  assert.match(out, /%d/);
  assert.match(out, /%\(\s*name\)s|%\(name\)s/);
  assert.match(out, /\{count,/);
});

test("inline backticks stay untouched", () => {
  const input = "Kod: `who's` va matn: to'g'ri";
  const out = normalize(input);
  assert.match(out, /`who's`/);
  assert.equal(out.includes(`to${TURNED}g${TURNED}ri`), true);
});

test("acute accent and wrong tutuq on o/g become the digraph mark", () => {
  assert.equal(normalize("o\u00B4g\u00B4ri"), `o${TURNED}g${TURNED}ri`);
  assert.equal(normalize("bo\u02BClmayapti"), `bo${TURNED}lmayapti`);
});

test("reform letters normalize inbound and are not emitted", () => {
  assert.equal(normalize("q\u00F6\u015Filaman"), `qo${TURNED}shilaman`);
  assert.equal(normalize("\u00E7unki"), "chunki");
  assert.equal(normalize("\u00D5ZIDAN"), `O${TURNED}ZIDAN`);
  assert.equal(normalize("juda z\u00F5r"), `juda zo${TURNED}r`);
  assert.equal(normalize("gap y\u00F3"), `gap yo${TURNED}`);
  const out = normalize("To\u011Fri q\u00F6\u015Filaman");
  assert.equal(/[ööğğşçõóòō]/i.test(out), false);
  assert.match(out, new RegExp(`g${TURNED}ri`));
});

test("brand and ALL-CAPS suffixes stay tutuq", () => {
  assert.equal(normalize("Payme Go'da"), `Payme Go${TUTUQ}da`);
  assert.equal(normalize("PUBG'ga"), `PUBG${TUTUQ}ga`);
  assert.equal(normalize("Uzum'da"), `Uzum${TUTUQ}da`);
  assert.equal(normalize("AIFU'da"), `AIFU${TUTUQ}da`);
  assert.equal(normalize("tool'da"), `tool${TUTUQ}da`);
  assert.equal(normalize("to'g'ri"), `to${TURNED}g${TURNED}ri`);
  assert.equal(normalize("TO'G'RI"), `TO${TURNED}G${TURNED}RI`);
  assert.equal(normalize("to'da"), `to${TURNED}da`);
});

test("JSON keys are not rewritten into tutuq digraphs", () => {
  const input = `{"save":"Saqlash","o'zbek":"to'g'ri"}`;
  const out = normalize(input);
  // value normalizes; do not invent oʼ digraph
  assert.equal(/[OoGg]\u02BC/.test(out), false);
  assert.match(out, new RegExp(`to${TURNED}g${TURNED}ri`));
});
