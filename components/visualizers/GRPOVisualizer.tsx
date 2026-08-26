"use client";

import React, { useState, useMemo } from 'react';
import { MathFormula } from '@/components/ui/MathFormula';
import { 
  Users, 
  Calculator, 
  Award,
  Bookmark,
  BookOpen,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowUp,
  Sliders,
  GraduationCap,
  CheckSquare,
  ListChecks,
  Video,
  ExternalLink,
  FileText
} from 'lucide-react';

export const GRPOVisualizer: React.FC = () => {
  // State: Sampled response rewards for the sandbox
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

  // Group Advantage calculations for the sandbox
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

      {/* QUICK SECTION BOOKMARK NAVIGATION BAR */}
      <div className="sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border border-purple-500/40 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400">
          <Bookmark className="h-4 w-4 text-purple-400" />
          <span>Quick Section Bookmarks:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-mono">
          <button
            onClick={() => document.getElementById('section-formula')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <Calculator className="h-4 w-4 text-purple-400 shrink-0" />
            <span className="font-semibold">1. Objective & Advantage Formula</span>
          </button>

          <button
            onClick={() => document.getElementById('section-step-by-step')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <BookOpen className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">2. Step-by-Step Training Example</span>
          </button>

          <button
            onClick={() => document.getElementById('section-os-vs-ps')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-indigo-500/20 text-slate-200 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <GraduationCap className="h-4 w-4 text-indigo-400 shrink-0" />
            <span className="font-semibold">3. Outcome vs Process Supervision</span>
          </button>

          <button
            onClick={() => document.getElementById('section-sandbox')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <Sliders className="h-4 w-4 text-cyan-400 shrink-0" />
            <span className="font-semibold">4. Interactive Sandbox</span>
          </button>

          <button
            onClick={() => document.getElementById('section-video')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-red-500/20 text-slate-200 hover:text-red-300 border border-slate-800 hover:border-red-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <Video className="h-4 w-4 text-red-400 shrink-0" />
            <span className="font-semibold">5. Video Walkthrough</span>
          </button>

          <button
            onClick={() => document.getElementById('section-paper')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-start gap-2.5 text-left"
          >
            <FileText className="h-4 w-4 text-purple-400 shrink-0" />
            <span className="font-semibold">6. DeepSeek-R1 Paper</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: GRPO Objective Formula */}
      <div id="section-formula" className="glass-panel rounded-2xl p-6 space-y-4 border-purple-500/30">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Calculator className="h-4 w-4 text-purple-400" /> GRPO Clipped Loss & Group Advantage Formulation
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

      {/* SECTION 2: A STEP-BY-STEP EXAMPLE */}
      <div id="section-step-by-step" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-8 border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-slate-900/80 to-purple-950/20 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-emerald-400" /> CONCRETE REASONING CASE STUDY
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            A Step-by-Step Training Example
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Let&apos;s trace a training step for a reasoning model learning to solve equations and show its work.
          </p>
        </div>

        {/* Prompt & Group Setup Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 bg-slate-950 rounded-2xl border border-purple-500/30 md:col-span-2 space-y-1">
            <span className="text-slate-400 text-[11px] font-bold block uppercase tracking-wider">Target Prompt (x):</span>
            <p className="text-sm font-semibold text-purple-300 italic">
              &quot;Solve 2x + 3 = 11. Show your work inside &lt;think&gt; tags.&quot;
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Group Size (G):</span>
            <span className="text-2xl font-bold text-emerald-400">4 Outputs Generated</span>
          </div>
        </div>

        {/* Rule-Based Scoring System Description */}
        <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-2 text-xs">
          <span className="font-mono font-bold text-slate-200 block uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="h-4 w-4 text-amber-400" /> Rule-Based Scoring System
          </span>
          <p className="text-slate-300 leading-relaxed">
            The model generates 4 different attempts, and our rule-based system scores them based on <strong className="text-emerald-300">Accuracy</strong> (+1 for correct, -1 for incorrect) and <strong className="text-purple-300 font-mono">Formatting</strong> (+1 for using <MathFormula math="\text{<think>}" /> tags, 0 for missing tags).
          </p>
        </div>

        {/* 4 Generated Outputs Breakdown Table */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
            Sampled Group Outputs & Raw Reward Breakdown
          </span>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-300 border-b border-slate-800">
                <tr>
                  <th className="p-3.5 font-bold text-purple-400">Candidate Output</th>
                  <th className="p-3.5 font-bold text-slate-200">Generated Text Snippet</th>
                  <th className="p-3.5 font-bold text-emerald-400">Raw Reward (r_i)</th>
                  <th className="p-3.5 font-bold text-slate-300">Scoring Breakdown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {/* o1 */}
                <tr className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3.5 font-bold text-purple-300 bg-purple-950/20">o_1</td>
                  <td className="p-3.5 text-slate-200">
                    <span className="text-purple-400 font-bold">&lt;think&gt;2x=8...&lt;/think&gt;</span> x=4
                  </td>
                  <td className="p-3.5 font-bold text-emerald-400 text-sm bg-emerald-950/20">+2.0</td>
                  <td className="p-3.5 text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Correct answer (+1), correct tags (+1)
                  </td>
                </tr>

                {/* o2 */}
                <tr className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3.5 font-bold text-purple-300 bg-purple-950/20">o_2</td>
                  <td className="p-3.5 text-slate-200">x=4</td>
                  <td className="p-3.5 font-bold text-amber-400 text-sm bg-amber-950/10">+1.0</td>
                  <td className="p-3.5 text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" /> Correct answer (+1), missing tags (0)
                  </td>
                </tr>

                {/* o3 */}
                <tr className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3.5 font-bold text-purple-300 bg-purple-950/20">o_3</td>
                  <td className="p-3.5 text-slate-200">
                    <span className="text-purple-400 font-bold">&lt;think&gt;2x=14...&lt;/think&gt;</span> x=7
                  </td>
                  <td className="p-3.5 font-bold text-slate-400 text-sm bg-slate-900/40">0.0</td>
                  <td className="p-3.5 text-slate-300 flex items-center gap-1.5">
                    <XCircle className="h-4 w-4 text-rose-400 shrink-0" /> Incorrect answer (-1), correct tags (+1)
                  </td>
                </tr>

                {/* o4 */}
                <tr className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3.5 font-bold text-purple-300 bg-purple-950/20">o_4</td>
                  <td className="p-3.5 text-slate-200">x=7</td>
                  <td className="p-3.5 font-bold text-rose-400 text-sm bg-rose-950/20">-1.0</td>
                  <td className="p-3.5 text-slate-300 flex items-center gap-1.5">
                    <XCircle className="h-4 w-4 text-rose-400 shrink-0" /> Incorrect answer (-1), missing tags (0)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Advantage Computation Breakdown */}
        <div className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider">
            Calculating Group Statistics & Relative Advantage (A_i)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px]">Group Mean Reward Baseline:</span>
              <div className="text-sm font-bold text-purple-300">
                <MathFormula math="\text{Mean} = \frac{2.0 + 1.0 + 0.0 + (-1.0)}{4} = 0.5" />
              </div>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px]">Group Standard Deviation:</span>
              <div className="text-sm font-bold text-indigo-300">
                <MathFormula math="\text{Std Dev} = \sqrt{1.25} \approx 1.11" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-purple-500/30 text-center font-mono">
            <MathFormula 
              math="A_i = \frac{r_i - \text{mean}(r)}{\text{std}(r)}" 
              block 
            />
          </div>

          {/* 4 Advantage Results Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-1">
              <span className="text-emerald-400 font-bold block">A_1 = (2.0 - 0.5) / 1.11</span>
              <span className="text-lg font-extrabold text-emerald-300">+1.35</span>
              <span className="text-[10px] text-slate-400 block">Strong positive update</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/10 border border-emerald-500/30 space-y-1">
              <span className="text-emerald-300 font-bold block">A_2 = (1.0 - 0.5) / 1.11</span>
              <span className="text-lg font-extrabold text-emerald-400">+0.45</span>
              <span className="text-[10px] text-slate-400 block">Mild positive update</span>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-950/10 border border-rose-500/30 space-y-1">
              <span className="text-rose-300 font-bold block">A_3 = (0.0 - 0.5) / 1.11</span>
              <span className="text-lg font-extrabold text-rose-400">-0.45</span>
              <span className="text-[10px] text-slate-400 block">Mild negative update</span>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/40 space-y-1">
              <span className="text-rose-400 font-bold block">A_4 = (-1.0 - 0.5) / 1.11</span>
              <span className="text-lg font-extrabold text-rose-300">-1.35</span>
              <span className="text-[10px] text-slate-400 block">Strong negative update</span>
            </div>
          </div>
        </div>

        {/* Key Insight Card */}
        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-2 text-xs">
          <span className="font-mono font-bold text-amber-300 text-sm flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-400" /> The Key Insight
          </span>
          <p className="text-slate-200 leading-relaxed">
            Notice what happened to <strong className="text-amber-300 font-mono">o_2</strong>. It got the correct mathematical answer, but because it lacked the required formatting, it received a much weaker update (<MathFormula math="A_2 = +0.45" />) compared to <strong className="text-emerald-300 font-mono">o_1</strong> (<MathFormula math="A_1 = +1.35" />).
          </p>
          <p className="text-slate-300 leading-relaxed pt-1">
            GRPO naturally learns to optimize for multiple goals (accuracy and formatting) purely through relative comparison within the group, without needing a complex Critic network to estimate state values.
          </p>
        </div>
      </div>

      {/* SECTION 3: OUTCOME SUPERVISION (OS) VS PROCESS SUPERVISION (PS) */}
      <div id="section-os-vs-ps" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-8 border-indigo-500/40 bg-gradient-to-br from-indigo-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-indigo-400" /> REWARD VERIFICATION ARCHITECTURE
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Outcome Supervision (OS) vs. Process Supervision (PS)
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            The easiest way to understand the difference between Outcome Supervision (OS) and Process Supervision (PS) is to think about a high school math teacher grading an exam.
          </p>
        </div>

        {/* Exam Case Study Box */}
        <div className="bg-slate-950/90 p-5 rounded-2xl border border-indigo-500/30 space-y-3 font-mono text-xs">
          <span className="text-indigo-400 font-bold uppercase tracking-wider block">
            Math Exam Question Case Study:
          </span>
          <p className="text-slate-200 text-sm font-semibold italic bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            Prompt <MathFormula math="x" />: &quot;Calculate (10 + 5) * 2.&quot;
          </p>

          <div className="space-y-1.5 pt-1">
            <span className="text-slate-400 text-[11px] block uppercase tracking-wider">Student Scratchpad Output:</span>
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1 text-slate-300">
              <div><span className="text-emerald-400 font-bold">Step 1:</span> 10 + 5 = 15 <span className="text-emerald-400 text-[11px] italic">(Brilliant, correct logic!)</span></div>
              <div><span className="text-rose-400 font-bold">Step 2:</span> 15 * 2 = 35 <span className="text-rose-400 text-[11px] italic">(A silly multiplication mistake!)</span></div>
              <div className="pt-1 border-t border-slate-800/80 font-bold text-slate-100">Final Answer: 35 <span className="text-rose-400 text-[11px] font-normal italic">(Expected: 30)</span></div>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* GRPO OS: The Strict Teacher */}
          <div className="bg-slate-950/90 p-6 rounded-2xl border border-rose-500/30 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-sm font-mono font-bold text-rose-400 flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-rose-400" /> GRPO OS: The Strict Teacher
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Outcome Supervision
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Outcome Supervision acts like an automated machine scanning a multiple-choice test. It completely ignores the scratchpad and only checks the final answer box.
              </p>

              <div className="p-3 bg-slate-900 rounded-xl border border-rose-500/30 text-xs font-mono space-y-1">
                <span className="text-slate-400 block text-[11px]">The Grade:</span>
                <p className="text-rose-300 font-bold">Final answer is 35 (Correct is 30) <MathFormula math="\implies r_i = 0" /></p>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                <span className="text-slate-400 block font-mono text-[11px]">What the AI Model Learns:</span>
                <p className="text-slate-200 italic">&quot;I failed. Everything I just did was completely wrong.&quot;</p>
              </div>
            </div>

            <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-500/30 text-[11px] text-rose-300 space-y-1">
              <strong className="block font-mono uppercase tracking-wider">The Problem:</strong>
              <p className="leading-relaxed text-slate-300">
                The AI is punished for the entire attempt, even though Step 1 was perfectly correct. Next time, it might change its strategy for Step 1, ruining its good logic.
              </p>
            </div>
          </div>

          {/* GRPO PS: The Helpful Teacher */}
          <div className="bg-slate-950/90 p-6 rounded-2xl border border-purple-500/30 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-sm font-mono font-bold text-purple-400 flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-purple-400" /> GRPO PS: The Helpful Teacher
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Process Supervision
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Process Supervision acts like a human teacher reading your scratchpad line-by-line and giving partial credit for every intermediate step.
              </p>

              <div className="p-3 bg-slate-900 rounded-xl border border-purple-500/30 text-xs font-mono space-y-1">
                <span className="text-slate-400 block text-[11px]">The Step-by-Step Grade:</span>
                <div className="text-emerald-400 font-bold">Step 1 (10 + 5 = 15) <MathFormula math="\implies r_{\text{step1}} = +1" /> (Great job!)</div>
                <div className="text-rose-400 font-bold">Step 2 (15 * 2 = 35) <MathFormula math="\implies r_{\text{step2}} = -1" /> (Check math here)</div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                <span className="text-slate-400 block font-mono text-[11px]">What the AI Model Learns:</span>
                <p className="text-slate-200 italic">&quot;My strategy for adding first was perfect! I just need to be more careful when multiplying.&quot;</p>
              </div>
            </div>

            <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-500/30 text-[11px] text-purple-300 space-y-1">
              <strong className="block font-mono uppercase tracking-wider">The Advantage:</strong>
              <p className="leading-relaxed text-slate-300">
                The AI gets highly specific feedback. It learns to preserve good reasoning habits and only fix erroneous steps.
              </p>
            </div>
          </div>
        </div>

        {/* Real-World Industry Insight Card: Why DeepSeek Uses OS */}
        <div className="p-6 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
            <span className="font-mono font-bold text-amber-300 text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" /> DeepSeek-R1 Empirical Insight: Outcome Supervision vs. Process Supervision
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Industry Takeaway
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1 text-slate-200 leading-relaxed">
              <strong className="text-amber-300 font-mono block">1. No Significant Performance Advantage:</strong>
              <p className="text-slate-300">
                Empirical benchmarks in DeepSeek-Math and DeepSeek-R1 revealed that Process Supervision (PS) does <strong className="text-white">NOT</strong> offer a significant final reasoning performance advantage over Outcome Supervision (OS) when the candidate group size <MathFormula math="G" /> is sufficiently large.
              </p>
            </div>

            <div className="space-y-1 text-slate-200 leading-relaxed">
              <strong className="text-rose-300 font-mono block">2. Process Supervision (PS) is Extremely Expensive:</strong>
              <p className="text-slate-300">
                Training and deploying step-level Process Reward Models (PRMs) requires massive human step annotations or dense token reward evaluations, creating severe compute bottlenecks and high memory overhead during RL training.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/30 text-amber-200 text-center font-mono text-xs">
            Conclusion: GRPO with Rule-Based Outcome Supervision (OS) delivers state-of-the-art reasoning at a fraction of the cost!
          </div>
        </div>
      </div>

      {/* SECTION 4: Interactive Group Advantage Simulator */}
      <div id="section-sandbox" className="glass-panel rounded-2xl p-6 space-y-6">
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

      {/* Video Explainer & YouTube Walkthrough Section */}
      <div id="section-video" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-red-500/30 bg-gradient-to-br from-red-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Video className="h-4 w-4 text-red-500" /> VIDEO EXPLAINER & DEEP DIVE
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              GRPO In-Depth Video Walkthrough
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Watch this comprehensive video guide explaining Group Relative Policy Optimization (GRPO) and DeepSeek reasoning architecture.
            </p>
          </div>
          <a
            href="https://www.youtube.com/watch?v=xT4jxQUl0X8"
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
            src="https://www.youtube.com/embed/xT4jxQUl0X8"
            title="GRPO Group Relative Policy Optimization Video Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full rounded-2xl border-0"
          />
        </div>
      </div>

      {/* Original Research Paper Reference Section */}
      <div id="section-paper" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border-purple-500/30 bg-gradient-to-br from-purple-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-purple-400" /> ORIGINAL RESEARCH PAPER (DeepSeek-AI 2025)
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning
            </h2>
            <p className="text-xs text-slate-300">
              DeepSeek-AI Research Team
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
            <a
              href="https://arxiv.org/abs/2501.12948"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <ExternalLink className="h-4 w-4 text-purple-400" />
              <span>ArXiv Abstract</span>
            </a>

            <a
              href="https://arxiv.org/pdf/2501.12948"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 transition-all flex items-center gap-2"
            >
              <FileText className="h-4 w-4 text-purple-400" />
              <span>Open PDF (arXiv:2501.12948)</span>
            </a>
          </div>
        </div>

        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
          &quot;We introduce DeepSeek-R1-Zero and DeepSeek-R1, which explore training LLMs for complex reasoning capabilities purely via large-scale reinforcement learning (RL) without prior supervised fine-tuning (SFT). Driven by Group Relative Policy Optimization (GRPO), DeepSeek-R1 naturally develops chain-of-thought self-reflection and achieves state-of-the-art performance on competitive benchmarks.&quot;
        </div>
      </div>

      {/* Footer Back to Top Button Bar */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-purple-500/20 text-slate-300 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg"
        >
          <ArrowUp className="h-4 w-4 text-purple-400" />
          <span>Back to Top</span>
        </button>
      </div>
    </div>
  );
};
