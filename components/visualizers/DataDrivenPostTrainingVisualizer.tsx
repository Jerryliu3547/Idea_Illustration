"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { getAssetPath } from '@/lib/asset';
import { MathFormula } from '@/components/ui/MathFormula';
import {
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  Database,
  Filter,
  GitBranch,
  Layers,
  Maximize2,
  Minimize2,
  Play,
  RefreshCw,
  Scale,
  Sliders,
  Sparkles,
  Wand2,
  XCircle,
} from 'lucide-react';

interface ModalImageState {
  src: string;
  alt: string;
  title: string;
}

interface FigureCardProps {
  figureNumber: number;
  title: string;
  src: string;
  alt: string;
  onExpand: (img: ModalImageState) => void;
}

const FigureCard: React.FC<FigureCardProps> = ({
  figureNumber,
  title,
  src,
  alt,
  onExpand,
}) => {
  const resolvedSrc = getAssetPath(src);
  const modalPayload: ModalImageState = {
    src: resolvedSrc,
    alt,
    title: `Figure ${figureNumber}: ${title}`,
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-mono text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 shrink-0">
            Figure {figureNumber}
          </span>
          <span className="text-sm font-bold text-white truncate">{title}</span>
        </div>
        <button
          onClick={() => onExpand(modalPayload)}
          className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 shrink-0 cursor-pointer"
        >
          <Maximize2 className="h-3.5 w-3.5" /> Fullscreen
        </button>
      </div>

      <div
        onClick={() => onExpand(modalPayload)}
        className="cursor-pointer group relative overflow-hidden rounded-xl border border-slate-800 bg-white/95 p-2 flex justify-center"
      >
        <Image
          src={resolvedSrc}
          alt={alt}
          width={960}
          height={540}
          unoptimized
          className="rounded-lg object-contain max-h-80 w-auto group-hover:scale-[1.01] transition-transform duration-300"
        />
      </div>
    </div>
  );
};

const READINESS_CASES = [
  {
    id: 'knows',
    label: 'Model already knows calculus',
    verdict: 'Low post-training data needed',
    detail: 'Pre-training already encoded the knowledge. A small, high-quality SFT/RL set (e.g., 100–1K examples) can quickly elicit the exact format and reasoning style.',
    color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
  },
  {
    id: 'no_calc',
    label: 'Model has never seen calculus',
    verdict: 'Moderate-to-high data / mid-training needed',
    detail: 'Post-training alone cannot cheaply invent deep missing domain concepts. You will need domain adaptation (10K–100K+) or continuous pre-training first.',
    color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
  },
  {
    id: 'no_math',
    label: 'Model has never seen math',
    verdict: 'Post-training cannot create it cheaply',
    detail: 'Without foundational mathematical representations from pre-training, post-training will overfit or hallucinate. Always run evals on your pre-trained base model first.',
    color: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
  },
] as const;

const DATA_SIZING_LADDER = [
  { count: '20', useCase: 'Formatting changes', note: 'Quickly adjust output JSON/XML structure or tone.' },
  { count: '100', useCase: 'Good starting point', note: 'Enough to observe measurable model behavior changes.' },
  { count: '1K', useCase: 'Domain-specific apps', note: 'Covers most targeted enterprise post-training use cases.' },
  { count: '10K', useCase: 'Frontier lab post-training', note: 'Broad instruction-following and reasoning alignment.' },
  { count: '100K', useCase: 'Domain adaptation', note: 'Deep specialization across broad sub-domains.' },
];

const REJECTION_PIPELINE_STEPS = [
  {
    step: 1,
    title: '1. Generate k Candidates',
    detail: 'Sample k diverse candidate completions for each prompt using non-zero temperature.',
  },
  {
    step: 2,
    title: '2. Constitution LLM Judge',
    detail: 'Run a rule-based or constitutional LLM judge to immediately eliminate clearly poor candidates.',
  },
  {
    step: 3,
    title: '3. Pairwise Preference Ranking',
    detail: 'Run LLM pairwise comparisons across the surviving candidates to establish a clean rank order.',
  },
  {
    step: 4,
    title: '4. Self-Consistency / Majority',
    detail: 'Check agreement across multiple samples or judges to filter out fluke high scores.',
  },
  {
    step: 5,
    title: '5. Keep Top N High-Signal Samples',
    detail: 'Retain only the highest-signal top N completions as curated synthetic training data.',
  },
];

