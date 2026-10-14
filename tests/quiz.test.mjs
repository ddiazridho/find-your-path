import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Load the pure TypeScript modules without adding a test-runner dependency.
const load = createRequire(import.meta.url);
load.extensions[".ts"] = (module, filename) => {
  const output = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  });
  module._compile(output.outputText, filename);
};
const { questions, dimensions } = load("../app/quiz/questions.ts");
const { calculateResults, isComplete, isValidAnswer } = load("../app/quiz/scoring.ts");
const { majors } = load("../app/majors.ts");
const { readSession, saveSession, emptySession } = load("../app/quiz/storage.ts");
const answersFor = (rating, choices = {}) => Object.fromEntries(questions.map(q => [q.id, q.type === "rating" ? rating : choices[q.id] ?? q.options[0].id]));

test("exactly ten questions validate rating and single-choice answers strictly", () => {
  assert.equal(questions.length, 10);
  assert.equal(questions.filter(q => q.type === "rating").length, 7);
  assert.equal(isComplete({}), false);
  for (const q of questions) {
    assert.equal(isValidAnswer(q, null), false);
    assert.equal(isValidAnswer(q, q.type === "rating" ? 5 : q.options[0].id), true);
    for (const invalid of [0, 6, 2.5, "5", "unknown", {}, []]) assert.equal(isValidAnswer(q, invalid), false);
  }
  assert.throws(() => calculateResults({}));
});

test("results are deterministic, bounded, sorted, and use catalog majors", () => {
  const answers = answersFor(5);
  const first = calculateResults(answers);
  assert.deepEqual(first, calculateResults({ ...answers }));
  assert.equal(Object.keys(first.profile).length, 6);
  for (const score of Object.values(first.profile)) assert.ok(score >= 0 && score <= 100);
  assert.equal(first.recommendations.length, 3);
  first.recommendations.forEach((item, index, items) => {
    assert.ok(majors.some(major => major.id === item.major.id));
    assert.ok(item.href.startsWith("/"));
    assert.ok(index === 0 || items[index - 1].score >= item.score);
  });
});

test("ratings and choices both influence scores and recommendation order", () => {
  const low = calculateResults(answersFor(1));
  const high = calculateResults(answersFor(5));
  dimensions.forEach(({ id }) => assert.ok(high.profile[id] > low.profile[id]));
  const technical = calculateResults(answersFor(3, { activity: "app", work: "data", experience: "program" }));
  const social = calculateResults(answersFor(3, { activity: "help", work: "team", experience: "human" }));
  assert.ok(technical.profile.technology > social.profile.technology);
  assert.ok(social.profile.social > technical.profile.social);
  assert.equal(technical.recommendations[0].major.id, "computer-science");
  assert.notEqual(social.recommendations[0].major.id, "computer-science");
});

test("persistence restores progress, rejects corrupt answers, and recomputes results", () => {
  const entries = new Map();
  globalThis.localStorage = { getItem: key => entries.get(key) ?? null, setItem: (key, value) => entries.set(key, value) };
  const session = { ...emptySession(), phase: "active", index: 4, answers: answersFor(4) };
  assert.equal(saveSession(session), true);
  assert.deepEqual(readSession().session, session);
  saveSession({ ...session, phase: "complete", result: { fake: true } });
  assert.deepEqual(readSession().session.result, calculateResults(session.answers));
  saveSession({ ...session, phase: "complete", index: 999, answers: { ...session.answers, math: 9 } });
  const invalid = readSession().session;
  assert.equal(invalid.phase, "active");
  assert.equal(invalid.index, 0);
  assert.equal(invalid.answers.math, undefined);
  assert.equal(invalid.result, undefined);
  localStorage.getItem = () => { throw new Error("blocked"); };
  localStorage.setItem = () => { throw new Error("blocked"); };
  assert.equal(saveSession(emptySession()), false);
  assert.ok(readSession().warning.length > 0);
  assert.deepEqual(readSession().session, emptySession());
});
