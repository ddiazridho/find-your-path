"use client";
import { useTranslation } from "@/app/i18n/provider";

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
function requestAnalysis(answers: QuizAnswers, locale: 'id' | 'en', sourceAnalysis?: EssayAnalysis) {
  const key = locale + JSON.stringify(questions.map(question => answers[question.id] ?? null));
  let pending = pendingAnalyses.get(key);
  if (!pending) {
    pending = fetch("/quiz/analyze", { method: "POST", headers: { "Content-Type": "application/json", "X-FYP-Language": locale }, body: JSON.stringify({ answers, ...(sourceAnalysis ? { sourceAnalysis } : {}) }), cache: "no-store" })
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
  const { t: tx, locale: language } = useTranslation();
  const state = useQuiz();
  const router = useRouter();
  const [errorLanguage, setErrorLanguage] = useState<string | null>(null);
  const analysisError = errorLanguage === language;
  const [retry, setRetry] = useState(0);
  const session = state?.session;
  const answers = session?.answers;
  const savedAnalysis = (session?.essayAnalysisLocale ?? 'id') === language ? session?.essayAnalysis : undefined;
  useEffect(() => {
    if (session?.phase !== "complete" || !answers || savedAnalysis) return;
    let active = true;
    requestAnalysis(answers, language, session.essayAnalysis).then(analysis => {
      if (active) updateSession({ ...session, essayAnalysis: analysis, essayAnalysisLocale: language });
    }).catch(() => {
      if (active) setErrorLanguage(language);
    });
    return () => { active = false; };
  }, [session, answers, savedAnalysis, retry, language]);
  if (!state) return <main className="quiz-intro" role="status">{tx("Menyiapkan hasilmu...")}</main>;
  return <>{tx(state.warning && <p className="quiz-warning" role="status">{tx(state.warning)}</p>)}{state.session.phase !== "complete" || !state.session.result
    ? <main className="quiz-intro quiz-empty"><h1>{tx("Lengkapi asesmenmu dulu")}</h1><p>{tx("Hasil muncul setelah semua soal pilihan dijawab dan kamu menekan Submit Asesmen.")}</p><Link href="/quiz" className="button quiz-primary">{tx("Mulai atau Lanjutkan Asesmen")}</Link></main>
    : <QuizResults result={state.session.result} analysis={savedAnalysis} analysisLoading={!savedAnalysis && !analysisError} analysisError={analysisError} onRetry={() => { setErrorLanguage(null); setRetry(value => value + 1); }} onRetake={() => {
      pendingAnalyses.clear(); updateSession(emptySession()); router.replace("/quiz");
    }} />}</>;
}
