import { majors, type Major } from "../majors";
import { dimensions, questions, ESSAY_MAX_LENGTH } from "./questions";
import type { InterestProfile, MajorMetadata, MajorRecommendation, QuizAnswers, QuizQuestion, QuizResult } from "./types";
// Editorial hypotheses, not validated occupational profiles. Equal weight per listed type.
export const majorProfiles: Record<string, MajorMetadata> = {
  "computer-science": { name: "Teknik Informatika", description: "Mempelajari komputasi, pemrograman, dan pemecahan masalah melalui teknologi.", href: "/computer-science/software", riasec: ["I", "R", "C"], skills: ["Pemecahan masalah", "Pemrograman", "Pengelolaan data"] },
  law: { name: "Hukum", description: "Mempelajari aturan, argumentasi, dan persoalan keadilan dalam masyarakat.", href: "/?major=law#explore", riasec: ["E", "S", "I"], skills: ["Argumentasi berbasis bukti", "Membaca kritis", "Komunikasi"] },
  medicine: { name: "Kedokteran", description: "Mempelajari kesehatan manusia dan pelayanan pasien melalui ilmu kedokteran.", href: "/?major=medicine#explore", riasec: ["I", "S", "R"], skills: ["Penalaran ilmiah", "Empati", "Ketelitian"] },
};
export function isValidAnswer(q: QuizQuestion, answer: unknown): boolean {
  if (q.type === "rating") return typeof answer === "number" && Number.isInteger(answer) && answer >= 1 && answer <= 5;
  if (q.type === "essay") return typeof answer === "string" && answer.trim().length > 0 && answer.length <= ESSAY_MAX_LENGTH;
  return typeof answer === "string" && q.options.some(o => o.id === answer);
}
export function isComplete(answers: QuizAnswers): boolean { return questions.every(q => isValidAnswer(q, answers[q.id])); }
const blankProfile = (): InterestProfile => ({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
export function recommendMajors(profile: InterestProfile, situational: InterestProfile, catalog: Major[] = majors, metadata: Record<string, MajorMetadata> = majorProfiles): MajorRecommendation[] {
  const recommendations: MajorRecommendation[] = [];
  const seen = new Set<string>();
  for (const major of catalog) {
    if (seen.has(major.id)) continue;
    seen.add(major.id);
    const entry = metadata[major.id];
    if (!entry || !entry.name || !entry.description || !entry.href?.startsWith("/") || entry.href.startsWith("//") || !Array.isArray(entry.riasec) || !Array.isArray(entry.skills) || !entry.skills.length) continue;
    const types = dimensions.filter(({ id }) => entry.riasec.includes(id)).map(({ id }) => id);
    if (!types.length) continue;
    const score = types.reduce((sum, id) => sum + profile[id], 0) / types.length;
    const reasons = [...types].sort((a, b) => profile[b] - profile[a] || a.localeCompare(b));
    recommendations.push({ major, metadata: { ...entry, riasec: types }, score, reasons, supporting: reasons.filter(id => situational[id] > 0) });
  }
  return recommendations.sort((a, b) => b.score - a.score || a.major.id.localeCompare(b.major.id)).slice(0, 5);
}
export function calculateResults(answers: QuizAnswers): QuizResult {
  if (!isComplete(answers)) throw new Error("Lengkapi semua 30 jawaban sebelum melihat hasil.");
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
  // Reasoning answers are validated but not graded or used in matching:
  // no defensible mapping to major metadata exists in this catalog.
  return { profile, dominant, situational, situationalCounts, recommendations: recommendMajors(profile, situational) };
}
