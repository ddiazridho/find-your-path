"use client";
import { useTranslation } from "@/app/i18n/provider";

import { useId, useRef, useState, type PointerEvent } from "react";
import { Download, ImagePlus, LayoutTemplate, SlidersHorizontal, Trash2, Type } from "lucide-react";
import { lessons } from "../lessons";
import { Completion, Guide, saveFile, useProgress } from "../components/LessonUI";

type ElementId = "headline" | "product" | "price" | "cta";
type PosterElement = { id: ElementId; x: number; y: number; text: string; edited?: boolean };
const palette: PosterElement[] = [
  { id: "headline", x: 50, y: 15, text: "Refill. Reuse. Repeat." },
  { id: "product", x: 50, y: 47, text: "Everyday water bottle" },
  { id: "price", x: 50, y: 77, text: "$24 · Made for every day" },
  { id: "cta", x: 50, y: 88, text: "Find your everyday" },
];
const names: Record<ElementId, string> = { headline: "Headline", product: "Product image", price: "Price & offer", cta: "Call to action" };
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const escapeXml = (text: string) => text.replace(/[<>&"']/g, character => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[character]!);

function Bottle() {
  const { t: tx } = useTranslation();
  const id = useId();
  return <svg viewBox="0 0 160 280" role="img" aria-label={tx("Green reusable water bottle")}><defs><linearGradient id={id} x1="0" x2="1"><stop stopColor="#1b4f39" /><stop offset=".4" stopColor="#75a476" /><stop offset=".75" stopColor="#447653" /><stop offset="1" stopColor="#244f39" /></linearGradient></defs><ellipse cx="80" cy="260" rx="48" ry="9" fill="#254e35" opacity=".15" /><rect x="55" y="12" width="50" height="35" rx="8" fill="#253f30" /><path d="M60 15v-5a20 12 0 0 1 40 0v5" stroke="#253f30" strokeWidth="9" fill="none" /><path d="M56 44Q37 51 35 76v154q0 28 25 28h40q25 0 25-28V76q-2-25-21-32Z" fill={`url(#${id})`} /><path d="M46 82v138" stroke="#bed1ad" strokeWidth="5" strokeLinecap="round" opacity=".45" /><path d="M65 134q15-27 30 0-15 27-30 0" fill="#e8edd5" /><text x="80" y="165" textAnchor="middle" fill="#f4f3dc" fontFamily="sans-serif" fontSize="12" letterSpacing="2">{tx("EVERYDAY")}</text><text x="80" y="183" textAnchor="middle" fill="#e0e7ce" fontFamily="sans-serif" fontSize="6">{tx("REFILL YOUR DAY")}</text></svg>;
}

export default function MultimediaLab() {
  const { t: tx } = useTranslation();
  const [elements, setElements] = useState<PosterElement[]>([]);
  const [selected, setSelected] = useState<ElementId | null>(null);
  const [brightness, setBrightness] = useState(100); const [contrast, setContrast] = useState(100); const [saturation, setSaturation] = useState(100);
  const canvas = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: ElementId; x: number; y: number; startX: number; startY: number } | null>(null);
  const progress = useProgress(JSON.stringify([elements, brightness, contrast, saturation]));
  const active = elements.find(element => element.id === selected);
  function add(id: ElementId, x?: number, y?: number) {
    const item = palette.find(element => element.id === id)!;
    if (!item) return;
    setElements(current => current.some(element => element.id === id) ? current : [...current, { ...item, x: clamp(x ?? item.x, 15, 85), y: clamp(y ?? item.y, 8, 93) }]); setSelected(id);
  }
  function update(id: ElementId, patch: Partial<PosterElement>) { setElements(current => current.map(element => element.id === id ? { ...element, ...patch, ...(patch.text !== undefined ? { edited: true } : {}) } : element)); }
  function move(event: PointerEvent<HTMLButtonElement>) {
    if (!drag.current || !canvas.current) return;
    const box = canvas.current.getBoundingClientRect(); const current = drag.current;
    update(current.id, { x: clamp(current.x + (event.clientX - current.startX) / box.width * 100, 15, 85), y: clamp(current.y + (event.clientY - current.startY) / box.height * 100, 8, 93) });
  }
  function validate() {
    const headline = elements.find(element => element.id === "headline");
    const product = elements.find(element => element.id === "product");
    const price = elements.find(element => element.id === "price"); const cta = elements.find(element => element.id === "cta");
    const centered = (element: PosterElement) => element.x >= 30 && element.x <= 70;
    if (!headline || !headline.text.trim() || headline.y > 25 || !centered(headline)) return "Place a nonempty headline in the upper center guide area (X 30–70%, Y 8–25%).";
    if (progress.step >= 1 && (!product || product.y < 30 || product.y > 65 || !centered(product))) return "Place the product in the center guide area (X 30–70%, Y 30–65%).";
    if (progress.step >= 2 && (!price || !cta || price.y < 70 || cta.y < 70 || !price.text.trim() || !cta.text.trim() || !centered(price) || !centered(cta))) return "Place both a nonempty price and call to action in the lower center area (Y 70–93%).";
    if (progress.step >= 3 && (brightness !== 110 || contrast !== 115)) return "Set brightness to 110% and contrast to 115% using the image adjustment sliders.";
    if (progress.step >= 4 && saturation !== 120) return "Set saturation to 120% to complete the image adjustments.";
    return null;
  }
  function download() {
    const slope = brightness / 100 * contrast / 100; const intercept = .5 * (1 - contrast / 100);
    const content = elements.map(element => {
      const x = element.x * 6; const y = element.y * 8;
      const displayText = element.edited ? element.text : tx(element.text);
      if (element.id === "product") return `<g transform="translate(${x - 90} ${y - 155}) scale(1.125)" filter="url(#adjust)"><ellipse cx="80" cy="260" rx="48" ry="9" fill="#254e35" opacity=".15"/><rect x="55" y="12" width="50" height="35" rx="8" fill="#253f30"/><path d="M60 15v-5a20 12 0 0 1 40 0v5" stroke="#253f30" stroke-width="9" fill="none"/><path d="M56 44Q37 51 35 76v154q0 28 25 28h40q25 0 25-28V76q-2-25-21-32Z" fill="url(#bottle)"/><path d="M46 82v138" stroke="#bed1ad" stroke-width="5" stroke-linecap="round" opacity=".45"/><path d="M65 134q15-27 30 0-15 27-30 0" fill="#e8edd5"/><text x="80" y="165" text-anchor="middle" fill="#f4f3dc" font-size="12" letter-spacing="2">EVERYDAY</text><text x="80" y="183" text-anchor="middle" fill="#e0e7ce" font-size="6">${escapeXml(tx("REFILL YOUR DAY"))}</text></g>`;
      if (element.id === "cta") return `<rect x="${x - 170}" y="${y - 28}" width="340" height="56" rx="28" fill="#265c45"/><text x="${x}" y="${y + 6}" text-anchor="middle" fill="white" font-size="20" font-weight="700">${escapeXml(displayText)}</text>`;
      if (element.id === "headline") {
        const words = displayText.split(/\s+/); const lines: string[] = []; let line = "";
        for (const word of words) { if ((line + " " + word).trim().length > 19 && line) { lines.push(line); line = word; } else line = (line + " " + word).trim(); } if (line) lines.push(line);
        return `<text x="${x}" y="${y - (lines.length - 1) * 22}" text-anchor="middle" fill="#203b31" font-size="43" font-weight="800">${lines.map((text, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : 46}">${escapeXml(text)}</tspan>`).join("")}</text>`;
      }
      return `<text x="${x}" y="${y + 6}" text-anchor="middle" fill="#203b31" font-size="22" font-weight="700">${escapeXml(displayText)}</text>`;
    }).join("");
    saveFile(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><defs><linearGradient id="bottle"><stop stop-color="#1b4f39"/><stop offset=".4" stop-color="#75a476"/><stop offset=".75" stop-color="#447653"/><stop offset="1" stop-color="#244f39"/></linearGradient><filter id="adjust" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncR type="linear" slope="${slope}" intercept="${intercept}"/><feFuncG type="linear" slope="${slope}" intercept="${intercept}"/><feFuncB type="linear" slope="${slope}" intercept="${intercept}"/></feComponentTransfer><feColorMatrix type="saturate" values="${saturation / 100}"/></filter></defs><rect width="600" height="800" fill="#e6edd9"/><g font-family="sans-serif">${content}</g></svg>`, "everyday-poster.svg", "image/svg+xml");
  }
  const guides = progress.step === 0 ? [{ y: 16, height: 24, label: "Headline goes here" }] : progress.step === 1 ? [{ y: 47, height: 35, label: "Product goes here" }] : progress.step === 2 ? [{ y: 82, height: 23, label: "Offer & call to action" }] : [];
  return <><div className="lab-workspace lab-multimedia">
    <section className="lab-panel lab-canvas-panel"><div className="lab-panel-heading"><LayoutTemplate size={18} /><h2>{tx("Everyday · Promotion poster")}</h2><span>600 × 800</span></div><div className="lab-canvas-ground"><div className="lab-poster" ref={canvas} aria-label={tx("Poster worksheet")} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); const id = event.dataTransfer.getData("text/plain") as ElementId; if (!palette.some(element => element.id === id)) return; const rect = event.currentTarget.getBoundingClientRect(); add(id, (event.clientX - rect.left) / rect.width * 100, (event.clientY - rect.top) / rect.height * 100); }}>
      {guides.map(guide => <div className="lab-poster-zone" key={guide.label} style={{ top: `${guide.y}%`, height: `${guide.height}%` }}>{tx(guide.label)}</div>)}
      {elements.length === 0 && <div className="lab-poster-empty"><ImagePlus size={34} /><span>{tx("Your next idea starts here.")}</span><small>{tx("Add the headline from the elements panel.")}</small></div>}
      {elements.map(element => <button key={element.id} className={`lab-poster-element poster-${element.id} ${selected === element.id ? "is-selected" : ""}`} style={{ left: `${element.x}%`, top: `${element.y}%` }} aria-label={tx(`Edit ${names[element.id]}`)} aria-pressed={selected === element.id} onClick={() => setSelected(element.id)} onPointerDown={event => { setSelected(element.id); event.currentTarget.setPointerCapture(event.pointerId); drag.current = { id: element.id, x: element.x, y: element.y, startX: event.clientX, startY: event.clientY }; }} onPointerMove={move} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onKeyDown={event => { const offsets: Record<string, [number, number]> = { ArrowLeft: [-2, 0], ArrowRight: [2, 0], ArrowUp: [0, -2], ArrowDown: [0, 2] }; const delta = offsets[event.key]; if (delta) { event.preventDefault(); update(element.id, { x: clamp(element.x + delta[0], 15, 85), y: clamp(element.y + delta[1], 8, 93) }); } }}>
        {element.id === "product" ? <span style={{ filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)` }}><Bottle /></span> : element.edited ? element.text : tx(element.text)}
      </button>)}
    </div></div><div className="lab-panel-foot">{tx("Drag to arrange. Select an element and use arrow keys for precise positioning.")}</div></section>
    <aside className="lab-panel lab-design-tools"><div className="lab-panel-heading"><Type size={18} /><h2>{tx("Elements & adjustments")}</h2></div><div className="lab-elements-palette">{palette.map(element => <button key={element.id} className="lab-palette-item" draggable={!elements.some(item => item.id === element.id)} onDragStart={event => event.dataTransfer.setData("text/plain", element.id)} onClick={() => add(element.id)}><span>{element.id === "product" ? <ImagePlus size={20} /> : <Type size={20} />}</span><strong>{tx(names[element.id])}</strong><small>{tx(elements.some(item => item.id === element.id) ? "Select" : "+ Add")}</small></button>)}</div>
      <div className="lab-element-properties"><h3>{tx(active ? `Edit ${names[active.id].toLowerCase()}` : "Select an element")}</h3>{active ? <>{active.id !== "product" && <label>{tx("Text")}<input aria-label={tx("Element text")} maxLength={active.id === "headline" ? 60 : 40} value={active.edited ? active.text : tx(active.text)} onChange={event => update(active.id, { text: event.target.value })} /></label>}<label>{tx("Horizontal position ")}<output>{Math.round(active.x)}%</output><input type="range" min="15" max="85" value={active.x} aria-label={tx("Horizontal position")} onChange={event => update(active.id, { x: Number(event.target.value) })} /></label><label>{tx("Vertical position ")}<output>{Math.round(active.y)}%</output><input type="range" min="8" max="93" value={active.y} aria-label={tx("Vertical position")} onChange={event => update(active.id, { y: Number(event.target.value) })} /></label><button className="lab-quiet" onClick={() => { setElements(current => current.filter(item => item.id !== active.id)); setSelected(null); }}><Trash2 size={15} />{tx("Remove element")}</button></> : <p>{tx("Click an element on the poster to change its text or position.")}</p>}</div>
      <div className="lab-image-adjustments"><h3><SlidersHorizontal size={17} />{tx("Product image")}</h3>{[{ name: "Brightness", value: brightness, set: setBrightness }, { name: "Contrast", value: contrast, set: setContrast }, { name: "Saturation", value: saturation, set: setSaturation }].map(control => <label key={control.name}>{tx(control.name)}<output>{control.value}%</output><input type="range" min="50" max="150" step="5" aria-label={tx(control.name)} value={control.value} onChange={event => control.set(Number(event.target.value))} disabled={!elements.some(element => element.id === "product")} /></label>)}<button className="lab-quiet" onClick={() => { setBrightness(100); setContrast(100); setSaturation(100); }}>{tx("Reset adjustments")}</button></div><p className="lab-small-note">{tx("Everyday is a fictional product for this design exercise.")}</p>
    </aside>

    <Guide track="multimedia" steps={lessons.multimedia.steps} progress={progress} validate={validate} />
    </div><Completion track="multimedia" progress={progress}><button className="lab-primary" onClick={download}><Download size={16} />{tx("Download poster")}</button></Completion></>;
}
