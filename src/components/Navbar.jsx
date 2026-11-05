import React, { useState, useEffect } from 'react';
import {
  Network,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Presentation,
  LayoutDashboard,
  Timer,
  Sun,
  Moon
} from 'lucide-react';
import { sounds } from '../utils/audio';

export default function Navbar({
  activeSection,
  setActiveSection,
  viewMode,
  setViewMode,
  currentSlide,
  setCurrentSlide,
  totalSlides,
  theme,
  toggleTheme
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // 10-Minute Talk Timer (600 seconds)
  const [timerSeconds, setTimerSeconds] = useState(600);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => Math.max(0, prev - 1));
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const toggleTimer = () => setTimerRunning(!timerRunning);
  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(600);
  };

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const toggleSound = () => {
    sounds.enabled = isMuted;
    setIsMuted(!isMuted);
    if (isMuted) {
      sounds.step();
    }
  };

  const navItems = [
    { id: 'problem', label: '1. Problem' },
    { id: 'foundations', label: '2. Foundations' },
    { id: 'dsu-bubbles', label: '3. Cycle Detection' },
    { id: 'walkthrough', label: '4. Walkthrough' },
    { id: 'playground', label: '5. Playground' },
    { id: 'comparison', label: '6. Kruskal vs Prim' },
    { id: 'quiz', label: '7. Audience Challenge' },
    { id: 'impact', label: '8. Real-Life Impact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-[#202738]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Logo and Presentation Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6129] to-[#FF8957] flex items-center justify-center shadow-lg shadow-[#FF6129]/20">
            <Network className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-base sm:text-lg text-white tracking-tight">
                Kruskal's Algorithm
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF6129]/15 text-[#FF6129] border border-[#FF6129]/30">
                MST Masterclass
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Minimum Spanning Tree & Cycle Detection
            </p>
          </div>
        </div>

        {/* Center: Talk Mode Toggle */}
        <div className="flex items-center gap-2 bg-[#0E1119] p-1 rounded-xl border border-[#222938]">
          <button
            onClick={() => setViewMode('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'dashboard'
                ? 'bg-[#1E2536] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#FF6129]" />
            <span className="hidden md:inline">Dashboard Mode</span>
            <span className="md:hidden">Scroll</span>
          </button>
          <button
            onClick={() => setViewMode('slides')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'slides'
                ? 'bg-[#FF6129] text-white shadow-md shadow-[#FF6129]/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span className="hidden md:inline">10-Min Talk Slides</span>
            <span className="md:hidden">Slides</span>
          </button>
        </div>

        {/* Right: Speaker Utilities (Timer, Audio, Fullscreen) */}
        <div className="flex items-center gap-2">
          {/* 10-Minute Talk Timer */}
          <div className="flex items-center gap-1.5 bg-[#0D1018] px-2.5 py-1 rounded-lg border border-[#22293A]">
            <Timer className={`w-3.5 h-3.5 ${timerSeconds < 120 ? 'text-red-400 animate-pulse' : 'text-[#10B981]'}`} />
            <span className={`font-mono text-xs font-bold ${timerSeconds < 120 ? 'text-red-400' : 'text-slate-200'}`}>
              {formatTimer(timerSeconds)}
            </span>
            <button
              onClick={toggleTimer}
              title={timerRunning ? "Pause Talk Timer" : "Start 10-min Talk Timer"}
              className="p-1 text-slate-400 hover:text-white transition-colors"
            >
              {timerRunning ? <Pause className="w-3 h-3 text-[#FF6129]" /> : <Play className="w-3 h-3 text-emerald-400" />}
            </button>
            <button
              onClick={resetTimer}
              title="Reset Timer to 10:00"
              className="p-1 text-slate-500 hover:text-slate-300"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? "Unmute Sound FX" : "Mute Sound FX"}
            className="p-2 rounded-lg bg-[#0E1119] border border-[#202738] text-slate-400 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
            aria-label="Toggle theme"
            className="p-2 rounded-lg bg-[#0E1119] border border-[#202738] text-slate-400 hover:text-white transition-colors"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-indigo-500" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Classroom Fullscreen"
            className="p-2 rounded-lg bg-[#0E1119] border border-[#202738] text-slate-400 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-[#FF6129]" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Sub-navigation bar in Dashboard mode */}
      {viewMode === 'dashboard' && (
        <div className="border-t border-[#1C2230] bg-[#0A0D14]/90 overflow-x-auto py-1 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  const el = document.getElementById(item.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  activeSection === item.id
                    ? 'bg-[#FF6129]/20 text-[#FF8957] border border-[#FF6129]/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
