"use client";
import { useTranslation } from "@/app/i18n/provider";
import Link from "next/link";
import Icon from "../ui-icon";
import PossibilityBoard from "./possibility-board";

export default function Hero() {
  const { t: tx } = useTranslation();
  return (
    <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-copy"><h1 id="hero-title">{tx("Your future.")}<br /> {tx(" Yours to ")}<span className="explore-word">{tx("explore")}<svg viewBox="0 0 310 16" fill="none" aria-hidden="true"><path d="M3 12C83 1 199 1 306 9" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /></svg></span>.</h1>
          <p>{tx("You don’t have to have it all figured out.")}<br className="desktop-break" /> {tx(" Try real-world challenges, find a major that feels like you, ")}<br className="desktop-break" /> {tx(" and discover the right university to make it happen.")}</p>
          <div className="hero-actions"><Link className="button button-primary" href="/quiz">{tx("Know your path")}<Icon name="arrow" /></Link><Link className="button button-text" href="/rekomendasi-universitas">{tx("Find University")}<Icon name="arrow" /></Link></div>
        </div>
        <PossibilityBoard />
      </section>
  );
}
