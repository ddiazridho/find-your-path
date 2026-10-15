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
const { calculateResults, isComplete, isValidAnswer } = load("../app/quiz/scoring.ts");
const { readSession, saveSession, emptySession, STORAGE_KEY } = load("../app/quiz/storage.ts");
const { analyzeEssayAlignment, isEssayAnalysis } = load("../app/quiz/essay-analysis.ts");
const { POST } = load("../app/quiz/analyze/route.ts");
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
    const missing = answersFor(); delete missing[q.id];
    assert.equal(isComplete(missing), q.type === "essay");
    if (q.type === "essay") assert.deepEqual(calculateResults(missing), calculateResults(answersFor()));
    else assert.throws(() => calculateResults(missing));
  }
});
test("normalization supports all ties; essays never change RIASEC scores", () => {
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
test("situational results stay separate from interest scores", () => {
  const a = answersFor(), b = { ...a };
  questions.filter(q => q.type === "situational").forEach((q, i) => { b[q.id] = q.options[i].id; });
  const first = calculateResults(a), balanced = calculateResults(b);
  assert.equal(first.situational.R, 100); assert.equal(first.situationalCounts.R, 6); assert.equal(first.situational.A, 0);
  assert.deepEqual(first.profile, balanced.profile);
  for (const n of Object.values(balanced.situational)) assert.ok(Math.abs(n - 100 / 6) < 1e-9);
});
test("reasoning keys remain valid but correct/incorrect responses never alter results or expose grading", () => {
  const correct = calculateResults(answersFor(4, true)), wrong = calculateResults(answersFor(4, false));
  assert.deepEqual(correct, wrong);
  assert.equal(correct.reasoning, undefined); assert.equal(correct.reflections, undefined);
  assert.equal(isComplete(answersFor(4, false)), true);
});
test("AI recommendations accept majors outside the catalog and reject invalid lists", () => {
  const recommendations = [
    { name: "Desain Komunikasi Visual", primaryRiasec: "A", studyOverview: "Mempelajari komunikasi visual, tipografi, dan desain untuk berbagai media." },
    { name: "Arsitektur", primaryRiasec: "R", studyOverview: "Mempelajari perancangan ruang, struktur bangunan, dan lingkungan binaan." },
    { name: "Psikologi", primaryRiasec: "S", studyOverview: "Mempelajari perilaku manusia, proses berpikir, dan metode penelitian." },
  ];
  const base = { dominantReasoning: "Minatmu tersebar merata.", alignment: "tidak_cukup_bukti", reasoning: "Belum ada esai.", usedQuestionIds: [], ignoredQuestionIds: [], recommendations };
  assert.equal(isEssayAnalysis(base, {}), true);
  assert.equal(isEssayAnalysis({ ...base, recommendations: recommendations.slice(0, 2) }, {}), false);
  assert.equal(isEssayAnalysis({ ...base, recommendations: [...recommendations, recommendations[0]] }, {}), false);
  assert.equal(isEssayAnalysis({ ...base, recommendations: [{ ...recommendations[0], name: " arsitektur " }, ...recommendations.slice(1)] }, {}), false);
  assert.equal(isEssayAnalysis({ ...base, recommendations: [{ ...recommendations[0], primaryRiasec: "Z" }, ...recommendations.slice(1)] }, {}), false);
  assert.equal(isEssayAnalysis({ ...base, recommendations: [{ ...recommendations[0], studyOverview: "" }, ...recommendations.slice(1)] }, {}), false);
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
    assert.equal(migrated.session.version, 4); assert.equal(migrated.session.index, 29);
    assert.equal(Object.keys(migrated.session.answers).length, 26);
    assert.equal(migrated.session.answers.q27, undefined); assert.equal(migrated.session.result !== undefined, phase === "complete");
    assert.equal(migrated.session.phase, phase);
    assert.equal(entries.has("find-your-path:quiz:v3"), false);
    assert.ok(migrated.warning);
  }
});
test("AI explains dominant RIASEC and handles empty or irrelevant essays separately", async () => {
  const answers = Object.fromEntries(Object.entries(answersFor()).filter(([id]) => !["q27", "q28", "q29", "q30"].includes(id)));
  const result = calculateResults(answers);
  const dominantReasoning = "Semua tipe minatmu memiliki skor yang sama, sehingga belum terlihat satu tipe yang paling menonjol.";
  const filled = { ...answers, q27: "Saya suka membuat ilustrasi." };
  const recommendations = [{ name: "Desain Komunikasi Visual", primaryRiasec: "A", studyOverview: "Mempelajari komunikasi visual, tipografi, dan desain untuk berbagai media." }, { name: "Arsitektur", primaryRiasec: "R", studyOverview: "Mempelajari perancangan ruang, struktur bangunan, dan lingkungan binaan." }, { name: "Psikologi", primaryRiasec: "S", studyOverview: "Mempelajari perilaku manusia, proses berpikir, dan metode penelitian." }];
  const expected = { dominantReasoning, alignment: "berbeda", reasoning: "Kamu menyukai ilustrasi, sementara skor Artistic belum menonjol. Coba eksplorasi lagi.", usedQuestionIds: ["q27"], ignoredQuestionIds: [], recommendations };
  const noEssay = { dominantReasoning, alignment: "tidak_cukup_bukti", reasoning: "Belum ada jawaban esai untuk dibandingkan dengan profil minatmu.", usedQuestionIds: [], ignoredQuestionIds: [], recommendations };
  const originalKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = "test-only";
  try {
    const empty = await analyzeEssayAlignment(answers, result, async (_url, options) => {
      const payload = JSON.parse(options.body);
      assert.deepEqual(JSON.parse(payload.input).essays, []);
      assert.equal(JSON.parse(payload.input).ratings.length, 12);
      return { ok: true, json: async () => ({ status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify(noEssay) }] }] }) };
    });
    assert.deepEqual(empty, noEssay);
    assert.equal(isEssayAnalysis(empty, answers), true);
    const received = await analyzeEssayAlignment(filled, result, async (_url, options) => {
      assert.equal(options.headers.Authorization, "Bearer test-only");
      const payload = JSON.parse(options.body);
      assert.equal(payload.store, false);
      assert.equal(payload.input.includes("Saya suka membuat ilustrasi."), true);
      assert.equal(payload.instructions.includes("Abaikan jawaban esai kosong"), true);
      assert.equal(payload.instructions.includes("berdasarkan HANYA enam interestPercent"), true);
      assert.equal(payload.instructions.includes("tepat tiga jurusan"), true);
      assert.equal(payload.text.format.schema.required.includes("recommendations"), true);
      assert.equal(payload.text.format.schema.properties.recommendations.items.required.includes("studyOverview"), true);
      return { ok: true, json: async () => ({ status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify(expected) }] }] }) };
    });
    assert.deepEqual(received, expected);
    assert.equal(isEssayAnalysis({ ...expected, usedQuestionIds: ["q30"] }, filled), false);
    assert.equal(isEssayAnalysis({ ...expected, alignment: "tidak_cukup_bukti", reasoning: "Jawaban esai belum relevan untuk dibandingkan.", usedQuestionIds: [], ignoredQuestionIds: ["q27"] }, filled), true);
  } finally { if (originalKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = originalKey; }
});
test("analysis route rejects incomplete input and sends blank essays only as an empty list to AI", async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = "test-only";
  globalThis.fetch = async (_url, options) => {
    assert.deepEqual(JSON.parse(JSON.parse(options.body).input).essays, []);
    return { ok: true, json: async () => ({ status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify({ dominantReasoning: "Belum ada tipe yang menonjol.", alignment: "tidak_cukup_bukti", reasoning: "Belum ada esai untuk dibandingkan.", usedQuestionIds: [], ignoredQuestionIds: [], recommendations: [{ name: "Arsitektur", primaryRiasec: "R", studyOverview: "Mempelajari perancangan ruang, struktur bangunan, dan lingkungan binaan." }, { name: "Psikologi", primaryRiasec: "S", studyOverview: "Mempelajari perilaku manusia, proses berpikir, dan metode penelitian." }, { name: "Statistika", primaryRiasec: "I", studyOverview: "Mempelajari analisis data, peluang, dan penerapan metode statistik." }] }) }] }] }) };
  };
  try {
    const incomplete = await POST(new Request("http://localhost/quiz/analyze", { method: "POST", body: JSON.stringify({ answers: {} }) }));
    assert.equal(incomplete.status, 400);
    const answers = Object.fromEntries(Object.entries(answersFor()).filter(([id]) => !["q27", "q28", "q29", "q30"].includes(id)));
    const response = await POST(new Request("http://localhost/quiz/analyze", { method: "POST", body: JSON.stringify({ answers }) }));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).analysis.dominantReasoning, "Belum ada tipe yang menonjol.");
  } finally { globalThis.fetch = originalFetch; if (originalKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = originalKey; }
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
