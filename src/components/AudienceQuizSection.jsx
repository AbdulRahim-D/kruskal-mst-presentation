import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Lightbulb,
  Eye,
  Award
} from 'lucide-react';
import { sounds } from '../utils/audio';

export default function AudienceQuizSection() {
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const questions = [
    {
      id: 'cycle-trap',
      badge: 'Challenge 1 • The Cycle Trap Test',
      scenario: 'House A is connected to House B (Cost ₹1k), and House B is connected to House C (Cost ₹2k). Kruskal now encounters Road (A ↔ C) at Cost ₹1k (the cheapest remaining edge in the village!).',
      question: 'What must Kruskal\'s Algorithm do with Road (A ↔ C)?',
      visualHint: 'Path A ➔ B ➔ C is already installed and fully operational.',
      options: [
        {
          id: 'A',
          text: 'ACCEPT it immediately because ₹1k is the cheapest road available.',
          explanation: 'Tempting Greedy Trap! While Kruskal greedily inspects cheap edges first, cycle safety ALWAYS overrides cheapness. A cheap cycle is still a redundant cycle.',
          isCorrect: false
        },
        {
          id: 'B',
          text: 'REJECT it immediately because A and C can already reach each other!',
          explanation: 'Correct! House A can already reach House C via House B (A ➔ B ➔ C). Adding Road A ↔ C would form a redundant triangle loop (A-B-C-A), blowing budget on zero new connectivity.',
          isCorrect: true
        },
        {
          id: 'C',
          text: 'Delete Road (B ↔ C) and swap it with Road (A ↔ C).',
          explanation: 'Kruskal is a greedy forward algorithm. It never undoes or swaps previously finalized tree edges.',
          isCorrect: false
        },
        {
          id: 'D',
          text: 'Accept it only if all 5 village families vote in favor.',
          explanation: 'Algorithms follow mathematical invariants, not voting booths! Cycle detection via DSU is absolute.',
          isCorrect: false
        }
      ],
      verdictTitle: 'The Verdict: Instant REJECTION!',
      takeaway: 'Rule of Thumb: In Kruskal\'s algorithm, Cycle Prevention ALWAYS beats cheap edge cost. If Find(A) === Find(C), reject immediately!'
    },
    {
      id: 'invariant-math',
      badge: 'Challenge 2 • The Tree Invariant Math',
      scenario: 'A state telecommunications team must connect 6 rural towns with fiber optic cables. There are 15 possible routes surveyed across the valleys.',
      question: 'How many total cables will Kruskal\'s Minimum Spanning Tree select to complete the network?',
      visualHint: 'Every tree with V vertices has a fixed, unbending edge count.',
      options: [
        {
          id: 'A',
          text: '6 cables (exactly one cable per town)',
          explanation: 'A connected graph with 6 vertices and 6 edges MUST contain at least one closed circular cycle. Not an MST!',
          isCorrect: false
        },
        {
          id: 'B',
          text: '5 cables (The strict V - 1 Tree Invariant)',
          explanation: 'Spot on! Any valid tree connecting V vertices contains exactly V - 1 edges. For 6 towns: 6 - 1 = 5 cables. Zero loops, 100% connectivity.',
          isCorrect: true
        },
        {
          id: 'C',
          text: '15 cables (all surveyed valley routes)',
          explanation: 'Connecting all 15 routes creates massive redundant meshes and blows the infrastructure budget.',
          isCorrect: false
        },
        {
          id: 'D',
          text: 'It depends on the individual cable prices',
          explanation: 'Edge costs determine WHICH edges are picked, but the COUNT of edges is always mathematically fixed at exactly V - 1.',
          isCorrect: false
        }
      ],
      verdictTitle: 'The Verdict: Exactly 5 Cables (V - 1 Rule)',
      takeaway: 'Mathematical Invariant: A tree connecting V vertices ALWAYS has exactly V - 1 edges. Not 4 (disconnected), not 6 (has a cycle), exactly 5!'
    }
  ];

  const currentQ = questions[activeQuestionIdx];

  const handleSelectOption = (optId) => {
    setSelectedOption(optId);
    sounds.step();
  };

  const handleReveal = () => {
    setIsRevealed(true);
    const correctOpt = currentQ.options.find(o => o.isCorrect);
    if (selectedOption === correctOpt.id) {
      sounds.accept();
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });
    } else {
      sounds.step();
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsRevealed(false);
    sounds.step();
  };

  const handleSwitchQuestion = (idx) => {
    setActiveQuestionIdx(idx);
    setSelectedOption(null);
    setIsRevealed(false);
    sounds.step();
  };

  return (
    <section id="quiz" className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181E2B] border border-[#232D42] text-slate-300 text-xs font-semibold mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-[#FF6129]" />
          <span>Audience Interactive Participation</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Live Audience Challenge: Test Your MST Instincts
        </h2>

        {/* Question Selector Tabs */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => handleSwitchQuestion(idx)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                activeQuestionIdx === idx
                  ? 'bg-[#FF6129] text-white border-[#FF6129] shadow-md shadow-[#FF6129]/25'
                  : 'bg-[#121622] text-slate-400 border-[#202838] hover:text-white'
              }`}
            >
              Question {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Quiz Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#222A3B] shadow-2xl relative overflow-hidden">
        {/* Scenario Callout Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0D121C] border border-[#202738] mb-6">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF8957] bg-[#FF6129]/15 px-3 py-1 rounded-full border border-[#FF6129]/30">
              {currentQ.badge}
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              {currentQ.visualHint}
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium mb-3">
            <strong className="text-white">Scenario:</strong> {currentQ.scenario}
          </p>

          <h3 className="text-base sm:text-lg font-heading font-extrabold text-white flex items-center gap-2 pt-2 border-t border-[#1C2333]">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />
            {currentQ.question}
          </h3>
        </div>

        {/* 4 Clickable Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            let cardStyle = 'bg-[#0E121B] border-[#202738] hover:border-slate-500';
            let badgeStyle = 'bg-[#181E2B] text-slate-300 border-[#252F45]';

            if (isRevealed) {
              if (opt.isCorrect) {
                cardStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-100 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/40';
                badgeStyle = 'bg-emerald-500 text-white border-emerald-400 font-bold';
              } else if (isSelected) {
                cardStyle = 'bg-red-500/15 border-red-500 text-red-200 ring-2 ring-red-500/40';
                badgeStyle = 'bg-red-500 text-white border-red-400 font-bold';
              } else {
                cardStyle = 'bg-[#0A0D14] border-[#181E2B] opacity-40';
              }
            } else if (isSelected) {
              cardStyle = 'bg-[#FF6129]/15 border-[#FF6129] shadow-md shadow-[#FF6129]/20 ring-2 ring-[#FF6129]/30';
              badgeStyle = 'bg-[#FF6129] text-white border-[#FF6129] font-bold';
            }

            return (
              <div
                key={opt.id}
                onClick={() => !isRevealed && handleSelectOption(opt.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${cardStyle}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs border ${badgeStyle}`}>
                        {opt.id}
                      </span>
                      {isSelected && !isRevealed && (
                        <span className="text-[11px] font-mono text-[#FF8957] font-semibold bg-[#FF6129]/15 px-2 py-0.5 rounded border border-[#FF6129]/30">
                          Audience Vote
                        </span>
                      )}
                    </div>

                    {isRevealed && opt.isCorrect && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 font-mono bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct Answer
                      </span>
                    )}

                    {isRevealed && !opt.isCorrect && isSelected && (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-400 font-mono bg-red-500/20 px-2.5 py-0.5 rounded-full border border-red-500/40">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-white leading-relaxed">
                    {opt.text}
                  </p>
                </div>

                {isRevealed && (
                  <p className="mt-3 pt-3 border-t border-white/10 text-xs text-slate-300 leading-relaxed">
                    {opt.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Dock: Reveal & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#1F2638]">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            {selectedOption ? (
              <span>Audience selected: <strong>Option {selectedOption}</strong></span>
            ) : (
              <span>Click an option to mark the audience vote</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isRevealed ? (
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-[#141824] hover:bg-[#1A2030] text-slate-300 hover:text-white border border-[#222B3D] text-xs font-bold flex items-center gap-2 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset & Try Again
              </button>
            ) : (
              <button
                onClick={handleReveal}
                disabled={!selectedOption}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6129] to-[#FF8042] disabled:opacity-30 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#FF6129]/25 hover:shadow-[#FF6129]/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Eye className="w-4 h-4" />
                Reveal Answer to Audience
              </button>
            )}
          </div>
        </div>

        {/* Detailed Breakdown Box upon Reveal */}
        {isRevealed && (
          <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[#121824] to-emerald-500/10 border border-emerald-500/30 animate-fade-in">
            <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm mb-2">
              <Award className="w-5 h-5" />
              {currentQ.verdictTitle}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentQ.takeaway}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
