"use client";
import { useState } from "react";

type Topic = "when" | "food" | "other";
type Tool = "thermometer" | "stethoscope" | "light";
const topicText: Record<Topic, { label: string; answer: string }> = {
  when: { label: "When did this start?", answer: "Parent: 'Yesterday afternoon. He usually runs around after school, but he went straight to the sofa.'" },
  food: { label: "How has eating changed?", answer: "Parent: 'He only picked at breakfast and had a few sips of water today.'" },
  other: { label: "Anything else you noticed?", answer: "Parent: 'He felt warm last night. No fall or injury. He says his throat feels sore.'" },
};
const toolText: Record<Tool, { label: string; result: string }> = {
  thermometer: { label: "Thermometer", result: "With Milo's permission, the doctor checks his temperature. It is raised. Share this finding without guessing a cause." },
  stethoscope: { label: "Stethoscope", result: "The doctor listens while Milo takes a few comfortable breaths. You note that the check is complete; the doctor interprets it." },
  light: { label: "Small light", result: "The doctor uses a small light to look gently at Milo's throat. Milo points to where it hurts." },
};

export default function PediatricsSimulation() {
  const [observed, setObserved] = useState<string[]>([]);
  const [asked, setAsked] = useState<Topic[]>([]);
  const [calm, setCalm] = useState(false);
  const [tool, setTool] = useState<Tool | null>(null);
  const [used, setUsed] = useState<Tool[]>([]);
  const [message, setMessage] = useState("Milo is quiet and holds his parent's sleeve. His parent says he is not acting like himself. Start by observing, then help him feel safe.");
  const [done, setDone] = useState(false);
  const ready = observed.length >= 2 && asked.length === 3 && calm && used.length >= 2;
  function observe(id: string, note: string) { setObserved(previous => previous.includes(id) ? previous : [...previous, id]); setMessage(note); }
  function ask(topic: Topic) { setAsked(previous => previous.includes(topic) ? previous : [...previous, topic]); setMessage(topicText[topic].answer); }
  function performCheck(id: Tool) { setTool(id); if (!calm) { setMessage("Milo pulls back. First explain what you want to do and let him choose a comfortable moment."); return; } setUsed(previous => previous.includes(id) ? previous : [...previous, id]); setMessage(toolText[id].result); }
  function reset() { setObserved([]); setAsked([]); setCalm(false); setTool(null); setUsed([]); setDone(false); setMessage("Milo is quiet and holds his parent's sleeve. His parent says he is not acting like himself. Start by observing, then help him feel safe."); }
  return <section className="med-sim med-pediatrics" aria-label="Child-friendly clinic simulation">
    <div className="med-scene-header"><span><i className="med-live-dot" /> CASE 03 · CLINIC VISIT</span><span>{done ? "Notes shared with doctor" : calm ? "Milo feels safer" : "A gentle beginning"}</span></div>
    <div className="med-clinic med-environment">
      <div className="med-clinic-window"><span className="med-clinic-sun" /><span className="med-clinic-hill" /></div><div className="med-clinic-cloud cloud-one" /><div className="med-clinic-cloud cloud-two" />
      <div className="med-clinic-poster">Take a breath<br />Little steps count <span>✳</span></div><div className="med-clinic-shelf"><span>🧸</span><span>✦</span><span>▣</span></div><div className="med-clinic-rug" /><div className="med-clinic-chair" />
      <button className={'med-clinic-child ' + (calm ? "is-calm" : "")} onClick={() => observe("body", "Milo sits close to his parent and does not reach for the toy shelf. His body language tells you he feels unsure.")} aria-label="Observe Milo's body language"><span className="med-child-hair" /><span className="med-child-head"><i className="med-child-eye" /><i className="med-child-mouth" /></span><span className="med-child-shirt" /><span className="med-child-legs" /><small>Observe Milo</small></button>
      <button className="med-clinic-parent" onClick={() => observe("parent", "Milo stays near his parent. His parent can help explain what has changed since yesterday.")} aria-label="Observe Milo and his parent"><span className="med-person-head" /><span className="med-person-body" /><small>Parent</small></button>
      <div className="med-clinic-doctor"><span className="med-person-head" /><span className="med-person-body" /><small>Dr. Shah</small></div>
      <button className="med-clinic-toys" onClick={() => observe("play", "The toy train is untouched. Not wanting to play can be an important change to tell the doctor about.")} aria-label="Observe the untouched toys">🚂 <small>Look at toys</small></button>
      <span className="med-scene-caption">Tap Milo, the parent, and the toys to observe the room.</span>
    </div>
    <div className="med-sim-body med-peds-grid">
      <div className="med-story-column"><div className="med-story-card"><span className="med-section-label">WHAT YOU NOTICE</span><p aria-live="polite">{message}</p><div className="med-story-speaker">Milo <span>{calm ? "“Okay… can my parent stay here?”" : "“I don't want a check-up.”"}</span></div></div>
        <div className="med-activity-card"><span className="med-section-label">01 · MAKE SPACE FOR TRUST</span><h2>Help Milo feel safe</h2><p>A calm explanation makes it easier to gather information. This is not a race.</p><button className="med-comfort-choice" onClick={() => { setCalm(true); setMessage("You ask Milo if his parent can sit beside him, show him the tool first, and say he can tell you when he is ready. His shoulders relax."); }} disabled={calm}>{calm ? "✓ Milo is ready to try" : "Explain the check and offer a choice"}</button><div className="med-status-grid"><span className={observed.length >= 2 ? "is-complete" : ""}>{observed.length >= 2 ? "✓" : "○"} Observe the room</span><span className={calm ? "is-complete" : ""}>{calm ? "✓" : "○"} Build trust</span></div></div>
      </div>
      <div className="med-story-column"><div className="med-activity-card"><span className="med-section-label">02 · HEAR THE PARENT STORY</span><h2>Ask what changed</h2><p>Open each topic to build a fuller picture for Dr. Shah.</p><div className="med-parent-topics">{(Object.keys(topicText) as Topic[]).map(topic => <button key={topic} className={asked.includes(topic) ? "is-active" : ""} onClick={() => ask(topic)}>{asked.includes(topic) ? "✓ " : "+ "}{topicText[topic].label}</button>)}</div><div className="med-note-sheet"><small>YOUR NOTES</small><p>{asked.length ? asked.map(topic => topicText[topic].answer.replace("Parent: ", "")).join(" ") : "The answers will appear here."}</p></div></div>
        <div className="med-activity-card"><span className="med-section-label">03 · CHOOSE GENTLE CHECKS</span><h2>Prepare simple tools</h2><p>Tap a tool to help Dr. Shah with an initial check. Milo needs an explanation first.</p><div className="med-tool-buttons">{(Object.keys(toolText) as Tool[]).map(id => <button key={id} className={tool === id ? "is-active" : ""} onClick={() => performCheck(id)}><span aria-hidden="true">{id === "thermometer" ? "♧" : id === "stethoscope" ? "◉" : "✧"}</span>{toolText[id].label}{used.includes(id) && <small>✓ checked</small>}</button>)}</div><button className="med-primary" disabled={!ready || done} onClick={() => { setDone(true); setMessage("You tell Dr. Shah: Milo has been less playful since yesterday, ate and drank less today, felt warm, and says his throat is sore. You also share the checks completed and how he responded."); }}>{done ? "Notes shared" : "Share findings with Dr. Shah"}</button><p className="med-inline-feedback" aria-live="polite">{ready ? "You have a clear story to share." : "Observe Milo, hear the full story, build trust, and complete two gentle checks."}</p></div>
      </div>
    </div>
    {done && <div className="med-recap" role="status"><span className="med-section-label">CASE RECAP</span><h2>Listening changed the visit</h2><p>You noticed a change in energy, asked when it began and what else changed, made the exam less frightening, and shared clear observations with the doctor. A change in a child&apos;s usual behavior and the parent&apos;s story are useful clues. The doctor—not this activity—decides what the findings mean.</p><button className="med-secondary" onClick={reset}>Replay the visit</button></div>}
  </section>;
}
