"use client";
import { useTranslation } from "@/app/i18n/provider";

import React, { useState, useRef } from "react";
import confetti from "canvas-confetti";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowLeft,
  Terminal,
  Sparkles,
  Bug,
  FileCode,
  ChevronRight,
  Info,
  Check
} from "lucide-react";
import { sounds } from "../lib/sound-effects";

interface BugChallenge {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate";
  subtitle: string;
  story: string;
  initialCode: string;
  expectedOutput: string;
  testInputDescription: string;
  hints: string[];
  explanation: string;
  verify: (code: string) => { passed: boolean; logs: string[]; error?: string };
}

const CHALLENGES: BugChallenge[] = [
  {
    id: "discount-math",
    title: "Student Ticket Discount Bug",
    difficulty: "Beginner",
    subtitle: "Mathematical Operator Error",
    story: "High school students are buying tickets for the Tech Expo. Entering code STUDENT50 is accidentally *increasing* their price to $90 instead of discounting it to $30! Spot and fix the operator bug.",
    initialCode: `function calculateTicketPrice(basePrice, discountPercent) {
  // Step 1: Calculate the 50% discount value ($30)
  const discountAmount = (basePrice * discountPercent) / 100;

  // ⚠️ BUG ON LINE 6: Check how discount is applied!
  const finalPrice = basePrice + discountAmount;

  return finalPrice;
}

// Test: $60 ticket with 50% discount
const result = calculateTicketPrice(60, 50);
console.log("Calculated Price: $" + result);`,
    expectedOutput: "Calculated Price: $30",
    testInputDescription: "basePrice: $60, discountPercent: 50",
    hints: [
      "Take a close look at Line 6.",
      "A discount is meant to SUBTRACT from the price, not add to it.",
      "Change the plus (+) operator to a minus (-) operator on Line 6."
    ],
    explanation: "In software engineering, off-by-one errors and inverted operators (+ instead of -) are among the most common bugs in production. Automated tests catch these before real users are billed!",
    verify: (code: string) => {
      const logs: string[] = [];
      try {
        // Safe evaluation simulation
        const cleanCode = code.replace(/console\.log/g, "__log");
        let loggedValue = "";
        const runFn = new Function(
          "__log",
          cleanCode
        );
        runFn((msg: unknown) => {
          loggedValue = String(msg);
          logs.push(String(msg));
        });

        const passed = loggedValue.includes("$30") || loggedValue.includes("30");
        return {
          passed,
          logs: logs.length > 0 ? logs : ["No console output detected."],
          error: passed ? undefined : "Output was " + (loggedValue || "undefined") + " instead of $30. The discount increased the price!"
        };
      } catch (err: unknown) {
        return {
          passed: false,
          logs,
          error: err instanceof Error ? err.message : "Syntax error in code."
        };
      }
    }
  },
  {
    id: "string-greeting",
    title: "Welcome Email Profile Glitch",
    difficulty: "Beginner",
    subtitle: "Object Property Access Bug",
    story: "New students are getting an email that says 'Welcome to FYP, [object Object]!' instead of their actual name. Fix the property access on the student object.",
    initialCode: `function createWelcomeMessage(student) {
  // student has properties: { name: "Maya Lin", track: "Software" }

  // ⚠️ BUG ON LINE 5: We need the student's name, not the whole object!
  const greeting = "Welcome to FYP, " + student + "! Ready to explore " + student.track + "?";

  return greeting;
}

const user = { name: "Maya Lin", track: "Software Track" };
const message = createWelcomeMessage(user);
console.log(message);`,
    expectedOutput: "Welcome to FYP, Maya Lin! Ready to explore Software Track?",
    testInputDescription: "user: { name: 'Maya Lin', track: 'Software Track' }",
    hints: [
      "Look at Line 5 where `student` is concatenated.",
      "In JavaScript, `student` is the whole object. To get the person's name, use `student.name`.",
      "Replace `+ student +` with `+ student.name +`."
    ],
    explanation: "Objects store key-value pairs. Accessing object properties with dot notation (e.g. user.name) is a fundamental building block of modern web development.",
    verify: (code: string) => {
      const logs: string[] = [];
      try {
        const cleanCode = code.replace(/console\.log/g, "__log");
        let loggedValue = "";
        const runFn = new Function("__log", cleanCode);
        runFn((msg: unknown) => {
          loggedValue = String(msg);
          logs.push(String(msg));
        });

        const passed = loggedValue.includes("Maya Lin") && !loggedValue.includes("[object Object]");
        return {
          passed,
          logs: logs.length > 0 ? logs : ["No output detected."],
          error: passed ? undefined : "Output still contained '[object Object]' instead of Maya Lin."
        };
      } catch (err: unknown) {
        return {
          passed: false,
          logs,
          error: err instanceof Error ? err.message : "Syntax error in code."
        };
      }
    }
  },
  {
    id: "threshold-gate",
    title: "Free Shipping Threshold Bug",
    difficulty: "Intermediate",
    subtitle: "Boundary Condition Bug",
    story: "The store banner promises 'Free shipping on orders $50 and above!'. But when a cart is exactly $50.00, it's wrongly rejecting free shipping!",
    initialCode: `function isFreeShipping(cartTotal) {
  // Free shipping threshold is $50.00 and up.

  // ⚠️ BUG ON LINE 5: What happens when cartTotal is EXACTLY 50?
  if (cartTotal > 50) {
    return "FREE SHIPPING GRANTED! 🚚";
  } else {
    return "Standard Shipping ($4.99)";
  }
}

// Customer has exactly $50 in cart
const status = isFreeShipping(50);
console.log("Cart Result: " + status);`,
    expectedOutput: "Cart Result: FREE SHIPPING GRANTED! 🚚",
    testInputDescription: "cartTotal: $50.00",
    hints: [
      "Check the comparison operator on Line 5: `cartTotal > 50`.",
      "Greater than (>) only triggers if the total is 51 or more.",
      "Change `>` to `>=` (greater than or equal to) so $50 exactly qualifies!"
    ],
    explanation: "Boundary and edge case errors (like > versus >=) are responsible for countless real-world bugs. Good engineers always test boundary values like 0, 49.99, and 50.00!",
    verify: (code: string) => {
      const logs: string[] = [];
      try {
        const cleanCode = code.replace(/console\.log/g, "__log");
        let loggedValue = "";
        const runFn = new Function("__log", cleanCode);
        runFn((msg: unknown) => {
          loggedValue = String(msg);
          logs.push(String(msg));
        });

        const passed = loggedValue.includes("FREE SHIPPING GRANTED");
        return {
          passed,
          logs: logs.length > 0 ? logs : ["No output detected."],
          error: passed ? undefined : "At $50.00, customer was charged standard shipping instead of getting free shipping!"
        };
      } catch (err: unknown) {
        return {
          passed: false,
          logs,
          error: err instanceof Error ? err.message : "Syntax error in code."
        };
      }
    }
  }
];

