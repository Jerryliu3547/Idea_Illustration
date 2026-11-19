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
  Clock,
  Compass,
  Gauge,
  Layers,
  Maximize2,
  Minimize2,
  Play,
  RefreshCw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Target,
  Wrench,
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
          <span className="text-xs font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 shrink-0">
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

const CALIBRATION_TOKENS = [
  { token: 'Sun', modelProb: 0.92, empirical: 0.93, status: 'good' },
  { token: 'star', modelProb: 0.01, empirical: 0.04, status: 'neutral' },
  { token: 'galaxy', modelProb: 0.01, empirical: 0.02, status: 'neutral' },
  { token: 'ocean', modelProb: 0.01, empirical: 0.01, status: 'good' },
  { token: 'sandwich', modelProb: 0.05, empirical: 0.0, status: 'bad' },
];

const HELM_DIMENSIONS = [
  {
    name: 'Accuracy',
    desc: 'Core task correctness across standard academic and domain benchmarks.',
  },
  {
    name: 'Calibration',
    desc: 'Whether predicted confidence probabilities align with true empirical accuracy (ECE).',
  },
  {
    name: 'Robustness',
    desc: 'Resilience to typos, paraphrases, formatting perturbations, and distribution shifts.',
  },
  {
    name: 'Fairness',
    desc: 'Equitable performance across demographic groups, dialects, and sensitive attributes.',
  },
  {
    name: 'Toxicity',
    desc: 'Tendency to generate harmful, abusive, or unsafe language under benign or adversarial prompts.',
  },
  {
    name: 'Efficiency',
    desc: 'Inference latency (TTFT, TPOT), throughput, compute cost, and token conciseness.',
  },
  {
    name: 'Transparency',
    desc: 'Clarity around training data provenance, model limitations, and system documentation.',
  },
];

const RL_MONITORING_PILLARS = [
  {
    id: 'kl',
    title: '1. KL-Divergence to Base Model',
    role: 'Prevents model drifting too far',
    measures: 'Distance between active policy distribution and initial SFT/reference distribution.',
    why: 'If the policy strays too far from the base model, it risks language degradation (repetitive, unnatural, or gibberish text) while chasing rewards. Tracking KL signals over-optimization.',
    color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300',
  },
  {
    id: 'alignment-tax',
    title: '2. Alignment Tax',
    role: 'Reward vs. human eval gap',
    measures: 'Discrepancy between what the Reward Model rewards and what human evaluators or held-out benchmarks consider good.',
    why: 'Proxy RM scores almost always climb during RL. If human evals or general reasoning drop while RM rises, the model is trading real capability for RM pleasing (length bias, sycophancy).',
    color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
  },
  {
    id: 'sample-efficiency',
    title: '3. Sample Efficiency',
    role: 'How many rollouts -> how much gain?',
    measures: 'Number of prompt generations, environment rollouts, and gradient steps needed for a unit of performance gain.',
    why: 'Generating LLM rollouts is the main compute bottleneck in RL. Tracking sample efficiency reveals whether updates are making meaningful progress per GPU hour or plateauing.',
    color: 'border-indigo-500/40 bg-indigo-950/20 text-indigo-300',
  },
  {
    id: 'rollout-diversity',
    title: '4. Rollout Diversity',
    role: 'Detect model collapse',
    measures: 'Semantic and lexical diversity across multiple candidate generations sampled for the same prompt (distinct n-grams, entropy).',
    why: 'Policies often suffer mode collapse onto a single safe, formulaic template that tricks the verifier. A sudden drop in diversity warns that exploratory capacity is collapsing.',
    color: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
  },
];

const RL_VERIFIER_CLASSES = [
  {
    type: 'Deterministic Rule-Based Verifiers',
    domains: 'Math, programming, symbolic logic',
    how: 'Unit test execution (e.g., pytest), syntax parsers, exact string/regex match against reference solutions.',
    tradeoffs: 'Pros: Zero reward hacking; objective ground truth. Cons: Limited strictly to closed-form verifiable domains.',
  },
  {
    type: 'Learned Reward Models (RM / Bradley-Terry)',
    domains: 'Conversational chat, creative writing, roleplay',
    how: 'Separate neural network trained on pairwise human preferences outputting a scalar score.',
    tradeoffs: 'Pros: Handles subjective, open-ended tasks. Cons: Susceptible to reward hacking; needs held-out RMs for unbiased eval.',
  },
  {
    type: 'Process-Supervised Verifiers (PRMs)',
    domains: 'Multi-step mathematical and formal reasoning',
    how: 'Evaluates each intermediate thought step individually (r_1, r_2, ..., r_T) rather than just the final answer.',
    tradeoffs: 'Pros: Eliminates false-positive reasoning (right answer via broken logic). Cons: Very expensive to annotate step-level labels.',
  },
  {
    type: 'LLM-as-a-Verifier / Judge',
    domains: 'Instruction-following, summarization, safety',
    how: 'Frontier model prompted with a rubric (e.g., "Under 100 words and 3 bullets?").',
    tradeoffs: 'Pros: Flexible, zero-shot adaptable to new rules. Cons: Position bias, length bias, self-preference bias.',
  },
  {
    type: 'Held-Out Test Environments',
    domains: 'Post-training validation',
    how: 'Fresh reward models trained on disjoint preference data or separate environments unseen during training.',
    tradeoffs: 'Pros: Detects whether the RL agent genuinely generalized or merely exploited training RM artifacts.',
  },
];

