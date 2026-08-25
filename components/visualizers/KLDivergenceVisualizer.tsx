"use client";

import React, { useState, useMemo } from 'react';
import { MathFormula } from '@/components/ui/MathFormula';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  Sliders, 
  Dices,
  Calculator,
  ArrowRightLeft,
  BookOpen
} from 'lucide-react';

export const KLDivergenceVisualizer: React.FC = () => {
  // Continuous LLM state
  const [beta, setBeta] = useState<number>(0.1);
  const [driftMean, setDriftMean] = useState<number>(1.2); // Shift in policy mean relative to ref mean (0)

  // Discrete Unbalanced Die state
  // Reference P: Fair die P(i) = 1/6 ~ 0.1667
  const P_die = useMemo(() => [1/6, 1/6, 1/6, 1/6, 1/6, 1/6], []);
  
  // Model Q state: Unbalanced die probabilities for faces 1..6
  const [rawQ, setRawQ] = useState<number[]>([0.08, 0.08, 0.08, 0.08, 0.08, 0.60]);

  // Normalize Q so probabilities sum to exactly 1.0
  const Q_die = useMemo(() => {
    const sum = rawQ.reduce((a, b) => a + b, 0) || 1;
    return rawQ.map(val => val / sum);
  }, [rawQ]);

  // Preset handlers for unbalanced die
  const setPreset = (preset: 'heavy6' | 'evens' | 'slight' | 'fair') => {
    if (preset === 'heavy6') setRawQ([0.08, 0.08, 0.08, 0.08, 0.08, 0.60]);
    if (preset === 'evens') setRawQ([0.05, 0.28, 0.05, 0.28, 0.06, 0.28]);
    if (preset === 'slight') setRawQ([0.12, 0.15, 0.15, 0.18, 0.15, 0.25]);
    if (preset === 'fair') setRawQ([1/6, 1/6, 1/6, 1/6, 1/6, 1/6]);
  };

  const handleDieSliderChange = (index: number, val: number) => {
    const updated = [...rawQ];
    updated[index] = val;
    setRawQ(updated);
  };

  // Real number step-by-step calculations for KL(P || Q) and KL(Q || P)
  const dieCalculations = useMemo(() => {
    let klPQ_nats = 0;
    let klQP_nats = 0;

    const rows = P_die.map((p, i) => {
      const q = Q_die[i];
      const ratioPQ = p / (q || 1e-9);
      const lnRatioPQ = Math.log(ratioPQ);
      const termPQ = p * lnRatioPQ;
      klPQ_nats += termPQ;

      const ratioQP = q / (p || 1e-9);
      const lnRatioQP = Math.log(ratioQP);
      const termQP = q * lnRatioQP;
      klQP_nats += termQP;

      return {
        face: i + 1,
        p: parseFloat(p.toFixed(4)),
        q: parseFloat(q.toFixed(4)),
        ratioPQ: parseFloat(ratioPQ.toFixed(4)),
        lnRatioPQ: parseFloat(lnRatioPQ.toFixed(4)),
        termPQ: parseFloat(termPQ.toFixed(4)),
      };
    });

    const klPQ_bits = klPQ_nats / Math.LN2;
    const klQP_bits = klQP_nats / Math.LN2;

    return {
      rows,
      klPQ_nats: parseFloat(klPQ_nats.toFixed(4)),
      klPQ_bits: parseFloat(klPQ_bits.toFixed(4)),
      klQP_nats: parseFloat(klQP_nats.toFixed(4)),
      klQP_bits: parseFloat(klQP_bits.toFixed(4)),
    };
  }, [P_die, Q_die]);

  // Die Bar chart data
  const dieChartData = useMemo(() => {
    return dieCalculations.rows.map(row => ({
      face: `Face ${row.face}`,
      'Fair Die P(i)': row.p,
      'Loaded Die Q(i)': row.q,
    }));
  }, [dieCalculations]);

  // Compute live KL Divergence for Gaussian distribution approximation
  const s0 = 1.0;
  const s1 = 0.85;
  const klDivergence = useMemo(() => {
    const term = Math.log(s0 / s1) + (Math.pow(s1, 2) + Math.pow(driftMean, 2)) / (2 * Math.pow(s0, 2)) - 0.5;
    return Math.max(0, term);
  }, [driftMean]);

  // Compute total penalized reward: R_total = Raw_Reward - beta * KL
  const rawReward = 1.8 + driftMean * 0.4;
  const klPenalty = beta * klDivergence;
  const totalReward = rawReward - klPenalty;

  // Generate continuous distribution points for Recharts graph
  const distributionData = useMemo(() => {
    const data = [];
    for (let x = -4.0; x <= 5.0; x += 0.2) {
      const pdfRef = (1 / (s0 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow(x / s0, 2));
      const pdfPolicy = (1 / (s1 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - driftMean) / s1, 2));

      data.push({
        x: parseFloat(x.toFixed(1)),
        refPolicy: parseFloat(pdfRef.toFixed(4)),
        rlPolicy: parseFloat(pdfPolicy.toFixed(4)),
      });
    }
    return data;
  }, [driftMean]);

  return (
    <div className="space-y-10 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-1">
          <Activity className="h-4 w-4" /> Distribution Regularization & Divergence
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          KL Divergence (Kullback-Leibler Constraint)
        </h1>
        <p className="text-slate-400 mt-2 text-base leading-relaxed flex items-center gap-1 flex-wrap">
          KL Divergence quantifies how one probability distribution differs from a reference distribution. In RLHF, it measures how much the RL Policy <MathFormula math="\pi_\theta" /> has drifted from the SFT Reference Model <MathFormula math="\pi_{\text{ref}}" />.
        </p>
      </div>

      {/* TOP FEATURED MATHEMATICAL FORMULA CARD */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-slate-900/60 to-purple-950/20 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-cyan-400" /> Core Mathematical Formulations
          </h2>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Definition & RLHF Reward
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Discrete Formulation */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider block">
              1. Discrete Distribution KL Formula
            </span>
            <MathFormula 
              math="D_{\text{KL}}(P \parallel Q) = \sum_{x \in \mathcal{X}} P(x) \ln \left( \frac{P(x)}{Q(x)} \right)" 
              block 
            />
            <p className="text-xs text-slate-400 mt-1">
              Sum of weighted log-ratios across discrete states (e.g. dice outcomes or token vocabularies).
            </p>
          </div>

          {/* Continuous & LLM Regularized Reward Formulation */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider block">
              2. RLHF Policy Penalty Reward Formula
            </span>
            <MathFormula 
              math="R_{\text{total}}(x, y) = R_{\text{RM}}(x, y) - \beta D_{\text{KL}}\left(\pi_\theta(y \mid x) \parallel \pi_{\text{ref}}(y \mid x)\right)" 
              block 
            />
            <p className="text-xs text-slate-400 mt-1">
              Combines Reward Model score <MathFormula math="R_{\text{RM}}" /> with KL penalty <MathFormula math="\beta D_{\text{KL}}" /> to prevent reward hacking.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono border-t border-slate-800 text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Non-negativity: <MathFormula math="D_{\text{KL}}(P \parallel Q) \ge 0" /></span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>Identity: <MathFormula math="D_{\text{KL}}(P \parallel Q) = 0 \iff P = Q" /></span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" />
            <span>Asymmetric: <MathFormula math="D_{\text{KL}}(P \parallel Q) \neq D_{\text{KL}}(Q \parallel P)" /></span>
          </div>
        </div>
      </div>

      {/* SECTION 1: SIMPLE CONCRETE DISCRETE EXAMPLE (UNBALANCED DIE) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-cyan-500/30 bg-cyan-950/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
              CONCRETE INTUITION & STEP-BY-STEP NUMBERS
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Dices className="h-6 w-6 text-cyan-400" /> Simple Discrete Example: Fair Die vs. Unbalanced Die
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Compare a Fair 6-sided Die <MathFormula math="P(i) = 1/6 \approx 0.1667" /> against an Unbalanced (Loaded) Die <MathFormula math="Q(i)" />. Watch the exact mathematical breakdown with real numbers!
            </p>
          </div>

          {/* Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-mono">Presets:</span>
            <button
              onClick={() => setPreset('heavy6')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
            >
              Loaded Face 6 (60%)
            </button>
            <button
              onClick={() => setPreset('evens')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
            >
              Biased Evens
            </button>
            <button
              onClick={() => setPreset('slight')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
            >
              Slight Bias
            </button>
            <button
              onClick={() => setPreset('fair')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-slate-700"
            >
              Both Fair (KL = 0)
            </button>
          </div>
        </div>

        {/* Die Probability Sliders & Bar Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sliders for Face Probabilities Q(i) */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Loaded Die <MathFormula math="Q(i)" /> Probabilities</span>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                Sum = 1.00
              </span>
            </h3>

            <div className="space-y-3">
              {rawQ.map((val, idx) => {
                const normQ = Q_die[idx];
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Face {idx + 1}:</span>
                      <span className="text-purple-300 font-bold">{normQ.toFixed(4)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.01"
                      max="0.80"
                      step="0.01"
                      value={val}
                      onChange={(e) => handleDieSliderChange(idx, parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side-by-Side Recharts Bar Chart */}
          <div className="lg:col-span-2 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <h3 className="text-sm font-bold text-white mb-2">
              Side-by-Side Probability Comparison: <MathFormula math="P(i)" /> vs <MathFormula math="Q(i)" />
            </h3>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dieChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="face" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 0.7]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#334155', 
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="Fair Die P(i)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Loaded Die Q(i)" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Real Numbers Step-by-Step Calculation Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calculator className="h-4 w-4 text-cyan-400" /> Step-by-Step Real Number Calculation Table
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider bg-slate-950/60">
                  <th className="py-2.5 px-3">Face <MathFormula math="i" /></th>
                  <th className="py-2.5 px-3 text-cyan-400">Fair <MathFormula math="P(i)" /></th>
                  <th className="py-2.5 px-3 text-purple-400">Loaded <MathFormula math="Q(i)" /></th>
                  <th className="py-2.5 px-3">Ratio <MathFormula math="P(i)/Q(i)" /></th>
                  <th className="py-2.5 px-3"><MathFormula math="\ln(P/Q)" /></th>
                  <th className="py-2.5 px-3 text-emerald-400"><MathFormula math="P(i) \ln(P(i)/Q(i))" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {dieCalculations.rows.map((row) => (
                  <tr key={row.face} className="hover:bg-slate-800/30">
                    <td className="py-2 px-3 font-bold text-white">Face {row.face}</td>
                    <td className="py-2 px-3 text-cyan-300">{row.p.toFixed(4)}</td>
                    <td className="py-2 px-3 text-purple-300">{row.q.toFixed(4)}</td>
                    <td className="py-2 px-3 text-slate-300">{row.ratioPQ.toFixed(4)}</td>
                    <td className="py-2 px-3 text-slate-400">{row.lnRatioPQ.toFixed(4)}</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">
                      {row.termPQ >= 0 ? `+${row.termPQ.toFixed(4)}` : row.termPQ.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-700 bg-slate-950 font-bold text-sm">
                  <td colSpan={5} className="py-3 px-3 text-white uppercase tracking-wider">
                    Total KL Divergence <MathFormula math="D_{\text{KL}}(P \parallel Q) = \sum P(i) \ln \frac{P(i)}{Q(i)}" />
                  </td>
                  <td className="py-3 px-3 text-cyan-300 text-base font-mono">
                    {dieCalculations.klPQ_nats.toFixed(4)} nats <span className="text-xs text-slate-400 font-normal">({dieCalculations.klPQ_bits.toFixed(4)} bits)</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Asymmetry Demonstration Box */}
        <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-purple-400" /> KL Divergence Asymmetry Check: <MathFormula math="D_{\text{KL}}(P \parallel Q) \neq D_{\text{KL}}(Q \parallel P)" />
            </h4>
            <span className="text-xs text-slate-400 font-mono">Direction Matters!</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1">
              <span className="text-slate-400 text-[11px] block">Forward KL: <MathFormula math="D_{\text{KL}}(P \parallel Q)" /></span>
              <span className="text-xl font-bold text-cyan-300">{dieCalculations.klPQ_nats.toFixed(4)} nats</span>
              <p className="text-[10px] text-slate-400 font-sans mt-1">Measures information loss when approximating Fair P using Loaded Q.</p>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-1">
              <span className="text-slate-400 text-[11px] block">Reverse KL: <MathFormula math="D_{\text{KL}}(Q \parallel P)" /></span>
              <span className="text-xl font-bold text-purple-300">{dieCalculations.klQP_nats.toFixed(4)} nats</span>
              <p className="text-[10px] text-slate-400 font-sans mt-1">Measures information loss when approximating Loaded Q using Fair P.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: LLM POLICY REGULARIZATION & REWARD HACKING */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1">
            LLM POLICY REGULARIZATION IN RLHF
          </span>
          <h2 className="text-2xl font-bold text-white">
            Continuous Policy Shift & Reward Hacking Control
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            In LLMs, the KL penalty prevents the RL policy from drifting into degenerate output modes.
          </p>
        </div>

        {/* Main Graph & Interactive Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="glass-panel rounded-2xl p-6 space-y-6 lg:col-span-1 flex flex-col justify-between">
            <div className="space-y-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-cyan-400" /> Interactive Parameters
              </h3>

              {/* Slider 1: Policy Drift */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Policy Distribution Shift:</span>
                  <span className="font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    +{driftMean.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="3.0"
                  step="0.1"
                  value={driftMean}
                  onChange={(e) => setDriftMean(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0.0 (Identical)</span>
                  <span>3.0 (Extreme Drift)</span>
                </div>
              </div>

              {/* Slider 2: KL Coefficient Beta */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1">KL Penalty Factor <MathFormula math="\beta" />:</span>
                  <span className="font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    {beta.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.4"
                  step="0.02"
                  value={beta}
                  onChange={(e) => setBeta(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0.0 (Unconstrained)</span>
                  <span>0.1 (Balanced)</span>
                  <span>0.4 (Strict)</span>
                </div>
              </div>
            </div>

            {/* Computed Output Box */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Raw Reward Model Score:</span>
                  <span className="text-emerald-400 font-bold">+{rawReward.toFixed(3)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1">KL Penalty (<MathFormula math="\beta \times D_{\text{KL}}" />):</span>
                  <span className="text-rose-400 font-bold">-{klPenalty.toFixed(3)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1.5 font-bold text-slate-100">
                  <span>Total Net Reward:</span>
                  <span className="text-cyan-300">{totalReward.toFixed(3)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Graph & Reward Hacking Alert Panel */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Reference vs. Policy Distribution Drift</h3>
                  <p className="text-xs text-slate-400">
                    Visualization of token probability mass shift between Reference Model and RL Policy.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-3 h-1 bg-slate-500 rounded" /> Ref Policy <MathFormula math="\pi_{\text{ref}}" />
                  </span>
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <span className="w-3 h-1 bg-cyan-400 rounded" /> RL Policy <MathFormula math="\pi_\theta" />
                  </span>
                </div>
              </div>

              {/* Recharts Area Chart */}
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="x" stroke="#64748b" fontSize={11} />
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
                    <Area 
                      type="monotone" 
                      dataKey="refPolicy" 
                      stroke="#64748b" 
                      fill="#64748b" 
                      fillOpacity={0.2} 
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="rlPolicy" 
                      stroke="#06b6d4" 
                      fill="#06b6d4" 
                      fillOpacity={0.3} 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Reward Hacking Indicator Box */}
            <div className={`mt-4 p-4 rounded-xl border text-xs flex items-start gap-3 ${
              beta === 0 
                ? 'bg-rose-950/30 border-rose-500/50 text-rose-200' 
                : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
            }`}>
              {beta === 0 ? (
                <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold text-white block mb-0.5">
                  {beta === 0 ? 'WARNING: Unconstrained Optimization (Beta = 0)' : 'STABLE: KL Constrained Policy'}
                </span>
                {beta === 0 ? (
                  <p>
                    Without KL penalty, the model exploits reward model blind spots (e.g. repeating high-scoring words like &quot;great excellent perfect&quot; indefinitely).
                  </p>
                ) : (
                  <p>
                    KL constraint keeps token distributions anchored to the natural language baseline, enforcing coherence while optimizing alignment.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
