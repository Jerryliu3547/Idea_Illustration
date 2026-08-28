"use client";

import React, { useState, useMemo } from 'react';
import { MathFormula } from '@/components/ui/MathFormula';
import { 
  Sliders, 
  Flame, 
  Bookmark, 
  ArrowUp, 
  Sparkles, 
  Cpu, 
  Zap, 
  BarChart3, 
  Layers, 
  GraduationCap, 
  GitMerge, 
  Scale, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  Database,
  Network,
  Split,
  Eye,
  AlertTriangle,
  Lightbulb,
  Workflow,
  GitBranch,
  Layers3,
  ArrowRight,
  Filter,
  HardDrive,
  Server,
  Minimize2,
  Video,
  Play,
  ExternalLink,
  BookOpen,
  FileText
} from 'lucide-react';

interface ModelPreset {
  id: string;
  name: string;
  params: string;
  vramGB: number;
  latencyMs: number;
  tokensPerSec: number;
  benchmarkScore: number;
  color: string;
}

const TEACHER_MODELS: ModelPreset[] = [
  {
    id: 'deepseek-671b',
    name: 'DeepSeek-R1 (Teacher)',
    params: '671B MoE',
    vramGB: 1340,
    latencyMs: 140,
    tokensPerSec: 18,
    benchmarkScore: 90.8,
    color: 'border-purple-500/40 text-purple-400',
  },
  {
    id: 'llama-405b',
    name: 'Llama-3.1 405B (Teacher)',
    params: '405B Dense',
    vramGB: 810,
    latencyMs: 115,
    tokensPerSec: 22,
    benchmarkScore: 88.6,
    color: 'border-cyan-500/40 text-cyan-400',
  },
  {
    id: 'llama-70b',
    name: 'Llama-3.3 70B (Teacher)',
    params: '70B Dense',
    vramGB: 140,
    latencyMs: 45,
    tokensPerSec: 55,
    benchmarkScore: 82.1,
    color: 'border-blue-500/40 text-blue-400',
  },
];

const STUDENT_MODELS: ModelPreset[] = [
  {
    id: 'distill-14b',
    name: 'DeepSeek-R1-Distill-14B (Student)',
    params: '14B Dense',
    vramGB: 28,
    latencyMs: 16,
    tokensPerSec: 125,
    benchmarkScore: 80.0,
    color: 'border-emerald-500/40 text-emerald-400',
  },
  {
    id: 'distill-8b',
    name: 'DeepSeek-R1-Distill-8B (Student)',
    params: '8B Dense',
    vramGB: 16,
    latencyMs: 9,
    tokensPerSec: 210,
    benchmarkScore: 77.5,
    color: 'border-amber-500/40 text-amber-400',
  },
  {
    id: 'distill-1.5b',
    name: 'DeepSeek-R1-Distill-1.5B (Student)',
    params: '1.5B Dense',
    vramGB: 3.5,
    latencyMs: 3.5,
    tokensPerSec: 480,
    benchmarkScore: 70.2,
    color: 'border-rose-500/40 text-rose-400',
  },
];

