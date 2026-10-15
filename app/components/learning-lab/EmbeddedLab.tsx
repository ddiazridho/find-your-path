"use client";

import { useState } from "react";
import { CircuitBoard, Lightbulb, MousePointer2, Unplug } from "lucide-react";
import { lessons } from "./lessons";
import { Completion, Guide, useProgress } from "./LessonUI";

type Part = "battery" | "button" | "resistor" | "led";
const parts: { id: Part; name: string; description: string; x: number; y: number }[] = [
  { id: "battery", name: "3 V battery", description: "Supplies energy. + is positive, − is negative.", x: 19, y: 32 },
  { id: "button", name: "Push button", description: "Closes the circuit while pressed. A and B are its terminals.", x: 62, y: 32 },
  { id: "resistor", name: "220 Ω resistor", description: "Limits current to protect the LED. Either orientation works.", x: 62, y: 73 },
  { id: "led", name: "Red LED", description: "Emits light. Connect the anode (+) before the cathode (−).", x: 19, y: 73 },
];
const terminals = [
  { id: "battery+", label: "Battery +", part: "battery", x: 29, y: 28 },
  { id: "battery-", label: "Battery −", part: "battery", x: 29, y: 39 },
  { id: "buttonA", label: "Button A", part: "button", x: 49, y: 32 },
  { id: "buttonB", label: "Button B", part: "button", x: 75, y: 32 },
  { id: "resistorA", label: "Resistor A", part: "resistor", x: 75, y: 73 },
  { id: "resistorB", label: "Resistor B", part: "resistor", x: 49, y: 73 },
  { id: "led+", label: "LED +", part: "led", x: 29, y: 68 },
  { id: "led-", label: "LED −", part: "led", x: 29, y: 79 },
];
export const wireKey = (a: string, b: string) => [a, b].sort().join("|");
export const correctWires = [wireKey("battery+", "buttonA"), wireKey("buttonB", "resistorA"), wireKey("resistorB", "led+"), wireKey("led-", "battery-")];

export function PartDrawing({ part, lit = false }: { part: Part; lit?: boolean }) {
  return <svg viewBox="0 0 100 70" role="img" aria-label={parts.find(item => item.id === part)?.name} className={`lab-part-drawing ${lit ? "is-lit" : ""}`}>
    {part === "battery" && <><rect x="17" y="12" width="62" height="46" rx="7" fill="#203b31" /><rect x="22" y="17" width="21" height="36" rx="3" fill="#d6e7bc" /><path d="M79 24h7v20h-7M29 35h10M34 30v10M54 35h12" stroke="#d6e7bc" strokeWidth="3" fill="none" /><text x="50" y="51" fill="white" fontSize="10">3 V</text></>}
    {part === "button" && <><path d="M13 25h15m44 0h15M13 48h15m44 0h15" stroke="#929b96" strokeWidth="5" /><rect x="25" y="12" width="50" height="47" rx="5" fill="#a2aca5" /><rect x="32" y="18" width="36" height="35" rx="4" fill="#34483e" /><circle cx="50" cy="35" r="13" fill="#687e6c" /></>}
    {part === "resistor" && <><path d="M5 35h23m44 0h23" stroke="#78847c" strokeWidth="4" /><rect x="25" y="23" width="50" height="24" rx="9" fill="#e8c995" /><path d="M36 24v22" stroke="#b64239" strokeWidth="5" /><path d="M46 24v22" stroke="#b64239" strokeWidth="5" /><path d="M56 24v22" stroke="#6b3e28" strokeWidth="5" /><path d="M67 24v22" stroke="#b38a39" strokeWidth="3" /></>}
    {part === "led" && <><path d="M42 45v22m17-22v17" stroke="#8c9690" strokeWidth="4" /><path className="lab-led-bulb" d="M33 46V26a17 17 0 0 1 34 0v20Z" fill={lit ? "#ff705b" : "#9b3c37"} /><rect x="29" y="43" width="42" height="7" rx="3" fill={lit ? "#e75f45" : "#7f3430"} /><path d="M41 18q-4 6-4 14" stroke="#ffc6b4" strokeWidth="3" fill="none" /></>}
  </svg>;
}

