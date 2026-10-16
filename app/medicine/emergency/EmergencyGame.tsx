"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Check, HeartPulse, RotateCcw } from "lucide-react";
import { medicineTracks } from "../tracks";
import "./emergency-game.css";

type Step = "arrival" | "firstChoice" | "firstFeedback" | "investigate" | "diagnosis" | "diagnosisFeedback" | "action" | "recovered" | "recap";
type Clue = "monitor" | "arm";

const intro = [
  { speaker: "SCENE", text: "The ER doors swing open. Nia, a high school student, is wheeled in after lunch. She clutches her throat and struggles to breathe." },
  { speaker: "DR. LEE", text: "A patient with severe breathing trouble just arrived. Hey, first-day observer—stay calm. What should we check first?" },
];
const firstChoices = [
  { letter: "A", text: "Grab oxygen and put it on without checking anything.", correct: false },
  { letter: "B", text: "Talk to Nia and check her response and airway.", correct: true },
];
const diagnosisChoices = [
  { letter: "A", text: "It is probably just exam stress and a panic attack.", correct: false },
  { letter: "B", text: "This looks like anaphylaxis: a severe allergic reaction affecting her airway.", correct: true },
];

export default function EmergencyGame() {
  const [currentStep, setCurrentStep] = useState<Step>("arrival");
  const [score, setScore] = useState(0);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [clues, setClues] = useState<Clue[]>([]);
  const [activeClue, setActiveClue] = useState<Clue | null>(null);
  const [feedback, setFeedback] = useState("");
  const [typing, setTyping] = useState({ text: "", count: 0 });
  const cluesComplete = clues.length === 2;
  const stable = currentStep === "recovered" || currentStep === "recap";
  const choiceStep = currentStep === "firstChoice" || currentStep === "diagnosis";
  const phase = currentStep === "arrival" || currentStep === "firstChoice" || currentStep === "firstFeedback" ? 1 : currentStep === "investigate" ? 2 : currentStep === "diagnosis" || currentStep === "diagnosisFeedback" ? 3 : 4;

  let speaker = "DR. LEE";
  let dialogue = "";
  if (currentStep === "arrival") { speaker = intro[dialogueIndex].speaker; dialogue = intro[dialogueIndex].text; }
  if (currentStep === "firstChoice") dialogue = "What is the first thing we should observe? Choose your response.";
  if (currentStep === "firstFeedback" || currentStep === "diagnosisFeedback") dialogue = feedback;
  if (currentStep === "investigate") {
    speaker = activeClue === "arm" ? "NIA" : activeClue === "monitor" ? "NURSE JO" : "DR. LEE";
    dialogue = activeClue === "arm"
      ? "M-my throat feels swollen... I can't breathe. Those itchy red welts appeared so fast."
      : activeClue === "monitor"
        ? "The monitor reads SpO₂ 89% and heart rate 125 bpm. Her oxygen level is low and her pulse is fast."
        : "Look closely, observer. Tap the monitor and Nia's arm to collect two clues.";
  }
  if (currentStep === "diagnosis") dialogue = "Low oxygen. A sudden spreading rash after eating. What is your working analysis?";
  if (currentStep === "action") dialogue = "Good thinking. Nurse Jo is here. Help the team by giving Nia the oxygen mask and calling the treatment team.";
  if (currentStep === "recovered") dialogue = "Nurse Jo fits the oxygen mask while I give epinephrine, the first-line treatment. Nia's oxygen rises to 97%. Nice work! ER doctors think like detectives under pressure. You kept a clear head.";
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
      setFeedback(correct ? "Exactly. A calm check of her response and airway gives the team the first crucial information." : "Hold on! First check if she is responsive and how she is breathing before reaching for equipment.");
      setCurrentStep("firstFeedback");
    } else {
      if (correct) setScore(value => value + 1);
      setFeedback(correct ? "Spot on. The sudden rash and breathing trouble point to anaphylaxis. This needs urgent professional treatment." : "Look again: a panic attack would not explain those sudden red welts after eating. The team considers a severe allergic reaction.");
      setCurrentStep("diagnosisFeedback");
    }
  }
  function continueStory() {
    if (visibleCharacters < dialogue.length) { setTyping({ text: dialogue, count: dialogue.length }); return; }
    if (currentStep === "arrival") {
      if (dialogueIndex === 0) setDialogueIndex(1);
      else setCurrentStep("firstChoice");
    } else if (currentStep === "firstFeedback") setCurrentStep("investigate");
    else if (currentStep === "investigate" && cluesComplete) setCurrentStep("diagnosis");
    else if (currentStep === "diagnosisFeedback") setCurrentStep("action");
    else if (currentStep === "recovered") setCurrentStep("recap");
  }
  function replay() { setCurrentStep("arrival"); setScore(0); setDialogueIndex(0); setClues([]); setActiveClue(null); setFeedback(""); }

  return <main className="eg-page">
    <div className="eg-shell">
      <div className="eg-page-intro"><div><p className="eg-chapter">MEDICINE LAB <span>/</span> INTERACTIVE STORY</p><h1>The first critical minutes<span>.</span></h1><p>One patient. Two clues. Your first shift in the emergency room starts now.</p></div></div>
      <section className="eg-game" aria-label="The first critical minutes visual novel game">
        <div className="eg-game-top"><span><i className="eg-live" /> LIVE SIMULATION <b>·</b> 09:14 AM</span><span>CHAPTER {String(phase).padStart(2, "0")} <b>/</b> 04</span></div>
        <div className={`eg-scene ${stable ? "eg-stable" : ""}`}>
          <div className="eg-wall" aria-hidden="true"><div className="eg-wall-panel" /><div className="eg-door"><span>EMERGENCY</span><i /></div><div className="eg-curtain eg-curtain-one" /><div className="eg-curtain eg-curtain-two" /><div className="eg-ceiling-light" /><div className="eg-wall-clock">09:14</div><div className="eg-wall-stripe" /><div className="eg-floor" /></div>
          <div className="eg-bay-number" aria-hidden="true">BAY <strong>03</strong></div>
          <div className="eg-bed" aria-hidden="true"><div className="eg-pillow" /><div className="eg-blanket" /><div className="eg-bed-rim" /><div className="eg-bed-leg eg-bed-leg-one" /><div className="eg-bed-leg eg-bed-leg-two" /></div>
          <div className="eg-nia" aria-label="Nia lying on the stretcher"><div className="eg-nia-hair" /><div className="eg-nia-face"><i className="eg-eye" /><i className="eg-mouth" /></div><div className="eg-nia-neck" /><div className="eg-nia-body" /><div className="eg-nia-arm"><span className={clues.includes("arm") ? "eg-rash is-visible" : "eg-rash"}><i /><i /><i /><i /></span></div><div className="eg-oxygen-mask" /></div>
          <div className="eg-character eg-lee" aria-label="Dr. Lee"><div className="eg-character-hair" /><div className="eg-character-face"><i /><i /></div><div className="eg-character-neck" /><div className="eg-character-body"><span className="eg-coat-line" /><span className="eg-coat-pocket" /></div><div className="eg-character-arm eg-left-arm" /><div className="eg-character-arm eg-right-arm" /><div className="eg-character-legs" /><span className="eg-character-name">DR. LEE</span></div>
          <div className="eg-character eg-jo" aria-label="Nurse Jo"><div className="eg-character-hair" /><div className="eg-character-face"><i /><i /></div><div className="eg-character-neck" /><div className="eg-character-body"><span className="eg-jo-cross">+</span></div><div className="eg-character-arm eg-left-arm" /><div className="eg-character-arm eg-right-arm" /><div className="eg-character-legs" /><span className="eg-character-name">NURSE JO</span></div>
          <button type="button" className={`eg-monitor ${clues.includes("monitor") ? "is-found" : ""} ${currentStep === "investigate" ? "is-hotspot" : ""}`} onClick={() => inspect("monitor")} disabled={currentStep !== "investigate"} aria-label="Inspect the vital signs monitor"><span className="eg-monitor-heading">VITAL SIGNS <i>● LIVE</i></span><svg viewBox="0 0 180 42" preserveAspectRatio="none" aria-hidden="true"><path d="M0 24 H30 l9 -3 7 -14 8 30 9 -14 H104 l8 -4 6 -12 8 29 8 -13 H180" /></svg><span className="eg-monitor-numbers"><strong>{stable ? "97" : "89"}<small>SpO₂ %</small></strong><strong>{stable ? "92" : "125"}<small>HR bpm</small></strong></span><span className="eg-monitor-stand" /></button>
          {currentStep === "investigate" && <button type="button" className={`eg-arm-hotspot ${clues.includes("arm") ? "is-found" : ""}`} onClick={() => inspect("arm")} aria-label="Inspect the rash on Nia's arm"><span className="eg-hotspot-ring" /><span>CHECK ARM</span></button>}
          {currentStep === "investigate" && <span className="eg-monitor-tip">{clues.includes("monitor") ? <Check size={13} /> : <span className="eg-tip-dot" />} MONITOR</span>}
          {currentStep === "investigate" && <div className="eg-clue-counter" aria-live="polite">FIND THE CLUES <strong>{clues.length} / 2</strong></div>}
          {stable && <div className="eg-stable-pill"><Check size={14} /> NIA IS BREATHING EASIER</div>}
          {choiceStep && <div className="eg-choice-layer" role="group" aria-label="Choose your response"><p>YOUR CALL, OBSERVER</p>{(currentStep === "firstChoice" ? firstChoices : diagnosisChoices).map(choice => <button key={choice.letter} type="button" onClick={() => choose(choice.correct)}><span>{choice.letter}</span><strong>{choice.text}</strong><ArrowRight size={16} /></button>)}</div>}
          {currentStep === "action" && <div className="eg-action-layer"><p>THE TEAM IS READY</p><button type="button" onClick={() => setCurrentStep("recovered")}><HeartPulse size={19} /> Give oxygen mask &amp; call the treatment team <ArrowRight size={18} /></button></div>}
          {currentStep === "recap" && <div className="eg-recap" role="dialog" aria-labelledby="eg-recap-title"><span className="eg-recap-icon"><HeartPulse size={27} /></span><p className="eg-recap-label">CASE COMPLETE</p><h2 id="eg-recap-title">You kept your cool.</h2><p>You spotted the clues, shared a clear analysis, and supported the emergency team.</p><div className="eg-recap-lesson"><strong>What medicine teaches you</strong><span>Quick observation, clear thinking under pressure, and teamwork.</span></div><div className="eg-recap-actions"><button type="button" onClick={replay} autoFocus><RotateCcw size={16} /> Play again</button><a href="#medicine-modules">Explore another module <ArrowRight size={16} /></a></div></div>}
          {currentStep !== "recap" && <div className="eg-dialogue absolute bottom-[3%] left-[3%] right-[3%] rounded-xl shadow-2xl backdrop-blur-md"><span className="sr-only" aria-live="polite">{speaker}: {dialogue}</span><div className="eg-dialogue-speaker"><span className={speaker === "NIA" ? "eg-speaker-avatar eg-avatar-nia" : speaker === "NURSE JO" ? "eg-speaker-avatar eg-avatar-jo" : "eg-speaker-avatar"}>{speaker === "SCENE" ? <BookOpen size={17} /> : speaker === "NIA" ? "N" : speaker === "NURSE JO" ? "J" : "L"}</span><div><span>{speaker}</span><small>{speaker === "SCENE" ? "THE ARRIVAL" : speaker === "DR. LEE" ? "SENIOR DOCTOR" : speaker === "NURSE JO" ? "ER NURSE" : "PATIENT"}</small></div></div><div className="eg-dialogue-copy"><p aria-hidden="true">{dialogue.slice(0, visibleCharacters)}<span className={visibleCharacters < dialogue.length ? "eg-type-caret" : ""} /></p><div className="eg-dialogue-footer"><span>{currentStep === "investigate" ? cluesComplete ? "Both clues found. Ready to think it through?" : "Tap the glowing clues in the room." : choiceStep ? "Pick a response above." : currentStep === "action" ? "Use the action above to help the team." : "A fictional learning story"}</span>{((currentStep === "arrival" || currentStep === "firstFeedback" || currentStep === "diagnosisFeedback" || currentStep === "recovered") || (currentStep === "investigate" && cluesComplete)) && <button type="button" onClick={continueStory}>{visibleCharacters < dialogue.length ? "Show all" : currentStep === "recovered" ? "See what you learned" : "Continue"}<ArrowRight size={16} /></button>}</div></div></div>}
        </div>
        <div className="eg-game-bottom"><span>THE FIRST CRITICAL MINUTES</span><div aria-label={`Chapter ${phase} of 4`}>{[1, 2, 3, 4].map(item => <span key={item} className={item <= phase ? "is-active" : ""} />)}</div><span>OBSERVATION SCORE <strong>{score > 0 ? `+${score}` : score}</strong></span></div>
      </section>
      <nav id="medicine-modules" className="eg-modules grid grid-cols-4 gap-2.5 max-[900px]:grid-cols-2 max-[600px]:flex max-[600px]:overflow-x-auto" aria-label="Choose a medicine module">{medicineTracks.map((track, index) => <Link key={track.href} href={track.href} className={index === 0 ? "is-active" : ""} aria-current={index === 0 ? "page" : undefined}><span className="eg-module-number">0{index + 1}</span><span className="eg-module-name">{track.title}<small>{index === 0 ? "CURRENT STORY" : "EXPLORE STORY"}</small></span><ArrowRight size={17} /></Link>)}</nav>
      <p className="eg-disclaimer">Fictional learning simulation. Medical assessment and treatment belong to qualified clinicians.</p>
    </div>
  </main>;
}
