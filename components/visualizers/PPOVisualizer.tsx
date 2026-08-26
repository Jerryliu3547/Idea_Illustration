"use client";

import React, { useState, useMemo } from 'react';
import { MathFormula } from '@/components/ui/MathFormula';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine, 
  ReferenceArea 
} from 'recharts';
import { 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Cpu,
  Coins,
  TrendingUp,
  Maximize2,
  ZoomIn,
  X,
  BookOpen,
  GitCompare,
  Calculator
} from 'lucide-react';

export const PPOVisualizer: React.FC = () => {
  // Modal Lightbox state for schematic image zoom
  const [activeModalImage, setActiveModalImage] = useState<{ src: string; title: string } | null>(null);

  // Sliders state for PPO Clipped Objective
  const [ratio, setRatio] = useState<number>(1.25);
  const [advantage, setAdvantage] = useState<number>(1.0);
  const [epsilon, setEpsilon] = useState<number>(0.2);

  // GAE Interactive Calculator state
  const [gaeLambda, setGaeLambda] = useState<number>(0.95);
  const [gaeGamma, setGaeGamma] = useState<number>(0.99);

  // Sample sequence for GAE calculation
  const sampleTrajectory = useMemo(() => [
    { t: 1, reward: 0.20, val: 0.30, nextVal: 0.60 },
    { t: 2, reward: 0.50, val: 0.60, nextVal: 0.90 },
    { t: 3, reward: 0.80, val: 0.90, nextVal: 1.10 },
    { t: 4, reward: 1.50, val: 1.10, nextVal: 0.00 }, // Terminal step
  ], []);

  // Compute GAE step-by-step
  const gaeCalculations = useMemo(() => {
    // Step 1: Compute 1-step TD errors delta_t = r_t + gamma * V_{t+1} - V_t
    const deltas = sampleTrajectory.map(step => {
      return step.reward + gaeGamma * step.nextVal - step.val;
    });

    // Step 2: Compute GAE advantages backwards
    const advantages: number[] = new Array(deltas.length).fill(0);
    let gaeAcc = 0;
    for (let t = deltas.length - 1; t >= 0; t--) {
      gaeAcc = deltas[t] + gaeGamma * gaeLambda * gaeAcc;
      advantages[t] = gaeAcc;
    }

    return sampleTrajectory.map((step, idx) => ({
      ...step,
      delta: parseFloat(deltas[idx].toFixed(4)),
      gaeAdvantage: parseFloat(advantages[idx].toFixed(4)),
    }));
  }, [sampleTrajectory, gaeGamma, gaeLambda]);

  // Computed values for current selected ratio in PPO graph
  const unclippedLoss = ratio * advantage;
  const clippedRatio = Math.max(1 - epsilon, Math.min(1 + epsilon, ratio));
  const clippedLoss = clippedRatio * advantage;
  const finalObjective = Math.min(unclippedLoss, clippedLoss);

  const clippingActive = unclippedLoss > clippedLoss;

  // Generate data points for Recharts graph
  const graphData = useMemo(() => {
    const data = [];
    for (let r = 0.4; r <= 1.8; r += 0.02) {
      const currentR = parseFloat(r.toFixed(2));
      const unclipped = currentR * advantage;
      const clippedR = Math.max(1 - epsilon, Math.min(1 + epsilon, currentR));
      const clipped = clippedR * advantage;
      const ppoObj = Math.min(unclipped, clipped);

      data.push({
        ratio: currentR,
        unclipped: parseFloat(unclipped.toFixed(3)),
        clipped: parseFloat(clipped.toFixed(3)),
        ppoObjective: parseFloat(ppoObj.toFixed(3)),
      });
    }
    return data;
  }, [advantage, epsilon]);

  return (
    <div className="space-y-10 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-1">
          <Sliders className="h-4 w-4" /> Policy Gradient Stabilization & Architecture
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          PPO (Proximal Policy Optimization) & RLHF Architecture
        </h1>
        <p className="text-slate-400 mt-2 text-base leading-relaxed flex items-center gap-1 flex-wrap">
          PPO stabilizes policy updates using clipped surrogate objectives, guided by a <strong>Value Model</strong> (Critic), a <strong>Reward Model</strong>, and <strong>GAE (Generalized Advantage Estimation)</strong>.
        </p>
      </div>

      {/* SECTION 1: ARCHITECTURE SCHEMATIC (PPO vs GRPO) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-indigo-500/40 bg-gradient-to-br from-indigo-950/20 via-slate-900/60 to-purple-950/20 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1">
              RLHF ARCHITECTURE PIPELINE
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <GitCompare className="h-6 w-6 text-indigo-400" /> PPO vs. GRPO Schematic Overview
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Compare PPO&apos;s 4-model architecture (Policy, Reference, Reward, Value) against GRPO&apos;s Value-Free Group Advantage computation.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Trained Models
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Frozen Models
            </span>
          </div>
        </div>

        {/* Schematic Image with Hover Zoom & Lightbox Trigger */}
        <div className="space-y-3">
          <div 
            onClick={() => setActiveModalImage({ 
              src: '/ppo_vs_grpo_schematic.png', 
              title: 'PPO vs. GRPO Architectural Comparison Schematic' 
            })}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-indigo-500/30 bg-slate-950 shadow-2xl"
          >
            <img 
              src="/ppo_vs_grpo_schematic.png" 
              alt="PPO vs GRPO Schematic" 
              className="w-full max-h-[480px] object-contain group-hover:scale-105 transition-transform duration-500 ease-out py-2" 
            />
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-indigo-300 font-mono text-xs font-bold backdrop-blur-[2px]">
              <ZoomIn className="h-5 w-5" /> Click to Expand Full Architectural Diagram
            </div>
          </div>
          <p className="text-[11px] text-slate-400 text-center font-mono">
            Figure: PPO (Top) utilizes a trained Value Model <MathFormula math="V_\phi" /> and GAE to compute advantage <MathFormula math="A" />. GRPO (Bottom) evaluates a group of completions <MathFormula math="\{o_1..o_G\}" /> to compute relative advantage directly without a Value Model.
          </p>
        </div>

        {/* PPO vs GRPO Comparison Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
              PPO Architecture (Actor-Critic)
            </span>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li><strong>4 Active Models:</strong> Policy <MathFormula math="\pi_\theta" />, Ref <MathFormula math="\pi_{\text{ref}}" />, Reward <MathFormula math="R_\psi" />, Value <MathFormula math="V_\phi" />.</li>
              <li><strong>Advantage Estimation:</strong> Computed via <strong>GAE</strong> combining reward <MathFormula math="r" /> & value baseline <MathFormula math="v" />.</li>
              <li><strong>Memory Footprint:</strong> High memory requirement due to maintaining Value Model weights, gradients & optimizer states.</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 space-y-2">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block">
              GRPO Architecture (Value-Free)
            </span>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li><strong>3 Active Models:</strong> Policy <MathFormula math="\pi_\theta" />, Ref <MathFormula math="\pi_{\text{ref}}" />, Reward <MathFormula math="R_\psi" /> (No Value Model!).</li>
              <li><strong>Group Advantage:</strong> Normalizes rewards across <MathFormula math="G" /> outputs per prompt: <MathFormula math="A_i = \frac{r_i - \mu}{\sigma}" />.</li>
              <li><strong>Memory Footprint:</strong> Saves ~50% GPU memory, enabling scaling to massive LLM reasoning models (e.g. DeepSeek-R1).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION 2: DETAILED EXPLANATION OF REWARD MODEL, VALUE MODEL & GAE */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-8 border-slate-800 bg-slate-900/60 shadow-xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
            CORE MATHEMATICAL COMPONENTS EXPLAINED
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-cyan-400" /> Reward Model, Value Model & GAE Deep Dive
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Detailed breakdown of how these three modules work together in PPO to stabilize policy optimization.
          </p>
        </div>

        {/* 3 Detailed Component Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Component 1: Reward Model */}
          <div className="bg-slate-950/90 rounded-2xl p-5 border border-cyan-500/30 space-y-4 flex flex-col justify-between hover:border-cyan-500/60 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Coins className="h-4 w-4" /> 1. Reward Model <MathFormula math="R_\psi" />
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  Frozen Evaluator
                </span>
              </div>

              <div className="py-2.5 px-3 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
                <MathFormula 
                  math="r(x, y) = R_\psi(x, y) - \beta D_{\text{KL}}\left(\pi_\theta \parallel \pi_{\text{ref}}\right)" 
                  block 
                />
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <p>
                  <strong>What it does:</strong> Evaluates prompt <MathFormula math="x" /> and generated response <MathFormula math="y" /> to output a scalar quality score.
                </p>
                <p>
                  <strong>Pairwise Preference Loss:</strong> Trained on human rankings <MathFormula math="(y_w \succ y_l)" />:
                </p>
                <div className="py-1 px-2 bg-slate-900/60 rounded border border-slate-800 text-[11px] font-mono">
                  <MathFormula math="\mathcal{L}_{\text{RM}} = -\mathbb{E}\left[\log \sigma\left(R_\psi(y_w) - R_\psi(y_l)\right)\right]" />
                </div>
                <p className="text-slate-400 text-[11px]">
                  *Note: KL penalty <MathFormula math="\beta D_{\text{KL}}" /> is subtracted from raw reward to prevent reward hacking.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-cyan-300 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Outputs scalar reward <MathFormula math="r" />
            </div>
          </div>

          {/* Component 2: Value Model */}
          <div className="bg-slate-950/90 rounded-2xl p-5 border border-amber-500/30 space-y-4 flex flex-col justify-between hover:border-amber-500/60 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="h-4 w-4" /> 2. Value Model <MathFormula math="V_\phi" />
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Trained Critic
                </span>
              </div>

              <div className="py-2.5 px-3 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
                <MathFormula 
                  math="V_\phi(s_t) \approx \mathbb{E}\left[\sum_{k=0}^\infty \gamma^k r_{t+k}\right]" 
                  block 
                />
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <p>
                  <strong>What it does:</strong> Predicts the baseline expected return from current state/prefix <MathFormula math="s_t" />.
                </p>
                <p>
                  <strong>MSE Value Objective:</strong> Trained alongside the Policy model using target returns <MathFormula math="R_t" />:
                </p>
                <div className="py-1 px-2 bg-slate-900/60 rounded border border-slate-800 text-[11px] font-mono">
                  <MathFormula math="\mathcal{L}_{\text{Value}}(\phi) = \frac{1}{2}\mathbb{E}_t\left[\left(V_\phi(s_t) - R_t\right)^2\right]" />
                </div>
                <p className="text-slate-400 text-[11px]">
                  *Role: Acts as a baseline subtractor to drastically lower policy gradient variance.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-amber-300 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Outputs state baseline <MathFormula math="v = V(s)" />
            </div>
          </div>

          {/* Component 3: GAE */}
          <div className="bg-slate-950/90 rounded-2xl p-5 border border-purple-500/30 space-y-4 flex flex-col justify-between hover:border-purple-500/60 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4" /> 3. GAE <MathFormula math="\hat{A}_t^{\text{GAE}}" />
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Advantage Estimation
                </span>
              </div>

              <div className="py-2.5 px-3 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
                <MathFormula 
                  math="\hat{A}_t^{\text{GAE}(\gamma, \lambda)} = \sum_{l=0}^\infty (\gamma \lambda)^l \delta_{t+l}" 
                  block 
                />
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <p>
                  <strong>What it does:</strong> Measures how much better action <MathFormula math="a_t" /> is compared to average expectation.
                </p>
                <p>
                  <strong>1-Step Temporal Difference Error <MathFormula math="\delta_t" />:</strong>
                </p>
                <div className="py-1 px-2 bg-slate-900/60 rounded border border-slate-800 text-[11px] font-mono">
                  <MathFormula math="\delta_t = r_t + \gamma V_\phi(s_{t+1}) - V_\phi(s_t)" />
                </div>
                <p className="text-slate-400 text-[11px]">
                  *Parameter <MathFormula math="\lambda" /> trades off bias (low <MathFormula math="\lambda" />) vs variance (high <MathFormula math="\lambda" />).
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-purple-300 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Outputs Advantage <MathFormula math="A" /> to update Policy
            </div>
          </div>
        </div>

        {/* INTERACTIVE GAE STEP-BY-STEP NUMERICAL CALCULATOR */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calculator className="h-5 w-5 text-purple-400" /> Interactive GAE Numerical Calculator
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Observe how rewards <MathFormula math="r_t" />, state values <MathFormula math="V(s_t)" />, and decay parameter <MathFormula math="\lambda" /> compute Advantage <MathFormula math="\hat{A}_t^{\text{GAE}}" />.
              </p>
            </div>

            {/* Slider Controls for Lambda & Gamma */}
            <div className="flex items-center gap-4 flex-wrap self-start sm:self-auto">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-300">
                  <span>GAE Decay <MathFormula math="\lambda" />:</span>
                  <span className="text-purple-300 font-bold ml-1">{gaeLambda.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={gaeLambda}
                  onChange={(e) => setGaeLambda(parseFloat(e.target.value))}
                  className="w-28 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-300">
                  <span>Discount <MathFormula math="\gamma" />:</span>
                  <span className="text-cyan-300 font-bold ml-1">{gaeGamma.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.80"
                  max="1.00"
                  step="0.01"
                  value={gaeGamma}
                  onChange={(e) => setGaeGamma(parseFloat(e.target.value))}
                  className="w-28 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Real Numbers GAE Calculation Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider bg-slate-900/60">
                  <th className="py-2.5 px-3">Step <MathFormula math="t" /></th>
                  <th className="py-2.5 px-3 text-cyan-400">Reward <MathFormula math="r_t" /></th>
                  <th className="py-2.5 px-3 text-amber-400">Value Baseline <MathFormula math="V(s_t)" /></th>
                  <th className="py-2.5 px-3 text-slate-300">Next Value <MathFormula math="V(s_{t+1})" /></th>
                  <th className="py-2.5 px-3 text-indigo-400">TD Error <MathFormula math="\delta_t = r + \gamma V' - V" /></th>
                  <th className="py-2.5 px-3 text-purple-300">GAE Advantage <MathFormula math="\hat{A}_t^{\text{GAE}}" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {gaeCalculations.map((row) => (
                  <tr key={row.t} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-bold text-white">Token Step {row.t}</td>
                    <td className="py-2.5 px-3 text-cyan-300">+{row.reward.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-amber-300">{row.val.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-slate-400">{row.nextVal.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-indigo-300 font-bold">
                      {row.delta >= 0 ? `+${row.delta.toFixed(4)}` : row.delta.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-3 text-purple-300 font-extrabold text-sm">
                      {row.gaeAdvantage >= 0 ? `+${row.gaeAdvantage.toFixed(4)}` : row.gaeAdvantage.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 font-sans flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Info className="h-4 w-4 text-purple-400 shrink-0" />
              <span>
                When <MathFormula math="\lambda = 0" />, GAE equals 1-step TD (<MathFormula math="\hat{A}_t = \delta_t" />). When <MathFormula math="\lambda = 1" />, GAE equals full Monte Carlo return.
              </span>
            </span>
            <span className="font-mono text-[11px] text-purple-300 font-bold hidden sm:inline">
              Selected: <MathFormula math={`\\lambda = ${gaeLambda.toFixed(2)}`} />
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: PPO CLIPPED SURROGATE OBJECTIVE & LIVE GRAPH */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1">
            POLICY STABILIZATION & CLIPPING
          </span>
          <h2 className="text-2xl font-bold text-white">
            PPO Clipped Surrogate Objective Interactive Graph
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            PPO updates policy parameters <MathFormula math="\theta" /> using the Advantage estimate <MathFormula math="\hat{A}_t" />, clipped by <MathFormula math="\epsilon" /> to bound policy drift.
          </p>
        </div>

        {/* Math Formula Panel */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            PPO Clipped Surrogate Loss Equation
          </h3>
          <MathFormula 
            math="L^{\text{CLIP}}(\theta) = \hat{\mathbb{E}}_t \left[ \min\left( r_t(\theta) \hat{A}_t, \, \text{clip}\left(r_t(\theta), \, 1-\epsilon, \, 1+\epsilon\right) \hat{A}_t \right) \right]" 
            block 
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs text-slate-400 border-t border-slate-800">
            <div>
              <span className="font-semibold text-indigo-300 flex items-center gap-1">Probability Ratio <MathFormula math="r_t(\theta)" />:</span>
              <p className="mt-0.5">Ratio of new policy probability to old policy: <MathFormula math="\frac{\pi_\theta(a|s)}{\pi_{\text{old}}(a|s)}" />.</p>
            </div>
            <div>
              <span className="font-semibold text-emerald-300 flex items-center gap-1">Advantage Estimate <MathFormula math="\hat{A}_t" />:</span>
              <p className="mt-0.5">Positive if action performed better than baseline value; negative if worse.</p>
            </div>
            <div>
              <span className="font-semibold text-purple-300 flex items-center gap-1">Clip Threshold <MathFormula math="\epsilon" />:</span>
              <p className="mt-0.5">Bounds maximum allowed policy change per step (typically 0.1 to 0.3).</p>
            </div>
          </div>
        </div>

        {/* Main Interactive Controls & Graph Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sliders Control Panel */}
          <div className="glass-panel rounded-2xl p-6 space-y-6 lg:col-span-1 flex flex-col justify-between">
            <div className="space-y-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-indigo-400" /> Interactive Parameters
              </h3>

              {/* Slider 1: Ratio r_t */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1">Probability Ratio <MathFormula math="r_t" />:</span>
                  <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {ratio.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.7"
                  step="0.01"
                  value={ratio}
                  onChange={(e) => setRatio(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0.5 (Less Likely)</span>
                  <span>1.0 (Same)</span>
                  <span>1.7 (More Likely)</span>
                </div>
              </div>

              {/* Slider 2: Advantage A_t */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1">Advantage <MathFormula math="\hat{A}_t" />:</span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded border ${
                    advantage >= 0 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                  }`}>
                    {advantage > 0 ? `+${advantage.toFixed(2)}` : advantage.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-2.0"
                  max="2.0"
                  step="0.1"
                  value={advantage}
                  onChange={(e) => setAdvantage(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>-2.0 (Bad Action)</span>
                  <span>0.0</span>
                  <span>+2.0 (Good Action)</span>
                </div>
              </div>

              {/* Slider 3: Epsilon */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1">Clip Range <MathFormula math="\epsilon" />:</span>
                  <span className="font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    {epsilon.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.4"
                  step="0.01"
                  value={epsilon}
                  onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0.05 (Tight)</span>
                  <span>0.20 (Standard)</span>
                  <span>0.40 (Wide)</span>
                </div>
              </div>
            </div>

            {/* Current Status Box */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Clipping Status:</span>
                {clippingActive ? (
                  <span className="inline-flex items-center gap-1 font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30 text-[11px]">
                    <AlertTriangle className="h-3 w-3" /> Clipped (PPO Penalty Active)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 text-[11px]">
                    <CheckCircle2 className="h-3 w-3" /> Unclipped
                  </span>
                )}
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Unclipped Loss:</span>
                  <span className="text-slate-200">{unclippedLoss.toFixed(3)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Clipped Loss:</span>
                  <span className="text-purple-300">{clippedLoss.toFixed(3)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-slate-800 pt-1 text-indigo-400">
                  <span>Final Objective (min):</span>
                  <span>{finalObjective.toFixed(3)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Recharts Graph */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Objective vs. Probability Ratio Curve</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    Comparing unclipped surrogate vs clipped PPO objective across ratios <MathFormula math="r_t" />.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-3 h-0.5 bg-slate-500 rounded" /> Unclipped
                  </span>
                  <span className="flex items-center gap-1.5 text-indigo-400">
                    <span className="w-3 h-1 bg-indigo-500 rounded" /> PPO Objective
                  </span>
                </div>
              </div>

              {/* Recharts Container */}
              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="ratio" 
                      stroke="#64748b" 
                      fontSize={11}
                      tickFormatter={(v) => v.toFixed(2)}
                    />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        borderColor: '#334155', 
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: '12px'
                      }}
                    />
                    <ReferenceArea 
                      x1={1 - epsilon} 
                      x2={1 + epsilon} 
                      fill="#6366f1" 
                      fillOpacity={0.08} 
                    />
                    <ReferenceLine x={1.0} stroke="#475569" strokeDasharray="3 3" label={{ value: 'r=1', fill: '#64748b', fontSize: 10 }} />
                    <ReferenceLine x={ratio} stroke="#f43f5e" strokeWidth={2} label={{ value: `r=${ratio}`, fill: '#f43f5e', fontSize: 10 }} />

                    <Line 
                      type="monotone" 
                      dataKey="unclipped" 
                      stroke="#64748b" 
                      strokeWidth={1.5} 
                      strokeDasharray="4 4"
                      dot={false} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ppoObjective" 
                      stroke="#6366f1" 
                      strokeWidth={3} 
                      dot={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Dynamic Insight Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
              <Info className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5">
                  {advantage >= 0 ? 'Positive Advantage Case (Good Action)' : 'Negative Advantage Case (Bad Action)'}
                </span>
                {advantage >= 0 ? (
                  <p className="flex items-center gap-1 flex-wrap">
                    When <MathFormula math="\hat{A}_t > 0" />, the action is good. PPO allows increasing ratio up to <MathFormula math="1+\epsilon" />. Beyond <MathFormula math="1+\epsilon" />, the objective is clipped to prevent over-exploding updates.
                  </p>
                ) : (
                  <p className="flex items-center gap-1 flex-wrap">
                    When <MathFormula math="\hat{A}_t < 0" />, the action is bad. PPO allows decreasing ratio down to <MathFormula math="1-\epsilon" />. Below <MathFormula math="1-\epsilon" />, clipping prevents penalizing an action that is already rendered unlikely.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Modal for Enlarged Schematic View */}
      {activeModalImage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setActiveModalImage(null)}
        >
          <div 
            className="relative max-w-5xl w-full bg-slate-900 border border-slate-700 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Maximize2 className="h-5 w-5 text-indigo-400" /> {activeModalImage.title}
              </h3>
              <button 
                onClick={() => setActiveModalImage(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-center max-h-[78vh]">
              <img 
                src={activeModalImage.src} 
                alt={activeModalImage.title} 
                className="w-full h-full object-contain max-h-[78vh]"
              />
            </div>

            <div className="flex justify-between items-center text-xs font-mono text-slate-400 pt-1">
              <span>Architectural comparison diagram</span>
              <span className="text-indigo-400">Click anywhere outside or X to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
