"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Code, 
  Workflow, 
  Database, 
  Maximize2, 
  Minimize2, 
  CheckCircle2, 
  Compass, 
  Info,
  X,
  ExternalLink
} from "lucide-react";
import { sounds } from "./sound-effects";
import CodingSimulation from "./CodingSimulation";
import LogicFlowSimulation from "./LogicFlowSimulation";
import DatabaseSimulation from "./DatabaseSimulation";

type ActiveSimulation = "none" | "coding" | "logic-flow" | "database";

interface HotspotConfig {
  id: "coding" | "logic-flow" | "database";
  title: string;
  badge: string;
  dotColor: string;
  badgeBg: string;
  badgeBorder: string;
  tooltip: string;
  roleDescription: string;
  position: { left: string; top: string }; // Badge anchor
  area: { left: string; top: string; width: string; height: string }; // Clickable bounding box
  route: string;
}

const HOTSPOTS: HotspotConfig[] = [
  {
    id: "coding",
    title: "Coding & Bug Fix",
    badge: "💻 Coding & Bug Fix",
    dotColor: "bg-emerald-400",
    badgeBg: "bg-emerald-950/85 text-emerald-200",
    badgeBorder: "border-emerald-500/50 shadow-emerald-900/30",
    tooltip: "Click to inspect code & squash real-world bugs!",
    roleDescription: "Step into the shoes of a Software Engineer. Fix a tricky bug in a live code editor and verify with automated tests.",
    position: { left: "20.5%", top: "35%" },
    area: { left: "8%", top: "33%", width: "25%", height: "43%" },
    route: "/computer-science/software/simulation/coding"
  },
  {
    id: "database",
    title: "Database & SQL Query",
    badge: "🗄️ Database & SQL Query",
    dotColor: "bg-cyan-400",
    badgeBg: "bg-cyan-950/85 text-cyan-200",
    badgeBorder: "border-cyan-500/50 shadow-cyan-900/30",
    tooltip: "Click to inspect cloud telemetry & run live SQL queries!",
    roleDescription: "Step into the shoes of a Backend & Data Engineer. Query high-traffic cloud clusters and stream logs using SQL.",
    position: { left: "54.5%", top: "14%" },
    area: { left: "44%", top: "10%", width: "22%", height: "29%" },
    route: "/computer-science/software/simulation/database"
  },
  {
    id: "logic-flow",
    title: "Logic & Flowchart",
    badge: "🧠 Logic & Flowchart",
    dotColor: "bg-purple-400",
    badgeBg: "bg-purple-950/85 text-purple-200",
    badgeBorder: "border-purple-500/50 shadow-purple-900/30",
    tooltip: "Click to design algorithm logic & flowchart nodes!",
    roleDescription: "Step into the shoes of an Algorithm Architect. Build decision trees and simulate an autonomous campus rover.",
    position: { left: "81%", top: "33%" },
    area: { left: "64%", top: "30%", width: "29%", height: "47%" },
    route: "/computer-science/software/simulation/logic-flow"
  }
];

