"use client";

import Link from "next/link";
import type { MajorPreview as Preview } from "../major-types";
import Icon from "./ui-icon";

export default function MajorPreview({ preview, onNavigate }: { preview: Preview; onNavigate: () => void }) {
  const fields = preview.kind === "fields"
    ? preview.fields.map(field => ({ href: field.href, name: `${field.title}${field.subtitle ? `: ${field.subtitle}` : ""}` }))
    : preview.simulations.map(simulation => ({ href: simulation.href, name: simulation.name }));

  return <nav className="major-field-picker" aria-label={preview.kind === "fields" ? preview.label : "Choose a computer science simulation"}>
    {fields.map(field => <Link href={field.href} key={field.href} className="major-field-link" onClick={onNavigate}>
      <strong>{field.name}</strong><Icon name="arrow" />
    </Link>)}
  </nav>;
}
