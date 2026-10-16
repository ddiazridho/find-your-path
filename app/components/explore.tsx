"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { categories, type Category, type Major } from "../majors";
import Icon from "./ui-icon";
import TaskPreview from "./task-preview";
import MajorPreview from "./major-preview";

export default function Explore({ majors }: { majors: Major[] }) {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<Category>("All majors");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Major | null>(() => majors.find(major => major.id === searchParams.get("major")) ?? null);
  const dialog = useRef<HTMLDialogElement>(null);
  const filtered = majors.filter(major => (category === "All majors" || major.category === category) && `${major.name} ${major.category} ${major.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase().trim()));
  useEffect(() => {
    if (selected) {
      dialog.current?.showModal();
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = previous; };
    }
    dialog.current?.close();
  }, [selected]);
  function openMajor(major: Major) {
    setSelected(major);
  }
  function closeDialog() {
    dialog.current?.close();
    setSelected(null);
  }
  return <>
    <header className="site-header"><div className="container header-inner">
      <a href="#" className="brand" aria-label="Find Your Path home"><span className="brand-symbol"><Icon name="compass" /></span><span>find your path<span className="brand-period">.</span></span></a>
    </div></header>
    <main>
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-copy"><h1 id="hero-title">Your future.<br />Yours to <span className="explore-word">explore<svg viewBox="0 0 310 16" fill="none" aria-hidden="true"><path d="M3 12C83 1 199 1 306 9" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /></svg></span>.</h1>
          <p>You don’t have to have it all figured out.<br className="desktop-break" /> Try real-world challenges, discover what clicks,<br className="desktop-break" /> and find a major that feels like you.</p>
          <div className="hero-actions"><Link className="button button-primary" href="/quiz">Know your path<Icon name="arrow" /></Link><Link className="button button-text" href="/rekomendasi-universitas">Find University<Icon name="arrow" /></Link></div>
          <div className="hero-reassurance"><span><Icon name="check" />No right or wrong answers</span><span><Icon name="check" />Go at your own pace</span></div>
        </div>
        <div className="possibility-board" aria-label="Explore by doing: build, create, and understand">
          <div className="board-orbit" /><span className="board-note">A small taste of your next chapter</span>
          <div className="board-card board-build"><div className="board-code"><span>&lt;curiosity&gt;</span><br />&nbsp; build something<br />&nbsp; that matters.<br /><span>&lt;/curiosity&gt;</span></div><div className="board-card-bottom">Think it. Build it.<Icon name="arrow" /></div></div>
          <div className="board-card board-create"><div className="board-big-type">What<br /><em>if?</em><Icon name="spark" /></div><div className="board-card-bottom">See things differently.<Icon name="arrow" /></div></div>
          <div className="board-card board-human"><div className="board-human-title">A little empathy.<br />A whole new perspective.</div><div className="board-card-bottom">Understand someone.<Icon name="arrow" /></div></div>
        </div>
      </section>
      <section className="exploration-section" id="explore" aria-labelledby="explore-title"><div className="container">
        <div className="section-heading"><div><h2 id="explore-title">Big possibilities. Small first steps.</h2><p>Pick a major. Step into its world. See how it feels.</p></div><label className="search-field"><Icon name="search" /><span className="sr-only">Search majors or skills</span><input type="search" placeholder="Search majors or skills…" value={query} onChange={event => setQuery(event.target.value)} /></label></div>
        <div className="filter-row"><div className="category-filters" role="group" aria-label="Filter majors by field">{categories.map(item => <button key={item} className={`filter-chip ${category === item ? "is-active" : ""}`} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><span className="result-count" role="status">{filtered.length} {filtered.length === 1 ? "major" : "majors"} to explore</span></div>
        <div className="major-grid">{filtered.map(major => <button key={major.id} className={`major-card tone-${major.color}`} onClick={() => openMajor(major)} aria-label={`Preview ${major.name} simulation`}>
          <div className="major-visual"><TaskPreview visual={major.visual} /><span className="duration"><Icon name="clock" />{major.minutes} min</span></div>
          <div className="major-body"><h3>{major.name}</h3><span className="major-category">{major.category}</span><p>{major.description}</p><div className="skill-list">{major.skills.map(skill => <span key={skill}>{skill}</span>)}</div><div className="major-action"><span>{major.task}</span><span className="card-arrow"><Icon name="arrow" /></span></div></div>
        </button>)}</div>
        {filtered.length === 0 && <div className="empty-state"><Icon name="search" /><h3>No majors found yet</h3><p>Try a different keyword or explore all the fields.</p><button className="button button-primary" onClick={() => { setQuery(""); setCategory("All majors"); }}>Show all majors<Icon name="arrow" /></button></div>}
        <p className="preview-note">Try guided simulations in Computer Science, Law, and Medicine. Personal insights are coming next.</p>
      </div></section>
      <section className="closing-section container"><span className="closing-symbol"><Icon name="compass" /></span><div><h2>You’re exploring, not committing.</h2><p>Follow your curiosity. Try something unexpected. Your path can change as you do.</p></div></section>
    </main>
    <footer className="site-footer container"><a href="#" className="footer-brand">find your path.</a><p>A little more clarity. A lot more possibility.</p><span>Made for your next chapter.</span></footer>
    <dialog ref={dialog} className="preview-dialog major-preview-dialog" aria-labelledby="dialog-title" onCancel={closeDialog} onClose={closeDialog} onClick={event => { if (event.target === event.currentTarget) closeDialog(); }}>
      <button className="dialog-close" aria-label="Close preview" onClick={closeDialog} autoFocus><Icon name="close" /></button>
      {selected ? <div className="dialog-content">
        <h2 id="dialog-title">{selected.name}</h2>
        <span className="major-category">{selected.category} · {selected.minutes} minute preview</span>
        <p>{selected.description}</p>
        <div className="skill-list">{selected.skills.map(skill => <span key={skill}>{skill}</span>)}</div>
        <MajorPreview key={selected.id} preview={selected.preview} onNavigate={closeDialog} />
      </div> : null}
    </dialog>
  </>
}
