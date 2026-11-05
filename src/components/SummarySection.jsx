import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Cable,
  Zap,
  Droplet,
  Binary,
  CheckCircle2,
  Award,
  Sparkles,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { sounds } from '../utils/audio';

export default function SummarySection({ onRestartWalkthrough }) {
  const [checkedItems, setCheckedItems] = useState([true, true, true]);

  const toggleCheck = (idx) => {
    setCheckedItems(prev => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      sounds.step();
      return copy;
    });
  };

  const fireCelebration = () => {
    sounds.complete();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 }
    });
  };

  const applications = [
    {
      icon: Cable,
      title: 'Fiber Optic & Telecom Grids',
      tag: 'Global Infrastructure',
      tagColor: 'text-[#FF8957] bg-[#FF6129]/15 border-[#FF6129]/30',
      description: 'Laying transatlantic subsea cables and city-wide optical fiber backbones with zero loops and minimal wire spool distance.'
    },
    {
      icon: Zap,
      title: 'Electrical Power Distribution',
      tag: 'Energy Grids',
      tagColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
      description: 'Routing high-voltage transmission lines between generators and substations while preventing hazardous circular loop feedbacks.'
    },
    {
      icon: Droplet,
      title: 'Water & Gas Utility Pipelines',
      tag: 'Civil Engineering',
      tagColor: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
      description: 'Planning underground municipal piping networks to connect all residential districts with minimal trenching excavation costs.'
    },
    {
      icon: Binary,
      title: 'Image Segmentation & AI Clustering',
      tag: 'Data Science & Vision',
      tagColor: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
      description: 'Single-linkage hierarchical clustering: pixels are graph nodes, edge weights are color differences; removing heaviest edges segments objects.'
    }
  ];

  const takeaways = [
    {
      title: '1. The Greedy Strategy is Mathematically Proven',
      desc: 'Always picking the cheapest available edge does not trap you in a suboptimal dead end. The Cut Property guarantees that the minimum edge crossing any cut belongs to the MST.'
    },
    {
      title: '2. Disjoint Set Union (DSU) Makes Cycle Check Instant',
      desc: 'Rather than running slow depth-first search on every edge, DSU checks if both endpoints share the same set representative in virtually instantaneous O(α(V)) time.'
    },
    {
      title: '3. Stop Condition: Exactly (V - 1) Edges',
      desc: 'To connect V vertices with zero cycles, you need precisely V - 1 edges. Once you select the (V - 1)-th edge, stop immediately — all remaining candidate roads can be ignored!'
    }
  ];

  return (
    <section id="impact" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181E2B] border border-[#232D42] text-slate-300 text-xs font-semibold mb-3">
          <Award className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real-World Impact & Key Takeaways</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Where Kruskal Powers Modern Technology
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mt-2">
          From undersea internet cables to medical imaging, Minimum Spanning Trees are everywhere.
        </p>
      </div>

      {/* 4 Application Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
        {applications.map((app, idx) => {
          const Icon = app.icon;
          return (
            <div
              key={idx}
              className="glass-panel p-5 rounded-2xl border border-[#202738] hover:border-slate-600 hover:bg-[#131722] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-[#171D2B] text-slate-200">
                    <Icon className="w-5 h-5 text-[#FF6129]" />
                  </div>
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${app.tagColor}`}>
                    {app.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{app.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{app.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3-Point Takeaway Summary Checklist */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#222B3D] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#1E2536]">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF8957]">
              Final Classroom Review
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              3 Golden Takeaways for Your Exam / Tech Talk
            </h3>
          </div>

          <button
            onClick={fireCelebration}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            Celebrate MST Mastery!
          </button>
        </div>

        <div className="space-y-4">
          {takeaways.map((takeaway, idx) => {
            const isChecked = checkedItems[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                  isChecked
                    ? 'bg-[#101520] border-emerald-500/40'
                    : 'bg-[#0D1017] border-white/5 opacity-60'
                }`}
              >
                <div className={`p-1 rounded-full mt-0.5 shrink-0 ${isChecked ? 'text-emerald-400 bg-emerald-500/20' : 'text-slate-500 bg-white/5'}`}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{takeaway.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{takeaway.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="mt-8 pt-6 border-t border-[#1C2333] flex items-center justify-end">
          <button
            onClick={onRestartWalkthrough}
            className="px-4 py-2 rounded-xl bg-[#141A27] hover:bg-[#1C2336] text-slate-200 border border-[#242E44] text-xs font-bold flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#FF6129]" />
            Restart Walkthrough
          </button>
        </div>
      </div>
    </section>
  );
}
