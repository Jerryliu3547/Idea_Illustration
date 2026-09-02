"use client";

import React, { useState } from 'react';
import { getAssetPath } from '@/lib/asset';
import { MathFormula } from '@/components/ui/MathFormula';
import {
  Zap,
  Sparkles,
  Bookmark,
  ArrowRight,
  Play,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  FileText,
  ExternalLink,
  Brain,
  Sliders,
  Database,
  Search,
  Check,
  AlertTriangle
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export const PERKVisualizer: React.FC = () => {
  // State for Procedure Tab
  const [procedureTab, setProcedureTab] = useState<'training' | 'inference'>('training');

  // Empirical Context Benchmark Data (PERK vs Prompting vs RAG vs SFT)
  const contextBenchmarkData = [
    { length: '4k', perk: 94, prompt: 91, rag: 78, sft: 85 },
    { length: '16k', perk: 92, prompt: 82, rag: 76, sft: 79 },
    { length: '32k', perk: 89, prompt: 68, rag: 74, sft: 71 },
    { length: '64k', perk: 86, prompt: 49, rag: 71, sft: 58 },
    { length: '128k', perk: 83, prompt: 31, rag: 68, sft: 42 },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-1">
          <Zap className="h-4 w-4" /> Parameter-Efficient Test-Time Adaptation
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          PERK: Long-Context Reasoning as Parameter-Efficient Test-Time Learning
        </h1>
        <p className="text-slate-400 mt-2 text-base leading-relaxed">
          PERK (<strong className="text-cyan-300">Parameter Efficient Reasoning over Knowledge</strong>) reformulates long-context document ingestion as a <strong className="text-white">test-time learning process</strong>. Instead of stuffing long documents into KV caches (causing memory explosions and lost-in-the-middle accuracy degradation), PERK performs fast gradient updates on lightweight <strong className="text-emerald-400">LoRA adapters</strong> to encode the context directly into model parameters.
        </p>
      </div>

      {/* QUICK SECTION BOOKMARK NAVIGATION BAR */}
      <div className="sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border border-cyan-500/40 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
          <Bookmark className="h-4 w-4 text-cyan-400" />
          <span>Quick Section Navigation:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs font-mono">
          <button
            onClick={() => document.getElementById('section-concept')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="font-semibold truncate">1. Core Concept</span>
          </button>

          <button
            onClick={() => document.getElementById('section-loops')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Layers className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span className="font-semibold truncate">2. Two-Loop Arch</span>
          </button>

          <button
            onClick={() => document.getElementById('section-math')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Brain className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold truncate">3. Math Formulation</span>
          </button>

          <button
            onClick={() => document.getElementById('section-benchmarks')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-rose-500/20 text-slate-200 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <TrendingUp className="h-3.5 w-3.5 text-rose-400 shrink-0" />
            <span className="font-semibold truncate">4. Empirical Results</span>
          </button>

          <button
            onClick={() => document.getElementById('section-paper')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-indigo-500/20 text-slate-200 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <FileText className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <span className="font-semibold truncate">5. Paper Details</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Paradigm Shift - Context as Parameters */}
      <div id="section-concept" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-cyan-400" /> PARADIGM SHIFT IN LONG-CONTEXT REASONING
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Why Test-Time Learning Outperforms In-Context Attention
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Comparing standard activation-based KV cache context ingestion against PERK&apos;s parametric adapter context encoding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Standard Prompting / RAG */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-rose-500/30 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-bold text-rose-300 text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-400" /> Standard In-Context Attention / RAG
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Activations Memory
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
                <p>• <strong className="text-white">Mechanism:</strong> Passes full 32k–128k token context directly into the prompt KV-cache or relies on vector chunk retrieval (RAG).</p>
                <p>• <strong className="text-rose-400 font-bold">KV-Cache Memory Bloat:</strong> Memory scales linearly with context length <MathFormula math="O(N)" />. A 128k context requires gigabytes of GPU VRAM per query.</p>
                <p>• <strong className="text-rose-400 font-bold">Needle-in-a-Haystack Problem:</strong> Self-attention attention weights get diluted over long sequences, suffering severe accuracy drops for facts buried in the middle.</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-rose-300 space-y-1">
              <span className="block font-bold text-rose-400 uppercase text-[10px]">Failure Mode:</span>
              <p className="text-slate-300 font-sans">Attention dispersion over 100k+ noisy tokens obscures critical target facts.</p>
            </div>
          </div>

          {/* PERK Test-Time Learning */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-cyan-500/40 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-bold text-cyan-300 text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-cyan-400" /> PERK: Test-Time Parameter Learning
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Parametric Memory
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
                <p>• <strong className="text-white">Mechanism:</strong> Performs 1–5 fast inner-loop gradient steps on test context to fit a lightweight LoRA module <MathFormula math="\theta_{\text{LoRA}}" />.</p>
                <p>• <strong className="text-cyan-300 font-bold">Constant Memory Inference:</strong> Once adapted, the long context is encoded inside the LoRA parameters (~2–5 MB), allowing inference with standard short queries!</p>
                <p>• <strong className="text-cyan-300 font-bold">Robust Knowledge Recall:</strong> Gradient updates compress global document dependencies into weights, eliminating attention position decay.</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-300 space-y-1">
              <span className="block font-bold text-cyan-400 uppercase text-[10px]">Key Advantage:</span>
              <p className="text-slate-300 font-sans">Transforming un-indexed text tokens into permanent, queryable weights at test time.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Two-Loop Meta Learning Architecture & Procedure */}
      <div id="section-loops" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-purple-500/40 bg-gradient-to-br from-purple-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-purple-400" /> TWO-LOOP META-LEARNING ARCHITECTURE & EXACT PROCEDURE
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Parameter Taxonomy & Step-by-Step Inner/Outer Loop Execution
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            PERK separates persistent meta-learned parameters (<code className="text-purple-300 font-mono">adapter_original</code>) from ephemeral context-specific working memory (<code className="text-cyan-300 font-mono">adapter_inner</code>).
          </p>
        </div>

        {/* Core Parameter Distinction Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* adapter_original Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/50 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="font-mono font-bold text-purple-300 text-sm flex items-center gap-2">
                <Database className="h-4 w-4 text-purple-400" /> adapter_original (<MathFormula math="\theta_{\text{adapter}}" />)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                Persistent Meta-Learned
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
              <p>• <strong className="text-white">Definition:</strong> The persistent, meta-learned parameters. This is the <strong>only</strong> module that gets saved, checkpointed, and carried across training steps.</p>
              <p>• <strong className="text-purple-300 font-bold">&quot;Learning How to Learn&quot;:</strong> Represents an optimal parameter starting point plus an implicit procedure for fast test-time context adaptation.</p>
              <p>• <strong className="text-slate-400">Evolution:</strong> Evolves continuously over training via outer-loop AdamW updates.</p>
            </div>
          </div>

          {/* adapter_inner Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/50 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="font-mono font-bold text-cyan-300 text-sm flex items-center gap-2">
                <Cpu className="h-4 w-4 text-cyan-400" /> adapter_inner (<MathFormula math="\phi^*_{\text{adapter}}" />)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                Ephemeral Working Memory
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
              <p>• <strong className="text-white">Definition:</strong> A temporary, per-example copy produced by running <MathFormula math="N" /> inner-loop gradient steps starting from <code className="text-purple-300 font-mono">adapter_original</code> on context <MathFormula math="\mathcal{K}" />.</p>
              <p>• <strong className="text-cyan-300 font-bold">Context Working Memory:</strong> Encodes dense document knowledge into parameters. <strong>Never persists or accumulates across examples</strong>.</p>
              <p>• <strong className="text-rose-400 font-bold">Discarded:</strong> Discarded immediately after answering questions for context <MathFormula math="\mathcal{K}" />!</p>
            </div>
          </div>
        </div>

        {/* Deep Dive Callout: Why N Inner-Loop Steps Are Needed */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/40 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="font-mono font-bold text-amber-400 text-sm flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-amber-400" /> Why Do We Need an N-Step Inner Loop? (Deliberate Document Overfitting)
            </span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
              Under-fitting vs. Memorization
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
            <p>
              <strong className="text-rose-400">1. Single Step Under-fitting Risk:</strong> A single gradient step (<MathFormula math="N = 1" />) is usually insufficient to drive the self-supervised NLL loss down far enough to reliably encode the document&apos;s facts into parameters. The weights remain under-fit, causing downstream retrieval failures.
            </p>
            <p>
              <strong className="text-amber-300">2. Deliberate Document Overfitting:</strong> Executing repeated gradient updates (<MathFormula math="N > 1" />) on the <em>same</em> document data intentionally overfits the tiny LoRA adapter (<code className="text-cyan-300 font-mono">adapter_inner</code>) to that specific context, genuinely &quot;memorizing&quot; facts directly into adapter weights.
            </p>
            <p>
              <strong className="text-cyan-300">3. Step Count Trade-off:</strong>
            </p>
            <ul className="pl-4 space-y-1 list-disc text-[11px] text-slate-300 font-mono">
              <li><strong className="text-emerald-400">More Inner Steps (N ↑):</strong> Lower Negative Log-Likelihood (NLL) loss on context <MathFormula math="\mathcal{K}" /> <MathFormula math="\to" /> deeper fact memorization <MathFormula math="\to" /> higher downstream QA accuracy.</li>
              <li><strong className="text-rose-400">Fewer Inner Steps (N ↓):</strong> Lower computational cost & faster adaptation latency, but weaker memorization <MathFormula math="\to" /> worse downstream QA accuracy.</li>
            </ul>
          </div>
        </div>

        {/* Interactive Procedure Workflow Container */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Execution Procedure Workflow:
              </span>
              <h3 className="text-lg font-bold text-white">
                {procedureTab === 'training' ? 'Per Training Step (Meta-Training Phase)' : 'At Test Time (Inference Phase)'}
              </h3>
            </div>

            {/* Workflow Mode Tabs */}
            <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 shrink-0">
              <button
                onClick={() => setProcedureTab('training')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${procedureTab === 'training' ? 'bg-purple-500 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Meta-Training Step
              </button>
              <button
                onClick={() => setProcedureTab('inference')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${procedureTab === 'inference' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Test-Time Inference
              </button>
            </div>
          </div>

          {/* Training Phase Procedure Steps */}
          {procedureTab === 'training' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-900/90 rounded-xl border border-purple-500/30 space-y-2 relative">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">Step 1: Inner Adaptation</span>
                <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                  Copy <code className="text-purple-300">adapter_original</code> <MathFormula math="\to" /> run <MathFormula math="N" /> inner-loop gradient steps on context <MathFormula math="\mathcal{K}" /> <MathFormula math="\to" /> produce <code className="text-cyan-300">adapter_inner</code>. Retain the computation graph for the last <MathFormula math="T" /> steps (Truncated Gradient Unrolling, TGU).
                </p>
              </div>

              <div className="p-4 bg-slate-900/90 rounded-xl border border-purple-500/30 space-y-2">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">Step 2: Question Forward Pass</span>
                <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                  Use <code className="text-cyan-300">adapter_inner</code> (+ frozen base LLM) to answer question <MathFormula math="q" />, and compute reasoning loss <MathFormula math="\mathcal{L}_{\text{reason}}" />.
                </p>
              </div>

              <div className="p-4 bg-slate-900/90 rounded-xl border border-purple-500/30 space-y-2">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">Step 3: Outer Backprop & Update</span>
                <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                  Backpropagate <MathFormula math="\mathcal{L}_{\text{reason}}" /> through the retained last-<MathFormula math="T" />-step graph all the way back to <code className="text-purple-300">adapter_original</code>. This gradient updates <code className="text-purple-300">adapter_original</code> via AdamW.
                </p>
              </div>

              <div className="p-4 bg-slate-900/90 rounded-xl border border-rose-500/30 space-y-2">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">Step 4: Memory Cleanup</span>
                <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                  <code className="text-cyan-300">adapter_inner</code> is <strong>discarded</strong>. The next training example starts fresh from the (now updated) <code className="text-purple-300">adapter_original</code>.
                </p>
              </div>
            </div>
          )}

          {/* Inference Phase Procedure Steps */}
          {procedureTab === 'inference' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-900/90 rounded-xl border border-cyan-500/30 space-y-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Step 1: Load Fixed Adapter</span>
                <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                  Take the final trained, fixed <code className="text-purple-300">adapter_original</code>. No outer updates occur during test time (<MathFormula math="\nabla \theta_{\text{original}} = 0" />).
                </p>
              </div>

              <div className="p-4 bg-slate-900/90 rounded-xl border border-cyan-500/30 space-y-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Step 2: Context Adaptation</span>
                <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                  Given a new context <MathFormula math="\mathcal{K}" />, run <MathFormula math="N" /> inner-loop gradient steps starting from <code className="text-purple-300">adapter_original</code> to produce a context-specific <code className="text-cyan-300">adapter_inner</code>.
                </p>
              </div>

              <div className="p-4 bg-slate-900/90 rounded-xl border border-cyan-500/30 space-y-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Step 3: Serve User Queries</span>
                <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                  Answer arbitrary downstream questions <MathFormula math="q" /> using <code className="text-cyan-300">adapter_inner</code> (+ frozen base LLM).
                </p>
              </div>

              <div className="p-4 bg-slate-900/90 rounded-xl border border-rose-500/30 space-y-2">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">Step 4: Context Flush</span>
                <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                  Once done with context <MathFormula math="\mathcal{K}" />, discard <code className="text-cyan-300">adapter_inner</code>. A new context gets a fresh <code className="text-cyan-300">adapter_inner</code> generated again from the same fixed <code className="text-purple-300">adapter_original</code>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: Mathematical Formulation */}
      <div id="section-math" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Brain className="h-4 w-4 text-emerald-400" /> FORMAL MATHEMATICAL SPECIFICATION
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Mathematical Equations & Truncated Unrolling
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Formal definitions of context encoding loss, meta-objective gradients, and parameter rank decomposition in PERK.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-mono">
          <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3 shadow-xl">
            <span className="text-cyan-400 font-bold block uppercase text-xs">1. Self-Supervised Context Loss</span>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <MathFormula math="\mathcal{L}_{\text{enc}}(C; \theta) = -\sum_{t=1}^{N} \log P_\theta(c_t \mid c_{<t})" block />
            </div>
            <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
              Calculates autoregressive log-likelihood loss over context tokens <MathFormula math="C" /> to compute inner gradients at test time.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-3 shadow-xl">
            <span className="text-purple-400 font-bold block uppercase text-xs">2. Low-Rank Adapter Matrices</span>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <MathFormula math="W_{\text{adapted}} = W_0 + \frac{\alpha}{r} (B \cdot A)" block />
            </div>
            <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
              Restricts weight updates to rank <MathFormula math="r \ll d" /> matrices <MathFormula math="A \in \mathbb{R}^{r \times d}" /> and <MathFormula math="B \in \mathbb{R}^{d \times r}" />, preserving base model <MathFormula math="W_0" />.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3 shadow-xl">
            <span className="text-emerald-400 font-bold block uppercase text-xs">3. Truncated Gradient Unrolling</span>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <MathFormula math="\nabla_{\theta_0} \mathcal{L}_{\text{qa}} \approx \nabla_{\theta_N} \mathcal{L}_{\text{qa}} \cdot \prod_{i=N-T}^{N} \left(I - \eta \nabla^2 \mathcal{L}_{\text{enc}}\right)" block />
            </div>
            <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
              Flows outer gradients back through only the last <MathFormula math="T" /> inner steps, treating the first <MathFormula math="N-T" /> steps as fixed constants.
            </p>
          </div>
        </div>

        {/* Deep Dive: Why Outer Loop Backprop is Expensive & Why TGU is Essential */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-950 to-slate-950 border border-purple-500/40 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <span className="font-mono font-bold text-purple-300 text-sm flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-purple-400" /> Deep Dive: Why Outer-Loop Backprop is Costly & Why TGU is Essential
            </span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
              Hessians & Graph Unrolling
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
            {/* The Dependency Chain */}
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
              <span className="text-purple-400 font-bold block text-[11px]">Inner-to-Outer Chain Rule Trajectory:</span>
              <div className="text-cyan-300 font-bold py-1 overflow-x-auto">
                <MathFormula math="\theta_{\text{adapter}} = \phi_0 \longrightarrow \phi_1 \longrightarrow \phi_2 \longrightarrow \dots \longrightarrow \phi_N \longrightarrow \mathcal{L}_{\text{reason}}" block />
              </div>
              <p className="text-slate-300 font-sans text-[11px]">
                To compute <MathFormula math="\frac{\partial \mathcal{L}_{\text{reason}}}{\partial \theta_{\text{adapter}}}" />, PyTorch must backpropagate through every arrow <MathFormula math="\phi_n \to \phi_{n+1}" /> in sequence.
              </p>
            </div>

            {/* Why it is specifically expensive */}
            <div className="space-y-2">
              <strong className="text-rose-400 font-mono text-xs block uppercase">1. Why Full Unrolling is Extremely Expensive (Hessians & Memory):</strong>
              <p className="text-slate-300 text-[11px]">
                Chaining through <MathFormula math="N" /> simple linear operations is cheap. What makes this outer update costly is what each inner step arrow <MathFormula math="\phi_n \to \phi_{n+1}" /> actually represents:
              </p>
              <div className="p-2.5 bg-slate-900 rounded-lg font-mono text-xs border border-slate-800">
                <MathFormula math="\phi_{n+1} = \phi_n - \eta \nabla_{\phi_n} \mathcal{L}_{\text{NLL}}(\theta_{\text{base}}, \phi_n, \mathcal{K})" block />
              </div>
              <p className="text-slate-300 text-[11px]">
                Each arrow is the result of an inner gradient update through the <em>entire LLM</em> (forward + backward pass). Differentiating through this step to calculate <MathFormula math="J^{(n)} = \frac{\partial \phi_{n+1}}{\partial \phi_n}" /> requires evaluating a <strong>second derivative</strong> — the <strong>Hessian matrix</strong> <MathFormula math="H^{(n)} = \nabla^2_{\phi_n} \mathcal{L}_{\text{NLL}}" /> of the full LLM.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 font-mono text-[11px]">
                <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-500/30 space-y-1">
                  <strong className="text-rose-400 font-bold block">Memory Explosion O(N):</strong>
                  <p className="text-slate-300 font-sans">
                    PyTorch must keep the complete forward computation graph (all activations across all LLM layers) for all <MathFormula math="N" /> inner steps alive simultaneously in GPU VRAM. Memory scales linearly in <MathFormula math="N" />.
                  </p>
                </div>

                <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-500/30 space-y-1">
                  <strong className="text-rose-400 font-bold block">Compute Overhead:</strong>
                  <p className="text-slate-300 font-sans">
                    Each step demands a Hessian-vector product (a full extra LLM backward pass per inner step) on top of the inner loop&apos;s own passes.
                  </p>
                </div>
              </div>
            </div>

            {/* How TGU Solves It */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <strong className="text-emerald-400 font-mono text-xs block uppercase">2. How Truncated Gradient Unrolling (TGU) Solves This:</strong>
              <p className="text-slate-300 text-[11px]">
                TGU truncates the backpropagation chain! Instead of demanding that gradients flow through all <MathFormula math="N" /> inner steps, TGU only requires gradients to flow through the <strong>last <MathFormula math="T" /> arrows</strong> (<MathFormula math="\phi_{N-T} \to \dots \to \phi_N" />), treating the first <MathFormula math="N-T" /> steps as fixed constants (zero Hessians computed, zero computation graph retained for them!).
              </p>
              <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/40 text-emerald-300 font-mono text-xs">
                <strong>Result:</strong> Reduces memory complexity from <MathFormula math="O(N \times \text{LLM VRAM})" /> to <MathFormula math="O(T \times \text{LLM VRAM})" /> — making meta-training memory footprint completely independent of how large <MathFormula math="N" /> gets! 🚀
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Empirical Results & Scaling Benchmarks */}
      <div id="section-benchmarks" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-rose-500/40 bg-gradient-to-br from-rose-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-rose-400" /> EMPIRICAL BENCHMARKS & LENGTH EXTRAPOLATION
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Performance on Long-Context Reasoning (Paper Figure 2)
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Empirical accuracy comparison across NIAH BabiLong, Multi-Doc (HotpotQA & TriviaQA), and DIO Student Records tasks comparing PERK against FT-ICR, OSS Frontier, and Commercial Frontiers.
          </p>
        </div>

        {/* Paper Figure 2 Image Container */}
        <div className="bg-slate-950 p-4 sm:p-6 rounded-2xl border-2 border-rose-500/50 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <span className="text-xs font-mono font-bold text-rose-300 flex items-center gap-2">
              <FileText className="h-4 w-4 text-rose-400" /> Figure 2: Long-Context Reasoning Extrapolation Benchmarks (8K → 32K Tokens)
            </span>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
              Chen et al. (2025)
            </span>
          </div>

          {/* Embedded Image Display */}
          <div className="rounded-xl overflow-hidden bg-white p-3 border border-slate-700 shadow-inner flex justify-center">
            <img
              src={getAssetPath('/images/perk_fig2_long_context_reasoning.png')}
              alt="PERK Figure 2 showing Long-context Reasoning performance on NIAH BabiLong, DIO Student Records, HotpotQA, and TriviaQA comparing PERK, FT-ICR, OSS Frontier, and Commercial Frontiers"
              className="max-h-[600px] w-auto object-contain rounded"
            />
          </div>

          {/* Paper Figure Caption & Takeaways */}
          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2.5 leading-relaxed font-sans">
            <div className="font-mono font-bold text-rose-400 text-xs uppercase tracking-wider">
              Figure 2 Caption & Key Benchmark Observations:
            </div>
            <p className="text-slate-300 italic text-[11px] border-l-2 border-rose-500/60 pl-3">
              &quot;Evaluation results on NIAH with BabiLong, Multi-Doc with HotpotQA & TriviaQA, and DIO with Student Records. All PERK and FT-ICR models (including Mamba) are trained on contexts with 8K tokens. When evaluated on the out-of-distribution contexts with 32K tokens, they must extrapolate to a new context length.&quot;
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 font-mono text-[11px]">
              <div className="p-3 bg-cyan-950/30 rounded-xl border border-cyan-500/30 space-y-1">
                <strong className="text-cyan-300 font-bold block">1. Superior 8K → 32K Length Extrapolation:</strong>
                <p className="text-slate-300 font-sans">
                  Even when trained only on <strong className="text-cyan-300">8K contexts</strong>, PERK models maintain strong, stable reasoning accuracy when evaluated out-of-distribution on <strong className="text-white">32K token contexts</strong> across all tasks.
                </p>
              </div>

              <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-500/30 space-y-1">
                <strong className="text-purple-300 font-bold block">2. Small Model Outperforms Giant Baselines:</strong>
                <p className="text-slate-300 font-sans">
                  <strong className="text-cyan-300">PERK Qwen 0.5B and 7B</strong> significantly outperform FT-ICR (Qwen 0.5B, 7B, and Mamba 1.4B) and match or exceed giant OSS & commercial models like <strong className="text-amber-300">GPT-4.1</strong> and <strong className="text-amber-300">Gemini-1.5-pro</strong> on multi-fact reasoning (QA2, QA3, and DIO Aggregation)!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Model Category Badge Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
          <div className="p-4 bg-slate-950 rounded-2xl border border-cyan-500/40 space-y-1.5">
            <span className="font-mono text-cyan-400 font-bold block text-xs">PERK</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              <strong className="text-white">Qwen 0.5B & Qwen 7B:</strong> Inner-loop test-time LoRA adaptation achieves top accuracy across all NIAH, Multi-Doc, and DIO benchmarks.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-purple-500/40 space-y-1.5">
            <span className="font-mono text-purple-400 font-bold block text-xs">FT-ICR Baselines</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              <strong className="text-purple-300">Qwen 0.5B, Qwen 7B, Mamba 1.4B:</strong> Standard in-context fine-tuning suffers severe accuracy decay on 32K context length extrapolation.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-amber-500/40 space-y-1.5">
            <span className="font-mono text-amber-400 font-bold block text-xs">OSS Frontier</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              <strong className="text-amber-300">Qwen2.5-7B-Instruct-1M & ProLong-LLaMA-8B:</strong> Large open models relying on pure context prompt attention.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/40 space-y-1.5">
            <span className="font-mono text-emerald-400 font-bold block text-xs">Commercial Frontier</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              <strong className="text-emerald-300">GPT-4.1 & Gemini-1.5-pro:</strong> Proprietary frontier models evaluated on full long-context prompts.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5: Paper Reference */}
      <div id="section-paper" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border-indigo-500/40 bg-gradient-to-br from-indigo-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-indigo-400" /> ORIGINAL RESEARCH PAPER REFERENCE
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              PERK: Long-Context Reasoning as Parameter-Efficient Test-Time Learning
            </h2>
            <p className="text-xs text-slate-300">
              Zeming Chen, Angelika Romanou, Gail Weiss, Antoine Bosselut — EPFL (École Polytechnique Fédérale de Lausanne)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
            <a
              href="https://arxiv.org/abs/2507.06415"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <ExternalLink className="h-4 w-4 text-cyan-400" />
              <span>ArXiv Paper</span>
            </a>

            <a
              href="https://github.com/epfl-nlp/PERK"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-all flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4 text-cyan-400" />
              <span>GitHub Repository</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
