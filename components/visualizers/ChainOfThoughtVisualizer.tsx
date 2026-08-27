"use client";

import React, { useState } from 'react';
import { 
  Brain, 
  Sparkles, 
  Bookmark, 
  ArrowUp,
  Workflow,
  Play,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BarChart2,
  Layers,
  Zap,
  FileText,
  ExternalLink,
  Video
} from 'lucide-react';

export const ChainOfThoughtVisualizer: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [selectedArch, setSelectedArch] = useState<'palm' | 'gpt' | 'lamda'>('palm');

  const reasoningSteps = [
    { title: "Question Input", text: "A store has 12 apples. John buys 4. Then the store gets 8 more. How many apples are there?", type: "input" },
    { title: "Step 1: Subtract Purchased", text: "<think>Initial count = 12. John buys 4 -> 12 - 4 = 8 apples remaining.</think>", type: "think" },
    { title: "Step 2: Add Shipment", text: "<think>Store gets 8 more -> 8 + 8 = 16 apples total.</think>", type: "think" },
    { title: "Final Answer Generation", text: "The store now has 16 apples.", type: "output" }
  ];

  // Data from Wei et al. (NeurIPS 2022) Figure 4 for GSM8K, SVAMP, MAWPS
  const scalingData = {
    palm: {
      name: "PaLM (Pathways Language Model)",
      scales: [
        { size: "8B", standard: 5, cot: 6, note: "Below Emergent Threshold" },
        { size: "62B", standard: 10, cot: 30, note: "Gains Begin" },
        { size: "540B", standard: 18, cot: 58, note: "Emergent Breakthrough! (Surpasses SOTA)" },
      ],
      sota: 55, // Prior SOTA baseline (Cobbe et al. 2021)
    },
    gpt: {
      name: "GPT-3 Model Family",
      scales: [
        { size: "0.4B", standard: 2, cot: 1, note: "CoT ineffective" },
        { size: "7B", standard: 3, cot: 3, note: "No gain" },
        { size: "175B", standard: 16, cot: 47, note: "Massive Emergent Surge!" },
      ],
      sota: 55,
    },
    lamda: {
      name: "LaMDA Model Family",
      scales: [
        { size: "0.4B", standard: 1, cot: 1, note: "No gain" },
        { size: "8B", standard: 3, cot: 3, note: "No gain" },
        { size: "137B", standard: 7, cot: 15, note: "CoT Improvement" },
      ],
      sota: 55,
    },
  };

  const activeArch = scalingData[selectedArch];

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold uppercase tracking-wider mb-1">
          <Brain className="h-4 w-4" /> Reasoning & Explicit Inference Decomposition
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Chain-of-Thought (CoT) Prompting & Reasoning
        </h1>
        <p className="text-slate-400 mt-2 text-base leading-relaxed">
          Chain-of-Thought (CoT) prompting encourages Large Language Models to decompose complex reasoning tasks into intermediate steps. By spending compute tokens on reasoning prior to generating the final answer, LLMs unlock dramatic gains on math, logic, and multi-hop questions.
        </p>
      </div>

      {/* QUICK SECTION BOOKMARK NAVIGATION BAR */}
      <div className="sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border border-purple-500/40 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400">
          <Bookmark className="h-4 w-4 text-purple-400" />
          <span>Quick Section Bookmarks:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
          <button
            onClick={() => document.getElementById('section-concept')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span className="font-semibold truncate">1. Standard vs CoT</span>
          </button>

          <button
            onClick={() => document.getElementById('section-scaling')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <TrendingUp className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="font-semibold truncate">2. Model Scale</span>
          </button>

          <button
            onClick={() => document.getElementById('section-trace')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-indigo-500/20 text-slate-200 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Workflow className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <span className="font-semibold truncate">3. Reasoning Trace</span>
          </button>

          <button
            onClick={() => document.getElementById('section-video')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-rose-500/20 text-slate-200 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Video className="h-3.5 w-3.5 text-rose-400 shrink-0" />
            <span className="font-semibold truncate">4. Author Lecture</span>
          </button>

          <button
            onClick={() => document.getElementById('section-paper')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-start gap-2 text-left col-span-2 sm:col-span-1"
          >
            <FileText className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold truncate">5. CoT Paper</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Standard vs CoT Concept */}
      <div id="section-concept" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-purple-500/40 bg-gradient-to-br from-purple-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-purple-400" /> REASONING DECOMPOSITION
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Standard vs. Chain-of-Thought (CoT) Prompting
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Compare model input and model output between direct single-step generation and intermediate chain-of-thought token generation.
          </p>
        </div>

        {/* Side-by-Side Model Input & Model Output Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Left Card: Standard Prompting */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-rose-500/30 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-bold text-rose-400 text-sm flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-rose-400" /> Standard Prompting
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Direct Output (No Reasoning)
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-mono text-[11px] font-bold block uppercase tracking-wider">Model Input (Prompt):</span>
                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-slate-200 font-mono space-y-1 text-[11px] leading-relaxed">
                  <p><span className="text-amber-400 font-bold">Q:</span> Roger has 5 tennis balls. He buys 2 more cans of tennis balls. Each can has 3 tennis balls. How many tennis balls does he have now?</p>
                  <p><span className="text-slate-400 font-bold">A:</span> The answer is 11.</p>
                  <p className="pt-1 text-cyan-300 font-semibold"><span className="text-amber-400 font-bold">Q:</span> The cafeteria had 23 apples. If they used 20 to make lunch and bought 6 more, how many apples do they have?</p>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-rose-400 font-mono text-[11px] font-bold block uppercase tracking-wider">Model Output (Direct Incorrect Answer):</span>
                <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-500/40 text-rose-300 font-mono font-bold text-sm">
                  A: The answer is 27. <span className="text-[10px] text-rose-400 font-normal block pt-0.5">(Incorrect! Correct answer is 9)</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-500/30 text-[11px] text-rose-300 space-y-1">
              <strong className="block font-mono uppercase tracking-wider">The Failure Mode:</strong>
              <p className="leading-relaxed text-slate-300">
                Direct generation forces the model to jump straight from question to answer. Without intermediate scratchpad tokens, the LLM hallucinates an incorrect sum (27 instead of 9).
              </p>
            </div>
          </div>

          {/* Right Card: Chain-of-Thought Prompting (HIGHLIGHTED) */}
          <div className="bg-slate-950 p-6 rounded-2xl border-2 border-purple-500/60 shadow-2xl shadow-purple-500/20 space-y-4 flex flex-col justify-between relative overflow-hidden">
            {/* Highlighted Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-emerald-500 text-white font-mono text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest shadow-md">
              ★ Highlighted: CoT Reasoning
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-bold text-purple-300 text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Chain-of-Thought (CoT)
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Step-by-Step Exemplar
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-mono text-[11px] font-bold block uppercase tracking-wider">Model Input (Prompt):</span>
                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-slate-200 font-mono space-y-1 text-[11px] leading-relaxed">
                  <p><span className="text-amber-400 font-bold">Q:</span> Roger has 5 tennis balls. He buys 2 more cans of tennis balls. Each can has 3 tennis balls. How many tennis balls does he have now?</p>
                  <p className="text-purple-300 bg-purple-950/40 p-1.5 rounded border border-purple-500/30">
                    <span className="text-purple-400 font-bold">A:</span> Roger started with 5 balls. 2 cans of 3 tennis balls each is 6 tennis balls. 5 + 6 = 11. The answer is 11.
                  </p>
                  <p className="pt-1 text-cyan-300 font-semibold"><span className="text-amber-400 font-bold">Q:</span> The cafeteria had 23 apples. If they used 20 to make lunch and bought 6 more, how many apples do they have?</p>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-emerald-400 font-mono text-[11px] font-bold block uppercase tracking-wider">Model Output (Highlighted Intermediate Chain):</span>
                <div className="p-3.5 bg-purple-950/40 rounded-xl border-2 border-emerald-500/50 text-purple-200 font-mono space-y-2 shadow-lg shadow-purple-500/10">
                  <div className="text-purple-200 leading-relaxed bg-purple-900/40 p-2.5 rounded-lg border border-purple-500/40">
                    <span className="text-emerald-400 font-bold block mb-1">A: (Step-by-Step CoT Reasoning):</span>
                    The cafeteria had 23 apples originally. They used 20 to make lunch. So they had 23 - 20 = 3. They bought 6 more apples, so they have 3 + 6 = 9. <span className="text-emerald-300 font-bold block mt-1 pt-1 border-t border-purple-500/30">The answer is 9.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-500/40 text-[11px] text-purple-200 space-y-1">
              <strong className="block font-mono uppercase tracking-wider text-emerald-300">Why CoT Succeeds:</strong>
              <p className="leading-relaxed text-slate-200">
                Providing a step-by-step exemplar in the prompt causes the model to generate intermediate reasoning tokens (&quot;23 - 20 = 3&quot;, &quot;3 + 6 = 9&quot;), leading to the correct answer (9).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Emergent Ability & Model Scaling (Wei et al. NeurIPS 2022) */}
      <div id="section-scaling" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-8 border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-cyan-400" /> EMPIRICAL SCALING LAWS (WEI ET AL. NEURIPS 2022)
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              CoT as an Emergent Ability of Increasing Model Scale
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Chain-of-Thought prompting yields no performance gain on small models (&lt;10B parameters), but triggers massive performance jumps at ~100B+ parameters.
            </p>
          </div>

          {/* Model Family Tabs */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setSelectedArch('palm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedArch === 'palm' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              PaLM (540B)
            </button>
            <button
              onClick={() => setSelectedArch('gpt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedArch === 'gpt' ? 'bg-purple-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              GPT-3 (175B)
            </button>
            <button
              onClick={() => setSelectedArch('lamda')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedArch === 'lamda' ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              LaMDA (137B)
            </button>
          </div>
        </div>

        {/* Side-by-Side: Original Paper Screenshot vs Interactive Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Original Paper Figure 4 Image Card (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <BarChart2 className="h-4 w-4 text-cyan-400" /> Paper Figure 4 (Wei et al.)
              </span>
              <span className="text-[10px] font-mono bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                NeurIPS 2022
              </span>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-white/95 p-3 border border-slate-700 shadow-inner flex justify-center">
              <img 
                src="/images/cot_scaling.png" 
                alt="Figure 4: Chain-of-thought prompting enables large language models to solve challenging math problems (Wei et al. 2022)"
                className="max-h-[420px] w-auto object-contain rounded"
              />
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed font-sans bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
              <strong className="text-slate-200">Figure Caption:</strong> Chain-of-thought reasoning is an emergent ability of increasing model scale. Prior SOTA numbers are from Cobbe et al. (2021) for GSM8K, Jie et al. (2022) for SVAMP, and Lan et al. (2021) for MAWPS.
            </p>
          </div>

          {/* Right Column: Interactive Scaling Bars Simulator (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-slate-200 flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-cyan-400" /> Live Interactive Breakdown: {activeArch.name}
              </h3>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                Orange Marker = Prior SOTA (55%)
              </span>
            </div>

            {/* Model Size Bar Comparison */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
              {activeArch.scales.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                        {item.size} Parameters
                      </span>
                      <span className="text-[11px] text-slate-400 font-sans">{item.note}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px]">
                      <span className="text-slate-400">Standard: <strong className="text-slate-200">{item.standard}%</strong></span>
                      <span className="text-cyan-400 font-bold">CoT: <strong className="text-cyan-300 text-sm">{item.cot}%</strong></span>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-1.5">
                    {/* Standard Bar */}
                    <div className="flex items-center gap-3 text-[10px] font-mono">
                      <span className="w-16 text-slate-400 shrink-0">Standard:</span>
                      <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="h-full bg-slate-600 rounded-full transition-all duration-500"
                          style={{ width: `${item.standard}%` }}
                        />
                      </div>
                    </div>

                    {/* CoT Bar */}
                    <div className="flex items-center gap-3 text-[10px] font-mono">
                      <span className="w-16 text-cyan-400 font-bold shrink-0">CoT (Blue):</span>
                      <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5 relative">
                        {/* Prior SOTA marker line at 55% */}
                        <div 
                          className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
                          style={{ left: `${activeArch.sota}%` }}
                        />
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${item.cot}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Key Takeaways Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-rose-400 font-bold block uppercase flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-rose-400" /> Small Models (&lt;10B)
            </span>
            <p className="text-slate-300 font-sans leading-relaxed">
              CoT yields <strong>no improvement</strong> for models like GPT-3 7B or LaMDA 8B. Small models produce fluent but logically incorrect reasoning chains.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2">
            <span className="text-cyan-400 font-bold block uppercase flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-cyan-400" /> Scale Threshold (~100B+)
            </span>
            <p className="text-slate-300 font-sans leading-relaxed">
              CoT reasoning is an <strong>emergent property</strong> that activates when model parameters reach ~100B+, unlocking multi-step arithmetic ability.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
            <span className="text-emerald-400 font-bold block uppercase flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> PaLM 540B Breakthrough
            </span>
            <p className="text-slate-300 font-sans leading-relaxed">
              PaLM 540B CoT solve rate on GSM8K jumps from <strong>18% to 58%</strong>, outperforming task-specific fine-tuned SOTA models (55%).
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: Reasoning Trace */}
      <div id="section-trace" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-indigo-500/40 bg-gradient-to-br from-indigo-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Workflow className="h-5 w-5 text-indigo-400" /> Interactive Reasoning Trace Timeline
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Watch how intermediate reasoning tokens build context step-by-step.
            </p>
          </div>

          <button
            onClick={() => setStep((prev) => (prev + 1) % (reasoningSteps.length + 1))}
            className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-mono text-xs font-bold transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>Next Step ({step}/{reasoningSteps.length})</span>
          </button>
        </div>

        <div className="space-y-3">
          {reasoningSteps.slice(0, step > 0 ? step : reasoningSteps.length).map((s, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border font-mono text-xs space-y-1 transition-all ${
                s.type === 'think'
                  ? 'bg-purple-950/20 border-purple-500/40 text-purple-200'
                  : s.type === 'input'
                  ? 'bg-slate-950 border-slate-800 text-slate-300'
                  : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200 font-bold'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold uppercase tracking-wider">{s.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">Step {idx + 1}</span>
              </div>
              <p className="text-sm pt-1">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Author Video Lecture */}
      <div id="section-video" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-rose-500/40 bg-gradient-to-br from-rose-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Video className="h-4 w-4 text-rose-400" /> AUTHOR TALK & LECTURE
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Jason Wei — Chain-of-Thought Prompting in Large Language Models
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Full author talk playing from the beginning (0:00) discussing Chain-of-Thought prompting &amp; emergent scaling laws in LLMs.
            </p>
          </div>

          <a
            href="https://www.youtube.com/watch?v=ebnX5Ur1hBk"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 transition-all flex items-center gap-2 shrink-0"
          >
            <ExternalLink className="h-4 w-4 text-rose-400" />
            <span>Watch on YouTube</span>
          </a>
        </div>

        {/* In-Page Embedded Video Player Container */}
        <div className="relative overflow-hidden rounded-2xl border border-rose-500/40 bg-slate-950 aspect-video shadow-2xl">
          <iframe
            className="w-full h-full"
            src="https://www.youtube-nocookie.com/embed/ebnX5Ur1hBk?autoplay=0&rel=0&modestbranding=1"
            title="Jason Wei - Chain-of-Thought Prompting Author Lecture"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>

        {/* Fallback Direct Link Bar */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-400">
          <span>Having trouble playing in-browser? Watch directly on YouTube:</span>
          <a
            href="https://www.youtube.com/watch?v=ebnX5Ur1hBk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-400 hover:text-rose-300 font-bold underline flex items-center gap-1 shrink-0"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Open https://www.youtube.com/watch?v=ebnX5Ur1hBk
          </a>
        </div>
      </div>

      {/* SECTION 5: Original Research Paper Reference */}
      <div id="section-paper" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-emerald-400" /> ORIGINAL RESEARCH PAPER (NeurIPS 2022)
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Chain-of-Thought Prompting Elicits Reasoning in Large Language Models
            </h2>
            <p className="text-xs text-slate-300">
              Jason Wei, Xuezhi Wang, Dale Schuurmans, Maarten Bosma, Brian Ichter, Fei Xia, Ed Chi, Quoc Le, Denny Zhou — Google Research, Brain Team
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
            <a
              href="https://arxiv.org/abs/2201.11903"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <ExternalLink className="h-4 w-4 text-emerald-400" />
              <span>ArXiv Abstract</span>
            </a>

            <a
              href="https://arxiv.org/pdf/2201.11903"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 transition-all flex items-center gap-2"
            >
              <FileText className="h-4 w-4 text-emerald-400" />
              <span>Open PDF (arXiv:2201.11903)</span>
            </a>
          </div>
        </div>

        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
          &quot;We explore how generating a series of intermediate reasoning steps—a chain of thought—significantly improves the ability of large language models to perform complex reasoning. We show that chain-of-thought reasoning is an emergent ability of model scale, enabling large models (such as PaLM 540B) to outperform task-specific fine-tuned models on challenging math, commonsense, and symbolic reasoning benchmarks.&quot;
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
