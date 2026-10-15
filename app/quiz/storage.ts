import { isComplete, isValidAnswer, calculateResults } from "./scoring";
import { questions, ESSAY_MAX_LENGTH } from "./questions";
import type { QuizAnswers, QuizSession } from "./types";
export const STORAGE_KEY = "find-your-path:quiz:v4";
const OLD_KEYS = ["find-your-path:quiz:v3", "find-your-path:quiz:v2", "find-your-path:quiz:v1"];
let memory: QuizSession | null = null;
export const emptySession = (): QuizSession => ({ version: 4, phase: "intro", index: 0, answers: {} });
export function readSession(): { session: QuizSession; warning: string } {
  let raw: string | null;
  let sourceVersion = 4;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem(OLD_KEYS[0]); sourceVersion = 3;
      if (!raw) { raw = localStorage.getItem(OLD_KEYS[1]); sourceVersion = 2; }
    }
  } catch { return { session: memory ?? emptySession(), warning: "Penyimpanan perangkat tidak tersedia. Progres hanya bertahan selama sesi ini; jangan muat ulang halaman." }; }
  if (!raw) return { session: memory ?? emptySession(), warning: "" };
  try {
    const parsed = JSON.parse(raw);
    const migrating = sourceVersion !== 4;
    const phases = sourceVersion === 2 ? ["intro", "active", "review", "complete"] : ["intro", "active", "complete"];
    if (!parsed || parsed.version !== sourceVersion || !phases.includes(parsed.phase) || !parsed.answers || typeof parsed.answers !== "object" || Array.isArray(parsed.answers)) throw new Error();
    const answers: QuizAnswers = {};
    let discarded = false;
    for (const q of questions) {
      // Version 3 used rating items instead of essays. Never reinterpret these answers.
      if (sourceVersion === 3 && q.type === "essay") continue;
      const value = parsed.answers[q.id];
      if (isValidAnswer(q, value) || (q.type === "essay" && typeof value === "string" && value.length <= ESSAY_MAX_LENGTH)) answers[q.id] = value;
      else if (value !== undefined) discarded = true;
    }
    let index = Number.isInteger(parsed.index) && parsed.index >= 0 && parsed.index < questions.length ? parsed.index : 0;
    const complete = isComplete(answers);
    const phase = parsed.phase === "complete" && complete ? "complete" : parsed.phase === "intro" ? "intro" : "active";
    if ((migrating || parsed.phase === "complete") && !complete) index = questions.findIndex(q => !isValidAnswer(q, answers[q.id]));
    const session: QuizSession = { version: 4, phase, index, answers, ...(phase === "complete" ? { result: calculateResults(answers) } : {}) };
    memory = session;
    if (migrating) {
      const saved = saveSession(session);
      return { session, warning: saved ? sourceVersion === 3 ? "Empat soal esai dikembalikan. Jawaban soal 1–26 tetap tersimpan; lengkapi esai sebelum submit." : "Jawaban asesmen sebelumnya, termasuk esai yang valid, telah dipulihkan." : "Perubahan belum tersimpan. Jangan muat ulang halaman; penyimpanan browser tidak tersedia." };
    }
    return { session, warning: discarded ? "Sebagian jawaban tersimpan tidak valid. Lengkapi soal yang belum terisi sebelum submit." : "" };
  } catch {
    memory = null;
    return { session: emptySession(), warning: "Data asesmen tersimpan tidak valid. Mulai asesmen baru untuk melanjutkan." };
  }
}
export function saveSession(session: QuizSession): boolean {
  memory = session;
  try {
    if (session.phase === "intro" && Object.keys(session.answers).length === 0) localStorage.removeItem(STORAGE_KEY);
    else {
      // Results stay derived; private essays are persisted only once, in answers.
      const { version, phase, index, answers } = session;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version, phase, index, answers }));
    }
    for (const key of OLD_KEYS) localStorage.removeItem(key);
    return true;
  } catch { return false; }
}
