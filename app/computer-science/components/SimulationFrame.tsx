"use client";
import { useTranslation } from "@/app/i18n/provider";
import type { ReactNode } from "react";

export default function SimulationFrame({ phase, total, label, children }: {
  phase: number; total: number; label: string; children: ReactNode;
}) {
  const { t: tx } = useTranslation();
  return <section className="cs-simulation" aria-label={tx("Computer Science simulation frame")}>
    <div className="cs-frame-top"><span><i aria-hidden="true" /> {tx(" Interactive simulation")}</span><span>{tx(label)}</span></div>
    {tx(children)}
    <div className="cs-frame-bottom"><span>{tx("Learn by making")}</span><div className="cs-phase-progress" aria-label={tx(`Stage ${phase} of ${total}`)}>
      {Array.from({ length: total }, (_, index) => <span key={index} className={index < phase ? "is-reached" : ""} />)}
    </div><span>{tx("Your pace. Your path.")}</span></div>
  </section>;
}
