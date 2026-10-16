"use client";
import { useTranslation } from "@/app/i18n/provider";
import type { Major } from "../../majors";
import Icon from "../ui-icon";
import TaskPreview from "../task-preview";
import SkillList from "./skill-list";

export default function MajorCard({ major, onSelect }: { major: Major; onSelect: (major: Major) => void }) {
  const { t: tx } = useTranslation();
  return (
    <button className={`major-card tone-${major.color}`} onClick={() => onSelect(major)} aria-label={tx(`Preview ${major.name} simulation`)}>
      <div className="major-visual">
        <TaskPreview visual={major.visual} />
      </div>
      <div className="major-body">
        <h3>{tx(major.name)}</h3>
        <span className="major-category">{tx(major.category)}</span>
        <p>{tx(major.description)}</p>
        <SkillList skills={major.skills} />
        <div className="major-action">
          <span>{tx(major.task)}</span>
          <span className="card-arrow">
          <Icon name="arrow" />
          </span>
        </div>
      </div>
    </button>
  );
}
