import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FoundationsSection from './components/FoundationsSection';
import WalkthroughSection from './components/WalkthroughSection';
import AudienceQuizSection from './components/AudienceQuizSection';
import DsuBubbleSection from './components/DsuBubbleSection';
import PlaygroundSection from './components/PlaygroundSection';
import ComparisonSection from './components/ComparisonSection';
import SummarySection from './components/SummarySection';
import SlideView from './components/SlideView';
import { Network } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' | 'slides'
  const [activeSection, setActiveSection] = useState('problem');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Apply theme class to document element and persist
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Smooth scroll spy for dashboard mode
  useEffect(() => {
    if (viewMode !== 'dashboard') return;

    const sections = ['problem', 'foundations', 'dsu-bubbles', 'walkthrough', 'playground', 'comparison', 'quiz', 'impact'];
    const handleScroll = () => {
      const scrollY = window.scrollY + 120;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [viewMode]);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (viewMode === 'slides') {
    return (
      <SlideView
        onExitSlides={() => setViewMode('dashboard')}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#E2E8F0] selection:bg-[#FF6129]/30 selection:text-white flex flex-col justify-between">
      {/* Top Navigation Bar with Talk Timer & Mode Switcher */}
      <Navbar
        activeSection={activeSection}
        setActiveSection={scrollToSection}
        viewMode={viewMode}
        setViewMode={setViewMode}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Sections (Dashboard Mode) */}
      <main className="flex-1 w-full space-y-4">
        {/* 1. Hero & Real-World Metaphor (5 Houses & Fiber Optic Cable Problem) */}
        <HeroSection onStartWalkthrough={() => scrollToSection('walkthrough')} />

        {/* 2. Concepts & Foundations (Tree, Spanning Tree, MST & Greedy Strategy) */}
        <FoundationsSection />

        {/* 3. Cycle Detection: The Already-Connected Rule */}
        <DsuBubbleSection />

        {/* 4. Pre-built 5-House Interactive Walkthrough */}
        <WalkthroughSection />

        {/* 5. Custom / User-Defined Graph Playground */}
        <PlaygroundSection />

        {/* 6. Kruskal vs Prim High-Level Comparison */}
        <ComparisonSection />

        {/* 7. Live Audience Challenge & Pop Quiz */}
        <AudienceQuizSection />

        {/* 8. Real-Life Applications & 3-Point Takeaway Summary */}
        <SummarySection onRestartWalkthrough={() => scrollToSection('walkthrough')} />
      </main>

      {/* Presentation Footer */}
      <footer className="w-full border-t border-[#1C2333] bg-[#07090D] py-8 px-4 sm:px-6 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#FF6129]/20 flex items-center justify-center text-[#FF6129]">
              <Network className="w-3.5 h-3.5" />
            </div>
            <span className="font-heading font-bold text-slate-300">
              Kruskal's Algorithm: Minimum Spanning Tree
            </span>
            <span className="text-slate-600">•</span>
            <span>10-Minute Classroom Masterclass</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Built with React + Tailwind CSS + Lucide Icons</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
