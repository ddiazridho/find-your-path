"use client";
import { useTranslation } from "@/app/i18n/provider";
import Icon from "../ui-icon";

export default function EmptyState({ onReset }: { onReset: () => void }) {
  const { t: tx } = useTranslation();
  return (
    <div className="empty-state">
      <Icon name="search" />
      <h3>{tx("No majors found yet")}</h3>
      <p>{tx("Try a different keyword or explore all the fields.")}</p>
      <button className="button button-primary" onClick={onReset}>
        {tx("Show all majors")}<Icon name="arrow" />
      </button>
    </div>
  );
}
