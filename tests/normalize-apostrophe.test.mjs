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
