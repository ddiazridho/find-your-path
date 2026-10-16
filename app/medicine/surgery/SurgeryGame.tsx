"use client";
import { useTranslation } from "@/app/i18n/provider";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Check, ClipboardCheck, RotateCcw, ScanLine } from "lucide-react";
import { medicineTracks } from "../tracks";
import "../emergency/emergency-game.css";
import "./surgery-game.css";

type Step = "briefing" | "firstChoice" | "firstFeedback" | "investigate" | "discrepancy" | "secondFeedback" | "prepare" | "ready" | "recap";
type Clue = "wristband" | "record";

const intro = [
  { speaker: "SCENE", text: "The operating room doors close. Bima waits on the table. Dr. Aris finishes scrubbing in while Nurse Maya prepares the room." },
  { speaker: "DR. ARIS", text: "Welcome to the OR! Here, we check the details before we act. Hey, first-day observer, what comes before anyone touches an instrument?" },
];
const openingChoices = [
  { letter: "A", text: "Start anesthesia and grab a scalpel to save time.", correct: false },
  { letter: "B", text: "Match Bima’s identity and complete the safety checklist.", correct: true },
];
const discrepancyChoices = [
  { letter: "A", text: "Follow the paper chart. It says right knee.", correct: false },
  { letter: "B", text: "Speak up! Bima and his wristband say left, but the chart says right.", correct: true },
];

