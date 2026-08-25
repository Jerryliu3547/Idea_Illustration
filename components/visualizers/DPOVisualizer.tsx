"use client";

import React, { useState } from 'react';
import { MathFormula } from '@/components/ui/MathFormula';
import { 
  GitCompare, 
  Check, 
  X, 
  Sliders, 
  Zap, 
  Server
} from 'lucide-react';

export const DPOVisualizer: React.FC = () => {
  // DPO Interactive State
  const [beta, setBeta] = useState<number>(0.1);
  const [probW, setProbW] = useState<number>(0.75); // Policy prob for preferred output y_w
  const [probL, setProbL] = useState<number>(0.25); // Policy prob for dispreferred output y_l

  // Reference probabilities fixed for baseline comparison
  const refProbW = 0.50;
  const refProbL = 0.50;

  // DPO Math derivations
  const implicitRewardW = beta * Math.log(probW / refProbW);
  const implicitRewardL = beta * Math.log(probL / refProbL);
  const rewardDiff = implicitRewardW - implicitRewardL;

  // Sigmoid of reward diff
  const sigmoidDiff = 1 / (1 + Math.exp(-rewardDiff));
  const dpoLoss = -Math.log(Math.max(sigmoidDiff, 1e-7));

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold uppercase tracking-wider mb-1">
          <GitCompare className="h-4 w-4" /> Direct Policy Alignment
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          DPO (Direct Preference Optimization)
        </h1>
        <p className="text-slate-400 mt-2 text-base leading-relaxed">
          DPO bypasses the complex RL step by reparameterizing the reward function directly in terms of policy log-probabilities. It optimizes LLM preference alignment without training an explicit reward model or running PPO actor-critic loops.
        </p>
      </div>

      {/* PPO vs DPO Architectural Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traditional PPO Architecture */}
        <div className="glass-panel rounded-2xl p-6 border-rose-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="h-4 w-4 text-rose-400" /> Standard PPO RLHF Architecture
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
              High Memory (4 Models)
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-medium">1. Policy Model (Actor)</span>
              <span className="text-rose-400 font-mono text-[10px]">Trainable LLM</span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-medium">2. Value Model (Critic)</span>
              <span className="text-rose-400 font-mono text-[10px]">Trainable LLM</span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-medium">3. Reward Model (RM)</span>
              <span className="text-slate-400 font-mono text-[10px]">Frozen LLM</span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-medium">4. Reference Model (SFT)</span>
              <span className="text-slate-400 font-mono text-[10px]">Frozen LLM</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-rose-950/20 border border-rose-900/40 p-3 rounded-xl flex items-center gap-2">
            <X className="h-4 w-4 text-rose-400 shrink-0" />
            <span>Requires sampling rollouts, value baseline fitting, and unstable PPO hyperparameter tuning.</span>
          </div>
        </div>

        {/* Streamlined DPO Architecture */}
        <div className="glass-panel rounded-2xl p-6 border-emerald-500/30 bg-emerald-950/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" /> Direct Preference (DPO) Architecture
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              Low Memory (2 Models)
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-950/90 rounded-xl border border-emerald-500/40 flex items-center justify-between shadow-sm shadow-emerald-500/10">
              <span className="text-slate-100 font-semibold flex items-center gap-1">1. Policy Model (<MathFormula math="\pi_\theta" />)</span>
              <span className="text-emerald-400 font-mono text-[10px]">Trainable LLM</span>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-medium flex items-center gap-1">2. Reference Model (<MathFormula math="\pi_{\text{ref}}" />)</span>
              <span className="text-slate-400 font-mono text-[10px]">Frozen LLM</span>
            </div>
            <div className="p-3 bg-slate-950/30 rounded-xl border border-slate-800/40 flex items-center justify-between opacity-40 line-through">
              <span className="text-slate-500 font-medium">No Critic Model Needed</span>
              <span className="text-slate-500 text-[10px]">Saved GPU VRAM</span>
            </div>
            <div className="p-3 bg-slate-950/30 rounded-xl border border-slate-800/40 flex items-center justify-between opacity-40 line-through">
              <span className="text-slate-500 font-medium">No Reward Model Needed</span>
              <span className="text-slate-500 text-[10px]">Implicit Reward</span>
            </div>
          </div>

          <div className="text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-xl flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Simple classification loss directly on token log-probabilities! Super stable & fast.</span>
          </div>
        </div>
      </div>

      {/* DPO Mathematical Formulation Panel */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          DPO Loss Objective & Implicit Reward Function
        </h3>
        
        <div className="space-y-4">
          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800">
            <span className="text-xs font-mono text-emerald-400 font-semibold block mb-1">
              DPO Loss Formula
            </span>
            <MathFormula 
              math="\mathcal{L}_{\text{DPO}}(\theta; \pi_{\text{ref}}) = -\mathbb{E}_{(x, y_w, y_l)} \left[ \log \sigma \left( \beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_{\text{ref}}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_{\text{ref}}(y_l \mid x)} \right) \right]" 
              block 
            />
          </div>

          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800">
            <span className="text-xs font-mono text-indigo-400 font-semibold block mb-1 flex items-center gap-1">
              Implicit Reward Derivation: <MathFormula math="r(x,y)" />
            </span>
            <MathFormula 
              math="r(x, y) = \beta \log \frac{\pi_\theta(y \mid x)}{\pi_{\text{ref}}(y \mid x)}" 
              block 
            />
          </div>
        </div>
      </div>

      {/* Interactive Token Log-Prob Shift Sandbox */}
      <div className="glass-panel rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="h-4 w-4 text-emerald-400" /> Interactive Token Probability Sandbox
            </h3>
            <p className="text-xs text-slate-400">
              Adjust policy output probabilities to see how the implicit rewards shift and how DPO loss behaves.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="space-y-5 bg-slate-950/70 p-5 rounded-xl border border-slate-800">
            {/* Beta Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1">Temperature Regularization <MathFormula math="\beta" />:</span>
                <span className="font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                  {beta.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.01"
                value={beta}
                onChange={(e) => setBeta(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Preferred Prob Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-400 font-medium flex items-center gap-1">Policy Prob <MathFormula math="\pi_\theta(y_w \mid x)" />:</span>
                <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {probW.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.95"
                step="0.01"
                value={probW}
                onChange={(e) => setProbW(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Ref prob fixed at 0.50</span>
            </div>

            {/* Dispreferred Prob Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-rose-400 font-medium flex items-center gap-1">Policy Prob <MathFormula math="\pi_\theta(y_l \mid x)" />:</span>
                <span className="font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                  {probL.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.9"
                step="0.01"
                value={probL}
                onChange={(e) => setProbL(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Ref prob fixed at 0.50</span>
            </div>
          </div>

          {/* Results Output Column */}
          <div className="md:col-span-2 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Live Computed Implicit Rewards & Loss
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">Preferred Implicit Reward <MathFormula math="r(x, y_w)" /></span>
                  <span className="text-lg font-bold text-emerald-400">
                    {implicitRewardW >= 0 ? `+${implicitRewardW.toFixed(4)}` : implicitRewardW.toFixed(4)}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">Dispreferred Implicit Reward <MathFormula math="r(x, y_l)" /></span>
                  <span className="text-lg font-bold text-rose-400">
                    {implicitRewardL >= 0 ? `+${implicitRewardL.toFixed(4)}` : implicitRewardL.toFixed(4)}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/40 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-300 font-bold block">Calculated DPO Loss:</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1"><MathFormula math="-\log \sigma(r(x,y_w) - r(x,y_l))" /></span>
                </div>
                <span className="text-xl font-mono font-bold text-cyan-300">
                  {dpoLoss.toFixed(4)}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 italic flex items-center gap-1 flex-wrap">
              * Notice how increasing <MathFormula math="\pi_\theta(y_w)" /> relative to <MathFormula math="\pi_\theta(y_l)" /> increases the reward gap and drives DPO loss towards 0.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
