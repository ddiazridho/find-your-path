"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  Database, 
  Table as TableIcon, 
  Terminal, 
  Sparkles, 
  Server, 
  CheckCircle2, 
  Layers, 
  Clock, 
  Activity,
  HardDrive,
  Copy,
  Check
} from "lucide-react";
import { sounds } from "../lib/sound-effects";

interface TableData {
  name: string;
  description: string;
  columns: { name: string; type: string }[];
  rows: Record<string, string | number>[];
}

const DATABASE: Record<string, TableData> = {
  users: {
    name: "users",
    description: "Registered student and developer accounts",
    columns: [
      { name: "id", type: "INT" },
      { name: "name", type: "VARCHAR" },
      { name: "role", type: "VARCHAR" },
      { name: "subscription", type: "VARCHAR" },
      { name: "country", type: "VARCHAR" },
      { name: "credits", type: "INT" },
    ],
    rows: [
      { id: 101, name: "Alex Rivera", role: "Software Intern", subscription: "Pro", country: "USA", credits: 450 },
      { id: 102, name: "Maya Chen", role: "Frontend Dev", subscription: "Student Free", country: "Canada", credits: 120 },
      { id: 103, name: "Liam Patel", role: "Backend Engineer", subscription: "Pro", country: "India", credits: 890 },
      { id: 104, name: "Sophia Rossi", role: "Data Scientist", subscription: "Enterprise", country: "Italy", credits: 1400 },
      { id: 105, name: "Marcus Vance", role: "Fullstack Dev", subscription: "Student Free", country: "UK", credits: 90 },
      { id: 106, name: "Elena Rostova", role: "Cloud Architect", subscription: "Pro", country: "Germany", credits: 780 },
    ]
  },
  servers: {
    name: "servers",
    description: "Live cluster nodes powering the telemetry cloud",
    columns: [
      { name: "server_id", type: "VARCHAR" },
      { name: "region", type: "VARCHAR" },
      { name: "cpu_usage", type: "VARCHAR" },
      { name: "latency_ms", type: "INT" },
      { name: "status", type: "VARCHAR" },
    ],
    rows: [
      { server_id: "srv-us-east-1", region: "Virginia (US)", cpu_usage: "34%", latency_ms: 18, status: "healthy" },
      { server_id: "srv-eu-west-1", region: "Ireland (EU)", cpu_usage: "88%", latency_ms: 95, status: "high_load" },
      { server_id: "srv-ap-se-1", region: "Singapore (AP)", cpu_usage: "96%", latency_ms: 142, status: "critical" },
      { server_id: "srv-us-west-2", region: "Oregon (US)", cpu_usage: "21%", latency_ms: 14, status: "healthy" },
      { server_id: "srv-sa-east-1", region: "São Paulo (SA)", cpu_usage: "45%", latency_ms: 62, status: "healthy" },
      { server_id: "srv-ap-ne-1", region: "Tokyo (JP)", cpu_usage: "79%", latency_ms: 88, status: "high_load" },
    ]
  },
  stream_logs: {
    name: "stream_logs",
    description: "Real-time media streaming events and telemetry",
    columns: [
      { name: "track_id", type: "INT" },
      { name: "title", type: "VARCHAR" },
      { name: "artist", type: "VARCHAR" },
      { name: "genre", type: "VARCHAR" },
      { name: "streams_today", type: "INT" },
      { name: "bitrate_kbps", type: "INT" },
    ],
    rows: [
      { track_id: 801, title: "Cyberpunk Dreams", artist: "SynthWave Co", genre: "Electronic", streams_today: 48210, bitrate_kbps: 320 },
      { track_id: 802, title: "Tokyo Rain Reflections", artist: "LoFi Cafe", genre: "Chillhop", streams_today: 92450, bitrate_kbps: 320 },
      { track_id: 803, title: "Quantum Computing", artist: "Algorhythm", genre: "Ambient", streams_today: 18300, bitrate_kbps: 256 },
      { track_id: 804, title: "Midnight Code Flow", artist: "Dev Beats", genre: "Lo-Fi", streams_today: 120400, bitrate_kbps: 320 },
      { track_id: 805, title: "Deep Sea Synthesis", artist: "Coral Reef", genre: "Ambient", streams_today: 34100, bitrate_kbps: 256 },
    ]
  }
};

