"use client";
import { useTranslation } from "@/app/i18n/provider";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, RotateCcw } from "lucide-react";
import { lessons, type Track } from "../lessons";
import LabScene from "./LabScene";
import SimulationFrame from "./SimulationFrame";
import SoftwareLab from "../software/SoftwareLab";
import EmbeddedLab from "../embedded-system/EmbeddedLab";
import NetworkingLab from "../networking/NetworkingLab";
import MultimediaLab from "../multimedia/MultimediaLab";
import { computerScienceMajor } from "../major";
import "../computer-science.css";

const workspaces = { software: SoftwareLab, "embedded-system": EmbeddedLab, networking: NetworkingLab, multimedia: MultimediaLab };

export default function LearningLab({ track }: { track: Track }) {
  const { t: tx } = useTranslation();
  const lesson = lessons[track];
  const [started, setStarted] = useState(false);
  const [dialogue, setDialogue] = useState(0);
  const [restart, setRestart] = useState(false);
  const workspaceTitle = useRef<HTMLHeadingElement>(null);
  const restartButton = useRef<HTMLButtonElement>(null);
  const Workspace = workspaces[track];
  const simulations = computerScienceMajor.preview.kind === "simulation" ? computerScienceMajor.preview.simulations : [];
  function begin() { setStarted(true); requestAnimationFrame(() => workspaceTitle.current?.focus()); }
  function returnToClass() {
    setStarted(false); setDialogue(0); setRestart(false);
    requestAnimationFrame(() => document.getElementById("cs-dialogue-title")?.focus());
  }
  return <div className={`learning-lab track-${track}`}>
    <main className="cs-shell">
      <div className="cs-page-heading"><div><h1>{tx(lesson.title)}</h1><p>{tx("A little guidance. A lot of learning by doing.")}</p></div><span><Clock size={15} />{tx(lesson.duration)}</span></div>
      <SimulationFrame phase={started ? 2 : 1} total={2} label={tx(started ? "Your workbench" : "Meet your instructor")}>
        {!started ? <div className="cs-intro">
          <LabScene track={track} room={lesson.setting.room} />
          <section className="cs-dialogue" aria-label={tx("Instructor dialogue")}>
            <div className="cs-speaker"><span className="cs-speaker-avatar" aria-hidden="true">{tx(lesson.teacher.replace(/^(Dr\.|Mr\.|Ms\.)\s*/, "").charAt(0))}</span><div><h2 id="cs-dialogue-title" tabIndex={-1}>{tx(lesson.teacher)}</h2><small>{tx(lesson.role)}</small></div></div>
            <div className="cs-dialogue-content"><p className="cs-narration">{tx(lesson.setting.narration)}</p><p className="cs-dialogue-text" key={dialogue} aria-live="polite">{tx(lesson.dialogue[dialogue])}</p>
              <div className="cs-dialogue-footer"><div className="lab-dialogue-progress" aria-label={tx(`Dialogue ${dialogue + 1} of ${lesson.dialogue.length}`)}>{lesson.dialogue.map((_, index) => <span className={index === dialogue ? "is-current" : ""} key={index} />)}<small>{dialogue + 1} {tx(" of ")}{lesson.dialogue.length}</small></div>
                <div className="lab-dialogue-actions">{dialogue > 0 && <button className="lab-quiet" onClick={() => setDialogue(value => value - 1)}><ArrowLeft size={16} />{tx("Back")}</button>}{dialogue < lesson.dialogue.length - 1 ? <button className="lab-primary" onClick={() => setDialogue(value => value + 1)}>{tx("Continue")}<ArrowRight size={17} /></button> : <button className="lab-primary" onClick={begin}>{tx(lesson.start)}<ArrowRight size={17} /></button>}</div>
              </div>
            </div>
          </section>
        </div> : <div className="cs-workbench">
          <div className="lab-workspace-heading"><div><span>{tx(lesson.setting.room)}</span><h2 ref={workspaceTitle} tabIndex={-1}>{tx(lesson.setting.workspaceTitle)}</h2></div><button ref={restartButton} className="lab-secondary" aria-expanded={restart} onClick={() => setRestart(value => !value)}><RotateCcw size={15} />{tx("Back to class")}</button></div>
          {restart && <section className="lab-restart-prompt" aria-label={tx("Restart lesson")} onKeyDown={event => { if (event.key === "Escape") { setRestart(false); restartButton.current?.focus(); } }}><p>{tx("Return to the classroom? This will clear your current project.")}</p><button className="lab-secondary" onClick={() => { setRestart(false); restartButton.current?.focus(); }}>{tx("Keep working")}</button><button className="lab-primary" onClick={returnToClass}>{tx("Return to class")}</button></section>}
          <Workspace />
        </div>}
      </SimulationFrame>
      <nav className="cs-fields" aria-label={tx("Choose a Computer Science field")}>{simulations.map((simulation, index) => <Link key={simulation.id} href={simulation.href} aria-current={simulation.id === track ? "page" : undefined}><span className="cs-field-number">0{index + 1}</span><span><strong>{tx(simulation.name)}</strong><small>{tx(simulation.id === track ? "Current field" : "Explore field")}</small></span><ArrowRight size={17} /></Link>)}</nav>
      <p className="cs-learning-note">{lesson.steps.length} {tx(" guided steps · No experience needed. Try, review, and move forward at your own pace.")}</p>
    </main>
  </div>;
}
