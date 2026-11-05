import React, { useState } from 'react';
import {
  GitCompare,
  ArrowRightLeft,
  TreeDeciduous,
  Layers,
  Cpu,
  Zap,
  Sparkles,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function ComparisonSection() {
  const [selectedScenario, setSelectedScenario] = useState('sparse'); // 'sparse' | 'dense'

  const criteria = [
    {
      label: 'Core Philosophy',
      kruskal: 'Edge-Centric: Inspects individual roads across the entire map, regardless of position.',
      prim: 'Vertex-Centric: Starts at one source city and continuously expands outward.'
    },
    {
      label: 'How the Tree Grows',
      kruskal: 'Forest growing into one: Multiple independent tree fragments merge together.',
      prim: 'Single crystal growing: A single continuous tree expanding branch by branch.'
    },
    {
      label: 'Key Data Structure',
      kruskal: 'Disjoint Set Union (DSU / Union-Find) with path compression.',
      prim: 'Priority Queue (Min-Heap / Fibonacci Heap) for nearest neighboring vertices.'
    },
    {
      label: 'Best Suited For',
      kruskal: 'Sparse Graphs (E ≈ V): When roads are few, sorting edges is lightning fast.',
      prim: 'Dense Graphs (E ≈ V²): When almost every city connects to every other city.'
    },
    {
      label: 'Time Complexity',
      kruskal: 'O(E log E) or O(E log V) — dominated by sorting all edges.',
      prim: 'O(E + V log V) with Fibonacci Heap or O(E log V) with standard Min-Heap.'
    }
  ];

  return (
    <section id="comparison" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181E2B] border border-[#242E42] text-slate-300 text-xs font-semibold mb-3">
          <ArrowRightLeft className="w-3.5 h-3.5 text-[#FF6129]" />
          <span>Algorithmic Showdown</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Kruskal vs. Prim: When to Use Which?
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mt-2">
          Both algorithms find the exact same Minimum Spanning Tree weight, but their approach to exploration is fundamentally opposite.
        </p>
      </div>

      {/* Side-by-Side Visual Battle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Kruskal Card */}
        <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-[#FF6129]/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF6129]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF6129]/20 border border-[#FF6129]/40 flex items-center justify-center text-[#FF6129]">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold text-[#FF8957] uppercase tracking-wider block">
                  Global Greedy
                </span>
                <h3 className="text-2xl font-black text-white">Kruskal's Algorithm</h3>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#FF6129]/15 border border-[#FF6129]/30 text-xs font-bold text-[#FF8957]">
              Edge-Driven
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Treats all edges like a giant catalog sorted by price. It picks the cheapest available cable in the entire world, as long as it doesn't create a loop.
          </p>

          {/* Visual Metaphor representation */}
          <div className="p-4 rounded-2xl bg-[#0C1019] border border-[#1E273A] mb-4">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Visual Growth Pattern:
            </span>
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="bg-[#141A27] p-2.5 rounded-xl border border-white/5 text-center flex-1">
                <span className="text-emerald-400 font-bold block">Fragment A</span>
                <span className="text-[10px] text-slate-400">Tree cluster</span>
              </div>
              <span className="text-slate-500 font-bold">+</span>
              <div className="bg-[#141A27] p-2.5 rounded-xl border border-white/5 text-center flex-1">
                <span className="text-cyan-400 font-bold block">Fragment B</span>
                <span className="text-[10px] text-slate-400">Tree cluster</span>
              </div>
              <span className="text-slate-500 font-bold">➔</span>
              <div className="bg-[#192233] p-2.5 rounded-xl border border-[#FF6129]/30 text-center flex-1">
                <span className="text-[#FF8957] font-bold block">Merged MST</span>
                <span className="text-[10px] text-slate-300">Forest unites</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prim Card */}
        <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-[#3B82F6]/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/20 border border-[#3B82F6]/40 flex items-center justify-center text-[#3B82F6]">
                <TreeDeciduous className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold text-blue-400 uppercase tracking-wider block">
                  Local Outward Expansion
                </span>
                <h3 className="text-2xl font-black text-white">Prim's Algorithm</h3>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#3B82F6]/15 border border-[#3B82F6]/30 text-xs font-bold text-blue-300">
              Vertex-Driven
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Picks an arbitrary starting home and continuously adds the cheapest neighboring road that connects an unvisited home to the existing tree.
          </p>

          {/* Visual Metaphor representation */}
          <div className="p-4 rounded-2xl bg-[#0C1019] border border-[#1E273A] mb-4">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Visual Growth Pattern:
            </span>
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="bg-[#141A27] p-2.5 rounded-xl border border-white/5 text-center flex-1">
                <span className="text-blue-400 font-bold block">1 Root Node</span>
                <span className="text-[10px] text-slate-400">Starting point</span>
              </div>
              <span className="text-slate-500 font-bold">➔</span>
              <div className="bg-[#141A27] p-2.5 rounded-xl border border-white/5 text-center flex-1">
                <span className="text-blue-300 font-bold block">Expands</span>
                <span className="text-[10px] text-slate-400">Grows outward</span>
              </div>
              <span className="text-slate-500 font-bold">➔</span>
              <div className="bg-[#192233] p-2.5 rounded-xl border border-blue-500/30 text-center flex-1">
                <span className="text-white font-bold block">Full Tree</span>
                <span className="text-[10px] text-slate-300">Continuous span</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-[#222B3D] shadow-xl">
        <div className="p-4 bg-[#0E121B] border-b border-[#1E2536] flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Head-to-Head Specification Table
          </span>
          <span className="text-xs text-slate-500 font-mono">Both guarantee optimal MST</span>
        </div>

        <div className="divide-y divide-[#1D2436]">
          {criteria.map((item, idx) => (
            <div key={idx} className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center hover:bg-white/[0.02] transition-colors">
              <div className="md:col-span-3">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block font-bold">
                  {item.label}
                </span>
              </div>
              <div className="md:col-span-4 bg-[#111622] p-3 rounded-xl border border-[#FF6129]/20">
                <span className="text-[10px] font-mono text-[#FF8957] font-bold block mb-0.5">Kruskal</span>
                <p className="text-xs text-slate-200">{item.kruskal}</p>
              </div>
              <div className="md:col-span-1 text-center text-slate-600 font-bold hidden md:block">
                vs
              </div>
              <div className="md:col-span-4 bg-[#111622] p-3 rounded-xl border border-blue-500/20">
                <span className="text-[10px] font-mono text-blue-400 font-bold block mb-0.5">Prim</span>
                <p className="text-xs text-slate-200">{item.prim}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
