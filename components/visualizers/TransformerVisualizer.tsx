"use client";

import React, { useState } from 'react';
import { MathFormula } from '@/components/ui/MathFormula';
import { 
  Cpu, 
  Sliders, 
  Layers, 
  Sparkles, 
  Bookmark, 
  ArrowUp,
  Grid,
  Zap,
  BookOpen
} from 'lucide-react';

export const TransformerVisualizer: React.FC = () => {
  const [dModel, setDModel] = useState<number>(512);
  const [numHeads, setNumHeads] = useState<number>(8);
  const [seqLen, setSeqLen] = useState<number>(4);
  const [activeTab, setActiveTab] = useState<'attention' | 'pos' | 'ffn'>('attention');

  const dk = Math.floor(dModel / numHeads);

  // Sample tokens for attention matrix demo
  const sampleTokens = ["The", "cat", "sat", "mat"];
  
  // Dummy attention matrix (4x4)
  const attentionWeights = [
    [0.85, 0.05, 0.05, 0.05],
    [0.10, 0.70, 0.15, 0.05],
    [0.05, 0.40, 0.45, 0.10],
    [0.05, 0.10, 0.25, 0.60],
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-1">
          <Cpu className="h-4 w-4" /> Core LLM Architecture (Vaswani et al.)
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Transformer Architecture Visualizer
        </h1>
        <p className="text-slate-400 mt-2 text-base leading-relaxed">
          The Transformer forms the backbone of modern LLMs. It replaces sequential recurrent networks with parallelized multi-head self-attention mechanisms that calculate token relationships directly across sequences.
        </p>
      </div>

      {/* QUICK SECTION BOOKMARK NAVIGATION BAR */}
      <div className="sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border border-cyan-500/40 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
          <Bookmark className="h-4 w-4 text-cyan-400" />
          <span>Quick Section Bookmarks:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
          <button
            onClick={() => document.getElementById('section-attention')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <Grid className="h-4 w-4 text-cyan-400 shrink-0" />
            <span className="font-semibold">1. Scaled Dot-Product Attention</span>
          </button>

          <button
            onClick={() => document.getElementById('section-pos')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-indigo-500/20 text-slate-200 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <Layers className="h-4 w-4 text-indigo-400 shrink-0" />
            <span className="font-semibold">2. Positional Encodings</span>
          </button>

          <button
            onClick={() => document.getElementById('section-ffn')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <Cpu className="h-4 w-4 text-purple-400 shrink-0" />
            <span className="font-semibold">3. Multi-Head & FFN Layer</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Scaled Dot-Product Attention */}
      <div id="section-attention" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-8 border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Grid className="h-4 w-4 text-cyan-400" /> SELF-ATTENTION MECHANISM
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Scaled Dot-Product Attention
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Query (<MathFormula math="Q" />), Key (<MathFormula math="K" />), and Value (<MathFormula math="V" />) matrices map relationships between every pair of tokens in a sequence.
          </p>
        </div>

        {/* Formula Box */}
        <div className="bg-slate-950/90 p-5 rounded-2xl border border-cyan-500/30 space-y-3">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
            Attention Formula:
          </span>
          <div className="py-3 px-4 bg-slate-900 rounded-xl border border-cyan-500/30 text-center font-mono text-cyan-300">
            <MathFormula math="\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V" block />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Where <MathFormula math="d_k" /> is the dimension of the key vectors. Dividing by <MathFormula math="\sqrt{d_k}" /> prevents dot products from growing excessively large for high dimensions, avoiding vanishing gradients in the softmax.
          </p>
        </div>

        {/* Interactive Attention Heatmap Demo */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider">
              Interactive Token-to-Token Attention Weight Heatmap
            </h3>
            <span className="text-xs font-mono text-slate-400">Sample Sequence: &quot;The cat sat mat&quot;</span>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 overflow-x-auto space-y-4">
            <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
              <div className="p-2 font-bold text-slate-500">Query \ Key</div>
              {sampleTokens.map((t, idx) => (
                <div key={idx} className="p-2 font-bold text-cyan-400 bg-cyan-950/20 rounded-lg border border-cyan-500/30">
                  {t}
                </div>
              ))}

              {sampleTokens.map((rowToken, rIdx) => (
                <React.Fragment key={rIdx}>
                  <div className="p-2 font-bold text-purple-400 bg-purple-950/20 rounded-lg border border-purple-500/30 flex items-center justify-center">
                    {rowToken}
                  </div>
                  {sampleTokens.map((_, cIdx) => {
                    const weight = attentionWeights[rIdx][cIdx];
                    const opacity = Math.max(0.15, weight);
                    return (
                      <div
                        key={cIdx}
                        className="p-3 rounded-lg border flex flex-col items-center justify-center transition-all hover:scale-105"
                        style={{
                          backgroundColor: `rgba(6, 182, 212, ${opacity * 0.4})`,
                          borderColor: `rgba(6, 182, 212, ${opacity * 0.8})`,
                        }}
                      >
                        <span className="font-mono font-bold text-white text-xs">{(weight * 100).toFixed(0)}%</span>
                        <span className="text-[10px] text-slate-400 font-mono">w={weight.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Positional Encodings */}
      <div id="section-pos" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-indigo-500/40 bg-gradient-to-br from-indigo-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-indigo-400" /> SEQUENCE ORDER PRESERVATION
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Sinusoidal Positional Encodings
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Because self-attention operates permutation-invariantly over token sets, sinusoidal functions add position-aware signals directly into input embeddings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-slate-950 p-5 rounded-2xl border border-indigo-500/30 space-y-3">
            <span className="font-mono font-bold text-indigo-300 uppercase tracking-wider block">Sine & Cosine Formulation</span>
            <div className="p-3 bg-slate-900 rounded-xl font-mono text-center text-indigo-300 space-y-2">
              <MathFormula math="PE_{(pos, 2i)} = \sin\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)" block />
              <MathFormula math="PE_{(pos, 2i+1)} = \cos\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)" block />
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 text-slate-300">
            <span className="font-mono font-bold text-slate-200 uppercase tracking-wider block">Why Sinusoidal?</span>
            <p className="leading-relaxed">
              Allows the model to easily learn relative positions because for any fixed offset <MathFormula math="k" />, <MathFormula math="PE_{pos+k}" /> can be expressed as a linear function of <MathFormula math="PE_{pos}" />.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: Multi-Head & FFN Layer Controls */}
      <div id="section-ffn" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-purple-500/40 bg-gradient-to-br from-purple-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Cpu className="h-4 w-4 text-purple-400" /> HYPERPARAMETER CONFIGURATOR
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Multi-Head Attention & Head Dimension Calculator
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">Embedding Dim (d_model)</span>
            <input
              type="range"
              min="256"
              max="4096"
              step="256"
              value={dModel}
              onChange={(e) => setDModel(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <span className="font-mono font-bold text-cyan-400 text-lg block">{dModel}</span>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">Attention Heads (h)</span>
            <input
              type="range"
              min="2"
              max="32"
              step="2"
              value={numHeads}
              onChange={(e) => setNumHeads(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <span className="font-mono font-bold text-purple-400 text-lg block">{numHeads} heads</span>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-purple-500/30 space-y-2 text-xs font-mono flex flex-col justify-between">
            <span className="text-slate-400">Head Dimension (d_k = d_model / h):</span>
            <span className="text-2xl font-black text-emerald-400">{dk}</span>
            <span className="text-[10px] text-slate-500 block">Each head projects vectors into {dk}-dim subspaces.</span>
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
