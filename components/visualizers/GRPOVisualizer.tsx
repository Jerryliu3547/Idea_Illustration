"use client";

import React, { useState, useMemo } from 'react';
import { MathFormula } from '@/components/ui/MathFormula';
import { 
  Users, 
  Calculator, 
  Award
} from 'lucide-react';

export const GRPOVisualizer: React.FC = () => {
  // State: Sampled response rewards
  const [rewards, setRewards] = useState<number[]>([0.9, 0.2, 0.7, 0.1]);

  // Add or remove response from group
  const handleGroupSizeChange = (size: number) => {
    if (size > rewards.length) {
      setRewards([...rewards, 0.5]);
    } else if (size < rewards.length && rewards.length > 2) {
      setRewards(rewards.slice(0, size));
    }
  };

  const updateReward = (index: number, val: number) => {
    const updated = [...rewards];
    updated[index] = val;
    setRewards(updated);
  };

  // Group Advantage calculations
  const stats = useMemo(() => {
    const mean = rewards.reduce((acc, r) => acc + r, 0) / rewards.length;
    const variance = rewards.reduce((acc, r) => acc + Math.pow(r - mean, 2), 0) / rewards.length;
    const std = Math.sqrt(variance) || 1e-6; // prevent div by 0

    const advantages = rewards.map(r => (r - mean) / std);

    return { mean, std, advantages };
  }, [rewards]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold uppercase tracking-wider mb-1">
          <Users className="h-4 w-4" /> Group Relative Baseline (DeepSeek-R1 Architecture)
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          GRPO (Group Relative Policy Optimization)
        </h1>
        <p className="text-slate-400 mt-2 text-base leading-relaxed">
          GRPO is a key innovation behind DeepSeek-Math and DeepSeek-R1. Instead of training a massive Critic network to estimate state values, GRPO generates a group of candidate responses for each prompt and estimates advantages relative to the group mean.
        </p>
      </div>

      {/* GRPO Objective Formula */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          GRPO Clipped Loss & Group Advantage Formulation
        </h3>
        
        <div className="space-y-3">
          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800">
            <span className="text-xs font-mono text-purple-400 font-semibold block mb-1">
              Group Advantage Calculation (No Critic Model!)
            </span>
            <MathFormula 
              math="A_i = \frac{r_i - \text{mean}\left(\{r_1, r_2, \dots, r_G\}\right)}{\text{std}\left(\{r_1, r_2, \dots, r_G\}\right)}" 
              block 
            />
          </div>

          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800">
            <span className="text-xs font-mono text-indigo-400 font-semibold block mb-1">
              GRPO Objective Function
            </span>
            <MathFormula 
              math="\mathcal{L}_{\text{GRPO}}(\theta) = \frac{1}{G} \sum_{i=1}^G \min\left( \frac{\pi_\theta(y_i \mid x)}{\pi_{\text{old}}(y_i \mid x)} A_i, \, \text{clip}\left(\frac{\pi_\theta(y_i \mid x)}{\pi_{\text{old}}(y_i \mid x)}, 1-\epsilon, 1+\epsilon\right) A_i \right) - \beta D_{\text{KL}}(\pi_\theta \parallel \pi_{\text{ref}})" 
              block 
            />
          </div>
        </div>
      </div>

      {/* Interactive Group Advantage Simulator */}
      <div className="glass-panel rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="h-4 w-4 text-purple-400" /> Interactive Response Group Sandbox
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1 flex-wrap">
              Adjust group size <MathFormula math="G" /> and individual response rewards <MathFormula math="r_i" />. Watch how advantages normalize live across the group.
            </p>
          </div>

          {/* Group Size Controls */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 px-2 font-mono">Group Size G:</span>
            {[4, 5, 6, 8].map(size => (
              <button
                key={size}
                onClick={() => handleGroupSizeChange(size)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  rewards.length === size
                    ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Live Group Stats Summary Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[11px] flex items-center gap-1">Group Mean Baseline (<MathFormula math="\bar{r}" />)</span>
            <span className="text-xl font-bold text-indigo-400">{stats.mean.toFixed(3)}</span>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[11px] flex items-center gap-1">Group Std Dev (<MathFormula math="\sigma_r" />)</span>
            <span className="text-xl font-bold text-purple-400">{stats.std.toFixed(3)}</span>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 col-span-2 md:col-span-1">
            <span className="text-slate-500 text-[11px] block">Memory Efficiency vs PPO</span>
            <span className="text-xl font-bold text-emerald-400">~50% Saved</span>
          </div>
        </div>

        {/* Group Item Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((r, idx) => {
            const adv = stats.advantages[idx];
            return (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-purple-300 flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-purple-400" /> Response <MathFormula math={`y_{${idx + 1}}`} />
                  </span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                    adv >= 0 
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' 
                      : 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                  }`}>
                    Advantage <MathFormula math={`A_{${idx + 1}}`} />: {adv >= 0 ? `+${adv.toFixed(2)}` : adv.toFixed(2)}
                  </span>
                </div>

                {/* Reward Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">Raw Reward Score <MathFormula math={`r_{${idx + 1}}`} />:</span>
                    <span className="font-mono font-bold text-slate-200">{r.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.05"
                    value={r}
                    onChange={(e) => updateReward(idx, parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
