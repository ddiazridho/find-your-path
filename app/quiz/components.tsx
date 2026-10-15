"use client";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, X, Check, Telescope, Sparkles, CircleHelp, Clock3, ListChecks, Repeat2, Play, Code2, Scale, Stethoscope, Braces, Database, HeartPulse } from "lucide-react";
import Icon from "../components/ui-icon";
import { dimensions, questions, ratingLabels, sectionLabel, ESSAY_MAX_LENGTH } from "./questions";
import type { EssayAnalysis, InterestProfile, MajorRecommendation, QuizAnswer, QuizQuestion as Question, QuizResult, Riasec } from "./types";

export function QuizHeader() {
  return <header className="site-header"><div className="container header-inner">
    <Link href="/" className="brand" aria-label="Find Your Path, beranda"><span className="brand-symbol"><Icon name="compass" /></span><span>find your path<span className="brand-period">.</span></span></Link>
    <nav aria-label="Navigasi utama"><Link href="/#explore">Jelajahi Jurusan</Link></nav>
    <span className="header-note">Mulai dari rasa penasaran<Icon name="spark" /></span>
  </div></header>;
}
export function QuizIllustration() {
  return <div className="assessment-illustration" aria-hidden="true"><div className="assessment-telescope"><Telescope size={88} strokeWidth={1.8} /></div><Sparkles className="assessment-spark" size={38} strokeWidth={1.8} /><CircleHelp className="assessment-help" size={36} strokeWidth={1.8} /></div>;
}
export function QuizIntroduction({ onStart, resume, onClear }: { onStart: () => void; resume: boolean; onClear: () => void }) {
  return <main className="quiz-intro assessment-welcome"><QuizIllustration /><h1>Yuk, Kenalan Sama <span>Minatmu!</span></h1>
    <p className="assessment-lead">Temukan aktivitas yang menarik buatmu lewat pertanyaan minat, pilihan kegiatan, penalaran, dan refleksi singkat.</p>
    <div className="assessment-badges"><span><Clock3 size={20} aria-hidden="true" />Tanpa batas waktu</span><span><CircleHelp size={20} aria-hidden="true" />{questions.length} pertanyaan</span></div>
    <button className="button quiz-primary" onClick={onStart}>{resume ? "Lanjutkan Asesmen" : "Mulai Asesmen"}<ArrowRight size={19} /></button>
    <Link className="quiz-subtle-link" href="/#explore">Lihat jurusan dulu</Link>
    {resume && <><p className="quiz-resume">Progres terakhir tersimpan di perangkat ini.</p><button className="quiz-subtle-link" onClick={onClear}>Hapus jawaban dan mulai baru</button></>}
    <details className="assessment-instructions"><summary><ListChecks size={17} aria-hidden="true" />Petunjuk dan privasi jawaban</summary><div><p>12 soal minat, 6 situasional, 8 penalaran, dan 4 esai refleksi. Kerjakan sendiri; pada bagian penalaran, pilih jawaban yang benar. Esai boleh dikosongkan. Setelah selesai, tekan Submit Asesmen untuk membuka hasil.</p><p>Jawaban tersimpan di browser ini. Saat hasil dibuka, jawaban dikirim ke server untuk menghitung ulang profil; esai yang diisi dikirim ke OpenAI untuk dibuat ringkasan keselarasan. Hindari informasi pribadi sensitif. Pengguna lain pada browser yang sama dapat mengakses jawaban dan ringkasan. Kamu bisa menghapusnya dengan mengulang kuis.</p></div></details>
    <p className="quiz-fine-print assessment-disclaimer">Belum tervalidasi secara psikometrik. Hasil adalah panduan eksplorasi, bukan penentu jurusan atau jaminan kesuksesan.</p>
  </main>;
}
export function QuizProgress({ index, answered, onBack, onClose }: { index: number; answered: number; onBack: () => void; onClose: () => void }) {
  const percent = Math.round(answered / questions.length * 100);
  return <div className="quiz-progress"><div className="quiz-progress-top">
    <button className="quiz-icon-button" onClick={onBack} aria-label={index ? "Pertanyaan sebelumnya" : "Kembali ke pengantar"}><ArrowLeft size={20} /></button>
    <span>{sectionLabel(questions[index])} · <strong>{index + 1}</strong> / {questions.length}</span>
    <button className="quiz-icon-button" onClick={onClose} aria-label="Simpan progres dan kembali ke pengantar"><X size={20} /></button>
  </div><div className="quiz-progress-line"><div className="quiz-bar" role="progressbar" aria-label="Pertanyaan terjawab" aria-valuenow={answered} aria-valuemin={0} aria-valuemax={30} aria-valuetext={`${answered} dari 30 soal dijawab`}><span style={{ width: `${percent}%` }} /></div><span>{answered}/30 dijawab</span></div></div>;
}
export function RatingScale({ question, value, onChange }: { question: Question; value?: QuizAnswer; onChange: (v: QuizAnswer) => void }) {
  return <fieldset className="quiz-options" aria-describedby="question-instruction"><legend className="sr-only">{question.title}</legend><div className="rating-grid">{ratingLabels.map((label, i) => <label key={label} className={`rating-card ${value === i + 1 ? "is-selected" : ""}`}><input type="radio" name={question.id} value={i + 1} checked={value === i + 1} onChange={() => onChange(i + 1)} /><span className="rating-number">{i + 1}</span><span>{label}</span><Check className="answer-check" size={17} aria-hidden="true" /></label>)}</div></fieldset>;
}
export function SingleChoiceOptions({ question, value, onChange }: { question: Extract<Question, { type: "situational" | "reasoning" }>; value?: QuizAnswer; onChange: (v: QuizAnswer) => void }) {
  return <fieldset className="quiz-options choice-grid" aria-describedby="question-instruction"><legend className="sr-only">{question.title}</legend>{question.options.map(o => <label key={o.id} className={`choice-card ${value === o.id ? "is-selected" : ""}`}><input type="radio" name={question.id} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} /><span className="choice-icon" aria-hidden="true">{o.id}</span><span>{o.label}</span><span className="choice-dot" aria-hidden="true">{value === o.id && <Check size={14} />}</span></label>)}</fieldset>;
}
export function QuizQuestion({ question, value, onChange }: { question: Question; value?: QuizAnswer; onChange: (v: QuizAnswer) => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    heading.current?.focus({ preventScroll: true });
  }, [question.id]);
  const instruction = question.type === "rating" ? "Pilih 1 = sangat tidak tertarik hingga 5 = sangat tertarik. Tidak ada jawaban benar atau salah." : question.type === "situational" ? "Pilih tindakan yang paling menggambarkan responsmu. Tidak ada jawaban benar atau salah." : question.type === "essay" ? "Tulis refleksi singkat dengan kata-katamu sendiri, atau biarkan kosong. Jawabanmu membantu AI membandingkan refleksi dengan profil RIASEC, tanpa mengubah skor. Hindari informasi pribadi sensitif." : "Pilih satu jawaban yang benar. Kerjakan sendiri, tanpa batas waktu.";
  return <section className="quiz-question" aria-labelledby="question-title"><h1 id="question-title" ref={heading} tabIndex={-1}>{question.title}</h1><p id="question-instruction" className="quiz-description">{instruction}</p>{question.type === "rating" ? <RatingScale question={question} value={value} onChange={onChange} /> : question.type === "essay" ? <div className="quiz-essay"><label htmlFor={question.id}>Jawaban refleksimu (opsional)</label><textarea id={question.id} value={typeof value === "string" ? value : ""} maxLength={ESSAY_MAX_LENGTH} rows={6} aria-describedby="question-instruction essay-count" onChange={e => onChange(e.target.value)} /><p id="essay-count">{typeof value === "string" ? value.length : 0}/{ESSAY_MAX_LENGTH} karakter. Boleh dikosongkan.</p></div> : <SingleChoiceOptions question={question} value={value} onChange={onChange} />}</section>;
}
export function QuizNavigation({ index, answered, busy, onBack, onNext }: { index: number; answered: boolean; busy: boolean; onBack: () => void; onNext: () => void }) {
  return <footer className="quiz-navigation"><div><button className="button quiz-secondary" disabled={busy} onClick={onBack}><ArrowLeft size={17} />Sebelumnya</button>
    <p aria-live="polite">{busy ? "Menyiapkan hasilmu…" : answered ? "Jawaban diisi. Kamu bisa lanjut atau mengubahnya." : "Isi jawaban, atau lanjut untuk mengisinya nanti."}</p>
    <button className="button quiz-primary" disabled={busy} aria-busy={busy} onClick={onNext}>{busy ? "Memproses…" : index === 29 ? "Submit Asesmen" : "Selanjutnya"}<ArrowRight size={17} /></button>
  </div></footer>;
}
const descriptions: Record<Riasec, string> = {
  R: "Kamu tertarik pada kegiatan praktis, menggunakan alat, dan membuat sesuatu yang bisa digunakan.",
  I: "Kamu tertarik menyelidiki pertanyaan, mencari bukti, dan memahami cara kerja sesuatu.",
  A: "Kamu tertarik mengekspresikan gagasan melalui karya, desain, dan pendekatan kreatif.",
  S: "Kamu tertarik membantu, mengajar, dan mendampingi orang lain.",
  E: "Kamu tertarik memimpin, menyampaikan ide, dan menggerakkan orang menuju tujuan bersama.",
  C: "Kamu tertarik mengatur informasi, mengikuti proses yang terstruktur, dan menjaga ketelitian.",
};
const typeName = (id: Riasec) => dimensions.find(d => d.id === id)!.label;
function ProfileBars({ profile }: { profile: InterestProfile }) {
  return <div className="interest-bars">{dimensions.map(({ id, label }, index) => <div className={`interest-dimension interest-${id.toLowerCase()}`} key={id} style={{ "--bar-order": index } as CSSProperties}><div className="interest-label"><span>{id} · {label}</span><strong>{new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(profile[id])}%</strong></div><div className="quiz-bar" role="meter" aria-label={`Minat ${label}`} aria-valuenow={profile[id]} aria-valuetext={`${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(profile[id])}% minat`} aria-valuemin={0} aria-valuemax={100}><span className="interest-fill" style={{ width: `${profile[id]}%` }} /></div></div>)}</div>;
}
function RecommendedMajorCard({ recommendation, profile, index }: { recommendation: MajorRecommendation; profile: InterestProfile; index: number }) {
  const { major, metadata, reasons, supporting, score } = recommendation;
  const highest = Math.max(...reasons.map(id => profile[id]));
  const relevant = reasons.filter(id => profile[id] === highest);
  const art = major.id === "computer-science" ? { icon: Code2, accent: Braces, detail: Database, label: "Teknologi" } : major.id === "law" ? { icon: Scale, accent: ListChecks, detail: CircleHelp, label: "Ilmu sosial" } : { icon: Stethoscope, accent: HeartPulse, detail: HeartPulse, label: "Kesehatan" };
  const MainIcon = art.icon, AccentIcon = art.accent, DetailIcon = art.detail;
  const simulation = major.id === "computer-science";
  const displayScore = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(score);
  return <article className={`recommended-major recommendation-row tone-${major.color}`} aria-labelledby={`major-${major.id}`}>
    <div className="recommendation-visual" aria-hidden="true"><span className="recommendation-rank">{index + 1}</span><span className="recommendation-orb" /><span className="recommendation-mini mini-top"><AccentIcon size={22} /></span><span className="recommendation-main-icon"><MainIcon size={48} strokeWidth={1.7} /></span><span className="recommendation-mini mini-bottom"><DetailIcon size={22} /></span></div>
    <div className="recommendation-body">
      <div className="recommendation-tags"><span>{art.label}</span><span>Keselarasan minat {displayScore}%</span></div>
      <h3 id={`major-${major.id}`}>{metadata.name}</h3><p className="recommendation-description">{metadata.description}</p>
      <div className="quiz-bar recommendation-score" role="meter" aria-label={`Keselarasan minat ${metadata.name}`} aria-valuenow={score} aria-valuetext={`${displayScore}% keselarasan minat`} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${score}%` }} /></div>
      <div className="recommendation-reason"><p><strong>Kenapa direkomendasikan? </strong>{highest > 0 ? `Minat ${relevant.map(typeName).join(" dan ")} berkaitan dengan kegiatan yang bisa kamu eksplorasi di ${metadata.name}.` : "Jurusan ini bisa menjadi pembanding saat kamu mencari aktivitas yang menarik bagimu; minat terkait belum menonjol."}{supporting.length > 0 && ` Pilihan situasionalmu juga mendukung minat ${typeName(supporting[0])}.`}</p></div>
      <div className="recommendation-actions">
        {simulation && <Link href={metadata.href} className="button quiz-primary"><Play size={18} aria-hidden="true" />Coba Simulasi</Link>}
        <Link href={`/?major=${encodeURIComponent(major.id)}#explore`} className="button quiz-secondary">Lihat Detail<ArrowRight size={18} aria-hidden="true" /></Link>
        <span className="simulation-availability">{simulation ? "Simulasi tersedia untuk dicoba" : "Simulasi masih dalam pengembangan"}</span>
      </div>
    </div>
  </article>;
}
export function QuizResults({ result, analysis, analysisLoading, analysisError, onRetry, onRetake }: { result: QuizResult; analysis?: EssayAnalysis; analysisLoading: boolean; analysisError: boolean; onRetry: () => void; onRetake: () => void }) {
  const allTied = result.dominant.length === dimensions.length;
  return <main className="quiz-results"><section className="results-hero">
    <h1>Kenali minatmu,<br />temukan arah eksplorasimu.</h1>
    <p>Ini gambaran ketertarikanmu saat ini. Gunakan untuk mulai mengeksplorasi, bukan menetapkan satu pilihan yang pasti benar.</p>
  </section><div className="results-content"><section className="interest-profile" aria-labelledby="profile-title">
    <div className="profile-description"><h2 id="profile-title">Profil RIASEC</h2>
      <p>{allTied ? "Keenam tipe memiliki nilai yang sama. Belum ada satu kecenderungan yang lebih menonjol." : `${result.dominant.length > 1 ? "Minat dominanmu memiliki nilai seri" : "Minat dominanmu"}: ${result.dominant.map(typeName).join("; ")}.`}</p>
      {!allTied && result.dominant.map(id => <p key={id}>{descriptions[id]}</p>)}
      <p className="quiz-fine-print">Grafik menunjukkan tingkat ketertarikan, bukan ukuran kemampuan. Minat bisa berkembang seiring pengalaman baru.</p>
    </div><section className="interest-summary" aria-labelledby="summary-title"><h3 id="summary-title">Ringkasan Minatmu</h3><ProfileBars profile={result.profile} /></section>
  </section><section className="essay-analysis" aria-labelledby="essay-analysis-title" aria-live="polite">
    <div><h2 id="essay-analysis-title">Refleksi esaimu</h2><p>Bagaimana ceritamu berkaitan dengan profil minat RIASEC.</p></div>
    <div className="essay-analysis-body">{analysis ? <><strong>{({ sejalan: "Sejalan dengan profil", sebagian: "Sebagian sejalan", berbeda: "Menunjukkan arah lain", tidak_cukup_bukti: "Belum cukup bahan" })[analysis.alignment]}</strong><p>{analysis.reasoning}</p>{analysis.ignoredQuestionIds.length > 0 && <small>{analysis.ignoredQuestionIds.length} jawaban yang belum relevan atau belum jelas tidak dipakai dalam ringkasan ini.</small>}</> : analysisLoading ? <p role="status">Sedang membaca refleksimu…</p> : analysisError ? <><p>Ringkasan esai belum berhasil dibuat. Profil dan rekomendasi RIASEC tetap tersedia.</p><button className="button quiz-secondary" onClick={onRetry}>Coba analisis lagi</button></> : null}</div>
    <p className="quiz-fine-print">Ringkasan AI ini untuk refleksi, bukan penilaian kemampuan atau penentu jurusan. Skor dan urutan rekomendasi tidak berubah.</p>
  </section><section className="recommendations-section" aria-labelledby="recommendations-title">
    <h2 id="recommendations-title">Jurusan untuk dieksplorasi</h2>
    <p>Berikut pilihan dari katalog kami yang bisa kamu kenali lebih jauh.</p>
    <div className="recommendation-grid">{result.recommendations.map((item, index) => <RecommendedMajorCard key={item.major.id} recommendation={item} profile={result.profile} index={index} />)}</div>
    {result.recommendations.length === 0 && <p>Rekomendasi belum tersedia. Kamu tetap bisa menjelajahi katalog secara mandiri.</p>}
    <p className="quiz-fine-print">Persentase menunjukkan keselarasan minat, bukan peluang keberhasilan. Katalog saat ini memuat tiga jurusan dan belum mencakup semua bidang minat. Hasil belum tervalidasi secara psikometrik dan tidak menjamin kesuksesan. Pertimbangkan juga kurikulum, biaya, pengalaman langsung, dan diskusi dengan guru BK.</p>
  </section><div className="quiz-actions result-actions"><Link href="/#explore" className="button quiz-primary">Eksplore Semua Jurusan<ArrowRight size={17} /></Link><button className="button quiz-secondary" onClick={onRetake}><Repeat2 size={18} aria-hidden="true" />Ulangi Kuis</button></div></div></main>;
}
