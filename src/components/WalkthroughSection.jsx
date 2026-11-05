import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import GraphCanvas from './GraphCanvas';
import { DEFAULT_5_HOUSE_GRAPH } from '../data/graphPresets';
import { computeKruskalSteps } from '../utils/kruskal';
import { sounds } from '../utils/audio';

export default function WalkthroughSection() {
  const graphData = DEFAULT_5_HOUSE_GRAPH;
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 0.5x, 1x, 2x
  const timerRef = useRef(null);

  // Compute steps on initial mount
  useEffect(() => {
    const computed = computeKruskalSteps(graphData.nodes, graphData.edges);
    setSteps(computed);
    setCurrentStepIdx(0);
  }, []);

  const currentStep = steps[currentStepIdx] || {
    title: 'Loading...',
    explanation: 'Calculating step sequence...',
    phase: 'INITIAL',
    totalWeight: 0,
    edgesCount: 0,
    targetEdges: 4,
    acceptedEdges: [],
    rejectedEdges: [],
    pendingEdges: [],
    edgesSorted: [],
    dsuSnapshot: null,
    cycleNodes: []
  };

  // Play sound on step transition
  const triggerAudioFeedback = (step) => {
    if (!step) return;
    if (step.action === 'ACCEPT') {
      sounds.accept();
    } else if (step.action === 'REJECT') {
      sounds.reject();
    } else if (step.action === 'FINISHED') {
      sounds.complete();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      sounds.step();
    }
  };

  // Auto-play interval
  useEffect(() => {
    if (isPlaying) {
      const delay = 1800 / speed;
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev < steps.length - 1) {
            const nextIdx = prev + 1;
            triggerAudioFeedback(steps[nextIdx]);
            return nextIdx;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, delay);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, steps]);

  const handleNext = () => {
    if (currentStepIdx < steps.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      triggerAudioFeedback(steps[nextIdx]);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      const prevIdx = currentStepIdx - 1;
      setCurrentStepIdx(prevIdx);
      sounds.step();
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
    sounds.step();
  };

  const handlePlayToggle = () => {
    if (currentStepIdx >= steps.length - 1) {
      // If at end, restart from step 0
      setCurrentStepIdx(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section id="walkthrough" className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181D2B] border border-[#232D42] text-slate-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6129]" />
            <span>Interactive 5-House Village Walkthrough</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Watch Kruskal's Greedy Logic Step-by-Step
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Follow the roads from lowest cost to highest. See cycle detection in action!
          </p>
        </div>

        {/* Live HUD Counters */}
        <div className="flex items-center gap-3 bg-[#0F131D] p-2.5 rounded-2xl border border-[#21293B]">
          <div className="px-3 py-1 text-center border-r border-[#1C2333]">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Cost</span>
            <span className="text-base sm:text-lg font-bold font-heading text-emerald-400">
              ₹{currentStep.totalWeight}k
            </span>
          </div>
          <div className="px-3 py-1 text-center border-r border-[#1C2333]">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Edges Picked</span>
            <span className="text-base sm:text-lg font-bold font-heading text-white">
              {currentStep.edgesCount} <span className="text-xs text-slate-400">/ {currentStep.targetEdges}</span>
            </span>
          </div>
          <div className="px-3 py-1 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Cycles Blocked</span>
            <span className="text-base sm:text-lg font-bold font-heading text-red-400">
              {currentStep.rejectedEdges.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: Graph + Explanation Dock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Canvas + Playback Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            <GraphCanvas
              nodes={graphData.nodes}
              edges={graphData.edges}
              currentEdge={currentStep.currentEdge}
              acceptedEdges={currentStep.acceptedEdges}
              rejectedEdges={currentStep.rejectedEdges}
              dsuSnapshot={currentStep.dsuSnapshot}
              cycleNodes={currentStep.cycleNodes}
              width={700}
              height={440}
            />

            {/* Quick legend overlay */}
            <div className="absolute bottom-3 left-3 bg-[#0A0C12]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500" /> Accepted
              </span>
              <span className="flex items-center gap-1.5 text-[#FF8957]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6129] animate-pulse" /> Examining
              </span>
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Cycle Rejected
              </span>
            </div>
          </div>

          {/* Playback Control Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-[#21293B] flex flex-wrap items-center justify-between gap-4">
            {/* Step navigation buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                title="Reset to Step 0"
                className="p-2.5 rounded-xl bg-[#141824] hover:bg-[#1A2030] text-slate-300 hover:text-white border border-[#222B3D] transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handlePrev}
                disabled={currentStepIdx === 0}
                title="Previous Step"
                className="p-2.5 rounded-xl bg-[#141824] hover:bg-[#1A2030] disabled:opacity-40 disabled:hover:bg-[#141824] text-slate-300 hover:text-white border border-[#222B3D] transition-all"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={handlePlayToggle}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
                  isPlaying
                    ? 'bg-amber-500 text-slate-950 shadow-amber-500/25'
                    : 'bg-[#FF6129] hover:bg-[#FF7340] text-white shadow-[#FF6129]/30'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause' : currentStepIdx >= steps.length - 1 ? 'Replay' : 'Auto-Play'}</span>
              </button>
              <button
                onClick={handleNext}
                disabled={currentStepIdx >= steps.length - 1}
                title="Next Step"
                className="p-2.5 rounded-xl bg-[#141824] hover:bg-[#1A2030] disabled:opacity-40 disabled:hover:bg-[#141824] text-slate-300 hover:text-white border border-[#222B3D] transition-all"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Step progress & speed */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Progress</span>
                <span className="text-xs font-mono font-bold text-slate-200">
                  Step {currentStepIdx} of {steps.length - 1}
                </span>
              </div>

              {/* Speed toggle pills */}
              <div className="flex bg-[#0E1119] p-1 rounded-xl border border-[#202838] text-[11px] font-mono font-semibold">
                {[0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-2 py-1 rounded-lg transition-colors ${
                      speed === s ? 'bg-[#1E2638] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Step Status & Edge Ledger Table (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Step Narrative Card */}
          <div className="glass-panel p-5 rounded-2xl border border-[#222A3B] shadow-xl relative overflow-hidden">
            {/* Top step badge */}
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                currentStep.action === 'ACCEPT'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : currentStep.action === 'REJECT'
                  ? 'bg-red-500/15 text-red-300 border-red-500/30 animate-shake'
                  : currentStep.action === 'CHECK_CYCLE'
                  ? 'bg-[#FF6129]/15 text-[#FF8957] border-[#FF6129]/30'
                  : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
              }`}>
                {currentStep.action === 'ACCEPT' && '✓ Road Accepted'}
                {currentStep.action === 'REJECT' && '✗ Cycle Discarded'}
                {currentStep.action === 'CHECK_CYCLE' && '⚡ Inspecting Cable'}
                {currentStep.action === 'SORT_EDGES' && '☰ Greedy Edge Sort'}
                {currentStep.action === 'OBSERVE' && '● Village Inspection'}
                {currentStep.action === 'FINISHED' && '★ MST Finalized!'}
              </span>

              <span className="text-xs font-mono text-slate-400">
                Phase {currentStep.phase}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 leading-snug">
              {currentStep.title}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed bg-[#0E121B] p-3.5 rounded-xl border border-[#1C2333]">
              {currentStep.explanation}
            </p>

            {/* Cycle alert highlight if rejected */}
            {currentStep.action === 'REJECT' && (
              <div className="mt-3 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Why was this road rejected?</strong> Because both endpoints already belong to the same connected network! Connecting them creates redundant loop and wastes budget.
                </span>
              </div>
            )}

            {/* Stop condition reached badge */}
            {currentStep.edgesCount === currentStep.targetEdges && currentStep.phase !== 'INITIAL' && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Stop Condition Met:</strong> Exactly {currentStep.targetEdges} roads selected for {graphData.nodes.length} houses (V - 1 rule). All remaining roads are automatically skipped!
                </span>
              </div>
            )}
          </div>

          {/* Sorted Edge Ledger Table */}
          <div className="glass-panel p-4 rounded-2xl border border-[#21293B]">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1E2536]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Sorted Cable Ledger (Ascending Cost)
              </span>
              <span className="text-[11px] text-slate-400">
                {currentStep.edgesSorted?.length || 0} candidate roads
              </span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {(currentStep.edgesSorted || []).map((edge, idx) => {
                const isAccepted = currentStep.acceptedEdges.includes(edge.id);
                const isRejected = currentStep.rejectedEdges.includes(edge.id);
                const isCurrent = currentStep.currentEdge?.id === edge.id;

                let rowBg = 'bg-[#0E121B] border-transparent';
                let statusBadge = (
                  <span className="text-[10px] font-mono text-slate-500 px-2 py-0.5 rounded bg-white/5">
                    Pending
                  </span>
                );

                if (isAccepted) {
                  rowBg = 'bg-emerald-950/30 border-emerald-500/30';
                  statusBadge = (
                    <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      ✓ Accepted
                    </span>
                  );
                } else if (isRejected) {
                  rowBg = 'bg-red-950/20 border-red-500/20 line-through opacity-70';
                  statusBadge = (
                    <span className="text-[10px] font-mono font-bold text-red-400 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 no-underline">
                      ✗ Rejected
                    </span>
                  );
                } else if (isCurrent) {
                  rowBg = 'bg-[#FF6129]/15 border-[#FF6129]/50 shadow-sm shadow-[#FF6129]/20';
                  statusBadge = (
                    <span className="text-[10px] font-mono font-bold text-[#FF8957] px-2 py-0.5 rounded bg-[#FF6129]/20 border border-[#FF6129]/40 animate-pulse">
                      ● Examining
                    </span>
                  );
                }

                return (
                  <div
                    key={edge.id}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-all ${rowBg}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-500 text-[10px] w-4">{idx + 1}.</span>
                      <span className="font-bold text-white">
                        {edge.from} ↔ {edge.to}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold text-slate-300">
                        ₹{edge.weight}k
                      </span>
                      {statusBadge}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