const TEMPLATE_SLOTS = {
  customer_name: ['Alex', 'Jordan'],
  product_name: ['Smart Thermostat', 'Video Doorbell'],
  specific_issue: ["won't connect to Wi-Fi", 'has poor battery life'],
  resolution_step: ['issue a full refund', 'send a replacement unit'],
};

export const DataDrivenPostTrainingVisualizer: React.FC = () => {
  const [modalImage, setModalImage] = useState<ModalImageState | null>(null);

  // Section 1 state
  const [readinessIdx, setReadinessIdx] = useState<number>(0);

  // Section 2 state
  const [prefMode, setPrefMode] = useState<'online' | 'offline'>('online');

  // Section 3 state
  const [rejStepIdx, setRejStepIdx] = useState<number>(0);
  const [tplCustomer, setTplCustomer] = useState<string>('Alex');
  const [tplProduct, setTplProduct] = useState<string>('Smart Thermostat');
  const [tplIssue, setTplIssue] = useState<string>('has poor battery life');
  const [tplResolution, setTplResolution] = useState<string>('issue a full refund');

  // Section 4 state
  const [mixPreset, setMixPreset] = useState<'imbalanced' | 'balanced'>('balanced');
  const [rewardPreset, setRewardPreset] = useState<'unbalanced' | 'balanced'>('balanced');

  const activeReadiness = READINESS_CASES[readinessIdx];
  const totalCombos =
    TEMPLATE_SLOTS.customer_name.length *
    TEMPLATE_SLOTS.product_name.length *
    TEMPLATE_SLOTS.specific_issue.length *
    TEMPLATE_SLOTS.resolution_step.length;

  return (
    <div className="space-y-10">
      {/* ========================================================= */}
      {/* STICKY QUICK SECTION BOOKMARKS BAR                        */}
      {/* ========================================================= */}
      <div className="sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border border-amber-500/40 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
          <Bookmark className="h-4 w-4 text-amber-400" />
          <span>Quick Section Bookmarks:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-mono">
          <button
            onClick={() =>
              document.getElementById('section-quality-sizing')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-start gap-2.5 text-left cursor-pointer"
          >
            <Database className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="font-semibold truncate">1. Quality &amp; Data Sizing</span>
          </button>

          <button
            onClick={() =>
              document
                .getElementById('section-online-offline-r1')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-indigo-500/20 text-slate-200 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-start gap-2.5 text-left cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 text-indigo-400 shrink-0" />
            <span className="font-semibold truncate">2. Online/Offline &amp; R1</span>
          </button>

          <button
            onClick={() =>
              document.getElementById('section-synthetic-data')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-start gap-2.5 text-left cursor-pointer"
          >
            <Wand2 className="h-4 w-4 text-cyan-400 shrink-0" />
            <span className="font-semibold truncate">3. Synthetic &amp; Templates</span>
          </button>

          <button
            onClick={() =>
              document.getElementById('section-mixing-rewards')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-start gap-2.5 text-left cursor-pointer"
          >
            <Sliders className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="font-semibold truncate">4. Mixing &amp; Rewards</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: QUALITY VS SCALE, EVAL-FIRST & LORA SIZING     */}
      {/* ========================================================= */}
      <section id="section-quality-sizing" className="space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Database className="h-4 w-4" /> Section 1 · Quality Over Scale &amp; Eval-First Sizing
          </div>
          <h2 className="text-2xl font-bold text-white">
            Pre-Training Scale vs. Post-Training Quality, Eval-First Check &amp; LoRA Sizing
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Pre-training is about massive scale (~20 tokens per parameter; GPT-3 used ~300B tokens), whereas post-training reshapes behavior with far fewer, higher-quality examples (ChatGPT used ~13k SFT &amp; &lt;1M preference pairs). Always run evals on the base model first to estimate how much data your task needs.
          </p>
        </div>

        {/* Eval-First Diagnostic + Empirical Sizing Ladder */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 glass-panel rounded-2xl p-5 space-y-4 border-amber-500/30">
            <div className="text-xs font-mono font-bold text-amber-300 uppercase border-b border-slate-800 pb-2">
              Eval-First Diagnostic: What Does Your Base Model Already Know?
            </div>
            <div className="space-y-2">
              {READINESS_CASES.map((rc, idx) => (
                <button
                  key={rc.id}
                  onClick={() => setReadinessIdx(idx)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                    readinessIdx === idx
                      ? rc.color
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {rc.label}
                </button>
              ))}
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              <div className="font-mono font-bold text-white">{activeReadiness.verdict}</div>
              <p className="text-slate-300 leading-relaxed">{activeReadiness.detail}</p>
            </div>
          </div>

          <div className="lg:col-span-6 glass-panel rounded-2xl p-5 space-y-4 border-indigo-500/30">
            <div className="text-xs font-mono font-bold text-indigo-300 uppercase border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <Layers className="h-4 w-4" /> Empirical Fine-Tuning Data Ladder &amp; LoRA Behavior
            </div>
            <div className="space-y-2 text-xs">
              {DATA_SIZING_LADDER.map((tier) => (
                <div
                  key={tier.count}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3"
                >
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold shrink-0 w-14 text-center">
                    {tier.count}
                  </span>
                  <div>
                    <div className="font-bold text-white">{tier.useCase}</div>
                    <div className="text-slate-400 text-[11px]">{tier.note}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-indigo-200">
              <strong>LoRA vs. Full FT:</strong> Low-rank LoRA shines on smaller targeted datasets; as rank increases to maximum, LoRA converges to full fine-tuning.
            </div>
          </div>
        </div>

        {/* Figures 1-3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FigureCard
            figureNumber={1}
            title="Post-Training Needs Less Data Than Pre-Training"
            src="/images/post_train_data_scale_vs_quality.png"
            alt="Pre-training scale (300B tokens) vs post-training quality (13k SFT and preference data)"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={2}
            title="Eval Always First on Your Pre-Trained Model"
            src="/images/post_train_data_eval_first_pretrain.png"
            alt="If knowledge is not in pre-training, post-training cannot create it cheaply"
            onExpand={setModalImage}
          />
          <div className="md:col-span-2">
            <FigureCard
              figureNumber={3}
              title="Empirical Data Sizing (20 to 100K) & LoRA vs. Full Fine-Tuning"
              src="/images/post_train_data_lora_sizing.png"
              alt="Empirical fine-tuning dataset sizes and LoRA rank behavior"
              onExpand={setModalImage}
            />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: ONLINE VS OFFLINE PREFERENCE & DEEPSEEK-R1     */}
      {/* ========================================================= */}
      <section id="section-online-offline-r1" className="space-y-6 pt-2">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <RefreshCw className="h-4 w-4" /> Section 2 · Preference Loops &amp; DeepSeek-R1 Data Pipeline
          </div>
          <h2 className="text-2xl font-bold text-white">
            Online vs. Offline Preference Learning &amp; DeepSeek-R1 Data Architecture
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Offline preference learning trains once on static pairs for stability, while online preference learning continuously collects fresh judgments on live policy rollouts to shut down new exploits. DeepSeek-R1 demonstrates how frontier labs orchestrate both synthetic reasoning data and non-reasoning data at scale.
          </p>
        </div>

        {/* Interactive Online vs Offline Switcher */}
        <div className="glass-panel rounded-2xl p-6 space-y-4 border-indigo-500/30">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-indigo-400" /> Compare Preference Learning Loops
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPrefMode('online')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border cursor-pointer ${
                  prefMode === 'online'
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                Online Preference Learning
              </button>
              <button
                onClick={() => setPrefMode('offline')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border cursor-pointer ${
                  prefMode === 'offline'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                Offline Preference Learning
              </button>
            </div>
          </div>

          {prefMode === 'online' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-1.5">
                <div className="font-mono font-bold text-indigo-300">How It Works</div>
                <p className="text-slate-300">
                  Model generates live responses &rarr; Human or synthetic raters choose preferences live &rarr; Update RM + LLM incrementally &rarr; Repeat.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                <div className="font-mono font-bold text-emerald-300">Key Strength</div>
                <p className="text-slate-300">
                  Adaptive: actively discovers and patches emerging policy exploits such as repetition or flattery.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                <div className="font-mono font-bold text-amber-300">Tradeoff</div>
                <p className="text-slate-300">
                  More expensive to operate due to continuous human-in-the-loop or synthetic rater inference.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-1.5">
                <div className="font-mono font-bold text-cyan-300">How It Works</div>
                <p className="text-slate-300">
                  Gather pre-collected pairs (e.g., 10k) &rarr; Train RM once offline &rarr; Train LLM with RM &rarr; Evaluate.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                <div className="font-mono font-bold text-emerald-300">Key Strength</div>
                <p className="text-slate-300">
                  Stable, reproducible, and much simpler to orchestrate at lower labeling cost.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1.5">
                <div className="font-mono font-bold text-rose-300">Tradeoff</div>
                <p className="text-slate-300">
                  Limited strictly by static data coverage—cannot explore or correct new out-of-distribution failure modes.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Figures 4-6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FigureCard
            figureNumber={4}
            title="Online Preference Learning Loop"
            src="/images/post_train_data_online_preference.png"
            alt="Online preference learning collecting live preferences and updating RM and LLM incrementally"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={5}
            title="Offline Preference Learning Pipeline"
            src="/images/post_train_data_offline_preference.png"
            alt="Offline preference learning gathering 10k pairs and training RM once"
            onExpand={setModalImage}
          />
          <div className="md:col-span-2">
            <FigureCard
              figureNumber={6}
              title="DeepSeek-R1 Full Data-Driven Pipeline (600K Reasoning + 200K Non-Reasoning)"
              src="/images/post_train_data_deepseek_r1_full.png"
              alt="DeepSeek-R1 data pipeline from DeepSeek-V3 Base through cold-start SFT, GRPO, rejection sampling 600k + 200k non-reasoning, 800k SFT, and final RL"
              onExpand={setModalImage}
            />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: SYNTHETIC DATA, REJECTION SAMPLING & TEMPLATES */}
      {/* ========================================================= */}
      <section id="section-synthetic-data" className="space-y-6 pt-2">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Wand2 className="h-4 w-4" /> Section 3 · Synthetic Data Generation
          </div>
          <h2 className="text-2xl font-bold text-white">
            Constitutional AI, Rejection Sampling (k-to-1) &amp; Template Engineering
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Synthetic data is inexpensive and can achieve very high quality when constructed carefully via Constitutional AI critique/revision, verifier-backed Rejection Sampling, and combinatorial Template Engineering.
          </p>
        </div>

        {/* Rejection Sampling + 5-Stage Practical Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 glass-panel rounded-2xl p-5 space-y-3 border-cyan-500/30 text-xs font-mono">
            <div className="font-bold text-cyan-300 uppercase flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Filter className="h-4 w-4" /> Rejection Sampling (k-to-1 Filtering)
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-rose-300">
              Input: &quot;Solve: 37 &times; 42&quot;
            </div>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30 flex justify-between items-center text-slate-300">
                <span>Output A: 37 &times; 42 = 1600</span>
                <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
              </div>
              <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30 flex justify-between items-center text-slate-300">
                <span>Output B: 37 &times; 42 = 1564</span>
                <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/40 flex justify-between items-center text-emerald-200 font-bold">
                <span>Output C: 37 &times; 42 = 1554</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              </div>
            </div>
            <p className="font-sans text-slate-400 leading-relaxed">
              Generate k candidates, verify or judge each one, and keep only the best verified trajectory for training.
            </p>
          </div>

          <div className="lg:col-span-7 glass-panel rounded-2xl p-5 space-y-4 border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-indigo-300 uppercase flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> 5-Stage Practical Filtering Pipeline
              </span>
              <button
                onClick={() => setRejStepIdx((prev) => (prev + 1) % REJECTION_PIPELINE_STEPS.length)}
                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
              >
                <Play className="h-3 w-3 fill-white" /> Next Stage
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {REJECTION_PIPELINE_STEPS.map((st, idx) => (
                <button
                  key={st.step}
                  onClick={() => setRejStepIdx(idx)}
                  className={`p-2.5 rounded-xl border text-[11px] font-mono font-bold text-left cursor-pointer ${
                    rejStepIdx === idx
                      ? 'bg-indigo-500/20 border-indigo-400/50 text-white'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {st.title}
                </button>
              ))}
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <strong className="text-indigo-300">{REJECTION_PIPELINE_STEPS[rejStepIdx].title}:</strong>{' '}
              {REJECTION_PIPELINE_STEPS[rejStepIdx].detail}
            </div>
          </div>
        </div>

        {/* Interactive Template Engineering Synthesizer */}
        <div className="rounded-2xl border border-cyan-500/30 bg-slate-950/80 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-cyan-400" /> Live Template Engineering Synthesizer
              </h3>
              <p className="text-xs text-slate-400">
                Swap slot values to see how parameterized templates rapidly synthesize diverse training examples ({totalCombos} combinations from just 2 values per slot).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
            <div className="space-y-1">
              <span className="text-slate-400">{'{{customer_name}}'}</span>
              <div className="flex gap-1.5">
                {TEMPLATE_SLOTS.customer_name.map((v) => (
                  <button
                    key={v}
                    onClick={() => setTplCustomer(v)}
                    className={`flex-1 py-1.5 rounded-lg border cursor-pointer ${
                      tplCustomer === v
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400">{'{{product_name}}'}</span>
              <div className="flex flex-col gap-1">
                {TEMPLATE_SLOTS.product_name.map((v) => (
                  <button
                    key={v}
                    onClick={() => setTplProduct(v)}
                    className={`py-1 px-2 rounded-lg border text-left cursor-pointer ${
                      tplProduct === v
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400">{'{{specific_issue}}'}</span>
              <div className="flex flex-col gap-1">
                {TEMPLATE_SLOTS.specific_issue.map((v) => (
                  <button
                    key={v}
                    onClick={() => setTplIssue(v)}
                    className={`py-1 px-2 rounded-lg border text-left cursor-pointer ${
                      tplIssue === v
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400">{'{{resolution_step}}'}</span>
              <div className="flex flex-col gap-1">
                {TEMPLATE_SLOTS.resolution_step.map((v) => (
                  <button
                    key={v}
                    onClick={() => setTplResolution(v)}
                    className={`py-1 px-2 rounded-lg border text-left cursor-pointer ${
                      tplResolution === v
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 font-mono text-xs text-emerald-100 leading-relaxed">
            &quot;Hello <span className="text-cyan-300 font-bold">{tplCustomer}</span>, I understand you&apos;re having an issue with your <span className="text-cyan-300 font-bold">{tplProduct}</span> where it <span className="text-cyan-300 font-bold">{tplIssue}</span>. I&apos;ve taken the action to <span className="text-cyan-300 font-bold">{tplResolution}</span>.&quot;
          </div>
        </div>

        {/* Figures 7-10 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FigureCard
            figureNumber={7}
            title="Synthetic Data Recipe in Constitutional AI"
            src="/images/post_train_data_cai_synthetic.png"
            alt="Constitutional AI generating synthetic SFT critiques and RLAIF preference pairs"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={8}
            title="Rejection Sampling (37 x 42, k-to-1 Filtering)"
            src="/images/post_train_data_rejection_sampling.png"
            alt="Rejection sampling keeping the 1 correct answer out of 3 candidate outputs"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={9}
            title="5-Stage Practical Rejection Sampling Pipeline"
            src="/images/post_train_data_rejection_pipeline.png"
            alt="Practical pipeline from k candidates through constitution judge, pairwise ranking, self-consistency, and top N selection"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={10}
            title="Template Engineering for Synthetic Data"
            src="/images/post_train_data_template_engineering.png"
            alt="Template with customer_name, product_name, specific_issue, and resolution_step slots"
            onExpand={setModalImage}
          />
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: DATA MIXING & REWARD BALANCING                 */}
      {/* ========================================================= */}
      <section id="section-mixing-rewards" className="space-y-6 pt-2">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Sliders className="h-4 w-4" /> Section 4 · Data Mixing &amp; Reward Balancing
          </div>
          <h2 className="text-2xl font-bold text-white">
            Balancing Breadth vs. Depth (Data Mixing) &amp; Multi-Objective Rewards
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Over-indexing on a single domain causes catastrophic regressions on everyday tasks, while optimizing a single reward objective (helpfulness alone) leads to unsafe oversharing. Both data ratios and reward weights must be explicitly balanced.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interactive Data Mixing Card */}
          <div className="glass-panel rounded-2xl p-5 space-y-4 border-purple-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-purple-300 uppercase">
                Data Mixing (Breadth vs. Depth)
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setMixPreset('imbalanced')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border cursor-pointer ${
                    mixPreset === 'imbalanced'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  90 / 10 (Skewed)
                </button>
                <button
                  onClick={() => setMixPreset('balanced')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border cursor-pointer ${
                    mixPreset === 'balanced'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  60 / 30 / 10 (Balanced)
                </button>
              </div>
            </div>

            {mixPreset === 'imbalanced' ? (
              <div className="space-y-3 text-xs">
                <div className="h-4 rounded-full overflow-hidden flex font-mono text-[10px] font-bold">
                  <div className="bg-purple-600 text-white flex items-center justify-center" style={{ width: '90%' }}>
                    90% Coding Q&amp;A
                  </div>
                  <div className="bg-slate-600 text-white flex items-center justify-center" style={{ width: '10%' }}>
                    10%
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/40 text-rose-200 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Error Analysis:</strong> Great at coding, but fails simple everyday queries like &quot;What is the color of the sky?&quot;
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="h-4 rounded-full overflow-hidden flex font-mono text-[10px] font-bold">
                  <div className="bg-indigo-600 text-white flex items-center justify-center" style={{ width: '60%' }}>
                    60% General QA
                  </div>
                  <div className="bg-purple-600 text-white flex items-center justify-center" style={{ width: '30%' }}>
                    30% Coding
                  </div>
                  <div className="bg-emerald-600 text-white flex items-center justify-center" style={{ width: '10%' }}>
                    10%
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-emerald-200 flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Fix:</strong> Rebalancing to 60% General QA, 30% Coding, and 10% Safety preserves core world fluency while keeping strong coding depth.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Reward Balancing Card */}
          <div className="glass-panel rounded-2xl p-5 space-y-4 border-emerald-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-emerald-300 uppercase flex items-center gap-1.5">
                <Scale className="h-4 w-4" /> Multi-Objective Reward Balancing
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setRewardPreset('unbalanced')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border cursor-pointer ${
                    rewardPreset === 'unbalanced'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  Helpfulness Only
                </button>
                <button
                  onClick={() => setRewardPreset('balanced')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border cursor-pointer ${
                    rewardPreset === 'balanced'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  0.4 / 0.4 / 0.2
                </button>
              </div>
            </div>

            {rewardPreset === 'unbalanced' ? (
              <div className="space-y-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <MathFormula math="R = 1.0 \times \text{helpfulness}" block />
                </div>
                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/40 text-rose-200">
                  <strong>Problem:</strong> The model overshares, giving unsafe or speculative answers (e.g., medical advice with no caveats).
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <MathFormula
                    math="R = 0.4 \times \text{helpfulness} + 0.4 \times \text{safety} + 0.2 \times \text{truthfulness}"
                    block
                  />
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-emerald-200">
                  <strong>Fix:</strong> Multi-objective weighting aligns policy behavior directly with real-world deployment values.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Figures 11-12 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FigureCard
            figureNumber={11}
            title="Data Mixing: Adjusting Breadth vs. Depth"
            src="/images/post_train_data_mixing.png"
            alt="Rebalancing 90/10 coding/general dataset to 60% general QA, 30% coding, 10% safety"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={12}
            title="Balancing Rewards in the Reward Function"
            src="/images/post_train_data_reward_balancing.png"
            alt="Redefining reward as 0.4 helpfulness + 0.4 safety + 0.2 truthfulness"
            onExpand={setModalImage}
          />
        </div>
      </section>

      {/* ========================================================= */}
      {/* MODAL IMAGE EXPAND VIEW                                   */}
      {/* ========================================================= */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setModalImage(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm sm:text-base font-bold text-white font-mono">
                {modalImage.title}
              </h4>
              <button
                onClick={() => setModalImage(null)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>

            <div className="flex justify-center items-center bg-white/95 rounded-xl p-2 max-h-[75vh] overflow-auto">
              <Image
                src={modalImage.src}
                alt={modalImage.alt}
                width={1200}
                height={700}
                unoptimized
                className="rounded-lg object-contain w-auto h-auto max-h-[70vh]"
              />
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400 font-mono pt-1">
              <span>Source: Data Driven post training.docx</span>
              <button
                onClick={() => setModalImage(null)}
                className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
