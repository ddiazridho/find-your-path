"use client";
import { useTranslation } from "@/app/i18n/provider";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MessageCircle, RotateCcw, Scale } from "lucide-react";
import type { LawStory, StoryChoice } from "./stories";
import { lawFields } from "./stories";
import CinematicWorld from "./CinematicWorld";
import "./law.css";

function Character({ side, name }: { side: "left" | "right"; name: string }) {
  const { t: tx } = useTranslation();
  return <div className={`law-character law-character--${side}`} aria-hidden="true">
    <div className="law-character-shadow" />
    <div className="law-character-body"><span className="law-character-head" /><span className="law-character-torso" /><span className="law-character-arm law-character-arm--left" /><span className="law-character-arm law-character-arm--right" /><span className="law-character-leg law-character-leg--left" /><span className="law-character-leg law-character-leg--right" /></div>
    <span className="law-character-name">{tx(name.split(" · ")[0])}</span>
  </div>;
}

function Stage({ story, sceneId, choices, onChoose }: { story: LawStory; sceneId: string; choices?: StoryChoice[]; onChoose: (choice: StoryChoice) => void }) {
  const { t: tx } = useTranslation();
  const scene = story.scenes[sceneId];
  return <div className={`law-stage law-stage--${story.field} law-stage--visual-${scene.visual} ${story.field !== "civil" ? "law-stage--cinematic" : ""} ${scene.ending ? "law-stage--ending" : ""}`} role="group" aria-label={tx(`Illustrated scene: ${scene.place}`)}>
    {story.field === "civil" ? <><div className="law-stage-light" />
      <div className="law-stage-wall">
        <span className="law-wall-panel law-wall-panel--left" /><span className="law-wall-panel law-wall-panel--right" />
        <div className="law-stage-sign"><Scale size={21} strokeWidth={1.5} /><span>{tx("WILLOW COURT")}</span></div>
        <div className="law-stage-window"><span /><span /><span /></div>
        <div className="law-stage-clock"><span /></div>
        <div className="law-setting-detail" aria-hidden="true"><span /><span /><span /><span /></div>
      </div>
      <div className="law-stage-floor"><span className="law-floor-line law-floor-line--one" /><span className="law-floor-line law-floor-line--two" /></div>
      <div className="law-prop law-prop--left"><span className="law-prop-top" /><span className="law-prop-body" /></div>
      <div className="law-prop law-prop--right"><span className="law-prop-top" /><span className="law-prop-body" /></div>
      <div className="law-stage-object"><span className="law-object-paper law-object-paper--one" /><span className="law-object-paper law-object-paper--two" /></div>
      <Character side="left" name={story.cast[0]} /><Character side="right" name={story.cast[1]} />
      {scene.artifact && <div className="law-scene-artifact law-scene-artifact--civil"><span>{tx(scene.artifact.label)}</span><strong>{tx(scene.artifact.text)}</strong></div>}
    </> : <CinematicWorld field={story.field} scene={scene} />}
    <div className="law-stage-place"><span className="law-live-dot" />{tx(scene.place)}</div>
    {choices && <div className="law-choice-orbit" aria-label={tx("Choose what happens next")}>
      {choices.map((choice, index) => <button key={choice.next} className={`law-choice-bubble law-choice-bubble--${index === 0 ? "left" : "right"}`} onClick={() => onChoose(choice)}>
        <span className="law-choice-number">{tx("YOUR MOVE")}</span>
        <strong>{tx(choice.label)}</strong>
        <small>{tx(choice.hint)}</small>
        <ArrowRight size={17} aria-hidden="true" />
      </button>)}
    </div>}
  </div>;
}

