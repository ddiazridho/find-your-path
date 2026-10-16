"use client";
import { useTranslation } from "@/app/i18n/provider";
export default function ClosingSection() {
  const { t: tx } = useTranslation();
  return (
    <section className="closing-section container">
      <div>
        <h2>{tx("You’re exploring, not committing.")}</h2>
        <p>{tx("Follow your curiosity. Try something unexpected. Your path can change as you do.")}</p>
      </div>
    </section>
  );
}
