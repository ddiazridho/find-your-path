"use client";
import { useTranslation } from "@/app/i18n/provider";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ClosingSection from "./closing-section";
import "./footer.css";

export default function Footer() {
  const { t: tx } = useTranslation();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isUniversity = pathname === "/rekomendasi-universitas";

  if (pathname === "/quiz") return null;

  return (
    <footer className={`fyp-footer${isHome ? " fyp-footer-home" : ""}${isUniversity ? " fyp-footer-university" : ""}`} aria-label={tx("Find Your Path")}>
      <div className="section-divider fyp-footer-divider" aria-hidden="true" />
      <ClosingSection />
      <div className="site-footer container">
        <Link href="/" className="footer-brand">{tx("find your path.")}</Link>
        <p className="footer-brand-description">{tx("A little more clarity. A lot more possibility.")}</p>
        <span>{tx("Made for your next chapter.")}</span>
      </div>
    </footer>
  );
}
