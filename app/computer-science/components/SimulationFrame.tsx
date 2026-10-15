import type { ReactNode } from "react";

export default function SimulationFrame({ phase, total, label, children }: {
  phase: number; total: number; label: string; children: ReactNode;
}) {
  return <section className="cs-simulation" aria-label="Computer Science simulation frame">
    <div className="cs-frame-top"><span><i aria-hidden="true" /> Interactive simulation</span><span>{label}</span></div>
    {children}
    <div className="cs-frame-bottom"><span>Learn by making</span><div className="cs-phase-progress" aria-label={`Stage ${phase} of ${total}`}>
      {Array.from({ length: total }, (_, index) => <span key={index} className={index < phase ? "is-reached" : ""} />)}
    </div><span>Your pace. Your path.</span></div>
  </section>;
}
