import Link from "next/link";
import Icon from "../ui-icon";
import PossibilityBoard from "./possibility-board";

export default function Hero() {
  return (
    <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-copy"><h1 id="hero-title">Your future.<br /> Yours to <span className="explore-word">explore<svg viewBox="0 0 310 16" fill="none" aria-hidden="true"><path d="M3 12C83 1 199 1 306 9" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /></svg></span>.</h1>
          <p>You don’t have to have it all figured out.<br className="desktop-break" /> Try real-world challenges, discover what clicks,<br className="desktop-break" /> and find a major that feels like you.</p>
          <div className="hero-actions"><Link className="button button-primary" href="/quiz">Know your path<Icon name="arrow" /></Link><Link className="button button-text" href="/rekomendasi-universitas">Find University<Icon name="arrow" /></Link></div>
        </div>
        <PossibilityBoard />
      </section>
  );
}
