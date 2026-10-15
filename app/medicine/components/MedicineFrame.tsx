import Link from "next/link";
import type { ReactNode } from "react";
import { medicineTracks } from "../tracks";
import "../medicine.css";

export default function MedicineFrame({ current, eyebrow, title, intro, children }: { current: string; eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return <main className="med-page">
    <header className="med-header"><Link className="med-brand" href="/">find your path<span>.</span></Link><nav aria-label="Medicine stories"><Link href="/">All majors</Link><span aria-hidden="true">/</span><span>Medicine lab</span></nav></header>
    <div className="med-layout"><aside className="med-sidebar"><div className="med-sidebar-top"><span className="med-sidebar-kicker">MEDICINE LAB</span><h2>Learn by<br /><em>noticing.</em></h2><p>Four small simulations. One important habit: slow down, look closely, and share what you find.</p></div><nav className="med-track-nav" aria-label="Choose a simulation">{medicineTracks.map((track, index) => <Link key={track.href} className={current === track.href ? "is-current" : ""} aria-current={current === track.href ? "page" : undefined} href={track.href}><span className="med-track-number">0{index + 1}</span><span><strong>{track.title}</strong><small>{track.subtitle}</small></span><span aria-hidden="true">↗</span></Link>)}</nav><p className="med-sidebar-note">Fictional learning scenarios. Not medical advice or a substitute for professional training.</p></aside>
    <div className="med-main"><div className="med-heading"><div><span className="med-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{intro}</p></div><span className="med-demo-badge">Interactive simulation</span></div>{children}<p className="med-mobile-note">Fictional learning scenario. Not medical advice or a substitute for professional training.</p></div></div>
  </main>;
}