export default function CodingSimulation({ isModal = false, onClose }: { isModal?: boolean; onClose?: () => void }) {
  const { t: tx } = useTranslation();
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(0);
  const challenge = CHALLENGES[activeChallengeIndex];

  const [code, setCode] = useState(challenge.initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<{ passed: boolean; logs: string[]; error?: string } | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [hasCompleted, setHasCompleted] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"code" | "insight">("code");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function selectChallenge(index: number) {
    if (index === activeChallengeIndex) return;
    setActiveChallengeIndex(index);
    setCode(CHALLENGES[index].initialCode);
    setTestResult(null);
    setHintLevel(0);
  }

  const handleRunCode = () => {
    sounds.playPulse();
    setIsRunning(true);
    setTestResult(null);

    setTimeout(() => {
      const result = challenge.verify(code);
      setIsRunning(false);
      setTestResult(result);

      if (result.passed) {
        sounds.playSuccess();
        setHasCompleted(prev => ({ ...prev, [challenge.id]: true }));
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {}
      } else {
        sounds.playError();
      }
    }, 400);
  };

  const handleReset = () => {
    sounds.playClick();
    setCode(challenge.initialCode);
    setTestResult(null);
    setHintLevel(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode = editorCode.substring(0, start) + "  " + editorCode.substring(end);
      setCode(newCode);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const editorCode = code === challenge.initialCode ? code.split("\n").map(line => line.replace(/\/\/.*$/, comment => tx(comment))).join("\n") : code;
  const lineCount = editorCode.split("\n").length;

  return (
    <div className="legacy-simulation w-full min-h-screen bg-[#111827] text-slate-100 font-sans flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Floating / Glass Navigation Bar */}
      <section aria-label={tx("Simulation tools")} className="bg-[#1e293b]/90 backdrop-blur-md border-b border-slate-700/60 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {isModal && onClose ? (
            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600/50 text-xs font-semibold transition-all shadow-sm group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>{tx("Back to Office")}</span>
            </button>
          ) : null}

          <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold border border-emerald-500/30">
              💻
            </span>
            <div>
              <div className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                {tx("Coding & Bug Fix Station")}<span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                  {tx("Interactive Sandbox")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Switcher Pills */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-lg border border-slate-700/60">
          {CHALLENGES.map((ch, idx) => {
            const isCompleted = hasCompleted[ch.id];
            const isActive = activeChallengeIndex === idx;
            return (
              <button
                key={ch.id}
                onClick={() => { sounds.playClick(); selectChallenge(idx); }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 text-emerald-200" />
                ) : (
                  <Bug className="w-3 h-3 text-slate-400" />
                )}
                <span>{tx("Bug ")}{idx + 1}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Workspace Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Mission Briefing & Challenge Switcher (Mobile) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Challenge Selector for Mobile */}
          <div className="flex md:hidden overflow-x-auto gap-2 pb-1">
            {CHALLENGES.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => { sounds.playClick(); selectChallenge(idx); }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap border ${
                  activeChallengeIndex === idx
                    ? "bg-emerald-600 text-white border-emerald-500"
                    : "bg-slate-800/80 text-slate-300 border-slate-700"
                }`}
              >
                {tx("Bug ")}{idx + 1}: {tx(ch.title.split(" ")[0])}
              </button>
            ))}
          </div>

          {/* Mission Briefing Card */}
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/70 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/60">
                  {tx(challenge.subtitle)}
                </span>
                <div className="!text-xl font-bold text-white mt-1.5 leading-snug">{tx(challenge.title)}</div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-700/70 text-slate-300 border border-slate-600/40">
                {tx(challenge.difficulty)}
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/50 mb-4">
              {tx(challenge.story)}
            </p>

            {/* Test Case Target */}
            <div className="space-y-2 mb-4 text-xs font-mono">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400">{tx("Input Data:")}</span>
                <span className="text-amber-300 font-semibold">{tx(challenge.testInputDescription)}</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400">{tx("Expected Result:")}</span>
                <span className="text-emerald-400 font-semibold">{tx(challenge.expectedOutput)}</span>
              </div>
            </div>

            {/* Hint System */}
            <div className="pt-3 border-t border-slate-700/60">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setHintLevel(prev => Math.min(prev + 1, challenge.hints.length));
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>
                    {tx(hintLevel === 0 ? "Need a Hint?" : `Hint (${hintLevel}/${challenge.hints.length})`)}
                  </span>
                </button>
                {hintLevel > 0 && (
                  <button
                    onClick={() => setHintLevel(0)}
                    className="text-[11px] text-slate-400 hover:text-slate-300"
                  >
                    {tx("Hide")}</button>
                )}
              </div>

              {hintLevel > 0 && (
                <div className="space-y-1.5">
                  {challenge.hints.slice(0, hintLevel).map((h, i) => (
                    <div
                      key={i}
                      className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-200 p-2.5 rounded-lg flex items-start gap-2"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{tx(h)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Engineer Role Insight */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4.5 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-semibold text-slate-200 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{tx("Real-World Role Insight: Software Engineers")}</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              {tx(challenge.explanation)}
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-700/40 flex items-center gap-2 text-[11px] text-slate-400">
              <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{tx("Pure sandbox. No test grades or evaluations — just hands-on problem solving!")}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Console Output */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Code Editor Window */}
          <div className="bg-[#1e1e1e] border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* Editor Top Bar */}
            <div className="bg-[#252526] px-4 py-2.5 flex items-center justify-between border-b border-black/40">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block" />
                <div className="h-3 w-px bg-slate-600/50 mx-2" />
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                  <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{tx("calculator.js")}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-2.5 py-1 rounded bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all"
                  title={tx("Reset code to original")}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{tx("Reset")}</span>
                </button>
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-md hover:shadow-emerald-900/40 transition-all cursor-pointer"
                >
                  <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? "animate-spin" : ""}`} />
                  <span>{tx(isRunning ? "Running..." : "Run Code")}</span>
                </button>
              </div>
            </div>

            {/* Code Textarea with Line Numbers */}
            <div className="relative font-mono text-[13px] leading-6 p-4 flex min-h-[290px] bg-[#1e1e1e]">
              {/* Line Numbers Column */}
              <div className="select-none pr-4 text-right text-slate-600 font-mono shrink-0">
                {Array.from({ length: lineCount }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Editable Area */}
              <textarea
                ref={textareaRef}
                value={editorCode}
                onChange={e => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                className="w-full h-full bg-transparent text-emerald-300 resize-none outline-none font-mono text-[13px] leading-6 focus:ring-0 border-none p-0 selection:bg-emerald-600/40 whitespace-pre"
              />
            </div>
          </div>

          {/* Terminal Console Output Window */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col min-h-[200px]">
            {/* Terminal Header */}
            <div className="bg-[#1e293b]/70 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                <span>{tx("Execution Output / Terminal")}</span>
              </div>
              {testResult && (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    testResult.passed
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  }`}
                >
                  {testResult.passed ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{tx("Test Passed!")}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3" />
                      <span>{tx("Bug Detected")}</span>
                    </>
                  )}
                </span>
              )}
            </div>

            {/* Terminal Body */}
            <div className="p-4 font-mono text-xs space-y-2 flex-1">
              {!testResult && !isRunning && (
                <p className="text-slate-500 italic">
                  {tx("Click 'Run Code' to execute the script and run test validations...")}</p>
              )}

              {isRunning && (
                <div className="flex items-center gap-2 text-emerald-400 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{tx("Compiling & executing ticketCalculator.js...")}</span>
                </div>
              )}

              {testResult && (
                <div className="space-y-3">
                  <div>
                    <span className="text-slate-500">{tx("$ node calculator.js")}</span>
                    <div className="mt-1 bg-black/40 p-2.5 rounded-lg border border-slate-800 text-slate-200">
                      {testResult.logs.map((log, idx) => (
                        <div key={idx} className="text-emerald-400 font-bold">{tx(log)}</div>
                      ))}
                    </div>
                  </div>

                  {testResult.passed ? (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-200 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-sm text-emerald-300">
                          {tx("Bug Squashed! Excellent Work!")}</div>
                        <p className="text-xs text-emerald-200/90 mt-1">
                          {tx("The function now correctly calculates the discounted ticket total. You just fixed a real-world software logic flaw!")}</p>
                        {activeChallengeIndex < CHALLENGES.length - 1 && (
                          <button
                            onClick={() => {
                              sounds.playClick();
                              selectChallenge(activeChallengeIndex + 1);
                            }}
                            className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                          >
                            <span>{tx("Next Bug Challenge")}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-200 flex items-start gap-2.5">
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-sm text-rose-300">{tx("Test Case Failed")}</div>
                        <p className="text-xs text-rose-200/90 mt-1">{tx(testResult.error)}</p>
                        <p className="text-[11px] text-slate-400 mt-2">
                          {tx("💡 Hint: Check the operator on line 6 or click \"Need a Hint?\" above!")}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
