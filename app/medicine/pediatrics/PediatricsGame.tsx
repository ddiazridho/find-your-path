"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, Droplets, Heart, RotateCcw, Sparkles, Stethoscope, Thermometer } from "lucide-react";
import { medicineTracks } from "../tracks";
import "../emergency/emergency-game.css";
import "./pediatrics-game.css";

type Step = "arrival" | "trust" | "trustFeedback" | "history" | "historyChoice" | "historyFeedback" | "inspect" | "exam" | "examFeedback" | "analysis" | "analysisFeedback" | "care" | "careFeedback" | "gift" | "ending" | "recap";
type Clue = "forehead" | "mouth" | "eyes";
type Prop = "mimi" | "bottle" | "diaper" | "drawer";
const opening = [
  { speaker: "NARRATOR", text: "The pediatric clinic door opens. Four-year-old Kiki hides behind his mother, Rina. He clutches his favorite rabbit, Mimi, and cries at the sight of the exam couch." },
  { speaker: "DR. SARAH", text: "Kiki thinks he is here for a shot. Before we examine him, we need to help him feel safe. You're observing with me today—how would you begin?" },
];
const history = [
  { speaker: "NARRATOR", text: "Kiki settles by the couch, still holding Mimi. Now and then, he peeks toward you. Dr. Sarah invites you to hear his mother's story." },
  { speaker: "RINA", text: "Kiki is usually so active—he loves running in the park. Since yesterday, he has only wanted to lie down. He refuses food and keeps fussing. I don't know what to do..." },
];
const ending = [
  { speaker: "KIKI", text: "Thank you! Mimi says thank you, too!" },
  { speaker: "RINA", text: "Thank you for listening to us. I understand what signs to watch for now." },
  { speaker: "DR. SARAH", text: "Caring for children takes medical knowledge, patience, and a feel for body language. You also help the whole family feel safe. Today, you listened to someone who could not yet tell the full story." },
];
const notes: Record<Clue | Prop, { title: string; text: string }> = {
  forehead: { title: "Fever: 38.6°C", text: "Beep! The no-touch forehead thermometer reads 38.6°C. This is Kiki's second day with a fever." },
  mouth: { title: "Dry lips", text: "Kiki's lips are cracked and his mouth looks dry." },
  eyes: { title: "Few tears", text: "His eyes look slightly sunken. He produces almost no tears when he cries." },
  mimi: { title: "Mimi the rabbit", text: "Mimi helps Kiki feel safe. His favorite toy can be part of the examination game." },
  bottle: { title: "Nearly full bottle", text: "Rina says Kiki has had only two spoonfuls of water since morning." },
  diaper: { title: "Dry diaper", text: "Rina says Kiki's diaper has stayed dry since midday. Less urine is an important clue." },
  drawer: { title: "Toy drawer", text: "There is a toy stethoscope in the drawer. Showing equipment through play may reassure Kiki." },
};

function Person({ who, comfort, sticker }: { who: "kiki" | "rina" | "sarah"; comfort: number; sticker: boolean }) {
  const child = who === "kiki";
  const mom = who === "rina";
  return <div className={`pd-figure pd-figure-${who}`} role="img" aria-label={child ? "Kiki holding Mimi in both arms" : mom ? "Rina holding notes" : "Dr. Sarah in a white coat"}>
    <div className="pd-figure-hair" />
    <div className="pd-figure-face"><i /><i /><span className={`pd-figure-mouth ${child && comfort < 50 ? "is-worried" : ""}`} /></div>
    <div className="pd-figure-neck" />
    <div className="pd-figure-arm pd-arm-left" />
    <div className="pd-figure-arm pd-arm-right" />
    <div className="pd-figure-body">{!child && <span className="pd-figure-collar" />}{!child && !mom && <><span className="pd-coat-line" /><span className="pd-coat-pocket" /><span className="pd-stethoscope" /></>}</div>
    <div className="pd-figure-legs" />
    {mom && <span className="pd-rina-notes" />}
    {child && <><div className="pd-rabbit"><span className="pd-rabbit-ear pd-ear-left" /><span className="pd-rabbit-ear pd-ear-right" /><span className="pd-rabbit-head"><i /><i /></span><span className="pd-rabbit-body" /></div><span className="pd-child-hand pd-hand-left" /><span className="pd-child-hand pd-hand-right" />{sticker && <span className="pd-child-sticker" />}</>}
  </div>;
}

