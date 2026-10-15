"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QuizResults } from "../components";
import { questions } from "../questions";
import { isEssayAnalysis } from "../essay-analysis";
import { emptySession } from "../storage";
import { updateSession, useQuiz } from "../use-quiz";
import type { EssayAnalysis, QuizAnswers } from "../types";

const pendingAnalyses = new Map<string, Promise<EssayAnalysis>>();
function requestAnalysis(answers: QuizAnswers) {
  const key = JSON.stringify(questions.map(question => answers[question.id] ?? null));
  let pending = pendingAnalyses.get(key);
  if (!pending) {
    pending = fetch("/quiz/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers }), cache: "no-store" })
      .then(async response => {
        if (!response.ok) throw new Error("Analisis gagal.");
        const body = await response.json();
        if (!isEssayAnalysis(body.analysis, answers)) throw new Error("Respons analisis tidak valid.");
        return body.analysis as EssayAnalysis;
      }).catch(error => { pendingAnalyses.delete(key); throw error; });
    pendingAnalyses.set(key, pending);
  }
  return pending;
}

export default function ResultsPage() {
  const state = useQuiz();
  const router = useRouter();
  const [analysisError, setAnalysisError] = useState(false);
  const [retry, setRetry] = useState(0);
  const session = state?.session;
  const answers = session?.answers;
  const savedAnalysis = session?.essayAnalysis;
  useEffect(() => {
    if (session?.phase !== "complete" || !answers || savedAnalysis) return;
    let active = true;
    requestAnalysis(answers).then(analysis => {
      if (active) updateSession({ ...session, essayAnalysis: analysis });
    }).catch(() => {
      if (active) setAnalysisError(true);
    });
    return () => { active = false; };
  }, [session, answers, savedAnalysis, retry]);
  if (!state) return <main className="quiz-intro" role="status">Menyiapkan hasilmu...</main>;
  return <>{state.warning && <p className="quiz-warning" role="status">{state.warning}</p>}{state.session.phase !== "complete" || !state.session.result
    ? <main className="quiz-intro quiz-empty"><h1>Lengkapi asesmenmu dulu</h1><p>Hasil muncul setelah semua soal pilihan dijawab dan kamu menekan Submit Asesmen.</p><Link href="/quiz" className="button quiz-primary">Mulai atau Lanjutkan Asesmen</Link></main>
    : <QuizResults result={state.session.result} analysis={state.session.essayAnalysis} analysisLoading={!state.session.essayAnalysis && !analysisError} analysisError={analysisError} onRetry={() => { setAnalysisError(false); setRetry(value => value + 1); }} onRetake={() => {
      pendingAnalyses.clear(); updateSession(emptySession()); router.replace("/quiz");
    }} />}</>;
}
