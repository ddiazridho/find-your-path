import { feedbackSchema } from "@/lib/feedback/schema";
import { saveFeedback } from "@/lib/feedback/store";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "Permintaan tidak diizinkan." }, { status: 403 });
  }
  if (Number(request.headers.get("content-length")) > 12000) {
    return Response.json({ error: "Masukan terlalu panjang." }, { status: 413 });
  }
  const body = await request.text();
  if (new TextEncoder().encode(body).length > 12000) {
    return Response.json({ error: "Masukan terlalu panjang." }, { status: 413 });
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return Response.json({ error: "Format masukan tidak valid." }, { status: 400 });
  }
  const input = feedbackSchema.safeParse(parsed);
  if (!input.success) {
    return Response.json({ error: "Pilih tingkat kepuasan dan topik, lalu batasi cerita hingga 2.000 karakter." }, { status: 422 });
  }
  try {
    await saveFeedback(input.data);
    return Response.json({ saved: true }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Masukan belum terkirim. Coba lagi sebentar lagi; isianmu tetap tersimpan di formulir." }, { status: 503 });
  }
}
