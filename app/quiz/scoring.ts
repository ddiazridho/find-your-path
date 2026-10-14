import { majors } from "../majors";
import { dimensions, questions } from "./questions";
import type { DimensionWeights, InterestProfile, QuizAnswers, QuizQuestion, QuizResult } from "./types";

// Metadata extends the catalog; recommendations never introduce disconnected majors.
export const majorProfiles: Record<string, { name: string; description: string; href: string; weights: DimensionWeights }> = {
  "computer-science": { name: "Teknik Informatika", description: "Eksplorasi cara membuat program, mengolah data, dan menyelesaikan masalah dengan teknologi.", href: "/computer-science/software", weights: { technology: .4, analytical: .35, creative: .15, engineering: .1 } },
  law: { name: "Hukum", description: "Eksplorasi aturan, argumen, dan persoalan masyarakat dari berbagai sudut pandang.", href: "/?major=law#explore", weights: { social: .45, analytical: .4, business: .15 } },
  medicine: { name: "Kedokteran", description: "Eksplorasi kesehatan manusia, analisis kasus, dan cara membantu orang melalui ilmu kesehatan.", href: "/?major=medicine#explore", weights: { social: .45, analytical: .35, engineering: .2 } },
};
export function isValidAnswer(question: QuizQuestion, answer: unknown): boolean {
  return question.type === "rating" ? typeof answer === "number" && Number.isInteger(answer) && answer >= 1 && answer <= 5 : question.options.some(option => option.id === answer);
}
export function isComplete(answers: QuizAnswers): boolean {
  return questions.every(question => isValidAnswer(question, answers[question.id]));
}
export function calculateResults(answers: QuizAnswers): QuizResult {
  if (!isComplete(answers)) throw new Error("Jawab semua pertanyaan dulu, ya.");
  const profile = {} as InterestProfile;
  for (const { id } of dimensions) {
    let sum = 0, total = 0;
    for (const question of questions) {
      if (question.type === "rating") {
        const weight = question.weights[id] ?? 0;
        sum += ((Number(answers[question.id]) - 1) / 4) * 100 * weight;
        total += weight;
      } else {
        const selected = question.options.find(option => option.id === answers[question.id])!;
        sum += selected.weights[id] ?? 0;
        total += 1;
      }
    }
    profile[id] = Math.round(sum / total);
  }
  const recommendations = majors.filter(major => majorProfiles[major.id]).map(major => {
    const metadata = majorProfiles[major.id];
    const relevant = dimensions.filter(({ id }) => (metadata.weights[id] ?? 0) > 0);
    const total = relevant.reduce((sum, { id }) => sum + metadata.weights[id]!, 0);
    const score = Math.round(relevant.reduce((sum, { id }) => sum + profile[id] * metadata.weights[id]!, 0) / total);
    const reasons = relevant.sort((a, b) => profile[b.id] * metadata.weights[b.id]! - profile[a.id] * metadata.weights[a.id]!).slice(0, 2).map(({ id }) => id);
    return { major, name: metadata.name, description: metadata.description, href: metadata.href, score, reasons };
  }).sort((a, b) => b.score - a.score || a.major.id.localeCompare(b.major.id));
  return { profile, recommendations: recommendations.slice(0, 5) };
}
