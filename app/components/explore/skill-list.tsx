

export default function SkillList({ skills }: { skills: string[] }) {
  return (
    <div className="skill-list">{skills.map(skill => <span key={skill}>{skill}</span>)}</div>
  );
}
