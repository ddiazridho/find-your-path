"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "./questions";
import { calculateResults, isValidAnswer } from "./scoring";
import { emptySession } from "./storage";
import { updateSession, useQuiz } from "./use-quiz";
import { QuizIntroduction, QuizNavigation, QuizProgress, QuizQuestion, QuizSubmitting } from "./components";

export default function QuizFlow() {
  const state = useQuiz();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const locked = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => { router.prefetch("/quiz/results"); return () => { if (timer.current) clearTimeout(timer.current); }; }, [router]);
  if (!state) return <main className="quiz-intro" role="status">Menyiapkan kuis...</main>;
  const { session, warning } = state;
  const { answers, index } = session;
  const answered = questions.filter(question => isValidAnswer(question, answers[question.id])).length;
  function close() {
    if (answered && !window.confirm("Keluar dari kuis? Jawaban yang sudah kamu isi akan dihapus.")) return;
    updateSession(emptySession());
  }
  function back() { if (index > 0) updateSession({ ...session, index: index - 1 }); else close(); }
  function next() {
    if (locked.current || !isValidAnswer(questions[index], answers[questions[index].id])) return;
    if (index < questions.length - 1) { updateSession({ ...session, index: index + 1 }); window.scrollTo({ top: 0, behavior: "instant" }); return; }
    const missing = questions.findIndex(question => !isValidAnswer(question, answers[question.id]));
    if (missing !== -1) { setError("Masih ada pertanyaan yang belum dijawab. Lengkapi dulu, ya."); updateSession({ ...session, index: missing }); return; }
    try {
      locked.current = true;
      const result = calculateResults(answers);
      setSubmitting(true);
      updateSession({ ...session, phase: "complete", result });
      // A short transition lets students understand that their answers were submitted.
      timer.current = setTimeout(() => router.replace("/quiz/results"), 1400);
    } catch { locked.current = false; setSubmitting(false); setError("Jawaban belum bisa diproses. Coba kirim lagi, ya."); }
  }
  if (submitting) return <QuizSubmitting />;
  return <>{warning && <p className="quiz-warning" role="status">{warning}</p>}{error && <p className="quiz-warning" role="alert">{error}</p>}{session.phase !== "active" ? <QuizIntroduction resume={session.phase !== "complete" && answered > 0} onStart={() => { locked.current = false; setError(""); updateSession(session.phase === "complete" ? { ...emptySession(), phase: "active" } : { ...session, phase: "active" }); }} /> : <main className="quiz-active"><QuizProgress index={index} answered={answered} onBack={back} onClose={close} /><QuizQuestion key={questions[index].id} question={questions[index]} index={index} value={answers[questions[index].id]} onChange={value => { setError(""); updateSession({ ...session, answers: { ...answers, [questions[index].id]: value } }); }} /><QuizNavigation index={index} answered={isValidAnswer(questions[index], answers[questions[index].id])} busy={submitting} onBack={back} onNext={next} /></main>}</>;
}
