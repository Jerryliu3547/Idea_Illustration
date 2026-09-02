"use client";

import React, { useState } from 'react';
import { MathFormula } from '@/components/ui/MathFormula';
import { 
  RefreshCw, 
  Sparkles, 
  Bookmark, 
  ArrowRight,
  Database,
  Zap,
  Brain,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Cpu,
  Layers,
  Activity,
  GitBranch,
  Clock,
  HardDrive
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export const LearningParadigmsVisualizer: React.FC = () => {
  const [selectedParadigm, setSelectedParadigm] = useState<'train' | 'test' | 'inference'>('test');
  const [taskScenario, setTaskScenario] = useState<'legal' | 'api' | 'math'>('legal');
  const [seqLength, setSeqLength] = useState<number>(32); // in k tokens
  const [latencyBudgetSec, setLatencyBudgetSec] = useState<number>(5);

  const scenarioDetails = {
    legal: {
      title: 'Analyze 50,000 Token Unseen Legal Contract',
      desc: 'Extremely long document with domain-specific clauses, requiring accurate query answering without hallucination or context degradation.',
    },
    api: {
      title: 'Adapt to Brand New Internal API Syntax',
      desc: 'Unlabeled code documentation for a proprietary SDK updated yesterday, requiring the model to write valid calls at runtime.',
    },
    math: {
      title: 'Solve Complex Olympiad Theorem Proof',
      desc: 'Multi-step mathematical reasoning problem requiring intensive state exploration and step-by-step verification.',
    },
  };

  const activeScenario = scenarioDetails[taskScenario];

  // Dynamic cost calculations based on selected paradigm and sliders
  const calculateMetrics = () => {
    if (selectedParadigm === 'train') {
      return {
        vramMB: 48000, // Full model + optimizer states
        latencyMs: 150, // Fast inference once trained
        paramDeltaMB: 14000, // Full 7B model parameters
        flopsG: 50000, // Massive offline FLOPs
        trainGradients: true,
        testGradients: false,
        kvCacheMB: 50, // Short query context
        accuracy: 72, // May overfit or miss specific document details
        setupTime: 'Hours / Days (Offline)',
      };
    } else if (selectedParadigm === 'test') {
      return {
        vramMB: Math.round(16000 + seqLength * 15), // Base model + LoRA gradients
        latencyMs: Math.round(800 + seqLength * 20), // Brief inner adaptation step then fast generation
        paramDeltaMB: 3.2, // Small LoRA adapter
        flopsG: Math.round(seqLength * 12), // Moderate test-time FLOPs
        trainGradients: false,
        testGradients: true,
        kvCacheMB: 60, // Short query context after adaptation
        accuracy: 94, // High precision on target document
        setupTime: '1 - 3 Seconds (Test Time)',
      };
    } else {
      // Inference-Time
      return {
        vramMB: Math.round(14000 + seqLength * 16.4), // Massive KV cache bloat
        latencyMs: Math.round(1200 + seqLength * 45), // Slower prompt processing
        paramDeltaMB: 0, // No parameter updates!
        flopsG: Math.round(seqLength * 35), // High prompt FLOPs every single query
        trainGradients: false,
        testGradients: false,
        kvCacheMB: Math.round(seqLength * 16.4), // Gigabytes of KV cache
        accuracy: Math.max(35, Math.round(85 - seqLength * 0.35)), // Lost in the middle decay
        setupTime: '0 Seconds (Instant Prompting)',
      };
    }
  };

  const metrics = calculateMetrics();

  // Benchmark comparison chart data across paradigms
  const benchmarkComparisonData = [
    { metric: 'Long-Doc QA Accuracy (%)', trainTime: 72, testTime: 92, inferenceTime: 65 },
    { metric: 'KV-Cache VRAM Efficiency (%)', trainTime: 95, testTime: 90, inferenceTime: 30 },
    { metric: 'Domain Adaptability (%)', trainTime: 85, testTime: 95, inferenceTime: 60 },
    { metric: 'Zero-Overhead Response Speed (%)', trainTime: 95, testTime: 75, inferenceTime: 40 },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold uppercase tracking-wider mb-1">
          <RefreshCw className="h-4 w-4" /> Comprehensive Learning Paradigms Taxonomy
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Train-Time vs. Test-Time vs. Inference-Time Learning
        </h1>
        <p className="text-slate-400 mt-2 text-base leading-relaxed">
          Understanding the three fundamental pillars of machine learning adaptation. Discover how static weight updates (<strong className="text-purple-300">Train-Time</strong>), dynamic parameter adaptation (<strong className="text-cyan-300">Test-Time</strong>), and zero-gradient context activation (<strong className="text-emerald-300">Inference-Time</strong>) trade off compute, memory, latency, and knowledge retention.
        </p>
      </div>

      {/* QUICK SECTION BOOKMARK NAVIGATION BAR */}
      <div className="sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border border-purple-500/40 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400">
          <Bookmark className="h-4 w-4 text-purple-400" />
          <span>Quick Section Navigation:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
          <button
            onClick={() => document.getElementById('section-paradigms')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span className="font-semibold truncate">1. 3 Pillars</span>
          </button>

          <button
            onClick={() => document.getElementById('section-simulator')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Sliders className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="font-semibold truncate">2. Cost Profiler</span>
          </button>

          <button
            onClick={() => document.getElementById('section-matrix')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Layers className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold truncate">3. Paradigm Matrix</span>
          </button>

          <button
            onClick={() => document.getElementById('section-math')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Brain className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold truncate">4. Math Equations</span>
          </button>

          <button
            onClick={() => document.getElementById('section-radar')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-rose-500/20 text-slate-200 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <TrendingUp className="h-3.5 w-3.5 text-rose-400 shrink-0" />
            <span className="font-semibold truncate">5. Trade-off Charts</span>
          </button>

          <button
            onClick={() => document.getElementById('section-guide')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-indigo-500/20 text-slate-200 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <GitBranch className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <span className="font-semibold truncate">6. Selection Guide</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: The Three Pillars Overview */}
      <div id="section-paradigms" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-purple-500/40 bg-gradient-to-br from-purple-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-purple-400" /> THE 3 PILLARS OF AI ADAPTATION
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Overview of Learning Paradigms
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Where and when model parameters or activations are modified during the AI deployment lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. Train-Time Learning */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-purple-500/40 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-bold text-purple-300 text-sm flex items-center gap-2">
                  <Database className="h-4 w-4 text-purple-400" /> 1. Train-Time Learning
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Pre-training / SFT / RLHF
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
                <p>• <strong className="text-white">Timing:</strong> Offline prior to deployment over static labeled datasets.</p>
                <p>• <strong className="text-purple-300 font-bold">Parameter Updates:</strong> Full model weight update (<MathFormula math="\nabla \theta_{\text{full}} \neq 0" />). Modifies millions or billions of weights.</p>
                <p>• <strong className="text-slate-400">Compute & Cost:</strong> Extremely high training compute ($10^5-10^8$ GPU hours). Frozen during query time.</p>
                <p>• <strong className="text-rose-400">Limitation:</strong> Inflexible to brand-new user documents or real-time context presented at test time.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-purple-300">
              <MathFormula math="\theta^* = \arg\min_\theta \mathbb{E}_{(x,y) \sim \mathcal{D}_{\text{train}}} [\mathcal{L}(y, f(x; \theta))]" block />
            </div>
          </div>

          {/* 2. Test-Time Learning */}
          <div className="bg-slate-950 p-6 rounded-2xl border-2 border-cyan-500/60 space-y-4 shadow-xl flex flex-col justify-between bg-cyan-950/10">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-bold text-cyan-300 text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-cyan-400" /> 2. Test-Time Learning (TTA / TTT)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                  PERK / TTT / Dynamic LoRA
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
                <p>• <strong className="text-white">Timing:</strong> At test time upon receiving an unlabeled long test context <MathFormula math="x_{\text{test}}" />.</p>
                <p>• <strong className="text-cyan-300 font-bold">Parameter Updates:</strong> Executes 1–5 fast gradient steps on a lightweight adapter (<MathFormula math="\theta_{\text{LoRA}}" />).</p>
                <p>• <strong className="text-cyan-300 font-bold">Key Benefit:</strong> Converts long un-indexed text into static weight memory, maintaining constant inference KV-cache size!</p>
                <p>• <strong className="text-slate-400">Overhead:</strong> Slight initial gradient setup latency (1–3s) per long document.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-300">
              <MathFormula math="\theta_{\text{test}} = \theta_0 - \eta \nabla_\theta \mathcal{L}_{\text{self-sup}}(x_{\text{test}}; \theta)" block />
            </div>
          </div>

          {/* 3. Inference-Time Learning */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/40 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-bold text-emerald-300 text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4 text-emerald-400" /> 3. Inference-Time Learning
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ICL / CoT / ToT / ReAct
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
                <p>• <strong className="text-white">Timing:</strong> During forward-pass token generation without changing weights.</p>
                <p>• <strong className="text-emerald-300 font-bold">Zero Parameter Updates:</strong> Parameters are completely frozen (<MathFormula math="\nabla \theta = 0" />).</p>
                <p>• <strong className="text-slate-400">Mechanism:</strong> Leverages prompt tokens, KV-cache context expansion, or sampling search trees (CoT/ToT).</p>
                <p>• <strong className="text-rose-400">Limitation:</strong> High prompt token cost, KV cache memory explosion, and position decay.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300">
              <MathFormula math="P(y \mid x) = \prod_{t=1}^T P_\theta(y_t \mid y_{<t}, x_{\text{prompt}})" block />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Interactive Paradigm Computational Profiler & Cost Simulator */}
      <div id="section-simulator" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-cyan-400" /> INTERACTIVE COMPUTATIONAL COST PROFILER
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Paradigm Resource & Latency Simulator
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Select a deployment scenario and toggle between paradigms to analyze GPU VRAM, parameter changes, FLOPs, and accuracy!
            </p>
          </div>

          {/* Paradigm Selection Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setSelectedParadigm('train')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedParadigm === 'train' ? 'bg-purple-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Train-Time SFT
            </button>
            <button
              onClick={() => setSelectedParadigm('test')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedParadigm === 'test' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              Test-Time TTA (PERK) ✔️
            </button>
            <button
              onClick={() => setSelectedParadigm('inference')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedParadigm === 'inference' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Inference Prompting
            </button>
          </div>
        </div>

        {/* Task Scenario Selector & Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono">
          <div className="space-y-1.5">
            <label className="text-slate-400 font-bold block text-[11px]">Task Scenario:</label>
            <select
              value={taskScenario}
              onChange={(e) => setTaskScenario(e.target.value as 'legal' | 'api' | 'math')}
              className="w-full bg-slate-900 text-slate-200 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="legal">50k Unseen Legal Document</option>
              <option value="api">Dynamic API SDK Adaption</option>
              <option value="math">Complex Multi-Step Math Proof</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="text-slate-400 font-bold text-[11px]">Input Context Tokens:</label>
              <span className="text-cyan-400 font-bold">{seqLength}k tokens</span>
            </div>
            <input
              type="range"
              min={4}
              max={128}
              step={4}
              value={seqLength}
              onChange={(e) => setSeqLength(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="text-slate-400 font-bold text-[11px]">Latency SLA Target:</label>
              <span className="text-purple-400 font-bold">{latencyBudgetSec}s</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={latencyBudgetSec}
              onChange={(e) => setLatencyBudgetSec(Number(e.target.value))}
              className="w-full accent-purple-400 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Live Computational Output Profile */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" /> Active Profile: {selectedParadigm.toUpperCase()}-TIME LEARNING
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-cyan-300 border border-slate-800">
              {activeScenario.title}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                <HardDrive className="h-3.5 w-3.5 text-cyan-400" /> GPU VRAM Footprint
              </span>
              <span className="text-xl font-bold text-white">{metrics.vramMB} MB</span>
              <span className="text-[10px] text-slate-400 block font-sans">KV Cache: {metrics.kvCacheMB} MB</span>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                <GitBranch className="h-3.5 w-3.5 text-purple-400" /> Parameter Delta (Δθ)
              </span>
              <span className="text-xl font-bold text-purple-300">{metrics.paramDeltaMB} MB</span>
              <span className="text-[10px] text-slate-400 block font-sans">
                {metrics.testGradients ? 'Test-Time LoRA' : metrics.trainGradients ? 'Full Model' : 'Zero Updates (Frozen)'}
              </span>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-amber-400" /> Latency Overhead
              </span>
              <span className="text-xl font-bold text-amber-300">{metrics.latencyMs} ms</span>
              <span className="text-[10px] text-slate-400 block font-sans">Setup: {metrics.setupTime}</span>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> Estimated Accuracy
              </span>
              <span className="text-xl font-bold text-emerald-400">{metrics.accuracy}%</span>
              <span className="text-[10px] text-slate-400 block font-sans">
                {metrics.accuracy > 85 ? 'High Precision' : 'Decays with Length'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Side-by-Side Comparison Matrix */}
      <div id="section-matrix" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-emerald-400" /> COMPREHENSIVE PARADIGM MATRIX
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Side-by-Side Comparison Matrix
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Systematic evaluation of key trade-offs across Train-Time, Test-Time, and Inference-Time adaptation.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-200">
                <th className="p-3 font-bold uppercase text-[11px]">Feature / Dimension</th>
                <th className="p-3 font-bold uppercase text-[11px] text-purple-400">Train-Time Learning</th>
                <th className="p-3 font-bold uppercase text-[11px] text-cyan-400">Test-Time Learning (TTA)</th>
                <th className="p-3 font-bold uppercase text-[11px] text-emerald-400">Inference-Time (ICL)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-mono font-bold text-slate-200">Gradient Calculation (<MathFormula math="\nabla \theta" />)</td>
                <td className="p-3 text-purple-300 font-mono">Yes (<MathFormula math="\nabla \theta_{\text{full}} \neq 0" />)</td>
                <td className="p-3 text-cyan-300 font-mono">Yes (<MathFormula math="\nabla \theta_{\text{LoRA}} \neq 0" />)</td>
                <td className="p-3 text-emerald-300 font-mono">No (<MathFormula math="\nabla \theta = 0" />)</td>
              </tr>

              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-mono font-bold text-slate-200">When Adaptation Occurs</td>
                <td className="p-3">Offline prior to deployment</td>
                <td className="p-3 font-bold text-white">At test time upon context receipt</td>
                <td className="p-3">Forward pass during query prompt</td>
              </tr>

              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-mono font-bold text-slate-200">Parameter Modification</td>
                <td className="p-3 text-purple-300 font-mono">Full model parameters (<MathFormula math="100\%" />)</td>
                <td className="p-3 text-cyan-300 font-mono">Parameter-efficient LoRA (&lt;0.1%)</td>
                <td className="p-3 text-emerald-300 font-mono">Zero weight changes (0%)</td>
              </tr>

              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-mono font-bold text-slate-200">KV-Cache Memory Scaling</td>
                <td className="p-3 text-emerald-400 font-mono">Constant <MathFormula math="O(1)" /></td>
                <td className="p-3 text-emerald-400 font-mono font-bold">Constant <MathFormula math="O(1)" /></td>
                <td className="p-3 text-rose-400 font-mono">Linear <MathFormula math="O(N)" /> (Memory Bloat)</td>
              </tr>

              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-mono font-bold text-slate-200">Long Document Robustness</td>
                <td className="p-3">Moderate (risk of hallucination)</td>
                <td className="p-3 font-bold text-cyan-300">Exceptional (+20% vs baselines)</td>
                <td className="p-3 text-rose-400">Poor (Lost in the middle decay)</td>
              </tr>

              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-mono font-bold text-slate-200">Primary Compute Bottleneck</td>
                <td className="p-3">Offline GPU Cluster Training</td>
                <td className="p-3">Initial 1–3s test gradient step</td>
                <td className="p-3">High prompt FLOPs per query</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: Mathematical & Formal Taxonomy */}
      <div id="section-math" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Brain className="h-4 w-4 text-amber-400" /> FORMAL MATHEMATICAL TAXONOMY
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Mathematical Equations & Loss Objectives
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Comparing optimization formulations across all three learning paradigms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-mono">
          <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-3 shadow-xl">
            <span className="text-purple-400 font-bold block uppercase text-xs">Train-Time ERM Objective</span>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <MathFormula math="\min_\theta \frac{1}{|\mathcal{D}|} \sum_{i=1}^{|\mathcal{D}|} \mathcal{L}_{\text{task}}(y_i, f(x_i; \theta))" block />
            </div>
            <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
              Supervised empirical risk minimization over static offline training pairs <MathFormula math="(x_i, y_i)" />.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3 shadow-xl">
            <span className="text-cyan-400 font-bold block uppercase text-xs">Test-Time Gradient Update</span>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <MathFormula math="\theta_{\text{test}} = \theta_0 - \eta \nabla_\theta \mathcal{L}_{\text{self-sup}}(x_{\text{test}}; \theta_0)" block />
            </div>
            <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
              Gradient step calculated on unlabeled test context <MathFormula math="x_{\text{test}}" /> prior to generating downstream output.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3 shadow-xl">
            <span className="text-emerald-400 font-bold block uppercase text-xs">Inference Context Sampling</span>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <MathFormula math="y^* = \arg\max_y \prod_{t=1}^T P_{\theta_{\text{frozen}}}(y_t \mid y_{<t}, x_{\text{context}})" block />
            </div>
            <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
              Autoregressive token generation conditioned purely on prompt context tokens with frozen weights <MathFormula math="\theta_{\text{frozen}}" />.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5: Trade-off Bar Chart */}
      <div id="section-radar" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-rose-500/40 bg-gradient-to-br from-rose-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-rose-400" /> MULTI-DIMENSIONAL TRADE-OFF ANALYSIS
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Performance & Efficiency Trade-offs
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Comparing accuracy, VRAM efficiency, domain adaptability, and response speed across paradigms.
          </p>
        </div>

        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <span className="text-xs font-mono font-bold text-cyan-300 block">
            Multi-Metric Paradigm Comparison Score (0–100%):
          </span>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={benchmarkComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="metric" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="trainTime" name="Train-Time SFT" fill="#a855f7" />
                <Bar dataKey="testTime" name="Test-Time TTA (PERK)" fill="#06b6d4" />
                <Bar dataKey="inferenceTime" name="Inference Prompting" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 6: Practical Paradigm Selection Guide */}
      <div id="section-guide" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-indigo-500/40 bg-gradient-to-br from-indigo-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <GitBranch className="h-4 w-4 text-indigo-400" /> PRACTICAL DEPLOYMENT GUIDELINE
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            When to Use Which Learning Paradigm
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Rules of thumb for choosing between Train-Time, Test-Time, and Inference-Time adaptation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-sans">
          <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/40 space-y-3 shadow-xl">
            <span className="font-mono font-bold text-purple-400 uppercase text-xs block">Choose Train-Time SFT When:</span>
            <ul className="text-slate-300 space-y-2 leading-relaxed list-disc list-inside">
              <li>You have massive labeled training datasets ($10,000+$ pairs).</li>
              <li>You need general style alignment, formatting rules, or instruction following.</li>
              <li>Queries do not depend on long external documents presented at runtime.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border-2 border-cyan-500/60 space-y-3 shadow-xl bg-cyan-950/10">
            <span className="font-mono font-bold text-cyan-300 uppercase text-xs block">Choose Test-Time Adaptation (TTA) When:</span>
            <ul className="text-slate-300 space-y-2 leading-relaxed list-disc list-inside">
              <li>Users upload massive 32k–128k token context documents at test time.</li>
              <li>Prompt KV-cache costs or attention lost-in-the-middle degradation are unacceptable.</li>
              <li>You want high reasoning accuracy over novel, unseen text with constant GPU memory.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3 shadow-xl">
            <span className="font-mono font-bold text-emerald-400 uppercase text-xs block">Choose Inference Prompting When:</span>
            <ul className="text-slate-300 space-y-2 leading-relaxed list-disc list-inside">
              <li>Context is short (&lt;4,000 tokens) and standard zero-shot prompting suffices.</li>
              <li>Zero latency overhead prior to token generation is strictly required.</li>
              <li>Multi-step chain-of-thought (CoT) or tool execution (ReAct) is needed without parameter updates.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
