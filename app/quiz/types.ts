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
export type AiMajorRecommendation = { name: string; primaryRiasec: Riasec; studyOverview: string };
export type QuizResult = {
  profile: InterestProfile; dominant: Riasec[];
  situational: InterestProfile; situationalCounts: InterestProfile;
};
export type EssayAnalysis = {
  dominantReasoning: string;
  alignment: "sejalan" | "sebagian" | "berbeda" | "tidak_cukup_bukti";
  reasoning: string;
  usedQuestionIds: string[];
  ignoredQuestionIds: string[];
  recommendations: AiMajorRecommendation[];
};
export type QuizSession = { version: 4; phase: "intro" | "active" | "complete"; index: number; answers: QuizAnswers; result?: QuizResult; essayAnalysis?: EssayAnalysis; essayAnalysisLocale?: 'id' | 'en' };
