"use client";

import { useState } from "react";
import Link from "next/link";
import type { MajorPreview as Preview, Simulation } from "../major-types";
import Icon from "./ui-icon";

export default function MajorPreview({ preview, onNavigate }: { preview: Preview; onNavigate: () => void }) {
  if (preview.kind === "fields") {
    return <div className="law-field-picker" aria-label={preview.label}>
      <p className="law-field-picker-intro">{preview.intro}</p>
      {preview.fields.map(field => <Link href={field.href} key={field.href} className="law-field-link" onClick={onNavigate}>
        <span><strong>{field.title}{field.subtitle && `: ${field.subtitle}`}</strong><small>{field.description}</small></span><Icon name="arrow" />
      </Link>)}
    </div>;
  }

  return <SimulationPreview simulations={preview.simulations} />;
}

function SimulationPreview({ simulations }: { simulations: Simulation[] }) {
  const [track, setTrack] = useState(simulations[0]?.id ?? "");
  const selected = simulations.find(simulation => simulation.id === track);
  if (!selected) return null;

  return <div className="simulation-section">
    <div className="simulation-field">
      <label htmlFor="simulation-track-select" className="simulation-label">Simulation Focus</label>
      <div className="simulation-select-wrap">
        <select id="simulation-track-select" className="simulation-select" value={track} onChange={event => setTrack(event.target.value)}>
          {simulations.map(simulation => <option key={simulation.id} value={simulation.id}>{simulation.name}</option>)}
        </select>
        <span className="simulation-select-icon" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
    <div className="simulation-preview-frame">
      {/* eslint-disable-next-line @next/next/no-img-element -- Local SVG previews keep their existing responsive CSS sizing. */}
      <img src={selected.image} alt={selected.alt} className="simulation-preview-img" />
    </div>
    <Link href={selected.href} className="button button-primary simulation-action">
      Try Simulation<Icon name="arrow" />
    </Link>
  </div>;
}
