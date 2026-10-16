"use client";
import { useTranslation } from "@/app/i18n/provider";
import Icon from "../ui-icon";

export default function SearchField({ query, onQueryChange }: { query: string; onQueryChange: (query: string) => void }) {
  const { t: tx } = useTranslation();
  return (
    <label className="search-field"><Icon name="search" /><span className="sr-only">{tx("Search majors or skills")}</span><input type="search" placeholder={tx("Search majors or skills…")} value={query} onChange={event => onQueryChange(event.target.value)} /></label>
  );
}
