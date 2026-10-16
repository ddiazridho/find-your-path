"use client";
import { useTranslation } from "@/app/i18n/provider";
import type { Category, Major } from "../../majors";
import SearchField from "./search-field";
import CategoryFilters from "./category-filters";
import MajorCard from "./major-card";
import EmptyState from "./empty-state";

export default function ExplorationSection({ filtered, query, setQuery, category, setCategory, openMajor }: {
  filtered: Major[];
  query: string;
  setQuery: (query: string) => void;
  category: Category;
  setCategory: (category: Category) => void;
  openMajor: (major: Major) => void;
}) {
  const { t: tx } = useTranslation();
  return (
    <section className="exploration-section" id="explore" aria-labelledby="explore-title"><div className="container">
        <div className="section-heading">
          <div>
            <h2 id="explore-title">{tx("Big possibilities. Small first steps.")}</h2>
            <p>{tx("Pick a major. Step into its world. See how it feels.")}</p>
          </div>
          <SearchField query={query} onQueryChange={setQuery} />
        </div>
        <CategoryFilters category={category} onCategoryChange={setCategory} count={filtered.length} />
        <div className="major-grid">
          {filtered.map(major => <MajorCard key={major.id} major={major} onSelect={openMajor} />)}
        </div>
        {filtered.length === 0 && <EmptyState onReset={() => { setQuery(""); setCategory("All majors"); }} />}
        <p className="preview-note">{tx("Try guided simulations in Computer Science, Law, and Medicine. Personal insights are coming next.")}</p>
      </div></section>
  );
}
