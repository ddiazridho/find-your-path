import { z } from "zod";

export const priorities = ["interest", "career", "budget", "learning"] as const;

export const recommendationRequestSchema = z.strictObject({
  minat: z.string().trim().min(10).max(1000),
  bidang: z.array(z.enum(["Teknologi", "Bisnis"])).min(1).max(2).refine(values => new Set(values).size === values.length),
  jenjang: z.array(z.enum(["D3", "D4", "S1"])).min(1).max(3).refine(values => new Set(values).size === values.length),
  budget: z.strictObject({
    min: z.number().int().min(0).max(30_000_000),
    max: z.number().int().min(0).max(30_000_000),
  }).refine(value => value.max >= value.min),
  prioritas: z.array(z.enum(priorities)).length(4).refine(values => new Set(values).size === 4),
});

export type RecommendationRequest = z.infer<typeof recommendationRequestSchema>;

export type Program = {
  id: string;
  bidang: "Teknologi" | "Bisnis";
  jenjang: "D3" | "D4" | "S1";
  jurusan: string;
  universitas: string;
  lokasi: string;
  biaya_min_per_semester: number;
  biaya_max_per_semester: number;
  minat: string;
  learning_text: string;
  career_text: string;
  catatan_biaya: string;
  url_sumber: string;
  tanggal_data: string;
};