export default function DioramaCanvas({ initialModal = "none" }: { initialModal?: ActiveSimulation }) {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<ActiveSimulation>(initialModal);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [visitedStations, setVisitedStations] = useState<Record<string, boolean>>({});
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [easterEggInfo, setEasterEggInfo] = useState<string | null>(null);

  // 3D Parallax tilt effect based on mouse cursor
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || activeModal !== "none") return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Gentle 3D perspective tilt (-4deg to +4deg)
    setTilt({
      x: -y * 3.5,
      y: x * 4.5
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHoveredHotspot(null);
  };

  const openStation = (id: ActiveSimulation) => {
    sounds.playClick();
    setActiveModal(id);
    if (id !== "none") {
      setVisitedStations(prev => ({ ...prev, [id]: true }));
      // Shallow route update to match deep link requirement
      window.history.pushState(null, "", `/computer-science/software/simulation/${id}`);
    }
  };

  const closeModal = () => {
    sounds.playClick();
    setActiveModal("none");
    window.history.pushState(null, "", "/computer-science/software");
  };

  const toggleSound = () => {
    const next = sounds.toggleMute();
    setIsMuted(next);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const exploredCount = Object.keys(visitedStations).length;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-screen h-screen overflow-hidden bg-[#18181b] select-none font-sans text-slate-100 flex items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      {/* =========================================================================
          BACKGROUND / 3D ISOMETRIC ROOM DIORAMA CANVAS
      ========================================================================== */}
      <div
        className="relative w-full h-full max-w-[1920px] max-h-[1080px] transition-transform duration-300 ease-out origin-center flex items-center justify-center"
        style={{
          transform: activeModal === "none"
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
            : "scale(0.98) blur(2px)",
          filter: activeModal !== "none" ? "brightness(0.65)" : "none",
        }}
      >
        {/* Clean 3/4 Isometric Architectural Office Cutaway Background */}
        <div 
          className="absolute inset-0 w-full h-full bg-contain bg-center bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: "url('/images/office-diorama.jpg')",
          }}
        />

        {/* Ambient Warm Lighting Overlay Gradient */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-soft-light"
          style={{
            background: "radial-gradient(circle at 50% 40%, rgba(255,248,230,0.8) 0%, rgba(30,25,20,0.4) 100%)"
          }}
        />

        {/* =========================================================================
            INTERACTIVE HOTSPOTS & CLICKABLE REGIONS
        ========================================================================== */}
        {HOTSPOTS.map(spot => {
          const isHovered = hoveredHotspot === spot.id;
          const isVisited = visitedStations[spot.id];

          return (
            <React.Fragment key={spot.id}>
              {/* Invisible / Clickable Hotspot Bounding Area with Glow on Hover */}
              <div
                onClick={() => openStation(spot.id)}
                onMouseEnter={() => {
                  sounds.playHover();
                  setHoveredHotspot(spot.id);
                }}
                onMouseLeave={() => setHoveredHotspot(null)}
                className={`absolute cursor-pointer rounded-3xl transition-all duration-300 z-20 ${
                  isHovered
                    ? "ring-4 ring-emerald-400/60 bg-emerald-400/10 shadow-[0_0_50px_rgba(52,211,153,0.35)] scale-[1.02]"
                    : "hover:bg-white/5"
                }`}
                style={{
                  left: spot.area.left,
                  top: spot.area.top,
                  width: spot.area.width,
                  height: spot.area.height,
                }}
                title={spot.tooltip}
              />

              {/* Floating Pill Badge & Pulsing Beacon Pin */}
              <div
                onClick={() => openStation(spot.id)}
                onMouseEnter={() => {
                  sounds.playHover();
                  setHoveredHotspot(spot.id);
                }}
                onMouseLeave={() => setHoveredHotspot(null)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-30 flex flex-col items-center group pointer-events-auto ${
                  isHovered ? "scale-110 -translate-y-[62%]" : "hover:scale-105"
                }`}
                style={{
                  left: spot.position.left,
                  top: spot.position.top,
                }}
              >
                {/* Floating Glassmorphic Badge Pill */}
                <div
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-md text-xs font-bold tracking-wide shadow-lg transition-all duration-200 ${
                    spot.badgeBg
                  } ${spot.badgeBorder} ${
                    isHovered ? "ring-2 ring-white/60 brightness-110" : ""
                  }`}
                >
                  {/* Pulsing Status Dot Beacon */}
                  <span className="relative flex h-2.5 w-2.5">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${spot.dotColor}`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-2.5 w-2.5 ${spot.dotColor}`}
                    />
                  </span>

                  <span className="drop-shadow-sm">{spot.badge}</span>

                  {isVisited && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                </div>

                {/* Pin Pointer Arrow Indicator */}
                <div className="w-2.5 h-2.5 bg-slate-900 rotate-45 -mt-1 border-r border-b border-white/20 shadow-sm" />

                {/* Floating Hover Tooltip Card */}
                {isHovered && (
                  <div className="mt-2 w-64 bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-xl text-center pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                    <div className="text-xs font-bold text-white mb-0.5">{spot.title}</div>
                    <div className="text-[11px] text-slate-300 leading-snug">{spot.roleDescription}</div>
                    <div className="mt-2 text-[10px] font-semibold text-emerald-400 bg-emerald-950/70 py-0.5 px-2 rounded-full border border-emerald-800/50 inline-block">
                      {spot.tooltip}
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}

        {/* =========================================================================
            AMBIENT EASTER EGGS / DISCOVERY SPOTS
        ========================================================================== */}
        {/* Kiosk Directory */}
        <button
          onClick={() => {
            sounds.playClick();
            setEasterEggInfo("Interactive Kiosk: Level 12 Software Engineering Track & Cloud Infrastructure");
          }}
          className="absolute left-[54%] top-[56%] -translate-x-1/2 -translate-y-1/2 w-8 h-14 rounded-lg hover:ring-2 hover:ring-cyan-400/50 hover:bg-cyan-500/10 cursor-pointer z-10"
          title="Inspect Directory Kiosk"
        />

        {/* Turnstiles */}
        <button
          onClick={() => {
            sounds.playClick();
            setEasterEggInfo("Biometric Speed Gates: Access Granted - FYP Engineering Student");
          }}
          className="absolute left-[44%] top-[57%] -translate-x-1/2 -translate-y-1/2 w-16 h-12 rounded-lg hover:ring-2 hover:ring-emerald-400/50 hover:bg-emerald-500/10 cursor-pointer z-10"
          title="Inspect Biometric Turnstiles"
        />
      </div>

      {/* =========================================================================
          TOP FLOATING GLASSMORPHIC UI (NO STANDARD NAVBAR)
      ========================================================================== */}
      {/* Top-Left: Minimalist Floating Back to Majors Button */}
      <div className="absolute top-6 left-6 z-40">
        <Link
          href="/"
          onClick={() => sounds.playClick()}
          className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white backdrop-blur-xl border border-white/25 text-xs font-bold transition-all shadow-xl hover:shadow-2xl hover:scale-105 group"
          aria-label="Back to Majors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Majors</span>
        </Link>
      </div>

      {/* Top-Center: Immersive Room Identity Pill */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 text-xs shadow-xl">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-slate-200">FYP · Computer Science</span>
        <span className="text-slate-500">|</span>
        <span className="font-medium text-emerald-300">Software Track Interactive Room</span>
      </div>

      {/* Top-Right: Sound & Fullscreen Controls */}
      <div className="absolute top-6 right-6 z-40 flex items-center gap-2">
        <button
          onClick={toggleSound}
          className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white backdrop-blur-xl border border-slate-700/60 transition-all shadow-lg hover:scale-105 cursor-pointer"
          title={isMuted ? "Unmute Audio" : "Mute Audio"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white backdrop-blur-xl border border-slate-700/60 transition-all shadow-lg hover:scale-105 cursor-pointer hidden md:flex"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* =========================================================================
          BOTTOM FLOATING CONTROLS & HUD STATION DOCK
      ========================================================================== */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/85 backdrop-blur-2xl border border-slate-700/70 shadow-2xl">
        {/* Left Tracker Pill */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Stations Explored:</span>
            <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
              {exploredCount} / 3
            </span>
          </div>
        </div>

        {/* Quick Station Switcher Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => openStation("coding")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              visitedStations.coding
                ? "bg-emerald-950/70 text-emerald-300 border-emerald-500/40"
                : "bg-slate-800/80 text-slate-200 border-slate-700/70 hover:bg-slate-700"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Coding</span>
          </button>

          <button
            onClick={() => openStation("logic-flow")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              visitedStations["logic-flow"]
                ? "bg-purple-950/70 text-purple-300 border-purple-500/40"
                : "bg-slate-800/80 text-slate-200 border-slate-700/70 hover:bg-slate-700"
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Logic</span>
          </button>

          <button
            onClick={() => openStation("database")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              visitedStations.database
                ? "bg-cyan-950/70 text-cyan-300 border-cyan-500/40"
                : "bg-slate-800/80 text-slate-200 border-slate-700/70 hover:bg-slate-700"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>SQL</span>
          </button>
        </div>
      </div>

      {/* Easter Egg Notice Toast */}
      {easterEggInfo && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs text-cyan-200 shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <span>✨ {easterEggInfo}</span>
          <button
            onClick={() => setEasterEggInfo(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* =========================================================================
          FULLSCREEN MODAL SIMULATION OVERLAYS
      ========================================================================== */}
      {activeModal === "coding" && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
          <CodingSimulation isModal onClose={closeModal} />
        </div>
      )}

      {activeModal === "logic-flow" && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
          <LogicFlowSimulation isModal onClose={closeModal} />
        </div>
      )}

      {activeModal === "database" && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
          <DatabaseSimulation isModal onClose={closeModal} />
        </div>
      )}
    </div>
  );
}
