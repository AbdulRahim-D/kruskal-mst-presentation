import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ShieldCheck
} from 'lucide-react';

export default function DsuBubbleSection() {
  // Simple active scenario toggle: 'safe' | 'cycle'
  const [activeDemo, setActiveDemo] = useState('cycle');

  return (
    <section id="dsu-bubbles" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181D2C] border border-[#252F45] text-slate-300 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Cycle Detection in 10 Seconds</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How Kruskal Spots Cycles: The "Already Connected" Rule
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mt-2">
          No complex coding or algorithms required — Kruskal asks just one simple question for every candidate road:
        </p>

        {/* The Golden Rule Callout */}
        <div className="mt-5 p-4 rounded-2xl glass-card bg-gradient-to-r from-emerald-500/10 via-transparent to-red-500/10 border border-[#232F46] inline-block max-w-2xl text-center shadow-lg">
          <p className="text-base sm:text-lg font-heading font-extrabold text-white">
            "Can these two houses <span className="text-[#FF8957]">already reach each other</span>?"
          </p>
          <div className="mt-2 flex items-center justify-center gap-6 text-xs sm:text-sm font-bold font-mono">
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> If NO ➔ ACCEPT (Safe)
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-red-400 flex items-center gap-1">
              <XCircle className="w-4 h-4" /> If YES ➔ REJECT (Cycle Trap!)
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Visual Comparison (Case 1 vs Case 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Case 1: Safe Road */}
        <div className="p-6 rounded-3xl bg-[#0D121C] border border-emerald-500/30 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
                Case 1 • Safe Road
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ACCEPT
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Example: Road (B ↔ C) at ₹2k
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              House B and House C are not yet linked by any cable. They cannot reach each other.
            </p>

            {/* Simple Visual Diagram */}
            <div className="bg-[#121724] p-4 rounded-2xl border border-white/5 my-4 flex items-center justify-around">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border-2 border-purple-500 text-purple-300 flex items-center justify-center font-black text-lg shadow-lg">
                  B
                </div>
                <span className="text-[11px] text-slate-400 mt-1 font-mono">House B</span>
              </div>

              {/* Connecting Cable */}
              <div className="flex-1 px-4 flex flex-col items-center">
                <span className="text-xs font-mono font-bold text-emerald-400 mb-1">Road: ₹2k</span>
                <div className="w-full h-1 bg-emerald-500 rounded-full shadow-sm shadow-emerald-500" />
                <span className="text-[10px] text-emerald-300 mt-1 font-semibold">New Connection</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border-2 border-cyan-500 text-cyan-300 flex items-center justify-center font-black text-lg shadow-lg">
                  C
                </div>
                <span className="text-[11px] text-slate-400 mt-1 font-mono">House C</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200">
            <strong>Verdict:</strong> Safely joins two isolated houses. Zero circular loops formed!
          </div>
        </div>

        {/* Case 2: Cycle Trap */}
        <div className="p-6 rounded-3xl bg-[#0D121C] border border-red-500/30 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 bg-red-500/15 px-3 py-1 rounded-full border border-red-500/30">
                Case 2 • Cycle Trap
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-red-500/20 text-red-300 text-xs font-bold font-mono border border-red-500/40 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> REJECT
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Example: Road (A ↔ C) at ₹3k
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              House A can <strong>already reach</strong> House C through House B (<span className="text-white font-semibold">A ➔ B ➔ C</span>).
            </p>

            {/* Simple Visual Diagram showing Triangle Loop */}
            <div className="bg-[#121724] p-4 rounded-2xl border border-white/5 my-4 flex items-center justify-around relative">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border-2 border-purple-500 text-purple-300 flex items-center justify-center font-black text-lg shadow-lg">
                  A
                </div>
                <span className="text-[11px] text-slate-400 mt-1 font-mono">House A</span>
              </div>

              {/* Middle House */}
              <div className="flex flex-col items-center px-2">
                <span className="text-[10px] text-slate-400 font-mono mb-1">via B (already linked)</span>
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400 text-purple-200 flex items-center justify-center font-bold text-xs">
                  B
                </div>
                <span className="text-[10px] text-red-400 mt-1 font-bold">Closed Loop!</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border-2 border-purple-500 text-purple-300 flex items-center justify-center font-black text-lg shadow-lg">
                  C
                </div>
                <span className="text-[11px] text-slate-400 mt-1 font-mono">House C</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 text-xs text-red-200">
            <strong>Verdict:</strong> A direct cable A ↔ C forms a closed loop (A-B-C-A). Discarded to save ₹3k!
          </div>
        </div>
      </div>

      {/* 1-Click Interactive Presenter Demo */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#232B3C] shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF6129]">
              Live 1-Click Presenter Demo
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              Click a Road to See Kruskal's Decision:
            </h3>
          </div>

          {/* Toggle buttons */}
          <div className="flex items-center gap-2 bg-[#0C0F17] p-1.5 rounded-2xl border border-[#1E2536]">
            <button
              onClick={() => setActiveDemo('safe')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeDemo === 'safe'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Test Safe Road (B ↔ C)
            </button>
            <button
              onClick={() => setActiveDemo('cycle')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeDemo === 'cycle'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2. Test Cycle Trap (A ↔ C) ★
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Stage */}
        <div className="bg-[#0E121B] p-6 rounded-2xl border border-[#1F2739]">
          {activeDemo === 'safe' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-bold text-white">Inspecting Road (B ↔ C) — Cost: ₹2k</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                  ✓ ACCEPTED
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#121622] p-4 rounded-xl border border-white/5">
                Kruskal checks: <em>"Can House B already reach House C?"</em> ➔ <strong>No!</strong> House C is completely unreached.
                Adding this road connects House C to the village network without creating any circular path.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#141A27] border border-white/5 text-center">
                  <span className="text-slate-400 block text-[10px]">Path Exists Before?</span>
                  <strong className="text-white text-sm">NO</strong>
                </div>
                <div className="p-3 rounded-xl bg-[#141A27] border border-white/5 text-center">
                  <span className="text-slate-400 block text-[10px]">Action</span>
                  <strong className="text-emerald-400 text-sm">ACCEPT ROAD</strong>
                </div>
                <div className="p-3 rounded-xl bg-[#141A27] border border-white/5 text-center">
                  <span className="text-slate-400 block text-[10px]">Result</span>
                  <strong className="text-slate-200 text-sm">ZERO LOOPS</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400 animate-ping" />
                  <span className="text-sm font-bold text-white">Inspecting Road (A ↔ C) — Cost: ₹3k</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-mono font-bold border border-red-500/30 animate-pulse">
                  ✗ REJECTED (CYCLE)
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#121622] p-4 rounded-xl border border-white/5">
                Kruskal checks: <em>"Can House A already reach House C?"</em> ➔ <strong>YES!</strong> A signal can already travel <span className="text-white font-bold">A ➔ B ➔ C</span>.
                Adding a direct cable between A and C creates a closed triangle loop (<span className="text-red-400 font-bold">A ➔ B ➔ C ➔ A</span>), which wastes ₹3k and causes packet collision storms!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#141A27] border border-white/5 text-center">
                  <span className="text-slate-400 block text-[10px]">Path Exists Before?</span>
                  <strong className="text-red-400 text-sm">YES (via B)</strong>
                </div>
                <div className="p-3 rounded-xl bg-[#141A27] border border-white/5 text-center">
                  <span className="text-slate-400 block text-[10px]">Action</span>
                  <strong className="text-red-400 text-sm">REJECT ROAD</strong>
                </div>
                <div className="p-3 rounded-xl bg-[#141A27] border border-white/5 text-center">
                  <span className="text-slate-400 block text-[10px]">Budget Saved</span>
                  <strong className="text-emerald-400 text-sm">₹3k SAVED</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
