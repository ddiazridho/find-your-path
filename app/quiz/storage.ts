import { isComplete, isValidAnswer, calculateResults } from "./scoring";
import { questions } from "./questions";
import type { QuizAnswers, QuizSession } from "./types";

export const STORAGE_KEY = "find-your-path:quiz:v1";
let memory: QuizSession | null = null;
export const emptySession = (): QuizSession => ({ version: 1, phase: "intro", index: 0, answers: {} });
export function readSession(): { session: QuizSession; warning: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { session: memory ?? emptySession(), warning: "" };
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1 || !["intro", "active", "complete"].includes(parsed.phase) || !parsed.answers || typeof parsed.answers !== "object" || Array.isArray(parsed.answers)) throw new Error();
    const answers: QuizAnswers = {};
    for (const question of questions) if (isValidAnswer(question, parsed.answers[question.id])) answers[question.id] = parsed.answers[question.id];
    const index = Number.isInteger(parsed.index) && parsed.index >= 0 && parsed.index < questions.length ? parsed.index : 0;
    const phase = parsed.phase === "complete" && isComplete(answers) ? "complete" : parsed.phase === "intro" ? "intro" : "active";
    const session: QuizSession = { version: 1, phase, index, answers, ...(phase === "complete" ? { result: calculateResults(answers) } : {}) };
    memory = session;
    return { session, warning: "" };
  } catch {
    return { session: memory ?? emptySession(), warning: "Penyimpanan di perangkat ini tidak tersedia atau datanya tidak valid. Kamu tetap bisa melanjutkan, tetapi progres mungkin tidak tersimpan setelah halaman dimuat ulang." };
  }
}
export function saveSession(session: QuizSession): boolean {
  memory = session;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(session)); return true; } catch { return false; }
}