export default function PediatricsGame() {
  const [currentStep, setCurrentStep] = useState<Step>("arrival");
  const [kikiComfortScore, setKikiComfortScore] = useState(35);
  const [discoveredClues, setDiscoveredClues] = useState<string[]>([]);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [activeClue, setActiveClue] = useState<Clue | Prop | null>(null);
  const [feedback, setFeedback] = useState("");
  const [typing, setTyping] = useState({ text: "", count: 0 });
  const [score, setScore] = useState(0);
  const [sticker, setSticker] = useState(false);
  const phase = currentStep === "arrival" || currentStep === "trust" || currentStep === "trustFeedback" ? 1 : currentStep === "history" || currentStep === "historyChoice" || currentStep === "historyFeedback" ? 2 : currentStep === "inspect" ? 3 : currentStep === "exam" || currentStep === "examFeedback" ? 4 : currentStep === "analysis" || currentStep === "analysisFeedback" || currentStep === "care" || currentStep === "careFeedback" ? 5 : 6;
  const comfortLabel = kikiComfortScore < 30 ? "Afraid" : kikiComfortScore < 50 ? "Wary" : kikiComfortScore < 80 ? "Calm" : "Cooperative";
  const choosing = ["trust", "historyChoice", "exam", "analysis", "care"].includes(currentStep);
  const allClues = ["forehead", "mouth", "eyes"].every(clue => discoveredClues.includes(clue));
  let speaker = "DR. SARAH", dialogue = "";
  if (currentStep === "arrival") ({ speaker, text: dialogue } = opening[dialogueIndex]);
  if (currentStep === "trust") dialogue = "For a child, feeling safe comes before the exam. How will you approach Kiki?";
  if (["trustFeedback", "historyFeedback", "examFeedback", "analysisFeedback", "careFeedback"].includes(currentStep)) dialogue = feedback;
  if (currentStep === "history") ({ speaker, text: dialogue } = history[dialogueIndex]);
  if (currentStep === "historyChoice") dialogue = "Rina looks tired and worried. Which question would help most?";
  if (currentStep === "inspect") { speaker = activeClue ? "OBSERVATION NOTES" : "DR. SARAH"; dialogue = activeClue ? notes[activeClue].text : "Find three physical signs. Tap Kiki's forehead, lips, and eyes. Objects around the room hold other clues."; }
  if (currentStep === "exam") dialogue = "Kiki backs away from the stethoscope. How can we examine him without adding to his fear?";
  if (currentStep === "analysis") dialogue = "A second day of fever, little to drink, a dry diaper, dry lips, and few tears. What do your observations suggest?";
  if (currentStep === "care") dialogue = "Help Rina choose a safe next step while Dr. Sarah assesses Kiki.";
  if (currentStep === "gift") dialogue = "The examination is over. Tap the sticker jar to give Kiki a little reward.";
  if (currentStep === "ending") ({ speaker, text: dialogue } = ending[dialogueIndex]);
  const shown = typing.text === dialogue ? typing.count : 0;
  useEffect(() => { if (!dialogue) return; const timer = window.setInterval(() => setTyping(previous => ({ text: dialogue, count: Math.min((previous.text === dialogue ? previous.count : 0) + 2, dialogue.length) })), 18); return () => window.clearInterval(timer); }, [dialogue]);

  function advance() {
    if (shown < dialogue.length) { setTyping({ text: dialogue, count: dialogue.length }); return; }
    if (currentStep === "arrival") { if (dialogueIndex < opening.length - 1) setDialogueIndex(i => i + 1); else { setDialogueIndex(0); setCurrentStep("trust"); } }
    else if (currentStep === "trustFeedback") setCurrentStep("history");
    else if (currentStep === "history") { if (dialogueIndex < history.length - 1) setDialogueIndex(i => i + 1); else { setDialogueIndex(0); setCurrentStep("historyChoice"); } }
    else if (currentStep === "historyFeedback") setCurrentStep("inspect");
    else if (currentStep === "inspect" && allClues) setCurrentStep("exam");
    else if (currentStep === "examFeedback") setCurrentStep("analysis");
    else if (currentStep === "analysisFeedback") setCurrentStep("care");
    else if (currentStep === "careFeedback") setCurrentStep("gift");
    else if (currentStep === "ending") { if (dialogueIndex < ending.length - 1) setDialogueIndex(i => i + 1); else setCurrentStep("recap"); }
  }
  function choose(correct: boolean) {
    if (currentStep === "trust") { setKikiComfortScore(v => Math.max(5, Math.min(100, v + (correct ? 25 : -15)))); setFeedback(correct ? "You crouch to Kiki's eye level and greet Mimi. His crying eases. He whispers, ‘...Mimi...’ Dr. Sarah: ‘Well done. His favorite toy helps him feel safe.’" : "Kiki cries harder and clings to Rina. Dr. Sarah: ‘Do not dismiss his feelings. He needs safety, not pressure.’ She gently helps him try again."); setCurrentStep("trustFeedback"); }
    if (currentStep === "historyChoice") { if (correct) setScore(v => v + 1); setDiscoveredClues(v => [...v, "diaper"]); setFeedback(correct ? "Rina exhales. ‘Only two spoonfuls of water since morning. His diaper has been completely dry since midday...’ You add this clue to your notes." : "Rina looks hurt. Dr. Sarah: ‘Let's avoid blaming a parent. Ask about drinking and the last time Kiki urinated.’ Rina explains that his diaper has been dry since midday."); setCurrentStep("historyFeedback"); }
    if (currentStep === "exam") { setKikiComfortScore(v => correct ? 100 : Math.max(10, v - 15)); setFeedback(correct ? "You warm the stethoscope and examine Mimi first. Kiki giggles, then lets Dr. Sarah listen to his chest. His heartbeat is a little fast; his lungs sound clear. Comfort reaches 100%!" : "Kiki struggles when his hands are held. Dr. Sarah pauses, gives him time, then warms the stethoscope and shows it to Mimi first. Kiki is ready to try."); setCurrentStep("examFeedback"); }
    if (currentStep === "analysis") { if (correct) setScore(v => v + 1); setFeedback(correct ? "Dr. Sarah: ‘Yes. We see fever and signs of dehydration. These observations cannot tell us the cause of the fever. Because Kiki is tired and passing very little urine, I'll assess him now.’" : "Dr. Sarah: ‘Nothing here points to a stomach problem. We see signs of too little fluid. I still need to assess the fever, especially because Kiki is tired and rarely urinates.’"); setCurrentStep("analysisFeedback"); }
    if (currentStep === "care") { if (correct) setScore(v => v + 1); setFeedback(correct ? "Dr. Sarah asks Rina to offer small, frequent spoonfuls of oral rehydration solution, watch for urine, and avoid forcing a large meal. She assesses Kiki now. If he becomes drowsier, cannot drink, or still does not urinate, he needs urgent medical help." : "Dr. Sarah: ‘Do not force food or wait without watching his fluids. I will assess Kiki now. We can offer small, frequent sips of oral rehydration solution if he can drink, and watch for worsening signs.’"); setCurrentStep("careFeedback"); }
  }
  function inspect(id: Clue | Prop) { if (currentStep !== "inspect") return; setActiveClue(id); setDiscoveredClues(v => v.includes(id) ? v : [...v, id]); }
  function reset() { setCurrentStep("arrival"); setKikiComfortScore(35); setDiscoveredClues([]); setDialogueIndex(0); setActiveClue(null); setFeedback(""); setTyping({ text: "", count: 0 }); setScore(0); setSticker(false); }
  const choices = currentStep === "trust" ? ["Stand over him, hold his hand, and say, ‘Don't be a baby. You're a big boy now.’", "Crouch to his eye level, smile, and say hello to Mimi."] : currentStep === "historyChoice" ? ["‘Did you forget to give him an appetite vitamin?’", "‘You have been caring for him. How much has he drunk, and when did he last pee?’"] : currentStep === "exam" ? ["Ask Rina to hold Kiki's hands tightly so he cannot pull away.", "Warm the stethoscope in your palm and examine Mimi first."] : currentStep === "analysis" ? ["An acute stomach illness caused by the wrong snack.", "Fever with signs of dehydration; a doctor should assess the cause."] : ["Make Kiki finish a full meal, then wait until tomorrow.", "Offer small, frequent sips of oral rehydration solution, watch for urine, and follow the doctor's assessment."];

  return <main className="eg-page pd-page">
    <header className="eg-site-header"><Link href="/" className="eg-brand">find your path<span>.</span></Link><Link href="/" className="eg-back"><ArrowLeft size={15} /> Explore majors</Link></header>
    <div className="eg-shell pd-shell"><div className="eg-page-intro pd-intro"><div><h1>Listening to those who cannot yet tell their story<span>.</span></h1><p>Step into the pediatric clinic. Earn Kiki&apos;s trust, spot the clues, and work alongside Dr. Sarah.</p></div></div>
      <section className="eg-game pd-game" aria-label="The Child Who Won't Play interactive story"><div className="pd-scene" data-step={currentStep} data-speaker={speaker} data-comfort={comfortLabel}>
        <div className="pd-room" aria-hidden="true"><div className="pd-window"><span className="pd-sun" /></div><div className="pd-wall-band" /><div className="pd-floor" /><div className="pd-door" /><div className="pd-mural"><span className="pd-giraffe-head" /><span className="pd-giraffe-neck" /><span className="pd-giraffe-leg" /><i /><b>120<br />100<br />80</b></div><div className="pd-toy-shelf"><div className="pd-blocks"><i /><i /><i /></div><span>PLAY CORNER</span></div><div className="pd-exam-bed" /><div className="pd-chair" /><div className="pd-rug" /></div>
        <div className="pd-hud pd-comfort"><div className="pd-hud-top"><Heart size={15} fill="currentColor" /><span>Kiki&apos;s Comfort Level</span><strong>{comfortLabel}</strong></div><div className="pd-meter"><span className="transition-all duration-700 ease-out" style={{ width: `${kikiComfortScore}%`, backgroundColor: kikiComfortScore < 30 ? "#e78b77" : kikiComfortScore < 50 ? "#e7b870" : kikiComfortScore < 80 ? "#9aca9b" : "#60b69b" }} /></div></div>
        <div className="pd-hud pd-chapter"><small>03 / PEDIATRICS</small><strong>The Child Who Won&apos;t Play</strong><span>PHASE {String(phase).padStart(2, "0")} / 06</span></div>
        <div className="pd-character pd-rina"><Person who="rina" comfort={kikiComfortScore} sticker={sticker} /><span>RINA</span></div><div className={`pd-character pd-kiki ${kikiComfortScore >= 80 ? "is-happy" : ""}`}><Person who="kiki" comfort={kikiComfortScore} sticker={sticker} /><span>KIKI + MIMI</span></div><div className="pd-character pd-sarah"><Person who="sarah" comfort={kikiComfortScore} sticker={sticker} /><span>DR. SARAH</span></div>
        <div className="pd-table" aria-hidden="true" /><button className="pd-prop pd-bottle" disabled={currentStep !== "inspect"} onClick={() => inspect("bottle")} aria-label="Inspect the water bottle"><span className="pd-bottle-art"><Droplets size={15} /></span><small>WATER</small></button><button className="pd-prop pd-drawer" disabled={currentStep !== "inspect"} onClick={() => inspect("drawer")} aria-label="Open the toy stethoscope drawer"><span className="pd-drawer-art"><Stethoscope size={19} /></span><small>DRAWER</small></button><button className="pd-prop pd-stickers" disabled={currentStep !== "gift"} onClick={() => { setSticker(true); setKikiComfortScore(100); setDialogueIndex(0); setCurrentStep("ending"); }} aria-label="Give Kiki a reward sticker"><span className="pd-sticker-art"><Sparkles size={17} /></span><small>STICKERS</small></button>
        {currentStep === "inspect" && <><button className={`pd-hotspot pd-forehead ${discoveredClues.includes("forehead") ? "is-found" : ""}`} onClick={() => inspect("forehead")} aria-label="Check Kiki's forehead"><span /><small>FOREHEAD</small></button><button className={`pd-hotspot pd-eyes ${discoveredClues.includes("eyes") ? "is-found" : ""}`} onClick={() => inspect("eyes")} aria-label="Observe Kiki's eyes"><span /><small>EYES</small></button><button className={`pd-hotspot pd-mouth ${discoveredClues.includes("mouth") ? "is-found" : ""}`} onClick={() => inspect("mouth")} aria-label="Observe Kiki's lips"><span /><small>LIPS</small></button><button className="pd-hotspot pd-mimi" onClick={() => inspect("mimi")} aria-label="Observe Mimi the rabbit"><span /><small>MIMI</small></button><button className="pd-hotspot pd-diaper" onClick={() => inspect("diaper")} aria-label="Note Kiki's dry diaper"><span /><small>DIAPER</small></button></>}
        {currentStep === "inspect" && activeClue === "forehead" && <div className="pd-thermometer" aria-hidden="true"><Thermometer size={16} /><span>BEEP! 38.6°C</span></div>}
        {currentStep === "inspect" && <div className="pd-notebook" aria-live="polite"><div><BookOpen size={16} /> OBSERVATION NOTES <b>{["forehead", "mouth", "eyes"].filter(id => discoveredClues.includes(id)).length}/3</b></div>{activeClue && <p><strong>{notes[activeClue].title}</strong> · {notes[activeClue].text}</p>}<ul>{(["forehead", "diaper", "mouth", "eyes"] as const).filter(id => discoveredClues.includes(id)).map(id => <li key={id}><Check size={12} />{id === "diaper" ? "Dry diaper for over 6 hours" : notes[id].title}</li>)}</ul></div>}
        {choosing && <div className="pd-choices" role="group" aria-label="Choose your response"><p>{currentStep === "care" ? "A CARE PLAN FOR RINA" : "WHAT WOULD YOU DO?"}</p>{choices.map((choice, index) => <button key={index} className="transition-all duration-200 hover:-translate-y-1 hover:bg-emerald-50 focus-visible:-translate-y-1" onClick={() => choose(index === 1)}><span>{index === 0 ? "A" : "B"}</span><strong>{choice}</strong><ArrowRight size={16} /></button>)}</div>}
        {currentStep === "recap" && <div className="pd-recap" role="dialog" aria-labelledby="pd-recap-title"><div className="pd-recap-icon"><Heart size={27} fill="currentColor" /></div><p>CASE COMPLETE · PEDIATRICS</p><h2 id="pd-recap-title">Kiki smiles again.</h2><span>Pediatrics calls for close visual observation, empathy across ages, patience, and the art of making medical spaces feel safe.</span><div className="pd-recap-score">Clues recorded: {discoveredClues.length} <i /> Thoughtful choices: {score}</div><div className="pd-recap-actions"><button onClick={reset}><RotateCcw size={16} /> Play this story again</button><a href="#medicine-modules">Choose module 04: Radiology <ArrowRight size={16} /></a></div></div>}
        {currentStep !== "recap" && <div className="pd-dialogue"><span className="sr-only" aria-live="polite">{speaker}: {dialogue}</span><div className="pd-speaker"><span>{speaker === "NARRATOR" ? <BookOpen size={18} /> : speaker === "KIKI" ? "K" : speaker === "RINA" ? "R" : speaker === "OBSERVATION NOTES" ? <Thermometer size={17} /> : "S"}</span><div><strong>{speaker}</strong><small>{speaker === "NARRATOR" ? "THE STORY" : speaker === "DR. SARAH" ? "PEDIATRICIAN" : speaker === "KIKI" ? "YOUNG PATIENT" : speaker === "RINA" ? "KIKI'S MOTHER" : "MEDICAL NOTES"}</small></div></div><div className="pd-dialogue-body"><p aria-hidden="true">{dialogue.slice(0, shown)}<i className={shown < dialogue.length ? "pd-caret" : ""} /></p><div><span>{currentStep === "inspect" ? allClues ? "Three signs found. Continue the story." : "Tap the points on Kiki to record three signs." : choosing ? "Choose a response above." : currentStep === "gift" ? "Tap the sticker jar on the table." : "A fictional story for exploring medicine"}</span>{(["arrival", "trustFeedback", "history", "historyFeedback", "examFeedback", "analysisFeedback", "careFeedback", "ending"].includes(currentStep) || currentStep === "inspect" && allClues) && <button onClick={advance}>{shown < dialogue.length ? "Show all" : "Continue"}<ArrowRight size={16} /></button>}</div></div></div>}
      </div><div className="pd-game-footer"><span>LISTENING TO THOSE WHO CANNOT YET TELL THEIR STORY</span><div aria-label={`Phase ${phase} of 6`}>{[1, 2, 3, 4, 5, 6].map(n => <i key={n} className={n <= phase ? "is-active" : ""} />)}</div><span>INSIGHT <b>{score}</b></span></div></section>
      <nav id="medicine-modules" className="eg-modules pd-modules grid grid-cols-4 gap-2.5 max-[900px]:grid-cols-2 max-[600px]:flex max-[600px]:overflow-x-auto" aria-label="Choose a medicine module">{medicineTracks.map((track, index) => <Link key={track.href} href={track.href} className={index === 2 ? "is-active" : ""} aria-current={index === 2 ? "page" : undefined}><span className="eg-module-number">0{index + 1}</span><span className="eg-module-name">{track.title}<small>{index === 2 ? "CURRENT STORY" : "EXPLORE STORY"}</small></span><ArrowRight size={17} /></Link>)}</nav>
      <p className="eg-disclaimer">A fictional learning story. Signs of dehydration in a child need assessment by a healthcare professional.</p>
    </div>
  </main >;
}
