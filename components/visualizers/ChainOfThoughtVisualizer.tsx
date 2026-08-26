"use client";

import React, { useState } from 'react';
import { MathFormula } from '@/components/ui/MathFormula';
import { 
  Brain, 
  Sparkles, 
  Bookmark, 
  ArrowUp,
  Workflow,
  CheckCircle2,
  HelpCircle,
  Play
} from 'lucide-react';

export const ChainOfThoughtVisualizer: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [mode, setMode] = useState<'standard' | 'cot'>('cot');

  const reasoningSteps = [
    { title: "Question Input", text: "A store has 12 apples. John buys 4. Then the store gets 8 more. How many apples are there?", type: "input" },
    { title: "Step 1: Subtract Purchased", text: "<think>Initial count = 12. John buys 4 -> 12 - 4 = 8 apples remaining.</think>", type: "think" },
    { title: "Step 2: Add Shipment", text: "<think>Store gets 8 more -> 8 + 8 = 16 apples total.</think>", type: "think" },
    { title: "Final Answer Generation", text: "The store now has 16 apples.", type: "output" }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold uppercase tracking-wider mb-1">
          <Brain className="h-4 w-4" /> Reasoning & Explicit Inference Decomposition
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Chain-of-Thought (CoT) Prompting & Reasoning
        </h1>
        <p className="text-slate-400 mt-2 text-base leading-relaxed">
          Chain-of-Thought (CoT) prompting encourages Large Language Models to decompose complex reasoning tasks into intermediate steps. By spending compute tokens on reasoning prior to generating the final answer, LLMs unlock dramatic gains on math, logic, and multi-hop questions.
        </p>
      </div>

      {/* QUICK SECTION BOOKMARK NAVIGATION BAR */}
      <div className="sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border border-purple-500/40 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400">
          <Bookmark className="h-4 w-4 text-purple-400" />
          <span>Quick Section Bookmarks:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          <button
            onClick={() => document.getElementById('section-formula')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <MathFormula math="P(Y \mid X) = \sum P(Y \mid C, X) P(C \mid X)" />
            <span className="font-semibold ml-2">1. Mathematical Decomposition</span>
          </button>

          <button
            onClick={() => document.getElementById('section-trace')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-indigo-500/20 text-slate-200 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <Workflow className="h-4 w-4 text-indigo-400 shrink-0" />
            <span className="font-semibold">2. Step-by-Step Reasoning Trace</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Mathematical Formula */}
      <div id="section-formula" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-purple-500/40 bg-gradient-to-br from-purple-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-purple-400" /> MATHEMATICAL FORMULATION
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Intermediate Chain Decomposition
          </h2>
        </div>

        <div className="bg-slate-950/90 p-5 rounded-2xl border border-purple-500/30 space-y-3">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block">
            CoT Marginalization Probability Formula:
          </span>
          <div className="py-3 px-4 bg-slate-900 rounded-xl border border-purple-500/30 text-center font-mono text-purple-300 text-lg">
            <MathFormula math="P(Y \mid X) = \sum_{C} P(Y \mid C, X) P(C \mid X)" block />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Where <MathFormula math="X" /> is the prompt, <MathFormula math="C = (c_1, c_2, \dots, c_k)" /> represents the intermediate chain-of-thought tokens, and <MathFormula math="Y" /> is the final answer.
          </p>
        </div>

        {/* Standard vs CoT Prompting Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-slate-950 p-5 rounded-2xl border border-rose-500/30 space-y-2">
            <span className="font-mono font-bold text-rose-400 block uppercase">Standard Prompting (Direct)</span>
            <p className="text-slate-300">Forces the model to calculate the final answer <MathFormula math="Y" /> in a single step immediately following <MathFormula math="X" />. Prone to arithmetic errors on complex multi-step problems.</p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-purple-500/30 space-y-2">
            <span className="font-mono font-bold text-purple-300 block uppercase">Chain-of-Thought (CoT)</span>
            <p className="text-slate-300">Allows the model to emit intermediate reasoning steps <MathFormula math="C" />, increasing effective computation time per prompt and avoiding single-step hallucinations.</p>
          </div>
        </div>
      </div>

      {/* SECTION 2: Reasoning Trace */}
      <div id="section-trace" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-indigo-500/40 bg-gradient-to-br from-indigo-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Workflow className="h-5 w-5 text-indigo-400" /> Interactive Reasoning Trace Timeline
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Watch how intermediate reasoning tokens build context step-by-step.
            </p>
          </div>

          <button
            onClick={() => setStep((prev) => (prev + 1) % (reasoningSteps.length + 1))}
            className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-mono text-xs font-bold transition-all flex items-center gap-2"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>Next Step ({step}/{reasoningSteps.length})</span>
          </button>
        </div>

        <div className="space-y-3">
          {reasoningSteps.slice(0, step > 0 ? step : reasoningSteps.length).map((s, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border font-mono text-xs space-y-1 transition-all ${
                s.type === 'think'
                  ? 'bg-purple-950/20 border-purple-500/40 text-purple-200'
                  : s.type === 'input'
                  ? 'bg-slate-950 border-slate-800 text-slate-300'
                  : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200 font-bold'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold uppercase tracking-wider">{s.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">Step {idx + 1}</span>
              </div>
              <p className="text-sm pt-1">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Back to Top Button Bar */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-purple-500/20 text-slate-300 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg"
        >
          <ArrowUp className="h-4 w-4 text-purple-400" />
          <span>Back to Top</span>
        </button>
      </div>
    </div>
  );
};
