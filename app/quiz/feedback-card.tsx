"use client";
import { useTranslation } from "@/app/i18n/provider";

import { useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Frown, Meh, Send, Smile } from "lucide-react";
import type { AppFeedback } from "@/lib/feedback/schema";
import "./feedback-card.css";

const satisfactionOptions = [
  { value: "satisfied", label: "Puas", Icon: Smile },
  { value: "neutral", label: "Cukup puas", Icon: Meh },
  { value: "unsatisfied", label: "Belum puas", Icon: Frown },
] as const;

export default function FeedbackCard() {
  const { t: tx } = useTranslation();
  const [satisfaction, setSatisfaction] = useState<AppFeedback["satisfaction"] | "">("");
  const [topic, setTopic] = useState<AppFeedback["topic"]>("results");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const submissionId = useRef<string | null>(null);
  const sending = useRef(false);
  const confirmation = useRef<HTMLHeadingElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current || status === "sent") return;
    if (!satisfaction) { setError("Pilih tingkat kepuasanmu terlebih dahulu."); return; }
    sending.current = true;
    setStatus("sending");
    setError("");
    try {
      submissionId.current ??= crypto.randomUUID();
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: submissionId.current, satisfaction, topic, message }),
        signal: AbortSignal.timeout(45000),
      });
      const data = await response.json();
      if (!response.ok || data.saved !== true) throw new Error(typeof data.error === "string" ? data.error : "Masukan belum terkirim. Silakan coba lagi.");
      setStatus("sent");
      requestAnimationFrame(() => confirmation.current?.focus());
    } catch (caught) {
      setStatus("idle");
      setError(caught instanceof Error && caught.name === "Error" ? caught.message : "Masukan belum terkirim. Periksa koneksimu, lalu coba lagi. Isianmu tetap ada.");
    } finally {
      sending.current = false;
    }
  }

  return <section className="feedback-card" aria-labelledby="feedback-title">
    {status === "sent" ? <div className="feedback-confirmation" role="status">
      <CheckCircle2 size={32} aria-hidden="true" />
      <h2 id="feedback-title" ref={confirmation} tabIndex={-1}>{tx("Terima kasih sudah berbagi!")}</h2>
      <p>{tx("Masukanmu sudah terkirim dan akan membantu kami memperbaiki Find Your Path.")}</p>
    </div> : <>
      <h2 id="feedback-title">{tx("Bagaimana pengalamanmu?")}</h2>
      <p className="feedback-description">{tx("Apakah hasilnya membantu? Ceritakan yang kamu suka, kendala yang ditemui, atau ide untuk membuat aplikasi ini lebih baik.")}</p>
      <form onSubmit={submit} aria-label={tx("Feedback aplikasi")} aria-busy={status === "sending"}>
        <fieldset className="feedback-fields" disabled={status === "sending"}>
          <fieldset className="feedback-satisfaction">
            <legend>{tx("Seberapa puas kamu dengan hasil dan pengalamanmu?")}</legend>
            <div className="feedback-options">{satisfactionOptions.map(({ value, label, Icon }) => <label key={value}>
              <input type="radio" name="satisfaction" value={value} required checked={satisfaction === value} onChange={() => { setSatisfaction(value); setError(""); }} />
              <span><Icon size={22} aria-hidden="true" />{tx(label)}</span>
            </label>)}</div>
          </fieldset>
          <div className="feedback-field"><label htmlFor="feedback-topic">{tx("Masukan tentang")}</label>
            <select id="feedback-topic" value={topic} onChange={event => setTopic(event.target.value as AppFeedback["topic"])}>
              <option value="results">{tx("Hasil dan rekomendasi")}</option><option value="experience">{tx("Penggunaan aplikasi")}</option><option value="issue">{tx("Kendala atau keluhan")}</option><option value="suggestion">{tx("Saran lainnya")}</option>
            </select>
          </div>
          <div className="feedback-field"><label htmlFor="feedback-message">{tx("Ceritakan masukanmu ")}<span>{tx("(opsional)")}</span></label>
            <textarea id="feedback-message" value={message} onChange={event => setMessage(event.target.value)} maxLength={2000} rows={4} placeholder={tx("Misalnya, hasilnya cukup sesuai, tetapi ada bagian yang masih membingungkan…")} aria-describedby="feedback-count" />
            <p id="feedback-count" className="feedback-count">{message.length}{tx("/2.000 karakter")}</p>
          </div>
          <div className="feedback-submit"><button className="button button-primary" type="submit">{tx(status === "sending" ? "Mengirim…" : "Kirim masukan")}<Send size={16} aria-hidden="true" /></button></div>
        </fieldset>
        {tx(error && <p className="feedback-error" role="alert">{tx(error)}</p>)}
      </form>
    </>}
  </section>;
}
