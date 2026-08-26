"use client";

import React, { useState, useMemo } from 'react';
import { MathFormula } from '@/components/ui/MathFormula';
import { 
  Sliders, 
  Flame, 
  Bookmark, 
  ArrowUp,
  BarChart3,
  Sparkles
} from 'lucide-react';

export const SoftmaxVisualizer: React.FC = () => {
  // State: 4 raw output logits z_1, z_2, z_3, z_4 and temperature T
  const [logits, setLogits] = useState<number[]>([2.5, 1.0, 0.2, -0.8]);
  const [temp, setTemp] = useState<number>(1.0);

  const tokenLabels = ["Token A (\"Awesome\")", "Token B (\"Good\")", "Token C (\"Okay\")", "Token D (\"Bad\")"];

  // Compute Softmax probabilities with Temperature scaling
  const probs = useMemo(() => {
    const scaledLogits = logits.map(z => z / (temp || 1e-6));
    const maxScaled = Math.max(...scaledLogits);
    const expValues = scaledLogits.map(z => Math.exp(z - maxScaled)); // numerical stability
    const sumExp = expValues.reduce((a, b) => a + b, 0);
    return expValues.map(v => v / sumExp);
  }, [logits, temp]);

  const updateLogit = (index: number, val: number) => {
    const copy = [...logits];
    copy[index] = val;
    setLogits(copy);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold uppercase tracking-wider mb-1">
          <BarChart3 className="h-4 w-4" /> Core Token Probability Distribution Function
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Softmax & Temperature Scaling Visualizer
        </h1>
        <p className="text-slate-400 mt-2 text-base leading-relaxed">
          The Softmax function turns unnormalized raw network output scores (logits) into a normalized probability distribution that sums to 1.0. Temperature scaling controls the sharpness or entropy of the resulting sampling distribution.
        </p>
      </div>

      {/* QUICK SECTION BOOKMARK NAVIGATION BAR */}
      <div className="sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border border-amber-500/40 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
          <Bookmark className="h-4 w-4 text-amber-400" />
          <span>Quick Section Bookmarks:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          <button
            onClick={() => document.getElementById('section-formula')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <MathFormula math="\text{Softmax}(z, T)" />
            <span className="font-semibold ml-2">1. Mathematical Formula</span>
          </button>

          <button
            onClick={() => document.getElementById('section-simulator')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-orange-500/20 text-slate-200 hover:text-orange-300 border border-slate-800 hover:border-orange-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <Sliders className="h-4 w-4 text-orange-400 shrink-0" />
            <span className="font-semibold">2. Live Interactive Simulator</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Formula */}
      <div id="section-formula" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-amber-400" /> MATHEMATICAL FORMULATION
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Softmax Function with Temperature Parameter (T)
          </h2>
        </div>

        <div className="bg-slate-950/90 p-5 rounded-2xl border border-amber-500/30 space-y-3">
          <div className="py-3 px-4 bg-slate-900 rounded-xl border border-amber-500/30 text-center font-mono text-amber-300 text-lg">
            <MathFormula math="P(y_i) = \text{Softmax}(z_i, T) = \frac{e^{z_i / T}}{\sum_{j=1}^V e^{z_j / T}}" block />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1">
            <span className="text-amber-400 font-bold block">T = 1.0 (Standard)</span>
            <p className="text-slate-300 font-sans">Default output distribution without logit scaling distortion.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 space-y-1">
            <span className="text-rose-400 font-bold block">Low T (0.1 - 0.5) → Greedy</span>
            <p className="text-slate-300 font-sans">Amplifies top logit gap. Distribution becomes sharp & deterministic.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-1">
            <span className="text-cyan-400 font-bold block">High T (1.5 - 5.0) → Random</span>
            <p className="text-slate-300 font-sans">Flattens probabilities towards uniform distribution. Increases creativity & randomness.</p>
          </div>
        </div>
      </div>

      {/* SECTION 2: Live Simulator */}
      <div id="section-simulator" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-8 border-orange-500/40 bg-gradient-to-br from-orange-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sliders className="h-5 w-5 text-orange-400" /> Live Interactive Logit & Temperature Sandbox
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Adjust raw logits <MathFormula math="z_i" /> and temperature <MathFormula math="T" /> to see live probability bar updates.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTemp(0.1)}
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-all"
            >
              T=0.1 (Greedy)
            </button>
            <button
              onClick={() => setTemp(1.0)}
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
            >
              T=1.0 (Normal)
            </button>
            <button
              onClick={() => setTemp(3.0)}
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all"
            >
              T=3.0 (Flat)
            </button>
          </div>
        </div>

        {/* Controls & Bars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Controls Column */}
          <div className="space-y-5 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            {/* Temperature Slider */}
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-amber-400" /> Temperature (T):
                </span>
                <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded text-sm">
                  T = {temp.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5.0"
                step="0.05"
                value={temp}
                onChange={(e) => setTemp(parseFloat(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Logits Sliders */}
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Adjust Raw Logits (z_i):
              </span>
              {logits.map((z, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">{tokenLabels[idx]}</span>
                    <span className="text-amber-400 font-bold">z_{idx + 1} = {z >= 0 ? `+${z.toFixed(2)}` : z.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-4.0"
                    max="5.0"
                    step="0.1"
                    value={z}
                    onChange={(e) => updateLogit(idx, parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Live Output Probability Bars */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
              Computed Softmax Probabilities P(y_i):
            </span>

            <div className="space-y-4">
              {probs.map((p, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-200 font-bold">{tokenLabels[idx]}</span>
                    <span className="text-amber-400 font-bold">{(p * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-300"
                      style={{ width: `${p * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-amber-500/30 text-[11px] text-amber-200 font-mono text-center">
              Sum of Probabilities: {(probs.reduce((a, b) => a + b, 0) * 100).toFixed(1)}%
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
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg"
        >
          <ArrowUp className="h-4 w-4 text-amber-400" />
          <span>Back to Top</span>
        </button>
      </div>
    </div>
  );
};