interface ErrorBucket {
  bucket: string;
  symptoms: string;
  causes: string;
  sftFix: string;
  rlFix: string;
}

const ERROR_BUCKETS: ErrorBucket[] = [
  {
    bucket: 'Factuality / Hallucination',
    symptoms: 'Confident but wrong claims; invented citations',
    causes: 'Sparse grounded supervision; synthetic data w/o evidence',
    sftFix: 'Context-conditioned data with required citations.',
    rlFix: 'Preference pairs rewarding grounded answers & penalizing unsupported claims.',
  },
  {
    bucket: 'Reasoning (math/logic/code)',
    symptoms: 'Wrong intermediate steps; arithmetic slips; failing edge cases',
    causes: 'Low coverage of stepwise traces; weak difficulty mix',
    sftFix: 'High-quality CoT with unit checks in target outputs; rejection-sampling k -> choose top 1.',
    rlFix: 'Preferences for correct step sequences & final verification pass.',
  },
  {
    bucket: 'Schema / Format violations',
    symptoms: 'Invalid JSON/XML; wrong keys; extra fields',
    causes: 'Few schema-constrained exemplars; mixed label styles',
    sftFix: 'Schema-locked outputs (exact keys, examples + counter-examples).',
    rlFix: 'Preferences that rank perfectly formatted outputs above near-misses.',
  },
  {
    bucket: 'Instruction following',
    symptoms: 'Ignores required fields/length/style',
    causes: 'Training dominated by unconstrained chat; weak negative signals',
    sftFix: 'Constraint-verified demonstrations with explicit formatting & length targets.',
    rlFix: 'Verifiers & preferences penalizing missed constraints (e.g., >100 words).',
  },
  {
    bucket: 'Tool / API use (trace quality)',
    symptoms: 'Wrong tool choice/args; missing follow-ups',
    causes: 'Few tool-call demonstrations; no multi-step traces',
    sftFix: 'Multi-turn tool chains and failure -> repair data pairs.',
    rlFix: 'Preferences ranking correct tool sequences higher than superficially fluent but wrong ones.',
  },
  {
    bucket: 'Under-refusal (unsafe answers)',
    symptoms: 'Answers disallowed prompts',
    causes: 'Sparse refusal exemplars; incomplete policy coverage',
    sftFix: 'Red-team -> safe refusal + helpful alternative guidance.',
    rlFix: 'Preferences that strongly favor correct refusals over partial answers.',
  },
  {
    bucket: 'Over-refusal (false positives)',
    symptoms: 'Refuses benign queries',
    causes: 'Overweighted safety data; conservative preferences',
    sftFix: 'Benign-but-sensitive prompts with appropriate helpful answers.',
    rlFix: 'Preferences penalizing over-refusal vs. helpful compliant responses.',
  },
  {
    bucket: 'Toxicity / Bias',
    symptoms: 'Harmful language; stereotyping',
    causes: 'Imbalanced supervision; lack of counterfactuals',
    sftFix: 'Counter-bias & sensitive-topic exemplars with neutral reframing.',
    rlFix: 'Preferences that downrank toxic/biased outputs vs. neutral equivalents.',
  },
  {
    bucket: 'Style / Tone mismatch (verbosity/terse)',
    symptoms: 'Too long, hedgy, or too terse',
    causes: 'Single-style dominance; judge bias',
    sftFix: 'Parallel style pairs (concise vs. detailed) with explicit targets.',
    rlFix: 'Dual-objective preferences (quality + brevity) to curb verbosity or reward clarity.',
  },
  {
    bucket: 'Retrieval / Grounding failures (ctx given)',
    symptoms: 'Ignores context; cites wrong span',
    causes: 'Few context-answer examples in data; missing hard negatives',
    sftFix: 'Context-conditioned answers with gold span attribution.',
    rlFix: 'Preferences that favor answers using correct spans over plausible but ungrounded ones.',
  },
  {
    bucket: 'Long-context failures',
    symptoms: 'Forgets early info; cross-reference errors',
    causes: 'Short-context bias; no cross-document supervision',
    sftFix: 'Long-context tasks (cross-section synthesis, citation).',
    rlFix: 'Preferences rewarding correct long-range use over myopic answers.',
  },
  {
    bucket: 'Multi-turn inconsistency',
    symptoms: 'Contradictions across turns; lost constraints',
    causes: 'No state-aware dialogue supervision (lack of varied chat history)',
    sftFix: 'Dialogue with state persistence & self-correction.',
    rlFix: 'Preferences ranking consistent multi-turn outputs above single-turn optimal but inconsistent threads.',
  },
  {
    bucket: 'Overconfidence / Miscalibration (no abstain)',
    symptoms: 'High-confidence wrong answers',
    causes: 'No "uncertainty expression" targets',
    sftFix: 'Patterns with "I don\'t know" in low-evidence cases.',
    rlFix: 'Preferences that up-rank calibrated admissions over being confidently wrong.',
  },
  {
    bucket: 'Distribution shift fragility',
    symptoms: 'Degrades on paraphrases/new domains',
    causes: 'Narrow input diversity; template overfit',
    sftFix: 'Paraphrase/domain-augmented prompts with matched targets.',
    rlFix: 'Preferences that prefer robust paraphrase-invariant outputs.',
  },
];

