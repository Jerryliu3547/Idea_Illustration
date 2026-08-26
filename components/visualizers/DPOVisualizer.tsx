"use client";

import React, { useState } from 'react';
import { MathFormula } from '@/components/ui/MathFormula';
import { getAssetPath } from '@/lib/asset';
import { 
  GitCompare, 
  Check, 
  X, 
  Sliders, 
  Zap, 
  Server,
  BookOpen,
  Calculator,
  ArrowRight,
  Sparkles,
  Cloud,
  ZoomIn,
  Maximize2,
  Bookmark,
  ArrowUp,
  Video,
  ExternalLink,
  Scale
} from 'lucide-react';

export const DPOVisualizer: React.FC = () => {
  // Modal Lightbox state for enlarged image preview
  const [activeModalImage, setActiveModalImage] = useState<{ src: string; title: string } | null>(null);

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

  // Bradley-Terry Interactive State
  const [btReward1, setBtReward1] = useState<number>(2.0);
  const [btReward2, setBtReward2] = useState<number>(0.5);

  const btRewardDiff = btReward1 - btReward2;
  const btProb1 = 1 / (1 + Math.exp(-btRewardDiff));
  const btProb2 = 1 - btProb1;

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

      {/* Featured Main DPO Loss Objective Banner at Very Top */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 via-slate-900/90 to-purple-950/30 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-emerald-400" /> Core DPO Loss Function Objective
          </span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Primary Target
          </span>
        </div>
        <div className="py-3.5 px-4 bg-slate-950/95 rounded-xl border border-emerald-500/30 text-center shadow-inner overflow-x-auto">
          <MathFormula 
            math="\mathcal{L}_{\text{DPO}}(\theta; \pi_{\text{ref}}) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}} \left[ \log \sigma \left( \beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_{\text{ref}}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_{\text{ref}}(y_l \mid x)} \right) \right]" 
            block 
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 gap-2 border-t border-slate-800/80 pt-2">
          <span>Directly optimizes policy network <MathFormula math="\pi_\theta" /> using preference pairs <MathFormula math="(x, y_w, y_l)" />.</span>
          <span className="text-indigo-400 font-mono text-[11px] font-semibold">Implicit Reward: <MathFormula math="r(x,y) = \beta \log \frac{\pi_\theta(y \mid x)}{\pi_{\text{ref}}(y \mid x)}" /></span>
        </div>
      </div>

      {/* QUICK SECTION BOOKMARK NAVIGATION BAR */}
      <div className="sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border border-emerald-500/40 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
          <Bookmark className="h-4 w-4 text-emerald-400" />
          <span>Quick Section Bookmarks:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-mono">
          <button
            onClick={() => document.getElementById('section-derivation')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <BookOpen className="h-4 w-4 text-purple-400 shrink-0" />
            <span className="font-semibold">1. DPO Loss Derivation</span>
          </button>

          <button
            onClick={() => document.getElementById('section-bradley-terry')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <Scale className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="font-semibold">2. Bradley-Terry Model</span>
          </button>

          <button
            onClick={() => document.getElementById('section-beta-explanation')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <Sliders className="h-4 w-4 text-cyan-400 shrink-0" />
            <span className="font-semibold">3. Beta (β) Explanation</span>
          </button>

          <button
            onClick={() => document.getElementById('section-sandbox')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-indigo-500/20 text-slate-200 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <Sliders className="h-4 w-4 text-indigo-400 shrink-0" />
            <span className="font-semibold">4. Interactive Sandbox</span>
          </button>

          <button
            onClick={() => document.getElementById('section-video')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-red-500/20 text-slate-200 hover:text-red-300 border border-slate-800 hover:border-red-500/40 transition-all flex items-center justify-start gap-2.5 text-left md:col-span-2 lg:col-span-1"
          >
            <Video className="h-4 w-4 text-red-400 shrink-0" />
            <span className="font-semibold">5. Video Walkthrough</span>
          </button>
        </div>
      </div>

      {/* FEATURED TOP SECTION: DPO LOSS FUNCTION MATHEMATICAL DERIVATION & WALKTHROUGH */}
      <div id="section-derivation" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-8 border-purple-500/40 bg-gradient-to-br from-purple-950/20 via-slate-900/80 to-indigo-950/20 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-purple-400" /> MATHEMATICAL DERIVATION WALKTHROUGH
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            The DPO Loss Function Derivation
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            How DPO mathematically reparameterizes the reward function to cancel out explicit reward modeling and derive a direct policy classification loss.
          </p>
        </div>

        {/* Infographic Image Card & Lightbox Launcher */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Derivation Flowchart Diagram
          </span>
          <div 
            onClick={() => setActiveModalImage({ 
              src: getAssetPath('/dpo_loss_derivation.png'), 
              title: 'The DPO Loss Function Derivation Infographic' 
            })}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-purple-500/40 bg-slate-950 p-2 shadow-2xl"
          >
            <img 
              src={getAssetPath('/dpo_loss_derivation.png')} 
              alt="The DPO Loss Function Derivation" 
              className="w-full h-auto max-h-[500px] object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-500 ease-out" 
            />
            <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-purple-300 font-mono text-sm font-bold backdrop-blur-[2px]">
              <ZoomIn className="h-5 w-5" /> Click to Expand Full Resolution Image
            </div>
          </div>
        </div>

        {/* Step-by-Step Derivation Breakdown Grid */}
        <div className="space-y-6">
          <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider">
            Step-by-Step Derivation Breakdown
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1: Standard RLHF Objective */}
            <div className="bg-slate-950/90 p-5 rounded-2xl border border-purple-500/30 space-y-3 flex flex-col justify-between shadow-lg">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider block">
                  1. Standard RLHF Objective
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Standard RLHF optimizes policy <MathFormula math="\pi" /> to maximize expected reward score <MathFormula math="r(x,y)" /> while penalizing drift from reference model <MathFormula math="\pi_{\text{ref}}" /> via KL divergence:
                </p>
                <div className="py-2 px-3 bg-slate-900 rounded-xl border border-slate-800 text-center font-mono">
                  <MathFormula 
                    math="\max_{\pi} \; \mathbb{E}_{x \sim \mathcal{D}, \, y \sim \pi(\cdot \mid x)} \Big[ r(x, y) \Big] - \beta D_{\text{KL}}\Big(\pi(y \mid x) \,\Vert{}\, \pi_{\text{ref}}(y \mid x)\Big)" 
                    block 
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                *Goal: Maximize reward while staying anchored to baseline language capability.
              </p>
            </div>

            {/* Step 2: Bradley-Terry Model */}
            <div className="bg-slate-950/90 p-5 rounded-2xl border border-amber-500/30 space-y-3 flex flex-col justify-between shadow-lg">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider block">
                  2. Bradley-Terry Preference Model
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Under the Bradley-Terry formulation, the probability of human preference for response <MathFormula math="y_w" /> over <MathFormula math="y_l" /> depends on the scalar difference between their rewards:
                </p>
                <div className="py-2 px-3 bg-slate-900 rounded-xl border border-slate-800 text-center font-mono">
                  <MathFormula 
                    math="P(y_w \succ y_l \mid x) = \frac{e^{r(x, y_w)}}{e^{r(x, y_w)} + e^{r(x, y_l)}} = \sigma\big(r(x, y_w) - r(x, y_l)\big)" 
                    block 
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                *Key: Preference probability is a Sigmoid <MathFormula math="\sigma" /> over reward difference.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 3: Mathematical Manipulation */}
            <div className="bg-slate-950/90 p-5 rounded-2xl border border-cyan-500/30 space-y-3 flex flex-col justify-between shadow-lg">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider block flex items-center gap-1.5">
                  <Cloud className="h-4 w-4 text-cyan-400" /> 3. Mathematical Manipulation (Canceling <MathFormula math="r" />)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  By solving the RLHF objective analytically, the optimal reward function can be expressed in terms of policy probabilities:
                </p>
                <div className="py-2 px-3 bg-slate-900 rounded-xl border border-slate-800 text-center font-mono">
                  <MathFormula 
                    math="r(x, y) = \beta \log \frac{\pi_\theta(y \mid x)}{\pi_{\text{ref}}(y \mid x)} + \beta \log Z(x)" 
                    block 
                  />
                </div>
                <p className="text-[11px] text-cyan-300 leading-relaxed">
                  When substituting this implicit reward into Bradley-Terry, the partition function <MathFormula math="Z(x)" /> cancels out completely!
                </p>
              </div>
              <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                *Breakthrough: No explicit reward model or partition function estimation required!
              </p>
            </div>

            {/* Step 4: Final DPO Loss Function */}
            <div className="bg-slate-950/90 p-5 rounded-2xl border border-emerald-500/40 space-y-3 flex flex-col justify-between shadow-xl">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-emerald-400" /> 4. The Final DPO Loss Objective
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Substituting implicit rewards into the negative log-likelihood preference loss yields the final DPO objective:
                </p>
                <div className="py-2.5 px-3 bg-slate-900 rounded-xl border border-emerald-500/30 text-center font-mono text-emerald-300">
                  <MathFormula 
                    math="\mathcal{L}_{\text{DPO}}(\theta; \pi_{\text{ref}}) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}} \left[ \log \sigma \left( \beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_{\text{ref}}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_{\text{ref}}(y_l \mid x)} \right) \right]" 
                    block 
                  />
                </div>
              </div>
              <p className="text-[11px] text-emerald-300 border-t border-slate-800/80 pt-2">
                *Result: Directly trains LLM parameters <MathFormula math="\theta" /> via binary cross-entropy on token log-ratios.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: THE BRADLEY-TERRY MODEL DEEP DIVE */}
      <div id="section-bradley-terry" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-8 border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-slate-900/80 to-indigo-950/20 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Scale className="h-4 w-4 text-amber-400" /> PREFERENCE MODELING FUNDAMENTALS
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            The Bradley-Terry Model in Detail
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Originating from 1952 probability theory, the Bradley-Terry model converts latent quality/reward scores into pairwise preference probabilities—serving as the foundational preference engine for RLHF and DPO.
          </p>
        </div>

        {/* 3 Core Conceptual Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Pairwise Probability Formula */}
          <div className="bg-slate-950/90 p-5 rounded-2xl border border-amber-500/30 space-y-3 shadow-lg flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider block">
                1. Pairwise Odds Ratio
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Given scalar reward/quality scores <MathFormula math="r_1 = r(x, y_1)" /> and <MathFormula math="r_2 = r(x, y_2)" />, the probability that <MathFormula math="y_1" /> wins over <MathFormula math="y_2" /> is:
              </p>
              <div className="py-2.5 px-3 bg-slate-900 rounded-xl border border-amber-500/30 text-center font-mono text-amber-300">
                <MathFormula 
                  math="P(y_1 \succ y_2 \mid x) = \frac{e^{r_1}}{e^{r_1} + e^{r_2}}" 
                  block 
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              *Normalizes exponential latent reward scores into a valid probability distribution <MathFormula math="P_1 + P_2 = 1" />.
            </p>
          </div>

          {/* Card 2: Sigmoid Formulation */}
          <div className="bg-slate-950/90 p-5 rounded-2xl border border-purple-500/30 space-y-3 shadow-lg flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider block">
                2. Sigmoid over Reward Gap
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dividing top and bottom by <MathFormula math="e^{r_1}" /> converts the ratio into the logistic Sigmoid <MathFormula math="\sigma" /> applied to the reward difference <MathFormula math="\Delta r = r_1 - r_2" />:
              </p>
              <div className="py-2.5 px-3 bg-slate-900 rounded-xl border border-purple-500/30 text-center font-mono text-purple-300">
                <MathFormula 
                  math="P(y_1 \succ y_2 \mid x) = \sigma\big(r_1 - r_2\big) = \frac{1}{1 + e^{-(r_1 - r_2)}}" 
                  block 
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              *The preference probability depends solely on the relative difference between reward scores!
            </p>
          </div>

          {/* Card 3: Shift Invariance & Partition Cancellation */}
          <div className="bg-slate-950/90 p-5 rounded-2xl border border-emerald-500/30 space-y-3 shadow-lg flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider block">
                3. Shift Invariance & DPO Secret
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Adding any prompt-dependent scalar <MathFormula math="c(x)" /> to both rewards leaves the preference probability completely unchanged:
              </p>
              <div className="py-2.5 px-3 bg-slate-900 rounded-xl border border-emerald-500/30 text-center font-mono text-emerald-300">
                <MathFormula 
                  math="\sigma\Big( (r_1 + c) - (r_2 + c) \Big) = \sigma\big(r_1 - r_2\big)" 
                  block 
                />
              </div>
            </div>
            <p className="text-[11px] text-emerald-300 border-t border-slate-800/80 pt-2">
              *DPO magic: This property cancels out the complex partition function <MathFormula math="Z(x)" />!
            </p>
          </div>
        </div>

        {/* Interactive Bradley-Terry Simulator Sandbox */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-amber-500/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-amber-400" /> Simple Interactive Example: LLM Preference Comparison
              </h3>
              <p className="text-xs text-slate-400">
                Prompt <MathFormula math="x" />: <span className="text-slate-200 font-medium italic">&quot;Explain Quantum Computing in 1 simple sentence.&quot;</span>
              </p>
            </div>
            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => { setBtReward1(3.2); setBtReward2(-1.5); }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all"
              >
                Clear Winner (3.2 vs -1.5)
              </button>
              <button
                onClick={() => { setBtReward1(1.8); setBtReward2(1.0); }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
              >
                Close Contest (1.8 vs 1.0)
              </button>
              <button
                onClick={() => { setBtReward1(2.0); setBtReward2(2.0); }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-all"
              >
                50/50 Tie (2.0 vs 2.0)
              </button>
            </div>
          </div>

          {/* Interactive LLM Response Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Response 1 Card */}
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-emerald-400">Response y_1 (Detailed & Accurate)</span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  r(x, y_1) = {btReward1 >= 0 ? `+${btReward1.toFixed(1)}` : btReward1.toFixed(1)}
                </span>
              </div>
              <p className="text-slate-200 italic bg-slate-950/80 p-3 rounded-xl border border-emerald-500/20">
                &quot;Quantum computing uses qubits and superposition to process complex information exponentially faster than classical computers.&quot;
              </p>
            </div>

            {/* Response 2 Card */}
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/40 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-rose-400">Response y_2 (Vague & Oversimplified)</span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                  r(x, y_2) = {btReward2 >= 0 ? `+${btReward2.toFixed(1)}` : btReward2.toFixed(1)}
                </span>
              </div>
              <p className="text-slate-200 italic bg-slate-950/80 p-3 rounded-xl border border-rose-500/20">
                &quot;Computers use 0s and 1s to do math real quick on a screen.&quot;
              </p>
            </div>
          </div>

          {/* Interactive Sliders & Live Probability Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Controls Column */}
            <div className="space-y-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
                Adjust Latent Reward Scores:
              </span>

              {/* Reward 1 Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">Reward Score <MathFormula math="r_1" />:</span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {btReward1 >= 0 ? `+${btReward1.toFixed(2)}` : btReward1.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-5.0"
                  max="5.0"
                  step="0.1"
                  value={btReward1}
                  onChange={(e) => setBtReward1(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Reward 2 Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-rose-400 font-bold flex items-center gap-1">Reward Score <MathFormula math="r_2" />:</span>
                  <span className="font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                    {btReward2 >= 0 ? `+${btReward2.toFixed(2)}` : btReward2.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-5.0"
                  max="5.0"
                  step="0.1"
                  value={btReward2}
                  onChange={(e) => setBtReward2(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Reward Gap Indicator */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Reward Gap <MathFormula math="\Delta r = r_1 - r_2" />:</span>
                <span className={`font-bold text-sm ${btRewardDiff >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {btRewardDiff >= 0 ? `+${btRewardDiff.toFixed(2)}` : btRewardDiff.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Visual Probability Distribution Output */}
            <div className="space-y-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
                  Bradley-Terry Preference Probability:
                </span>

                {/* Preference Bar Y1 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-bold">P(y_1 \succ y_2 \mid x)</span>
                    <span className="text-emerald-400 font-bold">{(btProb1 * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                      style={{ width: `${btProb1 * 100}%` }}
                    />
                  </div>
                </div>

                {/* Preference Bar Y2 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-rose-400 font-bold">P(y_2 \succ y_1 \mid x)</span>
                    <span className="text-rose-400 font-bold">{(btProb2 * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${btProb2 * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/30 text-[11px] text-amber-200 text-center font-mono">
                <MathFormula math={`P(y_1 \\succ y_2) = \\sigma(${btRewardDiff.toFixed(2)}) = \\frac{1}{1 + e^{-(${btRewardDiff.toFixed(2)})}} = ${(btProb1).toFixed(4)}`} block />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: UNDERSTANDING BETA (\beta) HYPERPARAMETER IN DPO */}
      <div id="section-beta-explanation" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-8 border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-slate-900/80 to-purple-950/20 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Sliders className="h-4 w-4 text-cyan-400" /> HYPERPARAMETER REGULARIZATION
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Understanding <MathFormula math="\beta" /> (Beta) in DPO Loss
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            In DPO loss, <MathFormula math="\beta" /> (beta) is the crucial hyperparameter controlling how strongly the model is penalized for drifting away from the original reference model <MathFormula math="\pi_{\text{ref}}" />.
          </p>
        </div>

        {/* Math Comparison: RLHF KL Penalty vs DPO Loss Scaling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Standard RLHF KL Penalty */}
          <div className="bg-slate-950/90 p-5 rounded-2xl border border-purple-500/30 space-y-3 shadow-lg">
            <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider block">
              Same KL Coefficient from Standard RLHF
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              <MathFormula math="\beta" /> is the exact same KL-divergence penalty coefficient from the standard RLHF optimization objective:
            </p>
            <div className="py-2.5 px-3 bg-slate-900 rounded-xl border border-purple-500/30 text-center font-mono text-purple-300">
              <MathFormula 
                math="\max_{\pi} \; \mathbb{E}_{x \sim \mathcal{D}, \, y \sim \pi} \Big[ r(x, y) \Big] - \mathbf{\beta} D_{\text{KL}}\Big(\pi(y \mid x) \,\Vert{}\, \pi_{\text{ref}}(y \mid x)\Big)" 
                block 
              />
            </div>
          </div>

          {/* DPO Loss Log-Ratio Scaling */}
          <div className="bg-slate-950/90 p-5 rounded-2xl border border-cyan-500/30 space-y-3 shadow-lg">
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider block">
              Direct Scaling in DPO Loss
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              In the DPO loss, <MathFormula math="\beta" /> appears directly scaling the log-ratio difference between preferred <MathFormula math="y_w" /> and dispreferred <MathFormula math="y_l" /> outputs:
            </p>
            <div className="py-2.5 px-3 bg-slate-900 rounded-xl border border-cyan-500/30 text-center font-mono text-cyan-300">
              <MathFormula 
                math="\mathcal{L}_{\text{DPO}}(\theta; \pi_{\text{ref}}) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}} \left[ \log \sigma \left( \mathbf{\beta} \log \frac{\pi_\theta(y_w \mid x)}{\pi_{\text{ref}}(y_w \mid x)} - \mathbf{\beta} \log \frac{\pi_\theta(y_l \mid x)}{\pi_{\text{ref}}(y_l \mid x)} \right) \right]" 
                block 
              />
            </div>
          </div>
        </div>

        {/* 3 Core Roles of Beta in Practice */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider">
            What <MathFormula math="\beta" /> Controls in Practice
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Role 1: Inverse Temperature */}
            <div className="bg-slate-950/90 p-5 rounded-2xl border border-indigo-500/30 space-y-2.5 shadow-md">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block">
                1. Inverse Temperature / Logit Scaling
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                <MathFormula math="\beta" /> scales the magnitude of log-probability differences before passing through Sigmoid <MathFormula math="\sigma(z)" />. A larger <MathFormula math="\beta" /> amplifies small probability shifts, pushing Sigmoid closer to 0 or 1, producing larger initial gradients on uncertain pairs.
              </p>
            </div>

            {/* Role 2: Implicit Reward Scaling */}
            <div className="bg-slate-950/90 p-5 rounded-2xl border border-emerald-500/30 space-y-2.5 shadow-md">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                2. Implicit Reward Range Scaling
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Because DPO implicit reward is defined as <MathFormula math="\hat{r}_\theta(x, y) = \beta \log \frac{\pi_\theta(y \mid x)}{\pi_{\text{ref}}(y \mid x)}" />, <MathFormula math="\beta" /> determines the dynamic scale and units of the model&apos;s self-contained implicit reward values.
              </p>
            </div>

            {/* Role 3: Conservative vs Aggressive Trade-off */}
            <div className="bg-slate-950/90 p-5 rounded-2xl border border-amber-500/30 space-y-2.5 shadow-md">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                3. Conservative vs Aggressive Optimization
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Higher <MathFormula math="\beta" /> tightly anchors updates to <MathFormula math="\pi_{\text{ref}}" />, maintaining fluency and general skills. Lower <MathFormula math="\beta" /> allows aggressive policy shifts but risks overfitting, output repetition, and length exploitation.
              </p>
            </div>
          </div>
        </div>

        {/* Practical Settings Table */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider">
            Typical Practical Hyperparameter Settings
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-300 font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3.5 font-bold text-cyan-400">Parameter Value</th>
                  <th className="p-3.5 font-bold text-slate-200">Optimization Mode</th>
                  <th className="p-3.5 font-bold text-slate-200">Typical Behavior & Production Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-emerald-400 bg-emerald-950/10">
                    <MathFormula math="\beta = 0.1" />
                  </td>
                  <td className="p-3.5 font-semibold text-emerald-300">
                    Balanced Default
                  </td>
                  <td className="p-3.5 leading-relaxed">
                    Standard default in libraries like Hugging Face TRL; provides a balanced trade-off for most 7B–70B instruction models.
                  </td>
                </tr>

                <tr className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-amber-400 bg-amber-950/10">
                    <MathFormula math="\beta \in [0.01, 0.05]" />
                  </td>
                  <td className="p-3.5 font-semibold text-amber-300">
                    Aggressive Shift
                  </td>
                  <td className="p-3.5 leading-relaxed">
                    Used when training on very high-quality, synthetic reasoning/math datasets (e.g., UltraFeedback) where stronger distribution shift is desired.
                  </td>
                </tr>

                <tr className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-purple-400 bg-purple-950/10">
                    <MathFormula math="\beta \in [0.2, 0.5]" />
                  </td>
                  <td className="p-3.5 font-semibold text-purple-300">
                    Conservative Anchor
                  </td>
                  <td className="p-3.5 leading-relaxed">
                    Common when reference model is already well-tuned and the goal is subtle safety/style alignment without degrading baseline capabilities.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 4: Interactive Token Log-Prob Shift Sandbox */}
      <div id="section-sandbox" className="glass-panel rounded-2xl p-6 space-y-6">
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

      {/* Video Explainer & YouTube Walkthrough Section */}
      <div id="section-video" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-red-500/30 bg-gradient-to-br from-red-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Video className="h-4 w-4 text-red-500" /> VIDEO EXPLAINER & DEEP DIVE
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              DPO In-Depth Video Walkthrough
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Watch this comprehensive video guide explaining Direct Preference Optimization (DPO) and policy alignment concepts.
            </p>
          </div>
          <a
            href="https://www.youtube.com/watch?v=k2pD3k1485A"
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
            src="https://www.youtube.com/embed/k2pD3k1485A"
            title="DPO Direct Preference Optimization Video Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full rounded-2xl border-0"
          />
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

      {/* Lightbox / Modal for Enlarged Infographic Image View */}
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
                <Maximize2 className="h-5 w-5 text-emerald-400" /> {activeModalImage.title}
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
              <span>Full resolution mathematical derivation flowchart</span>
              <span className="text-emerald-400">Click anywhere outside or X to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
