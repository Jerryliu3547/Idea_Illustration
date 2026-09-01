"use client";

import React, { useState } from 'react';
import { getAssetPath } from '@/lib/asset';
import { MathFormula } from '@/components/ui/MathFormula';
import { 
  Sparkles, 
  Brain, 
  Bookmark, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  FileText, 
  ExternalLink, 
  Lightbulb, 
  RefreshCw, 
  TrendingUp, 
  Layers, 
  Code, 
  Maximize2, 
  X,
  Target,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface SimulationProblem {
  id: number;
  question: string;
  choices: string[];
  correctAnswer: string;
  // State per iteration
  iterations: {
    forwardRationale: string;
    forwardAnswer: string;
    forwardCorrect: boolean;
    hintRationale?: string;
    hintAnswer?: string;
    hintSuccess?: boolean;
  }[];
}

const simulationData: SimulationProblem[] = [
  {
    id: 1,
    question: "What can be used to carry a small dog?",
    choices: ["(a) swimming pool", "(b) basket", "(c) dog show", "(d) backyard", "(e) own home"],
    correctAnswer: "(b) basket",
    iterations: [
      {
        forwardRationale: "Dogs love backyard spaces and dog shows.",
        forwardAnswer: "(c) dog show",
        forwardCorrect: false,
        hintRationale: "The answer must be something that can be used to carry a small dog. Baskets are designed to hold and carry small items. Therefore, the answer is basket.",
        hintAnswer: "(b) basket",
        hintSuccess: true,
      },
      {
        forwardRationale: "Baskets are portable containers designed to hold small pets like dogs.",
        forwardAnswer: "(b) basket",
        forwardCorrect: true,
      },
      {
        forwardRationale: "A basket is a portable container suitable for carrying a small dog safely.",
        forwardAnswer: "(b) basket",
        forwardCorrect: true,
      }
    ]
  },
  {
    id: 2,
    question: "Where do you put your grapes just before checking out?",
    choices: ["(a) mouth", "(b) grocery cart", "(c) super market", "(d) fruit basket", "(e) fruit market"],
    correctAnswer: "(b) grocery cart",
    iterations: [
      {
        forwardRationale: "Grapes are bought in a supermarket.",
        forwardAnswer: "(c) super market",
        forwardCorrect: false,
        hintRationale: "The answer should be the place where grocery items are placed before checking out. Of the choices, grocery cart makes the most sense for holding items before checkout.",
        hintAnswer: "(b) grocery cart",
        hintSuccess: true,
      },
      {
        forwardRationale: "Items selected in a store are placed in a grocery cart prior to paying at checkout.",
        forwardAnswer: "(b) grocery cart",
        forwardCorrect: true,
      },
      {
        forwardRationale: "Before checking out at a grocery store, items are collected in a grocery cart.",
        forwardAnswer: "(b) grocery cart",
        forwardCorrect: true,
      }
    ]
  },
  {
    id: 3,
    question: "A store has 12 apples. John buys 4. The store gets 8 more. How many apples now?",
    choices: ["(a) 12", "(b) 16", "(c) 20", "(d) 24"],
    correctAnswer: "(b) 16",
    iterations: [
      {
        forwardRationale: "12 + 4 + 8 = 24 apples total.",
        forwardAnswer: "(d) 24",
        forwardCorrect: false,
        hintRationale: "John buying 4 reduces apples: 12 - 4 = 8. Adding 8 shipment gives 8 + 8 = 16. The answer is 16.",
        hintAnswer: "(b) 16",
        hintSuccess: true,
      },
      {
        forwardRationale: "Start with 12 apples. Subtract 4 bought = 8. Add 8 new = 16 apples total.",
        forwardAnswer: "(b) 16",
        forwardCorrect: true,
      },
      {
        forwardRationale: "12 - 4 = 8 remaining. 8 + 8 = 16 total apples.",
        forwardAnswer: "(b) 16",
        forwardCorrect: true,
      }
    ]
  },
  {
    id: 4,
    question: "If all Bloops are Razzies and all Razzies are Lazzies, are Bloops always Lazzies?",
    choices: ["(a) Yes, logically true", "(b) No, false", "(c) Cannot be determined"],
    correctAnswer: "(a) Yes, logically true",
    iterations: [
      {
        forwardRationale: "Bloops and Lazzies sound like different distinct categories.",
        forwardAnswer: "(b) No, false",
        forwardCorrect: false,
        hintRationale: "By transitive property of set inclusion: Bloops ⊂ Razzies ⊂ Lazzies. Thus Bloops ⊂ Lazzies.",
        hintAnswer: "(a) Yes, logically true",
        hintSuccess: true,
      },
      {
        forwardRationale: "Bloops are a subset of Razzies, which are a subset of Lazzies. By transitivity, Bloops are Lazzies.",
        forwardAnswer: "(a) Yes, logically true",
        forwardCorrect: true,
      },
      {
        forwardRationale: "Transitive logic implies Bloops ⊆ Razzies ⊆ Lazzies, so Bloops must be Lazzies.",
        forwardAnswer: "(a) Yes, logically true",
        forwardCorrect: true,
      }
    ]
  },
  {
    id: 5,
    question: "What happens to the temperature of a gas when compressed adiabatically?",
    choices: ["(a) Decreases", "(b) Remains constant", "(c) Increases", "(d) Drops to zero"],
    correctAnswer: "(c) Increases",
    iterations: [
      {
        forwardRationale: "Adiabatic processes mean heat Q = 0, so temperature does not change.",
        forwardAnswer: "(b) Remains constant",
        forwardCorrect: false,
        hintRationale: "Compression does work W on the gas. Since Q = 0, ΔU = W > 0, so internal energy and temperature increase.",
        hintAnswer: "(c) Increases",
        hintSuccess: true,
      },
      {
        forwardRationale: "Work is done on the gas during compression, raising internal energy and temperature.",
        forwardAnswer: "(c) Increases",
        forwardCorrect: true,
      },
      {
        forwardRationale: "Adiabatic compression: W > 0 with Q = 0 implies ΔU > 0, increasing temperature.",
        forwardAnswer: "(c) Increases",
        forwardCorrect: true,
      }
    ]
  }
];

export const STaRVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [simIteration, setSimIteration] = useState<number>(0);
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);

  // Calculate metrics for current simulation iteration
  const currentIterData = simulationData.map(p => p.iterations[simIteration]);
  const forwardCorrectCount = currentIterData.filter(d => d.forwardCorrect).length;
  const rationalizedCount = currentIterData.filter(d => !d.forwardCorrect && d.hintSuccess).length;
  const totalTrainingCount = forwardCorrectCount + rationalizedCount;
  const accuracyPct = Math.round((totalTrainingCount / simulationData.length) * 100);

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="h-4 w-4 text-amber-400" /> LLM Self-Improvement & Bootstrapping Reasoning
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          STaR: Self-Taught Reasoner
        </h1>
        <p className="text-slate-300 mt-2 text-base leading-relaxed">
          Bootstrapping Reasoning With Reasoning — An iterative self-play fine-tuning framework where language models learn to solve complex reasoning problems by fine-tuning on their own generated rationales, augmented by rationalization hints.
        </p>
      </div>

      {/* QUICK BOOKMARK NAVIGATION BAR */}
      <div className="sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border border-amber-500/40 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
          <Bookmark className="h-4 w-4 text-amber-400" />
          <span>Quick Section Bookmarks:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs font-mono">
          <button
            onClick={() => document.getElementById('section-schematic')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-2.5 py-2 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-start gap-1.5 text-left"
          >
            <Lightbulb className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold truncate">1. Schematic</span>
          </button>

          <button
            onClick={() => document.getElementById('section-bootstrapping')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-2.5 py-2 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-start gap-1.5 text-left"
          >
            <RefreshCw className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="font-semibold truncate">2. Sec 3.1 Bootstrapping</span>
          </button>

          <button
            onClick={() => document.getElementById('section-math')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-2.5 py-2 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-start gap-1.5 text-left"
          >
            <TrendingUp className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span className="font-semibold truncate">3. Policy Gradient</span>
          </button>

          <button
            onClick={() => document.getElementById('section-rationalization')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-2.5 py-2 rounded-xl bg-slate-900/90 hover:bg-rose-500/20 text-slate-200 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-all flex items-center justify-start gap-1.5 text-left"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
            <span className="font-semibold truncate">4. Rationalization</span>
          </button>

          <button
            onClick={() => document.getElementById('section-algorithm')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-2.5 py-2 rounded-xl bg-slate-900/90 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-start gap-1.5 text-left"
          >
            <Code className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold truncate">5. Algorithm 1</span>
          </button>

          <button
            onClick={() => document.getElementById('section-simulator')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-2.5 py-2 rounded-xl bg-slate-900/90 hover:bg-indigo-500/20 text-slate-200 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-start gap-1.5 text-left"
          >
            <Play className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <span className="font-semibold truncate">6. Simulator</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: SCHEMATIC OVERVIEW & FIGURES */}
      <div id="section-schematic" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Lightbulb className="h-4 w-4 text-amber-400" /> SYSTEM ARCHITECTURE & SCHEMATIC FLOW
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Figure 1: STaR Overview & CommonsenseQA Rationale Example
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Dashed lines represent the outer fine-tuning loop. Model generates rationales, filters by ground-truth correctness, and rationalizes failed problems using hints.
            </p>
          </div>

          <button
            onClick={() => setImageModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-amber-500/20 text-amber-300 border border-slate-800 hover:border-amber-500/40 font-mono text-xs font-bold transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <Maximize2 className="h-4 w-4" />
            <span>Enlarge Schematic Image</span>
          </button>
        </div>

        {/* Schematic Image Display & Interactive Annotation Callouts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Schematic Image Container */}
          <div className="lg:col-span-7 bg-slate-950 p-4 sm:p-6 rounded-2xl border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10 space-y-3 relative group">
            <div className="relative overflow-hidden rounded-xl bg-white p-2 border border-slate-700 flex justify-center cursor-pointer" onClick={() => setImageModalOpen(true)}>
              <img 
                src={getAssetPath('/images/star_overview.png')} 
                alt="Figure 1: An overview of STaR and a STaR-generated rationale on CommonsenseQA"
                className="max-h-[460px] w-auto object-contain rounded"
              />
              <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-4 py-2 rounded-xl bg-slate-900/90 text-amber-300 font-mono text-xs font-bold border border-amber-500/50 flex items-center gap-2 shadow-xl">
                  <Maximize2 className="h-4 w-4" /> Click to Expand Figure 1
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-sans leading-relaxed bg-slate-900/70 p-3 rounded-xl border border-slate-800">
              <strong className="text-slate-200">Figure 1 Caption:</strong> An overview of STaR and a STaR-generated rationale on CommonsenseQA. We indicate the fine-tuning outer loop with a dashed line. The questions and ground truth answers are expected to be present in the dataset, while rationales are generated using STaR.
            </p>
          </div>

          {/* Right Column: Figure 2 Hint Exemplar & Key Pipeline Steps */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Figure 2: Prompt Hint for Rationalization
                </span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
                  Hint Included in Green
                </span>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs space-y-2 text-slate-300 leading-relaxed">
                <p><strong className="text-cyan-400">Q:</strong> Where do you put your grapes just before checking out?</p>
                <div className="text-slate-400 text-[11px] pl-2 border-l border-slate-800 space-y-0.5">
                  <p>Answer Choices:</p>
                  <p>(a) mouth</p>
                  <p className="text-emerald-400 font-bold">(b) grocery cart (CORRECT)</p>
                  <p>(c) super market</p>
                  <p>(d) fruit basket</p>
                  <p>(e) fruit market</p>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px]">
                  <span className="text-amber-400 font-bold block mb-1">A (Rationalization Output):</span>
                  <span className="text-emerald-400 font-semibold">[Hint: (b) grocery cart] </span>
                  The answer should be the place where grocery items are placed before checking out. Of the above choices, grocery cart makes the most sense for holding grocery items. Therefore, the answer is grocery cart (b).
                </div>
              </div>

              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                When fine-tuning on this rationale, the <span className="text-emerald-400 font-semibold">green hint</span> is stripped out so the model learns to generate this rationale autonomously!
              </p>
            </div>

            {/* Quick Summary Badges */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Forward Pass
                </span>
                <p className="text-[11px] text-slate-400 font-sans">Filter & keep rationales leading to correct answers.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-1">
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <HelpCircle className="h-3.5 w-3.5" /> Rationalization
                </span>
                <p className="text-[11px] text-slate-400 font-sans">Give hint on failed problems to reason backwards.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Decision Guide: When to Use Bootstrapping vs. Rationalization */}
        <div className="p-6 rounded-2xl bg-slate-950/90 border border-amber-500/40 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Target className="h-5 w-5 text-amber-400" /> When to Use Bootstrapping vs. When to Use Rationalization
            </h3>
            <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30 font-semibold">
              STaR Dual-Path Decision Strategy
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans leading-relaxed">
            {/* Left Card: When to Use Rationale Generation Bootstrapping */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-950/30 to-slate-950 border border-emerald-500/40 space-y-3">
              <div className="flex items-center gap-2 font-mono font-bold text-emerald-400 text-sm border-b border-emerald-500/20 pb-2">
                <RefreshCw className="h-4.5 w-4.5 text-emerald-400" />
                <span>When to Use Rationale Generation (Bootstrapping)</span>
              </div>
              
              <ul className="space-y-2 text-slate-300 list-disc pl-4 text-xs">
                <li>
                  <strong className="text-emerald-300">Default Primary Pass:</strong> Applied to <em>all dataset problems</em> <MathFormula math="x_i" /> during the initial forward reasoning generation stage.
                </li>
                <li>
                  <strong className="text-emerald-300">Autonomous Solving:</strong> Used when the model generates rationales <MathFormula math="\hat{r}_i" /> and answers <MathFormula math="\hat{y}_i" /> without any external hints or target answer prompts.
                </li>
                <li>
                  <strong className="text-emerald-300">Success Criteria:</strong> Triggered when the model naturally arrives at the ground-truth answer (<MathFormula math="\hat{y}_i = y_i" />).
                </li>
                <li>
                  <strong className="text-emerald-300">Dataset Output:</strong> Added directly to forward dataset <MathFormula math="\mathcal{D}_n" /> to reinforce autonomous problem-solving capabilities.
                </li>
              </ul>
            </div>

            {/* Right Card: When to Use Rationalization */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-950/30 to-slate-950 border border-cyan-500/40 space-y-3">
              <div className="flex items-center gap-2 font-mono font-bold text-cyan-400 text-sm border-b border-cyan-500/20 pb-2">
                <AlertTriangle className="h-4.5 w-4.5 text-cyan-400" />
                <span>When to Use Rationalization</span>
              </div>

              <ul className="space-y-2 text-slate-300 list-disc pl-4 text-xs">
                <li>
                  <strong className="text-cyan-300">Failed Examples Fallback:</strong> Applied <em>specifically to problems the model failed to solve</em> (<MathFormula math="\hat{y}_i \neq y_i" />) in the forward pass.
                </li>
                <li>
                  <strong className="text-cyan-300">Overcoming Plateauing:</strong> Used when forward bootstrapping stalls because the model receives zero training signals from incorrect answers.
                </li>
                <li>
                  <strong className="text-cyan-300">Backward Abductive Reasoning:</strong> Used by injecting the ground-truth answer <MathFormula math="y_i" /> as a <em>hint</em> (`add_hint(x_i, y_i)`), prompting the model to reason backwards from answer to rationale.
                </li>
                <li>
                  <strong className="text-cyan-300">Hint-Stripped Fine-Tuning:</strong> Added to dataset <MathFormula math="\mathcal{D}_n^{\text{rat}}" /> with the hint removed, training the model as if it solved hard problems autonomously.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: SECTION 3.1 RATIONALE GENERATION BOOTSTRAPPING */}
      <div id="section-bootstrapping" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <RefreshCw className="h-4 w-4 text-cyan-400" /> CORE ALGORITHM STEP 1
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            3.1 Rationale Generation Bootstrapping (STaR Without Rationalization)
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            How language models bootstrap reasoning trajectories from an initial few-shot prompt set.
          </p>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
          {/* Formulation & Mathematical Setup Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-400" /> Initial Dataset & Prompt Setup
              </h3>
              <p className="text-xs text-slate-300">
                We are given a pretrained language model <MathFormula math="M" /> and an initial problem-answer dataset:
              </p>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-xs">
                <MathFormula math="\mathcal{D} = \{(x_i, y_i)\}_{i=1}^D" block />
              </div>
              <p className="text-xs text-slate-300">
                We start with a small few-shot prompt set <MathFormula math="\mathcal{P}" /> of examples containing intermediate reasoning rationales <MathFormula math="r" />:
              </p>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-xs">
                <MathFormula math="\mathcal{P} = \{(x_i^p, r_i^p, y_i^p)\}_{i=1}^P, \quad \text{where } \mathcal{P} \subset \mathcal{D} \quad (\text{e.g., } P = 10)" block />
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" /> Concatenation & Rationale Sampling
              </h3>
              <p className="text-xs text-slate-300">
                Like standard few-shot prompting, we concatenate the prompt set <MathFormula math="\mathcal{P}" /> to each training example <MathFormula math="x_i" />:
              </p>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto">
                <MathFormula math="x_i' = (x_1^p, r_1^p, y_1^p, \dots, x_P^p, r_P^p, y_P^p, x_i)" block />
              </div>
              <p className="text-xs text-slate-300">
                This encourages the model to generate an intermediate rationale <MathFormula math="\hat{r}_i" /> for <MathFormula math="x_i" />, followed by a final predicted answer <MathFormula math="\hat{y}_i" />.
              </p>
            </div>
          </div>

          {/* Filtering & Outer Loop Rule */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-4">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-cyan-400" /> Rationale Quality Assumption & Filtering Rule
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              We assume that <strong>rationales that lead to correct answers are of higher quality than those that lead to incorrect answers</strong>. Therefore, we filter the generated rationales to include only those which result in the correct ground-truth answer (<MathFormula math="\hat{y}_i = y_i" />):
            </p>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 flex justify-center">
              <MathFormula math="\mathcal{D}_n = \{(x_i, \hat{r}_i, y_i) \mid i \in [1, D] \land \hat{y}_i = y_i\}" block />
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 space-y-1">
              <strong className="block font-mono uppercase tracking-wider text-cyan-300">Crucial Outer Loop Fine-Tuning Detail:</strong>
              <p className="text-slate-300 leading-relaxed">
                We fine-tune the base model <MathFormula math="M" /> on this filtered dataset <MathFormula math="\mathcal{D}_n" />, and then restart the rationale generation process with the newly fine-tuned model <MathFormula math="M_{n-1}" />. <strong>Note:</strong> In each iteration, once we collect a new dataset, we train from the <em>original pre-trained model <MathFormula math="M" /></em> instead of continually training one model to avoid severe overfitting!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: MATHEMATICAL FOUNDATIONS & POLICY GRADIENT */}
      <div id="section-math" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-purple-500/40 bg-gradient-to-br from-purple-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-purple-400" /> MATHEMATICAL DERIVATION & THEORY
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Policy Gradient Objective & RL Equivalence
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            STaR can be formally understood as a discrete latent variable model optimized via an RL policy gradient objective.
          </p>
        </div>

        <div className="space-y-6 font-sans">
          {/* Latent Variable Model Definition */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider block">
              Discrete Latent Variable Formulation:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              The model <MathFormula math="M" /> can be viewed as a discrete latent variable model <MathFormula math="p_M(y \mid x)" />, where <MathFormula math="M" /> first samples a latent rationale <MathFormula math="r" /> before predicting answer <MathFormula math="y" />:
            </p>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-sm text-purple-300 flex justify-center">
              <MathFormula math="p_M(y \mid x) = \sum_{r} p(r \mid x) \, p(y \mid x, r)" block />
            </div>
          </div>

          {/* Expected Reward & Gradient Formulas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Equation (1): Total Expected Reward */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-purple-500/30 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-purple-300">Equation (1): Expected Reward</span>
                <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                  Indicator Reward 1(ŷ = y)
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Given the binary indicator reward function <MathFormula math="\mathbf{1}(\hat{y} = y)" />, the total expected reward across dataset <MathFormula math="\mathcal{D}" /> is:
              </p>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto">
                <MathFormula math="J(M, X, Y) = \sum_{i=1}^D \mathbb{E}_{\hat{r}_i, \hat{y}_i \sim p_M(\cdot \mid x_i)} \left[ \mathbf{1}(\hat{y}_i = y_i) \right]" block />
              </div>
            </div>

            {/* Equation (2): Policy Gradient */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-cyan-500/30 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-cyan-300">Equation (2): Policy Gradient</span>
                <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                  Log-Derivative Trick
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Taking the gradient via the standard REINFORCE log-derivative trick gives:
              </p>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto">
                <MathFormula math="\nabla J(M, X, Y) = \sum_{i=1}^D \mathbb{E}_{\hat{r}_i, \hat{y}_i \sim p_M} \left[ \mathbf{1}(\hat{y}_i = y_i) \cdot \nabla \log p_M(\hat{y}_i, \hat{r}_i \mid x_i) \right]" block />
              </div>
            </div>
          </div>

          {/* Theoretical Approximations Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-purple-300 font-bold block uppercase flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-purple-400" /> 1. Gradient Filtering via Reward
              </span>
              <p className="text-slate-300 font-sans leading-relaxed">
                The indicator function <MathFormula math="\mathbf{1}(\hat{y}_i = y_i)" /> zeroes out and discards the gradient for all sampled rationales that lead to incorrect answers — exactly matching the <strong>Line 5 filtering process</strong> in STaR.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-cyan-300 font-bold block uppercase flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-cyan-400" /> 2. Variance Reduction & Fine-tuning
              </span>
              <p className="text-slate-300 font-sans leading-relaxed">
                STaR approximates the expectation by <strong>(1) greedily decoding</strong> samples <MathFormula math="(\hat{r}_i, \hat{y}_i)" /> to dramatically reduce variance, and <strong>(2) taking multiple gradient steps</strong> on the same batch of data (similar to PPO policy iteration).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: SECTION 3.2 RATIONALIZATION & WHY MUST INCLUDE */}
      <div id="section-rationalization" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-rose-500/50 bg-gradient-to-br from-rose-950/30 via-slate-900/90 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-rose-400" /> CRITICAL REQUIREMENT & INNOVATION
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            3.2 Rationalization & Why Rationalization MUST Be Included
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Understanding the fundamental limitation of forward rationale generation and how rationalization overcomes early performance saturation.
          </p>
        </div>

        {/* PROMINENT ALERT CALLOUT: WHY RATIONALIZATION IS MUST INCLUDED */}
        <div className="p-6 rounded-2xl bg-rose-950/40 border-2 border-rose-500/60 shadow-2xl shadow-rose-500/10 space-y-4">
          <div className="flex items-center gap-3 border-b border-rose-500/40 pb-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40">
              <AlertTriangle className="h-6 w-6 text-rose-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-rose-200 uppercase tracking-wider font-mono">
                Why Rationalization MUST Be Included in STaR
              </h3>
              <p className="text-xs text-rose-300/80">
                Solving the fundamental zero-training-signal bottleneck on unsolved problems
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed font-sans">
            {/* Left Box: The Limitation of Rationale Generation */}
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 space-y-2">
              <span className="font-mono font-bold text-rose-400 uppercase tracking-wider block flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-rose-400" /> The Forward Generation Limitation:
              </span>
              <p className="text-slate-300">
                The basic rationale generation bootstrapping algorithm carries a severe fundamental limitation: since the model is <strong>only fine-tuned on examples which it answers correctly</strong>, improvement ends as soon as the model fails to solve new problems in the training set.
              </p>
              <p className="text-rose-300 font-semibold pt-1 border-t border-slate-800">
                The algorithm receives 0 training signal from failed examples!
              </p>
            </div>

            {/* Right Box: How Rationalization Solves It */}
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2">
              <span className="font-mono font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> The Rationalization Solution:
              </span>
              <p className="text-slate-300">
                We provide the ground-truth answer <MathFormula math="y_i" /> as a <strong>hint</strong> in the prompt (`add_hint(x_i, y_i)`). Given the correct target answer, the model is able to <strong>reason backwards</strong> (abduction) and generate a valid intermediate rationale leading to that correct answer.
              </p>
              <p className="text-emerald-300 font-semibold pt-1 border-t border-slate-800">
                Unlocks training signals on hard/unsolved problems!
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown of Rationalization Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-mono">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-amber-400 font-bold block uppercase flex items-center gap-1.5">
              <Target className="h-4 w-4 text-amber-400" /> 1. Backward Abductive Reasoning
            </span>
            <p className="text-slate-300 font-sans leading-relaxed">
              When given the answer hint, the model constructs a rationale backwards. For example, knowing the answer is <em>&quot;grocery cart&quot;</em> helps it deduce that carts are used before checkout.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2">
            <span className="text-cyan-400 font-bold block uppercase flex items-center gap-1.5">
              <RefreshCw className="h-4 w-4 text-cyan-400" /> 2. Hint Stripping During Training
            </span>
            <p className="text-slate-300 font-sans leading-relaxed">
              When adding a rationalization-generated rationale <MathFormula math="\hat{r}_i^{\text{rat}}" /> to <MathFormula math="\mathcal{D}_n^{\text{rat}}" />, the <strong>hint is removed from the training prompt</strong>. The model is fine-tuned as if it had generated the rationale autonomously without help!
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
            <span className="text-emerald-400 font-bold block uppercase flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-emerald-400" /> 3. &quot;Thinking Outside the Box&quot;
            </span>
            <p className="text-slate-300 font-sans leading-relaxed">
              Fine-tuning on rationalization data challenges the model to <em>&quot;think outside the box&quot;</em> on difficult problems where it was previously unsuccessful, significantly expanding dataset size and model capability.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5: ALGORITHM 1 PSEUDOCODE */}
      <div id="section-algorithm" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Code className="h-4 w-4 text-emerald-400" /> FULL PSEUDOCODE & ALGORITHM
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Algorithm 1: STaR (Self-Taught Reasoner)
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Parts highlighted in blue/cyan correspond to Rationalization. Without those parts, Algorithm 1 corresponds to STaR without rationalization.
            </p>
          </div>

          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0 self-start sm:self-auto">
            Blue Lines = Rationalization Steps
          </span>
        </div>

        {/* Algorithm Pseudocode Display Box */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 font-mono text-xs space-y-2 shadow-2xl overflow-x-auto">
          <div className="text-slate-400 pb-3 border-b border-slate-800 space-y-1">
            <p><strong className="text-amber-400">Algorithm 1:</strong> STaR (Self-Taught Reasoner)</p>
            <p><strong className="text-slate-300">Input:</strong> <MathFormula math="M" />: a pretrained LLM; dataset <MathFormula math="\mathcal{D} = \{(x_i, y_i)\}_{i=1}^D" /> (w/ few-shot prompts)</p>
          </div>

          <div className="space-y-1.5 pt-2">
            <p className="text-slate-300"><span className="text-slate-500 font-bold pr-4">1:</span><MathFormula math="M_0 \leftarrow M" /> <span className="text-slate-500 font-sans italic"># Copy original pretrained model</span></p>
            <p className="text-slate-300"><span className="text-slate-500 font-bold pr-4">2:</span><strong className="text-purple-400">for</strong> <MathFormula math="n \text{ in } 1 \dots N" /> <strong className="text-purple-400">do</strong> <span className="text-slate-500 font-sans italic"># Outer loop</span></p>
            
            <p className="text-slate-200 pl-6"><span className="text-slate-500 font-bold pr-4">3:</span><MathFormula math="(\hat{r}_i, \hat{y}_i) \leftarrow M_{n-1}(x_i) \quad \forall i \in [1, D]" /> <span className="text-slate-500 font-sans italic"># Perform rationale generation</span></p>
            
            {/* Highlighted Line 4: Rationalization in Cyan */}
            <div className="pl-6 bg-cyan-950/40 p-1.5 rounded border-l-4 border-cyan-400 text-cyan-200 flex items-center justify-between">
              <span><span className="text-cyan-400 font-bold pr-4">4:</span><MathFormula math="(\hat{r}_i^{\text{rat}}, \hat{y}_i^{\text{rat}}) \leftarrow M_{n-1}(\text{add\_hint}(x_i, y_i)) \quad \forall i \in [1, D]" /></span>
              <span className="text-[10px] text-cyan-300 font-sans italic shrink-0"># Rationalization step</span>
            </div>

            <p className="text-slate-200 pl-6"><span className="text-slate-500 font-bold pr-4">5:</span><MathFormula math="\mathcal{D}_n \leftarrow \{(x_i, \hat{r}_i, y_i) \mid i \in [1, D] \land \hat{y}_i = y_i\}" /> <span className="text-slate-500 font-sans italic"># Filter rationales using ground truth</span></p>
            
            {/* Highlighted Line 6: Rationalization Filter in Cyan */}
            <div className="pl-6 bg-cyan-950/40 p-1.5 rounded border-l-4 border-cyan-400 text-cyan-200 flex items-center justify-between">
              <span><span className="text-cyan-400 font-bold pr-4">6:</span><MathFormula math="\mathcal{D}_n^{\text{rat}} \leftarrow \{(x_i, \hat{r}_i^{\text{rat}}, y_i) \mid i \in [1, D] \land \hat{y}_i \neq y_i \land \hat{y}_i^{\text{rat}} = y_i\}" /></span>
              <span className="text-[10px] text-cyan-300 font-sans italic shrink-0"># Filter rationalized rationales</span>
            </div>

            <p className="text-amber-300 font-bold pl-6"><span className="text-slate-500 font-bold pr-4">7:</span><MathFormula math="M_n \leftarrow \text{train}(M, \, \mathcal{D}_n \cup \mathcal{D}_n^{\text{rat}})" /> <span className="text-amber-400 font-sans font-normal italic"># Finetune ORIGINAL model on correct solutions</span></p>
            
            <p className="text-slate-300"><span className="text-slate-500 font-bold pr-4">8:</span><strong className="text-purple-400">end for</strong></p>
          </div>
        </div>
      </div>

      {/* SECTION 6: INTERACTIVE STaR BOOTSTRAPPING PIPELINE SIMULATOR */}
      <div id="section-simulator" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-indigo-500/40 bg-gradient-to-br from-indigo-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Play className="h-4 w-4 text-indigo-400" /> LIVE INTERACTIVE PIPELINE SIMULATOR
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Interactive STaR Bootstrapping Explorer
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Step through iterations of STaR self-play. Watch how rationalization salvages failed problems to expand the fine-tuning dataset and drive accuracy growth!
            </p>
          </div>

          {/* Iteration Selector Tabs */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setSimIteration(0)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                simIteration === 0 ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Iter 1 (Base Model M₀)
            </button>
            <button
              onClick={() => setSimIteration(1)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                simIteration === 1 ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Iter 2 (Model M₁)
            </button>
            <button
              onClick={() => setSimIteration(2)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                simIteration === 2 ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Iter 3 (Model M₂)
            </button>
          </div>
        </div>

        {/* Live Metrics Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Total Dataset Problems:</span>
            <span className="text-xl font-extrabold text-white">{simulationData.length}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-1">
            <span className="text-emerald-400 block text-[11px]">Forward Correct (Dₙ):</span>
            <span className="text-xl font-extrabold text-emerald-300">{forwardCorrectCount} / {simulationData.length}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-1">
            <span className="text-cyan-400 block text-[11px]">Rationalized (Dₙʳᵃᵗ):</span>
            <span className="text-xl font-extrabold text-cyan-300">+{rationalizedCount} Salvaged</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-1">
            <span className="text-amber-400 block text-[11px]">Total Fine-Tuning Accuracy:</span>
            <span className="text-xl font-extrabold text-amber-300">{accuracyPct}% Solve Rate</span>
          </div>
        </div>

        {/* Problem Card List */}
        <div className="space-y-4">
          {simulationData.map((problem) => {
            const iterState = problem.iterations[simIteration];

            return (
              <div 
                key={problem.id}
                className={`p-5 rounded-2xl border transition-all ${
                  iterState.forwardCorrect
                    ? 'bg-slate-950/80 border-emerald-500/40'
                    : 'bg-slate-950/90 border-cyan-500/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-mono font-bold text-amber-400">Problem #{problem.id}</span>
                    <h4 className="text-sm font-bold text-white">{problem.question}</h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {iterState.forwardCorrect ? (
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Forward Success (Dₙ)
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                        <HelpCircle className="h-3.5 w-3.5" /> Rationalized (Dₙʳᵃᵗ)
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 text-xs font-mono">
                  {/* Forward Rationale Box */}
                  <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                    iterState.forwardCorrect ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/30'
                  }`}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold uppercase tracking-wider text-slate-300">1. Forward Rationale Gen:</span>
                      <span className={iterState.forwardCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {iterState.forwardCorrect ? '✓ Correct' : '✗ Failed'}
                      </span>
                    </div>
                    <p className="text-slate-300 font-sans text-xs">{iterState.forwardRationale}</p>
                    <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                      Answer: <strong className="text-white">{iterState.forwardAnswer}</strong>
                    </div>
                  </div>

                  {/* Rationalization Box (If Forward Failed) */}
                  {!iterState.forwardCorrect && iterState.hintRationale && (
                    <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/40 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold uppercase tracking-wider text-cyan-300">2. Rationalization (Hint: {problem.correctAnswer}):</span>
                        <span className="text-cyan-400 font-bold">✓ Backwards Rationalized</span>
                      </div>
                      <p className="text-slate-300 font-sans text-xs">{iterState.hintRationale}</p>
                      <div className="text-[11px] text-cyan-300 pt-1 border-t border-cyan-500/30 font-semibold">
                        Added to Dₙʳᵃᵗ (Hint stripped for training!)
                      </div>
                    </div>
                  )}

                  {/* If Forward Passed directly */}
                  {iterState.forwardCorrect && (
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 flex flex-col justify-center text-slate-400 text-xs font-sans">
                      <p className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono">
                        <CheckCircle2 className="h-4 w-4" /> Direct Inclusion in Dₙ
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Model solved this problem autonomously forward without needing hint rationalization.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 7: RESEARCH PAPER REFERENCE */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-amber-400" /> ORIGINAL RESEARCH PAPER (STaR, NeurIPS 2022)
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              STaR: Bootstrapping Reasoning With Reasoning
            </h2>
            <p className="text-xs text-slate-300">
              Eric Zelikman, Yuxiang Wu, Jesse Mu, Noah D. Goodman — Stanford University
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
            <a
              href="https://arxiv.org/abs/2203.14465"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <ExternalLink className="h-4 w-4 text-amber-400" />
              <span>ArXiv Abstract</span>
            </a>

            <a
              href="https://arxiv.org/pdf/2203.14465"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 transition-all flex items-center gap-2"
            >
              <FileText className="h-4 w-4 text-amber-400" />
              <span>Open PDF (arXiv:2203.14465)</span>
            </a>
          </div>
        </div>

        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
          &quot;Generating rationale trajectories allows large language models to solve complex tasks, but generating rationales requires fine-tuning on large datasets of rationales. We present STaR (Self-Taught Reasoner), a technique that leverages a simple loop: generate rationales, filter those that lead to correct answers, and fine-tune on correct rationales. To solve problems the model fails on, we introduce rationalization—providing the answer as a hint to reason backwards—enabling continuous self-improvement.&quot;
        </div>
      </div>

      {/* LIGHTBOX MODAL FOR SCHEMATIC IMAGE */}
      {imageModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setImageModalOpen(false)}
        >
          <div 
            className="relative max-w-5xl w-full bg-slate-950 rounded-3xl border border-amber-500/50 p-6 space-y-4 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-400" /> Figure 1: STaR System Schematic Diagram
              </h3>
              <button 
                onClick={() => setImageModalOpen(false)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex justify-center bg-white p-4 rounded-2xl max-h-[75vh] overflow-auto border border-slate-700">
              <img 
                src={getAssetPath('/images/star_overview.png')} 
                alt="Figure 1: STaR System Schematic Diagram"
                className="w-auto h-auto max-h-[70vh] object-contain rounded"
              />
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed text-center">
              STaR outer loop fine-tuning architecture showing Rationale Generation, Correct Answer Filtering (<MathFormula math="\hat{y}_i = y_i" />), and Rationalization with Hint (<MathFormula math="\hat{y}_i \neq y_i" />).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
