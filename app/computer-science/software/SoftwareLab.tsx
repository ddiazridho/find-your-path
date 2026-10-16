"use client";
import { useTranslation } from "@/app/i18n/provider";

import { useState } from "react";
import { Code2, Download, Globe } from "lucide-react";
import { lessons } from "../lessons";
import { Completion, Guide, saveFile, useProgress } from "../components/LessonUI";

export function validateWebsite(code: string, step: number): string | null {
  const document = new DOMParser().parseFromString(code, "text/html");
  if (!Array.from(document.querySelectorAll("h1")).some(heading => heading.textContent?.trim().toLowerCase() === "hello world")) return "Add an h1 heading with the text Hello World. Keep it in your page for every step.";
  if (step >= 1 && !Array.from(document.querySelectorAll("p")).some(paragraph => (paragraph.textContent?.trim().length ?? 0) >= 15)) return "Add a paragraph about your goal with at least 15 characters.";
  if (step >= 2 && !Array.from(document.querySelectorAll("ul")).some(list => Array.from(list.querySelectorAll(":scope > li")).filter(item => item.textContent?.trim()).length >= 3)) return "Add an unordered list with three nonempty li items.";
  if (step >= 3 && !Array.from(document.querySelectorAll("a[href]")).some(link => {
    try { const url = new URL(link.getAttribute("href") ?? ""); return url.protocol === "https:" && !!url.hostname && !!link.textContent?.trim(); } catch { return false; }
  })) return "Add a link with a complete https:// address and visible link text.";
  if (step >= 4) {
    const styles = Array.from(document.querySelectorAll("style")).map(style => style.textContent).join("\n").replace(/\/\*[\s\S]*?\*\//g, "");
    if (!/body\s*\{[^}]*background-color\s*:\s*#f4f7ef\s*(?:;|\})/i.test(styles) || !/h1\s*\{[^}]*color\s*:\s*#265c45\s*(?:;|\})/i.test(styles)) return "Inside a style element, give body background-color: #f4f7ef and h1 color: #265c45.";
  }
  return null;
}

export default function SoftwareLab() {
  const { t: tx, locale: language } = useTranslation();
  const [code, setCode] = useState("<!-- Build your page below. -->\n");
  const progress = useProgress(code);
  const editorCode = code === "<!-- Build your page below. -->\n" ? tx(code) : code;
  const document = `<!DOCTYPE html><html lang="${language}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'"><title>${tx("My first website")}</title><style>body{font-family:system-ui,sans-serif;padding:28px;color:#203b31;line-height:1.7;overflow-wrap:anywhere}h1{font-size:36px;line-height:1.2}a{color:#265c45}</style></head><body>${editorCode}</body></html>`;
  return <>
    <div className="lab-workspace lab-software">
      <section className="lab-panel lab-editor-panel" aria-label={tx("HTML editor")}><div className="lab-panel-heading"><Code2 size={18} /><h2>{tx("index.html")}</h2><span>{tx("HTML + CSS")}</span></div><div className="lab-editor"><div className="lab-line-numbers" aria-hidden="true">{code.split("\n").map((_, index) => <div key={index}>{index + 1}</div>)}</div><textarea aria-label={tx("HTML code editor")} aria-describedby="editor-help" spellCheck={false} autoCapitalize="off" autoCorrect="off" value={editorCode} onChange={event => setCode(event.target.value)} /></div><div className="lab-panel-foot" id="editor-help">{tx("Preview updates as you type. Tab and Shift+Tab move between controls.")}</div></section>
      <section className="lab-panel lab-preview-panel" aria-label={tx("Website preview")}><div className="lab-panel-heading"><Globe size={18} /><h2>{tx("Live preview")}</h2><span>{tx("My first website")}</span></div><iframe title={tx("Your website live preview")} sandbox="" srcDoc={document} /><div className="lab-panel-foot">{tx("A private preview of your HTML and CSS.")}</div></section>

      <Guide track="software" steps={lessons.software.steps} progress={progress} validate={() => validateWebsite(code, progress.step)} />
    </div>
    <Completion track="software" progress={progress}><button className="lab-primary" onClick={() => saveFile(document, "my-first-website.html", "text/html")}><Download size={16} />{tx("Download website")}</button></Completion>
  </>;
}
