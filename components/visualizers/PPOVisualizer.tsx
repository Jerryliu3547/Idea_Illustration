"use client";

import React, { useState, useMemo } from 'react';
import { MathFormula } from '@/components/ui/MathFormula';
import { getAssetPath } from '@/lib/asset';
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
  Calculator,
  Brain,
  Zap,
  Target,
  ArrowRight,
  HelpCircle,
  Scale,
  Sparkles,
  ArrowDown,
  Layers,
  Activity,
  Award,
  Check,
  Bookmark
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

  // GAE Complete Mental Model Walkthrough State
  const [gaeMentalTab, setGaeMentalTab] = useState<'all' | 'trajectory' | 'value_q' | 'worked_example' | 'hyperparams' | 'architecture'>('all');
  const [workedScenario, setWorkedScenario] = useState<'correct' | 'wrong'>('correct');

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

      {/* QUICK SECTION BOOKMARK NAVIGATION BAR */}
      <div className="sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border border-indigo-500/40 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400">
          <Bookmark className="h-4 w-4 text-indigo-400" />
          <span>Quick Section Bookmarks:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          <button
            onClick={() => document.getElementById('section-loss-function')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-indigo-500/20 text-slate-200 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <Calculator className="h-4 w-4 text-indigo-400 shrink-0" />
            <span className="font-semibold">1. Total PPO Loss Function</span>
          </button>

          <button
            onClick={() => document.getElementById('section-schematic')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-indigo-500/20 text-slate-200 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <GitCompare className="h-4 w-4 text-indigo-400 shrink-0" />
            <span className="font-semibold">2. PPO vs. GRPO Architecture</span>
          </button>

          <button
            onClick={() => document.getElementById('section-core-components')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <BookOpen className="h-4 w-4 text-cyan-400 shrink-0" />
            <span className="font-semibold">3. Reward, Value & GAE Modules</span>
          </button>

          <button
            onClick={() => document.getElementById('section-mental-model')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <Brain className="h-4 w-4 text-purple-400 shrink-0" />
            <span className="font-semibold">4. End-to-End GAE Mental Model</span>
          </button>

          <button
            onClick={() => document.getElementById('section-surrogate-objective')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-indigo-500/20 text-slate-200 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />
            <span className="font-semibold">5. Surrogate Objective Deep-Dive</span>
          </button>

          <button
            onClick={() => document.getElementById('section-clipped-graph')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <Sliders className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="font-semibold">6. Clipped Objective Graph</span>
          </button>
        </div>
      </div>

      {/* FEATURED TOP CARD: FULL PPO LOSS / OBJECTIVE FUNCTION */}
      <div id="section-loss-function" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-indigo-500/50 bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-purple-950/40 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Calculator className="h-4 w-4 text-indigo-400" /> TOTAL PPO OBJECTIVE & LOSS FUNCTION
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Full PPO Loss Function Equation
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              PPO optimizes a multi-task objective combining <strong>Clipped Surrogate Policy Loss</strong>, <strong>Value Function Loss</strong>, and an <strong>Entropy Bonus / KL Penalty</strong>.
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 self-start md:self-auto">
            Primary Optimization Target
          </span>
        </div>

        {/* Master Formula Display */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-indigo-500/40 space-y-4 shadow-inner text-center">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Combined PPO Maximization Objective
          </span>
          <div className="py-2 overflow-x-auto text-indigo-300">
            <MathFormula 
              math="L^{\text{PPO}}(\theta, \phi) = \hat{\mathbb{E}}_t \left[ L^{\text{CLIP}}(\theta) - c_1 L^{\text{VF}}(\phi) + c_2 S[\pi_\theta](s_t) \right]" 
              block 
            />
          </div>
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-400 font-mono text-center">
            Equivalent Loss Minimization: <MathFormula math="\mathcal{L}_{\text{total}}(\theta, \phi) = -L^{\text{CLIP}}(\theta) + c_1 L^{\text{VF}}(\phi) - c_2 S[\pi_\theta]" />
          </div>
        </div>

        {/* Breakdown of 3 Component Loss Terms */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Term 1: Clipped Policy Loss */}
          <div className="bg-slate-950/90 p-4 rounded-2xl border border-indigo-500/30 space-y-2">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block">
              1. Clipped Policy Objective <MathFormula math="L^{\text{CLIP}}(\theta)" />
            </span>
            <div className="py-2 text-center bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono">
              <MathFormula math="L^{\text{CLIP}} = \hat{\mathbb{E}}_t \left[ \min\left(r_t \hat{A}_t, \, \text{clip}(r_t, 1-\epsilon, 1+\epsilon) \hat{A}_t\right) \right]" block />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pushes policy parameters <MathFormula math="\theta" /> towards higher advantage actions while bounding policy ratio <MathFormula math="r_t = \frac{\pi_\theta}{\pi_{\text{old}}}" /> within <MathFormula math="[1-\epsilon, 1+\epsilon]" />.
            </p>
          </div>

          {/* Term 2: Value Function Loss */}
          <div className="bg-slate-950/90 p-4 rounded-2xl border border-amber-500/30 space-y-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
              2. Value Function Loss <MathFormula math="L^{\text{VF}}(\phi)" />
            </span>
            <div className="py-2 text-center bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono">
              <MathFormula math="L^{\text{VF}}(\phi) = \frac{1}{2} \hat{\mathbb{E}}_t \left[ \left( V_\phi(s_t) - V_t^{\text{targ}} \right)^2 \right]" block />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Trains the Critic value head parameters <MathFormula math="\phi" /> to accurately predict target empirical returns <MathFormula math="V_t^{\text{targ}} = V(s_t) + \hat{A}_t^{\text{GAE}}" />.
            </p>
          </div>

          {/* Term 3: Entropy / KL Term */}
          <div className="bg-slate-950/90 p-4 rounded-2xl border border-purple-500/30 space-y-2">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block">
              3. Entropy / KL Regularization <MathFormula math="S[\pi_\theta]" />
            </span>
            <div className="py-2 text-center bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono">
              <MathFormula math="S[\pi_\theta] = \hat{\mathbb{E}}_t \left[ \mathcal{H}(\pi_\theta(\cdot \mid s_t)) \right]" block />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Encourages exploration (or in LLMs, penalizes KL divergence <MathFormula math="\beta D_{\text{KL}}" /> from reference model <MathFormula math="\pi_{\text{ref}}" />) to prevent premature mode collapse.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: ARCHITECTURE SCHEMATIC (PPO vs GRPO) */}
      <div id="section-schematic" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-indigo-500/40 bg-gradient-to-br from-indigo-950/20 via-slate-900/60 to-purple-950/20 shadow-xl">
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
              src: getAssetPath('/ppo_vs_grpo_schematic.png'), 
              title: 'PPO vs. GRPO Architectural Comparison Schematic' 
            })}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-indigo-500/30 bg-slate-950 shadow-2xl"
          >
            <img 
              src={getAssetPath('/ppo_vs_grpo_schematic.png')} 
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
      <div id="section-core-components" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-8 border-slate-800 bg-slate-900/60 shadow-xl">
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
                <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider flex items-center gap-1.5">
                  <Coins className="h-4 w-4" /> <span className="uppercase">1. Reward Model</span> <MathFormula math="R_\psi" />
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
                <span className="text-xs font-mono font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
                  <Cpu className="h-4 w-4" /> <span className="uppercase">2. Value Model</span> <MathFormula math="V_\phi" />
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
                <span className="text-xs font-mono font-bold text-purple-400 tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4" /> <span className="uppercase">3. GAE</span> <MathFormula math="\hat{A}_t^{\text{GAE}}" />
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

      {/* SECTION 2.5: COMPLETE FROM-START-TO-FINISH GAE MENTAL MODEL & WALKTHROUGH */}
      <div id="section-mental-model" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-8 border-purple-500/40 bg-gradient-to-br from-purple-950/20 via-slate-900/70 to-indigo-950/20 shadow-2xl">
        {/* Header & Section Navigation Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Brain className="h-4 w-4 text-purple-400" /> END-TO-END GAE MENTAL MODEL
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              GAE in LLM RL: Complete Worked Example & Step-by-Step Guide
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Connecting <strong>Policy → Value → Reward → TD Error → GAE → Advantage → PPO</strong> using a concrete prompt generation example.
            </p>
          </div>

          {/* Tab Filter Controls */}
          <div className="flex items-center gap-1 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 flex-wrap self-start md:self-auto">
            <button
              onClick={() => setGaeMentalTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                gaeMentalTab === 'all'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              All Sections
            </button>
            <button
              onClick={() => setGaeMentalTab('trajectory')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                gaeMentalTab === 'trajectory'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              1. Trajectory & State
            </button>
            <button
              onClick={() => setGaeMentalTab('value_q')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                gaeMentalTab === 'value_q'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              2. V(s), Q & Advantage
            </button>
            <button
              onClick={() => setGaeMentalTab('worked_example')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                gaeMentalTab === 'worked_example'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              3. Worked Calculation
            </button>
            <button
              onClick={() => setGaeMentalTab('hyperparams')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                gaeMentalTab === 'hyperparams'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              4. γ vs λ & Critic
            </button>
            <button
              onClick={() => setGaeMentalTab('architecture')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                gaeMentalTab === 'architecture'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              5. Pipeline & 5 Equations
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* SUB-SECTION 1: BIG PICTURE & LLM TRAJECTORY MAPPING */}
        {/* ---------------------------------------------------- */}
        {(gaeMentalTab === 'all' || gaeMentalTab === 'trajectory') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" /> 1. The Big Picture & LLM State/Action Trajectory
              </h3>
              <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                Steps 1–3
              </span>
            </div>

            {/* High Level Flow Pipeline Card */}
            <div className="bg-slate-950/90 p-5 rounded-2xl border border-purple-500/30 space-y-4">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block">
                The End-to-End Training Loop Flow
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-purple-300 font-bold block">1. Prompt</span>
                  <span className="text-[10px] text-slate-400">User Input</span>
                </div>
                <div className="hidden sm:flex items-center justify-center text-slate-600">→</div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-indigo-300 font-bold block">2. Tokens</span>
                  <span className="text-[10px] text-slate-400">LLM Generation</span>
                </div>
                <div className="hidden sm:flex items-center justify-center text-slate-600">→</div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-amber-300 font-bold block">3. Value V(s)</span>
                  <span className="text-[10px] text-slate-400">Critic Predicts</span>
                </div>
                <div className="hidden sm:flex items-center justify-center text-slate-600">→</div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-emerald-300 font-bold block">4. Reward R</span>
                  <span className="text-[10px] text-slate-400">RM Score (R=1)</span>
                </div>
                <div className="hidden lg:flex items-center justify-center text-slate-600">→</div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-cyan-300 font-bold block">5. TD Errors</span>
                  <span className="text-[10px] text-slate-400">δ_t = r + V' - V</span>
                </div>
                <div className="hidden sm:flex items-center justify-center text-slate-600">→</div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-purple-300 font-bold block">6. GAE (A_t)</span>
                  <span className="text-[10px] text-slate-400">Backward Accum</span>
                </div>
                <div className="hidden sm:flex items-center justify-center text-slate-600">→</div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-emerald-400 font-bold block">7. PPO Update</span>
                  <span className="text-[10px] text-slate-400">Policy Optimized</span>
                </div>
              </div>
            </div>

            {/* Prompt & Trajectory Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Example Trajectory Card */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Example Prompt & Token Sequence
                </span>
                
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[11px] font-mono text-purple-300 font-bold block">Prompt:</span>
                  <p className="text-sm font-semibold text-white">&quot;What is the capital of France?&quot;</p>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-mono text-indigo-300 font-bold block">Generated Output String:</span>
                  <div className="flex items-center gap-1.5 font-mono text-xs flex-wrap">
                    <span className="px-2 py-1 bg-indigo-500/10 text-indigo-300 rounded border border-indigo-500/30">The</span>
                    <span className="text-slate-600">→</span>
                    <span className="px-2 py-1 bg-indigo-500/10 text-indigo-300 rounded border border-indigo-500/30">capital</span>
                    <span className="text-slate-600">→</span>
                    <span className="px-2 py-1 bg-indigo-500/10 text-indigo-300 rounded border border-indigo-500/30">is</span>
                    <span className="text-slate-600">→</span>
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/40 font-bold">Paris</span>
                    <span className="text-slate-600">→</span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded border border-purple-500/40 font-bold">EOS</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-500/30 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Reward Model Evaluation:</span>
                  <span className="font-mono font-extrabold text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                    <MathFormula math="R = 1.0" /> (Correct Answer)
                  </span>
                </div>
              </div>

              {/* State & Action Formalization Card */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block">
                  RL State <MathFormula math="s_t" /> & Action <MathFormula math="a_t" /> Mapping
                </span>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-indigo-300 font-bold">Step 1:</span>
                    <p className="text-slate-300"><MathFormula math="s_1" />: &quot;What is the capital of France?&quot;</p>
                    <p className="text-purple-300 font-bold"><MathFormula math="a_1" />: &quot;The&quot;</p>
                  </div>

                  <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-indigo-300 font-bold">Step 2:</span>
                    <p className="text-slate-300"><MathFormula math="s_2" />: &quot;... France? The&quot;</p>
                    <p className="text-purple-300 font-bold"><MathFormula math="a_2" />: &quot;capital&quot;</p>
                  </div>

                  <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-indigo-300 font-bold">Step 3:</span>
                    <p className="text-slate-300"><MathFormula math="s_3" />: &quot;... France? The capital&quot;</p>
                    <p className="text-purple-300 font-bold"><MathFormula math="a_3" />: &quot;is&quot;</p>
                  </div>

                  <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-indigo-300 font-bold">Step 4:</span>
                    <p className="text-slate-300"><MathFormula math="s_4" />: &quot;... France? The capital is&quot;</p>
                    <p className="text-emerald-300 font-bold"><MathFormula math="a_4" />: &quot;Paris&quot;</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Token Probability Distribution Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="h-4 w-4 text-indigo-400" /> Policy Probability Sampling <MathFormula math="\pi(a_t \mid s_t)" />
              </h4>
              <p className="text-xs text-slate-300">
                At state <MathFormula math="s_4" /> (&quot;What is the capital of France? The capital is&quot;), the Transformer produces vocabulary probabilities:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-center">
                  <span className="text-emerald-300 font-bold block">Paris</span>
                  <span className="text-lg font-extrabold text-emerald-400">0.60</span>
                  <span className="text-[10px] text-slate-400 block font-sans">Sampled Action!</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
                  <span className="text-slate-300 font-bold block">London</span>
                  <span className="text-lg font-extrabold text-slate-400">0.20</span>
                  <span className="text-[10px] text-slate-400 block font-sans">Alternative</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
                  <span className="text-slate-300 font-bold block">Berlin</span>
                  <span className="text-lg font-extrabold text-slate-400">0.05</span>
                  <span className="text-[10px] text-slate-400 block font-sans">Alternative</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
                  <span className="text-slate-300 font-bold block">Rome</span>
                  <span className="text-lg font-extrabold text-slate-400">0.02</span>
                  <span className="text-[10px] text-slate-400 block font-sans">Alternative</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* SUB-SECTION 2: VALUE FUNCTION, Q & ADVANTAGE DEFINITIONS */}
        {/* ---------------------------------------------------- */}
        {(gaeMentalTab === 'all' || gaeMentalTab === 'value_q') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-amber-400" /> 2. Policy vs. Value Function vs. Action-Value Q
              </h3>
              <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                Steps 4–8
              </span>
            </div>

            {/* Core Questions Asked Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Policy Question */}
              <div className="bg-slate-950/90 p-5 rounded-2xl border border-indigo-500/30 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block">
                    Policy <MathFormula math="\pi_\theta(a \mid s)" />
                  </span>
                  <h4 className="text-sm font-bold text-white">The Action Question</h4>
                  <div className="p-2.5 bg-indigo-950/30 rounded-xl border border-indigo-500/20 text-xs text-indigo-200 italic">
                    &quot;Which token should I choose next from the vocabulary?&quot;
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Outputs a probability distribution over all vocabulary tokens for the current token position.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-indigo-300">
                  Outputs: Probabilities <MathFormula math="P(\text{token})" />
                </div>
              </div>

              {/* Value Question */}
              <div className="bg-slate-950/90 p-5 rounded-2xl border border-amber-500/30 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                    Value Function <MathFormula math="V_\phi(s)" />
                  </span>
                  <h4 className="text-sm font-bold text-white">The State Quality Question</h4>
                  <div className="p-2.5 bg-amber-950/30 rounded-xl border border-amber-500/20 text-xs text-amber-200 italic">
                    &quot;Given everything generated so far, how good do I expect the eventual return to be?&quot;
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Outputs <strong>one scalar number</strong> representing baseline expectation from state <MathFormula math="s_t" />.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-amber-300">
                  Outputs: Scalar baseline <MathFormula math="V(s_t)" />
                </div>
              </div>

              {/* Advantage Question */}
              <div className="bg-slate-950/90 p-5 rounded-2xl border border-purple-500/30 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block">
                    Advantage <MathFormula math="A(s, a) = Q - V" />
                  </span>
                  <h4 className="text-sm font-bold text-white">The Action Surprise Question</h4>
                  <div className="p-2.5 bg-purple-950/30 rounded-xl border border-purple-500/20 text-xs text-purple-200 italic">
                    &quot;Was the action I actually took better or worse than what I expected from this state?&quot;
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Measures relative performance. If <MathFormula math="A > 0" />, action was better than average expectation.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-purple-300">
                  Outputs: Advantage signal <MathFormula math="A(s_t, a_t)" />
                </div>
              </div>
            </div>

            {/* Value Function Progress Across Tokens Table */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-400" /> Value Head Predictions <MathFormula math="V(s_t)" /> Along Trajectory
              </h4>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider bg-slate-900/60">
                      <th className="py-2.5 px-3">Step <MathFormula math="t" /></th>
                      <th className="py-2.5 px-3 text-indigo-300">State Prefix <MathFormula math="s_t" /></th>
                      <th className="py-2.5 px-3 text-purple-300">Token Action <MathFormula math="a_t" /></th>
                      <th className="py-2.5 px-3 text-amber-400">Predicted Value <MathFormula math="V(s_t)" /></th>
                      <th className="py-2.5 px-3 text-cyan-300">Intermediate Reward <MathFormula math="r_t" /></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 font-bold text-white">1</td>
                      <td className="py-2 px-3 text-slate-400">&quot;What is the capital of France?&quot;</td>
                      <td className="py-2 px-3 text-purple-300 font-bold">&quot;The&quot;</td>
                      <td className="py-2 px-3 text-amber-300 font-bold">0.20</td>
                      <td className="py-2 px-3 text-slate-500">0</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 font-bold text-white">2</td>
                      <td className="py-2 px-3 text-slate-400">&quot;... The&quot;</td>
                      <td className="py-2 px-3 text-purple-300 font-bold">&quot;capital&quot;</td>
                      <td className="py-2 px-3 text-amber-300 font-bold">0.30</td>
                      <td className="py-2 px-3 text-slate-500">0</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 font-bold text-white">3</td>
                      <td className="py-2 px-3 text-slate-400">&quot;... The capital&quot;</td>
                      <td className="py-2 px-3 text-purple-300 font-bold">&quot;is&quot;</td>
                      <td className="py-2 px-3 text-amber-300 font-bold">0.50</td>
                      <td className="py-2 px-3 text-slate-500">0</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 font-bold text-white">4</td>
                      <td className="py-2 px-3 text-slate-400">&quot;... The capital is&quot;</td>
                      <td className="py-2 px-3 text-emerald-300 font-bold">&quot;Paris&quot;</td>
                      <td className="py-2 px-3 text-amber-300 font-bold">0.80</td>
                      <td className="py-2 px-3 text-slate-500">0</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 bg-emerald-950/10">
                      <td className="py-2 px-3 font-bold text-white">5</td>
                      <td className="py-2 px-3 text-slate-400">&quot;... The capital is Paris&quot;</td>
                      <td className="py-2 px-3 text-emerald-300 font-bold">&quot;EOS&quot;</td>
                      <td className="py-2 px-3 text-amber-300 font-bold">1.00</td>
                      <td className="py-2 px-3 text-emerald-400 font-extrabold">+1.0 (Terminal Reward)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Advantage Formula & Good vs Bad Action Callouts */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-purple-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Scale className="h-4 w-4 text-purple-400" /> Defining Advantage <MathFormula math="A(s_t, a_t) = Q(s_t, a_t) - V(s_t)" />
                </h4>
                <span className="text-xs font-mono text-purple-300">Action Outcome minus State Baseline</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Positive Advantage Case */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Good Action Case (Paris)
                  </span>
                  <div className="text-xs text-slate-300 font-mono space-y-1">
                    <p><MathFormula math="Q(s_t, \text{Paris}) = 1.0" /> (Actual Outcome)</p>
                    <p><MathFormula math="V(s_t) = 0.60" /> (Baseline Expectation)</p>
                    <p className="text-emerald-300 font-bold text-sm pt-1">
                      <MathFormula math="A = 1.0 - 0.60 = +0.40" /> (Better than expected!)
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    PPO will <strong>increase</strong> probability of generating &quot;Paris&quot; in similar states.
                  </p>
                </div>

                {/* Negative Advantage Case */}
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                  <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> Bad Action Case (London)
                  </span>
                  <div className="text-xs text-slate-300 font-mono space-y-1">
                    <p><MathFormula math="Q(s_t, \text{London}) = 0.20" /> (Actual Outcome)</p>
                    <p><MathFormula math="V(s_t) = 0.60" /> (Baseline Expectation)</p>
                    <p className="text-rose-300 font-bold text-sm pt-1">
                      <MathFormula math="A = 0.20 - 0.60 = -0.40" /> (Worse than expected!)
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    PPO will <strong>decrease</strong> probability of generating &quot;London&quot; in similar states.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* SUB-SECTION 3: STEP-BY-STEP WORKED NUMERICAL EXAMPLE */}
        {/* ---------------------------------------------------- */}
        {(gaeMentalTab === 'all' || gaeMentalTab === 'worked_example') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calculator className="h-5 w-5 text-cyan-400" /> 3. Step-by-Step Worked Numerical Calculation
              </h3>
              <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                Steps 9–14
              </span>
            </div>

            {/* Interactive Scenario Toggle (Correct R=1 vs Wrong R=0) */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block">
                  Interactive Scenario Switch
                </span>
                <p className="text-xs text-slate-300 mt-0.5">
                  Compare how TD Errors <MathFormula math="\delta_t" /> and GAE Advantage <MathFormula math="A_t" /> propagate for correct vs. wrong answers.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
                <button
                  onClick={() => setWorkedScenario('correct')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    workedScenario === 'correct'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Correct Answer (R = 1)
                </button>
                <button
                  onClick={() => setWorkedScenario('wrong')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    workedScenario === 'wrong'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Wrong Answer (R = 0)
                </button>
              </div>
            </div>

            {/* Step A: TD Errors Calculation */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="h-4 w-4 text-indigo-400" /> Step A: Calculate 1-Step Temporal Difference (TD) Errors <MathFormula math="\delta_t" />
                </h4>
                <span className="text-xs font-mono text-indigo-300">
                  <MathFormula math="\delta_t = r_t + \gamma V(s_{t+1}) - V(s_t)" /> (with <MathFormula math="\gamma = 1.0" />)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs">
                {workedScenario === 'correct' ? (
                  <>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px]">Step 5 (EOS):</span>
                      <p className="text-slate-300"><MathFormula math="\delta_5 = 1 - 1.0" /></p>
                      <p className="text-indigo-300 font-extrabold text-sm"><MathFormula math="\delta_5 = 0.00" /></p>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px]">Step 4 (&quot;Paris&quot;):</span>
                      <p className="text-slate-300"><MathFormula math="\delta_4 = 0 + 1(1.0) - 0.8" /></p>
                      <p className="text-indigo-300 font-extrabold text-sm"><MathFormula math="\delta_4 = +0.20" /></p>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px]">Step 3 (&quot;is&quot;):</span>
                      <p className="text-slate-300"><MathFormula math="\delta_3 = 0 + 1(0.8) - 0.5" /></p>
                      <p className="text-indigo-300 font-extrabold text-sm"><MathFormula math="\delta_3 = +0.30" /></p>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px]">Step 2 (&quot;capital&quot;):</span>
                      <p className="text-slate-300"><MathFormula math="\delta_2 = 0 + 1(0.5) - 0.3" /></p>
                      <p className="text-indigo-300 font-extrabold text-sm"><MathFormula math="\delta_2 = +0.20" /></p>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px]">Step 1 (&quot;The&quot;):</span>
                      <p className="text-slate-300"><MathFormula math="\delta_1 = 0 + 1(0.3) - 0.2" /></p>
                      <p className="text-indigo-300 font-extrabold text-sm"><MathFormula math="\delta_1 = +0.10" /></p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-500/30 space-y-1">
                      <span className="text-slate-400 text-[10px]">Step 5 (EOS, R=0):</span>
                      <p className="text-slate-300"><MathFormula math="\delta_5 = 0 - 0.0" /></p>
                      <p className="text-rose-300 font-extrabold text-sm"><MathFormula math="\delta_5 = 0.00" /></p>
                    </div>
                    <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-500/30 space-y-1">
                      <span className="text-slate-400 text-[10px]">Step 4 (&quot;London&quot;):</span>
                      <p className="text-slate-300"><MathFormula math="\delta_4 = 0 + 1(0) - 0.8" /></p>
                      <p className="text-rose-400 font-extrabold text-sm"><MathFormula math="\delta_4 = -0.80" /></p>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px]">Step 3 (&quot;is&quot;):</span>
                      <p className="text-slate-300"><MathFormula math="\delta_3 = 0 + 1(0.8) - 0.5" /></p>
                      <p className="text-indigo-300 font-extrabold text-sm"><MathFormula math="\delta_3 = +0.30" /></p>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px]">Step 2 (&quot;capital&quot;):</span>
                      <p className="text-slate-300"><MathFormula math="\delta_2 = 0 + 1(0.5) - 0.3" /></p>
                      <p className="text-indigo-300 font-extrabold text-sm"><MathFormula math="\delta_2 = +0.20" /></p>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px]">Step 1 (&quot;The&quot;):</span>
                      <p className="text-slate-300"><MathFormula math="\delta_1 = 0 + 1(0.3) - 0.2" /></p>
                      <p className="text-indigo-300 font-extrabold text-sm"><MathFormula math="\delta_1 = +0.10" /></p>
                    </div>
                  </>
                )}
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-indigo-300 flex items-center justify-between">
                <span>TD Error Vector <MathFormula math="\delta" />:</span>
                <span className="font-bold">
                  {workedScenario === 'correct' ? '[0.10, 0.20, 0.30, 0.20, 0.00]' : '[0.10, 0.20, 0.30, -0.80, 0.00]'}
                </span>
              </div>
            </div>

            {/* Step B: GAE Backward Accumulation */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-400" /> Step B: GAE Backward Advantage Accumulation (<MathFormula math="\lambda = 0.5 \implies \gamma\lambda = 0.5" />)
                </h4>
                <span className="text-xs font-mono text-purple-300">
                  <MathFormula math="A_t = \delta_t + \gamma\lambda A_{t+1}" />
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs">
                {workedScenario === 'correct' ? (
                  <>
                    <div className="p-3 bg-purple-950/20 rounded-xl border border-purple-500/30 space-y-1">
                      <span className="text-slate-400 text-[10px]">A_5 (EOS):</span>
                      <p className="text-slate-300"><MathFormula math="A_5 = 0" /></p>
                      <p className="text-purple-300 font-extrabold text-sm"><MathFormula math="A_5 = 0.00" /></p>
                    </div>
                    <div className="p-3 bg-purple-950/20 rounded-xl border border-purple-500/30 space-y-1">
                      <span className="text-slate-400 text-[10px]">A_4 (&quot;Paris&quot;):</span>
                      <p className="text-slate-300"><MathFormula math="0.20 + 0.5(0)" /></p>
                      <p className="text-purple-300 font-extrabold text-sm"><MathFormula math="A_4 = +0.20" /></p>
                    </div>
                    <div className="p-3 bg-purple-950/20 rounded-xl border border-purple-500/30 space-y-1">
                      <span className="text-slate-400 text-[10px]">A_3 (&quot;is&quot;):</span>
                      <p className="text-slate-300"><MathFormula math="0.30 + 0.5(0.2)" /></p>
                      <p className="text-purple-300 font-extrabold text-sm"><MathFormula math="A_3 = +0.40" /></p>
                    </div>
                    <div className="p-3 bg-purple-950/20 rounded-xl border border-purple-500/30 space-y-1">
                      <span className="text-slate-400 text-[10px]">A_2 (&quot;capital&quot;):</span>
                      <p className="text-slate-300"><MathFormula math="0.20 + 0.5(0.4)" /></p>
                      <p className="text-purple-300 font-extrabold text-sm"><MathFormula math="A_2 = +0.40" /></p>
                    </div>
                    <div className="p-3 bg-purple-950/20 rounded-xl border border-purple-500/30 space-y-1">
                      <span className="text-slate-400 text-[10px]">A_1 (&quot;The&quot;):</span>
                      <p className="text-slate-300"><MathFormula math="0.10 + 0.5(0.4)" /></p>
                      <p className="text-purple-300 font-extrabold text-sm"><MathFormula math="A_1 = +0.30" /></p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-500/30 space-y-1">
                      <span className="text-slate-400 text-[10px]">A_5 (EOS):</span>
                      <p className="text-slate-300"><MathFormula math="A_5 = 0" /></p>
                      <p className="text-rose-300 font-extrabold text-sm"><MathFormula math="A_5 = 0.00" /></p>
                    </div>
                    <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-500/30 space-y-1">
                      <span className="text-slate-400 text-[10px]">A_4 (&quot;London&quot;):</span>
                      <p className="text-slate-300"><MathFormula math="-0.80 + 0.5(0)" /></p>
                      <p className="text-rose-400 font-extrabold text-sm"><MathFormula math="A_4 = -0.80" /></p>
                    </div>
                    <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-500/30 space-y-1">
                      <span className="text-slate-400 text-[10px]">A_3 (&quot;is&quot;):</span>
                      <p className="text-slate-300"><MathFormula math="0.30 + 0.5(-0.8)" /></p>
                      <p className="text-rose-300 font-extrabold text-sm"><MathFormula math="A_3 = -0.10" /></p>
                    </div>
                    <div className="p-3 bg-purple-950/20 rounded-xl border border-purple-500/30 space-y-1">
                      <span className="text-slate-400 text-[10px]">A_2 (&quot;capital&quot;):</span>
                      <p className="text-slate-300"><MathFormula math="0.20 + 0.5(-0.1)" /></p>
                      <p className="text-purple-300 font-extrabold text-sm"><MathFormula math="A_2 = +0.15" /></p>
                    </div>
                    <div className="p-3 bg-purple-950/20 rounded-xl border border-purple-500/30 space-y-1">
                      <span className="text-slate-400 text-[10px]">A_1 (&quot;The&quot;):</span>
                      <p className="text-slate-300"><MathFormula math="0.10 + 0.5(0.15)" /></p>
                      <p className="text-purple-300 font-extrabold text-sm"><MathFormula math="A_1 = +0.175" /></p>
                    </div>
                  </>
                )}
              </div>

              <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-500/30 text-xs font-mono text-purple-300 flex items-center justify-between">
                <span>Final GAE Advantage Vector <MathFormula math="A" />:</span>
                <span className="font-extrabold text-sm">
                  {workedScenario === 'correct' ? '[+0.30, +0.40, +0.40, +0.20, 0.00]' : '[+0.175, +0.15, -0.10, -0.80, 0.00]'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-white block">
                  Meaning of <MathFormula math="A_2 = +0.40" /> (at token &quot;capital&quot;):
                </span>
                <p>
                  GAE says: Taking action &quot;capital&quot; at step 2 led to an eventual outcome that was <strong>+0.40 higher</strong> than expected by the Value function from that state. PPO will therefore increase the policy probability of choosing &quot;capital&quot; in similar contexts!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* SUB-SECTION 4: HYPERPARAMETERS & VALUE TRAINING */}
        {/* ---------------------------------------------------- */}
        {(gaeMentalTab === 'all' || gaeMentalTab === 'hyperparams') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="h-5 w-5 text-purple-400" /> 4. Why Do We Need <MathFormula math="\lambda" /> and <MathFormula math="\gamma" />? Value Function Training
              </h3>
              <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                Steps 15–19
              </span>
            </div>

            {/* Why Lambda Matrix */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-purple-400" /> What Does Decay Parameter <MathFormula math="\lambda" /> Control?
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                {/* Lambda = 0 */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-cyan-400 font-bold block"><MathFormula math="\lambda = 0" /> <span className="uppercase">(1-Step TD)</span></span>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px]">
                    <MathFormula math="A_t = \delta_t" />
                  </div>
                  <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
                    Uses only immediate 1-step TD error. Relies heavily on the Value Function being accurate (low variance, potential bias).
                  </p>
                </div>

                {/* Lambda = 1 */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-amber-400 font-bold block"><MathFormula math="\lambda = 1" /> <span className="uppercase">(Full Monte Carlo)</span></span>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px]">
                    <MathFormula math="A_t = \sum_{k=0}^\infty \gamma^k \delta_{t+k}" />
                  </div>
                  <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
                    Uses full actual return trajectory. Low bias, but high variance due to sampling noise over long text generations.
                  </p>
                </div>

                {/* Lambda = 0.95 */}
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 space-y-2">
                  <span className="text-purple-300 font-bold block"><MathFormula math="\lambda = 0.95" /> <span className="uppercase">(Optimal Compromise)</span></span>
                  <div className="p-2 bg-slate-950 rounded border border-purple-500/20 text-[11px]">
                    Exponential decay weighting
                  </div>
                  <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
                    Optimal compromise for LLM RLHF: smoothly balances bias and variance across token horizons.
                  </p>
                </div>
              </div>
            </div>

            {/* Gamma vs Lambda Distinction Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                  Discount Factor <MathFormula math="\gamma" />
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Controls <strong>reward discounting</strong>. <MathFormula math="\gamma = 0.99" /> means rewards received far into the future are weighted slightly less than immediate rewards.
                </p>
                <div className="p-2 bg-slate-900 rounded border border-slate-800 font-mono text-[11px] text-cyan-300">
                  <MathFormula math="\text{Role: Reward Discount}" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/90 border border-purple-500/30 space-y-2">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block">
                  GAE Parameter <MathFormula math="\lambda" />
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Controls <strong>horizon of advantage estimation</strong>. Determines how many steps into the future TD errors propagate back to credit current actions.
                </p>
                <div className="p-2 bg-slate-900 rounded border border-slate-800 font-mono text-[11px] text-purple-300">
                  <MathFormula math="\text{Role: Advantage Horizon Weighting}" />
                </div>
              </div>
            </div>

            {/* Where Value Function is Trained */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="h-4 w-4 text-amber-400" /> How Does the Value Model Learn?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Initially, the Value Model <MathFormula math="V_\phi" /> does not know that generating &quot;Paris&quot; produces reward 1. It learns iteratively from rollouts:
              </p>
              
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                <div className="flex justify-between items-center text-amber-300 font-bold border-b border-slate-800 pb-1">
                  <span>Critic MSE Loss Objective:</span>
                  <MathFormula math="\mathcal{L}_{\text{Value}}(\phi) = \frac{1}{2}\mathbb{E}_t\left[\left(V_\phi(s_t) - \hat{V}_t\right)^2\right]" />
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Where target return <MathFormula math="\hat{V}_t = V_\phi(s_t) + \hat{A}_t^{\text{GAE}}" />. As many trajectories ending in &quot;Paris&quot; yield high rewards, the Value head gradually learns high expected return for state prefix &quot;The capital of France is&quot;.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* SUB-SECTION 5: PIPELINE & 5 CORE EQUATIONS */}
        {/* ---------------------------------------------------- */}
        {(gaeMentalTab === 'all' || gaeMentalTab === 'architecture') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-400" /> 5. Full Architecture Flow & The 5 Golden Equations
              </h3>
              <span className="text-xs font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                Steps 20–22
              </span>
            </div>

            {/* Complete Flow Diagram Box */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <GitCompare className="h-4 w-4 text-purple-400" /> Complete RLHF Trajectory & Optimization Flow
              </h4>

              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                <pre className="text-indigo-300 leading-relaxed">
{`                   PROMPT ("What is the capital of France?")
                      │
                      ▼
               ┌─────────────┐
               │ Transformer │
               └──────┬──────┘
                      │ hidden states
             ┌────────┴────────┐
             ▼                 ▼
          POLICY             VALUE
             │                 │
      prob dist π(a|s)      V(sₜ) baseline
             │                 │
             ▼                 │
        sample token           │
             │                 │
             ▼                 │
       next state sₜ₊₁         │
             │                 │
            ...                │
             │                 │
            EOS                │
             │                 │
             ▼                 │
       Reward Model (R=1)       │
             │                 │
             └────────┬────────┘
                      ▼
                 TD errors (δₜ = rₜ + γV' - V)
                      │
                      ▼
                    GAE (Aₜ = δₜ + γλ Aₜ₊₁)
                      │
                      ▼
                 Advantages (Aₜ)
                      │
             ┌────────┴────────┐
             ▼                 ▼
        Policy update     Value update (PPO)
             │                 │
             └────────┬────────┘
                      ▼
                 New LLM Weights`}
                </pre>
              </div>
            </div>

            {/* The 5 Golden Equations Box */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-purple-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-400" /> The 5 Core Equations of GAE in LLM RL
                </h4>
                <span className="text-xs font-mono text-purple-300">Cheatsheet</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                {/* Eq 1: Value */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-indigo-300 font-bold text-[11px] block">① Value Function Definition</span>
                  <div className="py-1">
                    <MathFormula math="V(s_t) = \mathbb{E}\left[\text{future return} \mid s_t\right]" block />
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans">Baseline expected return from state <MathFormula math="s_t" />.</p>
                </div>

                {/* Eq 2: TD Error */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-cyan-300 font-bold text-[11px] block">② 1-Step TD Error</span>
                  <div className="py-1">
                    <MathFormula math="\delta_t = r_t + \gamma V(s_{t+1}) - V(s_t)" block />
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans">1-step temporal difference outcome mismatch.</p>
                </div>

                {/* Eq 3: GAE */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-purple-300 font-bold text-[11px] block">③ GAE Advantage Formula</span>
                  <div className="py-1">
                    <MathFormula math="\hat{A}_t^{\text{GAE}} = \sum_{l=0}^\infty (\gamma \lambda)^l \delta_{t+l}" block />
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans">Backward exponentially weighted TD accumulation.</p>
                </div>

                {/* Eq 4: Advantage Meaning */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-emerald-300 font-bold text-[11px] block">④ Advantage Meaning</span>
                  <div className="py-1">
                    <MathFormula math="A(s_t, a_t) = Q(s_t, a_t) - V(s_t)" block />
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans">Action quality relative to state baseline expectation.</p>
                </div>

                {/* Eq 5: Value Target */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1 col-span-1 md:col-span-2">
                  <span className="text-amber-300 font-bold text-[11px] block">⑤ Value Critic Target</span>
                  <div className="py-1">
                    <MathFormula math="\hat{V}_t = V(s_t) + \hat{A}_t^{\text{GAE}}" block />
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans">Target return used to train the Critic value head via MSE loss.</p>
                </div>
              </div>
            </div>

            {/* The Ultimate Game Analogy Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/90 to-indigo-950/40 border border-purple-500/40 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-400" /> The Ultimate Mental Model Summary
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-purple-300 font-bold block">1. Action</span>
                  <span className="text-slate-300 font-sans text-[11px]">Each generated token is an RL action.</span>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-indigo-300 font-bold block">2. Policy</span>
                  <span className="text-slate-300 font-sans text-[11px]">Asking: &quot;Which token should I choose?&quot;</span>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-amber-300 font-bold block">3. Value</span>
                  <span className="text-slate-300 font-sans text-[11px]">Asking: &quot;How good is my situation right now?&quot;</span>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-emerald-300 font-bold block">4. Reward</span>
                  <span className="text-slate-300 font-sans text-[11px]">Asking: &quot;How good was the final answer?&quot;</span>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-cyan-300 font-bold block">5. GAE</span>
                  <span className="text-slate-300 font-sans text-[11px]">Asking: &quot;Was each token choice better or worse than expected?&quot;</span>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-purple-400 font-bold block">6. PPO</span>
                  <span className="text-slate-300 font-sans text-[11px]">Increase probability of positive advantage tokens; decrease negative ones.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: PPO CLIPPED SURROGATE OBJECTIVE & LIVE GRAPH */}
      <div id="section-clipped-graph" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
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

        {/* SURROGATE OBJECTIVE EXPLANATION PANEL */}
        <div id="section-surrogate-objective" className="bg-slate-950/90 rounded-2xl p-6 border border-indigo-500/30 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-400" /> WHY PPO USES A SURROGATE OBJECTIVE
            </span>
            <h3 className="text-xl font-bold text-white">
              Why Not Simply Maximize Action Probabilities Directly?
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              The surrogate objective gives PPO a way to improve policy performance while preventing each gradient update from causing destructive policy drift.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Step 1 & 2: Goal & Naive Idea */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider block">
                1. What Are We Trying To Do?
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                After GAE, we have advantage <MathFormula math="\hat{A}_t" /> for each generated token:
              </p>
              <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-mono">
                <div className="p-1.5 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400 block">&quot;The&quot;</span>
                  <span className="text-emerald-400 font-bold">+0.30</span>
                </div>
                <div className="p-1.5 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400 block">&quot;capital&quot;</span>
                  <span className="text-emerald-400 font-bold">+0.40</span>
                </div>
                <div className="p-1.5 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400 block">&quot;is&quot;</span>
                  <span className="text-emerald-400 font-bold">+0.40</span>
                </div>
                <div className="p-1.5 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400 block">&quot;Paris&quot;</span>
                  <span className="text-emerald-400 font-bold">+0.80</span>
                </div>
              </div>
              <p className="text-[11px] text-emerald-300 font-medium">
                Positive advantage means: &quot;This action was better than expected.&quot; We want the new LLM to increase the probability of those actions.
              </p>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold text-amber-300 block mb-1">Naïve Idea (Standard Policy Gradient):</span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  If old probability <MathFormula math="\pi_{\text{old}}(a_t|s_t) = 0.20" /> and advantage <MathFormula math="A_t = +1" />, maximize standard policy gradient: <MathFormula math="\log \pi_{\text{new}}(a_t|s_t) A_t" />.
                </p>
              </div>
            </div>

            {/* Step 3 & 4: The Huge Problem & Off-Policy Degradation */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-rose-500/30 space-y-3">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-400" /> 2. The Dangerous Policy Collapse Problem
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                If old probability of <MathFormula math="\text{&quot;Paris&quot;} = 0.20" /> and advantage is positive, an unconstrained optimizer might jump probability from <MathFormula math="0.20 \rightarrow 0.99" />.
              </p>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-rose-500/20 text-[11px] text-slate-300 space-y-1">
                <span className="font-bold text-rose-300 block">Why is huge policy change dangerous?</span>
                <p>
                  Advantage estimates <MathFormula math="\hat{A}_t" /> were calculated using trajectories collected under <MathFormula math="\pi_{\text{old}}" />.
                </p>
                <p className="text-rose-400">
                  If <MathFormula math="\pi_{\text{new}} \gg \pi_{\text{old}}" />, the collected data is no longer representative of the new policy, causing training to collapse!
                </p>
              </div>

              {/* Data Pipeline Loop Box */}
              <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[10px] font-mono text-center text-slate-400 flex items-center justify-center gap-1 flex-wrap">
                <span>Old Policy <MathFormula math="\pi_{\text{old}}" /></span>
                <span>→</span>
                <span>Rollouts</span>
                <span>→</span>
                <span>Advantages <MathFormula math="\hat{A}_t" /></span>
                <span>→</span>
                <span className="text-indigo-300 font-bold">Update Policy <MathFormula math="\pi_\theta" /></span>
              </div>
            </div>
          </div>

          {/* Step 5 & 6: Probability Ratio & Basic Surrogate Objective */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-800">
            {/* Probability Ratio Box */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-indigo-500/30 space-y-3">
              <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider block">
                3. The PPO Probability Ratio <MathFormula math="r_t(\theta)" />
              </span>
              <div className="py-2 px-3 bg-slate-950 rounded-xl border border-indigo-500/40 text-center">
                <MathFormula math="r_t(\theta) = \frac{\pi_\theta(a_t|s_t)}{\pi_{\text{old}}(a_t|s_t)}" block />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Measures how much the new policy changed action probability relative to the old policy.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-slate-950 rounded border border-emerald-500/30">
                  <span className="text-emerald-400 font-bold block">Case 1: Modest Update</span>
                  <span className="text-slate-400 block"><MathFormula math="P_{\text{old}} = 0.20 \rightarrow P_{\text{new}} = 0.22" /></span>
                  <span className="text-emerald-300 font-bold block mt-1"><MathFormula math="r = 1.10" /> (+10% safe change)</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-rose-500/30">
                  <span className="text-rose-400 font-bold block">Case 2: Extreme Jump</span>
                  <span className="text-slate-400 block"><MathFormula math="P_{\text{old}} = 0.20 \rightarrow P_{\text{new}} = 0.80" /></span>
                  <span className="text-rose-300 font-bold block mt-1"><MathFormula math="r = 4.00" /> (400% dangerous jump!)</span>
                </div>
              </div>
            </div>

            {/* Basic Surrogate Objective Box */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-purple-500/30 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider block">
                  4. The Basic Unclipped Surrogate Objective
                </span>
                <div className="py-2 px-3 bg-slate-950 rounded-xl border border-purple-500/40 text-center">
                  <MathFormula math="L^{PG}(\theta) = \hat{\mathbb{E}}_t \left[ r_t(\theta) \hat{A}_t \right]" block />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Why multiply ratio by advantage?</strong> It asks: <em>&quot;If I change the probability of this action, how much should its contribution to the objective change?&quot;</em>
                </p>
                <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-300">
                  If <MathFormula math="A_t = +1.0" /> and <MathFormula math="r_t = 1.2" />, then <MathFormula math="r_t A_t = 1.2" />. The model is rewarded for increasing probability of good actions.
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-purple-300 font-mono flex items-center justify-between">
                <span>Next step: Apply clipping to cap <MathFormula math="r_t" /></span>
                <ArrowRight className="h-4 w-4 text-purple-400 shrink-0" />
              </div>
            </div>
          </div>
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
