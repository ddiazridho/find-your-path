"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowRight, ArrowUp, Compass, GripVertical, Sparkles } from "lucide-react";

const fields = ["Teknologi", "Bisnis"];
const levels = ["D3", "D4", "S1"];
const initialPriorities = [
  { id: "interest", title: "Sesuai minat", detail: "Belajar hal yang membuatku penasaran" },
  { id: "career", title: "Peluang karier", detail: "Pilihan pekerjaan setelah lulus" },
  { id: "budget", title: "Biaya kuliah", detail: "Tetap sesuai kemampuan finansial" },
  { id: "learning", title: "Cara belajar", detail: "Pengalaman kuliah yang cocok untukku" },
];

function formatRupiah(millions: number) {
  return millions === 0 ? "Rp0" : `Rp${millions} juta`;
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

type UniversityResult = {
  id: string; universitas: string; lokasi: string; jurusan: string; bidang: string; jenjang: string;
  biaya_min_per_semester: number; biaya_max_per_semester: number; catatan_biaya: string;
  url_sumber: string; tanggal_data: string; image_url: string; image_credit: string;
  image_source_url: string; reasoning: string;
};
type RecommendationResponse = { recommendations: UniversityResult[]; searched_count: number; message?: string };

export default function RecommendationForm() {
  const [interest, setInterest] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(15);
  const [priorities, setPriorities] = useState(initialPriorities);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<RecommendationResponse | null>(null);
  const resultsRef = useRef<HTMLElement>(null);

  function toggle(value: string, selected: string[], update: (items: string[]) => void) {
    update(selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value]);
  }

  function movePriority(from: number, to: number) {
    if (to < 0 || to >= priorities.length || from === to) return;
    const reordered = [...priorities];
    const [item] = reordered.splice(from, 1);
    reordered.splice(to, 0, item);
    setPriorities(reordered);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    if (interest.trim().length < 10) { setError("Ceritakan minatmu setidaknya 10 karakter."); return; }
    if (!selectedFields.length) { setError("Pilih setidaknya satu bidang."); return; }
    if (!selectedLevels.length) { setError("Pilih setidaknya satu jenjang."); return; }
    setPending(true);
    setError("");
    setResults(null);
    try {
      const response = await fetch("/api/university-recommendations", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          minat: interest.trim(), bidang: selectedFields, jenjang: selectedLevels,
          budget: { min: budgetMin * 1_000_000, max: budgetMax * 1_000_000 },
          prioritas: priorities.map(item => item.id),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "Rekomendasi belum dapat dimuat. Coba lagi nanti.");
      setResults(data as RecommendationResponse);
      requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Rekomendasi belum dapat dimuat. Coba lagi nanti.");
    } finally {
      setPending(false);
    }
  }

  return <div className="recommend-page">

    <main>
      <section className="recommend-intro container" aria-labelledby="recommend-title">
        <div className="recommend-intro-copy">
          <h1 id="recommend-title">Temukan universitas yang <em>lebih dekat</em> dengan dirimu.</h1>
          <p>Ceritakan minat, pilihan jenjang, dan batas biaya kuliahmu. Kami akan mencari program di universitas yang sesuai dengan pertimbanganmu.</p>
          <a href="#form-rekomendasi" className="button button-primary">Mulai isi pertimbangan <ArrowRight size={17} /></a>
        </div>
        <div className="recommend-intro-art" aria-hidden="true">
          <div className="recommend-note recommend-note-interest"><span>Yang membuatmu penasaran</span><strong>Ide, aktivitas, dan hal yang ingin dicoba.</strong><i>minat</i></div>
          <div className="recommend-note recommend-note-choice"><span>Yang penting untukmu</span><strong>Tujuan, jenjang, dan biaya kuliah.</strong><i>prioritas</i></div>
          <div className="recommend-art-path"><span /><span /><span /></div>
          <div className="recommend-art-stamp"><Compass size={25} /><span>Mulai dari ceritamu</span></div>
        </div>
      </section>

      <section className="recommend-form-section" id="form-rekomendasi" aria-labelledby="form-title"><div className="container recommend-form-layout">
        <aside className="recommend-side">
          <h2 id="form-title">Beri kami sedikit gambaran.</h2>
          <p>Jawabanmu membantu menyaring program universitas dan menentukan hal apa yang perlu dipertimbangkan lebih dulu.</p>
          <div className="recommend-side-note"><Sparkles size={18} /><div><strong>Tidak perlu yakin 100%.</strong><span>Tulis apa yang kamu tahu sekarang. Kamu bisa mengubah pilihanmu kapan saja.</span></div></div>
        </aside>

        <form className="recommend-form" aria-label="Pertimbangan rekomendasi universitas" onSubmit={submit}>
          <div className="recommend-form-heading"><div><h2>Ceritakan tentang dirimu</h2><p>Isi sesuai kondisi dan keinginanmu saat ini.</p></div><span>5 pertimbangan</span></div>

          <div className="recommend-field"><div className="recommend-field-heading"><label htmlFor="interest">Apa yang kamu minati?</label><span>01</span></div><p>Ceritakan kegiatan, topik, atau masalah yang membuatmu antusias.</p><textarea id="interest" value={interest} onChange={event => setInterest(event.target.value)} placeholder="Contoh: aku suka ngoding, bikin game, dan penasaran sama AI" rows={4} /><span className="recommend-hint">Tulis dengan bahasamu sendiri, tidak harus nama jurusan.</span></div>

          <fieldset className="recommend-field" aria-labelledby="fields-title"><div className="recommend-field-heading"><h3 id="fields-title">Bidang apa yang ingin kamu jelajahi?</h3><span>02</span></div><p>Pilih satu atau dua bidang yang tersedia dalam dataset saat ini.</p><div className="recommend-chip-list">{fields.map(field => <label key={field} className={`recommend-chip ${selectedFields.includes(field) ? "is-selected" : ""}`}><input type="checkbox" checked={selectedFields.includes(field)} onChange={() => toggle(field, selectedFields, setSelectedFields)} /><span>{field}</span></label>)}</div></fieldset>

          <fieldset className="recommend-field" aria-labelledby="levels-title"><div className="recommend-field-heading"><h3 id="levels-title">Jenjang kuliah yang kamu pertimbangkan</h3><span>03</span></div><p>Pilih satu atau lebih jika masih membandingkan pilihan.</p><div className="recommend-level-list">{levels.map(level => <label key={level} className={`recommend-level ${selectedLevels.includes(level) ? "is-selected" : ""}`}><input type="checkbox" checked={selectedLevels.includes(level)} onChange={() => toggle(level, selectedLevels, setSelectedLevels)} /><strong>{level}</strong><span>{level === "D3" ? "Diploma 3" : level === "D4" ? "Sarjana terapan" : "Sarjana"}</span></label>)}</div></fieldset>

          <div className="recommend-field"><div className="recommend-field-heading"><h3>Berapa budget kuliah per semester?</h3><span>04</span></div><p>Tentukan rentang yang nyaman. Hanya program dengan seluruh rentang biaya dalam batas ini yang ditampilkan.</p><div className="recommend-budget"><div className="recommend-budget-current"><span>Rentang per semester</span><strong>{formatRupiah(budgetMin)} – {formatRupiah(budgetMax)}</strong></div><div className="recommend-budget-slider"><label htmlFor="budget-min">Minimum</label><input id="budget-min" type="range" min="0" max="30" step="1" value={budgetMin} onChange={event => setBudgetMin(Math.min(Number(event.target.value), budgetMax))} style={{ "--range-progress": `${budgetMin / 30 * 100}%` } as React.CSSProperties} aria-valuetext={formatRupiah(budgetMin)} /></div><div className="recommend-budget-slider"><label htmlFor="budget-max">Maksimum</label><input id="budget-max" type="range" min="0" max="30" step="1" value={budgetMax} onChange={event => setBudgetMax(Math.max(Number(event.target.value), budgetMin))} style={{ "--range-progress": `${budgetMax / 30 * 100}%` } as React.CSSProperties} aria-valuetext={formatRupiah(budgetMax)} /></div><div className="recommend-range-labels"><span>Rp0</span><span>Rp30 juta</span></div></div></div>

          <div className="recommend-field"><div className="recommend-field-heading"><h3>Apa yang paling penting bagimu?</h3><span>05</span></div><p>Urutkan dari yang paling penting. Seret kartu atau gunakan tombol panah.</p><ol className="recommend-priorities">{priorities.map((item, index) => <li key={item.id} draggable onDragStart={event => { setDraggedId(item.id); event.dataTransfer.effectAllowed = "move"; }} onDragEnd={() => setDraggedId(null)} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); const from = priorities.findIndex(priority => priority.id === draggedId); if (from >= 0) movePriority(from, index); setDraggedId(null); }} className={draggedId === item.id ? "is-dragging" : ""}><GripVertical className="recommend-grip" size={18} aria-hidden="true" /><span className="recommend-rank">{index + 1}</span><span className="recommend-priority-copy"><strong>{item.title}</strong><small>{item.detail}</small></span><span className="recommend-priority-actions"><button type="button" onClick={() => movePriority(index, index - 1)} disabled={index === 0} aria-label={`Naikkan ${item.title}`}><ArrowUp size={16} /></button><button type="button" onClick={() => movePriority(index, index + 1)} disabled={index === priorities.length - 1} aria-label={`Turunkan ${item.title}`}><ArrowDown size={16} /></button></span></li>)}</ol></div>

          <div className="recommend-form-footer"><div><strong>Siap mencari pilihanmu?</strong><p>Hasil memakai 33 program dari 7 kampus. Biaya dan program perlu dicek kembali di sumbernya.</p></div><button type="submit" className="button button-primary" disabled={pending}>{pending ? "Mencari rekomendasi…" : "Lihat rekomendasi"}<ArrowRight size={17} /></button></div>
          {error && <p className="recommend-error" role="alert">{error}</p>}
        </form>
      </div></section>
      {results && <section className="recommend-results container" ref={resultsRef} aria-labelledby="results-title"><div className="recommend-results-heading"><div><h2 id="results-title">Pilihan universitas untukmu</h2><p>{results.recommendations.length ? `${results.searched_count} program lolos pencarian. Berikut pilihan kampus teratas berdasarkan prioritasmu.` : results.message}</p></div><a href="#form-rekomendasi" className="button button-text">Ubah pertimbangan <ArrowRight size={16} /></a></div>{results.recommendations.length > 0 && <div className="recommend-result-grid">{results.recommendations.map((item, index) => <article className="recommend-result-card" key={item.id}><div className="recommend-result-image"><Image src={item.image_url} alt={`Gedung kampus ${item.universitas}`} fill sizes="(max-width: 700px) 100vw, 33vw" /><span>Pilihan {index + 1}</span></div><div className="recommend-result-body"><span className="recommend-result-location">{item.lokasi} · {item.jenjang} · {item.bidang}</span><h3>{item.universitas}</h3><strong className="recommend-result-program">{item.jurusan}</strong><p>{item.reasoning}</p><div className="recommend-result-fee"><span>Biaya tercatat per semester</span><strong>{formatAmount(item.biaya_min_per_semester)} – {formatAmount(item.biaya_max_per_semester)}</strong><small>{item.catatan_biaya}</small></div><div className="recommend-result-links"><a href={item.url_sumber.split(" ; ")[0]} target="_blank" rel="noopener noreferrer">Sumber biaya <ArrowRight size={14} /></a></div></div></article>)}</div>}<p className="recommend-results-note">Data dikumpulkan {results.recommendations[0]?.tanggal_data ?? "dari dataset awal"}. Rentang biaya belum tentu mencakup biaya masuk, biaya hidup, atau perubahan tarif. Periksa informasi resmi kampus sebelum mengambil keputusan.</p></section>}
    </main>
    <footer className="site-footer container"><Link href="/" className="footer-brand">find your path.</Link><p>A little more clarity. A lot more possibility.</p><span>Made for your next chapter.</span></footer>
  </div>;
}
