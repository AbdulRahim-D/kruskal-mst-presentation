import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  X,
  Keyboard,
  Clock,
  Sun,
  Moon
} from 'lucide-react';
import HeroSection from './HeroSection';
import FoundationsSection from './FoundationsSection';
import WalkthroughSection from './WalkthroughSection';
import AudienceQuizSection from './AudienceQuizSection';
import DsuBubbleSection from './DsuBubbleSection';
import PlaygroundSection from './PlaygroundSection';
import ComparisonSection from './ComparisonSection';
import SummarySection from './SummarySection';
import { sounds } from '../utils/audio';

export default function SlideView({ onExitSlides, theme, toggleTheme }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);

  const slides = [
    {
      title: 'Problem & Metaphor',
      subtitle: 'Connecting 5 Isolated Houses with Fiber Optic Cables',
      timeGuide: '0:00 - 1:30',
      speakerPrompt: 'Hook the audience: "Imagine 5 rural families cut off from internet. Trenching cables costs thousands per mile. How do we connect everyone without wasting budget on redundant loops?"',
      component: <HeroSection onStartWalkthrough={() => setCurrentSlide(3)} />
    },
    {
      title: 'Concepts & Foundations',
      subtitle: 'Tree, Spanning Tree & Minimum Spanning Tree',
      timeGuide: '1:30 - 3:00',
      speakerPrompt: 'Define key terms clearly: A tree has V vertices and V - 1 edges with 0 loops. A Spanning Tree connects everything. An MST does so at minimum possible cost. Highlight the Greedy Choice!',
      component: <FoundationsSection />
    },
    {
      title: 'Cycle Detection in 10 Seconds',
      subtitle: 'The "Already Connected" Rule (Why Road A ↔ C is Discarded)',
      timeGuide: '3:00 - 4:30',
      speakerPrompt: 'Explain in 20 seconds: "Why did Kruskal reject road A ↔ C? Because House A can already reach House C through House B (A ➔ B ➔ C). Adding A ↔ C creates a closed triangle loop. If they can already reach each other, REJECT! If not, ACCEPT!"',
      component: <DsuBubbleSection />
    },
    {
      title: 'The Pre-Built 5-House Walkthrough',
      subtitle: 'Step-by-Step Greedy Selection and Cycle Detection',
      timeGuide: '4:30 - 7:00',
      speakerPrompt: 'Step through the 5-house village! Show edge (A, B) accepted at ₹1k, edge (B, C) at ₹2k, and draw attention to edge (A, C) at ₹3k being REJECTED because A, B, and C are already connected!',
      component: <WalkthroughSection />
    },
    {
      title: 'Custom Graph Playground',
      subtitle: 'Audience Participation & Arbitrary Topologies',
      timeGuide: '6:30 - 7:45',
      speakerPrompt: 'Invite the audience or students to suggest an edge: "What happens if we add a road between House A and House D?" Click Connect Road and run Kruskal live on their suggestion!',
      component: <PlaygroundSection />
    },
    {
      title: 'Kruskal vs. Prim',
      subtitle: 'Edge-Centric vs. Vertex-Centric Approaches',
      timeGuide: '7:45 - 8:30',
      speakerPrompt: 'Compare both giants: Kruskal grows a forest of disjoint trees; Prim grows a single tree outward like a crystal. Kruskal is fastest for sparse graphs (E ≈ V), Prim for dense graphs (E ≈ V²).',
      component: <ComparisonSection />
    },
    {
      title: 'Audience Challenge',
      subtitle: 'Live Interactive Pop Quiz: Test Your MST Instincts',
      timeGuide: '8:30 - 9:15',
      speakerPrompt: 'Engage the audience: "Show of hands: who votes for Option A? Who votes for Option B?" Click their consensus on screen, then hit Reveal Answer to show the confetti & technical breakdown!',
      component: <AudienceQuizSection />
    },
    {
      title: 'Real-World Applications & Takeaways',
      subtitle: 'From Telecom to Image Segmentation + 3 Golden Rules',
      timeGuide: '9:15 - 10:00',
      speakerPrompt: 'Wrap up with impact: Undersea internet cables, electrical grids, water lines, and machine learning clustering. Recap the 3 golden takeaways: Greedy wins, DSU detects cycles, stop at V - 1 edges!',
      component: <SummarySection onRestartWalkthrough={() => setCurrentSlide(3)} />
    }
  ];

  // Keyboard navigation: Left/Right arrows
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentSlide(prev => {
          if (prev < slides.length - 1) {
            sounds.step();
            return prev + 1;
          }
          return prev;
        });
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentSlide(prev => {
          if (prev > 0) {
            sounds.step();
            return prev - 1;
          }
          return prev;
        });
      } else if (e.key === 'Escape') {
        onExitSlides();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, onExitSlides]);

  const activeSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-[#07090D] flex flex-col justify-between">
      {/* Slide Top HUD */}
      <div className="w-full glass-panel border-b border-[#1E2536] px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-[#FF8957] bg-[#FF6129]/15 px-2.5 py-1 rounded-lg border border-[#FF6129]/30">
            Slide {currentSlide + 1} of {slides.length}
          </span>
          <h2 className="text-sm sm:text-base font-bold text-white hidden sm:block">
            {activeSlideData.title}
          </h2>
        </div>

        {/* Slide Progress Dots */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentSlide(idx);
                sounds.step();
              }}
              title={`Go to Slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx
                  ? 'w-7 bg-[#FF6129] shadow-sm shadow-[#FF6129]/50'
                  : 'w-2 bg-[#252E42] hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        {/* Right actions: Speaker notes & Exit */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              showSpeakerNotes
                ? 'bg-[#1E2638] text-[#FF8957] border-[#FF6129]/40'
                : 'bg-[#0E121B] text-slate-400 border-[#202738] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Speaker Talking Points</span>
            <span className="md:hidden">Notes</span>
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
            aria-label="Toggle theme"
            className="p-1.5 rounded-lg bg-[#0E121B] border border-[#202738] text-slate-400 hover:text-white transition-colors"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-indigo-500" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          <button
            onClick={onExitSlides}
            className="p-1.5 rounded-lg bg-[#0E121B] border border-[#202738] text-slate-400 hover:text-white transition-colors"
            title="Exit Slide Mode (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Speaker Notes Drawer (Optional toggle for classroom presenter) */}
      {showSpeakerNotes && (
        <div className="bg-[#101420] border-b border-[#252F44] px-6 py-3.5 flex items-start gap-4 text-xs sm:text-sm animate-fade-in">
          <div className="flex items-center gap-1.5 text-[#FF8957] font-mono font-bold shrink-0 mt-0.5">
            <Clock className="w-4 h-4" />
            <span>Target: {activeSlideData.timeGuide}</span>
          </div>
          <div className="text-slate-300 leading-relaxed">
            <strong className="text-white">Presenter Cue:</strong> {activeSlideData.speakerPrompt}
          </div>
        </div>
      )}

      {/* Main Slide Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-4">
        {activeSlideData.component}
      </main>

      {/* Slide Bottom Dock Navigation */}
      <div className="w-full glass-panel border-t border-[#1C2333] px-4 sm:px-6 py-3 flex items-center justify-between sticky bottom-0 z-40">
        <button
          onClick={() => {
            if (currentSlide > 0) {
              setCurrentSlide(currentSlide - 1);
              sounds.step();
            }
          }}
          disabled={currentSlide === 0}
          className="px-4 py-2 rounded-xl bg-[#141824] hover:bg-[#1A2030] disabled:opacity-30 disabled:hover:bg-[#141824] text-white text-xs font-bold border border-[#232C3E] flex items-center gap-2 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Slide</span>
        </button>

        {/* Keyboard Shortcut Hint */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-[#0B0E16] px-3 py-1.5 rounded-lg border border-white/5">
          <Keyboard className="w-3.5 h-3.5 text-[#FF6129]" />
          <span>Use <strong>←</strong> / <strong>→</strong> arrow keys to switch slides</span>
        </div>

        <button
          onClick={() => {
            if (currentSlide < slides.length - 1) {
              setCurrentSlide(currentSlide + 1);
              sounds.step();
            }
          }}
          disabled={currentSlide >= slides.length - 1}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF6129] to-[#FF8042] disabled:opacity-30 text-white text-xs font-bold shadow-lg shadow-[#FF6129]/25 flex items-center gap-2 transition-all"
        >
          <span>Next Slide</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
