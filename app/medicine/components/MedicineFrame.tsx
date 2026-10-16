"use client";
import { useTranslation } from "@/app/i18n/provider";
import Link from "next/link";
import type { ReactNode } from "react";
import { medicineTracks } from "../tracks";
import "../medicine.css";

export default function MedicineFrame({ current, eyebrow, title, intro, children }: { current: string; eyebrow: string; title: string; intro: string; children: ReactNode }) {
  const { t: tx } = useTranslation();
  return <main className="med-page">
    <div className="med-layout"><aside className="med-sidebar"><div className="med-sidebar-top"><span className="med-sidebar-kicker">{tx("MEDICINE LAB")}</span><h2>{tx("Learn by")}<br /><em>{tx("noticing.")}</em></h2><p>{tx("Four small simulations. One important habit: slow down, look closely, and share what you find.")}</p></div><nav className="med-track-nav" aria-label={tx("Choose a simulation")}>{medicineTracks.map((track, index) => <Link key={track.href} className={current === track.href ? "is-current" : ""} aria-current={current === track.href ? "page" : undefined} href={track.href}><span className="med-track-number">0{index + 1}</span><span><strong>{tx(track.title)}</strong><small>{tx(track.subtitle)}</small></span><span aria-hidden="true">↗</span></Link>)}</nav><p className="med-sidebar-note">{tx("Fictional learning scenarios. Not medical advice or a substitute for professional training.")}</p></aside>
    <div className="med-main"><div className="med-heading"><div><span className="med-eyebrow">{tx(eyebrow)}</span><h1>{tx(title)}</h1><p>{tx(intro)}</p></div><span className="med-demo-badge">{tx("Interactive simulation")}</span></div>{tx(children)}<p className="med-mobile-note">{tx("Fictional learning scenario. Not medical advice or a substitute for professional training.")}</p></div></div>
  </main>;
}
