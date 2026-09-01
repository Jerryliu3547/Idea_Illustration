"use client";

import React, { useState } from 'react';
import { getAssetPath } from '@/lib/asset';
import { MathFormula } from '@/components/ui/MathFormula';
import { 
  Workflow, 
  Sparkles, 
  Bookmark, 
  ArrowUp,
  Play,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BarChart2,
  Zap,
  FileText,
  ExternalLink,
  Search,
  Bot,
  RotateCcw,
  Layers,
  HelpCircle,
  Globe
} from 'lucide-react';

export const ReActVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'react' | 'cot' | 'act' | 'standard'>('react');
  const [step, setStep] = useState<number>(0);
  const [selectedExample, setSelectedExample] = useState<'hotpot' | 'fever'>('hotpot');

  // Interactive ReAct Trace Data based on Yao et al. (2022) Figure 1
  const hotpotTrace = [
    {
      step: 1,
      thought: "I need to search Apple Remote and find the program it was originally designed to interact with.",
      act: "Search[Apple Remote]",
      obs: "The Apple Remote is a remote control introduced in October 2005 by Apple ... originally designed to control the Front Row media center program ...",
      highlight: "Front Row"
    },
    {
      step: 2,
      thought: "Apple Remote was originally designed to control the Front Row media center program. I need to search Front Row next and find what other device can control it.",
      act: "Search[Front Row]",
      obs: "Could not find [Front Row]. Similar: ['Front Row Seat to Earth', 'Front Row Motorsports', 'Front Row (software)', ...]",
      highlight: "Front Row (software)"
    },
    {
      step: 3,
      thought: "Front Row is not found. I need to search Front Row (software).",
      act: "Search[Front Row (software)]",
      obs: "Front Row is a discontinued media center software application for Apple's Macintosh computers...",
      highlight: "keyboard function keys"
    },
    {
      step: 4,
      thought: "Front Row (software) is controlled by an Apple Remote or the keyboard function keys. So the answer is keyboard function keys.",
      act: "Finish[keyboard function keys]",
      obs: "Task Completed! Final Output Verified.",
      isFinal: true
    }
  ];

  const feverTrace = [
    {
      step: 1,
      thought: "The claim is 'Colorado has 53 mountain peaks over 14,000 feet'. I need to search Colorado Fourteeners.",
      act: "Search[Fourteeners in Colorado]",
      obs: "A fourteener is a mountain peak with an elevation of at least 14,000 feet (4267 m). Colorado has 53 official fourteeners...",
      highlight: "53 official fourteeners"
    },
    {
      step: 2,
      thought: "The observation explicitly states Colorado has 53 official fourteeners. This directly supports the claim.",
      act: "Finish[SUPPORTS]",
      obs: "Fact Verification Complete! Claim Verified True.",
      isFinal: true
    }
  ];

  const activeTrace = selectedExample === 'hotpot' ? hotpotTrace : feverTrace;
  const currentStepData = activeTrace[Math.min(step, activeTrace.length - 1)];

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold uppercase tracking-wider mb-1">
          <Bot className="h-4 w-4" /> Interleaved Reasoning & Real-World Acting (ICLR 2023)
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          ReAct: Synergizing Reasoning and Acting in LLMs
        </h1>
        <p className="text-slate-400 mt-2 text-base leading-relaxed">
          ReAct introduces an agentic framework that interleaves internal reasoning traces (<code className="text-purple-300 font-mono">Thought:</code>) with external environment actions (<code className="text-amber-300 font-mono">Act: Search[...]</code>). By grounding reasoning in external observations (<code className="text-emerald-300 font-mono font-bold">Obs:</code>), ReAct eliminates hallucinations and overcomes the memory limits of frozen parametric LLMs.
        </p>
      </div>

      {/* QUICK SECTION BOOKMARK NAVIGATION BAR */}
      <div className="sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border border-amber-500/40 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
          <Bookmark className="h-4 w-4 text-amber-400" />
          <span>Quick Section Bookmarks:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
          <button
            onClick={() => document.getElementById('section-paper-fig')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold truncate">1. Paper Diagram</span>
          </button>

          <button
            onClick={() => document.getElementById('section-comparison')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Workflow className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="font-semibold truncate">2. Comparison</span>
          </button>

          <button
            onClick={() => document.getElementById('section-simulator')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Bot className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span className="font-semibold truncate">3. Agent Loop</span>
          </button>

          <button
            onClick={() => document.getElementById('section-math')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Globe className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold truncate">4. Formulation</span>
          </button>

          <button
            onClick={() => document.getElementById('section-results')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <TrendingUp className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold truncate">5. Empirical Results</span>
          </button>

          <button
            onClick={() => document.getElementById('section-paper')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-rose-500/20 text-slate-200 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <FileText className="h-3.5 w-3.5 text-rose-400 shrink-0" />
            <span className="font-semibold truncate">6. Paper Reference</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Paper Figure (Yao et al. 2022 Figure 1) */}
      <div id="section-paper-fig" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-400" /> ORIGINAL PAPER FRAMEWORK DIAGRAM
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            ReAct (Reason + Act) vs. Standard, CoT, & Act-Only Prompting
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            As shown in Figure 1 from Yao et al. (ICLR 2023), ReAct interleaves reasoning thoughts and environment actions to reach the correct ground-truth answer.
          </p>
        </div>

        {/* Highlighted Image Display */}
        <div className="bg-slate-950 p-4 sm:p-6 rounded-2xl border-2 border-amber-500/50 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-2">
              <FileText className="h-4 w-4 text-amber-400" /> Figure 1: HotpotQA Multi-Hop Question Prompting Comparison
            </span>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Yao et al. (2022) / ICLR 2023
            </span>
          </div>

          <div className="rounded-xl overflow-hidden bg-white p-3 border border-slate-700 shadow-inner flex justify-center">
            <img 
              src={getAssetPath('/images/react_framework.png')} 
              alt="ReAct paper diagram showing comparison of (1a) Standard, (1b) CoT, (1c) Act-Only, and (1d) ReAct on Hotpot QA"
              className="max-h-[500px] w-auto object-contain rounded"
            />
          </div>

          <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5 leading-relaxed font-sans">
            <div className="font-mono font-bold text-amber-400 text-xs uppercase tracking-wider">Key Takeaways from Figure 1:</div>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li><strong className="text-rose-400">1a. Standard:</strong> Directly outputs <code className="text-rose-300 bg-slate-950 px-1 py-0.5 rounded">iPod</code> (Incorrect answer).</li>
              <li><strong className="text-rose-400">1b. CoT (Reason Only):</strong> Hallucinates that Apple Remote was for <code className="text-rose-300 bg-slate-950 px-1 py-0.5 rounded">Apple TV</code>, leading to incorrect answer <code className="text-rose-300 bg-slate-950 px-1 py-0.5 rounded">iPhone, iPad, iPod Touch</code>.</li>
              <li><strong className="text-rose-400">1c. Act-Only:</strong> Lacks explicit reasoning thoughts to handle search error (<code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">Could not find [Front Row]</code>) and fails with <code className="text-rose-300 bg-slate-950 px-1 py-0.5 rounded">Finish[yes]</code>.</li>
              <li><strong className="text-emerald-400">1d. ReAct (Reason + Act):</strong> Uses <code className="text-purple-300 bg-slate-950 px-1 py-0.5 rounded">Thought 3</code> to correct the query to <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">Front Row (software)</code>, arriving at the correct answer <code className="text-emerald-300 font-bold bg-slate-950 px-1 py-0.5 rounded">keyboard function keys</code> ✔️.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION 2: Interactive 4-Way Comparison */}
      <div id="section-comparison" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Workflow className="h-4 w-4 text-cyan-400" /> SIDE-BY-SIDE METHOD COMPARISON
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Why ReAct Outperforms Reasoning-Only & Acting-Only
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Select a strategy to inspect how the model processes the HotpotQA question step by step.
            </p>
          </div>

          {/* Strategy Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('react')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'react' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              (1d) ReAct ✔️
            </button>
            <button
              onClick={() => setActiveTab('cot')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'cot' ? 'bg-purple-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              (1b) CoT ❌
            </button>
            <button
              onClick={() => setActiveTab('act')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'act' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              (1c) Act-Only ❌
            </button>
            <button
              onClick={() => setActiveTab('standard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'standard' ? 'bg-rose-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              (1a) Standard ❌
            </button>
          </div>
        </div>

        {/* Selected Strategy Card */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
          {activeTab === 'react' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-bold text-amber-300 text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> (1d) ReAct (Reasoning + Acting)
                </span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Grounded & Hallucination-Free
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-500/30 text-purple-200">
                  <strong className="text-purple-400 block mb-1">Thought 1:</strong>
                  I need to search Apple Remote and find the program it was originally designed to interact with.
                </div>
                <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-500/30 text-amber-200">
                  <strong className="text-amber-400 block mb-1">Act 1:</strong>
                  Search[Apple Remote]
                </div>
                <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/30 text-emerald-200">
                  <strong className="text-emerald-400 block mb-1">Obs 1:</strong>
                  The Apple Remote is a remote control introduced in October 2005 by Apple ... originally designed to control the <span className="bg-emerald-500/30 px-1 py-0.5 rounded font-bold text-white">Front Row</span> media center program ...
                </div>
                <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-500/30 text-purple-200">
                  <strong className="text-purple-400 block mb-1">Thought 2:</strong>
                  Apple Remote was originally designed to control Front Row. I need to search Front Row next and find what other device can control it.
                </div>
                <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-500/30 text-amber-200">
                  <strong className="text-amber-400 block mb-1">Act 2:</strong>
                  Search[Front Row]
                </div>
                <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/30 text-emerald-200">
                  <strong className="text-emerald-400 block mb-1">Obs 2:</strong>
                  Could not find [Front Row]. Similar: [&apos;Front Row Seat to Earth&apos;, &apos;Front Row Motorsports&apos;, &apos;<span className="bg-emerald-500/30 px-1 py-0.5 rounded font-bold text-white">Front Row (software)</span>&apos;, ...]
                </div>
                <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-500/30 text-purple-200">
                  <strong className="text-purple-400 block mb-1">Thought 3 (Reasoning Error Correction!):</strong>
                  Front Row is not found. I need to search <span className="bg-purple-500/30 px-1 py-0.5 rounded font-bold text-white font-mono">Front Row (software)</span>.
                </div>
                <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-500/30 text-amber-200">
                  <strong className="text-amber-400 block mb-1">Act 3:</strong>
                  Search[Front Row (software)]
                </div>
                <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/30 text-emerald-200">
                  <strong className="text-emerald-400 block mb-1">Obs 3:</strong>
                  Front Row (software) is controlled by an Apple Remote or the <span className="bg-emerald-500/30 px-1 py-0.5 rounded font-bold text-white">keyboard function keys</span>.
                </div>
                <div className="p-3.5 bg-emerald-950/60 rounded-xl border-2 border-emerald-500/60 text-emerald-200 text-sm font-bold flex items-center justify-between">
                  <span>Act 4: Finish[keyboard function keys]</span>
                  <span className="text-xs bg-emerald-500 text-slate-950 px-2.5 py-1 rounded uppercase tracking-wider font-extrabold">Correct Grounded Answer ✔️</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cot' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-bold text-purple-300 text-sm flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-rose-400" /> (1b) Chain-of-Thought (Reasoning-Only)
                </span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Internal Hallucination Error
                </span>
              </div>

              <div className="p-4 bg-purple-950/30 rounded-xl border border-purple-500/40 font-mono text-xs space-y-2 text-rose-200">
                <strong className="text-purple-300 block font-bold text-sm">Thought:</strong>
                <p className="bg-rose-950/60 p-3 rounded-lg border border-rose-500/40 leading-relaxed text-rose-200">
                  Apple Remote was originally designed to interact with <span className="underline decoration-rose-500 font-bold text-rose-300">Apple TV</span>. Apple TV can be controlled by iPhone, iPad, and iPod Touch. So the answer is iPhone, iPad, and iPod Touch.
                </p>
                <div className="pt-2 text-sm font-bold text-rose-400 flex items-center justify-between">
                  <span>Answer: iPhone, iPad, iPod Touch</span>
                  <span className="text-xs bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/40">Incorrect (Parametric Memory Hallucination) ❌</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'act' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-bold text-cyan-300 text-sm flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-rose-400" /> (1c) Act-Only (No Reasoning Traces)
                </span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Lacks High-Level Planning
                </span>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
                <p><span className="text-cyan-400 font-bold">Act 1:</span> Search[Apple Remote]</p>
                <p><span className="text-emerald-400 font-bold">Obs 1:</span> The Apple Remote is a remote control...</p>
                <p><span className="text-cyan-400 font-bold">Act 2:</span> Search[Front Row]</p>
                <p><span className="text-rose-400 font-bold">Obs 2:</span> Could not find [Front Row]. Similar: ...</p>
                <p><span className="text-cyan-400 font-bold">Act 3:</span> Search[Front Row (software)]</p>
                <p><span className="text-emerald-400 font-bold">Obs 3:</span> Front Row is a discontinued media center software...</p>
                <p className="p-2 bg-rose-950/40 rounded border border-rose-500/40 font-bold text-rose-300"><span className="text-rose-400 font-bold">Act 4:</span> Finish[yes] ❌ (Fails to synthesize final answer without reasoning thought!)</p>
              </div>
            </div>
          )}

          {activeTab === 'standard' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-bold text-rose-400 text-sm flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-rose-400" /> (1a) Standard Direct Prompting
                </span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Direct Wrong Answer
                </span>
              </div>

              <div className="p-4 bg-rose-950/30 rounded-xl border border-rose-500/40 font-mono text-xs space-y-2 text-rose-300">
                <strong className="text-rose-400 block text-sm">Direct Model Output:</strong>
                <p className="text-base font-bold bg-rose-950/80 p-3 rounded-lg border border-rose-500/50">
                  Answer: iPod ❌
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: Interactive ReAct Execution Trace Simulator */}
      <div id="section-simulator" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-purple-500/40 bg-gradient-to-br from-purple-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Bot className="h-4 w-4 text-purple-400" /> LIVE REACT AGENT EXECUTION SIMULATOR
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Interactive Thought ➔ Action ➔ Observation Loop
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Step through the agent trajectory to observe how internal reasoning tokens dynamically invoke external tool APIs.
            </p>
          </div>

          {/* Example Selector & Step Controls */}
          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
            <select
              value={selectedExample}
              onChange={(e) => {
                setSelectedExample(e.target.value as 'hotpot' | 'fever');
                setStep(0);
              }}
              className="bg-slate-900 text-slate-200 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-purple-500"
            >
              <option value="hotpot">HotpotQA: Apple Remote Question</option>
              <option value="fever">FEVER: Colorado Fourteeners Claim</option>
            </select>

            <button
              onClick={() => setStep(0)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
              title="Reset Trace"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={() => setStep((prev) => (prev + 1) % (activeTrace.length + 1))}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Play className="h-4 w-4 fill-slate-950" />
              <span>Next Step ({step}/{activeTrace.length})</span>
            </button>
          </div>
        </div>

        {/* Question Header */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono space-y-1">
          <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] block">Target Task Question:</span>
          <p className="text-sm font-semibold text-slate-200">
            {selectedExample === 'hotpot'
              ? "Aside from the Apple Remote, what other device can control the program Apple Remote was originally designed to interact with?"
              : "Claim Verification: 'Colorado has 53 mountain peaks over 14,000 feet'."}
          </p>
        </div>

        {/* Step-by-Step Animated Container */}
        <div className="space-y-4">
          {activeTrace.slice(0, step > 0 ? step : activeTrace.length).map((item, idx) => (
            <div key={idx} className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-3 shadow-xl transition-all">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Bot className="h-4 w-4 text-purple-400" /> ReAct Iteration Step #{item.step}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  Turn {idx + 1} of {activeTrace.length}
                </span>
              </div>

              {/* Thought Box */}
              <div className="p-3.5 bg-purple-950/30 rounded-xl border border-purple-500/40 text-purple-200 font-mono text-xs space-y-1 shadow-md">
                <span className="text-purple-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" /> Internal Reasoning Thought:
                </span>
                <p className="leading-relaxed">{item.thought}</p>
              </div>

              {/* Action Box */}
              <div className="p-3.5 bg-amber-950/30 rounded-xl border border-amber-500/40 text-amber-200 font-mono text-xs space-y-1 shadow-md">
                <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5 text-amber-400" /> External Environment Action:
                </span>
                <p className="font-bold text-sm">{item.act}</p>
              </div>

              {/* Observation Box */}
              <div className={`p-3.5 rounded-xl border font-mono text-xs space-y-1 shadow-md ${
                item.isFinal ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-emerald-400" /> Real-World Observation:
                </span>
                <p className="leading-relaxed">{item.obs}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Mathematical Formulation */}
      <div id="section-math" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-emerald-400" /> FORMAL AGENT & ENVIRONMENT SPECIFICATION
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            ReAct Mathematical Formulation
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            ReAct models agent execution as an interactive decision-making process over combined language and action spaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-mono">
          <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-3 shadow-xl">
            <span className="text-purple-400 font-bold block uppercase text-xs">1. Augmented Action Space</span>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <MathFormula math="\mathcal{A} = \mathcal{L} \cup \mathcal{E}" block />
            </div>
            <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
              Combines internal reasoning thoughts <MathFormula math="\mathcal{L}" /> (scratchpad tokens) with external actions <MathFormula math="\mathcal{E}" /> (Wikipedia API search/lookup).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3 shadow-xl">
            <span className="text-amber-400 font-bold block uppercase text-xs">2. History Trajectory Context</span>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <MathFormula math="c_t = (a_1, o_1, a_2, o_2, \dots, a_{t-1}, o_{t-1})" block />
            </div>
            <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
              Context <MathFormula math="c_t" /> maintains complete multi-step history of past actions and environment observations up to turn <MathFormula math="t" />.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3 shadow-xl">
            <span className="text-emerald-400 font-bold block uppercase text-xs">3. Agent Policy Distribution</span>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <MathFormula math="\pi_\theta(a_t \mid c_t)" block />
            </div>
            <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
              Policy <MathFormula math="\pi_\theta" /> generates next action <MathFormula math="a_t" /> (whether a reasoning thought or search API call) conditioned on trajectory history <MathFormula math="c_t" />.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5: ReAct Results & Key Empirical Observations */}
      <div id="section-results" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-amber-400" /> EMPIRICAL ANALYSIS & AGENTIC DESIGN PATTERNS
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            ReAct Results & Key Empirical Observations
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Deep-dive empirical findings from Yao et al. (ICLR 2023) detailing trade-offs, retrieval bottlenecks, orchestration strategies, and fine-tuning dynamics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Card 1: The Hallucination vs. Flexibility Trade-off */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-rose-500/40 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-bold text-rose-300 text-sm flex items-center gap-2">
                  <Layers className="h-4 w-4 text-rose-400" /> 1. Hallucination vs. Flexibility Trade-off
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  CoT vs ReAct Failure Modes
                </span>
              </div>

              <div className="space-y-2 text-slate-300 leading-relaxed font-sans">
                <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-500/30 space-y-1">
                  <strong className="text-purple-300 font-mono text-xs block">CoT Weakness: Internal Hallucination (56% Error Rate)</strong>
                  <p className="text-[11px] text-slate-300">
                    <span className="text-rose-400 font-bold">56% of CoT’s failures</span> stem from making things up. Because CoT relies entirely on frozen parametric weights, it suffers a high rate of false positive factual hallucinations.
                  </p>
                </div>

                <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-500/30 space-y-1">
                  <strong className="text-amber-300 font-mono text-xs block">ReAct Weakness: Rigidity & Infinite Loops</strong>
                  <p className="text-[11px] text-slate-300">
                    ReAct is grounded by fetching external facts, but the strict <code className="text-amber-300 font-mono">Thought ➔ Act ➔ Obs</code> loop reduces flexibility. Models often get stuck repeating the exact same thought and action endlessly without making progress.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-200 space-y-1 mt-2">
              <strong className="block font-mono text-amber-400 uppercase tracking-wider text-[10px]">Architectural Takeaway:</strong>
              <p className="leading-relaxed text-slate-300">
                CoT requires <strong>hallucination detection</strong> to catch semantic drift, whereas ReAct requires <strong>cyclical edge detection</strong> in the state graph to break infinite agent loops.
              </p>
            </div>
          </div>

          {/* Card 2: The Retrieval Bottleneck */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-cyan-500/40 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-bold text-cyan-300 text-sm flex items-center gap-2">
                  <Search className="h-4 w-4 text-cyan-400" /> 2. The Retrieval Bottleneck
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  23% Search Failure Rate
                </span>
              </div>

              <div className="space-y-2 text-slate-300 leading-relaxed font-sans">
                <p className="text-xs text-slate-300">
                  ReAct is deeply sensitive to the quality of the information it fetches.
                </p>

                <div className="p-3 bg-cyan-950/30 rounded-xl border border-cyan-500/30 space-y-1">
                  <strong className="text-cyan-300 font-mono text-xs block">Uninformative Context Derailment:</strong>
                  <p className="text-[11px] text-slate-300">
                    <span className="text-cyan-400 font-bold">23% of ReAct errors</span> occur simply because the search step returned uninformative garbage context. When noisy observation context is injected into the prompt, the model’s reasoning chain gets derailed and rarely recovers.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-200 space-y-1 mt-2">
              <strong className="block font-mono text-cyan-400 uppercase tracking-wider text-[10px]">Architectural Takeaway:</strong>
              <p className="leading-relaxed text-slate-300">
                An agent is only as good as its retrieval layer. If the underlying vector search or tool API fails to surface relevant context, the entire reasoning trajectory collapses.
              </p>
            </div>
          </div>

          {/* Card 3: "Best of Both Worlds" Orchestration */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-purple-500/40 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-bold text-purple-300 text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-400" /> 3. &quot;Best of Both Worlds&quot; Orchestration
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  CoT-SC + ReAct
                </span>
              </div>

              <div className="space-y-2 text-slate-300 leading-relaxed font-sans">
                <p className="text-xs text-slate-300">
                  Neither method is perfect on its own: ReAct wins on fact-heavy tasks (FEVER), while CoT slightly edges it out on internal multi-hop logic (HotpotQA).
                </p>

                <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-500/30 space-y-1">
                  <strong className="text-purple-300 font-mono text-xs block">Combining ReAct with CoT Self-Consistency (CoT-SC):</strong>
                  <p className="text-[11px] text-slate-300">
                    Switching between ReAct and CoT-SC reaches peak performance using only <span className="text-purple-300 font-bold">3 to 5 reasoning samples</span>, compared to needing <span className="text-rose-400 font-bold">21 samples</span> with CoT-SC alone!
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-200 space-y-1 mt-2">
              <strong className="block font-mono text-purple-400 uppercase tracking-wider text-[10px]">Architectural Takeaway:</strong>
              <p className="leading-relaxed text-slate-300">
                Dynamic orchestration—where a system leverages internal CoT logic but selectively calls ReAct tools when external grounding is needed—is the optimal agent architecture.
              </p>
            </div>
          </div>

          {/* Card 4: Fine-Tuning a "Skill" vs. Memorizing "Facts" */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/40 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-bold text-emerald-300 text-sm flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-emerald-400" /> 4. Fine-Tuning a &quot;Skill&quot; vs. Memorizing &quot;Facts&quot;
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Paper Figure 3 Scaling
                </span>
              </div>

              <div className="space-y-2 text-slate-300 leading-relaxed font-sans">
                <p className="text-xs text-slate-300">
                  Yao et al. Figure 3 reveals a massive scaling advantage for ReAct when fine-tuned:
                </p>

                <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/30 space-y-1 text-[11px]">
                  <p>• Prompting an 8B model with ReAct fails (too complex to learn tool-use from a few context examples).</p>
                  <p>• Fine-tuning an <span className="text-emerald-300 font-bold">8B model on 3,000 ReAct trajectories</span> outperforms a <span className="text-amber-300 font-bold">62B prompted model</span>!</p>
                  <p>• A <span className="text-emerald-300 font-bold">62B fine-tuned ReAct model</span> outperforms a <span className="text-rose-400 font-bold">540B prompted PaLM model</span>!</p>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-200 space-y-1 mt-2">
              <strong className="block font-mono text-emerald-400 uppercase tracking-wider text-[10px]">Architectural Takeaway:</strong>
              <p className="leading-relaxed text-slate-300">
                Fine-tuning standard CoT forces models to memorise facts (which hallucinate). Fine-tuning ReAct teaches models a <strong>generalizable tool-use skill</strong>, enabling small models to outperform giant models.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: Original Research Paper Reference */}
      <div id="section-paper" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border-rose-500/40 bg-gradient-to-br from-rose-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-rose-400" /> ORIGINAL RESEARCH PAPER (ICLR 2023)
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              ReAct: Synergizing Reasoning and Acting in Language Models
            </h2>
            <p className="text-xs text-slate-300">
              Shunyu Yao, Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthik Narasimhan, Yuan Cao — Google Research, Brain Team & Princeton University
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
            <a
              href="https://arxiv.org/abs/2210.03629"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <ExternalLink className="h-4 w-4 text-amber-400" />
              <span>ArXiv Abstract</span>
            </a>

            <a
              href="https://arxiv.org/pdf/2210.03629"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all flex items-center gap-2"
            >
              <FileText className="h-4 w-4 text-amber-400" />
              <span>Open PDF (arXiv:2210.03629)</span>
            </a>
          </div>
        </div>

        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
          &quot;While large language models (LLMs) demonstrate impressive performance across reasoning (e.g. chain-of-thought) and acting (e.g. WebGPT), their synergy has not been systematically explored. We present ReAct, a framework to use LLMs to generate both reasoning traces and task-specific actions in an interleaved manner... ReAct overcomes issues of hallucination and error propagation prevalent in chain-of-thought prompting by grounding reasoning in an external environment.&quot;
        </div>
      </div>

      {/* Footer Back to Top Button Bar */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg"
        >
          <ArrowUp className="h-4 w-4 text-amber-400" />
          <span>Back to Top</span>
        </button>
      </div>
    </div>
  );
};
