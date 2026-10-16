"use client";
import { useTranslation } from "@/app/i18n/provider";

import Link from "next/link";
import FeedbackCard from "./feedback-card";
import { useEffect, useRef, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, X, Check, Telescope, Sparkles, CircleHelp, Clock3, ListChecks, Repeat2, Wrench, FlaskConical, Palette, HandHeart, Megaphone } from "lucide-react";
import { dimensions, questions, ratingLabels, sectionLabel, ESSAY_MAX_LENGTH } from "./questions";
import type { AiMajorRecommendation, EssayAnalysis, InterestProfile, QuizAnswer, QuizQuestion as Question, QuizResult } from "./types";

export function QuizIllustration() {

  return <div className="assessment-illustration" aria-hidden="true"><div className="assessment-telescope"><Telescope size={88} strokeWidth={1.8} /></div><Sparkles className="assessment-spark" size={38} strokeWidth={1.8} /><CircleHelp className="assessment-help" size={36} strokeWidth={1.8} /></div>;
}
export function QuizIntroduction({ onStart, resume, onClear }: { onStart: () => void; resume: boolean; onClear: () => void }) {
  const { t: tx } = useTranslation();
  return <main className="quiz-intro assessment-welcome"><QuizIllustration /><h1>{tx("Yuk, Kenalan Sama ")}<span>{tx("Minatmu!")}</span></h1>
    <p className="assessment-lead">{tx("Temukan aktivitas yang menarik buatmu lewat pertanyaan minat, pilihan kegiatan, penalaran, dan refleksi singkat.")}</p>
    <div className="assessment-badges"><span><Clock3 size={20} aria-hidden="true" />{tx("Tanpa batas waktu")}</span><span><CircleHelp size={20} aria-hidden="true" />{questions.length} {tx(" pertanyaan")}</span></div>
    <button className="button quiz-primary" onClick={onStart}>{tx(resume ? "Lanjutkan Asesmen" : "Mulai Asesmen")}<ArrowRight size={19} /></button>
    <Link className="quiz-subtle-link" href="/#explore">{tx("Lihat jurusan dulu")}</Link>
    {resume && <><p className="quiz-resume">{tx("Progres terakhir tersimpan di perangkat ini.")}</p><button className="quiz-subtle-link" onClick={onClear}>{tx("Hapus jawaban dan mulai baru")}</button></>}
  </main>;
}
export function QuizProgress({ index, answered, onBack, onClose }: { index: number; answered: number; onBack: () => void; onClose: () => void }) {
  const { t: tx } = useTranslation();
  const percent = Math.round(answered / questions.length * 100);
  return <div className="quiz-progress"><div className="quiz-progress-top">
    <button className="quiz-icon-button" onClick={onBack} aria-label={tx(index ? "Pertanyaan sebelumnya" : "Kembali ke pengantar")}><ArrowLeft size={20} /></button>
    <span>{tx(sectionLabel(questions[index]))} · <strong>{index + 1}</strong> / {questions.length}</span>
    <button className="quiz-icon-button" onClick={onClose} aria-label={tx("Simpan progres dan kembali ke pengantar")}><X size={20} /></button>
  </div><div className="quiz-progress-line"><div className="quiz-bar" role="progressbar" aria-label={tx("Pertanyaan terjawab")} aria-valuenow={answered} aria-valuemin={0} aria-valuemax={30} aria-valuetext={tx(`${answered} dari 30 soal dijawab`)}><span style={{ width: `${percent}%` }} /></div><span>{answered}{tx("/30 dijawab")}</span></div></div>;
}
export function RatingScale({ question, value, onChange }: { question: Question; value?: QuizAnswer; onChange: (v: QuizAnswer) => void }) {
  const { t: tx } = useTranslation();
  return <fieldset className="quiz-options" aria-describedby="question-instruction"><legend className="sr-only">{tx(question.title)}</legend><div className="rating-grid">{ratingLabels.map((label, i) => <label key={label} className={`rating-card ${value === i + 1 ? "is-selected" : ""}`}><input type="radio" name={question.id} value={i + 1} checked={value === i + 1} onChange={() => onChange(i + 1)} /><span className="rating-number">{i + 1}</span><span>{tx(label)}</span><Check className="answer-check" size={17} aria-hidden="true" /></label>)}</div></fieldset>;
}
export function SingleChoiceOptions({ question, value, onChange }: { question: Extract<Question, { type: "situational" | "reasoning" }>; value?: QuizAnswer; onChange: (v: QuizAnswer) => void }) {
  const { t: tx } = useTranslation();
  return <fieldset className="quiz-options choice-grid" aria-describedby="question-instruction"><legend className="sr-only">{tx(question.title)}</legend>{question.options.map(o => <label key={o.id} className={`choice-card ${value === o.id ? "is-selected" : ""}`}><input type="radio" name={question.id} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} /><span className="choice-icon" aria-hidden="true">{tx(o.id)}</span><span>{tx(o.label)}</span><span className="choice-dot" aria-hidden="true">{value === o.id && <Check size={14} />}</span></label>)}</fieldset>;
}
export function QuizQuestion({ question, value, onChange }: { question: Question; value?: QuizAnswer; onChange: (v: QuizAnswer) => void }) {
  const { t: tx } = useTranslation();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    heading.current?.focus({ preventScroll: true });
  }, [question.id]);
  const instruction = question.type === "rating" ? "Pilih 1 = sangat tidak tertarik hingga 5 = sangat tertarik. Tidak ada jawaban benar atau salah." : question.type === "situational" ? "Pilih tindakan yang paling menggambarkan responsmu. Tidak ada jawaban benar atau salah." : question.type === "essay" ? "Tulis refleksi singkat dengan kata-katamu sendiri, atau biarkan kosong. Jawabanmu membantu AI membandingkan refleksi dengan profil RIASEC, tanpa mengubah skor. Hindari informasi pribadi sensitif." : "Pilih satu jawaban yang benar. Kerjakan sendiri, tanpa batas waktu.";
  return <section className="quiz-question" aria-labelledby="question-title"><h1 id="question-title" ref={heading} tabIndex={-1}>{tx(question.title)}</h1><p id="question-instruction" className="quiz-description">{tx(instruction)}</p>{question.type === "rating" ? <RatingScale question={question} value={value} onChange={onChange} /> : question.type === "essay" ? <div className="quiz-essay"><label htmlFor={question.id}>{tx("Jawaban refleksimu (opsional)")}</label><textarea id={question.id} value={typeof value === "string" ? value : ""} maxLength={ESSAY_MAX_LENGTH} rows={6} aria-describedby="question-instruction essay-count" onChange={e => onChange(e.target.value)} /><p id="essay-count">{typeof value === "string" ? value.length : 0}/{ESSAY_MAX_LENGTH} {tx(" karakter. Boleh dikosongkan.")}</p></div> : <SingleChoiceOptions question={question} value={value} onChange={onChange} />}</section>;
}
export function QuizNavigation({ index, answered, busy, onBack, onNext }: { index: number; answered: boolean; busy: boolean; onBack: () => void; onNext: () => void }) {
  const { t: tx } = useTranslation();
  return <footer className="quiz-navigation"><div><button className="button quiz-secondary" disabled={busy} onClick={onBack}><ArrowLeft size={17} />{tx("Sebelumnya")}</button>
    <p aria-live="polite">{tx(busy ? "Menyiapkan hasilmu…" : answered ? "Jawaban diisi. Kamu bisa lanjut atau mengubahnya." : "Isi jawaban, atau lanjut untuk mengisinya nanti.")}</p>
    <button className="button quiz-primary" disabled={busy} aria-busy={busy} onClick={onNext}>{tx(busy ? "Memproses…" : index === 29 ? "Submit Asesmen" : "Selanjutnya")}<ArrowRight size={17} /></button>
  </div></footer>;
}
function ProfileBars({ profile }: { profile: InterestProfile }) {
  const { t: tx, intlLocale } = useTranslation();
  return <div className="interest-bars">{dimensions.map(({ id, label }, index) => <div className={`interest-dimension interest-${id.toLowerCase()}`} key={id} style={{ "--bar-order": index } as CSSProperties}><div className="interest-label"><span>{tx(id)} · {tx(label)}</span><strong>{tx(new Intl.NumberFormat(intlLocale, { maximumFractionDigits: 1 }).format(profile[id]))}%</strong></div><div className="quiz-bar" role="meter" aria-label={tx(`Minat ${label}`)} aria-valuenow={profile[id]} aria-valuetext={tx(`${new Intl.NumberFormat(intlLocale, { maximumFractionDigits: 1 }).format(profile[id])}% minat`)} aria-valuemin={0} aria-valuemax={100}><span className="interest-fill" style={{ width: `${profile[id]}%` }} /></div></div>)}</div>;
}
const majorIcons = { R: Wrench, I: FlaskConical, A: Palette, S: HandHeart, E: Megaphone, C: ListChecks };
function RecommendedMajorCard({ recommendation, rank }: { recommendation: AiMajorRecommendation; rank: number }) {
  const { t: tx } = useTranslation();
  const MajorIcon = majorIcons[recommendation.primaryRiasec];
  return <li className={`recommended-major recommendation-row recommendation-type-${recommendation.primaryRiasec.toLowerCase()}`}>
    <span className="recommendation-visual" aria-hidden="true"><span className="recommendation-rank">{tx(String(rank).padStart(2, "0"))}</span><MajorIcon size={42} strokeWidth={1.6} /></span>
    <div className="recommendation-copy"><h3>{tx(recommendation.name)}</h3><p><span>{tx("Yang dipelajari")}</span>{tx(recommendation.studyOverview)}</p></div>
  </li>;
}
export function QuizResults({ result, analysis, analysisLoading, analysisError, onRetry, onRetake }: { result: QuizResult; analysis?: EssayAnalysis; analysisLoading: boolean; analysisError: boolean; onRetry: () => void; onRetake: () => void }) {
  const { t: tx } = useTranslation();
  const allTied = result.dominant.length === dimensions.length;
  const dominantLabel = result.dominant.map(id => dimensions.find(dimension => dimension.id === id)?.label.split(" · ")[0] ?? id).join(" & ");
  return <main className="quiz-results"><section className="results-hero">
    <h1>{tx("Kenali minatmu,")}<br />{tx("temukan arah eksplorasimu.")}</h1>
    <p>{tx("Ini gambaran ketertarikanmu saat ini. Gunakan untuk mulai mengeksplorasi, bukan menetapkan satu pilihan yang pasti benar.")}</p>
  </section><div className="results-content"><section className="interest-profile" aria-label={tx("Profil RIASEC")}>
    <section className="interest-summary" aria-labelledby="summary-title"><h3 id="summary-title">{tx("Ringkasan Hasil RIASEC")}</h3><ProfileBars profile={result.profile} /></section>
    <div className="insight-grid" aria-live="polite">
      <article className="insight-card insight-dominant" aria-labelledby="dominant-insight-title"><h3 id="dominant-insight-title">{tx(allTied ? "Semua tipe RIASEC seimbang" : dominantLabel)}</h3>
        {analysis ? <p>{tx(analysis.dominantReasoning)}</p> : analysisLoading ? <p role="status">{tx("AI sedang membaca pola jawaban minatmu…")}</p> : analysisError ? <p>{tx("Penjelasan AI belum berhasil dibuat. Skor RIASEC di atas tetap tersedia.")}</p> : null}
      </article>
      <article className="insight-card insight-essay" aria-labelledby="essay-analysis-title"><h3 id="essay-analysis-title">{tx("Refleksi esaimu")}</h3>
        {analysis ? <><strong>{tx(({ sejalan: "Sejalan dengan profil", sebagian: "Sebagian sejalan", berbeda: "Menunjukkan arah lain", tidak_cukup_bukti: "Belum cukup bahan" })[analysis.alignment])}</strong><p>{tx(analysis.reasoning)}</p></> : analysisLoading ? <p role="status">{tx("AI sedang membandingkan esai dan profilmu…")}</p> : analysisError ? <><p>{tx("Perbandingan esai belum berhasil dibuat.")}</p><button className="button quiz-secondary" onClick={onRetry}>{tx("Coba analisis lagi")}</button></> : null}
        <p className="quiz-fine-print">{tx("Jawaban dihasilkan oleh AI, jawaban yang kurang relevan diabaikan dalam ringkasan.")}</p>
      </article>
    </div>
  </section><section className="recommendations-section" aria-labelledby="recommendations-title">
    <h2 id="recommendations-title">{tx("Rekomendasi jurusan")}</h2>
    <p>{tx("Pilihan dari AI berdasarkan persentase minat RIASEC-mu.")}</p>
    {analysis ? <ol className="recommendation-grid">{analysis.recommendations.map((item, index) => <RecommendedMajorCard key={item.name} recommendation={item} rank={index + 1} />)}</ol>
      : analysisLoading ? <p role="status">{tx("AI sedang menyiapkan rekomendasi jurusan…")}</p>
      : analysisError ? <div className="recommendation-unavailable"><p>{tx("Rekomendasi jurusan belum berhasil dibuat.")}</p><button className="button quiz-secondary" onClick={onRetry}>{tx("Coba analisis lagi")}</button></div> : null}
  </section><div className="quiz-actions result-actions"><Link href="/#explore" className="button quiz-primary">{tx("Eksplore Semua Jurusan")}<ArrowRight size={17} /></Link><button className="button quiz-secondary" onClick={onRetake}><Repeat2 size={18} aria-hidden="true" />{tx("Ulangi Kuis")}</button></div><FeedbackCard /></div></main>;
}