const PRESET_QUERIES = [
  { label: "👥 All Users", sql: "SELECT * FROM users;" },
  { label: "💎 Pro Subscribers", sql: "SELECT name, role, subscription, country FROM users WHERE subscription = 'Pro';" },
  { label: "🚨 High Latency Servers", sql: "SELECT server_id, region, latency_ms, status FROM servers WHERE latency_ms > 70;" },
  { label: "🔥 Critical Servers", sql: "SELECT * FROM servers WHERE status = 'critical';" },
  { label: "🎵 Top Streamed Tracks", sql: "SELECT title, artist, streams_today FROM stream_logs ORDER BY streams_today DESC LIMIT 3;" },
];

export default function DatabaseSimulation({ isModal = false, onClose }: { isModal?: boolean; onClose?: () => void }) {
  const [activeTable, setActiveTable] = useState<string>("servers");
  const [queryInput, setQueryInput] = useState<string>("SELECT * FROM servers;");
  const [executedQuery, setExecutedQuery] = useState<string>("SELECT * FROM servers;");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [queryResults, setQueryResults] = useState<Record<string, string | number>[]>(DATABASE.servers.rows);
  const [executionTime, setExecutionTime] = useState<number>(8);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  // In-memory SQL execution engine
  const executeSQL = (sqlText: string) => {
    sounds.playPulse();
    setIsRunning(true);
    setErrorMessage(null);

    setTimeout(() => {
      try {
        const cleaned = sqlText.trim().replace(/;$/, "");
        const selectMatch = cleaned.match(/SELECT\s+(.+?)\s+FROM\s+([a-zA-Z0-9_]+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER BY\s+(.+?))?(?:\s+LIMIT\s+(\d+))?$/i);

        if (!selectMatch) {
          throw new Error("Syntax Error: Expected format: SELECT [columns] FROM [table] WHERE ... ORDER BY ... LIMIT ...");
        }

        const [, columnsClause, tableNameRaw, whereClause, orderClause, limitClause] = selectMatch;
        const tableName = tableNameRaw.toLowerCase();

        const table = DATABASE[tableName];
        if (!table) {
          throw new Error(`Table '${tableName}' not found. Available tables: ${Object.keys(DATABASE).join(", ")}`);
        }

        let filteredRows = [...table.rows];

        // Process WHERE clause
        if (whereClause) {
          const condition = whereClause.trim();
          const comparisonMatch = condition.match(/([a-zA-Z0-9_]+)\s*(=|>|<|!=)\s*(.+)/);
          if (comparisonMatch) {
            const [, col, op, rawVal] = comparisonMatch;
            const val = rawVal.replace(/^['"]|['"]$/g, "").trim();

            filteredRows = filteredRows.filter(row => {
              const rowVal = row[col];
              if (rowVal === undefined) return false;

              if (op === "=") {
                return String(rowVal).toLowerCase() === val.toLowerCase();
              } else if (op === "!=") {
                return String(rowVal).toLowerCase() !== val.toLowerCase();
              } else if (op === ">") {
                return Number(rowVal) > Number(val);
              } else if (op === "<") {
                return Number(rowVal) < Number(val);
              }
              return true;
            });
          }
        }

        // Process ORDER BY
        if (orderClause) {
          const [orderCol, direction] = orderClause.trim().split(/\s+/);
          const isDesc = direction && direction.toUpperCase() === "DESC";

          filteredRows.sort((a, b) => {
            const aVal = a[orderCol];
            const bVal = b[orderCol];
            if (aVal === undefined || bVal === undefined) return 0;
            if (typeof aVal === "number" && typeof bVal === "number") {
              return isDesc ? bVal - aVal : aVal - bVal;
            }
            return isDesc
              ? String(bVal).localeCompare(String(aVal))
              : String(aVal).localeCompare(String(bVal));
          });
        }

        // Process LIMIT
        if (limitClause) {
          const limitCount = parseInt(limitClause, 10);
          if (!isNaN(limitCount)) {
            filteredRows = filteredRows.slice(0, limitCount);
          }
        }

        // Process column projection
        if (columnsClause.trim() !== "*") {
          const requestedCols = columnsClause.split(",").map(c => c.trim());
          filteredRows = filteredRows.map(row => {
            const projected: Record<string, string | number> = {};
            requestedCols.forEach(c => {
              if (row[c] !== undefined) projected[c] = row[c];
            });
            return projected;
          });
        }

        setQueryResults(filteredRows);
        setExecutedQuery(sqlText);
        setExecutionTime(Math.floor(Math.random() * 8) + 6);
        setIsRunning(false);
        sounds.playSuccess();

        if (sqlText.includes("WHERE") || sqlText.includes("ORDER BY")) {
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 }
            });
          } catch {}
        }
      } catch (err: unknown) {
        setIsRunning(false);
        sounds.playError();
        setErrorMessage(err instanceof Error ? err.message : "Error executing query");
        setQueryResults([]);
      }
    }, 280);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(queryResults, null, 2));
    setHasCopied(true);
    sounds.playClick();
    setTimeout(() => setHasCopied(false), 2000);
  };

  const resultColumns = queryResults.length > 0 ? Object.keys(queryResults[0]) : [];

  return (
    <div className="legacy-simulation w-full min-h-screen bg-[#07131e] text-slate-100 font-sans flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Floating Glass Navigation */}
      <section aria-label="Simulation tools" className="bg-[#0c1f33]/90 backdrop-blur-md border-b border-cyan-900/40 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {isModal && onClose ? (
            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold transition-all shadow-sm group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Office</span>
            </button>
          ) : null}

          <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono text-xs font-bold border border-cyan-500/30">
              🗄️
            </span>
            <div>
              <div className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                Database &amp; SQL Query Station
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 whitespace-nowrap">
                  Live Cloud Telemetry Sandbox
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Cluster Health Badge */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/60 text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Vantis Spark Cloud: Connected (PostgreSQL v16)</span>
        </div>
      </section>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Schema Browser & Table Metadata */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900/80 backdrop-blur-md border border-cyan-900/40 rounded-2xl p-5 shadow-xl flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-4 h-4 text-cyan-400" />
              <div className="!text-sm font-bold text-white uppercase tracking-wider">
                Database Schema
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Select a table to view its structure or run preset queries against it.
            </p>

            {/* Table Cards */}
            <div className="space-y-2.5">
              {Object.values(DATABASE).map(tbl => {
                const isSelected = activeTable === tbl.name;
                return (
                  <button
                    key={tbl.name}
                    onClick={() => {
                      sounds.playClick();
                      setActiveTable(tbl.name);
                      setQueryInput(`SELECT * FROM ${tbl.name};`);
                      executeSQL(`SELECT * FROM ${tbl.name};`);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-cyan-950/60 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/40"
                        : "bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan-300">
                        <TableIcon className="w-3.5 h-3.5" />
                        <span>{tbl.name}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {tbl.rows.length} rows
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-2">
                      {tbl.description}
                    </p>

                    {/* Column chips */}
                    <div className="flex flex-wrap gap-1">
                      {tbl.columns.map(col => (
                        <span
                          key={col.name}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-700/40"
                        >
                          {col.name}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real World Insight */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4.5 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-semibold text-slate-200 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Real-World Role: Backend &amp; Data Engineers</span>
            </div>
            <p className="leading-relaxed text-slate-400 text-[11px]">
              Every modern application (Instagram, Spotify, Uber) relies on databases to instantly filter and deliver information to millions of users. Mastering SQL query logic is a superpower in computer science!
            </p>
          </div>
        </div>

        {/* Right Column: SQL Query Editor & Interactive Data Table */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Quick Preset Query Chips */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1 mr-1">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Presets:</span>
            </span>
            {PRESET_QUERIES.map(pq => (
              <button
                key={pq.label}
                onClick={() => {
                  sounds.playClick();
                  setQueryInput(pq.sql);
                  executeSQL(pq.sql);
                }}
                className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-950/60 hover:border-cyan-500/50 border border-slate-700/70 text-slate-300 hover:text-cyan-200 transition-all cursor-pointer"
              >
                {pq.label}
              </button>
            ))}
          </div>

          {/* SQL Editor Console */}
          <div className="bg-[#0b1b2b] border border-cyan-900/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="bg-[#0f243a] px-4 py-2.5 flex items-center justify-between border-b border-cyan-950">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>SQL Query Console</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setQueryInput(`SELECT * FROM ${activeTable};`);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
                <button
                  onClick={() => executeSQL(queryInput)}
                  disabled={isRunning}
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-md hover:shadow-cyan-900/40 transition-all cursor-pointer"
                >
                  <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? "animate-spin" : ""}`} />
                  <span>{isRunning ? "Running..." : "Run Query"}</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-[#081522] font-mono text-sm">
              <textarea
                value={queryInput}
                onChange={e => setQueryInput(e.target.value)}
                rows={2}
                spellCheck={false}
                className="w-full bg-transparent text-cyan-200 resize-none outline-none font-mono text-sm leading-6 focus:ring-0 border-none p-0 selection:bg-cyan-600/40"
                placeholder="Type SQL query (e.g. SELECT * FROM users WHERE subscription = 'Pro';)"
              />
            </div>
          </div>

          {/* Execution Status Bar */}
          <div className="flex items-center justify-between px-2 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Status: 200 OK</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Execution: {executionTime}ms</span>
              </span>
              <span>·</span>
              <span>Returned {queryResults.length} records</span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors"
              title="Copy JSON results"
            >
              {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{hasCopied ? "Copied" : "Copy JSON"}</span>
            </button>
          </div>

          {/* Data Table Result View */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex-1 flex flex-col min-h-[300px]">
            {errorMessage ? (
              <div className="p-6 text-rose-300 font-mono text-xs flex items-start gap-3 bg-rose-950/20">
                <span className="text-base">❌</span>
                <div>
                  <div className="font-bold text-rose-200">Query Execution Error</div>
                  <p className="mt-1">{errorMessage}</p>
                  <p className="mt-2 text-slate-400">
                    💡 Example: Try clicking one of the preset query chips above to test valid syntax!
                  </p>
                </div>
              </div>
            ) : queryResults.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-mono text-xs my-auto">
                No matching rows found for condition.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-800/80 text-cyan-300 border-b border-slate-700/80 uppercase text-[10px] tracking-wider">
                    <tr>
                      {resultColumns.map(col => (
                        <th key={col} className="p-3.5 font-bold">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {queryResults.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="hover:bg-slate-800/40 transition-colors"
                      >
                        {resultColumns.map(col => {
                          const val = row[col];
                          // Status formatting
                          if (col === "status") {
                            const isHealthy = val === "healthy";
                            const isCrit = val === "critical";
                            return (
                              <td key={col} className="p-3.5">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    isHealthy
                                      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                      : isCrit
                                      ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                                      : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                                  }`}
                                >
                                  {String(val)}
                                </span>
                              </td>
                            );
                          }
                          return (
                            <td key={col} className="p-3.5 text-slate-200">
                              {String(val)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
