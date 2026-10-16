import Icon from "../ui-icon";

export default function PossibilityBoard() {
  return (
    <div className="possibility-board" aria-label="Explore by doing: build, create, and understand">
          <div className="board-orbit" /><span className="board-note">A small taste of your next chapter</span>
          <div className="board-card board-build"><div className="board-code"><span>&lt;curiosity&gt;</span><br />&nbsp; build something<br />&nbsp; that matters.<br /><span>&lt;/curiosity&gt;</span></div><div className="board-card-bottom">Think it. Build it.<Icon name="arrow" /></div></div>
          <div className="board-card board-create"><div className="board-big-type">What<br /><em>if?</em><Icon name="spark" /></div><div className="board-card-bottom">See things differently.<Icon name="arrow" /></div></div>
          <div className="board-card board-human"><div className="board-human-title">A little empathy.<br />A whole new perspective.</div><div className="board-card-bottom">Understand someone.<Icon name="arrow" /></div></div>
        </div>
  );
}
