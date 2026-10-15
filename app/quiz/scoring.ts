import { dimensions, questions, ESSAY_MAX_LENGTH } from "./questions";
import type { InterestProfile, QuizAnswers, QuizQuestion, QuizResult } from "./types";
export function isValidAnswer(q: QuizQuestion, answer: unknown): boolean {
  if (q.type === "rating") return typeof answer === "number" && Number.isInteger(answer) && answer >= 1 && answer <= 5;
  if (q.type === "essay") return typeof answer === "string" && answer.trim().length > 0 && answer.length <= ESSAY_MAX_LENGTH;
  return typeof answer === "string" && q.options.some(o => o.id === answer);
}
export function isComplete(answers: QuizAnswers): boolean { return questions.every(q => q.type === "essay" || isValidAnswer(q, answers[q.id])); }
const blankProfile = (): InterestProfile => ({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
export function calculateResults(answers: QuizAnswers): QuizResult {
  if (!isComplete(answers)) throw new Error("Lengkapi semua soal pilihan sebelum melihat hasil.");
  const profile = blankProfile(), situationalCounts = blankProfile(), situational = blankProfile();
  for (const q of questions) {
    const answer = answers[q.id];
    if (q.type === "rating") profile[q.riasec] += Number(answer) - 1;
    else if (q.type === "situational") situationalCounts[q.options.find(o => o.id === answer)!.riasec]++;

  }
  for (const { id } of dimensions) {
    profile[id] = profile[id] / (questions.filter(q => q.type === "rating" && q.riasec === id).length * 4) * 100;
    situational[id] = situationalCounts[id] / questions.filter(q => q.type === "situational" && q.options.some(o => o.riasec === id)).length * 100;
  }
  const highest = Math.max(...Object.values(profile));
  const dominant = dimensions.filter(({ id }) => profile[id] === highest).map(({ id }) => id);
  // Reasoning answers are validated but do not change the interest profile.
  return { profile, dominant, situational, situationalCounts };
}
