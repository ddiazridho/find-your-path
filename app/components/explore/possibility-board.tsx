"use client";
import { useTranslation } from "@/app/i18n/provider";
import Icon from "../ui-icon";

export default function PossibilityBoard() {
  const { t: tx } = useTranslation();
  return (
    <div className="possibility-board" aria-label={tx("Explore by doing: build, create, and understand")}>
          <div className="board-orbit" /><span className="board-note">{tx("A small taste of your next chapter")}</span>
          <div className="board-card board-build"><div className="board-code"><span>{tx("<curiosity>")}</span><br />{tx("  build something")}<br />{tx("  that matters.")}<br /><span>{tx("</curiosity>")}</span></div><div className="board-card-bottom">{tx("Think it. Build it.")}<Icon name="arrow" /></div></div>
          <div className="board-card board-create"><div className="board-big-type">{tx("What")}<br /><em>{tx("if?")}</em><Icon name="spark" /></div><div className="board-card-bottom">{tx("See things differently.")}<Icon name="arrow" /></div></div>
          <div className="board-card board-human"><div className="board-human-title">{tx("A little empathy.")}<br />{tx("A whole new perspective.")}</div><div className="board-card-bottom">{tx("Understand someone.")}<Icon name="arrow" /></div></div>
        </div>
  );
}