export default function StoryExperience({ story }: { story: LawStory }) {
  const { t: tx } = useTranslation();
  const [history, setHistory] = useState<string[]>(["start"]);
  const sceneId = history[history.length - 1];
  const originalScene = story.scenes[sceneId];
  const scene = { ...originalScene, dialogue: tx(originalScene.dialogue) };
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => setVisibleCharacters(scene.dialogue.length), 0);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setInterval(() => setVisibleCharacters(count => Math.min(count + 2, scene.dialogue.length)), 18);
    return () => window.clearInterval(timer);
  }, [scene.dialogue]);
  const decisions = history.slice(0, -1).flatMap((id, index) => {
    const previous = story.scenes[id];
    const choice = previous.choices?.find(item => item.next === history[index + 1]);
    return choice ? [choice.label] : [];
  });
  const enter = (next: string) => { setVisibleCharacters(0); setHistory(previous => [...previous, next]); };
  const nextScene = scene.next;
  const currentField = lawFields.findIndex(item => item.field === story.field);
  const progress = scene.ending ? 4 : Math.min(3, Math.max(1, decisions.length + 1));

  return <div className={`law-page law-page--${story.field}`}>

    <main className="law-main">
      <div className="law-intro">
        <div><p className="law-intro-kicker">{tx("LAW LAB ")}<span>/</span> {tx(" INTERACTIVE STORY")}</p><h1>{tx(story.title)}<span className="law-title-period">.</span></h1><p className="law-subtitle"><strong>{tx(story.subtitle)}.</strong> {tx(story.premise)}</p></div>
      </div>

      <section className="law-experience" aria-labelledby="scene-heading">
        <div className="law-experience-top"><span><i className="law-live-dot" /> {tx(" LIVE CASE ")}<b>·</b> {tx(scene.chapter.toUpperCase())}</span><span>{tx(scene.ending ? "CASE CLOSED" : "YOUR DECISIONS SHAPE THE STORY")}</span></div>
        <div className="law-scene-frame"><Stage key={`${story.field}-${sceneId}`} story={story} sceneId={sceneId} choices={scene.choices} onChoose={choice => enter(choice.next)} />
        <div className="law-story-panel" key={sceneId}>
          <div className="law-story-main">
            <div className="law-scene-heading"><span className="law-scene-marker"><MessageCircle size={17} /></span><div><span className="law-scene-label">{tx(scene.speaker)}</span><small>{tx(scene.place)}</small></div></div>
            <h2 id="scene-heading" aria-hidden="true">“{scene.dialogue.slice(0, visibleCharacters)}<span className={visibleCharacters < scene.dialogue.length ? "law-type-caret" : ""} />”</h2>
            <span className="sr-only" aria-live="polite">{tx(scene.speaker)}: {tx(scene.dialogue)}</span>
            <p className="law-narration">{tx(scene.narration)}</p>
          </div>
          <div className="law-story-actions">
            {tx(nextScene && <button className="law-continue" onClick={() => visibleCharacters < scene.dialogue.length ? setVisibleCharacters(scene.dialogue.length) : enter(nextScene)}>{tx(visibleCharacters < scene.dialogue.length ? "Show all" : "Continue")} <ArrowRight size={18} /></button>)}
            {scene.choices && <p className="law-action-hint">{tx("Choose a bubble in the scene to decide what happens next.")}</p>}
            {scene.ending && <button className="law-continue" onClick={() => { setVisibleCharacters(0); setHistory(["start"]); }}><RotateCcw size={17} /> {tx(" Replay this case")}</button>}
            {history.length > 1 && <button className="law-step-back" onClick={() => setHistory(previous => previous.slice(0, -1))}><ArrowLeft size={15} /> {tx(" Previous scene")}</button>}
          </div>
        </div>
        {scene.ending && <section className="law-verdict" aria-label={tx("Ending summary")} key={`${sceneId}-ending`}>
          <div className="law-verdict-heading"><span>{tx("YOUR OUTCOME")}</span><h2>{tx(scene.ending.title)}</h2><p>{tx(scene.ending.outcome)}</p></div>
          <div className="law-verdict-concepts"><h3>{tx("What this case reveals")}</h3><ul>{scene.ending.concepts.map(concept => <li key={concept}>{tx(concept)}</li>)}</ul></div>
          <button className="law-verdict-replay" onClick={() => { setVisibleCharacters(0); setHistory(["start"]); }}><RotateCcw size={17} /> {tx(" Play this story again")}</button>
        </section>}</div>
        <div className="law-game-bottom"><span>{tx(story.title.toUpperCase())}</span><div aria-label={tx(`Chapter ${progress} of 4`)}>{[1, 2, 3, 4].map(item => <i key={item} className={item <= progress ? "is-active" : ""} />)}</div><span>{tx(scene.ending ? "CASE COMPLETE" : `${decisions.length} DECISIONS MADE`)}</span></div>
      </section>

      <nav className="law-other-fields" aria-label={tx("Explore law fields")}><div>{lawFields.map((item, index) => <Link key={item.href} href={item.href} className={index === currentField ? "is-active" : ""} aria-current={index === currentField ? "page" : undefined}><span className="law-module-number">0{index + 1}</span><span className="law-module-name">{tx(item.title)}<small>{tx(index === currentField ? "CURRENT STORY" : "EXPLORE STORY")}</small></span><ArrowRight size={17} /></Link>)}</div></nav>
      <p className="law-disclaimer">{tx("A fictional story set in Meridian. Legal ideas are simplified for exploration, not legal advice.")}</p>
    </main>
  </div>;
}
