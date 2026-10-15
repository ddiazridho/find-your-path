import type { Track } from "../lesson-types";
import Instructor from "./Instructor";

const boardCopy: Record<Track, [string, string, string]> = {
  software: ["Build something that matters.", "<h1>Hello World</h1>", "HTML  +  CSS  →  Your first website"],
  "embedded-system": ["A small button. A bright idea.", "POWER → SWITCH → RESISTOR → LED", "3 V battery  /  220 Ω  /  A closed loop"],
  networking: ["Make your first connection.", "PC-1 ─── SWITCH ─── PC-2", "192.168.1.10  /  192.168.1.11"],
  multimedia: ["Give a good idea a great poster.", "EVERYDAY", "Headline  /  Product  /  Offer  /  Action"],
};

export default function LabScene({ track, room }: { track: Track; room: string }) {
  const copy = boardCopy[track];
  return <div className={`cs-room cs-room--${track}`} role="img" aria-label={`${room}, with your instructor beside the project board and a prepared workbench`}>
    <svg className="cs-room-art" viewBox="0 0 1200 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path fill="#dae7de" d="M0 0h1200v300H0z" /><path fill="#a7bcb0" d="M0 300h1200v140H0z" />
      <path d="M0 294h1200M0 305h1200" stroke="#79a396" strokeWidth="8" />
      <path d="M0 366h1200M0 422h1200M200 300l-70 140m310-140-20 140m340-140 20 140m310-140 70 140" stroke="#8aa69b" strokeWidth="1" />
      <rect x="55" y="40" width="224" height="232" rx="3" fill="#f5f7e9" />
      <rect x="67" y="51" width="200" height="208" fill="#a4cdc6" />
      <path d="M67 208q67-99 200-52v103H67Z" fill="#83b2a4" /><path d="M67 230q120-65 200-30v59H67Z" fill="#62978a" />
      <path d="M168 51v208M67 154h200" stroke="#f5f7e9" strokeWidth="9" />
      <path d="M215 51 67 246v-64l99-131Z" fill="#eef9e8" opacity=".35" />
      <rect x="331" y="44" width="500" height="218" rx="6" fill="#93b4a5" />
      <rect x="343" y="55" width="476" height="192" rx="2" fill="#244e4b" />
      <path d="M349 250h468" stroke="#f1e6c5" strokeWidth="7" />
      <rect x="879" y="42" width="254" height="224" rx="5" fill="#c4d8c9" />
      <path d="M891 111h230m-230 71h230" stroke="#85a99b" strokeWidth="8" />
      <g fill="#76a89a"><rect x="902" y="69" width="18" height="36" rx="2" /><rect x="926" y="60" width="20" height="45" rx="2" /><rect x="954" y="75" width="15" height="30" rx="2" /></g>
      <g fill="#c19d79"><rect x="982" y="64" width="23" height="41" rx="2" /><rect x="1011" y="72" width="16" height="33" rx="2" /><rect x="1034" y="57" width="19" height="48" rx="2" /></g>
      <rect x="911" y="137" width="78" height="36" rx="4" fill="#507975" /><path d="M922 149h46m-46 10h32" stroke="#aad0bd" strokeWidth="3" />
      <path d="M1053 173q-24-40 5-45 28 6 5 45m-7-10q-36-26-41-2 2 20 41 12m4-15q31-34 44-14 9 20-44 29" fill="#5c9983" /><path d="m1040 171 5 29h30l5-29Z" fill="#e6d8bb" />
      <ellipse cx="585" cy="11" rx="155" ry="26" fill="#f9f9e9" />
      <path d="M270 356h509l30 26H240Z" fill="#bfa27b" /><path d="M240 382h569v16H240z" fill="#977e60" />
      <path d="M269 398v42m510-42v42" stroke="#6d7867" strokeWidth="12" />
      {track === "embedded-system" ? <g><rect x="432" y="322" width="159" height="42" rx="5" fill="#f3eedb" /><path d="M445 333h132m-132 10h132m-132 10h132" stroke="#a8b7a2" strokeWidth="2" strokeDasharray="2 5" /><path d="M460 322v-18h52v18" stroke="#a5684b" fill="none" strokeWidth="4" /><path d="M554 322v-18" stroke="#687d71" strokeWidth="4" /><circle cx="554" cy="300" r="9" fill="#cf7962" /></g> : <g><rect x="415" y="276" width="151" height="83" rx="6" fill="#456966" /><rect x="423" y="284" width="135" height="65" rx="2" fill="#183d3d" /><path d="m393 363 22-8h151l22 8Z" fill="#7d9b8d" />{track === "multimedia" ? <g><rect x="461" y="291" width="59" height="52" fill="#e8d4b3" /><rect x="479" y="311" width="20" height="26" rx="6" fill="#59877b" /><path d="M468 300h43" stroke="#50796d" strokeWidth="4" /></g> : <path d="M436 298h69m-69 12h104m-104 12h48m-48 12h89" stroke="#98c9ac" strokeWidth="3" />}</g>}
      <rect x="631" y="345" width="62" height="17" rx="3" fill="#e6d9b8" /><path d="M638 348h48m-48 5h48" stroke="#a5926b" />
    </svg>
    <div className="cs-project-board"><span>{copy[0]}</span><strong>{copy[1]}</strong><small>{copy[2]}</small></div>
    <div className="cs-scene-instructor"><Instructor track={track} /></div>
    <span className="cs-room-label">{room}</span>
  </div>;
}