export const KnowledgeDistillationVisualizer: React.FC = () => {
  // --- STATE FOR SECTION 2: MNIST DARK KNOWLEDGE & TEMP DEMO ---
  const [mnistTemp, setMnistTemp] = useState<number>(4.0);
  const [activeLabelTab, setActiveLabelTab] = useState<'hard' | 'soft-t1' | 'soft-temp'>('soft-temp');

  // --- STATE FOR SECTION 3: INDUSTRY ADAPTATION STAGES ---
  const [activeStageFilter, setActiveStageFilter] = useState<'all' | 'pretraining' | 'posttraining' | 'multistage'>('all');

  // --- STATE FOR SECTION 4: TOP-K VOCABULARY TRUNCATION SIMULATOR ---
  const [vocabSize, setVocabSize] = useState<number>(128256); // Llama 3 Vocab Size
  const [topK, setTopK] = useState<number>(256); // Default Top-256 subset
  const [batchSizeVocab, setBatchSizeVocab] = useState<number>(16);
  const [seqLenVocab, setSeqLenVocab] = useState<number>(2048);

  // MNIST Digit logits for an ambiguous handwritten "5" (that looks like a "3" and "6")
  const mnistRawLogits = useMemo(() => [
    -2.5,  // Digit 0
    -3.2,  // Digit 1
    -1.1,  // Digit 2
    3.8,   // Digit 3 (Strong visual similarity to 5!)
    -2.0,  // Digit 4
    8.5,   // Digit 5 (Target class)
    2.2,   // Digit 6 (Moderate visual similarity)
    -0.8,  // Digit 7
    0.5,   // Digit 8
    -1.5,  // Digit 9
  ], []);

  // Compute Hard Label One-Hot
  const mnistHardProbs = useMemo(() => {
    return [0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0];
  }, []);

  // Compute Softmax at T = 1.0 (Unscaled Teacher)
  const mnistSoftProbsT1 = useMemo(() => {
    const maxVal = Math.max(...mnistRawLogits);
    const exps = mnistRawLogits.map(z => Math.exp(z - maxVal));
    const sumExps = exps.reduce((a, b) => a + b, 0);
    return exps.map(v => v / sumExps);
  }, [mnistRawLogits]);

  // Compute Softmax at Variable Temperature T
  const mnistSoftProbsTemp = useMemo(() => {
    const scaled = mnistRawLogits.map(z => z / mnistTemp);
    const maxVal = Math.max(...scaled);
    const exps = scaled.map(z => Math.exp(z - maxVal));
    const sumExps = exps.reduce((a, b) => a + b, 0);
    return exps.map(v => v / sumExps);
  }, [mnistRawLogits, mnistTemp]);

  // Calculations for Top-K Vocab Truncation
  const fullVocabPayloadMB = useMemo(() => {
    // 4 bytes per logit (float32) * vocabSize
    return (vocabSize * 4) / 1024 / 1024;
  }, [vocabSize]);

  const topKPayloadMB = useMemo(() => {
    // 4 bytes logit + 4 bytes index = 8 bytes per K element
    return (topK * 8) / 1024 / 1024;
  }, [topK]);

  const totalBatchFullGB = useMemo(() => {
    return (fullVocabPayloadMB * batchSizeVocab * seqLenVocab) / 1024;
  }, [fullVocabPayloadMB, batchSizeVocab, seqLenVocab]);

  const totalBatchTopKGB = useMemo(() => {
    return (topKPayloadMB * batchSizeVocab * seqLenVocab) / 1024;
  }, [topKPayloadMB, batchSizeVocab, seqLenVocab]);

  const payloadSavingsPercent = useMemo(() => {
    return (1 - (topKPayloadMB / fullVocabPayloadMB)) * 100;
  }, [topKPayloadMB, fullVocabPayloadMB]);

  const massRetainedPercent = useMemo(() => {
    if (topK >= vocabSize) return 100.0;
    if (topK >= 1024) return 99.999;
    if (topK >= 512) return 99.99;
    if (topK >= 256) return 99.91;
    if (topK >= 128) return 99.55;
    if (topK >= 64) return 98.60;
    if (topK >= 16) return 94.20;
    return 85.0;
  }, [topK, vocabSize]);

  // --- STATE FOR SECTION 5: LIVE LOGIT SANDBOX ---
  const tokenLabels = [
    "Token A (\"intelligence\")",
    "Token B (\"learning\")",
    "Token C (\"reasoning\")",
    "Token D (\"banana\")",
  ];

  // Teacher logits z_T and Student logits z_S
  const [teacherLogits, setTeacherLogits] = useState<number[]>([4.2, 2.8, 1.5, -2.0]);
  const [studentLogits, setStudentLogits] = useState<number[]>([2.1, 2.5, 0.8, -0.5]);

  const [temp, setTemp] = useState<number>(2.0); // Temperature T
  const [alpha, setAlpha] = useState<number>(0.7); // Loss blend alpha
  const [targetTokenIdx, setTargetTokenIdx] = useState<number>(0); // Token A as ground truth

  // Compute Teacher probabilities (Hard T=1 & Soft T)
  const teacherSoftProbs = useMemo(() => {
    const scaled = teacherLogits.map(z => z / temp);
    const maxVal = Math.max(...scaled);
    const exps = scaled.map(z => Math.exp(z - maxVal));
    const sumExps = exps.reduce((a, b) => a + b, 0);
    return exps.map(v => v / sumExps);
  }, [teacherLogits, temp]);

  // Compute Student probabilities (Hard T=1 & Soft T)
  const studentSoftProbs = useMemo(() => {
    const scaled = studentLogits.map(z => z / temp);
    const maxVal = Math.max(...scaled);
    const exps = scaled.map(z => Math.exp(z - maxVal));
    const sumExps = exps.reduce((a, b) => a + b, 0);
    return exps.map(v => v / sumExps);
  }, [studentLogits, temp]);

  const studentHardProbs = useMemo(() => {
    const maxVal = Math.max(...studentLogits);
    const exps = studentLogits.map(z => Math.exp(z - maxVal));
    const sumExps = exps.reduce((a, b) => a + b, 0);
    return exps.map(v => v / sumExps);
  }, [studentLogits]);

  // Loss Calculations
  const ceLoss = useMemo(() => {
    const pTarget = Math.max(studentHardProbs[targetTokenIdx], 1e-7);
    return -Math.log(pTarget);
  }, [studentHardProbs, targetTokenIdx]);

  const klDiv = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < teacherSoftProbs.length; i++) {
      const pT = Math.max(teacherSoftProbs[i], 1e-7);
      const pS = Math.max(studentSoftProbs[i], 1e-7);
      sum += pT * Math.log(pT / pS);
    }
    return Math.max(sum, 0);
  }, [teacherSoftProbs, studentSoftProbs]);

  const scaledSoftLoss = useMemo(() => klDiv * temp * temp, [klDiv, temp]);

  const totalKdLoss = useMemo(() => {
    return (1 - alpha) * ceLoss + alpha * scaledSoftLoss;
  }, [alpha, ceLoss, scaledSoftLoss]);

  // --- STATE FOR SECTION 6: FORWARD vs REVERSE KL ---
  const [klMode, setKlMode] = useState<'forward' | 'reverse'>('reverse');

  // --- STATE FOR SECTION 7: EFFICIENCY BENCHMARK SIMULATOR ---
  const [selectedTeacher, setSelectedTeacher] = useState<ModelPreset>(TEACHER_MODELS[0]);
  const [selectedStudent, setSelectedStudent] = useState<ModelPreset>(STUDENT_MODELS[1]);
  const [batchSize, setBatchSize] = useState<number>(4);

  const updateTeacherLogit = (idx: number, val: number) => {
    const copy = [...teacherLogits];
    copy[idx] = val;
    setTeacherLogits(copy);
  };

  const updateStudentLogit = (idx: number, val: number) => {
    const copy = [...studentLogits];
    copy[idx] = val;
    setStudentLogits(copy);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-rose-400 text-sm font-semibold uppercase tracking-wider mb-1">
          <GraduationCap className="h-4 w-4" /> LLM Model Compression & Alignment Transfer
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Knowledge Distillation (KD) Visualizer
        </h1>
        <p className="text-slate-400 mt-2 text-base leading-relaxed">
          Knowledge Distillation transfers dark knowledge, structural representations, and reasoning capabilities from a high-capacity <span className="text-purple-300 font-semibold">Teacher Model</span> (e.g., DeepSeek-R1 671B or Llama-3 405B) to a compact, high-throughput <span className="text-emerald-300 font-semibold">Student Model</span> (e.g., 8B / 1.5B).
        </p>
      </div>

      {/* QUICK SECTION BOOKMARK NAVIGATION BAR */}
      <div className="sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border border-rose-500/40 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400">
          <Bookmark className="h-4 w-4 text-rose-400" />
          <span>Quick Section Bookmarks:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono">
          <button
            onClick={() => document.getElementById('section-formula')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-rose-500/20 text-slate-200 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <MathFormula math="\mathcal{L}_{\text{KD}}" />
            <span className="font-semibold truncate">1. Loss & Math Formulation</span>
          </button>

          <button
            onClick={() => document.getElementById('section-mnist-dark-knowledge')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Lightbulb className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="font-semibold truncate">2. Dark Knowledge (MNIST 5 vs 3)</span>
          </button>

          <button
            onClick={() => document.getElementById('section-adaptation-stages')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Workflow className="h-4 w-4 text-cyan-400 shrink-0" />
            <span className="font-semibold truncate">3. Industry Adaptation Stages</span>
          </button>

          <button
            onClick={() => document.getElementById('section-topk-vocab')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Filter className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="font-semibold truncate">4. Top-256 Vocab Subsetting</span>
          </button>

          <button
            onClick={() => document.getElementById('section-simulator')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Sliders className="h-4 w-4 text-purple-400 shrink-0" />
            <span className="font-semibold truncate">5. Logit & Temp Sandbox</span>
          </button>

          <button
            onClick={() => document.getElementById('section-kl-modes')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-blue-500/20 text-slate-200 hover:text-blue-300 border border-slate-800 hover:border-blue-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Split className="h-4 w-4 text-blue-400 shrink-0" />
            <span className="font-semibold truncate">6. Forward vs Reverse KL</span>
          </button>

          <button
            onClick={() => document.getElementById('section-efficiency')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-pink-500/20 text-slate-200 hover:text-pink-300 border border-slate-800 hover:border-pink-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Zap className="h-4 w-4 text-pink-400 shrink-0" />
            <span className="font-semibold truncate">7. Hardware Efficiency</span>
          </button>

          <button
            onClick={() => document.getElementById('section-video')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-red-500/20 text-slate-200 hover:text-red-300 border border-slate-800 hover:border-red-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Video className="h-4 w-4 text-red-400 shrink-0" />
            <span className="font-semibold truncate">8. Video Lecture</span>
          </button>

          <button
            onClick={() => document.getElementById('section-papers')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-indigo-500/20 text-slate-200 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <BookOpen className="h-4 w-4 text-indigo-400 shrink-0" />
            <span className="font-semibold truncate">9. Foundational Papers</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Loss Formulations */}
      <div id="section-formula" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-rose-500/40 bg-gradient-to-br from-rose-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-rose-400" /> MATHEMATICAL FORMULATION
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Knowledge Distillation Loss & Temperature Scaling
          </h2>
        </div>

        {/* Math formula highlight */}
        <div className="bg-slate-950/90 p-5 rounded-2xl border border-rose-500/30 space-y-4">
          <div className="py-3 px-4 bg-slate-900 rounded-xl border border-rose-500/30 text-center font-mono text-rose-300 text-base sm:text-lg">
            <MathFormula math="\mathcal{L}_{\text{KD}} = (1 - \alpha) \mathcal{L}_{\text{CE}}(y, P_S) + \alpha \cdot T^2 \cdot D_{\text{KL}}\left(P_T^T \parallel P_S^T\right)" block />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            The total distillation objective blends standard hard ground-truth Cross-Entropy loss <MathFormula math="\mathcal{L}_{\text{CE}}" /> with soft-target KL Divergence <MathFormula math="D_{\text{KL}}" /> matching the Teacher&apos;s output probability distribution softened at temperature <MathFormula math="T" />.
          </p>
        </div>

        {/* 3 Core Components Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
            <span className="text-amber-400 font-bold block flex items-center gap-1.5">
              <Flame className="h-4 w-4" /> 1. Temperature Scaling (T)
            </span>
            <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
              <MathFormula math="P_i^T = \frac{\exp(z_i / T)}{\sum_j \exp(z_j / T)}" />
            </div>
            <p className="text-slate-300 font-sans leading-normal">
              Dividing raw logits <MathFormula math="z" /> by <MathFormula math="T > 1" /> softens probability spikes, revealing dark knowledge (inter-token relative correlations).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2">
            <span className="text-cyan-400 font-bold block flex items-center gap-1.5">
              <Scale className="h-4 w-4" /> 2. Gradient Scale (T² Factor)
            </span>
            <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
              <MathFormula math="\frac{\partial \mathcal{L}_{\text{soft}}}{\partial z_S} \approx \frac{1}{T^2} (P_S^T - P_T^T)" />
            </div>
            <p className="text-slate-300 font-sans leading-normal">
              Because gradients of soft probabilities scale inversely with <MathFormula math="1/T^2" />, multiplying the soft loss by <MathFormula math="T^2" /> prevents gradient vanishing as <MathFormula math="T" /> grows.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-2">
            <span className="text-purple-400 font-bold block flex items-center gap-1.5">
              <Database className="h-4 w-4" /> 3. Data & Rationale Distillation
            </span>
            <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
              <MathFormula math="\mathcal{D}_{\text{distill}} = \{ (X_i, Y_{\text{teacher}}^{\text{CoT}}) \}" />
            </div>
            <p className="text-slate-300 font-sans leading-normal">
              Used in DeepSeek-R1 distilled models: large teacher generates step-by-step reasoning tokens; student undergoes Supervised Fine-Tuning (SFT) directly on teacher trajectories.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: WHY DARK KNOWLEDGE & TEMPERATURE SCALLING? (MNIST DIGIT 5 VS 3 CASE STUDY) */}
      <div id="section-mnist-dark-knowledge" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Lightbulb className="h-4 w-4 text-amber-400" /> DEEP CONCEPT DEMYSTIFIED
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Why Dark Knowledge & Temperature Scaling Matter
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Case Study: Handwritten MNIST Digit &lsquo;5&rsquo; vs &lsquo;3&rsquo; &mdash; How soft labels pass structural similarity that hard labels erase.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveLabelTab('hard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeLabelTab === 'hard'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Hard Label (One-Hot)
            </button>
            <button
              onClick={() => setActiveLabelTab('soft-t1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeLabelTab === 'soft-t1'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2. Softmax (T = 1.0)
            </button>
            <button
              onClick={() => setActiveLabelTab('soft-temp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeLabelTab === 'soft-temp'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3. Scaled Temp (T &gt; 1)
            </button>
          </div>
        </div>

        {/* 2-Column Grid: MNIST Image & Intuition vs Probability Histogram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Digit Image & Explanation */}
          <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-2">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-amber-400" /> Input Image: Handwritten Digit &lsquo;5&rsquo;
                </span>
                <span className="text-slate-400 text-[11px]">MNIST Sample #0</span>
              </div>

              {/* MNIST Handwritten Digit Display Box */}
              <div className="flex flex-col items-center justify-center p-4 bg-black rounded-2xl border border-amber-500/30 space-y-3">
                <div className="relative w-32 h-32 bg-black border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center shadow-inner">
                  <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none">
                    <path d="M 25 22 L 75 22 C 78 22 80 24 75 28 L 32 30" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 32 30 L 28 48 C 35 40 68 40 76 52 C 84 64 78 82 58 86 C 38 90 24 78 22 70" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="absolute bottom-1 right-1 text-[9px] font-mono text-amber-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-amber-500/30">
                    Looks like 5 & 3!
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-300 text-center leading-relaxed">
                  Notice how this handwritten <span className="text-amber-400 font-bold">&lsquo;5&rsquo;</span> has top strokes and curved loops that closely resemble a <span className="text-cyan-300 font-bold">&lsquo;3&rsquo;</span> and a <span className="text-purple-300 font-bold">&lsquo;6&rsquo;</span>, but look <span className="text-rose-400 font-semibold">NOTHING</span> like a &lsquo;1&rsquo; or &lsquo;0&rsquo;.
                </div>
              </div>
            </div>

            {/* Explanatory Cards based on Active Tab */}
            <div className="space-y-3 font-mono text-xs">
              {activeLabelTab === 'hard' && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-2">
                  <span className="text-rose-400 font-bold flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-rose-400" /> Hard One-Hot Label Limitation:
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                    Hard ground-truth labels assign <strong>100% to digit &lsquo;5&rsquo;</strong> and <strong>0% to all other 9 digits</strong>. It treats digit &lsquo;3&rsquo; and digit &lsquo;1&rsquo; identically as 0.0, completely <em>erasing</em> class similarity relationships!
                  </p>
                </div>
              )}

              {activeLabelTab === 'soft-t1' && (
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl space-y-2">
                  <span className="text-purple-400 font-bold flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-purple-400" /> Vanishing Gradient Problem (T = 1.0):
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                    A trained Teacher model has high logit confidence (<MathFormula math="z_5=8.5, z_3=3.8" />). At standard <MathFormula math="T=1.0" />, <MathFormula math="P(\text{'5'}) = 99.1\%" /> while <MathFormula math="P(\text{'3'}) = 0.88\%" />. The dark knowledge is buried in the noise floor where gradient <MathFormula math="\frac{\partial \mathcal{L}}{\partial z_3} \approx 0" />, making it <strong>impossible for the student to learn</strong>!
                  </p>
                </div>
              )}

              {activeLabelTab === 'soft-temp' && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-amber-400" /> Temperature Scaling Unlocks Dark Knowledge:
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                    Scaling logits by <MathFormula math={`T = ${mnistTemp.toFixed(1)}`} /> softens the distribution peak. Now <MathFormula math={`P(\\text{'3'}) = ${(mnistSoftProbsTemp[3] * 100).toFixed(1)}\\%`} />, providing a strong, learnable gradient signal that teaches the student that 5 and 3 share curved topological features!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Probability Histograms & Temperature Slider */}
          <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-6">
            {/* Header & Temperature Slider Controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-amber-400" /> 10-Class Probability Histogram:
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                    T = {mnistTemp.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Temperature Slider */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-amber-400" /> Adjust Temperature Parameter (T):
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {mnistTemp === 1.0 ? 'T=1.0 (Unscaled / Vanishing)' : mnistTemp >= 4.0 ? 'T≥4.0 (Optimal Dark Knowledge)' : 'T>1.0 (Softened)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="10.0"
                  step="0.5"
                  value={mnistTemp}
                  onChange={(e) => {
                    setMnistTemp(parseFloat(e.target.value));
                    if (activeLabelTab !== 'soft-temp') setActiveLabelTab('soft-temp');
                  }}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* 10-Digit Probability Histogram Bars (Digits 0 to 9) */}
            <div className="space-y-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
              {Array.from({ length: 10 }).map((_, digit) => {
                let prob = 0;
                if (activeLabelTab === 'hard') {
                  prob = mnistHardProbs[digit];
                } else if (activeLabelTab === 'soft-t1') {
                  prob = mnistSoftProbsT1[digit];
                } else {
                  prob = mnistSoftProbsTemp[digit];
                }

                const isTarget5 = digit === 5;
                const isSimilar3 = digit === 3;
                const isSimilar6 = digit === 6;

                return (
                  <div key={digit} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono items-center">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 font-bold text-center rounded text-[11px] ${
                          isTarget5 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          isSimilar3 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                          isSimilar6 ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                          'text-slate-400'
                        }`}>
                          {digit}
                        </span>
                        <span className={`text-[11px] ${
                          isTarget5 ? 'text-amber-300 font-bold' :
                          isSimilar3 ? 'text-cyan-300 font-bold' :
                          isSimilar6 ? 'text-purple-300 font-medium' :
                          'text-slate-400'
                        }`}>
                          Digit &lsquo;{digit}&rsquo; {isTarget5 && '(Target Class)'} {isSimilar3 && '(High Similarity!)'} {isSimilar6 && '(Subtle Similarity)'}
                        </span>
                      </div>

                      <span className={`font-mono font-bold text-[11px] ${
                        isTarget5 ? 'text-amber-400' :
                        isSimilar3 ? 'text-cyan-400' :
                        'text-slate-400'
                      }`}>
                        {(prob * 100).toFixed(2)}%
                      </span>
                    </div>

                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isTarget5 ? 'bg-gradient-to-r from-amber-500 to-orange-400' :
                          isSimilar3 ? 'bg-gradient-to-r from-cyan-500 to-blue-400' :
                          isSimilar6 ? 'bg-gradient-to-r from-purple-500 to-pink-400' :
                          'bg-slate-700'
                        }`}
                        style={{ width: `${Math.max(prob * 100, prob > 0 ? 1 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dynamic Comparison Summary Badge */}
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-300 border-b border-slate-800 pb-2">
                <span>Target Class (Digit 5) Probability:</span>
                <span className="text-amber-300 font-bold">
                  {( (activeLabelTab === 'hard' ? mnistHardProbs[5] : activeLabelTab === 'soft-t1' ? mnistSoftProbsT1[5] : mnistSoftProbsTemp[5]) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Dark Knowledge Non-Target (Digit 3) Signal:</span>
                <span className={`font-bold ${activeLabelTab === 'hard' ? 'text-rose-400' : activeLabelTab === 'soft-t1' ? 'text-purple-400' : 'text-cyan-300'}`}>
                  {( (activeLabelTab === 'hard' ? mnistHardProbs[3] : activeLabelTab === 'soft-t1' ? mnistSoftProbsT1[3] : mnistSoftProbsTemp[3]) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: INDUSTRY ADAPTATION STAGES (META LLAMA, DEEPSEEK, GOOGLE GEMINI) */}
      <div id="section-adaptation-stages" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-8 border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Workflow className="h-4 w-4 text-cyan-400" /> INDUSTRY LLM ARCHITECTURE ADAPTATION
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Distillation Stages Across LLM Lifecycles
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Comparing how Meta Llama (Pre-training), DeepSeek-R1 (Post-training CoT), and Google Gemini (Full Lifecycle) integrate distillation into model development.
            </p>
          </div>

          {/* Filter Stage Toggle Buttons */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveStageFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeStageFilter === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Stages
            </button>
            <button
              onClick={() => setActiveStageFilter('pretraining')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeStageFilter === 'pretraining'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Meta Llama (Pre)
            </button>
            <button
              onClick={() => setActiveStageFilter('posttraining')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeStageFilter === 'posttraining'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              DeepSeek-R1 (Post)
            </button>
            <button
              onClick={() => setActiveStageFilter('multistage')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeStageFilter === 'multistage'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Google Gemini (Both)
            </button>
          </div>
        </div>

        {/* Visual Pipeline Flowchart Banner */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            End-to-End LLM Lifecycle & Distillation Injection Points:
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono relative">
            {/* Step 1: Pre-training Distillation */}
            <div className={`p-4 rounded-xl border transition-all ${
              activeStageFilter === 'all' || activeStageFilter === 'pretraining' || activeStageFilter === 'multistage'
                ? 'bg-blue-950/40 border-blue-500/50 shadow-lg shadow-blue-500/10'
                : 'bg-slate-900/30 border-slate-800 opacity-40'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-400 font-bold flex items-center gap-1.5">
                  <Database className="h-4 w-4" /> 1. Pre-Training Stage
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                  Soft Logit Loss
                </span>
              </div>
              <p className="text-slate-300 text-[11px] font-sans leading-relaxed mb-3">
                Teacher soft probability matching during next-token prediction over trillions of tokens.
              </p>
              <div className="p-2 bg-slate-900 rounded border border-blue-500/30 text-[10px] text-blue-300">
                <strong>Pioneered by:</strong> Meta Llama 3 (405B &rarr; 8B/70B) & Google Gemini
              </div>
            </div>

            {/* Step 2: Base Model Pipeline Connector */}
            <div className={`p-4 rounded-xl border transition-all ${
              activeStageFilter === 'all' || activeStageFilter === 'posttraining' || activeStageFilter === 'multistage'
                ? 'bg-purple-950/40 border-purple-500/50 shadow-lg shadow-purple-500/10'
                : 'bg-slate-900/30 border-slate-800 opacity-40'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-400 font-bold flex items-center gap-1.5">
                  <GitBranch className="h-4 w-4" /> 2. Post-Training Stage
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                  CoT & Preference SFT
                </span>
              </div>
              <p className="text-slate-300 text-[11px] font-sans leading-relaxed mb-3">
                Teacher trajectory distillation: SFT on 800k+ reasoning outputs & DPO/RLHF preference logits.
              </p>
              <div className="p-2 bg-slate-900 rounded border border-purple-500/30 text-[10px] text-purple-300">
                <strong>Pioneered by:</strong> DeepSeek-R1 (671B &rarr; Distill Qwen/Llama) & Google Gemini
              </div>
            </div>

            {/* Step 3: Multi-Stage Hybrid */}
            <div className={`p-4 rounded-xl border transition-all ${
              activeStageFilter === 'all' || activeStageFilter === 'multistage'
                ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900/30 border-slate-800 opacity-40'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Layers3 className="h-4 w-4" /> 3. Full Lifecycle Hybrid
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Pre + Post Multi-Pass
                </span>
              </div>
              <p className="text-slate-300 text-[11px] font-sans leading-relaxed mb-3">
                Continuous teacher distillation across initial pre-training, SFT alignment, and post-RL scaling.
              </p>
              <div className="p-2 bg-slate-900 rounded border border-emerald-500/30 text-[10px] text-emerald-300">
                <strong>Pioneered by:</strong> Google Gemini (Ultra/Pro &rarr; Flash/Nano)
              </div>
            </div>
          </div>
        </div>

        {/* 3 Detailed Industry Model Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Meta Llama */}
          <div className={`p-6 rounded-2xl bg-slate-950 border space-y-4 flex flex-col justify-between transition-all ${
            activeStageFilter === 'pretraining' || activeStageFilter === 'all'
              ? 'border-blue-500/50 ring-1 ring-blue-500/20'
              : 'border-slate-800 opacity-50'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Meta Llama 3 / 3.1
                </span>
                <span className="text-[11px] font-mono text-blue-400 font-bold">Pre-Training Focus</span>
              </div>

              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Logit Distillation in Pre-Training
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Meta utilized their flagship <strong>Llama-3 405B Teacher</strong> to distill token output distributions into the <strong>8B and 70B Student models</strong> directly during self-supervised pre-training over 15+ trillion tokens.
              </p>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-slate-300">
                  <strong className="text-blue-300 block mb-0.5">Teacher Model:</strong>
                  Llama-3 405B Dense (Teacher)
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-slate-300">
                  <strong className="text-blue-300 block mb-0.5">Target Benefit:</strong>
                  Significantly accelerates token convergence, improves zero-shot pre-training benchmark scores, and transfers dense representation capability.
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-blue-400 flex items-center justify-between">
              <span>Primary Stage:</span>
              <span className="font-bold">Pre-Training Soft Logit KD</span>
            </div>
          </div>

          {/* Card 2: DeepSeek R1 */}
          <div className={`p-6 rounded-2xl bg-slate-950 border space-y-4 flex flex-col justify-between transition-all ${
            activeStageFilter === 'posttraining' || activeStageFilter === 'all'
              ? 'border-purple-500/50 ring-1 ring-purple-500/20'
              : 'border-slate-800 opacity-50'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  DeepSeek-R1
                </span>
                <span className="text-[11px] font-mono text-purple-400 font-bold">Post-Training Focus</span>
              </div>

              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Reasoning Trajectory SFT Distillation
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                DeepSeek distilled reasoning behavior by generating 800,000+ curated Chain-of-Thought (CoT) trajectories from <strong>DeepSeek-R1 671B MoE</strong> and training smaller open models (Qwen 1.5B-32B & Llama 8B/70B) via Supervised Fine-Tuning (SFT).
              </p>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-slate-300">
                  <strong className="text-purple-300 block mb-0.5">Teacher Model:</strong>
                  DeepSeek-R1 671B MoE (Teacher)
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-slate-300">
                  <strong className="text-purple-300 block mb-0.5">Target Benefit:</strong>
                  Transfers DeepSeek-R1&apos;s emergent math, coding, and long-chain self-verification reasoning without expensive RL search on small models.
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-purple-400 flex items-center justify-between">
              <span>Primary Stage:</span>
              <span className="font-bold">Post-Training CoT Data KD</span>
            </div>
          </div>

          {/* Card 3: Google Gemini */}
          <div className={`p-6 rounded-2xl bg-slate-950 border space-y-4 flex flex-col justify-between transition-all ${
            activeStageFilter === 'multistage' || activeStageFilter === 'all'
              ? 'border-emerald-500/50 ring-1 ring-emerald-500/20'
              : 'border-slate-800 opacity-50'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Google Gemini
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">Both Pre + Post</span>
              </div>

              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Multi-Stage Full Lifecycle Distillation
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Google applies distillation continuously across the entire model lifecycle: soft-target logit distillation from <strong>Gemini Ultra/Pro</strong> during pre-training, followed by post-training DPO preference distillation into <strong>Gemini Flash & Nano</strong>.
              </p>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-slate-300">
                  <strong className="text-emerald-300 block mb-0.5">Teacher Models:</strong>
                  Gemini 1.5 Ultra & Pro (Teachers)
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-slate-300">
                  <strong className="text-emerald-300 block mb-0.5">Target Benefit:</strong>
                  Ultra-fast inference latency (Gemini Flash), on-device mobile footprint (Gemini Nano), with maximum reasoning quality retention.
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-emerald-400 flex items-center justify-between">
              <span>Primary Stage:</span>
              <span className="font-bold">Multi-Stage (Pre + Post KD)</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: TOP-K TRUNCATED VOCABULARY SUBSETTING (TOP-256 LOGIT DISTILLATION) */}
      <div id="section-topk-vocab" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Filter className="h-4 w-4 text-emerald-400" /> INDUSTRIAL SCALING OPTIMIZATION
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Top-K Truncated Vocabulary Subsetting (Top-256 Logits)
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Why AI labs truncate distillation from 128,000+ full vocabulary logits down to Top-256 candidates during pre-training.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1.5">
              <Minimize2 className="h-3.5 w-3.5" /> 99.6% Interconnect Traffic Saved
            </span>
          </div>
        </div>

        {/* 2-Column Layout: Controls & Math vs Dynamic Memory & Mass Retained Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Explanatory & Controls */}
          <div className="lg:col-span-6 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-emerald-400" /> The Full Vocabulary Bottleneck Problem
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Modern LLMs like Llama 3 have huge vocabulary sizes (<MathFormula math="|V| = 128,256" /> tokens). Storing and transmitting all 128,256 float32 logits per sequence token across distributed multi-node GPU clusters requires <strong>terabytes of VRAM</strong> and destroys NVLink/InfiniBand network bandwidth.
              </p>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3 text-xs font-mono">
                <span className="text-emerald-400 font-bold block">The Top-K Subsetting Solution:</span>
                <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                  Instead of transferring all 128,256 logits, the Teacher model extracts and saves only the <strong>Top-K highest probability logits</strong> (e.g. <MathFormula math="K = 256" />) per token. The remaining tail is ignored or summed into a residual constant.
                </p>
                <div className="p-2 bg-slate-950 rounded border border-emerald-500/30 text-[11px] text-emerald-300 font-mono text-center">
                  <MathFormula math="P_T^{(K)}(i) = \frac{\exp(z_{T, i} / T)}{\sum_{j \in \text{Top-K}} \exp(z_{T, j} / T)}" />
                </div>
              </div>
            </div>

            {/* Sliders Box */}
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-4">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
                Interactive Vocabulary & Subset Parameters:
              </span>

              {/* Vocab Size Selector */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Total Vocabulary Size (|V|):</span>
                  <span className="text-cyan-300 font-bold">{vocabSize.toLocaleString()} tokens</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setVocabSize(32000)}
                    className={`px-2 py-1 rounded text-xs font-mono ${vocabSize === 32000 ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}
                  >
                    32k (Llama 2)
                  </button>
                  <button
                    onClick={() => setVocabSize(128256)}
                    className={`px-2 py-1 rounded text-xs font-mono ${vocabSize === 128256 ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}
                  >
                    128k (Llama 3)
                  </button>
                  <button
                    onClick={() => setVocabSize(256000)}
                    className={`px-2 py-1 rounded text-xs font-mono ${vocabSize === 256000 ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}
                  >
                    256k (Gemma 2)
                  </button>
                </div>
              </div>

              {/* Top-K Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold">Top-K Logit Subset (K):</span>
                  <span className="text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    K = {topK}
                  </span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="1024"
                  step="16"
                  value={topK}
                  onChange={(e) => setTopK(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>K=16 (Aggressive)</span>
                  <span>K=256 (Industry Standard)</span>
                  <span>K=1024 (Full Tail)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Memory & Probability Mass Dashboard */}
          <div className="lg:col-span-6 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-2">
                <Server className="h-4 w-4 text-cyan-400" /> Real-Time Traffic & Memory Benchmark:
              </span>

              {/* Metric Card 1: Memory per Token Payload */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono items-center">
                  <span className="text-slate-400">Logit Storage Payload Per Token:</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {(topKPayloadMB * 1024).toFixed(1)} KB / token
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5 flex">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max((topKPayloadMB / fullVocabPayloadMB) * 100, 1)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1">
                  <span>Full Vocab ({vocabSize.toLocaleString()}): {(fullVocabPayloadMB * 1024).toFixed(0)} KB</span>
                  <span className="text-emerald-300 font-bold">Saving: {payloadSavingsPercent.toFixed(2)}%</span>
                </div>
              </div>

              {/* Metric Card 2: Cumulative Probability Mass Retained */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono items-center">
                  <span className="text-slate-400">Cumulative Softmax Mass Retained:</span>
                  <span className="text-cyan-300 font-bold text-sm">
                    {massRetainedPercent.toFixed(3)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                  <div
                    className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                    style={{ width: `${massRetainedPercent}%` }}
                  />
                </div>
                <div className="text-[11px] font-mono text-slate-400 pt-1">
                  {topK >= 256 ? (
                    <span className="text-cyan-300 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Top-256 captures &gt;99.9% probability mass with zero dark knowledge loss!
                    </span>
                  ) : (
                    <span>Top-{topK} captures essential tokens; tail noise is truncated.</span>
                  )}
                </div>
              </div>

              {/* Metric Card 3: Inter-GPU Batch Communication Payload */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
                <span className="text-amber-400 font-bold block">
                  Distributed Training Interconnect Traffic (Batch=16, SeqLen=2048):
                </span>
                <div className="flex justify-between text-slate-300">
                  <span>Full Logit Payload Transmission:</span>
                  <span className="text-rose-400 font-bold">{totalBatchFullGB.toFixed(2)} GB / batch</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Top-{topK} Subsetting Payload Transmission:</span>
                  <span className="text-emerald-300 font-bold">{(totalBatchTopKGB * 1024).toFixed(0)} MB / batch</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[11px] font-mono text-emerald-300 text-center">
              💡 Top-256 Subsetting reduces inter-GPU network traffic from 16.8 GB down to 67 MB per batch while preserving 99.91% of dark knowledge!
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: LIVE LOGIT SANDBOX */}
      <div id="section-simulator" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-8 border-purple-500/40 bg-gradient-to-br from-purple-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block mb-1">
              INTERACTIVE TEACHER VS STUDENT LOGIT SIMULATOR
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sliders className="h-5 w-5 text-purple-400" /> Soft Logit Distillation Sandbox
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Adjust Teacher & Student logits, Temperature <MathFormula math="T" />, and blending weight <MathFormula math="\alpha" /> to observe live soft probabilities and loss terms.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setTemp(1.0);
                setAlpha(0.5);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              T=1.0 (Hard)
            </button>
            <button
              onClick={() => {
                setTemp(3.0);
                setAlpha(0.8);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 transition-all"
            >
              T=3.0 (Soft KD)
            </button>
            <button
              onClick={() => {
                setTeacherLogits([5.0, 3.5, 0.2, -3.0]);
                setStudentLogits([1.0, 4.0, 0.5, 0.0]);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
            >
              High Logit Gap
            </button>
          </div>
        </div>

        {/* Sliders Grid: Temperature & Alpha & Target */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950 p-5 rounded-2xl border border-slate-800">
          {/* Temperature Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-purple-400 font-bold flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-purple-400" /> Temperature (T):
              </span>
              <span className="font-mono font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">
                T = {temp.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="8.0"
              step="0.1"
              value={temp}
              onChange={(e) => setTemp(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block font-mono">
              High T softens distribution & reveals token similarities.
            </span>
          </div>

          {/* Loss Blend Alpha Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-rose-400 font-bold flex items-center gap-1.5">
                <Scale className="h-4 w-4 text-rose-400" /> Loss Weight (α):
              </span>
              <span className="font-mono font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded">
                α = {alpha.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block font-mono">
              {(1 - alpha).toFixed(2)} × L_CE + {alpha.toFixed(2)} × (T²·L_soft)
            </span>
          </div>

          {/* Target Token Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-cyan-400 block flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" /> Hard Target Token (y_true):
            </label>
            <select
              value={targetTokenIdx}
              onChange={(e) => setTargetTokenIdx(parseInt(e.target.value))}
              className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-xl p-2 text-xs font-mono focus:ring-1 focus:ring-cyan-500 outline-none"
            >
              {tokenLabels.map((lbl, idx) => (
                <option key={idx} value={idx}>
                  {lbl}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-400 block font-mono">
              Used to compute Hard Cross-Entropy Loss L_CE.
            </span>
          </div>
        </div>

        {/* Logit Sliders & Live Probabilities Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Column: Teacher & Student Logits */}
          <div className="space-y-6 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            {/* Teacher Logits */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="h-4 w-4 text-purple-400" /> Teacher Logits (z_T):
              </span>
              {teacherLogits.map((z, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">{tokenLabels[idx]}</span>
                    <span className="text-purple-300 font-bold">z_T = {z >= 0 ? `+${z.toFixed(1)}` : z.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="-4.0"
                    max="6.0"
                    step="0.2"
                    value={z}
                    onChange={(e) => updateTeacherLogit(idx, parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-3">
              {/* Student Logits */}
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-emerald-400" /> Student Logits (z_S):
              </span>
              {studentLogits.map((z, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">{tokenLabels[idx]}</span>
                    <span className="text-emerald-300 font-bold">z_S = {z >= 0 ? `+${z.toFixed(1)}` : z.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="-4.0"
                    max="6.0"
                    step="0.2"
                    value={z}
                    onChange={(e) => updateStudentLogit(idx, parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Probabilities & Live Loss Calculations */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-cyan-400" /> Soft Probability Distribution (T = {temp.toFixed(1)}):
              </span>

              <div className="space-y-4">
                {tokenLabels.map((lbl, idx) => {
                  const pT = teacherSoftProbs[idx];
                  const pS = studentSoftProbs[idx];
                  const isTarget = idx === targetTokenIdx;

                  return (
                    <div key={idx} className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                      <div className="flex justify-between text-xs font-mono items-center">
                        <span className={`font-semibold ${isTarget ? 'text-cyan-300 font-bold flex items-center gap-1' : 'text-slate-300'}`}>
                          {lbl} {isTarget && <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">Target</span>}
                        </span>
                        <div className="flex gap-3 text-[11px]">
                          <span className="text-purple-400 font-bold">Teacher: {(pT * 100).toFixed(1)}%</span>
                          <span className="text-emerald-400 font-bold">Student: {(pS * 100).toFixed(1)}%</span>
                        </div>
                      </div>

                      {/* Teacher Bar */}
                      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex">
                        <div
                          className="h-full bg-purple-500 transition-all duration-300"
                          style={{ width: `${pT * 100}%` }}
                        />
                      </div>

                      {/* Student Bar */}
                      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex">
                        <div
                          className="h-full bg-emerald-400 transition-all duration-300"
                          style={{ width: `${pS * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Computed Loss Dashboard */}
            <div className="p-4 bg-slate-900 rounded-xl border border-purple-500/30 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">1. Hard Cross-Entropy Loss L_CE:</span>
                <span className="text-cyan-400 font-bold text-sm">{ceLoss.toFixed(4)}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">2. Soft KL Divergence D_KL(P_T^T || P_S^T):</span>
                <span className="text-purple-400 font-bold text-sm">{klDiv.toFixed(4)}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">3. Scaled Soft Loss (T² · D_KL):</span>
                <span className="text-rose-400 font-bold text-sm">{scaledSoftLoss.toFixed(4)}</span>
              </div>

              <div className="flex items-center justify-between pt-1 font-bold text-sm">
                <span className="text-amber-300">Total Combined Loss L_KD:</span>
                <span className="text-amber-300 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30 text-base">
                  {totalKdLoss.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: FORWARD vs REVERSE KL DIVERGENCE */}
      <div id="section-kl-modes" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
              ALIGNMENT & SAMPLING DIVERGENCE MODES
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Split className="h-5 w-5 text-cyan-400" /> Forward KL vs. Reverse KL Divergence
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Understanding Mode-Covering vs. Mode-Seeking behavior when fitting student distributions to multi-modal teacher outputs.
            </p>
          </div>

          {/* Mode Switch Button Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setKlMode('forward')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                klMode === 'forward'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Forward KL (Mode-Covering)
            </button>
            <button
              onClick={() => setKlMode('reverse')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                klMode === 'reverse'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Reverse KL (Mode-Seeking)
            </button>
          </div>
        </div>

        {/* Dynamic Visual Curves & Comparison Box */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Curve Visualization Area */}
          <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-purple-400 font-bold flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" /> Teacher Multi-Modal Target P(x)
              </span>
              <span className="text-cyan-400 font-bold flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block" /> Student Fitted Distribution Q(x)
              </span>
            </div>

            {/* SVG Distribution Plot */}
            <div className="h-56 w-full relative border-b border-l border-slate-800 pt-4 px-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 180">
                {/* Background Grid Lines */}
                <line x1="0" y1="40" x2="400" y2="40" stroke="#334155" strokeDasharray="4" strokeWidth="0.8" />
                <line x1="0" y1="90" x2="400" y2="90" stroke="#334155" strokeDasharray="4" strokeWidth="0.8" />
                <line x1="0" y1="140" x2="400" y2="140" stroke="#334155" strokeDasharray="4" strokeWidth="0.8" />

                {/* Teacher Distribution: Bi-modal Gaussian (Two Peaks at x=100 and x=300) */}
                <path
                  d="M 10 170 C 60 170 70 30 110 30 C 150 30 170 150 200 150 C 230 150 260 20 300 20 C 340 20 350 170 390 170"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="3.5"
                />

                {/* Student Distribution Q(x) */}
                {klMode === 'forward' ? (
                  // Forward KL: Mode-Covering (Wide curve spanning across both peaks, low height in middle)
                  <path
                    d="M 20 170 C 50 170 80 80 200 80 C 320 80 350 170 380 170"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                    strokeDasharray="6 2"
                  />
                ) : (
                  // Reverse KL: Mode-Seeking (Sharp curve focusing tightly on the dominant right peak x=300)
                  <path
                    d="M 180 170 C 220 170 260 15 300 15 C 340 15 370 170 390 170"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="3.5"
                    strokeDasharray="6 2"
                  />
                )}
              </svg>
            </div>

            <div className="flex justify-between text-[11px] font-mono text-slate-400 px-2">
              <span>Token Probability Domain (x)</span>
              <span>
                {klMode === 'forward' ? (
                  <span className="text-amber-400 font-bold">Forward KL Penalty: P(x) &gt; 0 but Q(x) ≈ 0 is heavily penalized.</span>
                ) : (
                  <span className="text-cyan-400 font-bold">Reverse KL Penalty: Q(x) &gt; 0 where P(x) ≈ 0 is heavily penalized.</span>
                )}
              </span>
            </div>
          </div>

          {/* Details & Explanation Box */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between text-xs font-mono">
            {klMode === 'forward' ? (
              <>
                <div className="space-y-3">
                  <span className="text-amber-400 font-bold text-sm block flex items-center gap-1.5">
                    <MathFormula math="D_{\text{KL}}(P \parallel Q) = \mathbb{E}_{P}\left[\log \frac{P(x)}{Q(x)}\right]" />
                  </span>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 font-sans leading-relaxed">
                    <strong>Mode-Covering (Mean-Seeking):</strong> Forces the student model <MathFormula math="Q" /> to spread its probability mass across all peaks of Teacher <MathFormula math="P" />.
                  </div>
                  <ul className="space-y-2 font-sans text-slate-300 leading-normal">
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>Places probability mass in low-density valleys between modes.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>Can cause hallucinatory or out-of-distribution token sampling in generative models.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono">
                  Used in standard Supervised Fine-Tuning (SFT) & classic Logit Distillation.
                </div>
              </>
            ) : (
              <>
                <div className="space-y-3">
                  <span className="text-cyan-400 font-bold text-sm block flex items-center gap-1.5">
                    <MathFormula math="D_{\text{KL}}(Q \parallel P) = \mathbb{E}_{Q}\left[\log \frac{Q(x)}{P(x)}\right]" />
                  </span>
                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-200 font-sans leading-relaxed">
                    <strong>Mode-Seeking (Zero-Avoiding):</strong> Forces the student model <MathFormula math="Q" /> to zero out its probability whenever Teacher <MathFormula math="P(x) \approx 0" />.
                  </div>
                  <ul className="space-y-2 font-sans text-slate-300 leading-normal">
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>Locks tightly onto a single high-quality reasoning mode, avoiding nonsense tokens.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>Key objective in RLHF, DPO, and Generative LLM On-Policy Distillation.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono">
                  Used in On-Policy Distillation (GRPO / DPO / DeepSeek-R1 Alignment).
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 7: TEACHER VS STUDENT COMPRESSION & EFFICIENCY SIMULATOR */}
      <div id="section-efficiency" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
            HARDWARE & BENCHMARK COMPRESSION METRICS
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-emerald-400" /> LLM Teacher vs. Student Efficiency Simulator
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Compare GPU memory footprint, inference latency, throughput speedups, and benchmark retention across distilled model pairs.
          </p>
        </div>

        {/* Model Selector & Batch Size controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950 p-5 rounded-2xl border border-slate-800">
          {/* Teacher Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-purple-400 block flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-purple-400" /> Select Teacher Model:
            </label>
            <select
              value={selectedTeacher.id}
              onChange={(e) => {
                const found = TEACHER_MODELS.find(m => m.id === e.target.value);
                if (found) setSelectedTeacher(found);
              }}
              className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-xl p-2 text-xs font-mono focus:ring-1 focus:ring-purple-500 outline-none"
            >
              {TEACHER_MODELS.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.params})
                </option>
              ))}
            </select>
          </div>

          {/* Student Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-400 block flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-emerald-400" /> Select Student Model:
            </label>
            <select
              value={selectedStudent.id}
              onChange={(e) => {
                const found = STUDENT_MODELS.find(m => m.id === e.target.value);
                if (found) setSelectedStudent(found);
              }}
              className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-xl p-2 text-xs font-mono focus:ring-1 focus:ring-emerald-500 outline-none"
            >
              {STUDENT_MODELS.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.params})
                </option>
              ))}
            </select>
          </div>

          {/* Batch Size Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Network className="h-4 w-4 text-cyan-400" /> Concurrency Batch Size:
              </span>
              <span className="font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">
                Batch = {batchSize}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="16"
              step="1"
              value={batchSize}
              onChange={(e) => setBatchSize(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Dynamic Metric Comparison Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: VRAM Memory Saved */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Database className="h-4 w-4 text-purple-400" /> VRAM Memory Required
            </span>

            <div>
              <div className="text-2xl font-black text-white font-mono">
                {selectedStudent.vramGB * (1 + (batchSize - 1) * 0.1)} <span className="text-xs text-slate-400">GB</span>
              </div>
              <span className="text-xs text-slate-400 font-mono block mt-1">
                Teacher: {(selectedTeacher.vramGB * (1 + (batchSize - 1) * 0.1)).toFixed(0)} GB
              </span>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center justify-between">
              <span>Memory Reduction:</span>
              <span>-{((1 - selectedStudent.vramGB / selectedTeacher.vramGB) * 100).toFixed(1)}%</span>
            </div>
          </div>

          {/* Card 2: Inference Speedup */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-400" /> Tokens Per Second
            </span>

            <div>
              <div className="text-2xl font-black text-amber-300 font-mono">
                {Math.round(selectedStudent.tokensPerSec / Math.sqrt(batchSize))} <span className="text-xs text-slate-400">tok/s</span>
              </div>
              <span className="text-xs text-slate-400 font-mono block mt-1">
                Teacher: {Math.round(selectedTeacher.tokensPerSec / Math.sqrt(batchSize))} tok/s
              </span>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center justify-between">
              <span>Throughput Gain:</span>
              <span>{(selectedStudent.tokensPerSec / selectedTeacher.tokensPerSec).toFixed(1)}x Faster</span>
            </div>
          </div>

          {/* Card 3: Latency Per Token */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-cyan-400" /> Per-Token Latency
            </span>

            <div>
              <div className="text-2xl font-black text-cyan-300 font-mono">
                {selectedStudent.latencyMs} <span className="text-xs text-slate-400">ms/tok</span>
              </div>
              <span className="text-xs text-slate-400 font-mono block mt-1">
                Teacher: {selectedTeacher.latencyMs} ms/tok
              </span>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center justify-between">
              <span>Latency Cut:</span>
              <span>-{((1 - selectedStudent.latencyMs / selectedTeacher.latencyMs) * 100).toFixed(1)}%</span>
            </div>
          </div>

          {/* Card 4: Benchmark Score Retention */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-rose-400" /> Accuracy Retention
            </span>

            <div>
              <div className="text-2xl font-black text-rose-300 font-mono">
                {((selectedStudent.benchmarkScore / selectedTeacher.benchmarkScore) * 100).toFixed(1)}%
              </div>
              <span className="text-xs text-slate-400 font-mono block mt-1">
                Student Score: {selectedStudent.benchmarkScore} (Teacher: {selectedTeacher.benchmarkScore})
              </span>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold flex items-center justify-between">
              <span>Reasoning Capacity:</span>
              <span>Retained</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 8: RECOMMENDED VIDEO RESOURCE */}
      <div id="section-video" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-red-500/40 bg-gradient-to-br from-red-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Video className="h-4 w-4 text-red-400" /> RECOMMENDED DEEP-DIVE LECTURE
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Knowledge Distillation Explained
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Watch the comprehensive explanation of Knowledge Distillation, Temperature Scaling, and Soft Label probability transfer.
            </p>
          </div>

          <a
            href="https://www.youtube.com/watch?v=jrJKRYAdh7I"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-red-600/20 shrink-0"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>Watch on YouTube</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-80" />
          </a>
        </div>

        {/* Embedded Responsive Video Container */}
        <div className="relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-black aspect-video shadow-2xl">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/jrJKRYAdh7I"
            title="Knowledge Distillation Video Explanation"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>

      {/* SECTION 9: FOUNDATIONAL ACADEMIC LITERATURE & PAPERS */}
      <div id="section-papers" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-indigo-500/40 bg-gradient-to-br from-indigo-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-indigo-400" /> ACADEMIC ORIGINS & FOUNDATIONAL PAPERS
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Key Literature: From Model Compression to Dark Knowledge
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Explore the landmark research papers that invented model compression (2006) and formalized modern Knowledge Distillation (2015).
          </p>
        </div>

        {/* 2 Paper Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Paper 1: Model Compression (2006) */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 flex flex-col justify-between hover:border-indigo-500/50 transition-all group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  KDD 2006 Origin Paper
                </span>
                <span className="text-xs font-mono text-slate-400">Published 2006</span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-400 shrink-0" />
                Model Compression
              </h3>

              <p className="text-xs text-slate-400 font-mono">
                <strong>Authors:</strong> Cristian Buciluǎ, Rich Caruana, Alexandru Niculescu-Mizil
              </p>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                The seminal paper that first demonstrated that large, complex ensembles of neural networks can be compressed into a single compact model. Introduced generating synthetic unlabeled data scored by teacher ensembles to train student networks.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">ACM SIGKDD 2006</span>
              <a
                href="https://dl.acm.org/doi/10.1145/1150402.1150464"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
              >
                <span>Read Paper</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Paper 2: Dark Knowledge (Hinton et al., 2015) */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 flex flex-col justify-between hover:border-purple-500/50 transition-all group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  NIPS 2014 / arXiv 2015
                </span>
                <span className="text-xs font-mono text-slate-400">Published 2015</span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-400 shrink-0" />
                Distilling the Knowledge in a Neural Network
              </h3>

              <p className="text-xs text-slate-400 font-mono">
                <strong>Authors:</strong> Geoffrey Hinton, Oriol Vinyals, Jeff Dean
              </p>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                The landmark paper that introduced the concept of <strong>&ldquo;Dark Knowledge&rdquo;</strong> and <strong>Temperature-scaled Softmax ($T &gt; 1$)</strong>. Derived the soft-target Cross-Entropy + KL Divergence distillation loss formulation used in all modern LLMs today.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">arXiv:1503.02531</span>
              <a
                href="https://arxiv.org/abs/1503.02531"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
              >
                <span>Read Paper</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
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
