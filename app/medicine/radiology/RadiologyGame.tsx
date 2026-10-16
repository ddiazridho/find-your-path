"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowRight, BookOpen, ClipboardCheck, Image as ImageIcon, Maximize2, Minus, Plus, RotateCcw, ScanLine } from "lucide-react";
import { medicineTracks } from "../tracks";
import "../emergency/emergency-game.css";
import "./radiology-game.css";

type Step = "arrival" | "verify" | "verifyFeedback" | "inspect" | "compare" | "compareFeedback" | "interpret" | "interpretFeedback" | "mark" | "handoff" | "ending" | "recap";
type Clue = "side" | "edge";
type Point = { x: number; y: number };

const arrival = [
  { speaker: "SCENE", text: "An illustrated forearm X-ray arrives at the reading station. Maya fell during basketball practice and says her left wrist hurts." },
  { speaker: "MAYA", text: "I tried to catch myself with my hand. It hurts near my wrist, but I can still move my fingers." },
  { speaker: "NURSE JO", text: "Before looking for an injury, we make sure the image belongs to the right person and shows the correct side. You can help me review it." },
];
const ending = [
  { speaker: "DR. LEE", text: "I received your marked image and your notes. I will review the full study with Maya's symptoms and examination before deciding what it means." },
  { speaker: "MAYA", text: "Thanks for explaining what you noticed. I feel better knowing someone will check the whole picture." },
];
const clueText: Record<Clue, string> = {
  side: "The image label says LEFT FOREARM. That matches Maya's painful side, so the team can compare the right study.",
  edge: "Near the wrist, one bright bone edge changes direction. It is an observation to flag, not a diagnosis by itself.",
};

function ForearmImage({ normal = false, marker, highlight = false }: { normal?: boolean; marker?: Point | null; highlight?: boolean }) {
  const id = normal ? "rd-normal" : "rd-case";
  return <>
    <defs>
      <linearGradient id={`${id}-bone`} x1="0" x2="1"><stop stopColor="#91b8be" /><stop offset=".48" stopColor="#f1f4df" /><stop offset="1" stopColor="#9bc5c6" /></linearGradient>
      <filter id={`${id}-glow`}><feGaussianBlur stdDeviation="6" /></filter>
    </defs>
    <rect width="400" height="520" fill="#102530" />
    <path d="M91 38 Q68 190 91 312 Q109 441 155 495 Q202 518 259 493 Q309 421 318 309 Q328 171 302 38Z" fill="#29434b" opacity=".75" />
    <g opacity=".35" filter={`url(#${id}-glow)`}><path d="M150 74 Q147 212 159 332 L171 420 Q184 440 198 424 L202 332 Q191 199 187 74Z" fill="#e3f6de" /><path d="M230 72 Q216 210 219 333 L222 426 Q238 441 253 421 L264 329 Q256 190 269 75Z" fill="#e3f6de" /></g>
    <path d={normal ? "M150 74 Q147 212 159 332 L169 407 Q181 439 198 424 L202 332 Q191 199 187 74Z" : "M150 74 Q147 212 159 332 L171 390 L169 407 L177 422 Q188 435 198 424 L202 332 Q191 199 187 74Z"} fill={`url(#${id}-bone)`} stroke="#d9f2e3" strokeWidth="3" />
    <path d="M230 72 Q216 210 219 333 L222 426 Q238 441 253 421 L264 329 Q256 190 269 75Z" fill={`url(#${id}-bone)`} stroke="#d9f2e3" strokeWidth="3" />
    <path d="M160 92 Q162 209 168 330 M245 93 Q233 204 233 330" stroke="#719ba0" strokeWidth="7" opacity=".38" fill="none" />
    <ellipse cx="184" cy="458" rx="22" ry="15" fill="#bddbd7" opacity=".8" /><ellipse cx="230" cy="461" rx="20" ry="15" fill="#bddbd7" opacity=".8" />
    {!normal && <><path d="M167 390 L180 398 L171 407" fill="none" stroke="#172936" strokeWidth="8" strokeLinejoin="round" /><path d="M169 389 L180 398 L171 406" fill="none" stroke="#f8f2d2" strokeWidth="2" /></>}
    {highlight && !normal && <circle cx="177" cy="399" r="29" fill="none" stroke="#f0c180" strokeWidth="3" strokeDasharray="7 5" />}
    {marker && !normal && <g transform={`translate(${marker.x} ${marker.y})`}><circle r="15" fill="#f5bf75" opacity=".25" /><circle r="6" fill="#ffc983" stroke="#14252d" strokeWidth="2" /><path d="M-19 0 H-10 M10 0 H19 M0 -19 V-10 M0 10 V19" stroke="#ffc983" strokeWidth="2" /></g>}
    <text x="19" y="30" fill="#c4ddd8" fontSize="13" letterSpacing="2">{normal ? "NORMAL REFERENCE" : "LEFT FOREARM"}</text>
    <text x="19" y="500" fill="#91adb0" fontSize="10">ILLUSTRATION · NOT A REAL SCAN</text>
  </>;
}

