"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Lightbulb } from "lucide-react";
import Instructor from "./Instructor";
import { lessons, type LessonStep, type Track } from "../lessons";

export function useProgress(signature: string) {
  const [step, setStep] = useState(0);
  const [review, setReview] = useState<{ key: string; error: string | null } | null>(null);
  const [finishedKey, setFinishedKey] = useState<string | null>(null);
  const key = `${step}:${signature}`;
  return {
    step, finished: finishedKey === key, verified: review?.key === key && review.error === null,
    feedback: review?.key === key ? review.error ?? "Step complete. Your work checks out!" : "",
    check: (error: string | null) => setReview({ key, error }),
    previous: () => { setStep(value => Math.max(0, value - 1)); setReview(null); },
    next: (count: number) => {
      if (review?.key !== key || review.error !== null) return;
      if (step === count - 1) setFinishedKey(key);
      else { setStep(value => value + 1); setReview(null); }
    },
    continueEditing: () => setFinishedKey(null),
  };
}
export type Progress = ReturnType<typeof useProgress>;

export function Guide({ track, steps, progress, validate, children }: {
  track: Track; steps: LessonStep[]; progress: Progress; validate: () => string | null; children?: ReactNode;
}) {
  const current = steps[progress.step];
  const lesson = lessons[track];
  const heading = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(progress.step);
  useEffect(() => {
    if (previousStep.current !== progress.step) {
      previousStep.current = progress.step;
      heading.current?.focus({ preventScroll: true });
    }
  }, [progress.step]);
  return <aside className="lab-guide cs-workspace-dialogue" aria-label="Step-by-step guide">
    <div className="cs-guide-speaker"><div className="cs-guide-portrait"><Instructor track={track} portrait mood={progress.verified ? "encouraging" : progress.feedback ? "thinking" : "speaking"} /></div><strong>{lesson.teacher}</strong><small>{lesson.role}</small></div>
    <div className="lab-guide-body">
      <div className="lab-step-dots" aria-label={`Step ${progress.step + 1} of ${steps.length}`}>{steps.map((step, index) => <span key={step.title} className={index <= progress.step ? "is-reached" : ""}>{index < progress.step ? <Check size={13} /> : index + 1}</span>)}</div>
      <h2 ref={heading} tabIndex={-1}>{current.title}</h2><p key={`instruction-${progress.step}`} className="cs-step-copy">{current.instruction}</p>
      {current.example && <pre className="lab-example"><code>{current.example}</code></pre>}
      <details key={`hint-${progress.step}`} className="lab-hint"><summary><Lightbulb size={16} />Need a hint?</summary><p>{current.hint}</p></details>
      {children}
      <p className={`lab-feedback ${progress.verified ? "is-success" : progress.feedback ? "has-error" : ""}`} role="status">{progress.feedback || "Take your time. Review your work when you are ready."}</p>
    </div>
    <div className="lab-guide-actions"><span className="cs-guide-action-note">STEP {progress.step + 1} OF {steps.length}</span><button className="lab-primary" onClick={() => progress.check(validate())}><CheckCircle2 size={17} />Review this step</button><button className="lab-primary" disabled={!progress.verified} onClick={() => progress.next(steps.length)}>{progress.step === steps.length - 1 ? "Finish project" : "Next step"}<ArrowRight size={17} /></button><button className="lab-quiet" disabled={progress.step === 0} onClick={progress.previous}><ArrowLeft size={15} />Previous instructions</button></div>
  </aside>;
}

export function Completion({ track, progress, children }: { track: Track; progress: Progress; children?: ReactNode }) {
  if (!progress.finished) return null;
  return <section className="lab-completion" aria-label="Project complete"><CheckCircle2 size={44} /><h2>You made it happen.</h2><p>{lessons[track].outcome}</p><p>What did you enjoy most: the problem solving, the making, or seeing your idea come to life?</p><div>{children}<button className="lab-secondary" onClick={progress.continueEditing}>Keep experimenting</button><Link className="lab-primary" href="/#explore">Explore another field<ArrowRight size={16} /></Link></div></section>;
}

export function saveFile(content: string, name: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
