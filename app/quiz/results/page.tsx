"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QuizResults } from "../components";
import { emptySession } from "../storage";
import { updateSession, useQuiz } from "../use-quiz";
export default function ResultsPage() {
  const state = useQuiz();
  const router = useRouter();
  if (!state) return <main className="quiz-intro" role="status">Menyiapkan hasilmu...</main>;
  return <>{state.warning && <p className="quiz-warning" role="status">{state.warning}</p>}{state.session.phase !== "complete" || !state.session.result
    ? <main className="quiz-intro quiz-empty"><h1>Lengkapi asesmenmu dulu</h1><p>Hasil muncul setelah semua 30 soal dijawab dan kamu menekan Submit Asesmen.</p><Link href="/quiz" className="button quiz-primary">Mulai atau Lanjutkan Asesmen</Link></main>
    : <QuizResults result={state.session.result} onRetake={() => {
      updateSession(emptySession()); router.replace("/quiz");
    }} />}</>;
}
