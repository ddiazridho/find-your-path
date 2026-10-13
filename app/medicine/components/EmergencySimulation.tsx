"use client";
import { useState } from "react";

type Action = "help" | "observe" | "share";
const actions: { id: Action; title: string; detail: string }[] = [
  { id: "help", title: "Call the clinical team", detail: "Ask for help right away." },
  { id: "observe", title: "Check and watch", detail: "Notice breathing, alertness, and the monitor." },
  { id: "share", title: "Give a clear update", detail: "Tell the team what you saw and when." },
];
const correct: Action[] = ["help", "observe", "share"];

export default function EmergencySimulation() {
  const [patientSeen, setPatientSeen] = useState(false);
  const [monitorSeen, setMonitorSeen] = useState(false);
  const [helpCalled, setHelpCalled] = useState(false);
  const [slots, setSlots] = useState<(Action | null)[]>([null, null, null]);
  const [selected, setSelected] = useState<Action | null>(null);
  const [message, setMessage] = useState("The doors open. Nia is awake, but she looks exhausted. Start by looking at her and the monitor. If breathing looks difficult, call the team immediately.");
  const [done, setDone] = useState(false);
  const ready = patientSeen && monitorSeen && helpCalled && slots.every((item, index) => item === correct[index]);
  function place(action: Action, index: number) {
    const next = [...slots];
    const previous = next.indexOf(action);
    if (previous >= 0) next[previous] = null;
    next[index] = action;
    setSlots(next);
    setSelected(null);
    if (index === 0 && action !== "help") setMessage("Nia is struggling to breathe. Put the call for help first; you can keep observing while the team comes.");
    else setMessage("The plan is taking shape. You can drag a card again or tap a card, then tap a numbered space.");
  }
  function reset() { setPatientSeen(false); setMonitorSeen(false); setHelpCalled(false); setSlots([null, null, null]); setSelected(null); setDone(false); setMessage("The doors open. Nia is awake, but she looks exhausted. Start by looking at her and the monitor. If breathing looks difficult, call the team immediately."); }
  return <section className="med-sim med-emergency" aria-label="Emergency room simulation">
    <div className="med-scene-header"><span><i className="med-live-dot" /> CASE 01 · 9:14 AM</span><span>{done ? "Team at bedside" : helpCalled ? "Help is on the way" : "Arrival in progress"}</span></div>
    <div className="med-emergency-room med-environment">
      <div className="med-room-window"><span>EMERGENCY</span><span className="med-window-shine" /></div>
      <div className="med-room-clock">09:14</div><div className="med-room-lamp" />
      <div className="med-staff med-doctor"><span className="med-person-head" /><span className="med-person-body" /><small>Dr. Lee</small></div>
      <div className={'med-staff med-nurse ' + (helpCalled ? "is-moving" : "")}><span className="med-person-head" /><span className="med-person-body" /><small>Nurse Jo</small></div>
      <button className={'med-monitor ' + (monitorSeen ? "is-checked" : "")} onClick={() => { setMonitorSeen(true); setMessage("The monitor shows a fast pulse and a low oxygen reading in this fictional case. Tell the team; a number alone does not explain the cause."); }} aria-label="Inspect Nia's vital signs monitor"><span className="med-monitor-top">VITAL SIGNS <span>● LIVE</span></span><span className="med-wave"><svg viewBox="0 0 180 35" preserveAspectRatio="none" aria-hidden="true"><path d="M0 20 H34 l8 -12 8 25 8 -13 H100 l8 -10 8 22 8 -12 H180" /></svg></span><span className="med-monitor-readings"><b>{monitorSeen ? "112" : "--"}<small>pulse / min</small></b><b>{monitorSeen ? "90%" : "--"}<small>oxygen*</small></b></span><span className="med-monitor-foot">Tap to inspect</span></button>
      <div className="med-bed"><div className="med-bed-rail" /><div className="med-bed-mattress" /><div className="med-bed-base" /></div>
      <button className={'med-patient ' + (patientSeen ? "is-checked" : "") + (done ? " is-stable" : "")} onClick={() => { setPatientSeen(true); setMessage("Nia can answer, but only in short phrases. You notice quick breathing, weakness, and dizziness. These are warning signs—call for help now."); }} aria-label="Examine Nia on the stretcher"><span className="med-patient-head"><i className="med-patient-eye" /><i className="med-patient-mouth" /></span><span className="med-patient-chest" /><span className="med-patient-arm" /><span className="med-patient-leg" /><span className="med-target-label">Tap Nia to observe</span></button>
      <div className="med-room-floor" />
      {patientSeen && <span className="med-warning med-warning-patient">Short phrases · quick breathing</span>}
      {monitorSeen && <span className="med-warning med-warning-monitor">Reading needs urgent review</span>}
    </div>
    <div className="med-sim-body"><div className="med-story-column"><div className="med-story-card"><span className="med-section-label">WHAT IS HAPPENING</span><p aria-live="polite">{message}</p><div className="med-story-speaker">Nia <span>“I feel weak… I cannot catch my breath.”</span></div></div>
      <div className="med-status-grid"><span className={patientSeen ? "is-complete" : ""}>{patientSeen ? "✓" : "○"} Observe Nia</span><span className={monitorSeen ? "is-complete" : ""}>{monitorSeen ? "✓" : "○"} Check monitor</span><span className={helpCalled ? "is-complete" : ""}>{helpCalled ? "✓" : "○"} Call for help</span></div>
      <button className="med-primary med-urgent-button" onClick={() => { setHelpCalled(true); setMessage("You call the clinical team. Nurse Jo moves to Nia's side while you keep watching and prepare a short update."); }} disabled={helpCalled}>{helpCalled ? "✓ Team called" : "Call the clinical team now"}</button>
    </div><div className="med-activity-card"><span className="med-section-label">HANDS-ON ACTIVITY · PRIORITY ORDER</span><h2>Build the first response</h2><p>Drag the action cards into order. On a touch screen, tap a card and then a numbered space.</p><div className="med-drag-cards">{actions.map(action => <button key={action.id} draggable onDragStart={event => event.dataTransfer.setData("text/plain", action.id)} onClick={() => setSelected(action.id)} className={'med-drag-card ' + (selected === action.id ? "is-selected" : "")} aria-pressed={selected === action.id}><strong>{action.title}</strong><small>{action.detail}</small></button>)}</div><div className="med-drop-row">{slots.map((slot, index) => <button key={index} className={'med-drop-slot ' + (slot ? "is-filled" : "")} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); const id = event.dataTransfer.getData("text/plain") as Action; if (actions.some(action => action.id === id)) place(id, index); }} onClick={() => selected && place(selected, index)} aria-label={'Step ' + (index + 1) + (slot ? ': ' + actions.find(action => action.id === slot)?.title : ': empty')}><span>0{index + 1}</span><strong>{slot ? actions.find(action => action.id === slot)?.title : "Drop or tap here"}</strong></button>)}</div><p className="med-inline-feedback" aria-live="polite">{slots.every(Boolean) && !slots.every((item, index) => item === correct[index]) ? "Look again at what must happen first. You can rearrange any card." : ready ? "The team has the right order and your observations. Ready to hand over." : "Keep exploring the room and arranging the steps."}</p><button className="med-primary" disabled={!ready || done} onClick={() => { setDone(true); setMessage("You give Dr. Lee a clear update: Nia's breathing is quick, she speaks in short phrases, feels dizzy, and the monitor needs urgent review. The team takes over her care."); }}>{done ? "Handover complete" : "Give your update to the team"}</button></div></div>
    {done && <div className="med-recap" role="status"><span className="med-section-label">CASE RECAP</span><h2>A clear, urgent handover</h2><p>You did not try to guess a diagnosis. You noticed that Nia was short of breath and weak, called the clinical team, checked what you could see, and shared the findings. Breathing trouble can be urgent; a monitor reading supports observation but needs a professional to interpret it.</p><button className="med-secondary" onClick={reset}>Replay the arrival</button></div>}
    <p className="med-asterisk">*Readings are fictional teaching details. Real assessment and care belong to qualified clinicians.</p>
  </section>;
}
