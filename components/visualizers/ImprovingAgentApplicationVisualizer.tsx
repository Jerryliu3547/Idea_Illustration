"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAssetPath } from '@/lib/asset';
import { 
  Bot, 
  Workflow, 
  Scale, 
  Sparkles,
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Terminal, 
  ArrowRight, 
  FileCheck, 
  Maximize2, 
  Minimize2, 
  Database, 
  Eye, 
  Sliders, 
  FileText, 
  AlertTriangle, 
  Layers, 
  Activity,
  Layers2, 
  Cpu,
  ThumbsDown,
  ThumbsUp,
  UserX,
  RefreshCw,
  GitCompare,
  TrendingUp,
  Check,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Search,
  Zap,
  ArrowUpRight,
  Flame,
  Clock,
  DollarSign
} from 'lucide-react';

export const ImprovingAgentApplicationVisualizer: React.FC = () => {
  // ==========================================
  // SECTION 1: CAPABILITY VS REGRESSION & TRIAGE
  // ==========================================
  const [showSection1Diagrams, setShowSection1Diagrams] = useState<boolean>(true);
  const [selectedTriageScenario, setSelectedTriageScenario] = useState<'safety_critical' | 'pamela_walk' | 'cosmetic_greeting' | 'rare_formatting'>('pamela_walk');

  const triageScenarios = {
    pamela_walk: {
      title: "1. Pamela's Constraint: Walk Duration / Timing Restriction",
      clusterSize: 'Medium Cluster (14% of users)',
      failureType: 'User Constraint Neglect',
      example: '"I can only walk for 10 minutes" or "Don\'t schedule me for walks after six"',
      severity: 'High (User Retention & Schedule Conflict)',
      effort: 'Low (System prompt negative constraint or tool schema check)',
      roiVerdict: 'HIGH ROI — SPRINT NOW',
      recommendation: 'Write capability eval immediately. Will fail at baseline (0%), then add constraint prompt to reach 100% while verifying regression suite.',
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      valueScore: 88,
      severityScore: 82,
      effortScore: 25,
    },
    safety_critical: {
      title: '2. Dog Behavior Mismatch: Reactive Dog Assigned to Inexperienced Walker',
      clusterSize: 'Rare Cases (<0.5% of bookings)',
      failureType: 'Physical Safety & Liability Breach',
      example: 'Assigned 100-lb reactive Dalmatian (Pepper) to a beginner volunteer without clearance',
      severity: 'CRITICAL (Liability & Physical Harm)',
      effort: 'Moderate (Deterministic code evaluator check on volunteer certification)',
      roiVerdict: 'MANDATORY — IMMEDIATE P0 HOTFIX',
      recommendation: 'Low volume does NOT mean low priority! Rare safety failures must be treated with zero tolerance. Add hard deterministic validator.',
      color: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      valueScore: 99,
      severityScore: 100,
      effortScore: 40,
    },
    cosmetic_greeting: {
      title: '3. Conversational Style: Verbose Pleasantries in Confirmation',
      clusterSize: 'Large Cluster (42% of interactions)',
      failureType: 'Cosmetic / Stylistic Inefficiency',
      example: 'Agent adds 3 sentences of polite chatter before outputting appointment confirmation number',
      severity: 'Very Low (Harmless, minor latency increase)',
      effort: 'Low (System prompt brevity instruction)',
      roiVerdict: 'LOW ROI — BATCH OR DEFER',
      recommendation: 'Do not disrupt active engineering cycles for pure cosmetic verbosity unless overall token cost/latency thresholds are exceeded.',
      color: 'border-blue-500/40 bg-blue-950/20 text-blue-300',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      valueScore: 30,
      severityScore: 15,
      effortScore: 20,
    },
    rare_formatting: {
      title: '4. Obscure Timezone: ISO-8601 Sub-second Offset in Error Traces',
      clusterSize: 'Rare Cases (0.08% of queries)',
      failureType: 'Technical Edge Case',
      example: 'User inputs non-standard military timestamp like `1800Z+00` which trips regex fallback',
      severity: 'Low (Graceful fallback to standard prompt occurs)',
      effort: 'High (Requires overhaul of datetime parser across 3 tools)',
      roiVerdict: 'NEGATIVE ROI — DEFER / WONT FIX',
      recommendation: 'High engineering effort with minimal user impact. Log trace and ignore until higher-value workflows are stabilized.',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      valueScore: 15,
      severityScore: 20,
      effortScore: 85,
    },
  };

  const activeTriage = triageScenarios[selectedTriageScenario];

  // ==========================================
  // SECTION 2: EVIDENCE PYRAMID & BENCHMARK AUDIT
  // ==========================================
  const [showSection2Diagrams, setShowSection2Diagrams] = useState<boolean>(true);
  const [selectedPyramidLevel, setSelectedPyramidLevel] = useState<'data' | 'prompting' | 'tools' | 'model' | 'hyperparams'>('data');
  const [activeVersionTab, setActiveVersionTab] = useState<'v1' | 'v2' | 'v3'>('v3');

  const pyramidLevels = {
    data: {
      level: 1,
      name: '1. Data Quality (Foundation)',
      symptom: 'Missing or Inconsistent Information',
      description: 'The agent cannot reason over facts it was never given. If the customer record, inventory database, or availability calendar is incomplete, stale, or conflicting, no amount of prompt engineering will fix the error.',
      prescription: 'Audit data pipelines, verify RAG chunk retrieval, ensure DB schema fields are populated before agent execution.',
      color: 'text-rose-400 border-rose-500/30 bg-rose-950/30',
      tag: 'Always Start Here',
    },
    prompting: {
      level: 2,
      name: '2. Prompting',
      symptom: 'Unclear Requirement or Ambiguous Intent',
      description: 'The necessary data exists, but the agent misinterprets the user requirement, ignores negative constraints, or uses the wrong tone/format. Prompt engineering clarifies operational boundaries.',
      prescription: 'Add explicit grounding rules, negative constraints ("Do NOT schedule after 18:00"), few-shot demonstrations, and structured output templates.',
      color: 'text-purple-400 border-purple-500/30 bg-purple-950/30',
      tag: 'Most Frequent Fix',
    },
    tools: {
      level: 3,
      name: '3. Tools & Workflow',
      symptom: 'Execution Difficulty & Inconvenient Interfaces',
      description: 'The agent understands what to do, but the available tool APIs are awkward, require redundant roundtrips, or dump too much noisy context into the model context window.',
      prescription: 'Consolidate multiple tool calls into macro-tools, refine parameter schemas, add argument validations, and return filtered tool outputs.',
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/30',
      tag: 'Architecture Fix',
    },
    model: {
      level: 4,
      name: '4. Model Choice',
      symptom: 'Task Fundamentally Still Too Hard',
      description: 'Even with pristine data, explicit prompts, and clean tools, the reasoning depth, multi-step planning, or context length exceeds the inherent capacity of the model.',
      prescription: 'Upgrade reasoning model tier (e.g. from 8B to 70B, or switch to a specialized reasoning model with extended test-time compute).',
      color: 'text-amber-400 border-amber-500/30 bg-amber-950/30',
      tag: 'Capacity Scaling',
    },
    hyperparams: {
      level: 5,
      name: '5. Hyperparameters',
      symptom: 'Sampling Problem (Hallucination vs Loop Repetition)',
      description: 'The model occasionally behaves erratically due to token sampling stochasticity—high temperature causing hallucinated tool names, or zero temperature causing repetitive looping.',
      prescription: 'Tune temperature (lower for deterministic tool calls, T=0.1-0.2), adjust top_p, and calibrate presence/frequency penalties.',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30',
      tag: 'Fine-Tuning Polish',
    },
  };

  const activePyramid = pyramidLevels[selectedPyramidLevel];

  const versionComparisonData = {
    v1: {
      name: 'Baseline Agent (v1.0)',
      rule: 'Generic prompt: "Help users schedule and manage dog outings."',
      capabilityScore: 12,
      regressionScore: 98,
      faithfulnessJudge: 3.2,
      redundantToolCalls: 3.8,
      latencySec: 2.4,
      costPerQuery: '$0.012',
      status: 'fails_capability',
      notes: 'Completely ignores Pamela\'s constraint ("booked walk at 7 PM"). Causes user conflict.',
    },
    v2: {
      name: 'Grounding Rule (v1.1)',
      rule: 'Added constraint: "Always search availability before booking and respect user times."',
      capabilityScore: 84,
      regressionScore: 91,
      faithfulnessJudge: 4.5,
      redundantToolCalls: 2.2,
      latencySec: 1.9,
      costPerQuery: '$0.009',
      status: 'partial_pass',
      notes: 'Respects Pamela\'s timing, but introduces slight regression: searches 2 redundant calendar APIs.',
    },
    v3: {
      name: 'Refined Rule (v1.2)',
      rule: 'Optimized schema: Single consolidated check with explicit negative rules & deterministic verification.',
      capabilityScore: 98,
      regressionScore: 99,
      faithfulnessJudge: 4.9,
      redundantToolCalls: 0.1,
      latencySec: 1.1,
      costPerQuery: '$0.004',
      status: 'certified_production',
      notes: 'Passes capability constraint, maintains 99% regression fidelity, eliminates wasted tool calls, and cuts latency by 54%.',
    },
  };

  // ==========================================
  // SECTION 3: THE 4 PRODUCTION PILLARS
  // ==========================================
  const [showSection3Diagrams, setShowSection3Diagrams] = useState<boolean>(true);
  const [selectedPillar, setSelectedPillar] = useState<'monitoring' | 'review' | 'feedback' | 'ab_testing'>('monitoring');

  const pillarsData = {
    monitoring: {
      title: 'Pillar 1: Production Monitoring',
      subtitle: 'Answers: "WHERE is the problem occurring?"',
      icon: Activity,
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20',
      tag: 'Automated Telemetry',
      focus: 'High-level aggregated signals across 100% of live traffic',
      signals: [
        { label: 'Policy Flags', val: '37 Eligibility Violations', status: 'alert' },
        { label: 'Tool Failure Rate', val: '4.2% (Target <1.5%)', status: 'alert' },
        { label: 'p95 Response Latency', val: '2.8s (Nominal: 1.4s)', status: 'warning' },
        { label: 'Fallback Invocation', val: '1.1% of queries', status: 'good' },
      ],
      description: 'Production monitoring uses automated policy evaluators and system counters. It continuously sweeps live logs to flag anomalous clusters, answering WHERE to look without needing manual human inspection.',
    },
    review: {
      title: 'Pillar 2: Manual Review',
      subtitle: 'Answers: "WHAT really happened inside the trace?"',
      icon: Search,
      color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/20',
      tag: 'Qualitative Root-Cause',
      focus: 'Deep-dive inspection into the flagged 37 eligibility failure traces',
      signals: [
        { label: 'Skipped Check?', val: '14 traces bypassed volunteer badge check', status: 'alert' },
        { label: 'Wrong Argument?', val: '11 traces transposed dog_id with outing_id', status: 'alert' },
        { label: 'Ignored Result?', val: '8 traces got "SLOT_TAKEN" but booked anyway', status: 'alert' },
        { label: 'Wrong Conclusion?', val: '4 traces hallucinated positive confirmation', status: 'alert' },
      ],
      description: 'Once monitoring raises an alert, QA and engineers inspect full traces. This follows the operational doctrine: COUNT → TRACE → PATTERN, identifying the exact mechanistic reason for the failure.',
    },
    feedback: {
      title: 'Pillar 3: User Feedback & Behavioral Signals',
      subtitle: 'Answers: "WHAT is frustrating real end-users?"',
      icon: ThumbsDown,
      color: 'text-amber-400 border-amber-500/40 bg-amber-950/20',
      tag: 'User Experience Signals',
      focus: 'Explicit ratings and passive behavioral drop-off telemetry',
      signals: [
        { label: 'Explicit Thumbs-Down', val: '2.8% of completed sessions', status: 'warning' },
        { label: 'Conversation Abandonment', val: '8.4% user quit after Step 2', status: 'alert' },
        { label: 'Repeated Questions', val: '14.2% users re-prompted same intent', status: 'alert' },
        { label: 'Rage Prompts ("No!", "Stop")', val: '3.1% escalation rate', status: 'alert' },
      ],
      description: 'Golden Law: A signal points to an interaction; it does not diagnose the cause! High abandonment or repeated questions indicate the agent failed to fulfill user intent, pointing engineers to specific traces for review.',
    },
    ab_testing: {
      title: 'Pillar 4: A/B Testing on Real Traffic',
      subtitle: 'Answers: "Is the revised agent ACTUALLY better in live traffic?"',
      icon: GitCompare,
      color: 'text-purple-400 border-purple-500/40 bg-purple-950/20',
      tag: 'Live Traffic Validation',
      focus: '50/50 randomized split between Current Agent and Revised Agent',
      signals: [
        { label: 'Task Completion Rate', val: 'Current: 82.4% vs Revised: 94.1%', status: 'good' },
        { label: 'Follow-Up Turns Required', val: 'Current: 3.6 turns vs Revised: 2.1 turns', status: 'good' },
        { label: 'Policy Violations', val: 'Current: 3.8% vs Revised: 0.2%', status: 'good' },
        { label: 'User Satisfaction (CSAT)', val: 'Current: 4.1/5 vs Revised: 4.7/5', status: 'good' },
      ],
      description: 'A/B testing validates changes under genuine user stochasticity. It proves whether an offline benchmark gain translates to real customer success without unforeseen side effects.',
    },
  };

  const activePillarData = pillarsData[selectedPillar];

  // ==========================================
  // SECTION 4: CONTINUOUS IMPROVEMENT FLYWHEEL
  // ==========================================
  const [showSection4Diagrams, setShowSection4Diagrams] = useState<boolean>(true);
  const [activeFlywheelStep, setActiveFlywheelStep] = useState<number>(1);

  const flywheelSteps = [
    {
      step: 1,
      title: '1. Production Trace Capture',
      owner: 'Production Monitoring & User Telemetry',
      input: 'Live user prompt: "I can only walk for about ten minutes. Is Pepper free on Saturday?"',
      output: 'Flagged trace where agent ignored 10-minute constraint and booked standard 60-min walk.',
      icon: AlertTriangle,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      action: 'Isolate trace, anonymize PII, and register as new failure candidate.',
    },
    {
      step: 2,
      title: '2. Expected Behavior & Rubric',
      owner: 'QA & Product Specialist',
      input: 'Volunteer profile: Short-walk volunteer (10 min max duration constraint).',
      output: 'LLM Judge Rubric & Code Assertion: "Constraint must be verified before confirmation; duration must be ≤ 15 min."',
      icon: FileCheck,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      action: 'Formulate ground-truth criterion: "If the constraint is handled and the rest stays healthy."',
    },
    {
      step: 3,
      title: '3. Curated Saved Case',
      owner: 'Benchmark Builder',
      input: 'Anonymized context, user prompt, and expected tool call assertion.',
      output: 'Permanent entry added to `eval_suite_capabilities.json` repository.',
      icon: Database,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      action: 'Benchmark expands organically, making offline evals increasingly representative of real usage.',
    },
    {
      step: 4,
      title: '4. Offline Comparison & Regression Run',
      owner: 'Evaluation Pipeline / CI',
      input: 'Baseline Agent vs Grounding Rule vs Refined Rule candidate.',
      output: 'Automated Scorecard: Faithfulness + Tool Economy + Regression Suite pass rate.',
      icon: GitCompare,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      action: 'Verify that new candidate passes new short-walk case with ZERO regression on existing 200+ tests.',
    },
    {
      step: 5,
      title: '5. Release & Continuous Monitoring',
      owner: 'Deployment Orchestrator',
      input: 'Validated agent promoted to canary or 50% A/B traffic split.',
      output: 'Updated policy metrics, lower abandonment, and continuous trace monitoring.',
      icon: RefreshCw,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      action: 'Flywheel closes! Production feeds evals, evals protect production.',
    },
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Top Navigation Tabs */}
      <div className="flex border-b border-slate-800 pb-3 gap-2 sm:gap-4 overflow-x-auto text-sm font-semibold">
        <Link
          href="/agentic-evaluation"
          className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent transition-all flex items-center gap-2 shrink-0"
        >
          <Scale className="h-4 w-4 text-emerald-400" />
          <span>Tab 1: Code Evaluators &amp; LLM Judges</span>
        </Link>
        <Link
          href="/agentic-evaluation/evaluating-applications"
          className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent transition-all flex items-center gap-2 shrink-0"
        >
          <Workflow className="h-4 w-4 text-cyan-400" />
          <span>Tab 2: Agent Applications &amp; Trajectories</span>
        </Link>
        <Link
          href="/agentic-evaluation/improving-in-production"
          className="px-4 py-2 rounded-xl text-amber-300 bg-amber-950/40 border border-amber-500/30 transition-all flex items-center gap-2 shadow-lg shadow-amber-950/20 shrink-0"
        >
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>Tab 3: Improve Agentic Application in Production</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
            New
          </span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="h-4 w-4" /> Production Lifecycle &amp; Optimization Framework
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Improve Agentic Applications in Production
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-4xl">
          Taking an agentic system from prototype to production is an empirical engineering discipline. Master <strong className="text-amber-300">Eval-Driven Development</strong>, prioritize fixes using the <strong className="text-emerald-300">Evidence Pyramid</strong>, synthesize <strong className="text-cyan-300">The 4 Production Pillars</strong>, and close the loop with the <strong className="text-purple-300">Continuous Production-to-Eval Flywheel</strong>.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <span className="px-3 py-1 rounded-lg text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Capability vs Regression Evals
          </span>
          <span className="px-3 py-1 rounded-lg text-xs font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-purple-400" /> Evidence-to-Change Pyramid
          </span>
          <span className="px-3 py-1 rounded-lg text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-cyan-400" /> Count → Trace → Pattern
          </span>
          <span className="px-3 py-1 rounded-lg text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
            <RefreshCw className="h-3.5 w-3.5 text-amber-400" /> Production Flywheel
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: EVAL-DRIVEN DEVELOPMENT & TRIAGE (FIGS 1 & 2) */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-emerald-500/20 text-emerald-300 font-bold">
              STAGE 1
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Eval-Driven Development &amp; Triage Prioritization
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
            Pre-Deployment &amp; Sprint Planning
          </span>
        </div>

        {/* Section 1 Explanatory Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold font-mono">
              <CheckCircle2 className="h-4 w-4" /> 1. Write an Eval for a Capability
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              When adding a capability (e.g. Pamela: <em>&quot;Don&apos;t schedule me for walks after six&quot;</em>), write the evaluation <strong>before</strong> touching the agent code or prompts.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">Capability Eval:</span>
                <span className="text-slate-400 text-[11px] block">Develops an ability. Expected to FAIL at first (<span className="text-rose-400">0%</span>) → becomes the development target.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">Regression Eval:</span>
                <span className="text-slate-400 text-[11px] block">Preserves baseline abilities. Must maintain <span className="text-emerald-400">100%</span> pass rate across all existing tools and flows.</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold font-mono">
              <Scale className="h-4 w-4" /> 2. Weigh Value, Severity and Effort
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <em>&quot;There is always something we can work on, but is it worth it?&quot;</em> Group failures into clusters: <strong>Large cluster → Smaller group → Rare cases</strong>.
            </p>
            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs text-rose-300 space-y-1">
              <span className="font-bold flex items-center gap-1.5 font-mono text-[11px] text-rose-400">
                <AlertTriangle className="h-3.5 w-3.5" /> CRITICAL SAFETY INSIGHT:
              </span>
              <p className="text-[11px] leading-relaxed text-slate-300">
                <strong>Rare safety failures can still matter!</strong> Volume alone does not dictate engineering priorities. A rare dog bite or unauthorized financial transfer overrides high-frequency cosmetic grievances.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1 Diagram Drawer Toggle */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Eye className="h-4 w-4 text-emerald-400" />
              <span>Reference Figures: Capability Eval &amp; Triage Framework</span>
            </div>
            <button
              onClick={() => setShowSection1Diagrams(!showSection1Diagrams)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              {showSection1Diagrams ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" /> Hide Diagrams
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" /> Show Diagrams (Figures 1-2)
                </>
              )}
            </button>
          </div>

          {showSection1Diagrams && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Figure 1 */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-mono text-slate-300 block font-semibold">
                    Figure 1: Write an Eval for a Capability (Pamela Example)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Eval-Driven
                  </span>
                </div>
                <Image
                  src={getAssetPath('/images/improve_eval_capability_driven.png')}
                  alt="Figure 1: Write an eval for a capability showing Pamela new capability expected to fail at first versus regression eval preserving abilities"
                  width={800}
                  height={450}
                  unoptimized
                  className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-[440px]"
                />
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-slate-200 font-mono">Takeaway:</strong> Write capability test cases before altering system prompts or code. The test initially fails, certifying that the eval functions correctly and creating a precise target for improvement.
                </p>
              </div>

              {/* Figure 2 */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-mono text-slate-300 block font-semibold">
                    Figure 2: Weigh Value, Severity and Effort (Triage &amp; Another Iteration?)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    ROI Gate
                  </span>
                </div>
                <Image
                  src={getAssetPath('/images/improve_weigh_value_severity_effort.png')}
                  alt="Figure 2: Weigh value, severity and effort showing QA clusters and another iteration decision balancing value, severity, and effort"
                  width={800}
                  height={450}
                  unoptimized
                  className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-[440px]"
                />
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-slate-200 font-mono">Takeaway:</strong> Cluster failures by volume, but evaluate iterations through three gates: <em>Value of improvement</em>, <em>Severity of remaining failures</em>, and <em>Engineering effort</em>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* INTERACTIVE SIMULATOR: TRIAGE & ROI DECISION MATRIX */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                Interactive Simulator
              </span>
              <h3 className="text-lg font-bold text-white">
                Failure Triage &amp; &quot;Another Iteration?&quot; ROI Engine
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              Select a Failure Case to Evaluate
            </span>
          </div>

          {/* Scenario Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {(Object.keys(triageScenarios) as Array<keyof typeof triageScenarios>).map((key) => {
              const item = triageScenarios[key];
              const isSelected = selectedTriageScenario === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedTriageScenario(key)}
                  className={`p-3 rounded-xl border text-left transition-all space-y-1.5 ${
                    isSelected
                      ? `${item.color} shadow-lg`
                      : 'border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-slate-400'
                  }`}
                >
                  <span className="text-xs font-mono font-bold block truncate">
                    {item.title}
                  </span>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{item.clusterSize.split(' ')[0]} {item.clusterSize.split(' ')[1]}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${item.badgeColor}`}>
                      {item.roiVerdict.split('—')[1] || 'EVAL'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Triage Detailed Scorecard */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase">Evaluated Failure:</span>
                <h4 className="text-base font-bold text-white font-mono">{activeTriage.title}</h4>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border ${activeTriage.badgeColor}`}>
                Verdict: {activeTriage.roiVerdict}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] block">Cluster Volume:</span>
                <span className="text-slate-200 font-bold">{activeTriage.clusterSize}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] block">Failure Type:</span>
                <span className="text-slate-200 font-bold">{activeTriage.failureType}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] block">Engineering Effort:</span>
                <span className="text-slate-200 font-bold">{activeTriage.effort}</span>
              </div>
            </div>

            {/* Visual Bar Breakdown */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Value of Improvement:</span>
                <span className="text-emerald-400 font-bold">{activeTriage.valueScore}/100</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${activeTriage.valueScore}%` }} />
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <span className="text-slate-400">Severity of Failure:</span>
                <span className="text-rose-400 font-bold">{activeTriage.severityScore}/100</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${activeTriage.severityScore}%` }} />
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <span className="text-slate-400">Engineering Effort Required:</span>
                <span className="text-amber-400 font-bold">{activeTriage.effortScore}/100</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${activeTriage.effortScore}%` }} />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs text-slate-300">
              <span className="text-amber-400 font-mono font-bold block text-[11px]">Engineering Recommendation:</span>
              <p className="leading-relaxed font-sans">{activeTriage.recommendation}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 2: EVIDENCE PYRAMID & BENCHMARK AUDIT (FIGS 3 & 4) */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-purple-500/20 text-purple-300 font-bold">
              STAGE 2
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Root-Cause Pyramid &amp; Multi-Version Benchmark Testing
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
            Evidence-Matched Interventions
          </span>
        </div>

        {/* Section 2 Explanatory Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-purple-400 text-sm font-bold font-mono">
              <Layers className="h-4 w-4" /> 3. Match the Change to the Evidence
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              When continuously improving, think in a disciplined hierarchy: <strong>Start with Data Quality, then Prompting, Tools, Model, and last Hyperparameters</strong>.
            </p>
            <ul className="text-xs text-slate-300 space-y-1 font-mono list-disc list-inside">
              <li><strong className="text-rose-400">Missing/Inconsistent info:</strong> Fix Data Quality first!</li>
              <li><strong className="text-purple-400">Unclear requirement:</strong> Fix Prompting &amp; instructions.</li>
              <li><strong className="text-cyan-400">Execution difficulty:</strong> Refactor Tool schemas &amp; workflow.</li>
              <li><strong className="text-amber-400">Task still too hard:</strong> Upgrade Model capacity.</li>
              <li><strong className="text-emerald-400">Sampling problem:</strong> Calibrate Hyperparameters (T, top_p).</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold font-mono">
              <GitCompare className="h-4 w-4" /> 4. Compare Three Versions on Same Benchmark
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              After making a change, systematically compare candidate revisions against the <strong>identical benchmark suite</strong> consisting of both <strong>Capability Cases</strong> and <strong>Known-Good Regression Cases</strong>.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span>LLM Judge Audit:</span>
                <span className="text-cyan-300 font-bold">&quot;Faithfulness: Still grounded?&quot;</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Code Evaluator Audit:</span>
                <span className="text-emerald-300 font-bold">&quot;Redundant tool use removed?&quot;</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Production Constraints:</span>
                <span className="text-amber-300 font-bold">Latency &amp; Token Cost checks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 Diagram Drawer Toggle */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Eye className="h-4 w-4 text-purple-400" />
              <span>Reference Figures: Evidence Pyramid &amp; Multi-Version Comparison</span>
            </div>
            <button
              onClick={() => setShowSection2Diagrams(!showSection2Diagrams)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              {showSection2Diagrams ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" /> Hide Diagrams
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" /> Show Diagrams (Figures 3-4)
                </>
              )}
            </button>
          </div>

          {showSection2Diagrams && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Figure 3 */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-mono text-slate-300 block font-semibold">
                    Figure 3: Match the Change to the Evidence (5-Layer Pyramid)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Pyramid
                  </span>
                </div>
                <Image
                  src={getAssetPath('/images/improve_match_change_to_evidence_pyramid.png')}
                  alt="Figure 3: Match the change to the evidence pyramid showing Data Quality at foundation up to Hyperparameters at top"
                  width={800}
                  height={450}
                  unoptimized
                  className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-[440px]"
                />
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-slate-200 font-mono">Takeaway:</strong> Do not jump straight to prompt rewrites or hyperparameter tuning. If the underlying data is missing or corrupted, prompts cannot salvage the system. Work upward from Data Quality.
                </p>
              </div>

              {/* Figure 4 */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-mono text-slate-300 block font-semibold">
                    Figure 4: Compare Three Versions on the Same Benchmark
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Benchmark Audit
                  </span>
                </div>
                <Image
                  src={getAssetPath('/images/improve_compare_versions_benchmark.png')}
                  alt="Figure 4: Compare three versions on the same benchmark across capability cases and known-good cases with Faithfulness and code evaluators"
                  width={800}
                  height={450}
                  unoptimized
                  className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-[440px]"
                />
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-slate-200 font-mono">Takeaway:</strong> Compare Baseline, Grounding Rule, and Refined Rule versions on the same test suite. Audit with both semantic Faithfulness judges and deterministic Code Evaluators for redundant tool calls.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* INTERACTIVE SIMULATOR: EVIDENCE PYRAMID & BENCHMARK COMPARATOR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive 5-Layer Pyramid Explorer */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
            <div>
              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block">
                Evidence Diagnostics
              </span>
              <h3 className="text-base font-bold text-white">
                5-Layer Intervention Pyramid
              </h3>
            </div>

            <div className="space-y-2">
              {(['hyperparams', 'model', 'tools', 'prompting', 'data'] as Array<keyof typeof pyramidLevels>).map((key) => {
                const item = pyramidLevels[key];
                const isSelected = selectedPyramidLevel === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedPyramidLevel(key)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between text-xs font-mono ${
                      isSelected
                        ? `${item.color} font-bold shadow-md`
                        : 'border-slate-800 bg-slate-950/70 hover:bg-slate-900 text-slate-400'
                    }`}
                  >
                    <span className="truncate">{item.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {item.tag}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Pyramid Level Diagnostic Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono text-[11px]">Identified Symptom:</span>
                <span className="text-amber-300 font-mono font-bold">{activePyramid.symptom}</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">{activePyramid.description}</p>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-mono font-bold text-[11px] block">Prescription / Action:</span>
                <span className="text-slate-300 text-[11px] block">{activePyramid.prescription}</span>
              </div>
            </div>
          </div>

          {/* Right: Multi-Version Benchmark Comparison Scorecard */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                  Systematic Offline Verification
                </span>
                <h3 className="text-base font-bold text-white">
                  3-Version Benchmark Head-to-Head
                </h3>
              </div>
              <div className="flex gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                {(['v1', 'v2', 'v3'] as const).map((vKey) => (
                  <button
                    key={vKey}
                    onClick={() => setActiveVersionTab(vKey)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      activeVersionTab === vKey
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {vKey.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Version Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h4 className="text-sm font-bold text-white font-mono">
                    {versionComparisonData[activeVersionTab].name}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {versionComparisonData[activeVersionTab].rule}
                  </span>
                </div>
                {versionComparisonData[activeVersionTab].status === 'certified_production' ? (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> PRODUCTION READY
                  </span>
                ) : versionComparisonData[activeVersionTab].status === 'partial_pass' ? (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-bold">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400" /> PARTIAL PROGRESS
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 font-bold">
                    <XCircle className="h-3.5 w-3.5 text-rose-400" /> FAILS CAPABILITY
                  </span>
                )}
              </div>

              {/* 4 Scorecard Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[11px]">Capability Pass:</span>
                  <span className={`text-base font-bold block ${
                    versionComparisonData[activeVersionTab].capabilityScore >= 90 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {versionComparisonData[activeVersionTab].capabilityScore}%
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[11px]">Regression Suite:</span>
                  <span className={`text-base font-bold block ${
                    versionComparisonData[activeVersionTab].regressionScore >= 95 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {versionComparisonData[activeVersionTab].regressionScore}%
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[11px]">Faithfulness (Judge):</span>
                  <span className="text-base font-bold text-cyan-300 block">
                    {versionComparisonData[activeVersionTab].faithfulnessJudge} / 5.0
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[11px]">Redundant Tool Calls:</span>
                  <span className={`text-base font-bold block ${
                    versionComparisonData[activeVersionTab].redundantToolCalls < 1 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {versionComparisonData[activeVersionTab].redundantToolCalls} / turn
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Response Latency:</span>
                  <span className="text-slate-200 font-bold">{versionComparisonData[activeVersionTab].latencySec}s</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Estimated Cost:</span>
                  <span className="text-slate-200 font-bold">{versionComparisonData[activeVersionTab].costPerQuery}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 font-sans leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <strong className="text-slate-200 font-mono">Audit Summary:</strong> {versionComparisonData[activeVersionTab].notes}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 3: THE 4 PRODUCTION PILLARS (FIGS 5, 6 & 7)       */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-cyan-500/20 text-cyan-300 font-bold">
              STAGE 3
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              The Four Production Improvement Pillars
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
            Live User Telemetry &amp; Traffic
          </span>
        </div>

        {/* 4 Pillars Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono">
              <Activity className="h-4 w-4" /> 1. Production Monitoring
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Automated high-level telemetry: policy evaluator flags, tool usage anomalies, response latency.
            </p>
            <span className="text-[11px] font-mono text-emerald-400 font-bold block pt-1">
              Locates: &quot;WHERE to look?&quot;
            </span>
          </div>

          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono">
              <Search className="h-4 w-4" /> 2. Manual Review
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Engineers &amp; QA inspect live traces triggered by alerts (e.g. 37 eligibility failure traces).
            </p>
            <span className="text-[11px] font-mono text-cyan-400 font-bold block pt-1">
              Explains: &quot;WHAT happened?&quot;
            </span>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono">
              <ThumbsDown className="h-4 w-4" /> 3. User Feedback
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Explicit thumbs-up/down + Behavioral drop-offs (abandoned conversations, repeated questions).
            </p>
            <span className="text-[11px] font-mono text-amber-400 font-bold block pt-1">
              Signal: &quot;Points to interaction&quot;
            </span>
          </div>

          <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold font-mono">
              <GitCompare className="h-4 w-4" /> 4. A/B Testing
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Randomized split traffic between Current Agent vs Revised Agent measuring real-world task success.
            </p>
            <span className="text-[11px] font-mono text-purple-400 font-bold block pt-1">
              Validates: &quot;Useful in traffic?&quot;
            </span>
          </div>
        </div>

        {/* Section 3 Diagram Drawer Toggle */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Eye className="h-4 w-4 text-cyan-400" />
              <span>Reference Figures: Production Monitoring, Feedback &amp; A/B Split (3 Figures, Max 2/Row)</span>
            </div>
            <button
              onClick={() => setShowSection3Diagrams(!showSection3Diagrams)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              {showSection3Diagrams ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" /> Hide Diagrams
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" /> Show Diagrams (Figures 5-7)
                </>
              )}
            </button>
          </div>

          {showSection3Diagrams && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Figure 5 */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-mono text-slate-300 block font-semibold">
                    Figure 5: Monitoring Locates; Review Explains (Count → Trace → Pattern)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Pillars 1 &amp; 2
                  </span>
                </div>
                <Image
                  src={getAssetPath('/images/improve_monitoring_locates_review_explains.png')}
                  alt="Figure 5: Monitoring locates review explains showing policy evaluator against manual review with 37 eligibility failures"
                  width={800}
                  height={450}
                  unoptimized
                  className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-[440px]"
                />
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-slate-200 font-mono">Takeaway:</strong> Production monitoring flags anomalous policy counts, but manual review of the live traces is necessary to identify whether the agent skipped checks, passed wrong arguments, or ignored DB outputs.
                </p>
              </div>

              {/* Figure 6 */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-mono text-slate-300 block font-semibold">
                    Figure 6: Use Feedback to Choose What to Inspect (Explicit vs. Behavioral)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Pillar 3
                  </span>
                </div>
                <Image
                  src={getAssetPath('/images/improve_user_feedback_inspect.png')}
                  alt="Figure 6: Use feedback to choose what to inspect showing explicit thumbs-down and behavioral abandonment pointing to interaction"
                  width={800}
                  height={450}
                  unoptimized
                  className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-[440px]"
                />
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-slate-200 font-mono">Takeaway:</strong> A user feedback signal points to an interaction—it does NOT diagnose the cause. Both explicit thumbs-down and passive drop-offs cue engineers on which specific session traces to audit.
                </p>
              </div>

              {/* Figure 7 */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 md:col-span-2">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-mono text-slate-300 block font-semibold">
                    Figure 7: Compare Versions on Real Traffic (A/B Testing &amp; 4 Pillars Synergy)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Pillar 4 Synergy
                  </span>
                </div>
                <Image
                  src={getAssetPath('/images/improve_ab_testing_real_traffic.png')}
                  alt="Figure 7: Compare versions on real traffic showing Current Agent versus Revised Agent across policy failures, follow-up turns, accuracy, and latency"
                  width={1000}
                  height={480}
                  unoptimized
                  className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-[440px]"
                />
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-slate-200 font-mono">Takeaway:</strong> Real traffic split testing integrates all four pillars: Monitoring answers <em>where</em>, Review explains <em>what happened</em>, Feedback reveals <em>user problems</em>, and A/B testing proves whether changes are <em>useful in traffic</em>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* INTERACTIVE SIMULATOR: PRODUCTION PILLARS CONSOLE */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                Interactive Console
              </span>
              <h3 className="text-lg font-bold text-white">
                Live Production Telemetry &amp; Diagnostic Station
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              Select Pillar to Simulate
            </span>
          </div>

          {/* Pillar Switcher Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(Object.keys(pillarsData) as Array<keyof typeof pillarsData>).map((key) => {
              const item = pillarsData[key];
              const isSelected = selectedPillar === key;
              const Icon = item.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedPillar(key)}
                  className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                    isSelected
                      ? `${item.color} font-bold shadow-lg`
                      : 'border-slate-800 bg-slate-950/70 hover:bg-slate-900 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <Icon className="h-4 w-4" />
                    <span className="truncate">{item.title.split(':')[1] || item.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    {item.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Pillar Interactive Telemetry Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
              <div>
                <h4 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <activePillarData.icon className="h-4 w-4 text-cyan-400" /> {activePillarData.title}
                </h4>
                <span className="text-xs font-mono text-slate-400">{activePillarData.subtitle}</span>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                Focus: {activePillarData.focus}
              </span>
            </div>

            {/* Signal Telemetry Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {activePillarData.signals.map((sig, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 block truncate">
                    {sig.label}
                  </span>
                  <span className={`text-sm font-bold font-mono block ${
                    sig.status === 'alert'
                      ? 'text-rose-400'
                      : sig.status === 'warning'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}>
                    {sig.val}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              <strong className="text-white font-mono">Operational Doctrine:</strong> {activePillarData.description}
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 4: THE CONTINUOUS PRODUCTION FLYWHEEL (FIG 8)     */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-amber-500/20 text-amber-300 font-bold">
              STAGE 4
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              The Continuous Production-to-Eval Flywheel
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
            Closing the Improvement Loop
          </span>
        </div>

        {/* Section 4 Explanatory Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold font-mono">
            <RefreshCw className="h-4 w-4" /> Feed Production Evidence Back into Offline Evals
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            In production, you must <strong>continuously add new data into the monitoring dataset</strong>. This ensures the benchmark covers a more thorough environment over time, transforming the test suite into an authentic representative of real customer usage.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs font-mono pt-1">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
              <span className="text-rose-400 font-bold block">1. Trace</span>
              <span className="text-[10px] text-slate-400">Capture edge</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
              <span className="text-purple-400 font-bold block">2. Expected</span>
              <span className="text-[10px] text-slate-400">Rubric criteria</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
              <span className="text-cyan-400 font-bold block">3. Curate</span>
              <span className="text-[10px] text-slate-400">Save to suite</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
              <span className="text-emerald-400 font-bold block">4. Compare</span>
              <span className="text-[10px] text-slate-400">Multi-version</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
              <span className="text-amber-400 font-bold block">5. Release</span>
              <span className="text-[10px] text-slate-400">Monitor live</span>
            </div>
          </div>
        </div>

        {/* Section 4 Diagram Drawer Toggle */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Eye className="h-4 w-4 text-amber-400" />
              <span>Reference Figure: The Closed-Loop Continuous Flywheel</span>
            </div>
            <button
              onClick={() => setShowSection4Diagrams(!showSection4Diagrams)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              {showSection4Diagrams ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" /> Hide Diagram
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" /> Show Diagram (Figure 8)
                </>
              )}
            </button>
          </div>

          {showSection4Diagrams && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-mono text-slate-300 block font-semibold">
                  Figure 8: Feed Production Evidence Back into Offline Evals (Continuous Flywheel)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Closed Loop
                </span>
              </div>
              <div className="flex justify-center">
                <Image
                  src={getAssetPath('/images/improve_flywheel_production_to_evals.png')}
                  alt="Figure 8: Feed production evidence back into offline evals showing Short-walk volunteer, QA, LLM Judge, and Builder in a 5-step loop"
                  width={900}
                  height={460}
                  unoptimized
                  className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-[460px]"
                />
              </div>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <strong className="text-slate-200 font-mono">Takeaway:</strong> Production traces (e.g. short-walk volunteer: &quot;I can only walk for about ten minutes&quot;) are codified into expected behavior assertions, added to saved cases by builders, verified in offline comparison, and released to production.
              </p>
            </div>
          )}
        </div>

        {/* INTERACTIVE SIMULATOR: 5-STEP FLYWHEEL WALKTHROUGH */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                Interactive Walkthrough
              </span>
              <h3 className="text-lg font-bold text-white">
                Step-by-Step Flywheel Progression
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              {flywheelSteps.map((s) => (
                <button
                  key={s.step}
                  onClick={() => setActiveFlywheelStep(s.step)}
                  className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all ${
                    activeFlywheelStep === s.step
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-900'
                  }`}
                >
                  {s.step}
                </button>
              ))}
            </div>
          </div>

          {/* Active Flywheel Node Detailed View */}
          {(() => {
            const currentStep = flywheelSteps.find((s) => s.step === activeFlywheelStep) || flywheelSteps[0];
            const StepIcon = currentStep.icon;
            return (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${currentStep.color}`}>
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-mono">{currentStep.title}</h4>
                      <span className="text-xs font-mono text-slate-400">Responsible Role: {currentStep.owner}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-300 font-bold">
                    Flywheel Step {currentStep.step} of 5
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="text-slate-400 font-bold block text-[11px] uppercase">Input Evidence:</span>
                    <p className="text-slate-200 font-sans leading-relaxed">{currentStep.input}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="text-amber-400 font-bold block text-[11px] uppercase">Output Artifact:</span>
                    <p className="text-slate-200 font-sans leading-relaxed">{currentStep.output}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between flex-wrap gap-3">
                  <div className="space-y-1 text-xs">
                    <span className="text-emerald-400 font-mono font-bold block text-[11px]">System Impact:</span>
                    <span className="text-slate-300 font-sans">{currentStep.action}</span>
                  </div>
                  <div className="flex gap-2">
                    {currentStep.step > 1 && (
                      <button
                        onClick={() => setActiveFlywheelStep(currentStep.step - 1)}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                      >
                        ← Prev Step
                      </button>
                    )}
                    {currentStep.step < 5 && (
                      <button
                        onClick={() => setActiveFlywheelStep(currentStep.step + 1)}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold"
                      >
                        Next Step →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Footer Navigation Back to Other Tabs */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-base font-bold text-white font-mono">
            Explore the Complete Agentic Evaluation Framework
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Navigate between Code Evaluators, Trajectory Auditing, and Production Improvement.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/agentic-evaluation"
            className="px-4 py-2 rounded-xl text-xs font-mono bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-800 flex items-center gap-2"
          >
            <Scale className="h-4 w-4" /> Tab 1: Code &amp; Judges
          </Link>
          <Link
            href="/agentic-evaluation/evaluating-applications"
            className="px-4 py-2 rounded-xl text-xs font-mono bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 flex items-center gap-2"
          >
            <Workflow className="h-4 w-4" /> Tab 2: Trajectories
          </Link>
        </div>
      </div>
    </div>
  );
};
