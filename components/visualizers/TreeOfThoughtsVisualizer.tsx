"use client";

import React, { useState } from 'react';
import { MathFormula } from '@/components/ui/MathFormula';
import { 
  ListTree, 
  Sparkles, 
  Bookmark, 
  ArrowUp,
  CheckCircle2,
  XCircle,
  Search,
  Brain
} from 'lucide-react';

export const TreeOfThoughtsVisualizer: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>('root');

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-1">
          <ListTree className="h-4 w-4" /> Deliberate Problem Solving & Search
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Tree of Thoughts (ToT) Visualizer
        </h1>
        <p className="text-slate-400 mt-2 text-base leading-relaxed">
          Tree of Thoughts (ToT) generalizes Chain-of-Thought prompting by allowing LLMs to explore multiple reasoning paths simultaneously in a tree structure, evaluating state values <MathFormula math="v(s)" /> and looking ahead using search algorithms like BFS and DFS.
        </p>
      </div>

      {/* QUICK SECTION BOOKMARK NAVIGATION BAR */}
      <div className="sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border border-cyan-500/40 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
          <Bookmark className="h-4 w-4 text-cyan-400" />
          <span>Quick Section Bookmarks:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          <button
            onClick={() => document.getElementById('section-formula')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <MathFormula math="v(s) \in [0, 1]" />
            <span className="font-semibold ml-2">1. State Evaluation & Tree Search</span>
          </button>

          <button
            onClick={() => document.getElementById('section-tree')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <ListTree className="h-4 w-4 text-purple-400 shrink-0" />
            <span className="font-semibold">2. Interactive Thought Tree</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Formula */}
      <div id="section-formula" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Search className="h-4 w-4 text-cyan-400" /> TREE SEARCH ALGORITHMIC FORMULATION
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            ToT Framework Components
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2">
            <span className="text-cyan-400 font-bold block uppercase">1. Thought Generator G(s, k)</span>
            <p className="text-slate-300 font-sans leading-relaxed">Generates <MathFormula math="k" /> candidate next reasoning steps for state <MathFormula math="s" />.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-2">
            <span className="text-purple-400 font-bold block uppercase">2. State Evaluator V(S)</span>
            <p className="text-slate-300 font-sans leading-relaxed">Evaluates state quality <MathFormula math="v(s) \in [0, 1]" /> (Sure / Likely / Impossible) to guide tree exploration.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
            <span className="text-emerald-400 font-bold block uppercase">3. Search Algorithm</span>
            <p className="text-slate-300 font-sans leading-relaxed">Uses BFS or DFS with pruning to abandon dead-end branches and backtrack when needed.</p>
          </div>
        </div>
      </div>

      {/* SECTION 2: Interactive Thought Tree Graph */}
      <div id="section-tree" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-purple-500/40 bg-gradient-to-br from-purple-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ListTree className="h-5 w-5 text-purple-400" /> Interactive Tree of Thoughts Visualizer
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Game of 24 Case Study: Use numbers [4, 9, 10, 13] with +, -, *, / to reach 24.
          </p>
        </div>

        {/* Interactive Tree Graph Container */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6 overflow-x-auto">
          {/* Level 0: Root */}
          <div className="flex justify-center">
            <div 
              onClick={() => setSelectedNode('root')}
              className={`p-4 rounded-xl border cursor-pointer font-mono text-xs text-center transition-all ${
                selectedNode === 'root' ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-500/20 scale-105' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] text-slate-400 block">Root State s_0</span>
              <span className="text-white font-bold text-sm">Input: [4, 9, 10, 13]</span>
            </div>
          </div>

          {/* Connectors to Level 1 */}
          <div className="flex justify-around text-slate-700 text-xs font-mono">
            <span>│</span>
            <span>│</span>
            <span>│</span>
          </div>

          {/* Level 1: 3 Candidate Branches */}
          <div className="grid grid-cols-3 gap-4">
            {/* Node 1.1 */}
            <div 
              onClick={() => setSelectedNode('node1_1')}
              className={`p-4 rounded-xl border cursor-pointer font-mono text-xs space-y-1 transition-all ${
                selectedNode === 'node1_1' ? 'bg-emerald-950/40 border-emerald-500 shadow-lg scale-105' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-emerald-400 font-bold">Thought 1.1</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">v = 0.9 (Sure)</span>
              </div>
              <p className="text-slate-200">13 - 9 = 4 (left: 4, 4, 10)</p>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 pt-1">
                <CheckCircle2 className="h-3 w-3" /> Active Path Chosen
              </span>
            </div>

            {/* Node 1.2 */}
            <div 
              onClick={() => setSelectedNode('node1_2')}
              className={`p-4 rounded-xl border cursor-pointer font-mono text-xs space-y-1 transition-all ${
                selectedNode === 'node1_2' ? 'bg-rose-950/40 border-rose-500 scale-105' : 'bg-slate-900 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-rose-400 font-bold">Thought 1.2</span>
                <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">v = 0.1 (Impossible)</span>
              </div>
              <p className="text-slate-200">10 * 13 = 130 (left: 4, 9, 130)</p>
              <span className="text-[10px] text-rose-400 flex items-center gap-1 pt-1">
                <XCircle className="h-3 w-3" /> Pruned Dead-End
              </span>
            </div>

            {/* Node 1.3 */}
            <div 
              onClick={() => setSelectedNode('node1_3')}
              className={`p-4 rounded-xl border cursor-pointer font-mono text-xs space-y-1 transition-all ${
                selectedNode === 'node1_3' ? 'bg-amber-950/40 border-amber-500 scale-105' : 'bg-slate-900 border-slate-800 opacity-70'
              }`}
            >
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-amber-400 font-bold">Thought 1.3</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">v = 0.4 (Likely)</span>
              </div>
              <p className="text-slate-200">13 + 4 = 17 (left: 9, 10, 17)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Back to Top Button Bar */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg"
        >
          <ArrowUp className="h-4 w-4 text-cyan-400" />
          <span>Back to Top</span>
        </button>
      </div>
    </div>
  );
};
