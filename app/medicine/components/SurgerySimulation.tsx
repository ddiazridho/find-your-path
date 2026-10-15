"use client";
import { useState } from "react";

type Supply = "sealed" | "drape" | "check" | "open";
type Document = "schedule" | "wristband" | "consent" | "care";
const supplies: { id: Supply; title: string; note: string }[] = [
  { id: "sealed", title: "Sealed sterile pack", note: "Unopened and ready to verify" },
  { id: "drape", title: "Clean drape pack", note: "Covering supplies for the team" },
  { id: "check", title: "Equipment check card", note: "Shows that equipment was tested" },
  { id: "open", title: "Opened pack", note: "The seal is broken—set aside" },
];
const needed: Supply[] = ["sealed", "drape", "check"];
const instruments = [
  { name: "Forceps", use: "A tool for holding or moving small items. The team checks it before use." },
  { name: "Scissors", use: "A cutting tool. Here, you only check that the correct set is present." },
  { name: "Retractor", use: "A tool that can hold tissue aside during an operation. You will not use it here." },
];
const checkItems = ["Identity matches", "Procedure and side match", "Allergies shared", "Equipment and supplies checked", "Team confirms together"];

export default function SurgerySimulation() {
  const [document, setDocument] = useState<Document | null>(null);
  const [seenDocs, setSeenDocs] = useState<Document[]>([]);
  const [focus, setFocus] = useState<"patient" | "team" | "equipment">("patient");
  const [confirmedSide, setConfirmedSide] = useState(false);
  const [tray, setTray] = useState<Supply[]>([]);
  const [selected, setSelected] = useState<Supply | null>(null);
  const [tool, setTool] = useState<number | null>(null);
  const [checks, setChecks] = useState<string[]>([]);
  const [message, setMessage] = useState("Patient Ari is waiting. The schedule says 'wrist repair,' but it does not say which wrist. Check the documents before the team proceeds.");
  const [done, setDone] = useState(false);
  const ready = confirmedSide && needed.every(item => tray.includes(item)) && checkItems.every(item => checks.includes(item));

  function openDocument(id: Document, note: string) {
    setDocument(id);
    setSeenDocs(previous => previous.includes(id) ? previous : [...previous, id]);
    setFocus("team");
    setMessage(note);
  }
  function addSupply(id: Supply) {
    setSelected(null);
    setFocus("equipment");
    if (id === "open") { setMessage("The pack's seal is broken. Set it aside and choose the sealed pack instead."); return; }
    setTray(previous => previous.includes(id) ? previous : [...previous, id]);
    setMessage("The preparation area now holds " + supplies.find(item => item.id === id)?.title.toLowerCase() + ". Check the other supplies too.");
  }
  function toggleCheck(item: string) {
    if (item === "Identity matches" && !(seenDocs.includes("wristband") && seenDocs.includes("consent"))) { setMessage("Compare Ari's wristband with the signed form before confirming identity."); return; }
    if (item === "Procedure and side match" && !confirmedSide) { setMessage("Pause here: the schedule leaves out the side. Open the signed form and confirm it first."); return; }
    if (item === "Allergies shared" && !seenDocs.includes("care")) { setMessage("Open the care notes and share the recorded allergy with the team first."); return; }
    if (item === "Equipment and supplies checked" && !needed.every(id => tray.includes(id))) { setMessage("Finish checking the supplies before marking the equipment ready."); return; }
    if (item === "Team confirms together" && !checkItems.slice(0, 4).every(value => checks.includes(value))) { setMessage("The team confirms together only after the other safety checks are complete."); return; }
    setChecks(previous => previous.includes(item) ? previous.filter(value => value !== item) : [...previous, item]);
    setMessage("Nurse Kim reads the check aloud. The team agrees on what has been verified.");
  }
  function reset() {
    setDocument(null); setSeenDocs([]); setFocus("patient"); setConfirmedSide(false); setTray([]); setSelected(null); setTool(null); setChecks([]); setDone(false);
    setMessage("Patient Ari is waiting. The schedule says 'wrist repair,' but it does not say which wrist. Check the documents before the team proceeds.");
  }
  return <section className="med-sim med-surgery" aria-label="Operating room preparation simulation">
    <div className="med-scene-header"><span><i className="med-live-dot" /> CASE 02 · PREPARATION ONLY</span><span>{done ? "Safety pause complete" : "Before the operation"}</span></div>
    <div className={'med-operating-room med-environment med-or-focus-' + focus}>
      <div className="med-or-light med-or-light-one" /><div className="med-or-light med-or-light-two" />
      <div className="med-or-window">OPERATING ROOM 03 <span>PREP PHASE</span></div>
      <div className="med-or-monitor"><small>MONITOR CHECK</small><svg viewBox="0 0 180 35" aria-hidden="true"><path d="M0 20 H36 l8 -12 8 23 8 -11 H105 l8 -8 8 18 8 -10 H180" /></svg><strong>Equipment ready</strong></div>
      <div className="med-or-bed"><span className="med-or-patient-head" /><span className="med-or-patient-body" /><span className="med-or-bed-frame" /></div>
      <div className="med-staff med-or-surgeon"><span className="med-person-head" /><span className="med-person-body" /><small>Dr. Vega</small></div>
      <div className={'med-staff med-or-nurse ' + (document ? "is-checking" : "")}><span className="med-person-head" /><span className="med-person-body" /><small>Nurse Kim</small></div>
      <div className="med-or-table"><span>INSTRUMENT TABLE</span><i>✦</i><i>⌁</i><i>◇</i></div><div className="med-or-floor" />
      <div className="med-or-camera" aria-label="Operating room camera views">{(["patient", "team", "equipment"] as const).map(view => <button key={view} className={focus === view ? "is-active" : ""} onClick={() => setFocus(view)} aria-pressed={focus === view}>{view[0].toUpperCase() + view.slice(1)}</button>)}</div>
      <span className="med-scene-caption">The team waits for your safety check. No procedure starts here.</span>
    </div>
    <div className="med-sim-body med-surgery-grid">
      <div className="med-story-column">
        <div className="med-story-card"><span className="med-section-label">TEAM UPDATE</span><p aria-live="polite">{message}</p><div className="med-story-speaker">Nurse Kim <span>“Let us make sure everything agrees before we begin.”</span></div></div>
        <div className="med-activity-card"><span className="med-section-label">01 · VERIFY THE STORY</span><h2>Read the room documents</h2><p>Open each document. One missing detail matters.</p>
          <div className="med-document-tabs">
            <button className={document === "schedule" ? "is-active" : ""} onClick={() => openDocument("schedule", "The schedule gives the procedure, but not the side. Keep looking.")}>Schedule</button>
            <button className={document === "wristband" ? "is-active" : ""} onClick={() => openDocument("wristband", "Ari's name and ID are visible. Compare them with the other documents.")}>Wristband</button>
            <button className={document === "consent" ? "is-active" : ""} onClick={() => openDocument("consent", "The signed form confirms 'left wrist repair' for Ari Lin. Share this with the team rather than assuming.")}>Signed form</button>
            <button className={document === "care" ? "is-active" : ""} onClick={() => openDocument("care", "The care notes record a penicillin allergy. Tell the team before they proceed.")}>Care notes</button>
          </div>
          <div className="med-document-page">{document === "schedule" ? <><small>ROOM SCHEDULE</small><strong>Ari Lin · ID 204</strong><span>Procedure: wrist repair</span><em>Side: not listed</em></> : document === "wristband" ? <><small>PATIENT WRISTBAND</small><strong>Ari Lin</strong><span>ID 204 · Date of birth verified</span></> : document === "consent" ? <><small>SIGNED FORM</small><strong>Ari Lin · ID 204</strong><span>Planned procedure: left wrist repair</span><span>Patient and team signed</span></> : document === "care" ? <><small>CARE NOTES</small><strong>Recorded allergy: penicillin</strong><span>Share this with the team.</span></> : <span>Choose a document to inspect.</span>}</div>
          <button className="med-secondary" disabled={document !== "consent" || confirmedSide} onClick={() => { setConfirmedSide(true); setMessage("You tell the team: the signed form says left wrist repair for Ari Lin. The team can now check that this matches the patient and plan."); }}>{confirmedSide ? "✓ Side confirmed with team" : "Confirm and share the missing detail"}</button>
        </div>
      </div>
      <div className="med-story-column">
        <div className="med-activity-card"><span className="med-section-label">02 · PREPARE THE AREA</span><h2>Check the supplies</h2><p>Drag suitable supplies into the prep area, or tap one and then tap the area. An opened pack should stay out.</p>
          <div className="med-supply-list">{supplies.map(item => <button key={item.id} draggable onDragStart={event => event.dataTransfer.setData("text/plain", item.id)} onClick={() => setSelected(item.id)} className={selected === item.id ? "is-selected" : ""}><strong>{item.title}</strong><small>{item.note}</small></button>)}</div>
          <button className="med-prep-zone" onClick={() => selected && addSupply(selected)} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); const id = event.dataTransfer.getData("text/plain") as Supply; if (supplies.some(item => item.id === id)) addSupply(id); }}><span>PREPARATION AREA</span><strong>{tray.length ? tray.map(id => supplies.find(item => item.id === id)?.title).join(" · ") : "Drop or tap a supply here"}</strong></button>
          <div className="med-tool-tray"><span className="med-section-label">INSTRUMENT TABLE · TAP TO EXPLORE</span><div>{instruments.map((item, index) => <button key={item.name} className={tool === index ? "is-active" : ""} onClick={() => { setTool(index); setFocus("equipment"); }}>{item.name}</button>)}</div><p aria-live="polite">{tool === null ? "Select an instrument to learn why the team checks it." : instruments[tool].use}</p></div>
        </div>
        <div className="med-activity-card"><span className="med-section-label">03 · SAFETY PAUSE</span><h2>Confirm together</h2><p>Mark each check when the team has verified it. Missing information keeps the room paused.</p>
          <div className="med-checklist">{checkItems.map(item => <label key={item} className={checks.includes(item) ? "is-checked" : ""}><input type="checkbox" checked={checks.includes(item)} onChange={() => toggleCheck(item)} /><span>{item}</span></label>)}</div>
          <button className="med-primary" disabled={!ready || done} onClick={() => { setDone(true); setMessage("The team repeats the patient, procedure, side, and allergy together. Supplies and equipment are checked. Your preparation work is complete; trained professionals now take over."); }}>{done ? "Safety pause complete" : "Finish the safety pause"}</button>
          <p className="med-inline-feedback" aria-live="polite">{ready ? "All critical checks are complete." : "The team cannot proceed until the documents, supplies, and safety checks are complete."}</p>
        </div>
      </div>
    </div>
    {done && <div className="med-recap" role="status"><span className="med-section-label">CASE RECAP</span><h2>The safest step was the pause</h2><p>You matched the patient identity, found the missing side on the signed form, shared the recorded allergy, checked supplies, and brought the team together for a final confirmation. Preparation and communication help prevent avoidable errors. This simulation stops before surgery begins.</p><button className="med-secondary" onClick={reset}>Replay the preparation</button></div>}
  </section>;
}
