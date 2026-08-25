"use client";

import React, { useState } from 'react';
import { MathFormula } from '@/components/ui/MathFormula';
import { 
  Database, 
  Brain, 
  ThumbsUp, 
  Sliders, 
  Play, 
  RotateCcw,
  Sparkles,
  Zap,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const RLHFPipelineVisualizer: React.FC = () => {
  const [activeStage, setActiveStage] = useState<1 | 2 | 3>(1);
  const [simulating, setSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const prompt = "Explain quantum computing to a 10-year-old in one sentence.";
  const responses = [
    { id: 'A', text: "Quantum computing uses qubit superpositions to process complex parallel calculations instantly like magic coin flips.", score: 0.92, label: "Preferred (High Clarity)" },
    { id: 'B', text: "It solves linear equations over Hilbert vector spaces with non-Boolean logic gates.", score: 0.15, label: "Dispreferred (Overly Jargon)" },
  ];

  const handleRunSimulation = () => {
    setSimulating(true);
    setSimStep(0);
    const interval = setInterval(() => {
      setSimStep((prev) => {
        if (prev >= 3) {
          clearInterval(interval);
          setSimulating(false);
          return 3;
        }
        return prev + 1;
      });
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold uppercase tracking-wider mb-1">
          <Layers className="h-4 w-4" /> End-to-End Alignment Framework
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          RLHF (Reinforcement Learning from Human Feedback)
        </h1>
        <p className="text-slate-400 mt-2 text-base leading-relaxed">
          RLHF aligns Large Language Models with human values (helpfulness, honesty, harmlessness) through a 3-phase training strategy combining supervised pre-tuning, preference reward modeling, and reinforcement policy optimization.
        </p>
      </div>

      {/* Stage Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stage 1 */}
        <button
          onClick={() => setActiveStage(1)}
          className={`text-left p-5 rounded-2xl border transition-all relative overflow-hidden ${
            activeStage === 1
              ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold">
              STAGE 1
            </span>
            <Database className="h-5 w-5 text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Supervised Fine-Tuning (SFT)</h3>
          <p className="text-xs text-slate-400">
            Train base model on high-quality curated prompt & response demonstration datasets.
          </p>
        </button>

        {/* Stage 2 */}
        <button
          onClick={() => setActiveStage(2)}
          className={`text-left p-5 rounded-2xl border transition-all relative overflow-hidden ${
            activeStage === 2
              ? 'bg-purple-500/10 border-purple-500/50 shadow-lg shadow-purple-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold">
              STAGE 2
            </span>
            <ThumbsUp className="h-5 w-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Reward Model (RM) Training</h3>
          <p className="text-xs text-slate-400 flex items-center gap-1 flex-wrap">
            Train scalar reward model on human preferences <MathFormula math="y_w \succ y_l" />.
          </p>
        </button>

        {/* Stage 3 */}
        <button
          onClick={() => setActiveStage(3)}
          className={`text-left p-5 rounded-2xl border transition-all relative overflow-hidden ${
            activeStage === 3
              ? 'bg-indigo-500/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
              STAGE 3
            </span>
            <Sliders className="h-5 w-5 text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">RL Policy Optimization (PPO)</h3>
          <p className="text-xs text-slate-400">
            Optimize LLM policy with PPO using RM scalar scores & KL penalty relative to SFT model.
          </p>
        </button>
      </div>

      {/* Stage Detail Display & Diagram */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="glass-panel rounded-2xl p-6 space-y-6"
        >
          {activeStage === 1 && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Database className="h-5 w-5 text-amber-400" /> Stage 1: Supervised Fine-Tuning (SFT)
                  </h2>
                  <p className="text-sm text-slate-300 mt-1">
                    Takes a raw Base LLM (pretrained on raw text) and fine-tunes it on prompt-response pairs written by human experts to teach the model conversational formatting.
                  </p>
                </div>
              </div>

              {/* Math Formula */}
              <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  SFT Objective Function (Standard Cross-Entropy Loss)
                </span>
                <MathFormula 
                  math="\mathcal{L}_{\text{SFT}}(\theta) = -\sum_{(x,y)} \sum_{t=1}^{|y|} \log \pi_\theta(y_t \mid x, y_{<t})" 
                  block 
                />
              </div>

              {/* Interactive Demo */}
              <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" /> Interactive Sample Data Flow
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                    <span className="text-xs text-amber-400 font-semibold uppercase block mb-1">Input Prompt (x)</span>
                    <p className="text-slate-200 italic">&quot;{prompt}&quot;</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                    <span className="text-xs text-emerald-400 font-semibold uppercase block mb-1">Human Demonstrator Target Output (y)</span>
                    <p className="text-slate-200">&quot;Quantum computers use special bits called qubits that can be 0 and 1 at the exact same time.&quot;</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStage === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-purple-400" /> Stage 2: Reward Model (RM) Training
                </h2>
                <p className="text-sm text-slate-300 mt-1">
                  Human annotators rank multiple LLM generated responses for a given prompt. The Reward Model learns to output a scalar score <MathFormula math="R_\phi(x, y) \in \mathbb{R}" /> representing human preference quality.
                </p>
              </div>

              {/* Math Formula */}
              <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Bradley-Terry Preference Loss Formula
                </span>
                <MathFormula 
                  math="\mathcal{L}_{\text{RM}}(\phi) = -\mathbb{E}_{(x, y_w, y_l)} \left[ \log \sigma \left( R_\phi(x, y_w) - R_\phi(x, y_l) \right) \right]" 
                  block 
                />
                <p className="text-xs text-slate-400 mt-2">
                  Where <MathFormula math="y_w" /> is the human-preferred response, <MathFormula math="y_l" /> is the dispreferred response, and <MathFormula math="\sigma" /> is the sigmoid function.
                </p>
              </div>

              {/* Pairwise Comparison Interactive View */}
              <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-purple-400" /> Pairwise Human Preference Sample
                </h4>
                <div className="space-y-3 text-sm">
                  {responses.map((resp) => (
                    <div 
                      key={resp.id}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        resp.score > 0.5 
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100'
                          : 'bg-rose-950/20 border-rose-500/40 text-rose-100'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          resp.score > 0.5 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {resp.label}
                        </span>
                        <p className="text-sm mt-1">&quot;{resp.text}&quot;</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-xs text-slate-400 block">Reward Model Score</span>
                        <span className={`text-lg font-mono font-bold ${
                          resp.score > 0.5 ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {resp.score > 0.5 ? `+${resp.score.toFixed(2)}` : `-${Math.abs(1 - resp.score).toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeStage === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-indigo-400" /> Stage 3: RL Policy Optimization (PPO Loop)
                </h2>
                <p className="text-sm text-slate-300 mt-1">
                  The SFT model becomes the RL Policy <MathFormula math="\pi_\theta" />. The policy generates tokens, the Reward Model scores them, and PPO updates the policy weights while constraining token drift using a KL penalty relative to the initial SFT policy <MathFormula math="\pi_{\text{ref}}" />.
                </p>
              </div>

              {/* Combined Total Reward Formula */}
              <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Combined Policy Reward Function (with KL Penalty)
                </span>
                <MathFormula 
                  math="R(x, y) = R_\phi(x, y) - \beta D_{\text{KL}}\left(\pi_\theta(y \mid x) \parallel \pi_{\text{ref}}(y \mid x)\right)" 
                  block 
                />
              </div>

              {/* Interactive Pipeline Simulator */}
              <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-indigo-400" /> Live Interactive PPO RL Iteration Step
                  </h4>
                  <button
                    onClick={handleRunSimulation}
                    disabled={simulating}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {simulating ? <RotateCcw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-white" />}
                    {simulating ? 'Simulating RL Step...' : 'Run RL Iteration'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
                  <div className={`p-4 rounded-xl border transition-all ${
                    simStep >= 0 ? 'bg-indigo-950/30 border-indigo-500/50' : 'bg-slate-950 border-slate-800 text-slate-600'
                  }`}>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold block mb-1">STEP 1: PROMPT</span>
                    <p className="text-xs text-slate-300 font-medium">&quot;Explain gravity simply&quot;</p>
                  </div>

                  <div className={`p-4 rounded-xl border transition-all ${
                    simStep >= 1 ? 'bg-indigo-950/30 border-indigo-500/50' : 'bg-slate-950 border-slate-800 text-slate-600'
                  }`}>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold block mb-1">STEP 2: POLICY GENERATION</span>
                    <p className="text-xs text-slate-300 flex items-center gap-1">Policy <MathFormula math="\pi_\theta" /> outputs token sequence.</p>
                  </div>

                  <div className={`p-4 rounded-xl border transition-all ${
                    simStep >= 2 ? 'bg-purple-950/30 border-purple-500/50' : 'bg-slate-950 border-slate-800 text-slate-600'
                  }`}>
                    <span className="text-[10px] font-mono text-purple-400 font-bold block mb-1">STEP 3: RM SCORING</span>
                    <p className="text-xs text-emerald-400 font-mono font-bold">{simStep >= 2 ? 'Score = +0.88' : 'Waiting...'}</p>
                  </div>

                  <div className={`p-4 rounded-xl border transition-all ${
                    simStep >= 3 ? 'bg-cyan-950/30 border-cyan-500/50' : 'bg-slate-950 border-slate-800 text-slate-600'
                  }`}>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold block mb-1">STEP 4: PPO UPDATE</span>
                    <p className="text-xs text-slate-300">{simStep >= 3 ? 'Weights updated with clipped ratio' : 'Waiting...'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Summary Box */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> Key Takeaway
          </h4>
          <p className="text-xs text-slate-400">
            RLHF transforms raw next-token predictors into helpful, aligned assistants by replacing hardcoded rule sets with human preference models.
          </p>
        </div>
      </div>
    </div>
  );
};