function Staff({ specialist = false }: { specialist?: boolean }) {
  return <div className={`eg-character rd-staff ${specialist ? "rd-specialist" : "rd-technologist"}`} role="img" aria-label={specialist ? "Dr. Lee, the radiology specialist" : "Nurse Jo at the reading station"}>
    <div className="eg-character-hair" /><div className="eg-character-face"><i /><i /></div><div className="eg-character-neck" />
    <div className="eg-character-body">{specialist ? <><span className="eg-coat-line" /><span className="eg-coat-pocket" /></> : <span className="eg-jo-cross">+</span>}</div>
    <div className="eg-character-arm eg-left-arm" /><div className="eg-character-arm eg-right-arm" /><div className="eg-character-legs" />
    <span className="eg-character-name">{specialist ? "DR. LEE" : "NURSE JO"}</span>
  </div>;
}

export default function RadiologyGame() {
  const [step, setStep] = useState<Step>("arrival");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [typing, setTyping] = useState({ text: "", count: 0 });
  const [clues, setClues] = useState<Clue[]>([]);
  const [activeClue, setActiveClue] = useState<Clue | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [marker, setMarker] = useState<Point | null>(null);
  const [zoom, setZoom] = useState(1);
  const [score, setScore] = useState(0);
  const imageRef = useRef<SVGGElement>(null);
  const phase = ["arrival", "verify", "verifyFeedback"].includes(step) ? 1 : step === "inspect" ? 2 : ["compare", "compareFeedback"].includes(step) ? 3 : ["interpret", "interpretFeedback"].includes(step) ? 4 : ["mark", "handoff"].includes(step) ? 5 : 6;
  const foundBoth = clues.length === 2;
  const choosing = step === "verify" || step === "interpret";
  let speaker = "NURSE JO";
  let dialogue = "";
  if (step === "arrival") ({ speaker, text: dialogue } = arrival[dialogueIndex]);
  if (step === "verify") dialogue = "What should we confirm before interpreting this image?";
  if (step === "verifyFeedback" || step === "interpretFeedback") dialogue = feedback;
  if (step === "inspect") { speaker = activeClue ? "OBSERVATION NOTES" : "NURSE JO"; dialogue = activeClue ? clueText[activeClue] : "Find two clues in the viewer: the side label and the bone edge near the wrist."; }
  if (step === "compare") dialogue = "A single image is easier to understand with context. Open the normal reference and compare the long, bright bone edges.";
  if (step === "compareFeedback") dialogue = "The reference edge runs smoothly toward the wrist. The case image has a small change near the lower end. Keep that observation in mind.";
  if (step === "interpret") dialogue = "What should you tell the specialist about the difference you noticed?";
  if (step === "mark") dialogue = "Mark the area you want reviewed. Tap the case image, or use the wrist marker button below it. You can adjust your marker before sending.";
  if (step === "handoff") dialogue = "Your annotation is ready. Send the image and your observations to the specialist for a full review.";
  if (step === "ending") ({ speaker, text: dialogue } = ending[dialogueIndex]);
  const shown = typing.text === dialogue ? typing.count : 0;
  const markerNearWrist = !!marker && marker.x >= 145 && marker.x <= 210 && marker.y >= 365 && marker.y <= 435;

  useEffect(() => {
    if (!dialogue) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => setTyping({ text: dialogue, count: dialogue.length }), 0);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setInterval(() => setTyping(previous => ({ text: dialogue, count: Math.min((previous.text === dialogue ? previous.count : 0) + 2, dialogue.length) })), 20);
    return () => window.clearInterval(timer);
  }, [dialogue]);

  function advance() {
    if (shown < dialogue.length) { setTyping({ text: dialogue, count: dialogue.length }); return; }
    if (step === "arrival") { if (dialogueIndex < arrival.length - 1) setDialogueIndex(index => index + 1); else { setDialogueIndex(0); setStep("verify"); } }
    else if (step === "verifyFeedback") setStep("inspect");
    else if (step === "inspect" && foundBoth) setStep("compare");
    else if (step === "compareFeedback") setStep("interpret");
    else if (step === "interpretFeedback") setStep("mark");
    else if (step === "mark" && marker) setStep("handoff");
    else if (step === "ending") { if (dialogueIndex < ending.length - 1) setDialogueIndex(index => index + 1); else setStep("recap"); }
  }
  function choose(correct: boolean) {
    if (correct) setScore(value => value + 1);
    if (step === "verify") {
      setFeedback(correct ? "Correct. The patient, left-side label, and painful area agree. That check keeps the team focused on the right image." : "Not yet. First confirm whose image this is, which side it shows, and where the patient hurts. Nurse Jo checks those details with you.");
      setStep("verifyFeedback");
    } else {
      setFeedback(correct ? "Exactly. Describe the change in the bone edge near the wrist and ask for specialist review. An image alone cannot establish a diagnosis." : "That is too certain. The image shows a difference worth reviewing, but a specialist must interpret it alongside Maya's symptoms and examination.");
      setStep("interpretFeedback");
    }
  }
  function inspect(clue: Clue) { if (step !== "inspect") return; setActiveClue(clue); setClues(previous => previous.includes(clue) ? previous : [...previous, clue]); }
  function placeMarker(event: PointerEvent<SVGSVGElement>) {
    if (step !== "mark") return;
    const matrix = imageRef.current?.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    setMarker({ x: Math.max(0, Math.min(400, point.x)), y: Math.max(0, Math.min(520, point.y)) });
  }
  function reset() { setStep("arrival"); setDialogueIndex(0); setFeedback(""); setTyping({ text: "", count: 0 }); setClues([]); setActiveClue(null); setCompareOpen(false); setMarker(null); setZoom(1); setScore(0); }
  const canAdvance = step === "arrival" || step === "verifyFeedback" || step === "compareFeedback" || step === "interpretFeedback" || step === "ending" || (step === "inspect" && foundBoth) || (step === "mark" && !!marker);

  return <main className="eg-page rd-page">
    <div className="eg-shell">
      <div className="eg-page-intro"><div><p className="eg-chapter">MEDICINE LAB <span>/</span> INTERACTIVE STORY</p><h1>What&apos;s inside the image<span>?</span></h1><p>Follow Maya&apos;s case from the first safety check to a careful specialist handoff.</p></div></div>
      <section className="eg-game" aria-label="What's inside the image interactive radiology story">
        <div className="eg-game-top"><span><i className="eg-live" /> LIVE SIMULATION <b>·</b> IMAGE REVIEW</span><span>CHAPTER {String(phase).padStart(2, "0")} <b>/</b> 06</span></div>
        <div className={`eg-scene rd-scene ${compareOpen ? "is-comparing" : ""}`} data-step={step}>
          <div className="rd-room" aria-hidden="true"><div className="rd-door"><span>RADIOLOGY</span></div><div className="rd-light" /><div className="rd-wall-label">READING ROOM <strong>02</strong></div><div className="rd-wall-band" /><div className="rd-floor" /><div className="rd-desk" /></div>
          <div className="rd-case-note" aria-hidden="true"><span>CASE / MAYA</span><strong>Left wrist pain</strong><small>Fall onto an outstretched hand</small></div>
          <Staff /><Staff specialist />
          <div className="rd-viewer">
            <div className="rd-viewer-head"><span><ScanLine size={13} /> FOREARM VIEWER</span><span>ILLUSTRATION</span></div>
            <div className="rd-image-stage"><svg viewBox="0 0 400 520" onPointerUp={placeMarker} role="img" aria-label="Illustrated left forearm X-ray. During the marking phase, tap the image to place a review marker." style={{ cursor: step === "mark" ? "crosshair" : "default", touchAction: "manipulation" }}><g ref={imageRef} transform={`translate(200 260) scale(${zoom}) translate(-200 -260)`}><ForearmImage marker={marker} highlight={step === "ending" || step === "recap"} /></g></svg>
              {step === "inspect" && <><button className={`rd-clue rd-clue-side ${clues.includes("side") ? "is-found" : ""}`} type="button" onClick={() => inspect("side")} aria-label="Inspect the left-side image label"><span />{clues.includes("side") ? "LABEL CHECKED" : "CHECK LABEL"}</button><button className={`rd-clue rd-clue-edge ${clues.includes("edge") ? "is-found" : ""}`} type="button" onClick={() => inspect("edge")} aria-label="Inspect the bone edge near the wrist"><span />{clues.includes("edge") ? "EDGE NOTED" : "CHECK EDGE"}</button></>}
            </div>
            <div className="rd-viewer-tools"><button type="button" onClick={() => setZoom(value => Math.max(1, +(value - .25).toFixed(2)))} aria-label="Zoom out" disabled={zoom === 1}><Minus size={13} /></button><span>{Math.round(zoom * 100)}%</span><button type="button" onClick={() => setZoom(value => Math.min(2, +(value + .25).toFixed(2)))} aria-label="Zoom in" disabled={zoom === 2}><Plus size={13} /></button><button type="button" onClick={() => setZoom(1)} aria-label="Reset zoom"><Maximize2 size={13} /></button>{step === "mark" && <button type="button" className="rd-wrist-shortcut" onClick={() => setMarker({ x: 177, y: 399 })}>Mark wrist</button>}</div>
          </div>
          {compareOpen && <div className="rd-reference"><div className="rd-reference-head"><ImageIcon size={13} /> NORMAL REFERENCE</div><svg viewBox="0 0 400 520" role="img" aria-label="Normal illustrative forearm image for comparison"><ForearmImage normal /></svg></div>}
          {step === "inspect" && <div className="rd-clue-count" aria-live="polite">FIND TWO CLUES <strong>{clues.length} / 2</strong></div>}
          {step === "compare" && <div className="rd-action"><p>COMPARE THE TWO IMAGES</p><button type="button" onClick={() => { setCompareOpen(true); setStep("compareFeedback"); }}><ImageIcon size={18} /> Open normal reference <ArrowRight size={17} /></button></div>}
          {step === "handoff" && <div className="rd-action"><p>READY FOR SPECIALIST REVIEW</p><button type="button" onClick={() => { setDialogueIndex(0); setStep("ending"); }}><ClipboardCheck size={18} /> Send image and observation <ArrowRight size={17} /></button></div>}
          {choosing && <div className="eg-choice-layer rd-choices" role="group" aria-label="Choose your response"><p>YOUR CALL, OBSERVER</p>{(step === "verify" ? ["Start looking for a break immediately; the label can wait.", "Confirm Maya's identity, the left-side label, and where she feels pain."] : ["Tell Maya the image proves a fracture and choose treatment now.", "Describe the uneven edge near the wrist and ask a specialist to review it."]).map((choice, index) => <button key={choice} type="button" onClick={() => choose(index === 1)}><span>{index === 0 ? "A" : "B"}</span><strong>{choice}</strong><ArrowRight size={16} /></button>)}</div>}
          {step === "recap" && <div className="eg-recap" role="dialog" aria-labelledby="rd-recap-title"><span className="eg-recap-icon"><ScanLine size={27} /></span><p className="eg-recap-label">CASE COMPLETE · RADIOLOGY</p><h2 id="rd-recap-title">You saw more than an image.</h2><p>{markerNearWrist ? "Your marker highlighted the uneven edge near the wrist. " : "Your marker flagged a different area; the uneven edge near the wrist is also highlighted. "}You verified the study, compared a reference, and shared an observation for specialist review.</p><div className="eg-recap-lesson"><strong>What radiology asks of you</strong><span>Careful observation, clear communication, and the humility to review an image in the context of the person.</span></div><div className="eg-recap-actions"><button type="button" onClick={reset} autoFocus><RotateCcw size={16} /> Play again</button><a href="#medicine-modules">Explore another module <ArrowRight size={16} /></a></div></div>}
          {step !== "recap" && <div className="eg-dialogue"><span className="sr-only" aria-live="polite">{speaker}: {dialogue}</span><div className="eg-dialogue-speaker"><span className="eg-speaker-avatar">{speaker === "SCENE" ? <BookOpen size={17} /> : speaker === "MAYA" ? "M" : speaker === "OBSERVATION NOTES" ? <ScanLine size={16} /> : speaker === "DR. LEE" ? "L" : "J"}</span><div><span>{speaker}</span><small>{speaker === "SCENE" ? "THE ARRIVAL" : speaker === "MAYA" ? "PATIENT" : speaker === "OBSERVATION NOTES" ? "IMAGE CLUE" : speaker === "DR. LEE" ? "SPECIALIST" : "IMAGING TEAM"}</small></div></div><div className="eg-dialogue-copy"><p aria-hidden="true">{dialogue.slice(0, shown)}<span className={shown < dialogue.length ? "eg-type-caret" : ""} /></p><div className="eg-dialogue-footer"><span>{step === "inspect" ? foundBoth ? "Both clues found. Continue the story." : "Tap the two glowing clues on the viewer." : step === "mark" ? marker ? "Marker placed. Continue to handoff." : "Tap the image or use Mark wrist." : choosing ? "Choose a response above." : step === "compare" ? "Open the reference above." : step === "handoff" ? "Send your observation above." : "A fictional learning story"}</span>{canAdvance && <button type="button" onClick={advance}>{shown < dialogue.length ? "Show all" : step === "ending" && dialogueIndex === ending.length - 1 ? "See what you learned" : "Continue"}<ArrowRight size={16} /></button>}</div></div></div>}
        </div>
        <div className="eg-game-bottom"><span>WHAT&apos;S INSIDE THE IMAGE</span><div aria-label={`Chapter ${phase} of 6`}>{[1, 2, 3, 4, 5, 6].map(item => <span key={item} className={item <= phase ? "is-active" : ""} />)}</div><span>OBSERVATION SCORE <strong>{score}</strong></span></div>
      </section>
      <nav id="medicine-modules" className="eg-modules grid grid-cols-4 gap-2.5 max-[900px]:grid-cols-2 max-[600px]:flex max-[600px]:overflow-x-auto" aria-label="Choose a medicine module">{medicineTracks.map((track, index) => <Link key={track.href} href={track.href} className={index === 3 ? "is-active" : ""} aria-current={index === 3 ? "page" : undefined}><span className="eg-module-number">0{index + 1}</span><span className="eg-module-name">{track.title}<small>{index === 3 ? "CURRENT STORY" : "EXPLORE STORY"}</small></span><ArrowRight size={17} /></Link>)}</nav>
      <p className="eg-disclaimer">Fictional learning simulation. Only qualified clinicians can interpret real images alongside symptoms and an examination.</p>
    </div>
  </main>;
}
