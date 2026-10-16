"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { type Category, type Major } from "../majors";
import Hero from "./explore/hero";
import ExplorationSection from "./explore/exploration-section";
import MajorPreviewDialog from "./explore/major-preview-dialog";

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
    <main>
      <div className="hero-divider" aria-hidden="true" />
      <Hero />
      <div className="section-divider section-divider-sky" aria-hidden="true" />
      <ExplorationSection filtered={filtered} query={query} setQuery={setQuery} category={category} setCategory={setCategory} openMajor={openMajor} />
    </main>
    <MajorPreviewDialog dialog={dialog} selected={selected} closeDialog={closeDialog} />
  </>
}
