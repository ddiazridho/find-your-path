"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Clock, MessageCircle } from "lucide-react";
import { lessons, type Track } from "./lessons";
import { LessonHeader } from "./LessonUI";
import SoftwareLab from "./SoftwareLab";
import EmbeddedLab from "./EmbeddedLab";
import NetworkingLab from "./NetworkingLab";
import MultimediaLab from "./MultimediaLab";
import "./learning-lab.css";

export default function LearningLab({ track }: { track: Track }) {
  const lesson = lessons[track];
  const [started, setStarted] = useState(false);
  const [dialogue, setDialogue] = useState(0);
  const [restart, setRestart] = useState(false);
  const workspaceTitle = useRef<HTMLHeadingElement>(null);
  function begin() { setStarted(true); requestAnimationFrame(() => workspaceTitle.current?.focus()); }
  return <div className={`learning-lab track-${track}`}>
    <LessonHeader track={track} onRestart={started ? () => setRestart(true) : undefined} />
    {!started ? <main className="lab-classroom">
      <div className="lab-class-heading"><h1>{lesson.title}</h1><p>A little guidance. A lot of learning by doing.</p></div>
      <div className="lab-intro-grid"><div className="lab-scene"><Image src={track === "embedded-system" ? "/simulations/scenes/electronics-lab.png" : "/simulations/scenes/classroom.png"} alt={track === "embedded-system" ? "An electronics lab with an assistant demonstrating an LED circuit and students working at benches" : "A sunlit university classroom with a lecturer at the board and students working on laptops"} fill sizes="(max-width: 850px) 100vw, 65vw" preload /><div className="lab-room-caption"><span>{track === "embedded-system" ? "Electronics lab" : track === "multimedia" ? "Visual communication studio" : "Computer Science classroom"}</span><span><Clock size={14} />{lesson.duration}</span></div></div>
        <section className="lab-dialogue" aria-label="Instructor dialogue"><div className="lab-teacher-icon"><MessageCircle size={23} /></div><h2>{lesson.teacher}</h2><span className="lab-teacher-role">{lesson.role}</span><div className="lab-dialogue-text" key={dialogue} aria-live="polite"><p>{lesson.dialogue[dialogue]}</p></div><div className="lab-dialogue-progress" aria-label={`Dialogue ${dialogue + 1} of ${lesson.dialogue.length}`}>{lesson.dialogue.map((_, index) => <span className={index === dialogue ? "is-current" : ""} key={index} />)}<small>{dialogue + 1} of {lesson.dialogue.length}</small></div><div className="lab-dialogue-actions">{dialogue > 0 && <button className="lab-quiet" onClick={() => setDialogue(value => value - 1)}><ArrowLeft size={16} />Back</button>}{dialogue < lesson.dialogue.length - 1 ? <button className="lab-primary" onClick={() => setDialogue(value => value + 1)}>Continue<ArrowRight size={17} /></button> : <button className="lab-primary" onClick={begin}>{lesson.start}<ArrowRight size={17} /></button>}</div></section>
      </div><div className="lab-intro-footer"><span>{lesson.steps.length} guided steps · No experience needed</span><p>Try, review, and move forward at your own pace.</p></div>
    </main> : <main className="lab-active-main"><div className="lab-workspace-heading"><h1 ref={workspaceTitle} tabIndex={-1}>{track === "software" ? "Build your first website" : track === "embedded-system" ? "Build a button-controlled LED" : track === "networking" ? "Build a simple computer network" : "Design a product promotion poster"}</h1><span>Follow the guide. Make it yours.</span></div>
      {restart && <section className="lab-restart-prompt" aria-label="Restart lesson"><p>Return to the classroom? This will clear your current project.</p><button className="lab-secondary" onClick={() => setRestart(false)}>Keep working</button><button className="lab-primary" onClick={() => { setStarted(false); setDialogue(0); setRestart(false); }}>Return to class</button></section>}
      {track === "software" ? <SoftwareLab /> : track === "embedded-system" ? <EmbeddedLab /> : track === "networking" ? <NetworkingLab /> : <MultimediaLab />}
    </main>}
  </div>;
}
