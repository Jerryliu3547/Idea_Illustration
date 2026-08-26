"use client";

import React, { useState } from 'react';
import { MathFormula } from '@/components/ui/MathFormula';
import { 
  Sliders, 
  Cpu, 
  Bookmark, 
  ArrowUp,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';

export const LoRAVisualizer: React.FC = () => {
  const [rank, setRank] = useState<number>(8);
  const [alpha, setAlpha] = useState<number>(16);
  const [dModel, setDModel] = useState<number>(4096);

  // Parameter calculation:
  // Original Weight W0: dModel * dModel
  // LoRA Matrix A (r * dModel) + LoRA Matrix B (dModel * r)
  const originalParams = dModel * dModel;
  const loraParams = 2 * dModel * rank;
  const reductionFactor = (originalParams / loraParams).toFixed(1);
  const loraPercent = ((loraParams / originalParams) * 100).toFixed(2);

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold uppercase tracking-wider mb-1">
          <Layers className="h-4 w-4" /> Parameter-Efficient Fine-Tuning (PEFT)
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          LoRA & QLoRA Visualizer
        </h1>
        <p className="text-slate-400 mt-2 text-base leading-relaxed">
          Low-Rank Adaptation (LoRA) freezes pretrained LLM weights <MathFormula math="W_0" /> and injects trainable rank-decomposition matrices (<MathFormula math="A" /> and <MathFormula math="B" />), reducing trainable parameter count by up to 99.9% while preserving full model quality.
        </p>
      </div>

      {/* QUICK SECTION BOOKMARK NAVIGATION BAR */}
      <div className="sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border border-emerald-500/40 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
          <Bookmark className="h-4 w-4 text-emerald-400" />
          <span>Quick Section Bookmarks:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
          <button
            onClick={() => document.getElementById('section-formula')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <MathFormula math="W_0 + \frac{\alpha}{r} BA" />
            <span className="font-semibold ml-2">1. Low-Rank Decomposition</span>
          </button>

          <button
            onClick={() => document.getElementById('section-calculator')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-teal-500/20 text-slate-200 hover:text-teal-300 border border-slate-800 hover:border-teal-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <Sliders className="h-4 w-4 text-teal-400 shrink-0" />
            <span className="font-semibold">2. Memory Savings Calculator</span>
          </button>

          <button
            onClick={() => document.getElementById('section-qlora')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <Cpu className="h-4 w-4 text-cyan-400 shrink-0" />
            <span className="font-semibold">3. QLoRA 4-bit Quantization</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Formula */}
      <div id="section-formula" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-emerald-400" /> MATRIX DECOMPOSITION FORMULATION
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Low-Rank Adaptation Mechanics
          </h2>
        </div>

        <div className="bg-slate-950/90 p-5 rounded-2xl border border-emerald-500/30 space-y-3">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
            LoRA Forward Pass Equation:
          </span>
          <div className="py-3 px-4 bg-slate-900 rounded-xl border border-emerald-500/30 text-center font-mono text-emerald-300 text-lg">
            <MathFormula math="h = W_0 x + \Delta W x = W_0 x + \frac{\alpha}{r} (B \cdot A) x" block />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Where <MathFormula math="W_0 \in \mathbb{R}^{d \times k}" /> remains frozen, <MathFormula math="A \in \mathbb{R}^{r \times k}" /> is initialized with Gaussian noise, and <MathFormula math="B \in \mathbb{R}^{d \times r}" /> is initialized to 0 (so <MathFormula math="\Delta W = 0" /> at start of training).
          </p>
        </div>
      </div>

      {/* SECTION 2: Calculator */}
      <div id="section-calculator" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-8 border-teal-500/40 bg-gradient-to-br from-teal-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sliders className="h-5 w-5 text-teal-400" /> Parameter Reduction Calculator
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">Rank (r): {rank}</span>
            <input
              type="range"
              min="1"
              max="64"
              step="1"
              value={rank}
              onChange={(e) => setRank(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">Lower rank = smaller memory footprint.</span>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">Scaling Alpha (\alpha): {alpha}</span>
            <input
              type="range"
              min="1"
              max="128"
              step="1"
              value={alpha}
              onChange={(e) => setAlpha(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">Scaling factor ratio \alpha / r.</span>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">Model Hidden Dim (d): {dModel}</span>
            <input
              type="range"
              min="1024"
              max="8192"
              step="1024"
              value={dModel}
              onChange={(e) => setDModel(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Live Calculation Output Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block">Frozen Original Weight Parameters:</span>
            <span className="text-xl font-extrabold text-slate-200">{(originalParams / 1e6).toFixed(2)}M params</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/30">
            <span className="text-slate-400 block">Trainable LoRA Parameters (A + B):</span>
            <span className="text-xl font-extrabold text-emerald-400">{(loraParams / 1e6).toFixed(4)}M params ({loraPercent}%)</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-teal-500/30">
            <span className="text-slate-400 block">Parameter Reduction Factor:</span>
            <span className="text-xl font-extrabold text-teal-300">{reductionFactor}x Smaller!</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: QLoRA */}
      <div id="section-qlora" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Cpu className="h-4 w-4 text-cyan-400" /> 4-BIT QUANTIZATION INNOVATION
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            QLoRA: Quantized Low-Rank Adaptation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-slate-300">
            <span className="font-mono font-bold text-cyan-400 uppercase tracking-wider block">1. NormalFloat4 (NF4) Quantization</span>
            <p className="leading-relaxed">
              Quantizes frozen base model weights <MathFormula math="W_0" /> to 4-bit NormalFloat datatype, designed for normally distributed neural network weights.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-slate-300">
            <span className="font-mono font-bold text-teal-400 uppercase tracking-wider block">2. Double Quantization (DQ)</span>
            <p className="leading-relaxed">
              Quantizes the quantization constants themselves, saving an additional 0.37 bits per parameter. Enables fine-tuning 65B models on a single 48GB GPU!
            </p>
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
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg"
        >
          <ArrowUp className="h-4 w-4 text-emerald-400" />
          <span>Back to Top</span>
        </button>
      </div>
    </div>
  );
};
