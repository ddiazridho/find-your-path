"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Workflow, 
  Battery, 
  ShieldAlert, 
  QrCode, 
  Truck,
  Compass,
  Cpu,
  RefreshCw,
  Lightbulb
} from "lucide-react";
import { sounds } from "../lib/sound-effects";

interface DecisionStep {
  id: string;
  condition: string;
  icon: React.ReactNode;
  question: string;
  chosenOptionId: string;
  options: {
    id: string;
    label: string;
    outcomeType: "success" | "failure" | "warning";
    description: string;
  }[];
}

export default function LogicFlowSimulation({ isModal = false, onClose }: { isModal?: boolean; onClose?: () => void }) {
  const [obstacleChoice, setObstacleChoice] = useState<"reroute" | "ignore">("reroute");
  const [batteryChoice, setBatteryChoice] = useState<"charge" | "rush">("charge");
  const [deliveryChoice, setDeliveryChoice] = useState<"verify" | "dump">("verify");

  const [simState, setSimState] = useState<"idle" | "running" | "finished">("idle");
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [roverPosition, setRoverPosition] = useState({ x: 10, y: 50 });
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [failureReason, setFailureReason] = useState<string>("");

  const handleReset = () => {
    sounds.playClick();
    setSimState("idle");
    setActiveStepIndex(-1);
    setRoverPosition({ x: 10, y: 50 });
    setSimLogs([]);
    setIsSuccess(null);
    setFailureReason("");
  };

  const runSimulation = () => {
    sounds.playPulse();
    setSimState("running");
    setActiveStepIndex(0);
    setSimLogs(["🚀 Rover initialized at Hub Alpha", "📡 GPS calibrated. Heading toward North Quad..."]);
    setRoverPosition({ x: 20, y: 50 });

    // Step 1: Obstacle check after 700ms
    setTimeout(() => {
      setActiveStepIndex(1);
      if (obstacleChoice === "ignore") {
        sounds.playError();
        setSimLogs(prev => [
          ...prev,
          "⚠️ Sensor Warning: Concrete bench detected ahead!",
          "💥 CRASH! Rover ignored obstacle and collided with park bench."
        ]);
        setRoverPosition({ x: 40, y: 50 });
        setSimState("finished");
        setIsSuccess(false);
        setFailureReason("Collision Error: The algorithm skipped the rerouting routine when an obstacle was detected.");
        return;
      }

      sounds.playClick();
      setSimLogs(prev => [
        ...prev,
        "⚠️ Sensor: Obstacle detected 1.2m ahead.",
        "🔄 Executing Reroute Routine: Sidewalk path bypassed safely."
      ]);
      setRoverPosition({ x: 45, y: 30 });

      // Step 2: Battery check after 900ms
      setTimeout(() => {
        setActiveStepIndex(2);
        if (batteryChoice === "rush") {
          sounds.playError();
          setSimLogs(prev => [
            ...prev,
            "🔋 Battery critical (11%)...",
            "🪫 SHUTDOWN! Battery depleted in the library courtyard. Rover stranded."
          ]);
          setRoverPosition({ x: 65, y: 35 });
          setSimState("finished");
          setIsSuccess(false);
          setFailureReason("Power Depletion: The algorithm skipped the fast-charge stop with low battery.");
          return;
        }

        sounds.playClick();
        setSimLogs(prev => [
          ...prev,
          "🔋 Battery at 14% -> Diverted to Solar Dock Station.",
          "⚡ 60-second rapid recharge complete (battery restored to 95%)."
        ]);
        setRoverPosition({ x: 65, y: 50 });

        // Step 3: Recipient verification check after 900ms
        setTimeout(() => {
          setActiveStepIndex(3);
          if (deliveryChoice === "dump") {
            sounds.playError();
            setSimLogs(prev => [
              ...prev,
              "📦 Parcel dumped on open sidewalk.",
              "❌ Failure: Rain ruined the lunch box and a squirrel ran off with it!"
            ]);
            setRoverPosition({ x: 85, y: 50 });
            setSimState("finished");
            setIsSuccess(false);
            setFailureReason("Security Failure: The algorithm left the package unverified on the sidewalk.");
            return;
          }

          sounds.playSuccess();
          setSimLogs(prev => [
            ...prev,
            "📍 Arrived at Dorm Hall B.",
            "📱 Student scanned QR Code via FYP App.",
            "🔓 Compartment unlocked. Bento meal delivered fresh!",
            "🎉 MISSION SUCCESS: 100% On-Time Delivery!"
          ]);
          setRoverPosition({ x: 90, y: 50 });
          setSimState("finished");
          setIsSuccess(true);
          try {
            confetti({
              particleCount: 90,
              spread: 80,
              origin: { y: 0.6 }
            });
          } catch {}
        }, 1000);
      }, 1000);
    }, 900);
  };

  return (
    <div className="legacy-simulation w-full min-h-screen bg-[#0b1329] text-slate-100 font-sans flex flex-col selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Floating Glass Navigation */}
      <section aria-label="Simulation tools" className="bg-[#0f172a]/90 backdrop-blur-md border-b border-purple-900/40 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {isModal && onClose ? (
            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold transition-all shadow-sm group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Office</span>
            </button>
          ) : null}

          <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono text-xs font-bold border border-purple-500/30">
              🧠
            </span>
            <div>
              <div className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                Logic &amp; Algorithm Architecture
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 whitespace-nowrap">
                  Visual Flowchart Sandbox
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            disabled={simState === "running"}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700/60"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Flow</span>
          </button>
          <button
            onClick={runSimulation}
            disabled={simState === "running"}
            className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-purple-900/40 transition-all cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${simState === "running" ? "animate-spin" : ""}`} />
            <span>{simState === "running" ? "Simulating..." : "Test Algorithm"}</span>
          </button>
        </div>
      </section>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Flowchart Architecture Canvas */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-slate-900/80 backdrop-blur-md border border-purple-900/30 rounded-2xl p-5 shadow-xl flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 bg-purple-950/70 px-2 py-0.5 rounded border border-purple-800/60">
                  System Design Puzzle
                </span>
                <div className="!text-xl font-bold text-white mt-1 leading-snug">
                  Autonomous Campus Rover Decision Tree
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Configure the decision branches below. How should the software handle obstacles, battery depletion, and recipient dropoff?
                </p>
              </div>
            </div>

            {/* Visual Node Diagram */}
            <div className="space-y-4 relative py-2">
              {/* NODE 0: Start */}
              <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                activeStepIndex === 0 
                  ? "bg-purple-900/40 border-purple-400 shadow-md ring-2 ring-purple-500/30" 
                  : "bg-slate-800/60 border-slate-700/60"
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">Start: Order Dispatched</div>
                    <div className="text-[11px] text-slate-400">Campus Bento Delivery #402</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  READY
                </span>
              </div>

              {/* Connecting Pipe */}
              <div className="w-0.5 h-4 bg-purple-500/40 mx-auto" />

              {/* NODE 1: Obstacle Branch */}
              <div className={`p-4 rounded-xl border transition-all ${
                activeStepIndex === 1
                  ? "bg-purple-900/40 border-purple-400 shadow-md ring-2 ring-purple-500/30"
                  : "bg-slate-800/70 border-slate-700/60"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    Decision 1: Obstacle In Proximity (&lt; 1.5m)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() => { sounds.playClick(); setObstacleChoice("reroute"); }}
                    className={`p-3 rounded-lg text-left border transition-all cursor-pointer ${
                      obstacleChoice === "reroute"
                        ? "bg-purple-600/30 border-purple-400 text-white shadow-sm ring-1 ring-purple-400"
                        : "bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="font-semibold text-xs flex items-center justify-between">
                      <span>Reroute via Sidewalk</span>
                      {obstacleChoice === "reroute" && <CheckCircle2 className="w-3.5 h-3.5 text-purple-300" />}
                    </div>
                    <p className="text-[11px] text-slate-300/80 mt-1">
                      Compute alternate path using campus sidewalk vector map.
                    </p>
                  </button>

                  <button
                    onClick={() => { sounds.playClick(); setObstacleChoice("ignore"); }}
                    className={`p-3 rounded-lg text-left border transition-all cursor-pointer ${
                      obstacleChoice === "ignore"
                        ? "bg-rose-950/40 border-rose-400 text-rose-200 shadow-sm ring-1 ring-rose-400"
                        : "bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="font-semibold text-xs flex items-center justify-between">
                      <span>Maintain Course &amp; Honk</span>
                      {obstacleChoice === "ignore" && <XCircle className="w-3.5 h-3.5 text-rose-300" />}
                    </div>
                    <p className="text-[11px] text-slate-300/80 mt-1">
                      Keep full speed and sound piezo buzzer horn.
                    </p>
                  </button>
                </div>
              </div>

              {/* Connecting Pipe */}
              <div className="w-0.5 h-4 bg-purple-500/40 mx-auto" />

              {/* NODE 2: Battery Branch */}
              <div className={`p-4 rounded-xl border transition-all ${
                activeStepIndex === 2
                  ? "bg-purple-900/40 border-purple-400 shadow-md ring-2 ring-purple-500/30"
                  : "bg-slate-800/70 border-slate-700/60"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Battery className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold text-sky-300 uppercase tracking-wide">
                    Decision 2: Battery Low (&lt; 20%)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() => { sounds.playClick(); setBatteryChoice("charge"); }}
                    className={`p-3 rounded-lg text-left border transition-all cursor-pointer ${
                      batteryChoice === "charge"
                        ? "bg-purple-600/30 border-purple-400 text-white shadow-sm ring-1 ring-purple-400"
                        : "bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="font-semibold text-xs flex items-center justify-between">
                      <span>Solar Dock Rapid Charge</span>
                      {batteryChoice === "charge" && <CheckCircle2 className="w-3.5 h-3.5 text-purple-300" />}
                    </div>
                    <p className="text-[11px] text-slate-300/80 mt-1">
                      Pause for 60s at solar pad on way to Dorm C.
                    </p>
                  </button>

                  <button
                    onClick={() => { sounds.playClick(); setBatteryChoice("rush"); }}
                    className={`p-3 rounded-lg text-left border transition-all cursor-pointer ${
                      batteryChoice === "rush"
                        ? "bg-rose-950/40 border-rose-400 text-rose-200 shadow-sm ring-1 ring-rose-400"
                        : "bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="font-semibold text-xs flex items-center justify-between">
                      <span>Ignore &amp; Push Ahead</span>
                      {batteryChoice === "rush" && <XCircle className="w-3.5 h-3.5 text-rose-300" />}
                    </div>
                    <p className="text-[11px] text-slate-300/80 mt-1">
                      Attempt direct delivery without recharge.
                    </p>
                  </button>
                </div>
              </div>

              {/* Connecting Pipe */}
              <div className="w-0.5 h-4 bg-purple-500/40 mx-auto" />

              {/* NODE 3: Recipient Handshake */}
              <div className={`p-4 rounded-xl border transition-all ${
                activeStepIndex === 3
                  ? "bg-purple-900/40 border-purple-400 shadow-md ring-2 ring-purple-500/30"
                  : "bg-slate-800/70 border-slate-700/60"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                    Decision 3: Recipient Arrival Handshake
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() => { sounds.playClick(); setDeliveryChoice("verify"); }}
                    className={`p-3 rounded-lg text-left border transition-all cursor-pointer ${
                      deliveryChoice === "verify"
                        ? "bg-purple-600/30 border-purple-400 text-white shadow-sm ring-1 ring-purple-400"
                        : "bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="font-semibold text-xs flex items-center justify-between">
                      <span>Verify Student QR Code</span>
                      {deliveryChoice === "verify" && <CheckCircle2 className="w-3.5 h-3.5 text-purple-300" />}
                    </div>
                    <p className="text-[11px] text-slate-300/80 mt-1">
                      Secure authentication prevents stolen food orders.
                    </p>
                  </button>

                  <button
                    onClick={() => { sounds.playClick(); setDeliveryChoice("dump"); }}
                    className={`p-3 rounded-lg text-left border transition-all cursor-pointer ${
                      deliveryChoice === "dump"
                        ? "bg-rose-950/40 border-rose-400 text-rose-200 shadow-sm ring-1 ring-rose-400"
                        : "bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="font-semibold text-xs flex items-center justify-between">
                      <span>Drop Parcel on Sidewalk</span>
                      {deliveryChoice === "dump" && <XCircle className="w-3.5 h-3.5 text-rose-300" />}
                    </div>
                    <p className="text-[11px] text-slate-300/80 mt-1">
                      Unload box immediately on pavement without verifying.
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Radar Map & Simulation Execution Terminal */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Visual 2D Campus Radar Grid */}
          <div className="bg-slate-900/90 border border-purple-900/40 rounded-2xl p-4 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <span className="text-purple-300 font-bold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                Live Campus Radar Simulation
              </span>
              <span className="text-slate-400 text-[11px]">
                Status: {simState.toUpperCase()}
              </span>
            </div>

            {/* Radar Simulation Canvas */}
            <div className="simulation-artwork relative w-full h-52 bg-[#050b1a] rounded-xl border border-slate-800 overflow-hidden">
              {/* Grid Lines */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{ 
                  backgroundImage: "radial-gradient(#8b5cf6 1px, transparent 1px)", 
                  backgroundSize: "20px 20px" 
                }} 
              />

              {/* Campus Landmarks */}
              <div className="absolute top-4 left-6 text-[10px] font-mono text-slate-500 bg-slate-900/70 px-2 py-0.5 rounded border border-slate-800">
                Hub Alpha (Origin)
              </div>
              <div className="absolute top-6 right-6 text-[10px] font-mono text-emerald-400 bg-slate-900/70 px-2 py-0.5 rounded border border-slate-800">
                Dorm B (Destination)
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-sky-400 bg-slate-900/70 px-2 py-0.5 rounded border border-slate-800">
                Solar Charging Dock
              </div>

              {/* Obstacle (Bench) */}
              <div className="absolute top-[42%] left-[45%] w-8 h-8 rounded bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-[10px] text-amber-300 font-bold">
                🚧
              </div>

              {/* Delivery Rover Sprite */}
              <div
                className="absolute w-8 h-8 rounded-full bg-purple-600 text-white border-2 border-purple-300 flex items-center justify-center text-xs shadow-lg shadow-purple-900/60 transition-all duration-700 ease-out"
                style={{
                  left: `${roverPosition.x}%`,
                  top: `${roverPosition.y}%`,
                  transform: "translate(-50%, -50%)"
                }}
              >
                🤖
              </div>
            </div>

            {/* Live Telemetry Bar */}
            <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs font-mono">
              <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block">Battery</span>
                <span className={`font-bold ${batteryChoice === "charge" && activeStepIndex >= 2 ? "text-emerald-400" : "text-amber-400"}`}>
                  {batteryChoice === "charge" && activeStepIndex >= 2 ? "95%" : "14%"}
                </span>
              </div>
              <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block">LIDAR Sensor</span>
                <span className="font-bold text-sky-300">
                  {obstacleChoice === "reroute" ? "Active (Bypass)" : "Ignored"}
                </span>
              </div>
              <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block">Cargo Bay</span>
                <span className="font-bold text-emerald-300">
                  {isSuccess ? "Delivered" : "Secured"}
                </span>
              </div>
            </div>
          </div>

          {/* Execution Log Terminal */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex-1 flex flex-col min-h-[190px]">
            <span className="text-xs font-mono text-slate-400 mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              Algorithm Execution Log
            </span>

            <div className="flex-1 font-mono text-xs space-y-1.5 overflow-y-auto max-h-48 bg-black/40 p-3 rounded-xl border border-slate-800/80">
              {simLogs.length === 0 ? (
                <p className="text-slate-500 italic">
                  Press &apos;Test Algorithm&apos; to watch the rover execute the decision tree in real-time...
                </p>
              ) : (
                simLogs.map((log, i) => (
                  <div key={i} className="text-slate-300">
                    {log}
                  </div>
                ))
              )}
            </div>

            {/* Result Box */}
            {simState === "finished" && (
              <div className={`mt-3 p-3 rounded-xl border flex items-start gap-2.5 ${
                isSuccess
                  ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200"
                  : "bg-rose-950/60 border-rose-500/40 text-rose-200"
              }`}>
                {isSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-xs font-bold">
                    {isSuccess ? "Algorithm Mastered!" : "Edge Case Not Handled"}
                  </div>
                  <p className="text-[11px] mt-0.5">
                    {isSuccess
                      ? "Your flowchart logic successfully routed the rover, safely recharged, and authenticated the student!"
                      : failureReason}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Real World Insight */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-semibold text-slate-200 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Real-World Role Insight: Algorithm Architects</span>
            </div>
            <p className="leading-relaxed text-slate-300 text-[11px]">
              Before writing code, software engineers use flowcharts and state diagrams to map out all possible scenarios and edge cases. Planning logic upfront prevents multi-million dollar bugs!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
