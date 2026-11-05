import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Plus,
  Trash2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  AlertTriangle,
  Wrench,
  X
} from 'lucide-react';
import GraphCanvas from './GraphCanvas';
import { PRESET_GRAPHS } from '../data/graphPresets';
import { computeKruskalSteps } from '../utils/kruskal';
import { sounds } from '../utils/audio';

export default function PlaygroundSection() {
  // Graph structure state
  const [nodes, setNodes] = useState(PRESET_GRAPHS[0].nodes);
  const [edges, setEdges] = useState(PRESET_GRAPHS[0].edges);
  const [selectedPreset, setSelectedPreset] = useState(PRESET_GRAPHS[0].id);

  // Interaction mode: 'select' | 'add-node' | 'add-edge'
  const [interactionMode, setInteractionMode] = useState('select');
  const [edgeSourceNode, setEdgeSourceNode] = useState(null);
  const [customWeight, setCustomWeight] = useState(3);

  // Algorithm Execution State
  const [isAlgorithmMode, setIsAlgorithmMode] = useState(false);
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [validationWarning, setValidationWarning] = useState(null);
  const timerRef = useRef(null);

  // Update steps whenever nodes/edges change or when running
  const runAlgorithm = () => {
    if (nodes.length < 2) {
      setValidationWarning('Add at least 2 houses to find a Minimum Spanning Tree.');
      return;
    }
    if (edges.length === 0) {
      setValidationWarning('Add roads between houses before running Kruskal\'s Algorithm.');
      return;
    }

    const computed = computeKruskalSteps(nodes, edges);
    setSteps(computed);
    setCurrentStepIdx(0);
    setIsAlgorithmMode(true);
    setValidationWarning(null);
    sounds.step();
  };

  const exitAlgorithmMode = () => {
    setIsAlgorithmMode(false);
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Node Dragging
  const handleNodeDrag = (nodeId, newX, newY) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, x: newX, y: newY } : n));
  };

  // Node Click handler
  const handleNodeClick = (node) => {
    if (isAlgorithmMode) return;

    if (interactionMode === 'add-edge') {
      if (!edgeSourceNode) {
        setEdgeSourceNode(node.id);
        sounds.step();
      } else if (edgeSourceNode === node.id) {
        setEdgeSourceNode(null);
      } else {
        // Create edge from edgeSourceNode to node.id
        const existing = edges.find(
          e => (e.from === edgeSourceNode && e.to === node.id) || (e.from === node.id && e.to === edgeSourceNode)
        );

        if (!existing) {
          const newEdge = {
            id: `e-${edgeSourceNode}${node.id}-${Date.now()}`,
            from: edgeSourceNode,
            to: node.id,
            weight: Number(customWeight) || 1,
            label: `₹${customWeight}k`
          };
          setEdges(prev => [...prev, newEdge]);
          sounds.accept();
        }
        setEdgeSourceNode(null);
      }
    }
  };

  // Canvas Click to add node
  const handleAddNode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const existingIds = new Set(nodes.map(n => n.id));
    let nextLetter = 'A';
    for (let char of letters) {
      if (!existingIds.has(char)) {
        nextLetter = char;
        break;
      }
    }
    if (!nextLetter) nextLetter = `N${nodes.length + 1}`;

    const newNode = {
      id: nextLetter,
      label: `House ${nextLetter}`,
      subtitle: `Site ${nextLetter}`,
      x: 100 + Math.floor(Math.random() * 500),
      y: 80 + Math.floor(Math.random() * 280),
      icon: 'home'
    };

    setNodes(prev => [...prev, newNode]);
    sounds.step();
  };

  // Delete node and its incident edges
  const handleDeleteNode = (nodeId) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setEdges(prev => prev.filter(e => e.from !== nodeId && e.to !== nodeId));
    if (edgeSourceNode === nodeId) setEdgeSourceNode(null);
    sounds.step();
  };

  // Clear canvas
  const handleClear = () => {
    setNodes([]);
    setEdges([]);
    exitAlgorithmMode();
    sounds.step();
  };

  // Load Preset
  const handleLoadPreset = (presetId) => {
    const preset = PRESET_GRAPHS.find(p => p.id === presetId);
    if (preset) {
      setSelectedPreset(preset.id);
      setNodes(preset.nodes);
      setEdges(preset.edges);
      exitAlgorithmMode();
      setValidationWarning(null);
      sounds.step();
    }
  };

  // Step Controls during Algorithm Mode
  const currentStep = steps[currentStepIdx] || {
    title: '',
    explanation: '',
    action: 'OBSERVE',
    totalWeight: 0,
    edgesCount: 0,
    targetEdges: Math.max(0, nodes.length - 1),
    acceptedEdges: [],
    rejectedEdges: [],
    dsuSnapshot: null,
    cycleNodes: []
  };

  const handleNextStep = () => {
    if (currentStepIdx < steps.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      if (steps[nextIdx].action === 'ACCEPT') sounds.accept();
      else if (steps[nextIdx].action === 'REJECT') sounds.reject();
      else if (steps[nextIdx].action === 'FINISHED') {
        sounds.complete();
        confetti({ particleCount: 60, spread: 60 });
      } else sounds.step();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
      sounds.step();
    }
  };

  // Auto-play interval in playground
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1400);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length]);

  return (
    <section id="playground" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181E2B] border border-[#232D42] text-slate-300 text-xs font-semibold mb-2">
            <Wrench className="w-3.5 h-3.5 text-[#FF6129]" />
            <span>Interactive Sandbox & Live Graph Builder</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Custom Graph Playground
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build your own network topologies: add nodes, drag coordinates, set road costs, and test Kruskal live!
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 bg-[#0E121B] p-1.5 rounded-2xl border border-[#212A3D]">
          <span className="text-xs font-mono text-slate-400 pl-2 hidden sm:inline">Templates:</span>
          {PRESET_GRAPHS.map(p => (
            <button
              key={p.id}
              onClick={() => handleLoadPreset(p.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                selectedPreset === p.id && !isAlgorithmMode
                  ? 'bg-[#1D2536] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Validation Banner if disconnected or small */}
      {validationWarning && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{validationWarning}</span>
          </div>
          <button onClick={() => setValidationWarning(null)} className="p-1 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Playground Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Canvas Area (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative">
            <GraphCanvas
              nodes={nodes}
              edges={edges}
              currentEdge={isAlgorithmMode ? currentStep.currentEdge : null}
              acceptedEdges={isAlgorithmMode ? currentStep.acceptedEdges : []}
              rejectedEdges={isAlgorithmMode ? currentStep.rejectedEdges : []}
              dsuSnapshot={isAlgorithmMode ? currentStep.dsuSnapshot : null}
              cycleNodes={isAlgorithmMode ? currentStep.cycleNodes : []}
              onNodeDrag={!isAlgorithmMode ? handleNodeDrag : null}
              onNodeClick={handleNodeClick}
              selectedNode={edgeSourceNode}
              isEditable={!isAlgorithmMode}
              width={720}
              height={440}
            />

            {/* In-canvas editor mode banner */}
            {!isAlgorithmMode && (
              <div className="absolute top-3 left-3 bg-[#0A0D14]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {interactionMode === 'add-edge' ? (
                  edgeSourceNode ? (
                    <span className="text-amber-300">Click 2nd house to finish road from {edgeSourceNode}</span>
                  ) : (
                    <span>Click 1st house to start road (Weight: {customWeight})</span>
                  )
                ) : (
                  <span>Drag houses to move • Click to connect</span>
                )}
              </div>
            )}
          </div>

          {/* Canvas Bottom Toolset */}
          {!isAlgorithmMode ? (
            <div className="glass-panel p-4 rounded-2xl border border-[#21293B] flex flex-wrap items-center justify-between gap-4">
              {/* Construction tools */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleAddNode}
                  className="px-3 py-2 rounded-xl bg-[#151A27] hover:bg-[#1D2538] text-white text-xs font-bold border border-[#263148] flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  Add House
                </button>

                <div className="flex items-center gap-1.5 bg-[#0D1018] px-2 py-1.5 rounded-xl border border-[#202738]">
                  <button
                    onClick={() => {
                      setInteractionMode('add-edge');
                      setEdgeSourceNode(null);
                    }}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                      interactionMode === 'add-edge'
                        ? 'bg-[#FF6129] text-white shadow-md shadow-[#FF6129]/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Connect Road
                  </button>

                  <div className="flex items-center gap-1 pl-2 border-l border-white/10">
                    <span className="text-[11px] font-mono text-slate-400">Cost (₹k):</span>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={customWeight}
                      onChange={(e) => setCustomWeight(e.target.value)}
                      className="w-12 bg-[#171D2A] text-white font-mono text-xs text-center rounded px-1 py-0.5 border border-[#28354A] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleClear}
                  className="p-2 rounded-xl bg-[#141824] hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-[#222B3D] hover:border-red-500/30 transition-all"
                  title="Clear All Nodes & Edges"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Run Kruskal CTA Button */}
              <button
                onClick={runAlgorithm}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6129] to-[#FF8042] text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-[#FF6129]/25 hover:shadow-[#FF6129]/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                Run Kruskal on Custom Graph
              </button>
            </div>
          ) : (
            /* Algorithm Stepping Dock */
            <div className="glass-panel p-4 rounded-2xl border border-[#21293B] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={exitAlgorithmMode}
                  className="px-3 py-2 rounded-xl bg-[#151A27] hover:bg-[#1D2538] text-slate-300 hover:text-white text-xs font-bold border border-[#263148] transition-all"
                >
                  ← Edit Graph
                </button>
                <button
                  onClick={() => setCurrentStepIdx(0)}
                  className="p-2 rounded-xl bg-[#141824] hover:bg-[#1A2030] text-slate-300 border border-[#222B3D]"
                  title="Reset Algorithm"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIdx === 0}
                  className="p-2 rounded-xl bg-[#141824] disabled:opacity-30 text-slate-300 border border-[#222B3D]"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3.5 py-2 rounded-xl bg-[#FF6129] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#FF6129]/30"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={currentStepIdx >= steps.length - 1}
                  className="p-2 rounded-xl bg-[#141824] disabled:opacity-30 text-slate-300 border border-[#222B3D]"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs font-mono text-slate-300">
                Step <strong className="text-white">{currentStepIdx}</strong> of {steps.length - 1}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Graph Inspector & Status (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Status Box */}
          <div className="glass-panel p-5 rounded-2xl border border-[#222A3B]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                {isAlgorithmMode ? 'Live Algorithm Status' : 'Topology Inspector'}
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                {nodes.length} Vertices • {edges.length} Edges
              </span>
            </div>

            {isAlgorithmMode ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#0E121B] border border-[#1E2536]">
                  <span className="text-[11px] font-mono text-[#FF8957] font-bold block mb-1">
                    {currentStep.title}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentStep.explanation}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#0D1018] p-3 rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-[10px]">Total Cost</span>
                    <strong className="text-base text-emerald-400 font-heading font-black">
                      ₹{currentStep.totalWeight}k
                    </strong>
                  </div>
                  <div className="bg-[#0D1018] p-3 rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-[10px]">Tree Progress</span>
                    <strong className="text-base text-white font-heading font-black">
                      {currentStep.edgesCount} / {currentStep.targetEdges}
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Click <strong>"Connect Road"</strong> and select any two houses to create a weighted edge between them. Drag houses anywhere to optimize readability.
                </p>

                {/* Nodes list with quick delete */}
                <div className="max-h-48 overflow-y-auto pr-1 space-y-1.5">
                  {nodes.map(n => (
                    <div key={n.id} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#0E1119] border border-white/5 text-xs">
                      <span className="font-bold text-white">House {n.id}</span>
                      <button
                        onClick={() => handleDeleteNode(n.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                        title="Delete this house"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