const ADVERSARIAL_LOOP_STEPS = [
  {
    step: 1,
    name: '1. Generate',
    detail: 'An attacker LLM automatically generates diverse adversarial jailbreak prompts (roleplay like DAN, obfuscation, multi-turn escalation) at scale.',
    color: 'border-rose-500/40 bg-rose-950/30 text-rose-300',
  },
  {
    step: 2,
    name: '2. Test',
    detail: 'Every generated prompt is executed against the target LLM and scored automatically by safety classifiers or rubrics to detect policy breaches.',
    color: 'border-amber-500/40 bg-amber-950/30 text-amber-300',
  },
  {
    step: 3,
    name: '3. Refine & Learn',
    detail: 'Successful attacks are mutated to find deeper vulnerabilities and converted into regression eval cases & safety training data.',
    color: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300',
  },
];

export const PostTrainingEvaluationVisualizer: React.FC = () => {
  const [modalImage, setModalImage] = useState<ModalImageState | null>(null);

  // Section 1 state: pass@k vs pass^k calculator
  const [singleProb, setSingleProb] = useState<number>(0.7);
  const [numK, setNumK] = useState<number>(5);

  // Section 2 state: efficiency & HELM
  const [efficiencyMode, setEfficiencyMode] = useState<'concise' | 'verbose'>('concise');
  const [selectedHelmIdx, setSelectedHelmIdx] = useState<number>(1);

  // Section 3 state: RL monitoring pillar
  const [activePillarId, setActivePillarId] = useState<string>('kl');

  // Section 4 state: Error Analysis playbook
  const [selectedBucketIdx, setSelectedBucketIdx] = useState<number>(0);
  const [showFullErrorTable, setShowFullErrorTable] = useState<boolean>(false);

  // Section 5 state: Adversarial loop
  const [advStepIdx, setAdvStepIdx] = useState<number>(0);

  const passAtK = 1 - Math.pow(1 - singleProb, numK);
  const passPowerK = Math.pow(singleProb, numK);
  const activePillar =
    RL_MONITORING_PILLARS.find((p) => p.id === activePillarId) || RL_MONITORING_PILLARS[0];
  const activeBucket = ERROR_BUCKETS[selectedBucketIdx];

  return (
    <div className="space-y-10">
      {/* ========================================================= */}
      {/* STICKY QUICK SECTION BOOKMARKS BAR                        */}
      {/* ========================================================= */}
      <div className="sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border border-emerald-500/40 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
          <Bookmark className="h-4 w-4 text-emerald-400" />
          <span>Quick Section Bookmarks:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs font-mono">
          <button
            onClick={() =>
              document.getElementById('section-eval-types')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-start gap-2 text-left cursor-pointer"
          >
            <Scale className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold truncate">1. Elo &amp; pass@k</span>
          </button>

          <button
            onClick={() =>
              document
                .getElementById('section-calibration-holistic')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-start gap-2 text-left cursor-pointer"
          >
            <Gauge className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="font-semibold truncate">2. ECE, Speed &amp; HELM</span>
          </button>

          <button
            onClick={() =>
              document
                .getElementById('section-rl-monitoring')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-start gap-2 text-left cursor-pointer"
          >
            <Activity className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold truncate">3. RL &amp; Reward Hack</span>
          </button>

          <button
            onClick={() =>
              document
                .getElementById('section-error-analysis')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-start gap-2 text-left cursor-pointer"
          >
            <Wrench className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span className="font-semibold truncate">4. 14 Error Fixes</span>
          </button>

          <button
            onClick={() =>
              document
                .getElementById('section-investing-redteam')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-rose-500/20 text-slate-200 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-all flex items-center justify-start gap-2 text-left cursor-pointer"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-rose-400 shrink-0" />
            <span className="font-semibold truncate">5. Start Small &amp; Red Team</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: EVAL SETS, PAIRWISE ELO & PASS@K VS PASS^K     */}
      {/* ========================================================= */}
      <section id="section-eval-types" className="space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Scale className="h-4 w-4" /> Section 1 · Core Evaluation Paradigms
          </div>
          <h2 className="text-2xl font-bold text-white">
            Eval Datasets, Pairwise Preferences (Elo) &amp; pass@k vs. pass^k
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            For fine-tuning, held-out eval sets judge model outputs against desired behavior. For RL and open-ended chat, pairwise preference battles aggregate wins/losses into Elo ratings, while verifiable tasks use <strong>pass@k</strong> (at least 1 of k passes) vs. <strong>pass^k</strong> (all k must pass).
          </p>
        </div>

        {/* Pairwise Battle Card + Interactive pass@k vs pass^k Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 glass-panel rounded-2xl p-5 space-y-4 border-emerald-500/30">
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase border-b border-slate-800 pb-2">
              Pairwise Preference Evaluation (Elo)
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-rose-300">
              Prompt: &quot;I have a headache...&quot;
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-slate-300">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-rose-300">Model Output A</span>
                  <span className="text-rose-400">Loss</span>
                </div>
                &quot;You have a headache...&quot; (literal repetition, no empathy)
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-emerald-100">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-emerald-300">Model Output B</span>
                  <span className="text-emerald-400 font-bold">Win (+Elo)</span>
                </div>
                &quot;Hope you feel better!&quot; (polite, natural empathy)
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Across thousands of head-to-head battles (win / lose / draw), Elo ratings summarize relative conversational quality without requiring a single rigid ground-truth string.
            </p>
          </div>

          <div className="lg:col-span-7 glass-panel rounded-2xl p-5 space-y-4 border-cyan-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                <Sliders className="h-4 w-4" /> Interactive pass@k vs. pass^k Simulator
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Capability vs. Consistency
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-300">Single-Trial Success (p)</span>
                  <span className="text-cyan-300 font-bold">{(singleProb * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  value={singleProb}
                  onChange={(e) => setSingleProb(parseFloat(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-300">Number of Trials (k)</span>
                  <span className="text-purple-300 font-bold">k = {numK}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={numK}
                  onChange={(e) => setNumK(parseInt(e.target.value, 10))}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                <div className="text-xs font-mono text-emerald-400 font-bold">
                  pass@{numK} (At least 1 succeeds)
                </div>
                <div className="text-2xl font-black font-mono text-white">
                  {(passAtK * 100).toFixed(1)}%
                </div>
                <MathFormula math="\text{pass@}k = 1 - (1 - p)^k" />
                <p className="text-[11px] text-slate-400">
                  Measures peak problem-solving potential with retries/sampling.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
                <div className="text-xs font-mono text-amber-400 font-bold">
                  pass^{numK} (All {numK} must pass)
                </div>
                <div className="text-2xl font-black font-mono text-white">
                  {(passPowerK * 100).toFixed(1)}%
                </div>
                <MathFormula math="\text{pass}^k = p^k" />
                <p className="text-[11px] text-slate-400">
                  Measures strict production reliability across repeated runs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Figures 1-4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FigureCard
            figureNumber={1}
            title="Eval Set for Preference Learning (Reward Model)"
            src="/images/post_train_eval_preference_set.png"
            alt="Evaluation set checking whether Reward Model matches preference label B"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={2}
            title="Held-Out Eval Set for Fine-Tuning"
            src="/images/post_train_eval_ft_set.png"
            alt="Held-out dataset comparing desired fine-tuning behavior against model output"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={3}
            title="Pairwise Evals for Preferences & Elo Ratings"
            src="/images/post_train_eval_pairwise_elo.png"
            alt="Pairwise comparison of Output A vs Output B aggregated via Elo ratings"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={4}
            title="Verifiable Correctness & pass@k Grader"
            src="/images/post_train_eval_pass_at_k.png"
            alt="pass@k evaluation checking math correctness (+1) and JSON format (+1)"
            onExpand={setModalImage}
          />
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: CALIBRATION (ECE), EFFICIENCY & HOLISTIC SUITES*/}
      {/* ========================================================= */}
      <section id="section-calibration-holistic" className="space-y-6 pt-2">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Gauge className="h-4 w-4" /> Section 2 · Calibration, Efficiency &amp; Holistic Suites
          </div>
          <h2 className="text-2xl font-bold text-white">
            Calibration (ECE), Latency/Token Efficiency &amp; HELM / GDPval
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Accuracy alone is not enough. Production models must be <strong>well-calibrated</strong> (if a model predicts 85% rain or 80% on option A, it should be right ~85% / ~80% of the time), <strong>efficient</strong> in latency and tokens, and evaluated holistically across real-world tasks.
          </p>
        </div>

        {/* ECE Formula + Next-Token Calibration Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 glass-panel rounded-2xl p-5 space-y-4 border-cyan-500/30">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase block">
              Expected Calibration Error (ECE) &amp; Reliability Diagram
            </span>
            <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800">
              <MathFormula
                math="\text{ECE} = \sum_{m=1}^{M} \frac{|B_m|}{N} \Big| \text{acc}(B_m) - \text{conf}(B_m) \Big|"
                block
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-mono font-bold text-cyan-300">Multiple-Choice</div>
                <p className="text-slate-400">Extract softmax probability for A/B/C/D and compare to empirical accuracy.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-mono font-bold text-indigo-300">Sequence-Level</div>
                <p className="text-slate-400">Aggregate &amp; normalize token probs (geometric mean / length-normalized log-prob).</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-mono font-bold text-rose-300">Curve Reading</div>
                <p className="text-slate-400">Below y=x = overconfident; above y=x = underconfident. Lower ECE is better.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 glass-panel rounded-2xl p-5 space-y-3 border-slate-800">
            <div className="text-xs font-mono font-bold text-amber-300 uppercase">
              Next-Token Calibration: &quot;The Earth orbits the ___&quot;
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2">Token</th>
                    <th className="py-2">Model Prob</th>
                    <th className="py-2">Empirical</th>
                  </tr>
                </thead>
                <tbody>
                  {CALIBRATION_TOKENS.map((row) => (
                    <tr key={row.token} className="border-b border-slate-800/60">
                      <td className="py-2 text-slate-200 font-semibold">{row.token}</td>
                      <td
                        className={`py-2 font-bold ${
                          row.status === 'bad'
                            ? 'text-rose-400'
                            : row.status === 'good'
                            ? 'text-emerald-400'
                            : 'text-slate-300'
                        }`}
                      >
                        {row.modelProb.toFixed(2)}
                      </td>
                      <td
                        className={`py-2 font-bold ${
                          row.status === 'bad'
                            ? 'text-rose-400'
                            : row.status === 'good'
                            ? 'text-emerald-400'
                            : 'text-slate-300'
                        }`}
                      >
                        {row.empirical.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-rose-300 leading-relaxed">
              Misallocated mass (5% on &quot;sandwich&quot; when empirical = 0%) causes nonsensical completions during stochastic sampling.
            </p>
          </div>
        </div>

        {/* Efficiency Toggle + HELM 7 Dimensions & GDPval */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 glass-panel rounded-2xl p-5 space-y-4 border-amber-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-amber-300 uppercase flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> Efficiency: Concise vs. Verbose
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setEfficiencyMode('concise')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border cursor-pointer ${
                    efficiencyMode === 'concise'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  20ms
                </button>
                <button
                  onClick={() => setEfficiencyMode('verbose')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border cursor-pointer ${
                    efficiencyMode === 'verbose'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  100ms
                </button>
              </div>
            </div>

            <div className="text-xs font-mono text-rose-300">Prompt: &quot;What is 1+10?&quot;</div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-200">
              {efficiencyMode === 'concise'
                ? 'Output: 11  (20 ms — low TTFT/TPOT, high token efficiency)'
                : 'Output: <think> OK so 1+10=11 </think><answer>11</answer>  (100 ms — 5x slower for trivial math)'}
            </div>
            <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
              <li><strong>TTFT:</strong> Time to First Token (responsiveness)</li>
              <li><strong>TPOT:</strong> Time per Output Token (streaming speed)</li>
              <li><strong>Cost &amp; Token Efficiency:</strong> Cost per sample &amp; avoiding overthinking</li>
            </ul>
          </div>

          <div className="lg:col-span-7 glass-panel rounded-2xl p-5 space-y-4 border-indigo-500/30">
            <div className="text-xs font-mono font-bold text-indigo-300 uppercase flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Compass className="h-4 w-4" /> Holistic Suites (HELM 7 Dimensions) &amp; GDPval Evolution
            </div>
            <div className="flex flex-wrap gap-2">
              {HELM_DIMENSIONS.map((dim, idx) => (
                <button
                  key={dim.name}
                  onClick={() => setSelectedHelmIdx(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border cursor-pointer ${
                    selectedHelmIdx === idx
                      ? 'bg-indigo-500/20 text-indigo-200 border-indigo-400/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {dim.name}
                </button>
              ))}
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <strong className="text-indigo-300">{HELM_DIMENSIONS[selectedHelmIdx].name}:</strong>{' '}
              {HELM_DIMENSIONS[selectedHelmIdx].desc}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30">
                <div className="font-mono font-bold text-amber-300 mb-1">Traditional Benchmarks</div>
                <div className="text-slate-300">MMLU exams, SWE-Bench coding, lab scenarios, simple text prompts.</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <div className="font-mono font-bold text-emerald-300 mb-1">GDPval Approach</div>
                <div className="text-slate-300">Real professional tasks, reference files &amp; context, complex deliverables, expert evaluation.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Figures 5-9 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FigureCard
            figureNumber={5}
            title="Calibration Reliability Diagram & ECE"
            src="/images/post_train_eval_calibration_ece.png"
            alt="Reliability diagram comparing predicted vs empirical probability and ECE"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={6}
            title="Next-Token Calibration (Sun vs. Sandwich)"
            src="/images/post_train_eval_calibration_tokens.png"
            alt="Table comparing model probabilities vs empirical occurrence for The Earth orbits the"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={7}
            title="Evals for Efficiency (TTFT, TPOT & Token Conciseness)"
            src="/images/post_train_eval_efficiency.png"
            alt="Comparison of 20ms concise output vs 100ms verbose reasoning output for 1+10"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={8}
            title="Holistic Eval Suites: HELM (7 Dimensions)"
            src="/images/post_train_eval_helm.png"
            alt="HELM framework evaluating 7 dimensions beyond accuracy"
            onExpand={setModalImage}
          />
          <div className="md:col-span-2">
            <FigureCard
              figureNumber={9}
              title="The Evolution of AI Evaluation (Traditional Benchmarks -> GDPval)"
              src="/images/post_train_eval_evolution_gdpval.png"
              alt="Evolution from MMLU and SWE-Bench to real professional tasks in GDPval"
              onExpand={setModalImage}
            />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: RL MONITORING, VERIFIERS & REWARD HACKING      */}
      {/* ========================================================= */}
      <section id="section-rl-monitoring" className="space-y-6 pt-2">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Activity className="h-4 w-4" /> Section 3 · Eval for RL &amp; Reward Hacking
          </div>
          <h2 className="text-2xl font-bold text-white">
            Online RL Monitoring (4 Pillars), Verifier Classes &amp; Held-Out Reward Models
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Optimizing a policy with RL can easily cause instability, mode collapse, or reward hacking. Verification requires both <strong>online runtime monitoring</strong> during updates and <strong>held-out test environments</strong> with a freshly trained Reward Model.
          </p>
        </div>

        {/* Interactive 4 Online Monitoring Pillars */}
        <div className="glass-panel rounded-2xl p-6 space-y-4 border-amber-500/30">
          <div className="text-xs font-mono font-bold text-amber-300 uppercase">
            Part 1: Four Online Monitoring Pillars During RL Updates
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {RL_MONITORING_PILLARS.map((pillar) => (
              <button
                key={pillar.id}
                onClick={() => setActivePillarId(pillar.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  activePillarId === pillar.id
                    ? `${pillar.color} ring-1 ring-white/20`
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold text-white">{pillar.title}</div>
                <div className="text-[11px] font-mono mt-1 opacity-85">{pillar.role}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div>
              <span className="font-mono text-slate-400 uppercase block mb-1">What It Measures</span>
              <p className="text-slate-200 leading-relaxed">{activePillar.measures}</p>
            </div>
            <div>
              <span className="font-mono text-slate-400 uppercase block mb-1">Why It Matters</span>
              <p className="text-slate-200 leading-relaxed">{activePillar.why}</p>
            </div>
          </div>
        </div>

        {/* Part 2: Comprehensive Verifiers Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-3">
          <div className="text-xs font-mono font-bold text-cyan-300 uppercase flex items-center gap-1.5">
            <Layers className="h-4 w-4" /> Part 2: Comprehensive Verifiers in the RL Pipeline
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 font-mono text-slate-400">
                  <th className="py-2.5 pr-4">Verifier Type</th>
                  <th className="py-2.5 pr-4">Target Domains</th>
                  <th className="py-2.5 pr-4">How It Verifies</th>
                  <th className="py-2.5">Strengths &amp; Vulnerabilities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {RL_VERIFIER_CLASSES.map((v) => (
                  <tr key={v.type}>
                    <td className="py-3 pr-4 font-bold text-white align-top">{v.type}</td>
                    <td className="py-3 pr-4 text-cyan-300 font-mono align-top">{v.domains}</td>
                    <td className="py-3 pr-4 text-slate-300 align-top">{v.how}</td>
                    <td className="py-3 text-slate-300 align-top">{v.tradeoffs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reward Hacking Callout */}
        <div className="rounded-2xl border border-rose-500/40 bg-rose-950/20 p-5 space-y-2 text-xs">
          <div className="font-mono font-bold text-rose-300 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4" /> Reward Hacking Example (&quot;Greet politely&quot;)
          </div>
          <p className="text-slate-200 leading-relaxed">
            Model outputs <code className="text-rose-200">&quot;Hello, hello, hello, hello, hello, hello, hello!!!!!&quot;</code> and scores <strong>+1 Politeness +1 Enthusiasm +1 Engagement = +3</strong>. Always evaluate held-out RL test sets using a <strong>new Reward Model</strong> trained on disjoint preference data so the policy cannot exploit quirks of the training RM.
          </p>
        </div>

        {/* Figures 10-12 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FigureCard
            figureNumber={10}
            title="Monitoring During RL Updates (4 Pillars)"
            src="/images/post_train_eval_rl_monitoring.png"
            alt="Four online RL monitoring metrics: KL-Divergence, Alignment Tax, Sample Efficiency, Rollout Diversity"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={11}
            title="Held-Out RL Test Environments (New Reward Model)"
            src="/images/post_train_eval_rl_heldout_rm.png"
            alt="Best practice: train a new reward model on held-out preference data to detect reward hacking"
            onExpand={setModalImage}
          />
          <div className="md:col-span-2">
            <FigureCard
              figureNumber={12}
              title="What Is Reward Hacking? (Greet Politely Example)"
              src="/images/post_train_eval_reward_hacking.png"
              alt="Reward hacking example where repetitive Hello!!!!! earns +3 total reward"
              onExpand={setModalImage}
            />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: ERROR ANALYSIS PLAYBOOK (14 ERROR BUCKETS)     */}
      {/* ========================================================= */}
      <section id="section-error-analysis" className="space-y-6 pt-2">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <Wrench className="h-4 w-4" /> Section 4 · Error Analysis Playbook
            </div>
            <h2 className="text-2xl font-bold text-white">
              Errors &rarr; Root Causes &rarr; Fine-Tuning &amp; RL Fixes (14 Buckets)
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
              Select any failure mode below to inspect its symptoms, root causes, and targeted SFT vs. RL interventions—or toggle the full reference matrix.
            </p>
          </div>
          <button
            onClick={() => setShowFullErrorTable(!showFullErrorTable)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-purple-300 shrink-0 cursor-pointer"
          >
            {showFullErrorTable ? 'Show Interactive Explorer' : 'Show All 14 Buckets Table'}
          </button>
        </div>

        {!showFullErrorTable ? (
          <div className="glass-panel rounded-2xl p-6 space-y-5 border-purple-500/30">
            <div className="flex flex-wrap gap-2">
              {ERROR_BUCKETS.map((eb, idx) => (
                <button
                  key={eb.bucket}
                  onClick={() => setSelectedBucketIdx(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                    selectedBucketIdx === idx
                      ? 'bg-purple-500/20 text-purple-200 border-purple-400/50'
                      : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {idx + 1}. {eb.bucket}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1.5">
                <div className="font-mono font-bold text-rose-300 flex items-center gap-1.5">
                  <XCircle className="h-4 w-4" /> Typical Symptoms
                </div>
                <p className="text-slate-200 leading-relaxed">{activeBucket.symptoms}</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                <div className="font-mono font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" /> Likely Root Causes
                </div>
                <p className="text-slate-200 leading-relaxed">{activeBucket.causes}</p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-1.5">
                <div className="font-mono font-bold text-indigo-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Fine-Tuning (SFT) Intervention
                </div>
                <p className="text-slate-200 leading-relaxed">{activeBucket.sftFix}</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                <div className="font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" /> Reinforcement Learning (RL) Intervention
                </div>
                <p className="text-slate-200 leading-relaxed">{activeBucket.rlFix}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 font-mono text-slate-400">
                  <th className="py-2.5 pr-3">Error Bucket</th>
                  <th className="py-2.5 pr-3">Symptoms</th>
                  <th className="py-2.5 pr-3">Root Causes</th>
                  <th className="py-2.5 pr-3">SFT Fix</th>
                  <th className="py-2.5">RL Fix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {ERROR_BUCKETS.map((eb) => (
                  <tr key={eb.bucket}>
                    <td className="py-3 pr-3 font-bold text-purple-300 align-top">{eb.bucket}</td>
                    <td className="py-3 pr-3 text-slate-300 align-top">{eb.symptoms}</td>
                    <td className="py-3 pr-3 text-slate-400 align-top">{eb.causes}</td>
                    <td className="py-3 pr-3 text-indigo-200 align-top">{eb.sftFix}</td>
                    <td className="py-3 text-emerald-200 align-top">{eb.rlFix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* SECTION 5: STARTING SMALL & AUTOMATED RED TEAMING         */}
      {/* ========================================================= */}
      <section id="section-investing-redteam" className="space-y-6 pt-2">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="h-4 w-4" /> Section 5 · Investing in Evals &amp; Red Teaming
          </div>
          <h2 className="text-2xl font-bold text-white">
            Start Small (20 High-Value Examples) &amp; Automated Adversarial Red Teaming
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Don&apos;t wait to build a 10,000-example benchmark. Start with <strong>20 examples</strong> users care most about graded by <strong>1 in-house expert</strong> for consistency, then continuously harden safety with Red Teaming and automated adversarial jailbreak loops.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Start Small Finance Case Study */}
          <div className="lg:col-span-6 glass-panel rounded-2xl p-5 space-y-3 border-indigo-500/30 text-xs">
            <div className="font-mono font-bold text-indigo-300 uppercase flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Target className="h-4 w-4" /> Week-1 Eval Playbook (20 Finance Examples)
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-mono font-bold text-rose-300">
                Observed Issue 1: Hallucinated Stock Prices
              </div>
              <p className="text-slate-300">
                <strong>Actionable Insight:</strong> Penalize &quot;confidently wrong&quot; numbers and add examples of grounding in externally retrieved data.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-mono font-bold text-amber-300">
                Observed Issue 2: Summaries Exceed 100 Words
              </div>
              <p className="text-slate-300">
                <strong>Actionable Insight:</strong> Adjust the reward function to explicitly penalize outputs exceeding the 100-word constraint.
              </p>
            </div>
          </div>

          {/* Interactive Automated Adversarial Generation Loop */}
          <div className="lg:col-span-6 glass-panel rounded-2xl p-5 space-y-4 border-rose-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-rose-300 uppercase flex items-center gap-1.5">
                <RefreshCw className="h-4 w-4" /> Automated Adversarial Loop
              </span>
              <button
                onClick={() => setAdvStepIdx((prev) => (prev + 1) % ADVERSARIAL_LOOP_STEPS.length)}
                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
              >
                <Play className="h-3 w-3 fill-white" /> Next Phase
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {ADVERSARIAL_LOOP_STEPS.map((st, idx) => (
                <button
                  key={st.name}
                  onClick={() => setAdvStepIdx(idx)}
                  className={`p-2.5 rounded-xl border text-xs font-mono font-bold text-center cursor-pointer ${
                    advStepIdx === idx
                      ? st.color
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {st.name}
                </button>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">{ADVERSARIAL_LOOP_STEPS[advStepIdx].name}:</strong>{' '}
              {ADVERSARIAL_LOOP_STEPS[advStepIdx].detail}
            </div>
          </div>
        </div>

        {/* Figures 13-15 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FigureCard
            figureNumber={13}
            title="Why Evals Should Start Small (20 Examples, 1 Expert)"
            src="/images/post_train_eval_start_small.png"
            alt="Starting small with 20 finance examples yielding immediate week-1 actionable insights"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={14}
            title="GPT-4 Jailbreaks Discovered by Red Teaming (DAN)"
            src="/images/post_train_eval_redteam_jailbreak.png"
            alt="Example of DAN persona jailbreak discovered by red team"
            onExpand={setModalImage}
          />
          <div className="md:col-span-2">
            <FigureCard
              figureNumber={15}
              title="Automated Adversarial Generation (Generate -> Test -> Refine)"
              src="/images/post_train_eval_adversarial_loop.png"
              alt="Automated adversarial workflow using LLMs to generate, test, and refine jailbreaks at scale"
              onExpand={setModalImage}
            />
          </div>
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
              <span>Source: Evaluation.docx</span>
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
