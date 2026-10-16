"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ClosingSection from "./closing-section";
import "./footer.css";

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isUniversity = pathname === "/rekomendasi-universitas";

  return (
    <footer className={`fyp-footer${isUniversity ? " fyp-footer-university" : ""}`} aria-label="Find Your Path">
      {isHome && <div className="section-divider section-divider-paper" aria-hidden="true" />}
      {isUniversity && <div className="section-divider fyp-footer-university-divider" aria-hidden="true" />}
      <ClosingSection />
      <div className="site-footer container">
        <Link href="/" className="footer-brand">find your path.</Link>
        <p className="footer-brand-description">A little more clarity. A lot more possibility.</p>
        <span>Made for your next chapter.</span>
      </div>
    </footer>
  );
}
