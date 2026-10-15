import { analyzeEssayAlignment } from "../essay-analysis";
import { calculateResults, isComplete, isValidAnswer } from "../scoring";
import { questions } from "../questions";
import type { QuizAnswers } from "../types";

export async function POST(request: Request) {
  try {
    if (Number(request.headers.get("content-length")) > 30000) return Response.json({ error: "Jawaban terlalu panjang." }, { status: 413 });
    const raw = await request.text();
    if (raw.length > 30000) return Response.json({ error: "Jawaban terlalu panjang." }, { status: 413 });
    let body: unknown;
    try { body = JSON.parse(raw); }
    catch { return Response.json({ error: "Format JSON tidak valid." }, { status: 400 }); }
    if (!body || typeof body !== "object" || Array.isArray(body) || !("answers" in body)) return Response.json({ error: "Format jawaban tidak valid." }, { status: 400 });
    const candidate = body.answers;
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return Response.json({ error: "Format jawaban tidak valid." }, { status: 400 });
    const supplied = candidate as Record<string, unknown>;
    const answers: QuizAnswers = {};
    for (const question of questions) {
      const value = supplied[question.id];
      if (question.type === "essay") {
        if (value !== undefined && (typeof value !== "string" || value.length > 2000)) return Response.json({ error: "Esai tidak valid." }, { status: 400 });
        if (typeof value === "string" && value.trim()) answers[question.id] = value;
      } else if (isValidAnswer(question, value)) answers[question.id] = value as number | string;
    }
    if (!isComplete(answers)) return Response.json({ error: "Soal pilihan belum lengkap." }, { status: 400 });
    const result = calculateResults(answers);
    const analysis = await analyzeEssayAlignment(answers, result);
    return Response.json({ analysis }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Analisis esai belum tersedia. Coba lagi nanti." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
