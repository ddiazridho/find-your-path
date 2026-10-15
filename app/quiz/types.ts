import type { Major } from "../majors";
export type Riasec = "R" | "I" | "A" | "S" | "E" | "C";
export type InterestProfile = Record<Riasec, number>;
export type ReasoningDomain = "numeric" | "logic" | "verbal" | "spatial";
export type QuizAnswer = number | string;
export type QuizAnswers = Record<string, QuizAnswer>;
export type QuizQuestion = { id: string; title: string } & (
  { type: "rating"; riasec: Riasec } |
  { type: "situational"; options: { id: string; label: string; riasec: Riasec }[] } |
  { type: "reasoning"; domain: ReasoningDomain; options: { id: string; label: string }[]; correct: string; explanation: string } |
  { type: "essay" }
);
export type MajorMetadata = { name: string; description: string; href: string; riasec: Riasec[]; skills: string[] };
export type MajorRecommendation = { major: Major; metadata: MajorMetadata; score: number; reasons: Riasec[]; supporting: Riasec[] };
export type QuizResult = {
  profile: InterestProfile; dominant: Riasec[];
  situational: InterestProfile; situationalCounts: InterestProfile;
  recommendations: MajorRecommendation[];
};
export type EssayAnalysis = {
  alignment: "sejalan" | "sebagian" | "berbeda" | "tidak_cukup_bukti";
  reasoning: string;
  usedQuestionIds: string[];
  ignoredQuestionIds: string[];
};
export type QuizSession = { version: 4; phase: "intro" | "active" | "complete"; index: number; answers: QuizAnswers; result?: QuizResult; essayAnalysis?: EssayAnalysis };
