import React, { useState } from 'react';
import {
  Cable,
  HelpCircle,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Zap
} from 'lucide-react';

export default function HeroSection({ onStartWalkthrough }) {
  const [activeScenario, setActiveScenario] = useState('mst'); // 'isolated' | 'ring' | 'mst'

  const scenarios = {
    isolated: {
      title: '1. No Connections (Isolated)',
      cost: '₹0',
      connectedRate: '0%',
      loops: '0 Loops',
      status: 'Communication Failed',
      statusColor: 'text-red-400 bg-red-500/10 border-red-500/30',
      explanation: 'Five rural families live cut off with zero internet or utility lines. No cost is spent, but zero houses can communicate.',
      accent: 'border-red-500/40',
      edges: []
    },
    ring: {
      title: '2. Naive Redundant Mesh',
      cost: '₹36,000',
      connectedRate: '100%',
      loops: '3 Redundant Loops',
      status: 'Excessive Budget Waste',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      explanation: 'Workers installed cables everywhere in circles! Everyone is connected, but budget is severely blown and circular loops cause network packet collision storms.',
      accent: 'border-amber-500/40',
      edges: ['AB', 'BC', 'CD', 'DE', 'EA', 'AC', 'BD']
    },
    mst: {
      title: '3. Kruskal\'s Minimum Spanning Tree',
      cost: '₹12,000',
      connectedRate: '100%',
      loops: '0 Loops (Strict Tree)',
      status: 'Optimal & Economical',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      explanation: 'By selecting exactly 4 (V - 1) cheapest roads without forming any cycles, every single house is reached at the lowest possible trenching cost.',
      accent: 'border-emerald-500/50',
      edges: ['AB', 'BC', 'CD', 'DE']
    }
  };

  const curr = scenarios[activeScenario];

  return (
    <section id="problem" className="relative pt-8 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Background radial gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF6129]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181D2A] border border-[#263147] text-slate-300 text-xs font-semibold mb-5 shadow-inner">
          <Cable className="w-3.5 h-3.5 text-[#FF6129]" />
          <span>The Real-World Fiber Optic Infrastructure Dilemma</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
          Connecting Isolated Homes at{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6129] via-[#FFA450] to-[#10B981]">
            Minimum Cost
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
          Imagine 5 isolated homes: <span className="font-semibold text-white">House A, B, C, D, E</span>.
          Trenching underground fiber optic cable through rough terrain costs thousands of rupees per kilometer.
        </p>

        {/* The Central Question Box */}
        <div className="mt-6 p-4 sm:p-5 rounded-2xl glass-card border border-[#FF6129]/30 shadow-xl shadow-[#FF6129]/5 inline-block text-left max-w-2xl w-full">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#FF6129]/15 border border-[#FF6129]/30 text-[#FF6129] shrink-0 mt-0.5">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#FF8957]">
                The Core Algorithmic Challenge
              </h2>
              <p className="text-lg sm:text-xl font-heading font-bold text-white mt-1">
                "How do we connect all 5 houses together without wasting money on redundant loops?"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Metaphor Scenario Simulator */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#222A3B] shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8 border-b border-[#21293B] pb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#FF6129]" />
              Interactive Scenario Comparison:
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Click a strategy below to see the dramatic difference in financial cost and loop prevention:
            </p>
          </div>

          {/* Scenario selector tabs */}
          <div className="flex flex-wrap gap-2 bg-[#0C0F17] p-1.5 rounded-2xl border border-[#1E2536]">
            <button
              onClick={() => setActiveScenario('isolated')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeScenario === 'isolated'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Disconnected (₹0)
            </button>
            <button
              onClick={() => setActiveScenario('ring')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeScenario === 'ring'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2. Redundant Mesh (₹36k)
            </button>
            <button
              onClick={() => setActiveScenario('mst')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeScenario === 'mst'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-md shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3. Kruskal's MST (₹12k) ★
            </button>
          </div>
        </div>

        {/* Dynamic Scenario Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Key Metrics */}
          <div className="bg-[#0E121B] rounded-2xl p-5 border border-[#1F2738] flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Infrastructure Bill</span>
              <div className="text-4xl font-black font-heading text-white mt-1 mb-3 flex items-baseline gap-2">
                {curr.cost}
                {activeScenario === 'mst' && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center">
                    <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> 66% Cheaper
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-[#1C2333]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">House Reachability:</span>
                <span className="font-bold text-white">{curr.connectedRate}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Circuit Loops / Cycles:</span>
                <span className={`font-bold ${activeScenario === 'ring' ? 'text-amber-400' : 'text-slate-200'}`}>
                  {curr.loops}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Network Efficiency:</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${curr.statusColor}`}>
                  {curr.status}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Visual Concept Explainer */}
          <div className="md:col-span-2 bg-[#0E121B] rounded-2xl p-5 border border-[#1F2738] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-lg font-bold text-white">{curr.title}</h4>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {curr.explanation}
              </p>
            </div>

            {/* Quick 3 Fundamental Rules of an MST */}
            <div className="mt-5 pt-4 border-t border-[#1C2333] grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#141926] p-3 rounded-xl border border-white/5">
                <span className="text-[11px] font-mono text-slate-400 block uppercase">Rule 1: Coverage</span>
                <span className="text-xs font-semibold text-slate-200 mt-1 block">
                  Must connect all 5 vertices (Houses)
                </span>
              </div>
              <div className="bg-[#141926] p-3 rounded-xl border border-white/5">
                <span className="text-[11px] font-mono text-slate-400 block uppercase">Rule 2: Tree Count</span>
                <span className="text-xs font-semibold text-emerald-400 mt-1 block">
                  Must use exactly V - 1 = 4 edges
                </span>
              </div>
              <div className="bg-[#141926] p-3 rounded-xl border border-white/5">
                <span className="text-[11px] font-mono text-slate-400 block uppercase">Rule 3: Optimality</span>
                <span className="text-xs font-semibold text-[#FF8957] mt-1 block">
                  Sum of cable weights must be minimum
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button to Walkthrough */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#121623] p-4 rounded-2xl border border-[#232C3E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6129]/20 flex items-center justify-center text-[#FF6129] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-white">How does Kruskal guarantee this minimum?</h5>
              <p className="text-xs text-slate-400">See the step-by-step greedy sorting and cycle avoidance live.</p>
            </div>
          </div>

          <button
            onClick={onStartWalkthrough}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6129] to-[#FF8042] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FF6129]/20 hover:shadow-[#FF6129]/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Launch Step-by-Step Walkthrough
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
