"use client";
import { useTranslation } from "@/app/i18n/provider";
import { categories, type Category } from "../../majors";

export default function CategoryFilters({ category, onCategoryChange, count }: { category: Category; onCategoryChange: (category: Category) => void; count: number }) {
  const { t: tx } = useTranslation();
  return (
    <div className="filter-row">
      <div className="category-filters" role="group" aria-label={tx("Filter majors by field")}>
        {categories.map(item => (
          <button
            key={item}
            className={`filter-chip ${category === item ? "is-active" : ""}`}
            aria-pressed={category === item}
            onClick={() => onCategoryChange(item)}
          >
            {tx(item)}
          </button>
        ))}
      </div>
      <span className="result-count" role="status">
        {count} {tx(count === 1 ? "major" : "majors")} {tx(" to explore")}</span>
    </div>
  );
}
