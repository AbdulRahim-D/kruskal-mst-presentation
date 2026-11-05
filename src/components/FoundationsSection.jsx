import React, { useState } from 'react';
import {
  GitFork,
  Share2,
  Minimize,
  Sliders,
  CheckCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

export default function FoundationsSection() {
  const [selectedConcept, setSelectedConcept] = useState('tree'); // 'tree' | 'spanning' | 'mst'

  const concepts = [
    {
      id: 'tree',
      icon: GitFork,
      title: '1. What is a Tree?',
      badge: 'Graph Foundation',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      short: 'A connected graph with zero cycles or loops.',
      details: [
        'Connected: There is always a way to travel between any two nodes.',
        'Acyclic: No path loops back to where it started.',
        'Unique Paths: Exactly one simple path exists between any pair of vertices.',
        'If a graph has V vertices and is a tree, it MUST have exactly V - 1 edges!'
      ],
      svgFormula: 'Edges = V - 1 & Loops = 0'
    },
    {
      id: 'spanning',
      icon: Share2,
      title: '2. Spanning Tree',
      badge: 'Sub-Graph Definition',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      short: 'A tree that touches and connects EVERY vertex in the original graph.',
      details: [
        'Spans all vertices: Not a single house or node is left disconnected.',
        'Uses only essential roads: We remove redundant loops while keeping every house connected.',
        'Zero redundancy: Any single edge removal disconnects the graph into two pieces.',
        'A single graph can have dozens or hundreds of different spanning trees!'
      ],
      svgFormula: 'All V Vertices Included'
    },
    {
      id: 'mst',
      icon: Minimize,
      title: '3. Minimum Spanning Tree (MST)',
      badge: 'The Holy Grail',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      short: 'The specific spanning tree that has the absolute lowest total edge weight.',
      details: [
        'Weight summation: Sum of all selected cable costs is mathematically minimized.',
        'Not always unique: If multiple edges share equal weights, multiple MSTs may exist.',
        'Essential for engineering: Zero wasted materials, zero redundant power loss.',
        'This is what Kruskal\'s Algorithm is designed to calculate!'
      ],
      svgFormula: 'Minimize: Σ Weight(e)'
    }
  ];

  const current = concepts.find(c => c.id === selectedConcept);

  return (
    <section id="foundations" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161B27] border border-[#222A3C] text-slate-300 text-xs font-semibold mb-4">
          <Lightbulb className="w-3.5 h-3.5 text-[#FF6129]" />
          <span>Core Mathematical Concepts</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Tree, Spanning Tree & The Greedy Choice
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mt-2">
          Before running an algorithm, understand the three building blocks that define a Minimum Spanning Tree.
        </p>
      </div>

      {/* 3 Interactive Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {concepts.map((concept) => {
          const Icon = concept.icon;
          const isSelected = selectedConcept === concept.id;

          return (
            <div
              key={concept.id}
              onClick={() => setSelectedConcept(concept.id)}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 relative border flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#151926] border-[#FF6129] shadow-xl shadow-[#FF6129]/10 translate-y-[-2px]'
                  : 'bg-[#10141E] border-[#1E2638] hover:border-slate-600 hover:bg-[#131722]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${isSelected ? 'bg-[#FF6129] text-white shadow-md shadow-[#FF6129]/30' : 'bg-[#192130] text-slate-300'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${concept.badgeColor}`}>
                    {concept.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {concept.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {concept.short}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1F2738] flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 font-bold">{concept.svgFormula}</span>
                <span className={`font-semibold flex items-center gap-1 ${isSelected ? 'text-[#FF8957]' : 'text-slate-500'}`}>
                  {isSelected ? 'Viewing' : 'Explore'} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Selected Concept Deep-Dive Panel */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-[#232B3C] mb-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#FF6129] font-bold">
                In-Depth Breakdown
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <span className="text-xs text-slate-400 font-medium">{current.title}</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Why this definition matters for Kruskal:
            </h4>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 font-mono text-xs text-emerald-400 font-bold">
            Invariant: Exactly (V - 1) edges required
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {current.details.map((detail, idx) => (
            <div key={idx} className="bg-[#0C1019] p-4 rounded-xl border border-[#1C2436] flex items-start gap-3">
              <div className="p-1 rounded-full bg-[#10B981]/20 text-[#10B981] mt-0.5 shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* The Greedy Strategy Visual Explainer */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#273247] shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-[#FF6129]/20 text-[#FF6129] border border-[#FF6129]/30">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#FF8957] font-bold">
              The Engine of Kruskal
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              The "Greedy" Choice: Local Minimum to Global Optimum
            </h3>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          A greedy algorithm always takes the decision that looks best right now without reconsidering past decisions.
          Kruskal asks one simple question for each road:
        </p>

        {/* 3 Step Greedy Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-[#0C0F17] p-4 rounded-xl border border-[#1D2536] relative">
            <div className="w-6 h-6 rounded-full bg-[#FF6129] text-white font-mono text-xs font-bold flex items-center justify-center mb-2">
              1
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Sort All Roads</h4>
            <p className="text-xs text-slate-400">
              Line up every candidate cable from lowest cost to highest cost. Cheap first!
            </p>
          </div>

          <div className="bg-[#0C0F17] p-4 rounded-xl border border-[#1D2536] relative">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-mono text-xs font-bold flex items-center justify-center mb-2">
              2
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Check for Loops</h4>
            <p className="text-xs text-slate-400">
              If the road connects two disconnected groups, <span className="text-emerald-400 font-semibold">ACCEPT</span> it!
            </p>
          </div>

          <div className="bg-[#0C0F17] p-4 rounded-xl border border-[#1D2536] relative">
            <div className="w-6 h-6 rounded-full bg-red-500 text-white font-mono text-xs font-bold flex items-center justify-center mb-2">
              3
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Discard Redundant</h4>
            <p className="text-xs text-slate-400">
              If both ends already share a connection, <span className="text-red-400 font-semibold">REJECT</span> it to prevent a loop!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
