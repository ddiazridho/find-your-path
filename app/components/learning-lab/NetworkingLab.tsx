"use client";

import { useState } from "react";
import { Cable, Check, Mail, Monitor, Network, Router, Server, Terminal, Wifi } from "lucide-react";
import { lessons } from "./lessons";
import { Completion, Guide, useProgress } from "./LessonUI";

type Device = "pc1" | "pc2" | "switch" | "router";
type Endpoint = Exclude<Device, "switch">;
const devices: { id: Device; name: string; x: number; y: number }[] = [
  { id: "router", name: "Router", x: 50, y: 16 }, { id: "switch", name: "Switch", x: 50, y: 46 },
  { id: "pc1", name: "PC-1", x: 22, y: 81 }, { id: "pc2", name: "PC-2", x: 78, y: 81 },
];
const nameOf = (id: Device) => devices.find(device => device.id === id)!.name;
export function networkError(ips: Record<Endpoint, string>, links: string[], source: Endpoint, destination: Endpoint) {
  if (source === destination) return "Choose a different destination to test communication between devices.";
  for (const id of [source, destination]) {
    if (!links.includes(id)) return `${nameOf(id)} is not connected to the switch. Add its cable first.`;
    const address = ips[id].split(".");
    if (address.length !== 4 || address.some(octet => !/^(0|[1-9]\d{0,2})$/.test(octet) || Number(octet) > 255) || Number(address[3]) === 0 || Number(address[3]) === 255) return `${nameOf(id)} needs a valid IPv4 host address, such as 192.168.1.10.`;
  }
  if (Object.values(ips).filter(ip => ip === ips[source]).length > 1 || Object.values(ips).filter(ip => ip === ips[destination]).length > 1) return "Two devices have the same IP address. Give every device a unique address.";
  if (ips[source].split(".").slice(0, 3).join(".") !== ips[destination].split(".").slice(0, 3).join(".")) return "The devices are on different /24 subnets. Use 192.168.1.x for this lesson.";
  return null;
}

