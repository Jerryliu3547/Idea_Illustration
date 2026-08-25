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
  Info
} from 'lucide-react';

export const PPOVisualizer: React.FC = () => {
  // Sliders state
  const [ratio, setRatio] = useState<number>(1.25);
  const [advantage, setAdvantage] = useState<number>(1.0);
  const [epsilon, setEpsilon] = useState<number>(0.2);

  // Computed values for current selected ratio
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
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-1">
          <Sliders className="h-4 w-4" /> Policy Gradient Stabilization
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          PPO (Proximal Policy Optimization)
        </h1>
        <p className="text-slate-400 mt-2 text-base leading-relaxed flex items-center gap-1 flex-wrap">
          PPO prevents destructive policy updates during RL training by clipping the probability ratio <MathFormula math="r_t(\theta) = \frac{\pi_\theta(a|s)}{\pi_{\text{old}}(a|s)}" />, ensuring the new policy does not drift too far from the old policy.
        </p>
      </div>

      {/* Math Formula Panel */}
      <div className="glass-panel rounded-2xl p-6 space-y-3">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          PPO Clipped Surrogate Objective
        </h3>
        <MathFormula 
          math="L^{\text{CLIP}}(\theta) = \hat{\mathbb{E}}_t \left[ \min\left( r_t(\theta) \hat{A}_t, \, \text{clip}\left(r_t(\theta), \, 1-\epsilon, \, 1+\epsilon\right) \hat{A}_t \right) \right]" 
          block 
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs text-slate-400 border-t border-slate-800/80">
          <div>
            <span className="font-semibold text-indigo-300 flex items-center gap-1">Probability Ratio <MathFormula math="r_t(\theta)" />:</span>
            <p className="mt-0.5">Measures how much more or less likely the action is under the new policy vs old policy.</p>
          </div>
          <div>
            <span className="font-semibold text-emerald-300 flex items-center gap-1">Advantage Estimate <MathFormula math="\hat{A}_t" />:</span>
            <p className="mt-0.5">Positive if action performed better than average baseline; negative if worse.</p>
          </div>
          <div>
            <span className="font-semibold text-purple-300 flex items-center gap-1">Clip Threshold <MathFormula math="\epsilon" />:</span>
            <p className="mt-0.5">Hyperparameter (typically 0.1 to 0.3) bounding maximum allowed policy change step.</p>
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
  );
};
