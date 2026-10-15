import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import ts from "typescript";
const load = createRequire(import.meta.url);
load.extensions[".ts"] = (module, filename) => {
  const output = ts.transpileModule(readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 } });
  module._compile(output.outputText, filename);
};
const { questions, dimensions, ESSAY_MAX_LENGTH } = load("../app/quiz/questions.ts");
const { calculateResults, isComplete, isValidAnswer, recommendMajors, majorProfiles } = load("../app/quiz/scoring.ts");
const { majors } = load("../app/majors.ts");
const { readSession, saveSession, emptySession, STORAGE_KEY } = load("../app/quiz/storage.ts");
const answersFor = (rating = 3, correct = true) => Object.fromEntries(questions.map(q => [q.id, q.type === "rating" ? rating : q.type === "essay" ? "Saya suka belajar dan mencoba hal baru." : q.type === "situational" ? "A" : correct ? q.correct : q.options.find(o => o.id !== q.correct).id]));

test("blueprint: 30 unique IDs, 12 rating/6 situational/8 reasoning/4 essays, balanced RIASEC counts and unchanged keys", () => {
  assert.equal(questions.length, 30);
  assert.equal(new Set(questions.map(q => q.id)).size, 30);
  for (const [type, count] of Object.entries({ rating: 12, situational: 6, reasoning: 8, essay: 4 })) assert.equal(questions.filter(q => q.type === type).length, count);
  const counts = dimensions.map(({ id }) => questions.filter(q => q.type === "rating" && q.riasec === id).length);
  assert.deepEqual(counts, [2, 2, 2, 2, 2, 2]);
  assert.equal(Math.max(...counts) - Math.min(...counts), 0);
  for (const { id } of dimensions) {
    assert.equal(questions.slice(0, 12).filter(q => q.type === "rating" && q.riasec === id).length, 2);
    for (const q of questions.filter(q => q.type === "situational")) assert.equal(q.options.filter(o => o.riasec === id).length, 1);
  }
  const expectedKey = ["C", "C", "B", "C", "A", "B", "B", "C"];
  questions.filter(q => q.type === "reasoning").forEach((q, i) => {
    assert.equal(q.correct, expectedKey[i]);
    assert.equal(q.options.filter(o => o.id === q.correct).length, 1);
    assert.ok(q.explanation.length > 10);
  });
  for (const domain of ["numeric", "logic", "verbal", "spatial"]) assert.equal(questions.filter(q => q.type === "reasoning" && q.domain === domain).length, 2);
  for (const q of questions.filter(q => q.options)) assert.equal(new Set(q.options.map(o => o.id)).size, q.options.length);
});
test("validation rejects missing, malformed, fractional, out-of-range inputs and empty or oversized essays", () => {
  assert.equal(isComplete({}), false);
  assert.throws(() => calculateResults({}));
  for (const q of questions) {
    assert.equal(isValidAnswer(q, answersFor()[q.id]), true);
    for (const invalid of [null, undefined, {}, [], NaN, Infinity, "", " \n "]) assert.equal(isValidAnswer(q, invalid), false);
    if (q.type === "rating") for (const invalid of [0, 6, 2.5, "5", "old reflection"]) assert.equal(isValidAnswer(q, invalid), false);
    else if (q.type === "essay") {
      for (const invalid of [1, 5, "a".repeat(ESSAY_MAX_LENGTH + 1)]) assert.equal(isValidAnswer(q, invalid), false);
      assert.equal(isValidAnswer(q, "a".repeat(ESSAY_MAX_LENGTH)), true);
    }
    else for (const invalid of [1, "Z", "a"]) assert.equal(isValidAnswer(q, invalid), false);
    const missing = answersFor(); delete missing[q.id]; assert.equal(isComplete(missing), false); assert.throws(() => calculateResults(missing));
  }
});
test("normalization supports all ties; essays never change minat or recommendations", () => {
  for (const [rating, expected] of [[1, 0], [2, 25], [3, 50], [4, 75], [5, 100]]) {
    const result = calculateResults(answersFor(rating));
    assert.deepEqual(Object.values(result.profile), Array(6).fill(expected));
    assert.equal(result.dominant.length, 6);
  }
  const result = calculateResults({ ...answersFor(1), q1: 5, q12: 5, q3: 5, q4: 5 });
  assert.deepEqual(result.dominant, ["R", "A"]);
  assert.equal(result.profile.R, 100);
  assert.equal(result.profile.I, 0);
  const changedEssay = calculateResults({ ...answersFor(), q28: "Saya suka seni dan menulis." });
  assert.deepEqual(changedEssay, calculateResults(answersFor()));
});
test("situational supports reasons without inventing a combined weight or changing interest scores", () => {
  const a = answersFor(), b = { ...a };
  questions.filter(q => q.type === "situational").forEach((q, i) => { b[q.id] = q.options[i].id; });
  const first = calculateResults(a), balanced = calculateResults(b);
  assert.equal(first.situational.R, 100); assert.equal(first.situationalCounts.R, 6); assert.equal(first.situational.A, 0);
  assert.deepEqual(first.profile, balanced.profile);
  assert.deepEqual(first.recommendations.map(r => r.major.id), balanced.recommendations.map(r => r.major.id));
  for (const n of Object.values(balanced.situational)) assert.ok(Math.abs(n - 100 / 6) < 1e-9);
  assert.ok(first.recommendations.some(r => r.supporting.includes("R")));
});
test("reasoning keys remain valid but correct/incorrect responses never alter results or expose grading", () => {
  const correct = calculateResults(answersFor(4, true)), wrong = calculateResults(answersFor(4, false));
  assert.deepEqual(correct, wrong);
  assert.equal(correct.reasoning, undefined); assert.equal(correct.reflections, undefined);
  assert.equal(isComplete(answersFor(4, false)), true);
});
test("recommendations deterministic, transparent equal means, reasons and skills; incomplete metadata skipped", () => {
  const answers = answersFor(1);
  for (const q of questions.filter(q => q.type === "rating" && ["I", "S"].includes(q.riasec))) answers[q.id] = 5;
  const result = calculateResults(answers);
  assert.deepEqual(result, calculateResults({ ...answers }));
  assert.equal(result.recommendations.length, 3);
  for (const r of result.recommendations) {
    assert.ok(majors.some(m => m.id === r.major.id)); assert.ok(r.reasons.length > 0); assert.ok(r.metadata.skills.length > 0);
    assert.equal(r.score, r.metadata.riasec.reduce((sum, id) => sum + result.profile[id], 0) / r.metadata.riasec.length);
  }
  const tied = calculateResults(answersFor()).recommendations.map(r => r.major.id);
  assert.deepEqual(tied, [...tied].sort());
  assert.deepEqual(recommendMajors(result.profile, result.situational, majors, {}), []);
  for (const missing of [null, {}, { ...majorProfiles.law, riasec: [] }, { ...majorProfiles.law, riasec: ["Z"] }, { ...majorProfiles.law, skills: [] }, { ...majorProfiles.law, href: "//evil.test" }]) assert.deepEqual(recommendMajors(result.profile, result.situational, [majors[1]], { law: missing }), []);
  assert.equal(recommendMajors(result.profile, result.situational, [...majors, ...majors]).length, 3);
  const large = Array.from({ length: 7 }, (_, i) => ({ ...majors[0], id: `major-${i}` }));
  assert.equal(recommendMajors(result.profile, result.situational, large, Object.fromEntries(large.map(m => [m.id, majorProfiles.law]))).length, 5);
});
test("storage: refresh, navigation, corruption, recomputation, reset, blocked storage", () => {
  const entries = new Map();
  globalThis.localStorage = { getItem: key => entries.get(key) ?? null, setItem: (key, value) => entries.set(key, value), removeItem: key => entries.delete(key) };
  saveSession(emptySession());
  for (const phase of ["intro", "active", "complete"]) {
    const session = { ...emptySession(), phase, index: 26, answers: answersFor() };
    assert.equal(saveSession(session), true);
    const restored = readSession().session;
    assert.equal(restored.phase, phase); assert.equal(restored.index, 26); assert.deepEqual(restored.answers, session.answers);
    if (phase === "complete") assert.deepEqual(restored.result, calculateResults(session.answers));
    assert.equal(JSON.parse(entries.get(STORAGE_KEY)).result, undefined);
  }
  entries.set(STORAGE_KEY, JSON.stringify({ ...emptySession(), phase: "complete", index: 999, answers: { ...answersFor(), q1: 9, rogue: "secret" }, result: { fake: true } }));
  const invalid = readSession();
  assert.equal(invalid.session.phase, "active"); assert.equal(invalid.session.index, 0);
  assert.equal(invalid.session.answers.q1, undefined); assert.equal(invalid.session.answers.rogue, undefined);
  assert.equal(invalid.session.result, undefined); assert.ok(invalid.warning);
  entries.set("find-your-path:quiz:v1", "old assessment"); entries.set("find-your-path:quiz:v2", "old essays");
  saveSession(emptySession()); assert.equal(entries.size, 0); assert.deepEqual(readSession().session, emptySession());
  for (const raw of ["invalid json", "null", JSON.stringify({ ...emptySession(), version: 1 }), JSON.stringify({ ...emptySession(), phase: "review" }), JSON.stringify({ ...emptySession(), answers: [] })]) {
    entries.set(STORAGE_KEY, raw); assert.ok(readSession().warning); assert.deepEqual(readSession().session, emptySession());
  }
  localStorage.getItem = () => { throw new Error("blocked"); }; localStorage.setItem = () => { throw new Error("blocked"); };
  assert.equal(saveSession({ ...emptySession(), phase: "active", answers: { q1: 4 } }), false);
  assert.ok(readSession().warning); assert.equal(readSession().session.answers.q1, 4);
});
test("v3 migration keeps first26 but does not reinterpret former rating answers as essays", () => {
  for (const phase of ["intro", "active", "complete"]) {
    const oldAnswers = { ...answersFor(), q27: 4, q28: 4, q29: 4, q30: 4 };
    const entries = new Map([["find-your-path:quiz:v3", JSON.stringify({ version: 3, phase, index: 29, answers: oldAnswers })]]);
    globalThis.localStorage = { getItem: key => entries.get(key) ?? null, setItem: (key, value) => entries.set(key, value), removeItem: key => entries.delete(key) };
    const migrated = readSession();
    assert.equal(migrated.session.version, 4); assert.equal(migrated.session.index, 26);
    assert.equal(Object.keys(migrated.session.answers).length, 26);
    assert.equal(migrated.session.answers.q27, undefined); assert.equal(migrated.session.result, undefined);
    assert.equal(migrated.session.phase, phase === "intro" ? "intro" : "active");
    assert.equal(entries.has("find-your-path:quiz:v3"), false);
    assert.ok(migrated.warning);
  }
});
test("v2 essays are restored, drafts persist, and results are not duplicated in storage", () => {
  const answers = answersFor();
  const entries = new Map([["find-your-path:quiz:v2", JSON.stringify({ version: 2, phase: "complete", index: 29, answers })]]);
  globalThis.localStorage = { getItem: key => entries.get(key) ?? null, setItem: (key, value) => entries.set(key, value), removeItem: key => entries.delete(key) };
  const migrated = readSession();
  assert.equal(migrated.session.phase, "complete");
  assert.equal(migrated.session.answers.q27, answers.q27);
  assert.equal(entries.has("find-your-path:quiz:v2"), false);
  assert.equal(JSON.parse(entries.get(STORAGE_KEY)).result, undefined);
  saveSession({ ...emptySession(), phase: "active", index: 26, answers: { q27: "  " } });
  assert.equal(readSession().session.answers.q27, "  ");
});
