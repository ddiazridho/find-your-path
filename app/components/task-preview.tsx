"use client";
import { useTranslation } from "@/app/i18n/provider";
import type { Major } from "../majors";
import Icon from "./ui-icon";
export default function TaskPreview({ visual }: { visual: Major["visual"] }) {
  const { t: tx } = useTranslation();
  return <div className={`task-preview preview-${visual}`} aria-hidden="true">
    {visual === "code" && <div className="code-window"><div className="window-bar"><span /><span /><span /><b>{tx("your-first-idea.js")}</b></div><div className="code-lines"><p><i>1</i><em>{tx("function")}</em> {tx(" findYourPath() ")}{tx('{')}</p><p><i>2</i>  <em>{tx("const")}</em> {tx(" curiosity = ")}<strong>{tx("true")}</strong>;</p><p><i>3</i>  <em>{tx("return")}</em> {tx(" possibilities;")}</p><p><i>4</i>{tx('}')}</p></div><div className="code-status"><span /> {tx(" Ready to make something?")}</div></div>}
    {visual === "business" && <div className="business-preview"><div className="business-title">{tx("Small start.")}<br />{tx("Big possibility.")}</div><div className="business-bars"><span /><span /><span /><span /><span /><span /><span /></div><div className="business-note">{tx("IDEA ")}<span>→</span> {tx(" STRATEGY ")}<span>→</span> {tx(" IMPACT")}</div></div>}
    {visual === "law" && <div className="law-card-preview"><div className="law-card-arch"><span /><span /><span /></div><div className="law-card-caption">{tx("EVERY CHOICE")}<br /><em>{tx("HAS A CONSEQUENCE.")}</em></div><div className="law-card-figures"><span /><span /></div></div>}
    {visual === "design" && <div className="design-preview"><div className="design-type">{tx("Make")}<br /><em>{tx("it matter.")}</em></div><div className="swatches"><span /><span /><span /><span /></div><span className="design-foot">{tx("Your perspective. Your palette.")}</span></div>}
    {visual === "psychology" && <div className="psychology-preview"><div className="quote-bubble">{tx("“What if we looked")}<br />{tx("at it differently?”")}</div><div className="response-bubble">{tx("It starts with listening.")}</div><div className="conversation-dots"><span /><span /><span /></div></div>}
    {visual === "health" && <div className="health-preview"><div className="health-cross"><Icon name="health" /></div><h4>{tx("Observe. Connect.")}<br />{tx("Care.")}</h4><div className="health-tags"><span>{tx("Symptoms")}</span><span>{tx("History")}</span><span>{tx("Next steps")}</span></div></div>}
    {visual === "architecture" && <div className="architecture-preview"><div className="floor-plan"><div className="plan-room room-a">{tx("CREATE")}</div><div className="plan-room room-b">{tx("CONNECT")}</div><div className="plan-room room-c">{tx("UNWIND")}</div></div><span className="plan-scale">{tx("A place to belong · Concept plan")}</span></div>}
  </div>;
}
