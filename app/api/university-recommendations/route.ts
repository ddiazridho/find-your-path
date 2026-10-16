import { recommend } from "@/lib/university/pipeline";
import { recommendationRequestSchema } from "@/lib/university/schema";

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length")) > 5000) {
    return Response.json({ error: "Isian terlalu panjang." }, { status: 413 });
  }
  const body = await request.text();
  if (body.length > 5000) return Response.json({ error: "Isian terlalu panjang." }, { status: 413 });
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return Response.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }
  const input = recommendationRequestSchema.safeParse(parsed);
  if (!input.success) return Response.json({ error: "Periksa minat, bidang, jenjang, budget, dan urutan prioritas." }, { status: 422 });
  try {
    const result = await recommend(input.data);
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Recommendation pipeline failed:", error instanceof Error ? error.name : "UnknownError");
    return Response.json({ error: "Layanan rekomendasi sedang tidak tersedia. Coba lagi nanti." }, { status: 503 });
  }
}
