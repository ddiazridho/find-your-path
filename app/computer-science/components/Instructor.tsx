import type { Track } from "../lesson-types";

// Authored vector characters follow Medicine's flat illustrated cast without adding image requests.
export default function Instructor({ track, mood = "speaking", portrait = false }: {
  track: Track; mood?: "speaking" | "encouraging" | "thinking"; portrait?: boolean;
}) {
  const colors = {
    software: { skin: "#c68b70", hair: "#394b47", shirt: "#f6f5e9", accent: "#418679" },
    "embedded-system": { skin: "#d6a17c", hair: "#5b4135", shirt: "#d6a96e", accent: "#7b542d" },
    networking: { skin: "#97674f", hair: "#283d3d", shirt: "#7baca7", accent: "#214f53" },
    multimedia: { skin: "#d6a17e", hair: "#493e4a", shirt: "#bc9fba", accent: "#614b6e" },
  }[track];
  return <svg className={`cs-instructor cs-instructor--${mood}`} viewBox={portrait ? "36 0 148 172" : "0 0 220 350"} aria-hidden="true">
    <ellipse cx="110" cy="334" rx="73" ry="10" fill="#284f4626" />
    <g className="cs-instructor-body">
      <path d="M76 231h68l8 94h-35l-7-66-7 66H68Z" fill="#304b4b" />
      <path d="M68 319h36v14H57q-4-13 11-14m49 0h36q15 1 17 14h-53Z" fill="#233c3b" />
      <path d="M81 111h58q24 7 27 36l7 91q-63 22-126 0l7-91q3-29 27-36Z" fill={colors.shirt} />
      <path d="M91 89h38v33q-19 19-38 0Z" fill={colors.skin} />
      <path d="M90 119l20 22 20-22M110 141v106" stroke={colors.accent} strokeWidth="2" fill="none" />
      <path d="M55 135q-17 27-18 77l17 3 17-69M157 135q14 19 15 57l-17 7-15-55" fill={colors.shirt} />
      <path className="cs-instructor-hand" d="M164 193q15-3 17-27l3-18q4-7 8-1l-1 26q-1 35-25 40l-11-14Z" fill={colors.skin} />
      <path d="M38 211q-4 22 11 25l7-22Z" fill={colors.skin} />
      <path d="M72 47q0-40 38-40t39 41v47H72Z" fill={colors.hair} />
      <ellipse cx="110" cy="61" rx="31" ry="42" fill={colors.skin} />
      <path d="M79 49q-9-37 30-37 35-1 34 31-25-4-36-18-8 19-28 24Z" fill={colors.hair} />
      <g className="cs-instructor-eyes" fill="#293c37"><circle cx="98" cy="61" r="2.3" /><circle cx="122" cy="61" r="2.3" /></g>
      {mood === "thinking" ? <path d="M104 83h12" stroke="#774c42" strokeWidth="2" strokeLinecap="round" /> : <path d="M101 80q9 9 18 0" stroke="#774c42" strokeWidth="2" fill="none" strokeLinecap="round" />}
      {track === "networking" && <g stroke={colors.hair} fill="none" strokeWidth="2"><rect x="87" y="53" width="20" height="16" rx="5" /><rect x="113" y="53" width="20" height="16" rx="5" /><path d="M107 59h6" /></g>}
      <rect x="126" y="162" width="19" height="25" rx="3" fill="#f5f5e8" stroke={colors.accent} />
      <path d="M132 170h7m-7 5h7" stroke={colors.accent} strokeWidth="2" />
    </g>
  </svg>;
}
