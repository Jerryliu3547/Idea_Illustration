"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { getAssetPath } from '@/lib/asset';
import { MathFormula } from '@/components/ui/MathFormula';
import {
  Bookmark,
  Brain,
  CheckCircle2,
  Cpu,
  Database,
  GitBranch,
  Layers,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sliders,
  Terminal,
  Workflow,
  XCircle,
  ArrowRight,
  Globe,
  Image as ImageIcon,
  BookOpen,
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

/**
 * Reusable figure card with click-to-zoom modal support.
 */
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
          <span className="text-xs font-mono text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 shrink-0">
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

type LifecycleStage = 'pretrain' | 'midtrain';
type MidtrainCapability = 'languages' | 'multimodality' | 'context';
type PostMethodTab = 'sft' | 'rl';
type NeedsDimension = 'data' | 'grader' | 'stability' | 'compute';
type ReasoningMode = 'think_debug' | 'sft_cot' | 'rl_reasoning';

const PRETRAIN_TOKENS = [
  { token: 'orange', prob: 0.3892, highlight: true },
  { token: 'red', prob: 0.2156, highlight: false },
  { token: 'pink', prob: 0.1743, highlight: false },
  { token: 'the', prob: 0.0987, highlight: false },
  { token: 'blue', prob: 0.0421, highlight: false },
];

const MIDTRAIN_CAPABILITIES: Record<
  MidtrainCapability,
  {
    label: string;
    title: string;
    goal: string;
    examples: { input: string; output: string }[];
  }
> = {
  languages: {
    label: 'Add New Languages',
    title: 'Multilingual Expansion via Continuous Pre-Training',
    goal: 'Continues next-token training on curated multilingual corpora so the base model transfers world knowledge across scripts and languages.',
    examples: [
      { input: 'What is the moon?', output: "The Moon is Earth's only natural satellite" },
      { input: '什么是月球？', output: '月球是地球唯一的天然卫星。' },
      { input: 'चाँद क्या है?', output: 'चाँद पृथ्वी का एकमात्र प्राकृतिक उपग्रह है।' },
    ],
  },
  multimodality: {
    label: 'Add Multimodality',
    title: 'Cross-Modal Alignment (Images & Audio)',
    goal: 'Projects visual patches and audio spectrograms into the LLM token embedding space so the model can reason over images and MP3 audio clips.',
    examples: [
      {
        input: '[Image: Full Moon] What is this?',
        output: "That's a photograph of a full moon set against a dark sky.",
      },
      {
        input: '[Audio: moon_poem.mp3] What is this?',
        output: "That's an audio with a poem about the moon.",
      },
    ],
  },
  context: {
    label: 'Increase Context Length',
    title: 'Long-Context Window Extension',
    goal: 'Adjusts positional encodings (e.g., RoPE base frequency scaling) and trains on long documents so the model can synthesize entire book chapters.',
    examples: [
      {
        input: 'Context: [Full Apollo / JFK Speech & Saturn V Chapter] Question: What does this book talk about?',
        output: "It's a history book about how humans reached the moon.",
      },
    ],
  },
};

const FRONTIER_PIPELINE_STEPS = [
  {
    step: 1,
    name: 'Base Model',
    tag: 'Pre-trained + Mid-trained',
    color: 'border-slate-600 bg-slate-900 text-slate-200',
    desc: 'Possesses broad raw world knowledge and next-token fluency, but struggles to follow instructions reliably or refuse harmful requests.',
  },
  {
    step: 2,
    name: 'Fine-Tuning (SFT)',
    tag: 'Imitation Learning',
    color: 'border-indigo-500/40 bg-indigo-950/30 text-indigo-300',
    desc: 'Trains on high-quality {input, output} demonstrations so the model learns formatting, tone, and step-by-step patterns.',
  },
  {
    step: 3,
    name: 'Reinforcement Learning (RL)',
    tag: 'Reward Optimization',
    color: 'border-purple-500/40 bg-purple-950/30 text-purple-300',
    desc: 'Explores multiple candidate trajectories and optimizes policy weights against a grader/reward signal, unlocking capabilities beyond static demonstrations.',
  },
  {
    step: 4,
    name: 'New Aligned Model',
    tag: 'Production Ready',
    color: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300',
    desc: 'Combines the stability and instruction-following of SFT with the generalization and reasoning power of RL.',
  },
];

const NEEDS_MATRIX: Record<
  NeedsDimension,
  {
    label: string;
    sft: string;
    sftNote: string;
    rl: string;
    rlNote: string;
    winner: 'SFT' | 'RL' | 'Depends';
  }
> = {
  data: {
    label: 'Data Requirements',
    sft: 'Good {input, output} data upfront',
    sftNote: 'May be hard to gather high-quality target outputs at scale.',
    rl: 'Input data only (prompts)',
    rlNote: 'Model generates its own candidate outputs during rollouts.',
    winner: 'RL',
  },
  grader: {
    label: 'Grader / Verifier',
    sft: 'None (-)',
    sftNote: 'Supervised cross-entropy loss compares directly against ground-truth target tokens.',
    rl: 'Good graders required',
    rlNote: 'Verifiers or reward models may be hard to create, calibrate, and tune against reward hacking.',
    winner: 'SFT',
  },
  stability: {
    label: 'Training Stability',
    sft: 'More stable',
    sftNote: 'Standard supervised gradient descent converges smoothly and predictably.',
    rl: 'Less stable',
    rlNote: 'On-policy rollouts and non-stationary rewards require KL constraints and clipping.',
    winner: 'SFT',
  },
  compute: {
    label: 'Compute Cost',
    sft: 'Less compute',
    sftNote: 'Works well with parameter-efficient methods (e.g., LoRA/QLoRA) and short runs.',
    rl: 'More compute',
    rlNote: 'Requires online generation rollouts, reward scoring, and iterative policy updates.',
    winner: 'SFT',
  },
};

const DEEPSEEK_R1_STAGES = [
  {
    stage: 0,
    title: 'DS-V3-Base',
    badge: 'Starting Checkpoint',
    dataset: 'Pre-trained DeepSeek-V3 Base',
    mechanism: 'Raw base model with strong general knowledge, before any reasoning-specific post-training.',
    outcome: 'Ready for cold-start CoT formatting.',
    color: 'border-slate-600 bg-slate-900/80 text-slate-200',
  },
  {
    stage: 1,
    title: 'Stage 1: Cold-Start Fine-Tuning',
    badge: 'SFT (~K samples)',
    dataset: 'Long CoT Data (~K curated samples)',
    mechanism: 'Fine-tunes DS-V3-Base on thousands of clean, readable <think> + <answer> examples.',
    outcome: 'Stabilizes reasoning format and prevents unreadable language mixing prior to RL.',
    color: 'border-amber-500/40 bg-amber-950/30 text-amber-300',
  },
  {
    stage: 2,
    title: 'Stage 2: Reasoning-Oriented RL',
    badge: 'RL (144K samples)',
    dataset: 'Reasoning: CoT, Math, Code (144K samples)',
    mechanism: 'Applies rule-based accuracy & format rewards (verifiers) to drive emergent self-reflection and verification.',
    outcome: 'Produces a Reasoning-Oriented RL Checkpoint.',
    color: 'border-rose-500/40 bg-rose-950/30 text-rose-300',
  },
  {
    stage: 3,
    title: 'Stage 3: Rejection-Sampled SFT',
    badge: 'SFT (600K + 200K)',
    dataset: 'Filtered Reasoning (600K) + Non-Reasoning Data (200K)',
    mechanism: 'Filters high-quality traces from the RL checkpoint and mixes them with general helpfulness/writing data.',
    outcome: 'Balances deep reasoning with general-purpose chat capabilities.',
    color: 'border-indigo-500/40 bg-indigo-950/30 text-indigo-300',
  },
  {
    stage: 4,
    title: 'Stage 4: All-Scenario RL -> DS-R1',
    badge: 'Final RL Alignment',
    dataset: 'Rule-based + Preference Rewards (Reasoning & Non-Reasoning)',
    mechanism: 'Final RL pass across both verifiable reasoning tasks and general helpfulness/safety prompts.',
    outcome: 'Produces the final DeepSeek-R1 (DS-R1) model.',
    color: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300',
  },
];

const CAI_PIPELINE_STEPS = [
  {
    phase: 'Phase 1: Supervised Learning (SL-CAI)',
    title: '1. Write Constitution',
    detail: 'Human authors define explicit normative principles (e.g., never collect sensitive PII like full SSNs).',
  },
  {
    phase: 'Phase 1: Supervised Learning (SL-CAI)',
    title: '2. Generate {input, output} Pairs',
    detail: 'Sample initial responses from the base LLM across red-teaming or sensitive user prompts.',
  },
  {
    phase: 'Phase 1: Supervised Learning (SL-CAI)',
    title: '3. Critique & Revise Outputs',
    detail: 'The LLM critiques its own draft against the constitution and rewrites a compliant response.',
  },
  {
    phase: 'Phase 1: Supervised Learning (SL-CAI)',
    title: '4. Fine-Tuning -> Fine-Tuned Model',
    detail: 'Perform SFT on the revised constitutional responses to shift the base distribution.',
  },
  {
    phase: 'Phase 2: RL from AI Feedback (RLAIF)',
    title: '5. Generate 2 Outputs per Input',
    detail: 'Sample candidate pairs (Output A, Output B) from the fine-tuned model.',
  },
  {
    phase: 'Phase 2: RL from AI Feedback (RLAIF)',
    title: '6. AI Selects Better Output',
    detail: 'An AI grader evaluates both outputs against the written constitution and picks the winner.',
  },
  {
    phase: 'Phase 2: RL from AI Feedback (RLAIF)',
    title: '7. Train Reward Model (SM)',
    detail: 'Train a preference Reward Model on {input, output, reward} tuples without human labelers.',
  },
  {
    phase: 'Phase 2: RL from AI Feedback (RLAIF)',
    title: '8. RL Optimization -> Aligned Model',
    detail: 'Optimize the LLM policy against the Reward Model to produce the final Aligned Model.',
  },
];

export const IntroPostTrainingVisualizer: React.FC = () => {
  const [modalImage, setModalImage] = useState<ModalImageState | null>(null);

  // Section 1 state
  const [lifecycleStage, setLifecycleStage] = useState<LifecycleStage>('pretrain');
  const [showRepetitionFailure, setShowRepetitionFailure] = useState<boolean>(false);
  const [midtrainCap, setMidtrainCap] = useState<MidtrainCapability>('languages');

  // Section 2 state
  const [postMethod, setPostMethod] = useState<PostMethodTab>('rl');
  const [activePipelineStep, setActivePipelineStep] = useState<number>(2);
  const [activeNeed, setActiveNeed] = useState<NeedsDimension>('data');

  // Section 3 state
  const [reasoningMode, setReasoningMode] = useState<ReasoningMode>('rl_reasoning');
  const [r1Stage, setR1Stage] = useState<number>(2);

  // Section 4 state
  const [selectedCaiOutput, setSelectedCaiOutput] = useState<'A' | 'B'>('B');
  const [caiStepIdx, setCaiStepIdx] = useState<number>(5);

  const activeMidtrain = MIDTRAIN_CAPABILITIES[midtrainCap];
  const activeNeedData = NEEDS_MATRIX[activeNeed];
  const activeR1 = DEEPSEEK_R1_STAGES[r1Stage];

  return (
    <div className="space-y-10">
      {/* ========================================================= */}
      {/* STICKY QUICK SECTION BOOKMARKS BAR                        */}
      {/* ========================================================= */}
      <div className="sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border border-indigo-500/40 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400">
          <Bookmark className="h-4 w-4 text-indigo-400" />
          <span>Quick Section Bookmarks:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-mono">
          <button
            onClick={() =>
              document.getElementById('section-lifecycle')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-start gap-2.5 text-left cursor-pointer"
          >
            <Layers className="h-4 w-4 text-cyan-400 shrink-0" />
            <span className="font-semibold truncate">1. Pre &amp; Mid-Training</span>
          </button>

          <button
            onClick={() =>
              document.getElementById('section-sft-vs-rl')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-indigo-500/20 text-slate-200 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-start gap-2.5 text-left cursor-pointer"
          >
            <Sliders className="h-4 w-4 text-indigo-400 shrink-0" />
            <span className="font-semibold truncate">2. SFT vs. RL Foundations</span>
          </button>

          <button
            onClick={() =>
              document.getElementById('section-reasoning')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-start gap-2.5 text-left cursor-pointer"
          >
            <Brain className="h-4 w-4 text-purple-400 shrink-0" />
            <span className="font-semibold truncate">3. Reasoning &amp; DeepSeek-R1</span>
          </button>

          <button
            onClick={() =>
              document.getElementById('section-rlaif')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-start gap-2.5 text-left cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="font-semibold truncate">4. RLAIF &amp; Constitutional AI</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: PRE-TRAINING & MID-TRAINING OVERVIEW           */}
      {/* ========================================================= */}
      <section id="section-lifecycle" className="space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Layers className="h-4 w-4" /> Section 1 · Model Training Overview
          </div>
          <h2 className="text-2xl font-bold text-white">
            Before Post-Training: Pre-Training &amp; Mid-Training (Continuous Pre-Training)
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Pre-training builds raw world knowledge by predicting next-token probabilities, while mid-training continuously adapts the base model to new languages, modalities, and longer context windows before post-training begins.
          </p>
        </div>

        {/* Math Formulation */}
        <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800">
          <span className="text-xs font-mono text-cyan-400 font-semibold block mb-1">
            Autoregressive Next-Token Prediction Objective (Pre-Training &amp; Mid-Training)
          </span>
          <MathFormula
            math="\mathcal{L}_{\text{Pretrain}}(\theta) = -\sum_{t=1}^{T} \log P_\theta(x_t \mid x_1, x_2, \dots, x_{t-1})"
            block
          />
        </div>

        {/* Interactive Stage Switcher */}
        <div className="glass-panel rounded-2xl p-6 space-y-5 border-cyan-500/30">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="h-4 w-4 text-cyan-400" /> Interactive Lifecycle Explorer
              </h3>
              <p className="text-xs text-slate-400">
                Inspect how raw next-token prediction behaves in Pre-training vs. what Mid-training unlocks.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLifecycleStage('pretrain')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                  lifecycleStage === 'pretrain'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                1. Pre-Training
              </button>
              <button
                onClick={() => setLifecycleStage('midtrain')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                  lifecycleStage === 'midtrain'
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                2. Mid-Training (Continuous)
              </button>
            </div>
          </div>

          {lifecycleStage === 'pretrain' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                    Next-Token Probability Distribution
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Prompt: &quot;The sun is setting, the sky is ___&quot;
                  </span>
                </div>
                <div className="space-y-2">
                  {PRETRAIN_TOKENS.map((item) => (
                    <div key={item.token} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className={item.highlight ? 'text-amber-300 font-bold' : 'text-slate-300'}>
                          {item.token}
                        </span>
                        <span className="text-slate-400">{item.prob.toFixed(4)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.highlight ? 'bg-amber-400' : 'bg-cyan-500/60'
                          }`}
                          style={{ width: `${Math.round(item.prob * 100 * 2.2)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                      Base Model Behaviour Check
                    </span>
                    <button
                      onClick={() => setShowRepetitionFailure(!showRepetitionFailure)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-900 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
                    >
                      {showRepetitionFailure ? 'Show Normal Continuation' : 'Simulate Raw Gibberish'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Pre-training gives the model raw knowledge like a child learning to speak: it knows statistical continuations, yet without post-training it can easily drift or repeat tokens.
                  </p>
                </div>

                <div
                  className={`p-3.5 rounded-xl border font-mono text-xs leading-relaxed ${
                    showRepetitionFailure
                      ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                      : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                  }`}
                >
                  {showRepetitionFailure
                    ? 'Base LLM Output: "today is good day day day day day..." (unaligned repetition loop)'
                    : 'Base LLM Output: "The sun is setting, the sky is orange and glowing over the horizon."'}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: 'languages', icon: Globe },
                    { id: 'multimodality', icon: ImageIcon },
                    { id: 'context', icon: BookOpen },
                  ] as const
                ).map(({ id, icon: CapIcon }) => {
                  const active = midtrainCap === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setMidtrainCap(id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border flex items-center gap-2 transition-all cursor-pointer ${
                        active
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <CapIcon className="h-3.5 w-3.5" />
                      {MIDTRAIN_CAPABILITIES[id].label}
                    </button>
                  );
                })}
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white">{activeMidtrain.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{activeMidtrain.goal}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {activeMidtrain.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 space-y-2 text-xs font-mono"
                    >
                      <div className="text-rose-300">Input: {ex.input}</div>
                      <div className="text-emerald-300 border-t border-slate-800 pt-2">
                        Output: {ex.output}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Figures 1-4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FigureCard
            figureNumber={1}
            title="Pre-Training Next-Token Probability"
            src="/images/post_train_intro_pretraining.png"
            alt="Pre-training next-token probability table for The sun is setting, the sky is orange"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={2}
            title="Mid-Training: Adding New Languages"
            src="/images/post_train_intro_mid_languages.png"
            alt="Mid-training continuous pre-training adding English, Chinese, and Hindi"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={3}
            title="Mid-Training: Adding Multimodality"
            src="/images/post_train_intro_mid_multimodality.png"
            alt="Mid-training continuous pre-training adding image and MP3 audio modalities"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={4}
            title="Mid-Training: Increasing Context Length Limits"
            src="/images/post_train_intro_mid_context_length.png"
            alt="Mid-training continuous pre-training extending context length to process a full book chapter"
            onExpand={setModalImage}
          />
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: POST-TRAINING FOUNDATIONS (SFT VS. RL)         */}
      {/* ========================================================= */}
      <section id="section-sft-vs-rl" className="space-y-6 pt-2">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Sliders className="h-4 w-4" /> Section 2 · Post-Training Paradigms
          </div>
          <h2 className="text-2xl font-bold text-white">
            Fine-Tuning (SFT) vs. Reinforcement Learning (RL) &amp; Frontier Recipe
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Fine-tuning mimics step-by-step demonstrations in your dataset, whereas Reinforcement Learning optimizes toward a reward signal without prescribing how the model reaches the answer. Frontier labs combine both: Base Model &rarr; Fine-Tuning &rarr; RL &rarr; New Model.
          </p>
        </div>

        {/* SFT vs RL Equations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-indigo-500/30">
            <span className="text-xs font-mono text-indigo-400 font-semibold block mb-1">
              Supervised Fine-Tuning (Imitation Objective)
            </span>
            <MathFormula
              math="\mathcal{L}_{\text{SFT}}(\theta) = -\mathbb{E}_{(x,y) \sim \mathcal{D}_{\text{demo}}} \left[ \sum_{t} \log \pi_\theta(y_t \mid x, y_{<t}) \right]"
              block
            />
          </div>
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-purple-500/30">
            <span className="text-xs font-mono text-purple-400 font-semibold block mb-1">
              Reinforcement Learning (Reward Maximization)
            </span>
            <MathFormula
              math="\max_\theta \; \mathbb{E}_{x \sim \mathcal{D},\, y \sim \pi_\theta(\cdot \mid x)} \left[ R(x, y) \right]"
              block
            />
          </div>
        </div>

        {/* Interactive SFT vs RL Safety Example + Frontier Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 glass-panel rounded-2xl p-5 space-y-4 border-indigo-500/30">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-indigo-300 uppercase">
                Intuition Sandbox: Safety Refusal
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPostMethod('sft')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border cursor-pointer ${
                    postMethod === 'sft'
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  Fine-Tuning (SFT)
                </button>
                <button
                  onClick={() => setPostMethod('rl')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border cursor-pointer ${
                    postMethod === 'rl'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  Reinforcement Learning (RL)
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs font-mono text-rose-200">
              <span className="text-rose-400 font-bold">Input Prompt:</span> &quot;How do I make a dangerous weapon at home?&quot;
            </div>

            {postMethod === 'sft' ? (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2 text-xs">
                  <div className="font-mono font-bold text-indigo-300">
                    Target Output (Mimicked Token-by-Token)
                  </div>
                  <p className="text-slate-200 font-mono">
                    &quot;I cannot provide instructions for creating harmful devices.&quot;
                  </p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  SFT forces the model to imitate the exact target completion provided in the dataset. It is stable and cheap, but bounded by the quality and coverage of human/synthetic demonstrations.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-rose-300 font-bold">Rollout A</span>
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                        Reward: -1
                      </span>
                    </div>
                    <p className="text-slate-300">
                      &quot;Here is how to make a dangerous weapon... mix these chemicals...&quot;
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-300 font-bold">Rollout B</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        Reward: +1
                      </span>
                    </div>
                    <p className="text-slate-200">
                      &quot;I cannot provide instructions for creating harmful devices.&quot;
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  RL samples multiple candidate trajectories and reinforces high-reward behaviors while penalizing unsafe ones, enabling the discovery of novel strategies.
                </p>
              </div>
            )}
          </div>

          {/* Interactive Needs Matrix & Frontier Pipeline */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-5 space-y-4 border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase block">
              Engineering Tradeoffs: SFT vs. RL Needs
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(NEEDS_MATRIX) as NeedsDimension[]).map((dim) => (
                <button
                  key={dim}
                  onClick={() => setActiveNeed(dim)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border text-left transition-all cursor-pointer ${
                    activeNeed === dim
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {NEEDS_MATRIX[dim].label}
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/30 space-y-1">
                <div className="font-mono font-bold text-indigo-300">
                  Fine-Tuning: {activeNeedData.sft}
                </div>
                <div className="text-slate-400">{activeNeedData.sftNote}</div>
              </div>
              <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-500/30 space-y-1">
                <div className="font-mono font-bold text-purple-300">
                  RL: {activeNeedData.rl}
                </div>
                <div className="text-slate-400">{activeNeedData.rlNote}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Frontier Lab Combined Pipeline Stepper */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
              <Workflow className="h-4 w-4" /> Frontier Lab Recipe: Best of Both Worlds
            </span>
            <span className="text-xs font-mono text-slate-400">
              Click any stage to inspect its role
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {FRONTIER_PIPELINE_STEPS.map((s, idx) => {
              const isSelected = activePipelineStep === idx;
              return (
                <button
                  key={s.step}
                  onClick={() => setActivePipelineStep(idx)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                    isSelected
                      ? `${s.color} ring-1 ring-indigo-400/50`
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase opacity-80">
                    Stage {s.step} · {s.tag}
                  </div>
                  <div className="text-sm font-bold text-white flex items-center justify-between">
                    <span>{s.name}</span>
                    {idx < 3 && <ArrowRight className="h-3.5 w-3.5 opacity-60 hidden lg:block" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <strong className="text-white">
              {FRONTIER_PIPELINE_STEPS[activePipelineStep].name}:
            </strong>{' '}
            {FRONTIER_PIPELINE_STEPS[activePipelineStep].desc}
          </div>
        </div>

        {/* Figures 5-7 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FigureCard
            figureNumber={5}
            title="Post-Training Methods: Fine-Tuning vs. RL"
            src="/images/post_train_intro_sft_vs_rl.png"
            alt="Comparison between fine-tuning target output and RL reward scoring"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={6}
            title="Frontier Lab Pipeline: Base -> SFT -> RL -> New Model"
            src="/images/post_train_intro_base_sft_rl_pipeline.png"
            alt="Pipeline from Base Model to Fine-tuning to RL to New Model"
            onExpand={setModalImage}
          />
          <div className="md:col-span-2">
            <FigureCard
              figureNumber={7}
              title="Fine-Tuning & RL Engineering Needs (Data, Grader, Stability, Compute)"
              src="/images/post_train_intro_sft_rl_needs_table.png"
              alt="Comparison table of Data, Grader, Stability, and Compute needs for Fine-tuning vs RL"
              onExpand={setModalImage}
            />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: REASONING POST-TRAINING & DEEPSEEK-R1 PIPELINE */}
      {/* ========================================================= */}
      <section id="section-reasoning" className="space-y-6 pt-2">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Brain className="h-4 w-4" /> Section 3 · Post-Training for Reasoning
          </div>
          <h2 className="text-2xl font-bold text-white">
            &lt;think&gt; Tokens, SFT vs. RL for Reasoning &amp; DeepSeek-R1 Pipeline
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Modern reasoning models allocate explicit <code className="text-purple-300 font-mono text-xs">&lt;think&gt;...&lt;/think&gt;</code> tokens to form hypotheses before answering. Combining CoT Fine-Tuning with answer-verified RL forms the backbone of the DeepSeek-R1 training recipe.
          </p>
        </div>

        {/* Math */}
        <div className="bg-slate-950/80 rounded-2xl p-4 border border-purple-500/30">
          <span className="text-xs font-mono text-purple-400 font-semibold block mb-1">
            Latent / Explicit Reasoning Decomposition
          </span>
          <MathFormula
            math="\pi_\theta(z_{\text{think}}, y_{\text{answer}} \mid x) = \pi_\theta(y_{\text{answer}} \mid x, z_{\text{think}}) \cdot \pi_\theta(z_{\text{think}} \mid x)"
            block
          />
        </div>

        {/* Interactive Reasoning Mode Switcher */}
        <div className="glass-panel rounded-2xl p-6 space-y-5 border-purple-500/30">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="h-4 w-4 text-purple-400" /> Interactive &lt;think&gt; Token Explorer
            </span>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: 'think_debug', label: '1. Debugging <think> Trace' },
                  { id: 'sft_cot', label: '2. Fine-Tuning (CoT Process)' },
                  { id: 'rl_reasoning', label: '3. RL (Answer-Only Grader)' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setReasoningMode(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                    reasoningMode === tab.id
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {reasoningMode === 'think_debug' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-amber-300 font-bold">User Bug Report</div>
                <p className="text-slate-300 leading-relaxed">
                  &quot;For some reason, a login loop occurs when someone signs up, and then attempts to log in: [Error] Unhandled Promise Rejection: TypeError: undefined is not an object (evaluating &apos;supabase.auth&apos;)&quot;
                </p>
              </div>
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/40 space-y-2">
                <div className="text-purple-300 font-bold">Internal &lt;think&gt; Scratchpad</div>
                <pre className="text-purple-100 whitespace-pre-wrap leading-relaxed">
{`<think>
- Input: User reports login loop, screenshot shows error.
- Hypothesis 1: supabase object not initialized...
Conclusion: Provide sample code to correctly init supabase client and guard auth.
</think>`}
                </pre>
              </div>
            </div>
          )}

          {reasoningMode === 'sft_cot' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-3 text-xs font-mono">
              <div className="text-indigo-300 font-bold">
                Fine-Tuning for Reasoning: Learns patterns in the &lt;think&gt; process
              </div>
              <div className="text-rose-300">
                Input: &quot;Alice has 3 apples and buys 2 more. How many now?&quot;
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-cyan-200 space-y-1">
                <div>&lt;think&gt; Start with 3. Buys 2 &rArr; 3+2=5. &lt;/think&gt;</div>
                <div className="text-emerald-300">&lt;answer&gt;5&lt;/answer&gt;</div>
              </div>
              <p className="font-sans text-slate-400">
                Using a ~2-10k domain CoT dataset teaches the model structured step-by-step formatting and reasoning style.
              </p>
            </div>
          )}

          {reasoningMode === 'rl_reasoning' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-emerald-300 font-bold">
                  RL for Reasoning: Only Grades the Final Answer!
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  Grader: output == 5 &rarr; Correct
                </span>
              </div>
              <div className="text-rose-300">
                Input: &quot;Carly has 8 apples and buys 2 more, but then sells 5 to the local baker. How many now?&quot;
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-cyan-200 space-y-1">
                <div>&lt;think&gt; 8+2-5=5 &lt;/think&gt;</div>
                <div className="text-emerald-300">&lt;answer&gt;5&lt;/answer&gt;</div>
              </div>
              <p className="font-sans text-slate-400">
                Because the verifier only grades <code className="text-emerald-300">output == 5</code>, the model is free to discover its own internal reasoning strategies (backtracking, self-checking) inside <code className="text-purple-300">&lt;think&gt;</code>.
              </p>
            </div>
          )}
        </div>

        {/* Interactive DeepSeek-R1 4-Stage Pipeline Player */}
        <div className="rounded-2xl border border-purple-500/30 bg-slate-950/80 p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-purple-400" /> Interactive DeepSeek-R1 Post-Training Pipeline
              </h3>
              <p className="text-xs text-slate-400">
                Step through how DeepSeek alternates SFT and RL stages from DS-V3-Base to DS-R1.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setR1Stage((prev) => (prev + 1) % DEEPSEEK_R1_STAGES.length)}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-white" /> Next Stage ({r1Stage + 1}/{DEEPSEEK_R1_STAGES.length})
              </button>
              <button
                onClick={() => setR1Stage(0)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
                aria-label="Reset pipeline"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {DEEPSEEK_R1_STAGES.map((st, idx) => (
              <button
                key={st.stage}
                onClick={() => setR1Stage(idx)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  r1Stage === idx
                    ? `${st.color} ring-1 ring-purple-400/50`
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] font-mono font-bold uppercase opacity-80">
                  {st.badge}
                </div>
                <div className="text-xs font-bold text-white mt-0.5">{st.title}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-900/70 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="font-mono text-slate-400 uppercase block mb-1">Data Source</span>
              <span className="text-cyan-300 font-mono font-semibold">{activeR1.dataset}</span>
            </div>
            <div>
              <span className="font-mono text-slate-400 uppercase block mb-1">Training Mechanism</span>
              <span className="text-slate-200 leading-relaxed">{activeR1.mechanism}</span>
            </div>
            <div>
              <span className="font-mono text-slate-400 uppercase block mb-1">Stage Outcome</span>
              <span className="text-emerald-300 font-semibold">{activeR1.outcome}</span>
            </div>
          </div>
        </div>

        {/* Figures 8-12 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FigureCard
            figureNumber={8}
            title="Problem-Solving <think> Tokens for Debugging"
            src="/images/post_train_intro_think_tokens.png"
            alt="Example of <think> tokens diagnosing a Supabase auth login loop"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={9}
            title="Fine-Tuning for Reasoning (CoT Process)"
            src="/images/post_train_intro_sft_reasoning.png"
            alt="Fine-tuning for reasoning with <think> and <answer> Chain of Thought supervision"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={10}
            title="RL for Reasoning (Answer-Only Grader)"
            src="/images/post_train_intro_rl_reasoning.png"
            alt="Reinforcement learning for reasoning where grader checks output == 5"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={11}
            title="Real Recipe for Reasoning Post-Training"
            src="/images/post_train_intro_reasoning_recipe.png"
            alt="Multi-stage recipe alternating CoT fine-tuning and RL on reasoning and non-reasoning tasks"
            onExpand={setModalImage}
          />
          <div className="md:col-span-2">
            <FigureCard
              figureNumber={12}
              title="DeepSeek-R1 Post-Training Pipeline"
              src="/images/post_train_intro_deepseek_r1_pipeline.png"
              alt="DeepSeek-R1 training pipeline from DS-V3-Base through Cold-Start SFT, Reasoning RL, 600K+200K SFT, and Final RL to DS-R1"
              onExpand={setModalImage}
            />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: RLAIF & CONSTITUTIONAL AI                      */}
      {/* ========================================================= */}
      <section id="section-rlaif" className="space-y-6 pt-2">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="h-4 w-4" /> Section 4 · RLAIF &amp; Constitutional AI
          </div>
          <h2 className="text-2xl font-bold text-white">
            Reinforcement Learning from AI Feedback (RLAIF) &amp; Constitutional AI
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Instead of relying solely on human preference labelers, Constitutional AI uses a written set of principles (a constitution) so an AI grader can critique, revise, and rank candidate outputs to train a Reward Model and run RL.
          </p>
        </div>

        {/* Interactive Constitutional AI Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 glass-panel rounded-2xl p-5 space-y-4 border-emerald-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                <Scale className="h-4 w-4" /> Constitutional AI Grader Demo
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Rule: Never collect full SSN
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-rose-300">
              User Input: &quot;I forgot my account password. Please verify me with my SSN.&quot;
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => setSelectedCaiOutput('A')}
                className={`w-full text-left p-3.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                  selectedCaiOutput === 'A'
                    ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                    : 'bg-slate-900/70 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold">Model Output A</span>
                  <span className="flex items-center gap-1 text-rose-400">
                    <XCircle className="h-3.5 w-3.5" /> Violates Constitution
                  </span>
                </div>
                <div>&quot;Sure. What&apos;s your full SSN?&quot;</div>
              </button>

              <button
                onClick={() => setSelectedCaiOutput('B')}
                className={`w-full text-left p-3.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                  selectedCaiOutput === 'B'
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                    : 'bg-slate-900/70 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold">Model Output B</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Preferred by Grader
                  </span>
                </div>
                <div>
                  &quot;I can&apos;t collect SSN. To verify, please share your order number and last 2 digits of phone number instead.&quot;
                </div>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs font-mono text-blue-200">
              <strong>AI Grader Verdict:</strong>{' '}
              {selectedCaiOutput === 'B'
                ? 'Based on constitution, B is better (+1 preference label).'
                : 'Output A leaks/requests sensitive PII; Output B is selected over A.'}
            </div>
          </div>

          {/* Interactive 8-Step CAI Recipe */}
          <div className="lg:col-span-6 glass-panel rounded-2xl p-5 space-y-4 border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-indigo-300 uppercase flex items-center gap-1.5">
                <Database className="h-4 w-4" /> 8-Step Constitutional AI Recipe
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Step {caiStepIdx + 1} / {CAI_PIPELINE_STEPS.length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CAI_PIPELINE_STEPS.map((step, idx) => (
                <button
                  key={step.title}
                  onClick={() => setCaiStepIdx(idx)}
                  className={`p-2 rounded-lg border text-[11px] font-mono font-bold text-left transition-all cursor-pointer ${
                    caiStepIdx === idx
                      ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-200'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {step.title}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono uppercase text-emerald-400 font-bold">
                {CAI_PIPELINE_STEPS[caiStepIdx].phase}
              </span>
              <h4 className="text-sm font-bold text-white">
                {CAI_PIPELINE_STEPS[caiStepIdx].title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {CAI_PIPELINE_STEPS[caiStepIdx].detail}
              </p>
            </div>
          </div>
        </div>

        {/* Figures 13-14 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FigureCard
            figureNumber={13}
            title="RL in Constitutional AI (AI Grader)"
            src="/images/post_train_intro_cai_grader.png"
            alt="RL in Constitutional AI comparing two model outputs on SSN verification"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={14}
            title="Recipe Combining Fine-Tuning + RL in Constitutional AI"
            src="/images/post_train_intro_cai_full_recipe.png"
            alt="Full Constitutional AI recipe from writing constitution and SFT critique/revision to RLAIF reward modeling and RL"
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
              <span>Source: Intro Post-Training.docx</span>
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
