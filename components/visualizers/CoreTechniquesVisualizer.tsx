"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { getAssetPath } from '@/lib/asset';
import { MathFormula } from '@/components/ui/MathFormula';
import {
  Activity,
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  GitBranch,
  Layers,
  Lock,
  Maximize2,
  Minimize2,
  Play,
  Scale,
  ShieldAlert,
  Sliders,
  Unlock,
  Users,
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
          <span className="text-xs font-mono text-purple-400 font-bold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 shrink-0">
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

const TRAINING_CYCLE_STEPS = [
  {
    step: 1,
    title: 'Train on FT-train',
    detail: 'Train model weights on the training split using a candidate set of hyperparameters (LR, batch size, LoRA rank).',
  },
  {
    step: 2,
    title: 'Evaluate on Validation',
    detail: 'Measure generalization performance on the held-out FT-validation split.',
  },
  {
    step: 3,
    title: 'Update Hyperparameters',
    detail: 'Select or tune hyperparameters based solely on what produced the best validation score (never the training set).',
  },
  {
    step: 4,
    title: 'Iterate Until Peak',
    detail: 'Repeat steps 1-3 until validation performance peaks, locking in the final hyperparameter configuration.',
  },
  {
    step: 5,
    title: 'Optional Retrain (Train + Val)',
    detail: 'Optionally retrain the final model with winning hyperparameters on combined train + validation data to maximize sample efficiency.',
  },
  {
    step: 6,
    title: 'Single Final Test Eval',
    detail: 'Evaluate once on the strictly unseen test set (with long-tail & OOD inputs) for an unbiased generalization estimate.',
  },
];

type SplitMode = 'ft' | 'rl' | 'leakage';
type TokenizerMode = 'freeze' | 'train';
type LRMode = 'high' | 'perfect' | 'low';
type OptimizerType = 'sgd' | 'rmsprop' | 'adam';
type VerifierSampleKey = 'correct_en' | 'missing_tags' | 'mixed_lang' | 'wrong_ans';
type PolicyAlgoTab = 'ppo' | 'grpo';

const OPTIMIZER_MULTIPLIER: Record<OptimizerType, { label: string; factor: number }> = {
  sgd: { label: 'SGD (o = 0)', factor: 0 },
  rmsprop: { label: 'RMSProp (o = 1)', factor: 1 },
  adam: { label: 'Adam (o = 2)', factor: 2 },
};

const VERIFIER_SAMPLES: Record<
  VerifierSampleKey,
  {
    label: string;
    response: string;
    correctAnswer: string;
    mathReward: number;
    formatReward: number;
    langReward: number;
    note: string;
  }
> = {
  correct_en: {
    label: '1. Clean & Correct',
    response: '<think>Carly has 8 + 2 - 5 = 5 apples.</think>\\boxed{5}',
    correctAnswer: '5',
    mathReward: 1.0,
    formatReward: 1.0,
    langReward: 1.0,
    note: 'Passes all three DeepSeek-R1 programmatic verifiers.',
  },
  missing_tags: {
    label: '2. Missing <think> Tags',
    response: 'The answer is \\boxed{5}.',
    correctAnswer: '5',
    mathReward: 1.0,
    formatReward: 0.0,
    langReward: 1.0,
    note: 'Math is right, but format_reward returns 0.0 because <think>...</think> tags are missing.',
  },
  mixed_lang: {
    label: '3. Mixed EN/ZH Language',
    response: '<think>Carly有8个apples, 8+2-5=5.</think>\\boxed{5}',
    correctAnswer: '5',
    mathReward: 1.0,
    formatReward: 1.0,
    langReward: -0.5,
    note: 'DeepSeek-R1 penalizes language mixing (-0.5) to enforce readable reasoning traces.',
  },
  wrong_ans: {
    label: '4. Wrong Final Answer',
    response: '<think>8 + 2 = 10, minus 5 is 4.</think>\\boxed{4}',
    correctAnswer: '5',
    mathReward: 0.0,
    formatReward: 1.0,
    langReward: 1.0,
    note: 'Format and language are valid, but math_reward returns 0.0 for incorrect answer.',
  },
};

export const CoreTechniquesVisualizer: React.FC = () => {
  const [modalImage, setModalImage] = useState<ModalImageState | null>(null);

  // Section 1 state
  const [cycleStep, setCycleStep] = useState<number>(0);
  const [splitMode, setSplitMode] = useState<SplitMode>('rl');

  // Section 2 state
  const [tokenizerMode, setTokenizerMode] = useState<TokenizerMode>('train');
  const [lrMode, setLrMode] = useState<LRMode>('perfect');
  const [optimizer, setOptimizer] = useState<OptimizerType>('adam');

  // Section 3 state
  const [verifierSample, setVerifierSample] = useState<VerifierSampleKey>('correct_en');
  const [dpoStep, setDpoStep] = useState<number>(3);

  // Section 4 state
  const [policyAlgo, setPolicyAlgo] = useState<PolicyAlgoTab>('grpo');

  const activeSample = VERIFIER_SAMPLES[verifierSample];
  const optFactor = OPTIMIZER_MULTIPLIER[optimizer].factor;
  const fullFtUnits = 4 + 4 + 4 * optFactor + 2; // model + grad + opt_state*grad + forward
  const loraUnits = 4 + 1 + 0.5 + 0.5 * optFactor + 2; // model + lora + small grad + small opt + forward

  return (
    <div className="space-y-10">
      {/* ========================================================= */}
      {/* STICKY QUICK SECTION BOOKMARKS BAR                        */}
      {/* ========================================================= */}
      <div className="sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border border-purple-500/40 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400">
          <Bookmark className="h-4 w-4 text-purple-400" />
          <span>Quick Section Bookmarks:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-mono">
          <button
            onClick={() =>
              document.getElementById('section-data')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-start gap-2.5 text-left cursor-pointer"
          >
            <Database className="h-4 w-4 text-cyan-400 shrink-0" />
            <span className="font-semibold truncate">1. Data Splits &amp; Anti-Leakage</span>
          </button>

          <button
            onClick={() =>
              document.getElementById('section-training')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-start gap-2.5 text-left cursor-pointer"
          >
            <Cpu className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="font-semibold truncate">2. Tokenizer, LR &amp; LoRA</span>
          </button>

          <button
            onClick={() =>
              document.getElementById('section-rewards')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-start gap-2.5 text-left cursor-pointer"
          >
            <Scale className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="font-semibold truncate">3. Verifiers, RM &amp; DPO</span>
          </button>

          <button
            onClick={() =>
              document.getElementById('section-rl-algos')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-start gap-2.5 text-left cursor-pointer"
          >
            <Users className="h-4 w-4 text-purple-400 shrink-0" />
            <span className="font-semibold truncate">4. PPO vs. GRPO</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: DATA PREPARATION, SPLITTING & ANTI-LEAKAGE     */}
      {/* ========================================================= */}
      <section id="section-data" className="space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Database className="h-4 w-4" /> Section 1 · Preparing Data &amp; Preventing Leakage
          </div>
          <h2 className="text-2xl font-bold text-white">
            Training Cycle, RL-Test New Reward Model &amp; Contamination Control
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Trustworthy post-training requires strict train/validation/test isolation, a <strong>new</strong> Reward Model during RL testing to catch reward hacking, out-of-distribution (OOD) &amp; long-tail final evaluations, and MinHash/LSH + time-based splitting to eliminate leakage.
          </p>
        </div>

        {/* 6-Step Training Cycle Stepper */}
        <div className="glass-panel rounded-2xl p-6 space-y-4 border-cyan-500/30">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-cyan-400" /> Standard 6-Step Training &amp; Tuning Cycle
            </span>
            <button
              onClick={() => setCycleStep((prev) => (prev + 1) % TRAINING_CYCLE_STEPS.length)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-white" /> Next Step ({cycleStep + 1}/{TRAINING_CYCLE_STEPS.length})
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {TRAINING_CYCLE_STEPS.map((item, idx) => (
              <button
                key={item.step}
                onClick={() => setCycleStep(idx)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  cycleStep === idx
                    ? 'bg-cyan-950/40 border-cyan-400/50 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-[10px] font-mono font-bold text-cyan-400">Step {item.step}</div>
                <div className="text-xs font-bold mt-0.5">{item.title}</div>
              </button>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <strong className="text-cyan-300">{TRAINING_CYCLE_STEPS[cycleStep].title}:</strong>{' '}
            {TRAINING_CYCLE_STEPS[cycleStep].detail}
          </div>
        </div>

        {/* Interactive Split & Anti-Leakage Explorer */}
        <div className="glass-panel rounded-2xl p-6 space-y-4 border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase">
              Split &amp; Anti-Leakage Inspector
            </span>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: 'ft', label: 'Fine-Tuning Splits' },
                  { id: 'rl', label: 'RL Splits (Reward Hacking)' },
                  { id: 'leakage', label: 'MinHash & Time Splitting' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSplitMode(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border cursor-pointer ${
                    splitMode === t.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {splitMode === 'ft' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-cyan-300 font-bold">FT-train</div>
                <div className="text-slate-400">{'{input, target output}'}</div>
                <p className="font-sans text-slate-300 pt-1">Updates model weights via cross-entropy loss.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-indigo-300 font-bold">FT-validation</div>
                <div className="text-slate-400">{'{input, target output}'}</div>
                <p className="font-sans text-slate-300 pt-1">Tunes learning rate, epochs, and LoRA rank.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-emerald-300 font-bold">FT-test</div>
                <div className="text-slate-400">{'{input, target output}'}</div>
                <p className="font-sans text-slate-300 pt-1">Includes strictly unseen long-tail &amp; OOD inputs.</p>
              </div>
            </div>
          )}

          {splitMode === 'rl' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-mono font-bold text-indigo-300">RL-train: RM + Verifiers</div>
                <p className="text-slate-300 leading-relaxed">
                  Prompts <code className="text-cyan-300">{'{inputs}'}</code> generate rollouts scored by your training Reward Model (RM) + deterministic verifiers.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 space-y-2">
                <div className="font-mono font-bold text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4" /> RL-test: Must Use a NEW Reward Model!
                </div>
                <p className="text-slate-300 leading-relaxed">
                  If you evaluate RL-test with the same RM used during training, you will miss <strong>reward hacking</strong>—where the policy exploits quirks in the training RM rather than producing genuinely better answers.
                </p>
              </div>
            </div>
          )}

          {splitMode === 'leakage' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="font-mono font-bold text-amber-300">1. MinHash / LSH Deduplication</div>
                <p className="text-slate-300 leading-relaxed">
                  Detects near-duplicates &amp; paraphrases across splits (e.g., &quot;How do I change my password...&quot; vs. &quot;How do I change my pw...&quot;).
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="font-mono font-bold text-rose-300">2. Avoid Random Splitting</div>
                <p className="text-slate-300 leading-relaxed">
                  Random splits leak &quot;same prompt, different target&quot; or templated variants across train and test.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="font-mono font-bold text-emerald-300">3. Time Splitting</div>
                <p className="text-slate-300 leading-relaxed">
                  Evaluate on data created <em>after</em> the training cutoff to measure true generalization into the future.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Figures 1-5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FigureCard
            figureNumber={1}
            title="Fine-Tuning Data Splits (Train / Val / Test)"
            src="/images/post_train_tech_ft_splits.png"
            alt="Fine-tuning dataset split into FT-train, FT-validation, and FT-test"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={2}
            title="RL Data Splits (New Reward Model for RL-Test)"
            src="/images/post_train_tech_rl_splits.png"
            alt="RL-train uses RM+VR while RL-test uses a New RM+VR"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={3}
            title="Final Eval Data: Long-Tail & Out-of-Distribution"
            src="/images/post_train_tech_final_eval_ood.png"
            alt="Strictly unseen evaluation data mixing long-tail and out-of-distribution inputs"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={4}
            title="Preventing Leakage via MinHash / LSH Deduplication"
            src="/images/post_train_tech_minhash_dedup.png"
            alt="MinHash detecting near-duplicate prompts across Train and Test splits"
            onExpand={setModalImage}
          />
          <div className="md:col-span-2">
            <FigureCard
              figureNumber={5}
              title="Data Splitting & Contamination Rules (MinHash, No Random Split, Time Split)"
              src="/images/post_train_tech_contamination_rules.png"
              alt="Three contamination rules: MinHash/LSH dedupe, avoid random split, and time splitting"
              onExpand={setModalImage}
            />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: TOKENIZATION, LEARNING RATE & LORA MEMORY      */}
      {/* ========================================================= */}
      <section id="section-training" className="space-y-6 pt-2">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Cpu className="h-4 w-4" /> Section 2 · Training Mechanics &amp; Memory
          </div>
          <h2 className="text-2xl font-bold text-white">
            Tokenizer &amp; Embeddings, Learning Rate Diagnostics &amp; LoRA Memory
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Decide whether to freeze or train the tokenizer and embeddings based on how much the model&apos;s behavior changes, diagnose learning rate failures early, and slash VRAM usage using LoRA.
          </p>
        </div>

        {/* Tokenizer Freeze vs Train + LR Diagnostics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tokenizer & Embedding Advisor */}
          <div className="glass-panel rounded-2xl p-5 space-y-4 border-amber-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                Tokenizer &amp; Embeddings Policy
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setTokenizerMode('freeze')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border flex items-center gap-1 cursor-pointer ${
                    tokenizerMode === 'freeze'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <Lock className="h-3 w-3" /> Freeze
                </button>
                <button
                  onClick={() => setTokenizerMode('train')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border flex items-center gap-1 cursor-pointer ${
                    tokenizerMode === 'train'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <Unlock className="h-3 w-3" /> Train
                </button>
              </div>
            </div>

            {tokenizerMode === 'freeze' ? (
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2 text-xs">
                <div className="font-mono font-bold text-cyan-300">
                  Small Target Change (e.g., Standard RL, Same Vocab) &rarr; FREEZE
                </div>
                <p className="text-slate-300 leading-relaxed">
                  When keeping the same vocabulary and making small behavioral adjustments, freeze both the tokenizer and the embedding layer to preserve pre-trained token representations and save memory.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2 text-xs">
                <div className="font-mono font-bold text-rose-300">
                  Large Target Change (e.g., Adding &lt;|THINK|&gt; Mode) &rarr; TRAIN
                </div>
                <p className="text-slate-300 leading-relaxed">
                  When introducing new special tags (such as <code className="text-amber-300">&lt;|THINK|&gt;</code> or <code className="text-amber-300">&lt;|THINGY|&gt;</code>) or major domain shifts, train both the tokenizer and embedding weights.
                </p>
              </div>
            )}
          </div>

          {/* Learning Rate Diagnostic Simulator */}
          <div className="glass-panel rounded-2xl p-5 space-y-4 border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-amber-400" /> Learning Rate Simulator
              </span>
              <div className="flex gap-1.5">
                {(
                  [
                    { id: 'high', label: 'Too High' },
                    { id: 'perfect', label: 'Perfect' },
                    { id: 'low', label: 'Too Low' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setLrMode(m.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border cursor-pointer ${
                      lrMode === m.id
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs font-mono text-slate-400">
              Prompt: <span className="text-rose-300">&quot;The cat sat on ___&quot;</span>
            </div>

            {lrMode === 'high' && (
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 space-y-2 text-xs font-mono">
                <div className="text-rose-300 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" /> Completion: &quot;*#&amp;/jw2@&quot;
                </div>
                <div className="text-rose-200 bg-slate-950 p-2.5 rounded-lg border border-rose-500/30">
                  Loss: NaN | Loss: inf | RuntimeError (loss jumping everywhere)
                </div>
              </div>
            )}

            {lrMode === 'perfect' && (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2 text-xs font-mono">
                <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Completion: &quot;the warm blanket&quot;
                </div>
                <div className="text-emerald-200 bg-slate-950 p-2.5 rounded-lg border border-emerald-500/30">
                  Epoch 1: 2.15 &rarr; Epoch 2: 1.89 &rarr; Epoch 3: 1.67 (smooth convergence)
                </div>
              </div>
            )}

            {lrMode === 'low' && (
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-2 text-xs font-mono">
                <div className="text-amber-300 font-bold">Completion: &quot;chair window door&quot;</div>
                <div className="text-amber-200 bg-slate-950 p-2.5 rounded-lg border border-amber-500/30">
                  Epoch 1: 2.15 &rarr; Epoch 2: 2.14 &rarr; Epoch 3: 2.14 (barely moving)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PyTorch Memory Breakdown: Full FT vs LoRA */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-400" /> PyTorch Memory Usage: Full Fine-Tuning vs. LoRA
              </h3>
              <p className="text-xs text-slate-400">
                LoRA freezes base weights and trains adapters as small as 0.1%, drastically shrinking gradient and optimizer state memory.
              </p>
            </div>
            <div className="flex gap-2">
              {(Object.keys(OPTIMIZER_MULTIPLIER) as OptimizerType[]).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setOptimizer(opt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border cursor-pointer ${
                    optimizer === opt
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {OPTIMIZER_MULTIPLIER[opt].label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-200">
                <span className="font-bold">Full Fine-Tuning</span>
                <span className="text-rose-300">Relative Memory Units: {fullFtUnits}x</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Total = model_memory + gradient_memory + o * gradient_memory + forward_pass_memory
              </div>
              <div className="h-3 rounded-full bg-slate-950 overflow-hidden flex">
                <div className="bg-indigo-600 h-full" style={{ width: `${(4 / 18) * 100}%` }} title="Model" />
                <div className="bg-cyan-500 h-full" style={{ width: `${(4 / 18) * 100}%` }} title="Gradients" />
                <div className="bg-rose-500 h-full" style={{ width: `${((4 * optFactor) / 18) * 100}%` }} title="Optimizer States" />
                <div className="bg-amber-500 h-full" style={{ width: `${(2 / 18) * 100}%` }} title="Forward Pass" />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-emerald-500/30 space-y-2">
              <div className="flex justify-between text-slate-200">
                <span className="font-bold text-emerald-300">LLM Fine-Tuned with LoRA</span>
                <span className="text-emerald-300">Relative Memory Units: {loraUnits}x</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Total = model_memory + LoRA_params (~0.1%) + grad(trainable) + o * grad(trainable) + forward_pass
              </div>
              <div className="h-3 rounded-full bg-slate-950 overflow-hidden flex">
                <div className="bg-indigo-600 h-full" style={{ width: `${(4 / 18) * 100}%` }} title="Model" />
                <div className="bg-emerald-500 h-full" style={{ width: `${(1 / 18) * 100}%` }} title="LoRA" />
                <div className="bg-cyan-500 h-full" style={{ width: `${(0.5 / 18) * 100}%` }} title="LoRA Gradients" />
                <div className="bg-rose-500 h-full" style={{ width: `${((0.5 * optFactor) / 18) * 100}%` }} title="LoRA Optimizer States" />
                <div className="bg-amber-500 h-full" style={{ width: `${(2 / 18) * 100}%` }} title="Forward Pass" />
              </div>
            </div>
          </div>
        </div>

        {/* Figures 6-9 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FigureCard
            figureNumber={6}
            title="Large Changes: Train Tokenizer & Embeddings"
            src="/images/post_train_tech_train_tokenizer.png"
            alt="Train embeddings and tokenizer when adding new special tags like <|THINK|>"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={7}
            title="Small Changes: Freeze Tokenizer & Embeddings"
            src="/images/post_train_tech_freeze_tokenizer.png"
            alt="Freeze embeddings and tokenizer when keeping the same vocabulary"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={8}
            title="Learning Rate Diagnostics (Too High vs. Perfect vs. Too Low)"
            src="/images/post_train_tech_learning_rate.png"
            alt="Loss curves for Too High LR (NaN/inf), Perfect LR, and Too Low LR"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={9}
            title="LoRA Memory Reduction vs. Full Fine-Tuning"
            src="/images/post_train_tech_lora_memory.png"
            alt="PyTorch memory breakdown showing LoRA training only ~0.1% parameters"
            onExpand={setModalImage}
          />
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: VERIFIERS, REWARD MODELS & DPO DERIVATION      */}
      {/* ========================================================= */}
      <section id="section-rewards" className="space-y-6 pt-2">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Scale className="h-4 w-4" /> Section 3 · Reward Signals &amp; DPO Derivation
          </div>
          <h2 className="text-2xl font-bold text-white">
            Programmatic Verifiers, Preference Reward Models &amp; DPO Loss Derivation
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Combine deterministic verifiers (for math, code, and formatting) with learned Preference Reward Models (for style and helpfulness)—or bypass training a separate Reward Model altogether using Direct Preference Optimization (DPO).
          </p>
        </div>

        {/* Interactive Verifiers + Preference Ranking */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 glass-panel rounded-2xl p-5 space-y-4 border-emerald-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-emerald-300 uppercase flex items-center gap-1.5">
                <Code2 className="h-4 w-4" /> DeepSeek-R1 Programmatic Verifiers Sandbox
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {(Object.keys(VERIFIER_SAMPLES) as VerifierSampleKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setVerifierSample(key)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border cursor-pointer ${
                    verifierSample === key
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {VERIFIER_SAMPLES[key].label}
                </button>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-200 break-all">
              {activeSample.response}
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[11px]">math_reward</div>
                <div className={`text-sm font-bold ${activeSample.mathReward > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {activeSample.mathReward.toFixed(1)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[11px]">format_reward</div>
                <div className={`text-sm font-bold ${activeSample.formatReward > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {activeSample.formatReward.toFixed(1)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[11px]">lang_consistency</div>
                <div className={`text-sm font-bold ${activeSample.langReward > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {activeSample.langReward.toFixed(1)}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300">{activeSample.note}</p>
          </div>

          <div className="lg:col-span-5 glass-panel rounded-2xl p-5 space-y-4 border-slate-800">
            <span className="text-xs font-mono font-bold text-indigo-300 uppercase block border-b border-slate-800 pb-3">
              Preference Reward Model Example
            </span>
            <div className="text-xs text-slate-400">
              Prompt: <span className="text-white font-semibold">&quot;Write a thank you note for a gift&quot;</span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/40 text-emerald-200 flex justify-between">
                <span>Rank 1 (High): &quot;thank you so much! I cannot wait to see!&quot;</span>
                <span className="font-bold">r = +2.4</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/40 text-amber-200 flex justify-between">
                <span>Rank 2 (Mid): &quot;thanks, I guess&quot;</span>
                <span className="font-bold">r = -0.3</span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/40 text-rose-200 flex justify-between">
                <span>Rank 3 (Low): &quot;thx&quot;</span>
                <span className="font-bold">r = -1.9</span>
              </div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <MathFormula math="\mathcal{L}_{\text{RM}} = -\log \sigma\big(r(x, y_A) - r(x, y_B)\big)" block />
            </div>
          </div>
        </div>

        {/* Step-by-Step DPO Derivation */}
        <div className="rounded-2xl border border-emerald-500/30 bg-slate-950/80 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">
                How DPO Mixes the Reward Function Directly into the Loss
              </h3>
              <p className="text-xs text-slate-400">
                Walk through the 4-step derivation showing how the partition function Z(x) cancels out.
              </p>
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setDpoStep(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border cursor-pointer ${
                    dpoStep === idx
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  Step {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {dpoStep === 0 && (
            <div className="space-y-2">
              <div className="text-xs font-mono text-emerald-400 font-bold">
                Step 1: Closed-Form Optimal Policy &amp; Implicit Reward
              </div>
              <MathFormula
                math="\pi^*(y \mid x) = \frac{1}{Z(x)} \pi_{\text{ref}}(y \mid x) \exp\left(\frac{1}{\beta} r(x, y)\right) \;\Longrightarrow\; r(x, y) = \beta \log \frac{\pi^*(y \mid x)}{\pi_{\text{ref}}(y \mid x)} + \beta \log Z(x)"
                block
              />
            </div>
          )}

          {dpoStep === 1 && (
            <div className="space-y-2">
              <div className="text-xs font-mono text-emerald-400 font-bold">
                Step 2: Bradley-Terry Preference Probability
              </div>
              <MathFormula
                math="P(y_w \succ y_l \mid x) = \sigma\big(r(x, y_w) - r(x, y_l)\big)"
                block
              />
            </div>
          )}

          {dpoStep === 2 && (
            <div className="space-y-2">
              <div className="text-xs font-mono text-emerald-400 font-bold">
                Step 3: Substitute Implicit Reward — Partition Function Z(x) Cancels Out!
              </div>
              <MathFormula
                math="\Delta r = \left(\beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_{\text{ref}}(y_w \mid x)} + \beta \log Z(x)\right) - \left(\beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_{\text{ref}}(y_l \mid x)} + \beta \log Z(x)\right) = \beta \left(\log \frac{\pi_\theta(y_w \mid x)}{\pi_{\text{ref}}(y_w \mid x)} - \log \frac{\pi_\theta(y_l \mid x)}{\pi_{\text{ref}}(y_l \mid x)}\right)"
                block
              />
            </div>
          )}

          {dpoStep === 3 && (
            <div className="space-y-2">
              <div className="text-xs font-mono text-emerald-400 font-bold">
                Step 4: Final DPO Binary Cross-Entropy Loss (No Separate Reward Model Needed)
              </div>
              <MathFormula
                math="\mathcal{L}_{\text{DPO}}(\theta) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}} \left[ \log \sigma \left( \beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_{\text{ref}}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_{\text{ref}}(y_l \mid x)} \right) \right]"
                block
              />
            </div>
          )}
        </div>

        {/* Figures 10-13 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FigureCard
            figureNumber={10}
            title="Verifiers in GRPO and DeepSeek Models"
            src="/images/post_train_tech_grpo_verifiers.png"
            alt="Python verifiers: math_reward, format_reward, and language_consistency_reward"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={11}
            title="Preference Learning: Training a Reward Model"
            src="/images/post_train_tech_preference_rm.png"
            alt="Ranked preferences converted to pairs and trained with Sigmoid difference loss"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={12}
            title="Reward Model vs. Verifiers Workflow (Use Both!)"
            src="/images/post_train_tech_rm_vs_verifiers_flow.png"
            alt="Workflow comparison between learned Reward Models and measurable Verifiers"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={13}
            title="Reward Model vs. Verifiers: Best Use Cases"
            src="/images/post_train_tech_rm_vs_verifiers_bestfor.png"
            alt="Reward models best for human values/dialogue; verifiers best for factual, math, and coding tasks"
            onExpand={setModalImage}
          />
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: POLICY OPTIMIZATION (PPO VS. GRPO)             */}
      {/* ========================================================= */}
      <section id="section-rl-algos" className="space-y-6 pt-2">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Users className="h-4 w-4" /> Section 4 · Policy Optimization
          </div>
          <h2 className="text-2xl font-bold text-white">
            PPO (Actor + Critic Baseline) vs. GRPO (Critic-Free Group Advantage)
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Because discrete token sampling is non-differentiable, RL scales the log-probability gradient by an Advantage signal. PPO uses a separate Critic network for its baseline, whereas GRPO computes the baseline directly from a sampled group of completions.
          </p>
        </div>

        {/* Interactive PPO vs GRPO Switcher */}
        <div className="glass-panel rounded-2xl p-6 space-y-5 border-purple-500/30">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="h-4 w-4 text-purple-400" /> Compare Policy Optimization Architectures
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPolicyAlgo('ppo')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border cursor-pointer ${
                  policyAlgo === 'ppo'
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                PPO (Actor-Critic)
              </button>
              <button
                onClick={() => setPolicyAlgo('grpo')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border cursor-pointer ${
                  policyAlgo === 'grpo'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                GRPO (Group Relative)
              </button>
            </div>
          </div>

          {policyAlgo === 'ppo' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2">
                <div className="font-mono font-bold text-indigo-300">Why PPO Needs a Critic</div>
                <ul className="space-y-1.5 text-slate-300 list-disc pl-4">
                  <li><strong>Non-Differentiable Sampling:</strong> Differentiates token log-probs scaled by reward.</li>
                  <li><strong>High Variance:</strong> Raw scalar rewards oscillate and destabilize training.</li>
                  <li><strong>Critic Baseline + GAE:</strong> A second Critic LLM predicts expected return <MathFormula math="r_b" />.</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-mono font-bold text-cyan-300">Advantage-Driven Update</div>
                <MathFormula math="A = r - r_b" block />
                <div className="flex items-center gap-2 text-emerald-300 font-mono">
                  <CheckCircle2 className="h-3.5 w-3.5" /> A &gt; 0: Reinforce token probabilities
                </div>
                <div className="flex items-center gap-2 text-rose-300 font-mono">
                  <XCircle className="h-3.5 w-3.5" /> A &lt; 0: Suppress token probabilities
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-2">
                <div className="font-mono font-bold text-purple-300">No Critic Architecture</div>
                <ul className="space-y-1.5 text-slate-300 list-disc pl-4">
                  <li><strong>Memory Savings:</strong> Eliminates the separate Critic LLM, drastically lowering VRAM.</li>
                  <li><strong>Group Sampling:</strong> Samples <MathFormula math="\{y_1, y_2, \dots, y_G\}" /> with non-zero temperature.</li>
                  <li><strong>Verification:</strong> Scores each rollout via reward model or programmatic verifiers.</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-mono font-bold text-emerald-300">Group Relative Advantage</div>
                <MathFormula math="A_i = \frac{r_i - \text{mean}(\{r_1, \dots, r_G\})}{\text{std}(\{r_1, \dots, r_G\})}" block />
                <p className="text-slate-300">
                  Above-average completions (<MathFormula math="A_i > 0" />) are reinforced while below-average ones (<MathFormula math="A_i < 0" />) are suppressed using PPO&apos;s clipped objective.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Figure 14 */}
        <FigureCard
          figureNumber={14}
          title="PPO vs. GRPO Architecture Comparison (DeepSeekMath)"
          src="/images/post_train_tech_ppo_vs_grpo.png"
          alt="PPO with baseline estimation LLM and GAE vs GRPO with group sampling and group computation"
          onExpand={setModalImage}
        />
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
              <span>Source: Core Techniques.docx</span>
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
