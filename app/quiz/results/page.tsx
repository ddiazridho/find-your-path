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
  if (state.session.phase !== "complete" || !state.session.result) return <main className="quiz-intro quiz-empty"><h1>Kenalan dulu, yuk!</h1><p>Hasilmu akan muncul setelah semua pertanyaan selesai dijawab.</p><Link href="/quiz" className="button quiz-primary">Mulai atau Lanjutkan Kuis →</Link></main>;
  return <>{state.warning && <p className="quiz-warning" role="status">{state.warning}</p>}<QuizResults result={state.session.result} onRetake={() => { updateSession(emptySession()); router.replace("/quiz"); }} /></>;
}