export default function SurgeryGame() {
  const { t: tx } = useTranslation();
  const [currentStep, setCurrentStep] = useState<Step>("briefing");
  const [score, setScore] = useState(0);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [clues, setClues] = useState<Clue[]>([]);
  const [activeClue, setActiveClue] = useState<Clue | null>(null);
  const [toolsChecked, setToolsChecked] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [typing, setTyping] = useState({ text: "", count: 0 });
  const cluesComplete = clues.length === 2;
  const prepared = currentStep === "ready" || currentStep === "recap";
  const reconciled = currentStep === "prepare" || prepared;
  const choosing = currentStep === "firstChoice" || currentStep === "discrepancy";
  const phase = currentStep === "briefing" || currentStep === "firstChoice" || currentStep === "firstFeedback" ? 1 : currentStep === "investigate" ? 2 : currentStep === "discrepancy" || currentStep === "secondFeedback" ? 3 : 4;

  let speaker = "DR. ARIS";
  let dialogue = "";
  if (currentStep === "briefing") { speaker = intro[dialogueIndex].speaker; dialogue = intro[dialogueIndex].text; }
  if (currentStep === "firstChoice") dialogue = "What should we confirm before anyone touches the surgical tools?";
  if (currentStep === "firstFeedback" || currentStep === "secondFeedback") dialogue = feedback;
  if (currentStep === "investigate") {
    speaker = activeClue === "wristband" ? "BIMA" : activeClue === "record" ? "NURSE MAYA" : "DR. ARIS";
    dialogue = activeClue === "wristband"
      ? "Doctor... I injured my left leg playing futsal yesterday. My wristband says left knee, too."
      : activeClue === "record"
        ? "Wait... this chart says 'right knee surgery.' That does not match Bima's wristband."
        : "Find two clues. Tap Bima's wristband and the medical chart on the table.";
  }
  if (currentStep === "discrepancy") dialogue = "Nurse Maya has started preparing the right leg. Did you spot anything wrong?";
  if (currentStep === "prepare") dialogue = toolsChecked
    ? "The sterile tools have been counted. The team has rechecked Bima's identity, consent, and surgical site. Now ask Dr. Aris to mark the left knee."
    : "Good catch. We have stopped the right-side prep. The team is rechecking Bima's chart and consent. Tap the instrument table for the first count.";
  if (currentStep === "ready") dialogue = "Nice work! The team has confirmed and marked the left knee, and the sterile tools are counted. Surgeons protect patients by caring about every tiny detail.";
  dialogue = tx(dialogue);
  const visibleCharacters = typing.text === dialogue ? typing.count : 0;

  useEffect(() => {
    if (!dialogue) return;
    const timer = window.setInterval(() => setTyping(previous => ({ text: dialogue, count: Math.min((previous.text === dialogue ? previous.count : 0) + 2, dialogue.length) })), 22);
    return () => window.clearInterval(timer);
  }, [dialogue]);

  function inspect(clue: Clue) {
    if (currentStep !== "investigate") return;
    setActiveClue(clue);
    setClues(previous => previous.includes(clue) ? previous : [...previous, clue]);
  }
  function choose(correct: boolean) {
    if (currentStep === "firstChoice") {
      setScore(value => value + (correct ? 1 : -1));
      setFeedback(correct ? "Exactly! The patient, procedure, side, and checklist all need to match first. A sharp eye is a surgeon's superpower." : "Hold on! Acting before the checks are complete can put a patient at risk. Let's verify Bima and the plan first.");
      setCurrentStep("firstFeedback");
    } else {
      if (correct) setScore(value => value + 1);
      setFeedback(correct ? "Spot on! Thanks for speaking up. We will pause and check every source together before moving on." : "Not yet. The chart says right, but Bima and his wristband say left. We must report and resolve that mismatch.");
      setCurrentStep("secondFeedback");
    }
  }
  function continueStory() {
    if (visibleCharacters < dialogue.length) { setTyping({ text: dialogue, count: dialogue.length }); return; }
    if (currentStep === "briefing") {
      if (dialogueIndex === 0) setDialogueIndex(1);
      else setCurrentStep("firstChoice");
    } else if (currentStep === "firstFeedback") setCurrentStep("investigate");
    else if (currentStep === "investigate" && cluesComplete) setCurrentStep("discrepancy");
    else if (currentStep === "secondFeedback") setCurrentStep("prepare");
    else if (currentStep === "ready") setCurrentStep("recap");
  }
  function replay() { setCurrentStep("briefing"); setScore(0); setDialogueIndex(0); setClues([]); setActiveClue(null); setToolsChecked(false); setFeedback(""); }

  return <main className="eg-page sg-page">
    <div className="eg-shell">
      <div className="eg-page-intro"><div><p className="eg-chapter">{tx("MEDICINE LAB ")}<span>/</span> {tx(" INTERACTIVE STORY")}</p><h1>{tx("Before the first incision")}<span>.</span></h1><p>{tx("One mismatched detail. One important decision. Your first shift in the OR starts now.")}</p></div></div>
      <section className="eg-game" aria-label={tx("Operating room visual novel game")}>
        <div className="eg-game-top"><span><i className="eg-live" /> {tx(" LIVE SIMULATION ")}<b>·</b> {tx(" 08:30 AM")}</span><span>{tx("CHAPTER ")}{tx(String(phase).padStart(2, "0"))} <b>/</b> 04</span></div>
        <div className={`eg-scene sg-scene ${currentStep === "briefing" ? "sg-briefing" : ""} ${currentStep === "investigate" ? "sg-investigating" : ""} ${toolsChecked ? "sg-counted" : ""} ${prepared ? "sg-prepared" : ""}`}>
          <div className="sg-room" aria-hidden="true"><div className="sg-door"><span>{tx("OPERATING ROOM")}</span></div><div className="sg-wall-lines" /><div className="sg-floor" /><div className="sg-light sg-light-left" /><div className="sg-light sg-light-right" /><div className="sg-anesthesia"><span>{tx("ANESTHESIA")}</span><i /><i /><b>98</b></div><div className="sg-sink"><i /><span>{tx("SCRUB STATION")}</span></div></div>
          <div className="sg-room-label" aria-hidden="true">{tx("ROOM ")}<strong>02</strong><span>{tx("PREP PHASE")}</span></div>
          <div className="sg-bed" aria-hidden="true"><div className="sg-pillow" /><div className="sg-mattress" /><div className="sg-blanket" /><div className="sg-bed-base" /><div className="sg-bed-wheels" /></div>
          <div className="sg-bima" aria-label={tx("Bima waiting on the operating table")}><div className="sg-bima-hair" /><div className="sg-bima-face"><i /><i /></div><div className="sg-bima-neck" /><div className="sg-bima-body" /><div className="sg-bima-arm" /><div className="sg-bima-legs"><span className="sg-left-mark"><Check size={17} /></span></div></div>
          <div className="sg-staff sg-aris" aria-label={tx("Dr. Aris")}><div className="sg-staff-hair" /><div className="sg-staff-face"><i /><i /></div><div className="sg-staff-neck" /><div className="sg-staff-body"><span className="sg-scrub-collar" /></div><div className="sg-staff-arm sg-arm-left" /><div className="sg-staff-arm sg-arm-right" /><div className="sg-staff-legs" /><span className="sg-staff-name">{tx("DR. ARIS")}</span></div>
          <div className="sg-staff sg-maya" aria-label={tx("Nurse Maya")}><div className="sg-staff-hair" /><div className="sg-staff-face"><i /><i /></div><div className="sg-staff-neck" /><div className="sg-staff-body"><span className="sg-scrub-collar" /></div><div className="sg-staff-arm sg-arm-left" /><div className="sg-staff-arm sg-arm-right" /><div className="sg-staff-legs" /><span className="sg-staff-name">{tx("NURSE MAYA")}</span></div>
          <button type="button" className={`sg-record ${clues.includes("record") ? "is-found" : ""} ${currentStep === "investigate" ? "is-hotspot" : ""}`} onClick={() => inspect("record")} disabled={currentStep !== "investigate"} aria-label={tx("Inspect Bima's medical chart")}><span>{tx("MEDICAL CHART ")}<ScanLine size={14} /></span><strong>{tx("BIMA PRATAMA")}</strong><small>{tx("AGE 18 · PLANNED SURGERY")}</small><em>{tx(reconciled ? "LEFT KNEE" : clues.includes("record") ? "RIGHT KNEE" : "NOT CHECKED")}</em><span className="sg-record-foot">{tx(reconciled ? "TEAM VERIFIED" : clues.includes("record") ? "DETAILS DON'T MATCH" : "TAP TO INSPECT")}</span></button>
          <button type="button" className={`sg-wristband ${clues.includes("wristband") ? "is-found" : ""}`} onClick={() => inspect("wristband")} disabled={currentStep !== "investigate"} aria-label={tx("Inspect Bima's ID wristband")}><span className="sg-hotspot-ring" /><span>{tx("BIMA ID BAND")}</span></button>
          {currentStep === "investigate" && activeClue === "wristband" && <div className="sg-wristband-data"><strong>{tx("PATIENT WRISTBAND")}</strong><span>{tx("Bima Pratama · age 18")}</span><b>{tx("Left knee surgery")}</b></div>}
          {currentStep === "investigate" && activeClue === "record" && <div className="sg-wristband-data sg-record-data"><strong>{tx("MEDICAL CHART")}</strong><span>{tx("Bima Pratama · age 18")}</span><b>{tx("Right knee surgery")}</b></div>}
          <button type="button" className={`sg-tray ${toolsChecked ? "is-checked" : ""}`} onClick={() => { if (currentStep === "prepare") setToolsChecked(true); }} disabled={currentStep !== "prepare"} aria-label={tx("Check and count the sterile instruments")}><span className="sg-tray-label">{tx("STERILE INSTRUMENTS ")}{toolsChecked && <Check size={13} />}</span><span className="sg-tray-cover"><i /><i /><i /></span><span className="sg-tray-foot">{tx(toolsChecked ? "FIRST COUNT DONE" : "TAP TO CHECK")}</span></button>
          {currentStep === "discrepancy" && <div className="sg-side-alert">{tx("RIGHT SIDE PREPPED?")}</div>}
          {currentStep === "investigate" && <div className="eg-clue-counter" aria-live="polite">{tx("FIND TWO CLUES ")}<strong>{clues.length} / 2</strong></div>}
          {currentStep === "prepare" && <div className="eg-clue-counter">{tx(toolsChecked ? "TOOLS COUNTED" : "TAP THE INSTRUMENTS")} <strong>{tx(toolsChecked ? <Check size={13} /> : "!")}</strong></div>}
          {prepared && <div className="eg-stable-pill"><Check size={14} /> {tx(" LEFT SIDE VERIFIED")}</div>}
          {choosing && <div className="eg-choice-layer" role="group" aria-label={tx("Choose your response")}><p>{tx("YOUR CALL, OBSERVER")}</p>{(currentStep === "firstChoice" ? openingChoices : discrepancyChoices).map(choice => <button type="button" key={choice.letter} onClick={() => choose(choice.correct)}><span>{tx(choice.letter)}</span><strong>{tx(choice.text)}</strong><ArrowRight size={16} /></button>)}</div>}
          {currentStep === "prepare" && <div className="eg-action-layer sg-action-layer"><p>{tx(toolsChecked ? "READY FOR THE FINAL SAFETY CHECK" : "CHECK THE INSTRUMENTS FIRST")}</p><button type="button" disabled={!toolsChecked} onClick={() => setCurrentStep("ready")}><ClipboardCheck size={19} /> {tx(" Mark the left knee & count sterile tools ")}<ArrowRight size={18} /></button></div>}
          {currentStep === "recap" && <div className="eg-recap" role="dialog" aria-labelledby="sg-recap-title"><span className="eg-recap-icon"><ClipboardCheck size={27} /></span><p className="eg-recap-label">{tx("CASE COMPLETE")}</p><h2 id="sg-recap-title">{tx("You caught the detail.")}</h2><p>{tx("You spotted the mismatch and helped the team pause to confirm the correct surgical site.")}</p><div className="eg-recap-lesson"><strong>{tx("Medicine, with a focus on surgery")}</strong><span>{tx("It takes focus, precision, attention to detail, and real responsibility for patients.")}</span></div><div className="eg-recap-actions"><button type="button" onClick={replay} autoFocus><RotateCcw size={16} /> {tx(" Play again")}</button><a href="#medicine-modules">{tx("Explore another module ")}<ArrowRight size={16} /></a></div></div>}
          {currentStep !== "recap" && <div className="eg-dialogue absolute bottom-[3%] left-[3%] right-[3%] rounded-xl shadow-2xl backdrop-blur-md"><span className="sr-only" aria-live="polite">{tx(speaker)}: {tx(dialogue)}</span><div className="eg-dialogue-speaker"><span className={`eg-speaker-avatar ${speaker === "BIMA" ? "eg-avatar-nia" : speaker === "NURSE MAYA" ? "eg-avatar-jo" : ""}`}>{tx(speaker === "SCENE" ? <BookOpen size={17} /> : speaker === "BIMA" ? "B" : speaker === "NURSE MAYA" ? "M" : "A")}</span><div><span>{tx(speaker)}</span><small>{tx(speaker === "SCENE" ? "THE BRIEFING" : speaker === "DR. ARIS" ? "LEAD SURGEON" : speaker === "NURSE MAYA" ? "SCRUB NURSE" : "PATIENT")}</small></div></div><div className="eg-dialogue-copy"><p aria-hidden="true">{dialogue.slice(0, visibleCharacters)}<span className={visibleCharacters < dialogue.length ? "eg-type-caret" : ""} /></p><div className="eg-dialogue-footer"><span>{tx(currentStep === "investigate" ? cluesComplete ? "Two clues found. What do they tell you?" : "Tap the wristband and chart in the room." : choosing ? "Pick a response above." : currentStep === "prepare" ? "Tap the instrument table, then help the team." : "A fictional learning story")}</span>{(currentStep === "briefing" || currentStep === "firstFeedback" || currentStep === "secondFeedback" || currentStep === "ready" || (currentStep === "investigate" && cluesComplete)) && <button type="button" onClick={continueStory}>{tx(visibleCharacters < dialogue.length ? "Show all" : currentStep === "ready" ? "See what you learned" : "Continue")}<ArrowRight size={16} /></button>}</div></div></div>}
        </div>
        <div className="eg-game-bottom"><span>{tx("BEFORE THE FIRST INCISION")}</span><div aria-label={tx(`Chapter ${phase} of 4`)}>{[1, 2, 3, 4].map(item => <span key={item} className={item <= phase ? "is-active" : ""} />)}</div><span>{tx("OBSERVATION SCORE ")}<strong>{tx(score > 0 ? `+${score}` : score)}</strong></span></div>
      </section>
      <nav id="medicine-modules" className="eg-modules grid grid-cols-4 gap-2.5 max-[900px]:grid-cols-2 max-[600px]:flex max-[600px]:overflow-x-auto" aria-label={tx("Choose a medicine module")}>{medicineTracks.map((track, index) => <Link key={track.href} href={track.href} className={index === 1 ? "is-active" : ""} aria-current={index === 1 ? "page" : undefined}><span className="eg-module-number">0{index + 1}</span><span className="eg-module-name">{tx(track.title)}<small>{tx(index === 1 ? "CURRENT STORY" : "EXPLORE STORY")}</small></span><ArrowRight size={17} /></Link>)}</nav>
      <p className="eg-disclaimer">{tx("Fictional learning simulation. Medical assessment and treatment belong to qualified clinicians.")}</p>
    </div>
  </main>;
}
