import { FileText, Gavel, Landmark, Package, Scale, TreePine, Users } from "lucide-react";
import type { LawField, StoryScene } from "./stories";
import "./cinematic.css";

type Mood = "speaking" | "worried" | "listening" | "relieved";

function Figure({ role, name, mood = "listening" }: { role: string; name: string; mood?: Mood }) {
  return <div className={`law-figure law-figure--${role} law-figure--${mood}`} aria-hidden="true">
    <div className="law-figure-shadow" />
    <div className="law-figure-person"><span className="law-figure-hair" /><span className="law-figure-face"><i /><i /><b /></span><span className="law-figure-neck" /><span className="law-figure-coat" /><span className="law-figure-arm law-figure-arm--left" /><span className="law-figure-arm law-figure-arm--right" /><span className="law-figure-leg law-figure-leg--left" /><span className="law-figure-leg law-figure-leg--right" /></div>
    <span className="law-figure-label">{name}</span>
  </div>;
}

function Artifact({ scene }: { scene: StoryScene }) {
  if (!scene.artifact) return null;
  return <div className="law-scene-artifact"><span>{scene.artifact.label}</span><strong>{scene.artifact.text}</strong></div>;
}

function CourtWorld({ scene }: { scene: StoryScene }) {
  const isFlashback = scene.visual === "flashback";
  const isVerdict = scene.visual === "verdict";
  return <div className={`law-world law-world--court law-world--${scene.visual}`} aria-hidden="true">
    <div className="law-court-wall"><span className="law-court-window law-court-window--left" /><span className="law-court-window law-court-window--right" /><span className="law-court-seal"><Scale size={34} strokeWidth={1.4} /></span><span className="law-court-wall-line" /></div>
    <div className="law-world-floor" />
    <div className="law-court-bench"><div className="law-court-bench-front"><Gavel size={20} /></div></div>
    <div className="law-court-rail" />
    <div className="law-court-table law-court-table--left"><span /><span /></div><div className="law-court-table law-court-table--right"><span /><span /></div>
    <div className="law-court-witness-box" />
    <Figure role="judge" name="Judge" mood={isVerdict ? "speaking" : "listening"} />
    <Figure role="prosecutor" name="Prosecutor" mood={scene.speaker === "Prosecutor Sol" ? "speaking" : "listening"} />
    <Figure role="defense" name="Hana" mood={scene.speaker === "Hana" ? "speaking" : "listening"} />
    <Figure role="accused" name="Maya" mood={isVerdict && scene.chapter !== "A verdict too soon" ? "relieved" : "worried"} />
    <Figure role="witness" name={scene.speaker === "Inez" ? "Inez" : "Omar"} mood={scene.visual === "witness" ? "speaking" : "listening"} />
    <span className="law-court-spotlight" />
    {scene.visual === "evidence" && <div className="law-evidence-stand"><FileText size={28} /><span>EXHIBIT</span></div>}
    {isVerdict && <div className="law-verdict-flash" />}
    {isFlashback && <div className="law-flashback"><div className="law-flashback-grain" /><span className="law-flashback-caption">EARLIER · MUSEUM GALLERY</span><div className="law-museum-arch" /><div className="law-museum-case"><span className="law-necklace" /></div><div className="law-museum-person"><span /><i /></div><div className="law-museum-clock">6:12</div></div>}
    <Artifact scene={scene} />
  </div>;
}

function BakeryWorld({ scene }: { scene: StoryScene }) {
  const delivery = scene.visual === "delivery";
  return <div className={`law-world law-world--bakery law-world--${scene.visual}`} aria-hidden="true">
    <div className="law-bakery-wall"><div className="law-bakery-window"><span /><span /></div><div className="law-bakery-sign">BEA&apos;S <span>BAKERY</span></div><div className="law-bakery-shelf"><span /><span /><span /><span /><span /><span /></div></div>
    <div className="law-world-floor" />
    <div className="law-bakery-oven"><span className="law-oven-glow" /><span className="law-oven-tray" /></div>
    <div className="law-bakery-counter"><span className="law-pastry law-pastry--one" /><span className="law-pastry law-pastry--two" /><span className="law-pastry law-pastry--three" /><span className="law-steam law-steam--one" /><span className="law-steam law-steam--two" /></div>
    <div className="law-bakery-crates"><span /><span /><span /></div>
    {delivery && <div className="law-delivery-van"><span className="law-van-window" /><span className="law-van-wheel law-van-wheel--left" /><span className="law-van-wheel law-van-wheel--right" /><Package size={23} /></div>}
    <Figure role="baker" name="Bea" mood={scene.speaker === "Bea" ? "speaking" : "worried"} />
    <Figure role="supplier" name="Tomas" mood={scene.speaker === "Tomas" ? "speaking" : "listening"} />
    {(scene.visual === "order" || scene.visual === "negotiation") && <div className="law-bakery-order"><FileText size={22} /><span>ORDER</span><i /><i /><i /></div>}
    {scene.visual === "negotiation" && <div className="law-negotiation-line" />}
    <Artifact scene={scene} />
  </div>;
}

function ParkWorld({ scene }: { scene: StoryScene }) {
  const indoors = scene.visual === "office" || scene.visual === "meeting";
  const parkOpen = Boolean(scene.ending) && scene.chapter !== "A better decision is needed";
  return <div className={`law-world law-world--park law-world--${scene.visual} ${parkOpen ? "law-world--park-open" : ""}`} aria-hidden="true">
    <div className="law-park-sky"><span className="law-park-cloud law-park-cloud--one" /><span className="law-park-cloud law-park-cloud--two" /></div>
    <div className="law-park-city"><span /><span /><span /><span /><span /></div>
    <div className="law-park-grass" />
    <div className="law-park-tree law-park-tree--left"><TreePine size={100} strokeWidth={1.5} /></div><div className="law-park-tree law-park-tree--right"><TreePine size={120} strokeWidth={1.5} /></div>
    <div className="law-park-swing"><span /><span /></div>
    <div className="law-park-path" />
    <div className="law-park-fence"><span /><span /><span /><span /><span /><span /><span /></div>
    {(scene.visual === "notice" || scene.visual === "park") && <div className="law-park-notice"><strong>PARK CLOSED</strong><span>NO DETAILS</span></div>}
    <Figure role="resident" name="Amina" mood={scene.speaker === "Amina" ? "speaking" : "listening"} />
    <Figure role="clerk" name={scene.speaker === "Ben" || scene.speaker === "Resident Ben" ? "Ben" : "Eli"} mood={scene.speaker === "Eli" ? "speaking" : "listening"} />
    <div className={`law-government-room ${indoors ? "law-government-room--visible" : ""}`}><div className="law-government-columns"><span /><span /><span /></div><div className="law-government-sign"><Landmark size={20} /> CITY OFFICE</div><div className="law-government-board"><FileText size={23} /><i /><i /></div><div className="law-government-table" /><div className="law-government-people"><Users size={42} /></div><Figure role="office-resident" name="Amina" mood={scene.speaker === "Amina" ? "speaking" : "listening"} /><Figure role="official" name="Eli" mood={scene.speaker === "Eli" || scene.speaker === "City engineer" ? "speaking" : "listening"} /></div>
    <Artifact scene={scene} />
  </div>;
}

export default function CinematicWorld({ field, scene }: { field: LawField; scene: StoryScene }) {
  if (field === "criminal") return <CourtWorld scene={scene} />;
  if (field === "business") return <BakeryWorld scene={scene} />;
  if (field === "constitutional") return <ParkWorld scene={scene} />;
  return null;
}
