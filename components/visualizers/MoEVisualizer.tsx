"use client";

import React, { useState, useMemo } from 'react';
import { getAssetPath } from '@/lib/asset';
import { MathFormula } from '@/components/ui/MathFormula';
import {
  Cpu,
  Bookmark,
  Sparkles,
  Sliders,
  Calculator,
  Layers,
  FileText,
  ExternalLink,
  Video,
  ArrowUp,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  GitBranch,
  Network,
  Share2,
  TrendingUp
} from 'lucide-react';

interface ExpertDef {
  id: number;
  name: string;
  domain: string;
  color: string;
  bgColor: string;
  borderColor: string;
  baseEmbeddings: Record<string, number>;
}

export const MoEVisualizer: React.FC = () => {
  // Sandbox State
  const [selectedToken, setSelectedToken] = useState<string>('bank_river');
  const [routingStrategy, setRoutingStrategy] = useState<'top1' | 'top2' | 'noisy' | 'deepseek'>('top2');
  const [noiseLevel, setNoiseLevel] = useState<number>(0.15);
  const [temperature, setTemperature] = useState<number>(1.0);

  // Sample Tokens Definition
  const tokens = [
    { id: 'bank_river', label: 'bank ("on the river bank")', context: 'Nature & Geography' },
    { id: 'bank_finance', label: 'bank ("deposit money at bank")', context: 'Finance & Economics' },
    { id: 'apple_tech', label: 'apple ("AAPL quarterly earnings")', context: 'Tech & Finance' },
    { id: 'apple_fruit', label: 'apple ("fresh orchard fruit")', context: 'Botany & Food' },
    { id: 'quantum_physics', label: 'quantum ("entangled qubit states")', context: 'Physics & Math' },
    { id: 'compiler_code', label: 'compiler ("LLVM AST optimization")', context: 'Computer Science' },
  ];

  // 6 Domain Experts Definition
  const experts: ExpertDef[] = [
    {
      id: 1,
      name: 'Expert 1: Financial & Legal',
      domain: 'Finance, Trading, Legal Contracts',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/40',
      baseEmbeddings: {
        bank_river: 0.1,
        bank_finance: 0.95,
        apple_tech: 0.85,
        apple_fruit: 0.05,
        quantum_physics: 0.15,
        compiler_code: 0.2,
      },
    },
    {
      id: 2,
      name: 'Expert 2: Ecology & Earth Science',
      domain: 'Geography, Rivers, Biology',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/40',
      baseEmbeddings: {
        bank_river: 0.92,
        bank_finance: 0.05,
        apple_tech: 0.05,
        apple_fruit: 0.88,
        quantum_physics: 0.1,
        compiler_code: 0.05,
      },
    },
    {
      id: 3,
      name: 'Expert 3: Software & Systems',
      domain: 'Compilers, Algorithms, Infrastructure',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/40',
      baseEmbeddings: {
        bank_river: 0.05,
        bank_finance: 0.2,
        apple_tech: 0.78,
        apple_fruit: 0.05,
        quantum_physics: 0.45,
        compiler_code: 0.96,
      },
    },
    {
      id: 4,
      name: 'Expert 4: Physics & Mathematics',
      domain: 'Quantum Mechanics, Matrix Algebra',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/40',
      baseEmbeddings: {
        bank_river: 0.05,
        bank_finance: 0.1,
        apple_tech: 0.2,
        apple_fruit: 0.1,
        quantum_physics: 0.95,
        compiler_code: 0.5,
      },
    },
    {
      id: 5,
      name: 'Expert 5: General Linguistics & Syntax',
      domain: 'Grammar, Punctuation, Connectives',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/40',
      baseEmbeddings: {
        bank_river: 0.4,
        bank_finance: 0.4,
        apple_tech: 0.35,
        apple_fruit: 0.35,
        quantum_physics: 0.3,
        compiler_code: 0.35,
      },
    },
    {
      id: 6,
      name: 'Expert 6: Agriculture & Nutrition',
      domain: 'Plants, Cooking, Crops',
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/40',
      baseEmbeddings: {
        bank_river: 0.45,
        bank_finance: 0.02,
        apple_tech: 0.02,
        apple_fruit: 0.94,
        quantum_physics: 0.05,
        compiler_code: 0.02,
      },
    },
  ];

  // Routing Computation Simulation
  const routingData = useMemo(() => {
    // Calculate raw logits for each expert for the chosen token
    const rawScores = experts.map((exp) => {
      const base = exp.baseEmbeddings[selectedToken] || 0.1;
      let noise = 0;
      if (routingStrategy === 'noisy') {
        // Pseudo-random deterministic noise based on token and expert id
        const seed = (exp.id * 17 + selectedToken.length * 13) % 100 / 100;
        noise = (seed - 0.5) * 2 * noiseLevel;
      }
      return (base + noise) / Math.max(0.1, temperature);
    });

    // Apply Softmax over raw scores
    const maxScore = Math.max(...rawScores);
    const expScores = rawScores.map((s) => Math.exp(s - maxScore));
    const sumExp = expScores.reduce((a, b) => a + b, 0);
    const softmaxProbs = expScores.map((s) => s / sumExp);

    // Determine Active Experts based on Strategy
    let activeIndices: number[] = [];
    let topKCount = 2;

    if (routingStrategy === 'top1') {
      topKCount = 1;
    } else if (routingStrategy === 'top2' || routingStrategy === 'noisy') {
      topKCount = 2;
    } else if (routingStrategy === 'deepseek') {
      topKCount = 2; // Top-2 fine-grained routed experts + 1 Shared Expert
    }

    // Sort indices by probability descending
    const sortedIndices = softmaxProbs
      .map((prob, idx) => ({ idx, prob }))
      .sort((a, b) => b.prob - a.prob);

    activeIndices = sortedIndices.slice(0, topKCount).map((item) => item.idx);

    // Re-normalize active probabilities for Top-K outputs
    const activeSum = activeIndices.reduce((acc, idx) => acc + softmaxProbs[idx], 0);
    const normalizedWeights = softmaxProbs.map((prob, idx) =>
      activeIndices.includes(idx) ? prob / (activeSum || 1) : 0
    );

    return {
      rawScores,
      softmaxProbs,
      activeIndices,
      normalizedWeights,
      sortedIndices,
    };
  }, [selectedToken, routingStrategy, noiseLevel, temperature]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-orange-400 text-sm font-semibold uppercase tracking-wider mb-1">
          <Cpu className="h-4 w-4" /> Training Optimization & Architectural Scaling
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Mixture of Experts (MoE)
        </h1>
        <p className="text-slate-400 mt-2 text-base leading-relaxed">
          Mixture of Experts (<strong className="text-orange-300">MoE</strong>) replaces standard dense Feed-Forward Networks (FFNs) in Transformers with dynamically routed expert sub-networks. By routing each token to a sparse subset of experts (e.g., Top-2 out of 8), MoE models scale parameter capacity exponentially (e.g. 47B parameters) while maintaining the compute latency and FLOPs of a much smaller model (e.g. 13B active).
        </p>
      </div>

      {/* QUICK SECTION BOOKMARK NAVIGATION BAR */}
      <div className="sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border border-orange-500/40 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-400">
          <Bookmark className="h-4 w-4 text-orange-400" />
          <span>Quick Section Navigation:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs font-mono">
          <button
            onClick={() => document.getElementById('section-motivation')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <TrendingUp className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span className="font-semibold truncate">1. Motivation</span>
          </button>

          <button
            onClick={() => document.getElementById('section-concept')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-orange-500/20 text-slate-200 hover:text-orange-300 border border-slate-800 hover:border-orange-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Sparkles className="h-3.5 w-3.5 text-orange-400 shrink-0" />
            <span className="font-semibold truncate">2. Concept</span>
          </button>

          <button
            onClick={() => document.getElementById('section-schematics')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Layers className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold truncate">3. Architecture</span>
          </button>

          <button
            onClick={() => document.getElementById('section-math')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Calculator className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="font-semibold truncate">4. Formulation</span>
          </button>

          <button
            onClick={() => document.getElementById('section-sandbox')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Sliders className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span className="font-semibold truncate">5. Sandbox</span>
          </button>

          <button
            onClick={() => document.getElementById('section-papers')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-indigo-500/20 text-slate-200 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <FileText className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <span className="font-semibold truncate">6. Papers</span>
          </button>

          <button
            onClick={() => document.getElementById('section-video')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-red-500/20 text-slate-200 hover:text-red-300 border border-slate-800 hover:border-red-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Video className="h-3.5 w-3.5 text-red-400 shrink-0" />
            <span className="font-semibold truncate">7. Video</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: MOTIVATION FOR MOE IN LLMS (SCALING LAWS & DATA WALL) */}
      <div id="section-motivation" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-purple-500/40 bg-gradient-to-br from-purple-950/30 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-purple-400" /> MOTIVATION FOR MOE IN LLMS & SCALING LAWS
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Overcoming the Data Wall via Parameter Scaling
            </h2>
            <p className="text-xs text-slate-300">
              Analyzing the 3 axes of LLM Scaling Laws (Kaplan et al., OpenAI 2020) and why MoE enables parameter scaling.
            </p>
          </div>

          <a
            href="https://arxiv.org/abs/2001.08361"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 transition-all flex items-center gap-1.5 shrink-0 self-start md:self-auto"
          >
            <ExternalLink className="h-4 w-4 text-purple-400" />
            <span>Kaplan et al. (2020) arXiv:2001.08361</span>
          </a>
        </div>

        {/* Motivation Schematic Image Container */}
        <div className="bg-slate-950 p-4 sm:p-6 rounded-2xl border border-purple-500/40 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono font-bold text-purple-300 flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-400" /> Scaling Laws Analysis: Compute vs. Dataset Size vs. Parameters
            </span>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
              OpenAI / Kaplan Scaling Laws Paradigm
            </span>
          </div>

          {/* Embedded Image Display */}
          <div className="rounded-xl overflow-hidden bg-white p-3 border border-slate-700 shadow-inner flex justify-center">
            <img
              src={getAssetPath('/images/moe_scaling_laws_motivation.png')}
              alt="Scaling Laws for Neural Language Models showing compute scaling driven by RL/CoT, dataset size crossed out due to internet data wall, and parameter scaling driven by Mixture-of-Experts"
              className="max-h-[380px] w-auto object-contain rounded"
            />
          </div>

          {/* 3 Scaling Pillars Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            {/* Compute Scaling */}
            <div className="p-4 bg-slate-900 rounded-xl border border-blue-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-blue-400 font-bold uppercase text-[11px]">1. Compute Scaling</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">RL & CoT</span>
              </div>
              <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                <strong className="text-white">Driven by RL & Reasoning:</strong> Scaling test-time compute through Chain-of-Thought (CoT) and Reinforcement Learning (e.g. DeepSeek-R1) allows models to solve harder problems by allocating more inference search.
              </p>
            </div>

            {/* Dataset Scaling (Data Wall) */}
            <div className="p-4 bg-slate-900 rounded-xl border border-rose-500/30 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-rose-400 font-bold uppercase text-[11px]">2. Dataset Size (Data Wall)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">LIMITED</span>
              </div>
              <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                <strong className="text-rose-400">The Internet Data Bottleneck:</strong> Scaling raw text dataset tokens <MathFormula math="D" /> has hit a hard ceiling because high-quality web text on the internet is finite (~10T–100T tokens). Simply pre-training longer on web data yields diminishing returns.
              </p>
            </div>

            {/* Parameter Scaling (MoE) */}
            <div className="p-4 bg-slate-900 rounded-xl border border-purple-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-purple-300 font-bold uppercase text-[11px]">3. Parameter Scaling</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">Mixture-of-Experts</span>
              </div>
              <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                <strong className="text-purple-300">Decoupled FLOPs & Parameters:</strong> MoE scales parameters <MathFormula math="N" /> to hundreds of billions or trillions without increasing per-token FLOPs. This allows pushing language loss <MathFormula math="L(N)" /> lower even when data scaling is constrained!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: CORE CONCEPT & ADVANTAGES */}
      <div id="section-concept" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-orange-500/40 bg-gradient-to-br from-orange-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-orange-400" /> PARADIGM SHIFT IN LLM COMPUTATIONAL SCALING
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Why Mixture of Experts (MoE) Outperforms Dense Transformers
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Comparing standard dense feed-forward parameter activation against conditional sparse expert routing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dense Transformer */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-rose-500/30 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-bold text-rose-300 text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-400" /> Dense Transformer (e.g. LLaMA 70B)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  100% Parameter Activation
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
                <p>• <strong className="text-white">Mechanism:</strong> Every single token passes through every feed-forward weight matrix in every layer.</p>
                <p>• <strong className="text-rose-400 font-bold">FLOPs Memory Coupling:</strong> Scaling model parameter count <MathFormula math="N" /> directly increases inference FLOPs and latency <MathFormula math="O(N)" />.</p>
                <p>• <strong className="text-rose-400 font-bold">Redundant Capacity:</strong> Simple tokens (e.g., punctuation or stop words) waste the exact same compute as complex mathematical reasoning tokens.</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-rose-300 space-y-1">
              <span className="block font-bold text-rose-400 uppercase text-[10px]">Inference Cost Bottleneck:</span>
              <p className="text-slate-300 font-sans">Doubling parameters doubles latency and GPU inference cost per token generated.</p>
            </div>
          </div>

          {/* Sparse MoE Transformer */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-orange-500/40 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-bold text-orange-300 text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-orange-400" /> Sparse MoE Transformer (e.g. Mixtral 8x7B)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  Sparse Conditional Routing
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
                <p>• <strong className="text-white">Mechanism:</strong> A learned Gating Network <MathFormula math="G(x)" /> evaluates the token context and routes it to only <MathFormula math="K" /> experts (e.g. <MathFormula math="K=2" /> out of 8).</p>
                <p>• <strong className="text-orange-300 font-bold">Sub-Linear Inference Latency:</strong> Total parameters scale to 47B, but per-token inference FLOPs equal a small 13B model!</p>
                <p>• <strong className="text-orange-300 font-bold">Specialized Capacity:</strong> Different experts specialize in distinct domains (syntax, math, coding, humanities) dynamically.</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-orange-300 space-y-1">
              <span className="block font-bold text-orange-400 uppercase text-[10px]">Efficiency Advantage:</span>
              <p className="text-slate-300 font-sans">Pre-training & inference speed of a 13B model with the knowledge capacity of a 47B model!</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: SCHEMATIC DIAGRAMS & ARCHITECTURE */}
      <div id="section-schematics" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-amber-400" /> SCHEMATIC ARCHITECTURE DIAGRAMS
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Visualizing Expert Selection & Transformer FFN Replacement
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Understanding how token hidden states route through the gating network into active expert sub-networks.
          </p>
        </div>

        {/* Foundational MoE Concepts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Schematic Image 1 */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/40 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-bold text-amber-300 text-sm flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-amber-400" /> 1. Expert Selection & Gating Network
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <MathFormula math="K = 2" /> Active Experts
                </span>
              </div>

              <div className="rounded-xl overflow-hidden bg-slate-900 p-2 border border-slate-800 flex justify-center">
                <img
                  src={getAssetPath('/images/moe_gating_expert_selection.png')}
                  alt="MoE schematic showing token input x routed through gating network selecting Expert 1 and Expert 3 out of N experts with weighted sum output y = sum(G(x)_i * E_i(x))"
                  className="max-h-[340px] w-auto object-contain rounded"
                />
              </div>

              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <span className="font-mono font-bold text-amber-400 block text-[11px] uppercase">Diagram Breakdown:</span>
                <p>
                  1. Input hidden state <MathFormula math="x" /> is fed simultaneously to the <strong className="text-white">Gating Network</strong> and all Expert blocks.
                </p>
                <p>
                  2. The Gating Network computes softmax probabilities <MathFormula math="G(x)_i" /> and selects the <strong className="text-amber-300">Top-2 active experts</strong> (e.g. Expert 1 and Expert 3).
                </p>
                <p>
                  3. Non-selected experts (Expert 2, ..., Expert N) remain inactive (<MathFormula math="G(x)_i = 0" />), saving compute. Output is calculated as <MathFormula math="y = \sum_i G(x)_i E_i(x)" />.
                </p>
              </div>
            </div>
          </div>

          {/* Schematic Image 2 */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-cyan-500/40 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-bold text-cyan-300 text-sm flex items-center gap-2">
                  <Network className="h-4 w-4 text-cyan-400" /> 2. MoE Layer as Transformer FFN Replacement
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Token Routing (&quot;bank&quot;)
                </span>
              </div>

              <div className="rounded-xl overflow-hidden bg-slate-900 p-2 border border-slate-800 flex justify-center">
                <img
                  src={getAssetPath('/images/moe_in_transformer_ffn.png')}
                  alt="MoE layer inside Transformer block replacing feed forward network with gating network routing tokens like 'on the river bank' to Expert 1"
                  className="max-h-[340px] w-auto object-contain rounded"
                />
              </div>

              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <span className="font-mono font-bold text-cyan-400 block text-[11px] uppercase">Diagram Breakdown:</span>
                <p>
                  1. Input sequence <code className="text-cyan-300 font-mono">&quot;on the river bank&quot;</code> passes through the standard Transformer <strong className="text-white">Self-Attention layer</strong>.
                </p>
                <p>
                  2. Instead of passing into a single static Feed-Forward Network, the contextualized representation for <code className="text-amber-300 font-mono">&quot;bank&quot;</code> (informed by <code className="text-emerald-300 font-mono">&quot;river&quot;</code>) enters the <strong className="text-cyan-300">MoE Layer</strong>.
                </p>
                <p>
                  3. The Gating Network recognizes the geographical context (&quot;nature&quot;) and routes <code className="text-amber-300 font-mono">&quot;bank&quot;</code> to <strong className="text-amber-400">Expert 1</strong> (Nature/Ecology expert).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MODERN LLM MOE ARCHITECTURES COMPARISON HEADER */}
        <div className="pt-6 border-t border-slate-800/80 space-y-2">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Share2 className="h-4 w-4 text-emerald-400" /> MODERN LLM ARCHITECTURE VARIATIONS
          </span>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            DeepSeek-MoE (Shared Expert) vs. Mistral AI (Multiple Experts)
          </h3>
          <p className="text-xs text-slate-300">
            Comparing fine-grained shared expert isolation in DeepSeek-MoE with standard coarse expert routing in Mistral AI.
          </p>
        </div>

        {/* Modern LLM Architecture Schematics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* DeepSeek-MoE Schematic (Shared Expert) */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/40 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-bold text-emerald-300 text-sm flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-emerald-400" /> 3. DeepSeek-MoE: Shared Expert + Fine-Grained Routing
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  DeepSeekMoE
                </span>
              </div>

              <div className="rounded-xl overflow-hidden bg-slate-900 p-2 border border-slate-800 flex justify-center">
                <img
                  src={getAssetPath('/images/moe_deepseek_shared_expert.png')}
                  alt="DeepSeek-MoE architecture showing multiple fine-grained experts with active Expert 5 and Expert 11 plus a dedicated Shared Expert receiving input x unconditionally"
                  className="max-h-[340px] w-auto object-contain rounded"
                />
              </div>

              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <span className="font-mono font-bold text-emerald-400 block text-[11px] uppercase">DeepSeek Architectural Key Features:</span>
                <p>
                  1. <strong className="text-white">Fine-Grained Expert Segmentation:</strong> Splits total layer capacity into many smaller experts (e.g. 16 or 64 experts). The router activates <MathFormula math="K=2" /> fine-grained experts (e.g. Expert 5 and Expert 11).
                </p>
                <p>
                  2. <strong className="text-rose-400 font-bold">Dedicated Shared Expert:</strong> A fixed <strong className="text-rose-300">Shared Expert</strong> unconditionally receives input representation <MathFormula math="x" /> for every single token without routing.
                </p>
                <p>
                  3. <strong className="text-emerald-300 font-bold">Redundancy Isolation:</strong> Captures common linguistic structures & syntax in the shared expert, leaving routed experts free to achieve ultimate domain specialization! Output: <MathFormula math="y = \sum_{i \in \text{TopK}} G(x)_i E_i(x) + E_{\text{shared}}(x)" />.
                </p>
              </div>
            </div>
          </div>

          {/* Mistral AI Mixtral Schematic */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-orange-500/40 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-bold text-orange-300 text-sm flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-orange-400" /> 4. Mistral AI (Mixtral): Multiple Coarse Experts
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 font-bold">
                  Mistral AI 8x7B
                </span>
              </div>

              <div className="rounded-xl overflow-hidden bg-slate-900 p-2 border border-slate-800 flex justify-center">
                <img
                  src={getAssetPath('/images/moe_mistral_mixtral.png')}
                  alt="Mistral AI Mixtral architecture showing 8 coarse experts with Top-2 active routing selecting Expert 3 and Expert 6"
                  className="max-h-[340px] w-auto object-contain rounded"
                />
              </div>

              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <span className="font-mono font-bold text-orange-400 block text-[11px] uppercase">Mistral AI Architectural Key Features:</span>
                <p>
                  1. <strong className="text-white">Coarse Expert Design:</strong> Utilizes 8 larger expert sub-networks per layer (each with 7B parameter capacity).
                </p>
                <p>
                  2. <strong className="text-orange-300 font-bold">Top-2 Sparse Routing:</strong> The Gating Network evaluates input <MathFormula math="x" /> and selects exactly 2 experts (e.g. Expert 3 and Expert 6) per token.
                </p>
                <p>
                  3. <strong className="text-amber-300 font-bold">Pure Sparse Gating:</strong> Does not use a dedicated shared expert. Active experts must handle both general language syntax and specialized context simultaneously. Output: <MathFormula math="y = \sum_{i \in \{3, 6\}} G(x)_i E_i(x)" />.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: MATHEMATICAL FORMULATION & LOAD BALANCING */}
      <div id="section-math" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
              <Calculator className="h-4 w-4 text-cyan-400" /> FORMAL MATHEMATICAL SPECIFICATION
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Noisy Top-K Gating & Auxiliary Load Balancing Loss
            </h2>
            <p className="text-xs text-slate-300">
              Mathematical equations governing sparse expert gating, noise injection, and preventing expert collapse during training.
            </p>
          </div>

          <a
            href="https://arxiv.org/abs/1701.06538"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 transition-all flex items-center gap-1.5 shrink-0 self-start md:self-auto"
          >
            <ExternalLink className="h-4 w-4 text-indigo-400" />
            <span>Shazeer et al. (2017) arXiv:1701.06538</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-mono">
          {/* Formula 1 */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-orange-500/30 space-y-3 shadow-xl">
            <span className="text-orange-400 font-bold block uppercase text-xs">1. MoE Layer Output Sum</span>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <MathFormula math="y = \sum_{i=1}^N G(x)_i E_i(x)" block />
            </div>
            <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
              Weighted linear combination of expert outputs <MathFormula math="E_i(x)" />, where <MathFormula math="G(x)_i" /> is zero for all experts outside the Top-K set.
            </p>
          </div>

          {/* Formula 2 */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-cyan-400 font-bold uppercase text-xs">2. Noisy Top-K Gating</span>
              <a
                href="https://arxiv.org/abs/1701.06538"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
              >
                <span>arXiv:1701.06538</span> <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <MathFormula math="G(x) = \text{Softmax}\left(\text{KeepTopK}\left(H(x), K\right)\right)" block />
              <MathFormula math="H(x)_i = (x \cdot W_g)_i + \epsilon \cdot \text{Softplus}\left((x \cdot W_{\text{noise}})_i\right)" block />
            </div>
            <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
              Pioneered by <strong className="text-white">Shazeer et al. (2017)</strong>. Injects tunable standard normal noise <MathFormula math="\epsilon \sim \mathcal{N}(0, 1)" /> before Top-K selection to encourage exploration across experts.
            </p>
          </div>

          {/* Formula 3 */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-3 shadow-xl">
            <span className="text-purple-400 font-bold block uppercase text-xs">3. Auxiliary Load Balancing Loss</span>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <MathFormula math="\mathcal{L}_{\text{balance}} = \alpha \cdot N \sum_{i=1}^N f_i P_i" block />
            </div>
            <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
              Penalizes unequal expert assignment, where <MathFormula math="f_i" /> is the fraction of tokens routed to expert <MathFormula math="i" /> and <MathFormula math="P_i" /> is the average routing probability.
            </p>
          </div>
        </div>

        {/* Deep Dive Callout Box: Expert Collapse & Load Balancing */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-950 to-slate-950 border border-purple-500/40 space-y-3 shadow-xl text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="font-mono font-bold text-purple-300 text-sm flex items-center gap-2">
              <AlertTriangle className="h-4.5 w-4.5 text-purple-400" /> Deep Dive: Expert Collapse & Why Load Balancing is Essential
            </span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
              Training Dynamics
            </span>
          </div>

          <div className="space-y-2 text-slate-300 leading-relaxed font-sans">
            <p>
              <strong className="text-rose-400 font-mono uppercase">The Winner-Takes-All Problem (Expert Collapse):</strong> During early gradient training, a few experts inevitably receive slightly higher initial weights. Left unchecked, the Gating Network will repeatedly route almost <em>all</em> tokens to those few initial experts. The unselected experts receive zero gradients, never learn, and starve to death — collapsing an 8-expert model into effectively a 1-expert model!
            </p>
            <p>
              <strong className="text-cyan-300 font-mono uppercase">The Solution: Auxiliary Load Balancing Loss:</strong> Adding <MathFormula math="\mathcal{L}_{\text{balance}}" /> penalizes routing imbalance. If expert <MathFormula math="i" /> receives too many tokens (<MathFormula math="f_i \uparrow" />), the auxiliary loss forces the router to redistribute tokens to under-utilized experts, ensuring all experts learn distinct specialized representations.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 4: INTERACTIVE MOE ROUTING SANDBOX */}
      <div id="section-sandbox" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-purple-500/40 bg-gradient-to-br from-purple-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Sliders className="h-4 w-4 text-purple-400" /> INTERACTIVE EXPERT ROUTING SIMULATOR
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Live MoE Gating & Token Routing Sandbox
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Test token contexts, switch routing algorithms (Top-1, Top-2, Noisy, DeepSeek Shared), and observe real-time expert weight distribution.
          </p>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-5 rounded-2xl border border-slate-800">
          {/* Token Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
              1. Select Input Context Token (x):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {tokens.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedToken(t.id)}
                  className={`p-2.5 rounded-xl text-left border text-xs font-mono transition-all ${
                    selectedToken === t.id
                      ? 'bg-orange-500/20 border-orange-500/60 text-white font-bold shadow'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="truncate">{t.label}</div>
                  <div className="text-[10px] text-slate-500">{t.context}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Strategy Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
                2. Routing Strategy Algorithm:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  onClick={() => setRoutingStrategy('top1')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    routingStrategy === 'top1'
                      ? 'bg-purple-500/20 border-purple-500/60 text-purple-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Top-1 (Switch Transformer)
                </button>

                <button
                  onClick={() => setRoutingStrategy('top2')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    routingStrategy === 'top2'
                      ? 'bg-orange-500/20 border-orange-500/60 text-orange-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Top-2 (Mixtral Standard)
                </button>

                <button
                  onClick={() => setRoutingStrategy('noisy')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    routingStrategy === 'noisy'
                      ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Noisy Top-K (Shazeer 2017)
                </button>

                <button
                  onClick={() => setRoutingStrategy('deepseek')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    routingStrategy === 'deepseek'
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  DeepSeek-MoE (Shared + Fine)
                </button>
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-1 border-t border-slate-800">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Gating Temp (T):</span>
                  <span className="text-orange-400 font-bold">{temperature.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="2.0"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Noise Level (&epsilon;):</span>
                  <span className="text-cyan-400 font-bold">{noiseLevel.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.5"
                  step="0.05"
                  disabled={routingStrategy !== 'noisy'}
                  value={noiseLevel}
                  onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer disabled:opacity-30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Expert Routing Output Breakdown */}
        <div className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <span className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4 text-orange-400" /> Live Expert Softmax Probability & Output Weight Distribution
            </span>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 text-orange-300 border border-slate-800">
              Active Experts: {routingData.activeIndices.length} {routingStrategy === 'deepseek' ? '+ 1 Shared Expert' : ''}
            </span>
          </div>

          {/* DeepSeek Shared Expert Special Banner if DeepSeek selected */}
          {routingStrategy === 'deepseek' && (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <Share2 className="h-5 w-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-emerald-300 font-bold block">DeepSeek-MoE Shared Expert Isolation Enabled:</span>
                  <span className="text-slate-300 font-sans text-[11px]">
                    Shared Expert 0 processes 100% of all tokens unconditionally to capture common language structure & syntax.
                  </span>
                </div>
              </div>
              <span className="text-emerald-400 font-bold px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/30 shrink-0">
                Weight: 1.0 (Fixed Shared)
              </span>
            </div>
          )}

          {/* Expert Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {experts.map((exp, idx) => {
              const isActive = routingData.activeIndices.includes(idx);
              const prob = routingData.softmaxProbs[idx];
              const normalizedW = routingData.normalizedWeights[idx];

              return (
                <div
                  key={exp.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isActive
                      ? `${exp.bgColor} ${exp.borderColor} shadow-lg shadow-orange-500/10`
                      : 'bg-slate-900/40 border-slate-800/80 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-bold ${isActive ? exp.color : 'text-slate-400'}`}>
                      {exp.name}
                    </span>
                    {isActive ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> ACTIVE
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800">
                        OFF
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 mb-3 truncate">{exp.domain}</p>

                  {/* Progress Bar for Raw Softmax */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-400">Router Prob G(x)_i:</span>
                      <span className={`font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>
                        {(prob * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all duration-300 ${isActive ? 'bg-orange-400' : 'bg-slate-700'}`}
                        style={{ width: `${Math.min(100, prob * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Normalized Weight for Active Expert */}
                  {isActive && (
                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex justify-between items-center text-[11px] font-mono">
                      <span className="text-slate-400">Layer Weight Contribution:</span>
                      <span className="font-bold text-orange-300">{(normalizedW * 100).toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mathematical Output Evaluation Result */}
          <div className="p-4 bg-slate-900 rounded-xl border border-orange-500/30 text-xs font-mono space-y-2">
            <span className="text-orange-400 font-bold block uppercase text-[11px]">
              Combined Layer Output Formula Evaluation:
            </span>
            <div className="text-slate-200 overflow-x-auto">
              <MathFormula
                math={`y = ${routingData.activeIndices
                  .map((idx) => `${(routingData.normalizedWeights[idx]).toFixed(2)} \\cdot E_{${idx + 1}}(x)`)
                  .join(' + ')} ${routingStrategy === 'deepseek' ? '+ 1.00 \\cdot E_{\\text{shared}}(x)' : ''}`}
                block
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: RESEARCH PAPERS */}
      <div id="section-papers" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-indigo-500/40 bg-gradient-to-br from-indigo-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-indigo-400" /> FOUNDATIONAL RESEARCH PUBLICATIONS
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Key Landmark Papers in Mixture of Experts & Scaling Laws
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Four foundational papers defining the motivation, mathematics, and architectural evolution of sparse expert models.
          </p>
        </div>

        <div className="space-y-4">
          {/* Paper 0: Kaplan et al. 2020 (Scaling Laws) */}
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-all space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <div>
                <span className="text-[11px] font-mono text-purple-400 font-bold uppercase tracking-wider block">
                  1. The Scaling Laws Paradigm (Kaplan et al., 2020 - OpenAI)
                </span>
                <h3 className="text-base font-bold text-white">
                  Scaling Laws for Neural Language Models
                </h3>
              </div>
              <a
                href="https://arxiv.org/abs/2001.08361"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <ExternalLink className="h-3.5 w-3.5 text-purple-400" />
                <span>arXiv:2001.08361</span>
              </a>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Established power-law scaling relationships between cross-entropy loss and model parameters (<MathFormula math="N" />), dataset size (<MathFormula math="D" />), and compute (<MathFormula math="C" />). Proved that performance improves predictably with parameter count, providing the core theoretical motivation for MoE sparse parameter scaling when web data approaches a hard ceiling.
            </p>
          </div>

          {/* Paper 1: Shazeer et al. 2017 */}
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <div>
                <span className="text-[11px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">
                  2. The Pioneer Sparsely-Gated Paper (Shazeer et al., 2017 - Google Brain)
                </span>
                <h3 className="text-base font-bold text-white">
                  Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer
                </h3>
              </div>
              <a
                href="https://arxiv.org/abs/1701.06538"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <ExternalLink className="h-3.5 w-3.5 text-indigo-400" />
                <span>arXiv:1701.06538</span>
              </a>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Introduced the modern Sparsely-Gated MoE layer with Noisy Top-K gating and auxiliary load balancing loss, scaling LSTM model capacity up to 137B parameters with over 1000x improvements in model capacity at small computational cost.
            </p>
          </div>

          {/* Paper 2: Mixtral 8x7B (Jiang et al. 2024) */}
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 hover:border-orange-500/40 transition-all space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <div>
                <span className="text-[11px] font-mono text-orange-400 font-bold uppercase tracking-wider block">
                  2. The Open Frontier Landmark (Jiang et al., 2024 - Mistral AI)
                </span>
                <h3 className="text-base font-bold text-white">
                  Mixtral of Experts
                </h3>
              </div>
              <a
                href="https://arxiv.org/abs/2401.04088"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/40 transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <ExternalLink className="h-3.5 w-3.5 text-orange-400" />
                <span>arXiv:2401.04088</span>
              </a>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Demonstrated open-source MoE supremacy with Mixtral 8x7B (47B total parameters, Top-2 routing with 13B active per token). Outperformed LLaMA 2 70B on mathematics, coding, and reasoning benchmarks with 6x faster inference speed.
            </p>
          </div>

          {/* Paper 3: DeepSeek-MoE (Dai et al. 2024) */}
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                  3. Ultimate Expert Specialization (Dai et al., 2024 - DeepSeek)
                </span>
                <h3 className="text-base font-bold text-white">
                  DeepSeek-MoE: Towards Ultimate Expert Specialization in Mixture-of-Experts Language Models
                </h3>
              </div>
              <a
                href="https://arxiv.org/abs/2401.06066"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
                <span>arXiv:2401.06066</span>
              </a>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Pioneered two innovations: 1) <strong className="text-white">Fine-grained expert segmentation</strong> (splitting coarse experts into smaller sub-experts for higher specialization flexibility), and 2) <strong className="text-emerald-300">Shared Expert Isolation</strong> (dedicating fixed shared experts to compress common knowledge, preventing redundancy across routed experts).
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 6: VIDEO EXPLAINER */}
      <div id="section-video" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-red-500/30 bg-gradient-to-br from-red-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Video className="h-4 w-4 text-red-500" /> VIDEO EXPLAINER & DEEP DIVE
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Mixture of Experts (MoE) Explained
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Watch this video walkthrough explaining sparse gating, expert specialization, and MoE Transformer architecture.
            </p>
          </div>
          <a
            href="https://www.youtube.com/watch?v=7yR5ScbK1qk"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 transition-all flex items-center gap-2 self-start md:self-auto shrink-0"
          >
            <ExternalLink className="h-4 w-4 text-red-400" />
            <span>Open on YouTube</span>
          </a>
        </div>

        {/* Embedded YouTube Video Player */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-red-500/30 bg-slate-950 shadow-2xl">
          <iframe
            src="https://www.youtube.com/embed/7yR5ScbK1qk"
            title="Mixture of Experts (MoE) Explained Video Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full rounded-2xl border-0"
          />
        </div>
      </div>

      {/* Footer Back to Top Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-orange-500/20 text-slate-300 hover:text-orange-300 border border-slate-800 hover:border-orange-500/40 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg"
        >
          <ArrowUp className="h-4 w-4 text-orange-400" />
          <span>Back to Top</span>
        </button>
      </div>
    </div>
  );
};