export default function NetworkingLab() {
  const [links, setLinks] = useState<string[]>([]);
  const [selected, setSelected] = useState<Device | null>(null);
  const [pc1, setPc1] = useState(""); const [pc2, setPc2] = useState("");
  const [source, setSource] = useState<"pc1" | "pc2">("pc1");
  const [destination, setDestination] = useState<Endpoint>("pc2");
  const [message, setMessage] = useState("Select a device, then select the switch to connect them.");
  const [logs, setLogs] = useState<string[]>(["Network simulator ready.", "Add cables and configure IP addresses to begin."]);
  const [evidence, setEvidence] = useState<Record<string, string>>({});
  const [packet, setPacket] = useState<{ id: number; path: string } | null>(null);
  const ips = { pc1: pc1.trim(), pc2: pc2.trim(), router: "192.168.1.1" };
  const signature = JSON.stringify([links.toSorted(), ips]);
  const progress = useProgress(signature + JSON.stringify(evidence));
  function connect(id: Device) {
    if (!selected) { setSelected(id); setMessage(`${nameOf(id)} selected. Now select its connection partner.`); return; }
    if (selected === id) { setSelected(null); return; }
    if (selected !== "switch" && id !== "switch") { setMessage("For this topology, connect each PC and the router to the switch."); setSelected(null); return; }
    const endpoint = selected === "switch" ? id : selected;
    setLinks(current => current.includes(endpoint) ? current : [...current, endpoint]);
    setMessage(`${nameOf(endpoint)} is connected to Switch.`); setSelected(null);
  }
  function ping() {
    const error = networkError(ips, links, source, destination);
    const command = `> ${nameOf(source)}: ping ${ips[destination] || "(no address)"}`;
    if (error) { setLogs(current => [...current.slice(-18), command, `Request failed: ${error}`]); setPacket(null); return; }
    setEvidence(current => ({ ...current, [`${source}-${destination}`]: signature }));
    const from = devices.find(device => device.id === source)!; const to = devices.find(device => device.id === destination)!;
    setPacket(current => ({ id: (current?.id ?? 0) + 1, path: `M${from.x * 6} ${from.y * 4} L300 184 L${to.x * 6} ${to.y * 4} L300 184 L${from.x * 6} ${from.y * 4}` }));
    setLogs(current => [...current.slice(-18), command, ...Array.from({ length: 4 }, (_, index) => `Reply from ${ips[destination]}: bytes=32 time=${index % 2 + 2}ms TTL=64`), "Packets: sent = 4, received = 4, lost = 0 (0% loss)."]);
  }
  function validate() {
    if (!links.includes("pc1") || !links.includes("pc2")) return "Connect both PC-1 and PC-2 to the switch.";
    if (progress.step >= 1 && (ips.pc1 !== "192.168.1.10" || ips.pc2 !== "192.168.1.11")) return "Use 192.168.1.10 for PC-1 and 192.168.1.11 for PC-2, as shown in the guide.";
    if (progress.step >= 2 && evidence["pc1-pc2"] !== signature) return "Send a successful ping from PC-1 to PC-2 with your current configuration.";
    if (progress.step >= 3 && !links.includes("router")) return "Connect Router to Switch.";
    if (progress.step >= 3 && evidence["pc1-router"] !== signature) return "Send a successful ping from PC-1 to Router with the current cables and addresses.";
    return null;
  }
  // Adding the gateway changes the topology but preserves the verified local PC path.
  function validateWithGateway() {
    if (progress.step !== 3) return validate();
    if (!links.includes("pc1") || !links.includes("pc2") || !links.includes("router")) return "Connect both PCs and Router to Switch.";
    if (ips.pc1 !== "192.168.1.10" || ips.pc2 !== "192.168.1.11") return "Keep PC-1 at 192.168.1.10 and PC-2 at 192.168.1.11.";
    if (evidence["pc1-router"] !== signature) return "Send a successful ping from PC-1 to Router with your current configuration.";
    return null;
  }
  return <><div className="lab-workspace lab-networking">
    <Guide steps={lessons.networking.steps} progress={progress} validate={validateWithGateway}><details className="lab-hint"><summary>Switch or router?</summary><p>A switch joins devices in one local network. A router forwards traffic between networks. Our router is the gateway at 192.168.1.1.</p></details></Guide>
    <section className="lab-panel lab-topology-panel"><div className="lab-panel-heading"><Network size={18} /><h2>Network topology</h2><span>Local network · /24</span></div><div className="lab-topology">
      <svg viewBox="0 0 600 400" preserveAspectRatio="none" className="lab-network-lines" aria-hidden="true">{links.map(id => { const device = devices.find(item => item.id === id)!; return <line key={id} x1={device.x * 6} y1={device.y * 4} x2="300" y2="184" stroke="#71ceaa" strokeWidth="3" />; })}{packet && <g key={packet.id} className="lab-packet"><rect x="-12" y="-8" width="24" height="16" rx="3" fill="#f5ca78" stroke="#17291f" /><path d="m-11-6 11 8 11-8" stroke="#594724" fill="none" /><animateMotion dur="2.4s" repeatCount="1" fill="freeze" path={packet.path} /></g>}</svg>
      {devices.map(device => { const DeviceIcon = device.id === "router" ? Router : device.id === "switch" ? Server : Monitor; return <button key={device.id} className={`lab-device ${selected === device.id ? "is-selected" : ""}`} style={{ left: `${device.x}%`, top: `${device.y}%` }} onClick={() => connect(device.id)} aria-pressed={selected === device.id} aria-label={`Connect ${device.name}`}><DeviceIcon size={27} /><strong>{device.name}</strong><small>{device.id === "switch" ? "Layer 2" : ips[device.id] || "No IP address"}</small></button>; })}
    </div><p className="lab-topology-message" role="status"><Cable size={15} />{message}</p><div className="lab-ip-fields"><label>PC-1 IP address<input aria-label="PC-1 IP address" placeholder="192.168.1.10" value={pc1} onChange={event => setPc1(event.target.value)} inputMode="decimal" /><small>Subnet mask: 255.255.255.0</small></label><label>PC-2 IP address<input aria-label="PC-2 IP address" placeholder="192.168.1.11" value={pc2} onChange={event => setPc2(event.target.value)} inputMode="decimal" /><small>Subnet mask: 255.255.255.0</small></label></div><div className="lab-ping-controls"><label>From<select aria-label="Ping source" value={source} onChange={event => setSource(event.target.value as "pc1" | "pc2")}><option value="pc1">PC-1</option><option value="pc2">PC-2</option></select></label><label>To<select aria-label="Ping destination" value={destination} onChange={event => setDestination(event.target.value as Endpoint)}><option value="pc1">PC-1</option><option value="pc2">PC-2</option><option value="router">Router (192.168.1.1)</option></select></label><button className="lab-primary" onClick={ping}><Wifi size={17} />Send ping</button></div></section>
    <aside className="lab-panel lab-status-panel"><div className="lab-panel-heading"><Terminal size={18} /><h2>Status & terminal</h2></div><div className="lab-network-status">{["pc1", "pc2", "router"].map(id => <div key={id}><span>{nameOf(id as Device)} ↔ Switch</span><span className={`lab-connection-status ${links.includes(id) ? "is-connected" : ""}`}>{links.includes(id) ? <><Check size={13} />Connected</> : "No cable"}</span>{links.includes(id) && <button className="lab-remove-link" aria-label={`Remove ${nameOf(id as Device)} cable`} onClick={() => setLinks(current => current.filter(item => item !== id))}>Remove</button>}</div>)}</div><div className="lab-terminal-output" role="log" aria-label="Simulated ping terminal" aria-live="polite"><div className="lab-terminal-label"><Mail size={15} />Simulated packet traffic</div>{logs.map((line, index) => <p key={`${index}-${line}`} className={line.includes("failed") ? "is-error" : ""}>{line}</p>)}</div><p className="lab-panel-foot">This is a learning model. No traffic leaves your browser.</p></aside>
  </div><Completion track="networking" progress={progress} /></>;
}
