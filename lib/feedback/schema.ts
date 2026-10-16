import { z } from "zod";

export const feedbackSchema = z.object({
  id: z.uuid(),
  satisfaction: z.enum(["satisfied", "neutral", "unsatisfied"]),
  topic: z.enum(["results", "experience", "issue", "suggestion"]),
  message: z.string().trim().max(2000),
}).strict();

export type AppFeedback = z.infer<typeof feedbackSchema>;
