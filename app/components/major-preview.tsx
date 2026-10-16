"use client";
import { useTranslation } from "@/app/i18n/provider";

import Link from "next/link";
import type { MajorPreview as Preview } from "../major-types";
import Icon from "./ui-icon";

export default function MajorPreview({ preview, onNavigate }: { preview: Preview; onNavigate: () => void }) {
  const { t: tx } = useTranslation();
  if (preview.kind === "coming-soon") {
    return <p className="preview-note" role="status">{tx(preview.message)}</p>;
  }
  const fields = preview.kind === "fields"
    ? preview.fields.map(field => ({ href: field.href, name: `${tx(field.title)}${field.subtitle ? `: ${tx(field.subtitle)}` : ""}` }))
    : preview.simulations.map(simulation => ({ href: simulation.href, name: simulation.name }));

  return <nav className="major-field-picker" aria-label={tx(preview.kind === "fields" ? preview.label : "Choose a computer science simulation")}>
    {fields.map(field => <Link href={field.href} key={field.href} className="major-field-link" onClick={onNavigate}>
      <strong>{tx(field.name)}</strong><Icon name="arrow" />
    </Link>)}
  </nav>;
}
