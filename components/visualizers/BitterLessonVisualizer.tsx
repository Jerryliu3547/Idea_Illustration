"use client";

import React, { useState } from 'react';
import { getAssetPath } from '@/lib/asset';
import { MathFormula } from '@/components/ui/MathFormula';
import { 
  BookOpen, 
  Sparkles, 
  Bookmark, 
  Cpu, 
  Zap, 
  TrendingUp, 
  History, 
  Search, 
  Brain, 
  ExternalLink, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Sliders, 
  Quote, 
  Flame,
  Award
} from 'lucide-react';

export const BitterLessonVisualizer: React.FC = () => {
  const [computeScale, setComputeScale] = useState<number>(70); // 0 to 100
  const [selectedDomain, setSelectedDomain] = useState<'chess' | 'vision' | 'speech' | 'llm'>('chess');

  // Domain scaling comparison data
  const domainData = {
    chess: {
      title: "Chess & Computer Games",
      handEngineered: "Hand-coded positional features, piece values, opening books, & pawn structure heuristics.",
      generalMethod: "Brute-force alpha-beta tree search (Deep Blue 1997) & MCTS with self-play RL (AlphaZero 2017).",
      crossoverPoint: "1997 (Deep Blue Kasparov defeat) & 2017 (AlphaZero)",
      handPerf: Math.min(85, 60 + computeScale * 0.25),
      generalPerf: Math.min(99, 10 + Math.pow(computeScale / 100, 2.2) * 89),
    },
    vision: {
      title: "Computer Vision & Object Recognition",
      handEngineered: "Hand-designed SIFT, HOG, Sobel edge detectors, Gabor filters, & manual feature engineering.",
      generalMethod: "Deep Convolutional Networks (AlexNet 2012) & Transformers (ViT) on raw GPU pixels.",
      crossoverPoint: "2012 ImageNet Competition (AlexNet)",
      handPerf: Math.min(70, 50 + computeScale * 0.2),
      generalPerf: Math.min(98, 5 + Math.pow(computeScale / 100, 2.3) * 93),
    },
    speech: {
      title: "Speech Recognition & NLP",
      handEngineered: "Human acoustic phoneme rules, vocal tract physics models, hardcoded grammar trees.",
      generalMethod: "End-to-end Neural Networks (Whisper, Wav2Vec) & Autoregressive Transformers on raw audio.",
      crossoverPoint: "2010s Deep Neural Net Acoustic Models",
      handPerf: Math.min(65, 45 + computeScale * 0.2),
      generalPerf: Math.min(97, 8 + Math.pow(computeScale / 100, 2.1) * 89),
    },
    llm: {
      title: "Language & Reasoning (LLMs)",
      handEngineered: "Expert rule systems, Knowledge Graphs, Cyc ontology trees, hardcoded parsing syntax.",
      generalMethod: "Transformer Next-Token Prediction on Web-scale compute (GPT-4, Claude, DeepSeek R1).",
      crossoverPoint: "2017 (Transformer Paper) & 2020 (GPT-3 Scaling Laws)",
      handPerf: Math.min(60, 40 + computeScale * 0.18),
      generalPerf: Math.min(100, 2 + Math.pow(computeScale / 100, 2.4) * 98),
    },
  };

  const activeDomainInfo = domainData[selectedDomain];

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <BookOpen className="h-4 w-4 text-rose-400" /> Philosophy of AI & Compute Scaling Laws
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          The Bitter Lesson
        </h1>
        <p className="text-slate-300 mt-2 text-base leading-relaxed">
          By <strong>Richard Sutton (March 13, 2019)</strong> — The most influential essay in modern Artificial Intelligence. General methods that leverage massive computation ultimately defeat human-engineered domain knowledge by a large margin.
        </p>
      </div>

      {/* QUICK BOOKMARK NAVIGATION BAR */}
      <div className="sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border border-rose-500/40 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400">
          <Bookmark className="h-4 w-4 text-rose-400" />
          <span>Quick Section Bookmarks:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs font-mono">
          <button
            onClick={() => document.getElementById('section-thesis')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-2.5 py-2 rounded-xl bg-slate-900/90 hover:bg-rose-500/20 text-slate-200 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-all flex items-center justify-start gap-1.5 text-left"
          >
            <Zap className="h-3.5 w-3.5 text-rose-400 shrink-0" />
            <span className="font-semibold truncate">1. Core Thesis</span>
          </button>

          <button
            onClick={() => document.getElementById('section-bitter')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-2.5 py-2 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-start gap-1.5 text-left"
          >
            <Flame className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold truncate">2. Why &quot;Bitter&quot;</span>
          </button>

          <button
            onClick={() => document.getElementById('section-history')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-2.5 py-2 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-start gap-1.5 text-left"
          >
            <History className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="font-semibold truncate">3. History</span>
          </button>

          <button
            onClick={() => document.getElementById('section-methods')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-2.5 py-2 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-start gap-1.5 text-left"
          >
            <Cpu className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span className="font-semibold truncate">4. 2 General Methods</span>
          </button>

          <button
            onClick={() => document.getElementById('section-simulator')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-2.5 py-2 rounded-xl bg-slate-900/90 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-start gap-1.5 text-left"
          >
            <Sliders className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold truncate">5. Compute Simulator</span>
          </button>

          <button
            onClick={() => document.getElementById('section-essay')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-2.5 py-2 rounded-xl bg-slate-900/90 hover:bg-indigo-500/20 text-slate-200 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-start gap-1.5 text-left"
          >
            <FileText className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <span className="font-semibold truncate">6. Full Essay</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: THE CORE THESIS */}
      <div id="section-thesis" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-rose-500/40 bg-gradient-to-br from-rose-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-rose-400" /> ESSAY PRINCIPLE #1
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            1. The Core Thesis
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            General methods leveraging massive computation dominate human domain engineering by a massive margin.
          </p>
        </div>

        {/* Core Thesis Highlight Box */}
        <div className="p-6 rounded-2xl bg-rose-950/40 border-2 border-rose-500/50 shadow-2xl shadow-rose-500/10 space-y-3">
          <span className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider block flex items-center gap-2">
            <Award className="h-4 w-4 text-rose-400" /> The Central Principle
          </span>
          <p className="text-base sm:text-lg font-bold text-white leading-relaxed font-sans">
            &quot;General methods that leverage massive computation are ultimately the most effective, by a large margin, compared to human-engineered domain knowledge.&quot;
          </p>
        </div>

        {/* Sutton's Trap: 3-Step Lifecycle */}
        <div className="space-y-3">
          <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider">
            Sutton&apos;s Recurring Research Trap:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-mono">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-amber-400 font-bold block uppercase flex items-center gap-1.5 text-sm">
                <span className="h-6 w-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center text-xs">1</span>
                Human Domain Hardcoding
              </span>
              <p className="text-slate-300 font-sans leading-relaxed">
                Researchers attempt to build human domain understanding directly into the AI system (e.g. hardcoding grammar rules into NLP or positional heuristics into chess engines).
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-cyan-400 font-bold block uppercase flex items-center gap-1.5 text-sm">
                <span className="h-6 w-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-xs">2</span>
                Short-Term Gains
              </span>
              <p className="text-slate-300 font-sans leading-relaxed">
                Hand-coded domain knowledge provides an immediate short-term performance boost when computing power is low and data is scarce.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-rose-500/40 space-y-2">
              <span className="text-rose-400 font-bold block uppercase flex items-center gap-1.5 text-sm">
                <span className="h-6 w-6 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center justify-center text-xs">3</span>
                Compute Overtakes
              </span>
              <p className="text-slate-300 font-sans leading-relaxed">
                As hardware improves and computation scales, a simpler, compute-heavy, general-purpose algorithm overtakes and completely crushes the hand-coded system!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: WHY IS IT "BITTER"? */}
      <div id="section-bitter" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-amber-400" /> PSYCHOLOGICAL & RESEARCH INSIGHT
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            2. Why is it &quot;Bitter&quot;?
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Understanding why raw compute and general algorithms hurt the human ego.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs leading-relaxed">
          {/* Left Box: The Human Ego Trap */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-3">
            <div className="flex items-center gap-2 font-mono font-bold text-rose-400 text-sm border-b border-slate-800 pb-2">
              <XCircle className="h-4.5 w-4.5 text-rose-400" />
              <span>The Human Ego & Academic Vanity</span>
            </div>
            <p className="text-slate-300">
              It is a bitter pill to swallow for researchers because it directly hurts the human ego. Researchers spend years getting PhDs to deeply understand a domain (like linguistics, neuroscience, or physics) with the goal of designing clever, elegant architectures that mimic human reasoning.
            </p>
            <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-500/30 text-rose-300 font-mono text-[11px]">
              &quot;We try to build in how we think we think — and it always fails in the long run.&quot;
            </div>
          </div>

          {/* Right Box: The Reality of General Computation */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3">
            <div className="flex items-center gap-2 font-mono font-bold text-emerald-400 text-sm border-b border-slate-800 pb-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
              <span>The Long-Run Reality of Compute</span>
            </div>
            <p className="text-slate-300">
              The Bitter Lesson states that human cleverness is mostly a waste of time — and often a major hindrance. In the long run, raw compute combined with simple, scalable algorithms will always defeat bespoke human engineering.
            </p>
            <p className="text-emerald-300 font-semibold pt-1 border-t border-slate-800">
              We must build general mechanisms that allow the machine to figure things out on its own!
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: THE HISTORICAL EVIDENCE */}
      <div id="section-history" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <History className="h-4 w-4 text-cyan-400" /> EMPIRICAL PROOF ACROSS DECADES
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            3. The Historical Evidence
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Major AI milestones where human domain knowledge was crushed by raw computation.
          </p>
        </div>

        {/* 3 Major Milestones Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          {/* Milestone 1: Chess */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase">1. Computer Chess</span>
                <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-bold">1997</span>
              </div>
              <h3 className="text-sm font-bold text-white font-mono">Deep Blue Defeats Kasparov</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                For decades, AI researchers tried to build chess engines that understood pawn structures, center control, and opening theories. In 1997, IBM&apos;s Deep Blue beat Garry Kasparov not through deep human-like understanding, but through a <strong>massive brute-force hardware search</strong> of future moves.
              </p>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-300 mt-4">
              Human Rules &rarr; Brute-Force Search
            </div>
          </div>

          {/* Milestone 2: Computer Vision */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-purple-300 uppercase">2. Computer Vision</span>
                <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-bold">2012</span>
              </div>
              <h3 className="text-sm font-bold text-white font-mono">AlexNet & Deep CNNs</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Researchers used to spend their careers designing custom edge-detectors and feature extractors (SIFT, HOG). In 2012, AlexNet discarded all of that. It fed raw pixels directly into a generic learning algorithm backed by GPU compute, revolutionizing the field overnight.
              </p>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-purple-300 mt-4">
              SIFT/HOG &rarr; GPUs + Deep CNNs
            </div>
          </div>

          {/* Milestone 3: Speech Recognition */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-emerald-300 uppercase">3. Speech Recognition</span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">2010s</span>
              </div>
              <h3 className="text-sm font-bold text-white font-mono">End-to-End Neural Speech</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Early systems tried to use human linguistic rules, phonemes, and vocal tract physics models. They were entirely superseded by statistical models and deep neural networks that learned mappings directly from massive datasets.
              </p>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 mt-4">
              Phonemes &rarr; Massive Audio Deep Learning
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: THE TWO GENERAL METHODS THAT SCALE */}
      <div id="section-methods" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-purple-500/40 bg-gradient-to-br from-purple-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Cpu className="h-4 w-4 text-purple-400" /> INFINITE SCALING ALGORITHMS
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            4. The Two General Methods That Scale
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Sutton identifies two specific AI techniques that scale infinitely with Moore&apos;s Law (compute growth).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          {/* Method 1: Search */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                <Search className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-mono">1. Search</h3>
                <span className="text-xs text-cyan-400 font-mono">State-Space Lookahead</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Looking ahead through massive state spaces to find an optimal path to a goal. Search scales directly with available FLOPs: as compute increases, the search depth grows deeper.
            </p>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase">Key Examples:</span>
              <p>&bull; Alpha-Beta Tree Search (Deep Blue)</p>
              <p>&bull; Monte Carlo Tree Search (AlphaGo)</p>
              <p>&bull; Test-Time Agentic Planning (DeepSeek R1, OpenAI o1/o3)</p>
            </div>
          </div>

          {/* Method 2: Learning */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-purple-500/40 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                <Brain className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-mono">2. Learning</h3>
                <span className="text-xs text-purple-400 font-mono">Data-Driven Weight Optimization</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Updating network weights based on vast amounts of data without human-labeled rules. Learning scales infinitely as datasets and parameter counts expand with hardware compute.
            </p>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-purple-300 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase">Key Examples:</span>
              <p>&bull; Backpropagation in Deep Neural Networks</p>
              <p>&bull; Unsupervised Pre-training (Transformers / LLMs)</p>
              <p>&bull; Model-Free Reinforcement Learning (PPO, GRPO)</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: INTERACTIVE COMPUTE SCALING VS HUMAN ENGINEERING SIMULATOR */}
      <div id="section-simulator" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-emerald-400" /> LIVE COMPUTE SCALING LAWS SIMULATOR
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Human Engineering vs. General Compute Scaling
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Drag the compute power slider to watch how raw computation crushes hand-engineered domain rules across domains!
            </p>
          </div>

          {/* Domain Selector Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0 self-start sm:self-auto">
            {(['chess', 'vision', 'speech', 'llm'] as const).map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all uppercase ${
                  selectedDomain === dom ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {dom}
              </button>
            ))}
          </div>
        </div>

        {/* Compute Power Slider Control */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-slate-300 font-bold flex items-center gap-2">
              <Cpu className="h-4 w-4 text-emerald-400" /> Compute Power / Hardware Scale (FLOPs):
            </span>
            <span className="text-emerald-400 font-bold text-sm bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/30">
              10^{Math.round(computeScale / 10)} FLOPs ({computeScale}% Hardware Scale)
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={computeScale}
            onChange={(e) => setComputeScale(Number(e.target.value))}
            className="w-full h-3 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500 border border-slate-800"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>Low Compute (1980s PC)</span>
            <span>Medium Compute (2000s Cluster)</span>
            <span>Massive Scale (2020s GPU Supercomputer)</span>
          </div>
        </div>

        {/* Performance Comparison Bar Chart */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-2 flex justify-between items-center">
            <h3 className="text-sm font-mono font-bold text-white">{activeDomainInfo.title}</h3>
            <span className="text-xs font-mono text-amber-400">Crossover: {activeDomainInfo.crossoverPoint}</span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Hand-Engineered Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-rose-400 font-bold flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-rose-400" /> Hand-Engineered Domain Knowledge:
                </span>
                <span className="text-rose-300 font-bold">{Math.round(activeDomainInfo.handPerf)}% Performance</span>
              </div>
              <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div 
                  className="h-full bg-rose-500 rounded-full transition-all duration-300"
                  style={{ width: `${activeDomainInfo.handPerf}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 font-sans italic">{activeDomainInfo.handEngineered}</p>
            </div>

            {/* General Search & Learning Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> General Search & Learning (Compute-Heavy):
                </span>
                <span className="text-emerald-300 font-bold">{Math.round(activeDomainInfo.generalPerf)}% Performance</span>
              </div>
              <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full transition-all duration-300"
                  style={{ width: `${activeDomainInfo.generalPerf}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 font-sans italic">{activeDomainInfo.generalMethod}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: ORIGINAL ESSAY & PAPER REFERENCE */}
      <div id="section-essay" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-indigo-500/40 bg-gradient-to-br from-indigo-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-indigo-400" /> ORIGINAL ESSAY (MARCH 13, 2019)
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              &quot;The Bitter Lesson&quot; — By Richard Sutton
            </h2>
            <p className="text-xs text-slate-300">
              Distinguished Research Scientist at DeepMind & Professor at University of Alberta
            </p>
          </div>

          <a
            href="https://www.cs.utexas.edu/~eunsol/courses/data/bitter_lesson.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 transition-all flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <ExternalLink className="h-4 w-4 text-indigo-400" />
            <span>Open Paper PDF (UT Austin CS)</span>
          </a>
        </div>

        {/* Verbatim Essay Text Reader Panel */}
        <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4 text-xs font-sans leading-relaxed text-slate-300 shadow-2xl">
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold border-b border-slate-800 pb-3">
            <Quote className="h-5 w-5 text-indigo-400" />
            <span>Full Text Digest of Richard Sutton&apos;s Essay:</span>
          </div>

          <div className="space-y-4 leading-relaxed text-slate-300">
            <p>
              The biggest lesson that can be read from 70 years of AI research is that general methods that leverage computation are ultimately the most effective, and by a large margin. The ultimate reason for this is Moore’s law, or rather its generalization of continued exponentially falling cost per unit of computation. Most AI research has been conducted as if the computation available to the agent were constant (in which case leveraging human knowledge would be one of the only ways to improve performance) but, over a slightly longer time than a typical research project, massively more computation inevitably becomes available.
            </p>

            <p>
              Seeking an improvement that makes a difference in the shorter term, researchers seek to leverage their human knowledge of the domain, but the only thing that matters in the long run is the leveraging of computation. These two need not run counter to each other, but in practice they tend to. Time spent on one is time not spent on the other. There are psychological commitments to investment in one approach or the other. And the human-knowledge approach tends to complicate methods in ways that make them less able to take advantage of general methods leveraging computation.
            </p>

            <p>
              We should admit that we are always subject to this failure. First, AI researchers have often tried to build knowledge into their agents, this always helps in the short term, and is personally satisfying to the researcher, but in the long run it plateaus and even inhibits further progress. Second, actual progress is eventually arrived at by an opposing approach based on scaling computation by search and learning.
            </p>

            <div className="p-4 bg-indigo-950/30 rounded-xl border border-indigo-500/30 text-indigo-200 font-semibold font-mono text-[11px]">
              &quot;The one thing that should be learned from this bitter lesson is the great power of general purpose methods, of methods that continue to scale with increased computation even as the available computation becomes very great.&quot;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
