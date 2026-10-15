"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "./questions";
import { calculateResults, isValidAnswer } from "./scoring";
import { emptySession } from "./storage";
import { updateSession, useQuiz } from "./use-quiz";
import { QuizIntroduction, QuizNavigation, QuizProgress, QuizQuestion } from "./components";
export default function QuizFlow() {
  const state = useQuiz();
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const locked = useRef(false);
  useEffect(() => { router.prefetch("/quiz/results"); }, [router]);
  useEffect(() => {
    if (state?.session.phase === "complete") router.replace("/quiz/results");
  }, [state?.session.phase, router]);
  if (!state) return <main className="quiz-intro" role="status">Menyiapkan asesmen...</main>;
  const { session, warning } = state;
  const { answers, index } = session;
  const answered = questions.filter(q => isValidAnswer(q, answers[q.id])).length;
  function pause() { if (!locked.current) updateSession({ ...session, phase: "intro" }); }
  function clear() {
    if (!window.confirm("Hapus semua jawaban dan hasil asesmen dari browser ini? Tindakan ini tidak dapat dibatalkan.")) return;
    locked.current = false; setError(""); updateSession(emptySession());
  }
  function back() {
    if (locked.current) return;
    setError("");
    if (index > 0) updateSession({ ...session, index: index - 1 }); else pause();
  }
  function next() {
    if (locked.current) return;
    setError("");
    if (index < questions.length - 1) {
      updateSession({ ...session, index: index + 1 }); return;
    }
    const missing = questions.findIndex(q => q.type !== "essay" && !isValidAnswer(q, answers[q.id]));
    if (missing !== -1) {
      const missingNumbers = questions.flatMap((q, i) => q.type === "essay" || isValidAnswer(q, answers[q.id]) ? [] : [i + 1]);
      setError(`Soal ${missingNumbers.join(", ")} belum dijawab. Lengkapi soal yang ditampilkan, lalu submit kembali.`);
      updateSession({ ...session, index: missing }); return;
    }
    locked.current = true; setBusy(true);
    try {
      const result = calculateResults(answers);
      updateSession({ ...session, phase: "complete", result });
    } catch {
      locked.current = false; setBusy(false);
      setError("Jawaban belum bisa diproses. Periksa kelengkapannya dan coba lagi.");
    }
  }
  return <>{warning && <p className="quiz-warning" role="status">{warning}</p>}{error && <p className="quiz-warning" role="alert">{error}</p>}
    {session.phase === "complete" ? <main className="quiz-intro" role="status">Menampilkan hasil asesmen…</main>
    : session.phase === "intro" ? <QuizIntroduction resume={answered > 0} onClear={clear} onStart={() => { locked.current = false; setBusy(false); setError(""); updateSession({ ...session, phase: "active" }); }} />
    : <main className="quiz-active"><QuizProgress index={index} answered={answered} onBack={back} onClose={pause} /><QuizQuestion key={questions[index].id} question={questions[index]} value={answers[questions[index].id]} onChange={value => { if (locked.current) return; setError(""); updateSession({ ...session, answers: { ...answers, [questions[index].id]: value } }); }} /><QuizNavigation index={index} answered={isValidAnswer(questions[index], answers[questions[index].id])} busy={busy} onBack={back} onNext={next} /></main>}
  </>;
}
