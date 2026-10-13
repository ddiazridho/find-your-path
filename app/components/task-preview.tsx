import type { Major } from "../majors";
import Icon from "./ui-icon";
export default function TaskPreview({ visual }: { visual: Major["visual"] }) {
  return <div className={`task-preview preview-${visual}`} aria-hidden="true">
    {visual === "code" && <div className="code-window"><div className="window-bar"><span /><span /><span /><b>your-first-idea.js</b></div><div className="code-lines"><p><i>1</i><em>function</em> findYourPath() {'{'}</p><p><i>2</i>  <em>const</em> curiosity = <strong>true</strong>;</p><p><i>3</i>  <em>return</em> possibilities;</p><p><i>4</i>{'}'}</p></div><div className="code-status"><span /> Ready to make something?</div></div>}
    {visual === "business" && <div className="business-preview"><div className="business-title">Small start.<br />Big possibility.</div><div className="business-bars"><span /><span /><span /><span /><span /><span /><span /></div><div className="business-note">IDEA <span>→</span> STRATEGY <span>→</span> IMPACT</div></div>}
    {visual === "law" && <div className="law-card-preview"><div className="law-card-arch"><span /><span /><span /></div><div className="law-card-caption">EVERY CHOICE<br /><em>HAS A CONSEQUENCE.</em></div><div className="law-card-figures"><span /><span /></div></div>}
    {visual === "design" && <div className="design-preview"><div className="design-type">Make<br /><em>it matter.</em></div><div className="swatches"><span /><span /><span /><span /></div><span className="design-foot">Your perspective. Your palette.</span></div>}
    {visual === "psychology" && <div className="psychology-preview"><div className="quote-bubble">“What if we looked<br />at it differently?”</div><div className="response-bubble">It starts with listening.</div><div className="conversation-dots"><span /><span /><span /></div></div>}
    {visual === "health" && <div className="health-preview"><div className="health-cross"><Icon name="health" /></div><h4>Observe. Connect.<br />Care.</h4><div className="health-tags"><span>Symptoms</span><span>History</span><span>Next steps</span></div></div>}
    {visual === "architecture" && <div className="architecture-preview"><div className="floor-plan"><div className="plan-room room-a">CREATE</div><div className="plan-room room-b">CONNECT</div><div className="plan-room room-c">UNWIND</div></div><span className="plan-scale">A place to belong · Concept plan</span></div>}
  </div>;
}
