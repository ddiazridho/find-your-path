import type { Major } from "../majors";

export type InterestDimension = "technology" | "analytical" | "creative" | "social" | "business" | "engineering";
export type InterestProfile = Record<InterestDimension, number>;
export type DimensionWeights = Partial<InterestProfile>;
export type QuizAnswer = number | string;
export type QuizAnswers = Record<string, QuizAnswer>;
export type QuizOption = { id: string; label: string; icon: InterestDimension; weights: DimensionWeights };
export type QuizQuestion = { id: string; title: string; description: string } & (
  { type: "rating"; weights: DimensionWeights } |
  { type: "choice"; options: QuizOption[] }
);
export type MajorRecommendation = { major: Major; name: string; description: string; href: string; score: number; reasons: InterestDimension[] };
export type QuizResult = { profile: InterestProfile; recommendations: MajorRecommendation[] };
export type QuizSession = { version: 1; phase: "intro" | "active" | "complete"; index: number; answers: QuizAnswers; result?: QuizResult };
