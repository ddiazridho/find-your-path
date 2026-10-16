"use client";
import { useTranslation } from "@/app/i18n/provider";

export default function SkillList({ skills }: { skills: string[] }) {
  const { t: tx } = useTranslation();
  return (
    <div className="skill-list">{skills.map(skill => <span key={skill}>{tx(skill)}</span>)}</div>
  );
}