export default function EmbeddedLab() {
  const [placed, setPlaced] = useState<Part[]>([]);
  const [wires, setWires] = useState<string[]>([]);
  const [selectedTerminal, setSelectedTerminal] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);
  const [testedCircuit, setTestedCircuit] = useState("");
  const [message, setMessage] = useState("Place components, then select two terminals to add a wire.");
  const circuitSignature = JSON.stringify([placed.toSorted(), wires.toSorted()]);
  const complete = placed.length === 4 && wires.length === 4 && correctWires.every(wire => wires.includes(wire));
  const lit = complete && pressed;
  const progress = useProgress(`${circuitSignature}:${testedCircuit}`);
  function place(part: Part) { setPlaced(current => current.includes(part) ? current : [...current, part]); }
  function connect(id: string) {
    if (!selectedTerminal) { setSelectedTerminal(id); setMessage("Now select the terminal at the other end of the wire."); return; }
    if (selectedTerminal === id) { setSelectedTerminal(null); return; }
    const key = wireKey(selectedTerminal, id);
    setWires(current => current.includes(key) ? current : [...current, key]); setSelectedTerminal(null); setMessage("Wire added. Review the circuit loop in the guide.");
  }
  function release() { if (pressed && complete) setTestedCircuit(circuitSignature); setPressed(false); }
  function validate() {
    if (!placed.includes("battery")) return "Place the battery in its matching breadboard slot.";
    if (progress.step >= 1 && !placed.includes("button")) return "Add the push button to the breadboard.";
    if (progress.step >= 2 && (!placed.includes("resistor") || !placed.includes("led"))) return "Add both the 220 ohm resistor and the red LED.";
    if (progress.step >= 3 && !complete) return "Connect the four wires shown in the guide. Remove any extra or incorrect connections.";
    if (progress.step >= 4 && testedCircuit !== circuitSignature) return "Hold the test button, then release it to test the LED with your current wiring.";
    return null;
  }
  return <>
    <div className="lab-workspace lab-electronics">
      <Guide steps={lessons["embedded-system"].steps} progress={progress} validate={validate} />
      <section className="lab-panel"><div className="lab-panel-heading"><CircuitBoard size={18} /><h2>Your workbench</h2><span>Virtual breadboard</span></div><div className="lab-breadboard-wrap"><div className="lab-breadboard" aria-label="Breadboard assembly area">
        <div className="lab-power-rail rail-positive">+ · Power rail</div><div className="lab-power-rail rail-negative">− · Return rail</div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="lab-wires" aria-hidden="true">{wires.map(key => {
          const [a, b] = key.split("|"); const from = terminals.find(item => item.id === a)!; const to = terminals.find(item => item.id === b)!;
          const path = key === wireKey("battery-", "led-") ? "M29 39 L6 39 L6 88 L29 88 L29 79" : `M${from.x} ${from.y} L${(from.x + to.x) / 2} ${(from.y + to.y) / 2 - 7} L${to.x} ${to.y}`;
          return <path key={key} d={path} fill="none" stroke={correctWires.includes(key) ? "#2c8060" : "#b14c38"} strokeWidth="0.8" />;
        })}</svg>
        {parts.map(part => <button key={part.id} className={`lab-component-slot ${placed.includes(part.id) ? "is-placed" : ""}`} style={{ left: `${part.x}%`, top: `${part.y}%` }} aria-label={`${placed.includes(part.id) ? "Placed" : "Place"} ${part.name}`} onClick={() => place(part.id)} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); if (event.dataTransfer.getData("text/plain") === part.id) place(part.id); }}>
          {placed.includes(part.id) ? <PartDrawing part={part.id} lit={part.id === "led" && lit} /> : <span>+ {part.name}</span>}
        </button>)}
        {terminals.filter(terminal => placed.includes(terminal.part as Part)).map(terminal => <button key={terminal.id} className={`lab-terminal ${selectedTerminal === terminal.id ? "is-selected" : ""}`} style={{ left: `${terminal.x}%`, top: `${terminal.y}%` }} onClick={() => connect(terminal.id)} aria-label={`Connect ${terminal.label}`} aria-pressed={selectedTerminal === terminal.id}><span>{terminal.label}</span></button>)}
      </div></div><div className="lab-test-bar"><button className={`lab-primary ${pressed ? "is-pressed" : ""}`} aria-label="Hold to test LED" onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); setPressed(true); }} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release} onKeyDown={event => { if ([" ", "Enter"].includes(event.key)) { event.preventDefault(); setPressed(true); } }} onKeyUp={event => { if ([" ", "Enter"].includes(event.key)) release(); }} onBlur={release}><MousePointer2 size={17} />Hold to test LED</button><span role="status"><Lightbulb size={18} />{lit ? "LED on · circuit closed" : "LED off · button released"}</span></div><p className="lab-panel-foot" role="status">{message}</p></section>
      <aside className="lab-panel"><div className="lab-panel-heading"><Unplug size={18} /><h2>Component tray</h2></div><div className="lab-component-tray">{parts.map(part => <button className="lab-part-item" key={part.id} draggable={!placed.includes(part.id)} onDragStart={event => event.dataTransfer.setData("text/plain", part.id)} onClick={() => place(part.id)} disabled={placed.includes(part.id)}><PartDrawing part={part.id} /><span><strong>{part.name}</strong><small>{part.description}</small><em>{placed.includes(part.id) ? "Placed on breadboard" : "Drag or click to place"}</em></span></button>)}</div><div className="lab-connections"><h3>Connections · {wires.length}</h3>{wires.length === 0 && <p>No wires yet. Click two labeled terminals.</p>}{wires.map(wire => <button key={wire} className="lab-wire-item" onClick={() => setWires(current => current.filter(item => item !== wire))}>{wire.split("|").map(id => terminals.find(item => item.id === id)!.label).join(" ↔ ")}<span>Remove</span></button>)}<p className="lab-small-note">The labeled terminals model a series circuit. Breadboard hole connections are simplified for this lesson.</p></div></aside>
    </div><Completion track="embedded-system" progress={progress} />
  </>;
}
