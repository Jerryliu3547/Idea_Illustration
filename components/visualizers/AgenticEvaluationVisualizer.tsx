"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAssetPath } from '@/lib/asset';
import { MathFormula } from '@/components/ui/MathFormula';
import { 
  Code2, 
  Scale, 
  Workflow, 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  ShieldCheck, 
  Terminal, 
  Bot, 
  ArrowRight, 
  FileCheck, 
  Maximize2, 
  Minimize2, 
  Check, 
  Ban, 
  Database, 
  ListOrdered, 
  Eye, 
  Sliders, 
  Sparkles,
  FileText,
  ShieldAlert,
  GitBranch,
  History,
  Target,
  BarChart2,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

// Mock database records defined outside component
const mockDatabase = {
  volunteers: {
    '7623': { name: 'Sarah Chen', eligible: true, backgroundCheck: 'Passed' },
    '8941': { name: 'Alex Rivera', eligible: false, backgroundCheck: 'Pending' },
  },
  dogs: {
    '182': { name: 'Barnaby (Dalmatian)', fosterReady: true },
    '204': { name: 'Luna (Husky)', fosterReady: false },
  },
};

export const AgenticEvaluationVisualizer: React.FC = () => {
  // ==========================================
  // SECTION 1: CODE EVALUATOR STATES & DATA
  // ==========================================
  const [evaluatorType, setEvaluatorType] = useState<'brittle' | 'robust'>('robust');
  const [selectedPreset, setSelectedPreset] = useState<'valid' | 'messy_casing' | 'synonym' | 'forbidden' | 'missing_db' | 'skipped_trace'>('valid');
  const [customInput, setCustomInput] = useState<string>('{"volunteer_id": "7623", "dog_id": "182", "status": "approved"}');
  const [simulatedTraceHasQuery, setSimulatedTraceHasQuery] = useState<boolean>(true);
  const [showCodeDiagrams, setShowCodeDiagrams] = useState<boolean>(true);

  // Presets matching the code evaluator diagrams
  const presets = {
    valid: {
      name: '1. Standard Clean JSON',
      text: '{"volunteer_id": "7623", "dog_id": "182", "status": "approved"}',
      hasTraceQuery: true,
      description: 'Well-formatted JSON matching ground truth database records.',
    },
    messy_casing: {
      name: '2. Extra Whitespace & Uppercase',
      text: '  {"volunteer_id": "7623",  "dog_id": "182",  "status": "APPROVED" }  ',
      hasTraceQuery: true,
      description: 'Capitalized status and irregular padding. Brittle check fails; robust check passes.',
    },
    synonym: {
      name: '3. Valid Alternative Wording ("cleared")',
      text: '{"volunteer_id": "7623", "dog_id": "182", "status": "cleared"}',
      hasTraceQuery: true,
      description: 'Uses valid synonymous wording {"approved", "cleared", "eligible"}.',
    },
    forbidden: {
      name: '4. Injected Forbidden Phrase',
      text: '{"volunteer_id": "7623", "dog_id": "182", "status": "approved"}\nNote: As an AI assistant, I recommend this match.',
      hasTraceQuery: true,
      description: 'Violates the negative constraint by containing "as an AI assistant".',
    },
    missing_db: {
      name: '5. Non-existent Volunteer ID',
      text: '{"volunteer_id": "9999", "dog_id": "182", "status": "approved"}',
      hasTraceQuery: true,
      description: 'Volunteer ID 9999 does not exist in the database record.',
    },
    skipped_trace: {
      name: '6. Skipped Database Query Step',
      text: '{"volunteer_id": "7623", "dog_id": "182", "status": "approved"}',
      hasTraceQuery: false,
      description: 'Agent guessed the answer without inspecting records in its execution trace.',
    },
  };

  const handleSelectPreset = (key: keyof typeof presets) => {
    setSelectedPreset(key);
    setCustomInput(presets[key].text);
    setSimulatedTraceHasQuery(presets[key].hasTraceQuery);
  };

  // Evaluation engine for the 5 core code checks
  const evaluationResults = useMemo(() => {
    const rawText = customInput;
    const lengthValid = rawText.length < 500;
    const hasForbiddenPhrase = /as an ai assistant/i.test(rawText);

    let parsedJson: Record<string, unknown> | null = null;
    let formatValid = false;
    let extractedStatus = '';
    let extractedVolId = '';
    let extractedDogId = '';

    try {
      const parsed = JSON.parse(rawText.trim());
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'volunteer_id' in parsed &&
        'dog_id' in parsed &&
        'status' in parsed
      ) {
        parsedJson = parsed as Record<string, unknown>;
        formatValid = true;
        extractedStatus = String(parsedJson.status);
        extractedVolId = String(parsedJson.volunteer_id).trim();
        extractedDogId = String(parsedJson.dog_id).trim();
      }
    } catch {
      formatValid = false;
    }

    // Check status match (Brittle vs Robust)
    let statusAccepted = false;
    if (evaluatorType === 'brittle') {
      statusAccepted = extractedStatus === 'approved';
    } else {
      const normalizedStatus = extractedStatus.toLowerCase().trim();
      const validSynonyms = new Set(['approved', 'cleared', 'eligible']);
      statusAccepted = validSynonyms.has(normalizedStatus);
    }

    // Facts vs records check
    const volunteerRecord = mockDatabase.volunteers[extractedVolId as keyof typeof mockDatabase.volunteers];
    const dogRecord = mockDatabase.dogs[extractedDogId as keyof typeof mockDatabase.dogs];
    const factsMatch = !!(volunteerRecord && volunteerRecord.eligible && dogRecord && dogRecord.fosterReady);

    // Required steps vs trace check
    const traceValid = simulatedTraceHasQuery;

    // Overall verdict
    const allPassed = formatValid && lengthValid && !hasForbiddenPhrase && statusAccepted && factsMatch && traceValid;

    return {
      formatValid,
      lengthValid,
      hasForbiddenPhrase,
      statusAccepted,
      factsMatch,
      traceValid,
      allPassed,
      extractedStatus,
      volunteerRecord,
      dogRecord,
    };
  }, [customInput, evaluatorType, simulatedTraceHasQuery]);

  // ==========================================
  // SECTION 2: LLM JUDGES RUBRIC STATES & DATA
  // ==========================================
  const [activeRubricStep, setActiveRubricStep] = useState<number>(1);
  const [showJudgeDiagrams, setShowJudgeDiagrams] = useState<boolean>(true);
  const [selectedTestCase, setSelectedTestCase] = useState<'safe_calm' | 'missed_preference' | 'unsafe_reactive' | 'needs_review'>('unsafe_reactive');

  // Rubric Versioning State
  const [selectedVersion, setSelectedVersion] = useState<'v1' | 'v2'>('v2');

  // Judge Quality Metrics (Confusion Matrix) State
  const [metricTp, setMetricTp] = useState<number>(42);
  const [metricFp, setMetricFp] = useState<number>(8);
  const [metricFn, setMetricFn] = useState<number>(4);
  const [metricTn, setMetricTn] = useState<number>(46);
  const [kappaPreset, setKappaPreset] = useState<'balanced' | 'well_calibrated' | 'lazy_yes_man' | 'noisy' | 'custom'>('balanced');

  const applyKappaPreset = (type: 'balanced' | 'well_calibrated' | 'lazy_yes_man' | 'noisy') => {
    setKappaPreset(type);
    if (type === 'balanced') {
      setMetricTp(42);
      setMetricFp(8);
      setMetricFn(4);
      setMetricTn(46);
    } else if (type === 'well_calibrated') {
      setMetricTp(9);
      setMetricFp(4);
      setMetricFn(1);
      setMetricTn(86);
    } else if (type === 'lazy_yes_man') {
      setMetricTp(0);
      setMetricFp(0);
      setMetricFn(10);
      setMetricTn(90);
    } else if (type === 'noisy') {
      setMetricTp(15);
      setMetricFp(15);
      setMetricFn(15);
      setMetricTn(55);
    }
  };

  const judgeCalculatedMetrics = useMemo(() => {
    const total = metricTp + metricFp + metricFn + metricTn;
    const humanUnsafe = metricTp + metricFn;
    const humanSafe = metricFp + metricTn;
    const llmUnsafe = metricTp + metricFp;
    const llmSafe = metricFn + metricTn;

    const recall = humanUnsafe > 0 ? metricTp / humanUnsafe : 0;
    const precision = llmUnsafe > 0 ? metricTp / llmUnsafe : 0;
    const observedAgreement = total > 0 ? (metricTp + metricTn) / total : 0;

    // Marginal probabilities for chance agreement
    const pJudgeUnsafe = total > 0 ? llmUnsafe / total : 0;
    const pJudgeSafe = total > 0 ? llmSafe / total : 0;
    const pHumanUnsafe = total > 0 ? humanUnsafe / total : 0;
    const pHumanSafe = total > 0 ? humanSafe / total : 0;

    const pBothUnsafeChance = pJudgeUnsafe * pHumanUnsafe;
    const pBothSafeChance = pJudgeSafe * pHumanSafe;
    const chanceAgreement = pBothUnsafeChance + pBothSafeChance;

    const kappa = Math.abs(1 - chanceAgreement) > 0.0001
      ? (observedAgreement - chanceAgreement) / (1 - chanceAgreement)
      : 0;

    let landisKochLabel = 'Poor / Pure Chance (< 0.20)';
    let landisKochColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    if (kappa >= 0.81) {
      landisKochLabel = 'Almost Perfect Agreement (0.81 - 1.00)';
      landisKochColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    } else if (kappa >= 0.61) {
      landisKochLabel = 'Substantial Agreement - Gate Certified (0.61 - 0.80)';
      landisKochColor = 'text-teal-400 bg-teal-500/10 border-teal-500/30';
    } else if (kappa >= 0.41) {
      landisKochLabel = 'Moderate Agreement - Human Oversight Needed (0.41 - 0.60)';
      landisKochColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    } else if (kappa >= 0.21) {
      landisKochLabel = 'Fair Agreement - Weak / Risky (0.21 - 0.40)';
      landisKochColor = 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    }

    return {
      total,
      humanUnsafe,
      humanSafe,
      llmUnsafe,
      llmSafe,
      recallPct: parseFloat((recall * 100).toFixed(1)),
      precisionPct: parseFloat((precision * 100).toFixed(1)),
      observedAgreementPct: parseFloat((observedAgreement * 100).toFixed(1)),
      chanceAgreementPct: parseFloat((chanceAgreement * 100).toFixed(1)),
      pBothUnsafeChancePct: parseFloat((pBothUnsafeChance * 100).toFixed(1)),
      pBothSafeChancePct: parseFloat((pBothSafeChance * 100).toFixed(1)),
      kappa: parseFloat(kappa.toFixed(2)),
      landisKochLabel,
      landisKochColor,
      isCertified: recall >= 0.90 && kappa >= 0.70,
    };
  }, [metricTp, metricFp, metricFn, metricTn]);

  // Test cases matching the lecture slides (Dog-volunteer match evaluation)
  const testCases = {
    safe_calm: {
      name: 'Case A: Safe Standard Match',
      type: 'safe',
      volunteerProfile: 'Experienced foster parent, previous training with large breeds, active yard',
      dogRecord: '55 lb Golden Retriever mix, calm, socialized, no behavior warnings',
      recommendation: 'Match them',
      classification: 'SAFE',
      category: 'Approved',
      explanation: 'Volunteer has proven background handling medium/large dogs, and the dog has no behavioral risks. Meets all safety criteria.',
      guardrailVerdict: 'Ship (Safe & Preferred)',
    },
    missed_preference: {
      name: 'Case B: Missed Preference (Low Severity)',
      type: 'missed_preference',
      volunteerProfile: 'Experienced foster parent, requested hypoallergenic small puppy under 20 lb',
      dogRecord: '45 lb Labrador, calm, adult dog',
      recommendation: 'Match them',
      classification: 'SAFE',
      category: 'Accept for now',
      explanation: 'Missed preference: The volunteer wanted a small hypoallergenic dog, but the 45 lb dog is calm and physically safe. Low severity failure.',
      guardrailVerdict: 'Accept for now (Safe Match, Not Desired Dog)',
    },
    unsafe_reactive: {
      name: 'Case C: Unsafe Match (Critical Safety Risk)',
      type: 'unsafe',
      volunteerProfile: 'First-time volunteer, no previous handling experience, lives in small apartment',
      dogRecord: 'Reactive, 85 lb, leash aggression, requires experienced handler only',
      recommendation: 'Match them',
      classification: 'UNSAFE',
      category: 'Guardrail: don\'t ship',
      explanation: 'Direct safety violation: First-time volunteer cannot manage severe reactivity and physical pull. High probability of bite incident.',
      guardrailVerdict: 'Guardrail: don\'t ship (Critical Safety Violation)',
    },
    needs_review: {
      name: 'Case D: Ambiguous Match (Needs Human Review)',
      type: 'needs_review',
      volunteerProfile: 'Some experience with medium breeds, no documented history with large guardian breeds',
      dogRecord: '130 lb Mastiff mix, very strong, good temperament but high pull power',
      recommendation: 'Match them',
      classification: 'NEEDS_REVIEW',
      category: 'Needs Review',
      explanation: 'Borderline physical handling: The volunteer has some dog experience, but handling a 130 lb giant breed requires physical strength assessment.',
      guardrailVerdict: 'Needs Review (Manual Inspector Escorted Walk)',
    },
  };

  const activeCase = testCases[selectedTestCase];

  // The 5 Steps of the Custom Rubric Formula
  const rubricSteps = [
    {
      step: 1,
      title: '1. Role',
      tagline: 'What it evaluates',
      summary: 'Define the evaluator identity, scope, and specific perspective.',
      badge: 'Evaluator Mandate',
      content: {
        prompt: 'You are evaluating whether a proposed volunteer-dog match is safe for both the volunteer and the dog.',
        insight: 'Establishes clear evaluation boundaries. The judge knows it is not evaluating user grammar or conversational charm, but safety.',
      },
    },
    {
      step: 2,
      title: '2. Criteria',
      tagline: 'How to decide',
      summary: 'Replace generic instructions with concrete, task-specific rules.',
      badge: 'Decision Rules',
      content: {
        weakPrompt: 'Weak: "You are an expert evaluator"',
        specificPrompt: 'Specific: Names the task and what matters concretely',
        rules: [
          { rule: 'The volunteer can physically handle the dog', emphasis: 'physically' },
          { rule: 'Their experience is relevant to the dog\'s needs', emphasis: 'experience' },
          { rule: 'They can manage the behavior risks in the record', emphasis: 'behavior risks' },
        ],
        insight: 'Specific criteria prevent hallucinated grading standards by anchoring the LLM to factual prerequisites.',
      },
    },
    {
      step: 3,
      title: '3. Inputs',
      tagline: 'Which information',
      summary: 'Structure prompt variables using clear semantic XML/HTML tags.',
      badge: 'Tagged Context',
      content: {
        sources: [
          { source: 'From the volunteer', data: 'Volunteer profile: Experienced' },
          { source: 'From the shelter', data: 'Dog record: 130 lb, too strong' },
          { source: 'The agent\'s decision', data: 'Agent recommendation: Match them' },
        ],
        xmlExample: `<volunteer_profile>Experienced</volunteer_profile>
<dog_record>130 lb, too strong</dog_record>
<recommendation>Match them</recommendation>`,
        separation: {
          instructions: 'Instructions: How to evaluate (system prompt)',
          taggedInputs: 'Tagged inputs: What to evaluate (user variables)',
        },
        insight: 'Enclosing dynamic runtime parameters in XML tags protects against prompt injection and helps the judge distinguish instructions from data.',
      },
    },
    {
      step: 4,
      title: '4. Labeled examples',
      tagline: 'How criteria apply',
      summary: 'Provide few-shot examples derived from reviewed benchmark cases.',
      badge: 'Few-Shot Calibration',
      content: {
        question: 'Which rubric agrees more with reviewers?',
        comparison: [
          { title: 'Rubric with examples', verdict: 'Higher Agreement', note: 'Provides boundary cases showing how criteria are applied to edge cases.' },
          { title: 'Rubric without examples', verdict: 'Lower Agreement', note: 'Leaves ambiguous edge cases to the model\'s variable subjective intuition.' },
        ],
        benchmarkNote: 'Use reviewed benchmark cases vetted by human experts. The test benchmark cases must not be used as prompt examples to prevent evaluation leakage.',
        insight: 'Few-shot labeled examples act as calibration anchors, dramatically improving agreement between the LLM judge and human experts.',
      },
    },
    {
      step: 5,
      title: '5. Output instructions',
      tagline: 'How to report',
      summary: 'Standardize the output format for automated filtering and downstream CI/CD.',
      badge: 'Reporting Format',
      content: {
        formats: [
          {
            type: 'One label (SAFE / UNSAFE)',
            quality: 'Recommended for CI/CD',
            desc: 'Define each label clearly. Easy to compare, parse programmatically, and filter.',
            color: 'emerald',
          },
          {
            type: '1 to 10 Numeric Score',
            quality: 'Problematic / Ambiguous',
            desc: 'What makes a 6 different from a 7? Numeric scales introduce high calibration variance.',
            color: 'rose',
          },
          {
            type: 'Actionable Categories (NEEDS_REVIEW)',
            quality: 'Recommended for Escalations',
            desc: 'e.g. NEEDS_REVIEW: Large dog + some experience, no history with large breeds.',
            color: 'amber',
          },
        ],
        insight: 'Categorical labels (SAFE/UNSAFE/NEEDS_REVIEW) provide actionable deployment gates, unlike arbitrary numeric scores.',
      },
    },
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Top Navigation Tabs */}
      <div className="flex border-b border-slate-800 pb-3 gap-2 sm:gap-4 overflow-x-auto text-sm font-semibold">
        <Link
          href="/agentic-evaluation"
          className="px-4 py-2 rounded-xl text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/20 shrink-0"
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
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
            New
          </span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold uppercase tracking-wider mb-1">
          <ShieldCheck className="h-4 w-4" /> Comprehensive Agentic Evaluation Framework
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Agentic Evaluation: Code Evaluators & LLM Judges
        </h1>
        <p className="text-slate-400 mt-2 text-base leading-relaxed">
          Evaluating autonomous agents requires combining two complementary paradigms: <strong className="text-emerald-400">Code Evaluators</strong> for fast, deterministic, rule-based verification, and <strong className="text-cyan-400">LLM Judges</strong> for semantic, multi-criteria rubric assessments.
        </p>
      </div>

      {/* QUICK SECTION BOOKMARKS */}
      <div className="sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
          <Bookmark className="h-4 w-4 text-emerald-400" />
          <span>Quick Section Jump:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-mono">
          <button
            onClick={() => document.getElementById('section-code-evaluators')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2 truncate">
              <Code2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="font-semibold truncate">1. Code Evaluators</span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30 shrink-0">
              Rules
            </span>
          </button>

          <button
            onClick={() => document.getElementById('section-llm-judges')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2 truncate">
              <Scale className="h-4 w-4 text-cyan-400 shrink-0" />
              <span className="font-semibold truncate">2. 5-Step Rubric</span>
            </div>
            <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30 shrink-0">
              Formula
            </span>
          </button>

          <button
            onClick={() => document.getElementById('section-rubric-versioning')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2 truncate">
              <GitBranch className="h-4 w-4 text-purple-400 shrink-0" />
              <span className="font-semibold truncate">3. Rubric Versioning</span>
            </div>
            <span className="text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/30 shrink-0">
              Git Diff
            </span>
          </button>

          <button
            onClick={() => document.getElementById('section-judge-metrics')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2 truncate">
              <BarChart2 className="h-4 w-4 text-amber-400 shrink-0" />
              <span className="font-semibold truncate">4. Judge Metrics</span>
            </div>
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30 shrink-0">
              Kappa &amp; Rec
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PILLAR 1: CODE EVALUATORS SECTION                                          */}
      {/* ========================================================================= */}
      <section id="section-code-evaluators" className="space-y-8 pt-4">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Code2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                Pillar 1: Code Evaluators
              </h2>
              <p className="text-xs text-slate-400">
                Deterministic rule automation, the 5 core check types, and robust normalization patterns
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Deterministic & Fast
          </span>
        </div>

        {/* Core Golden Rule Banner */}
        <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-950/20 via-slate-900/60 to-purple-950/20 p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
              <Sparkles className="h-4 w-4" /> Foundational Principle
            </span>
            <span className="text-xs font-mono text-slate-400">
              Zero Model Inference Cost • 100% Reproducibility
            </span>
          </div>

          <div className="text-xl sm:text-2xl font-extrabold text-rose-400 tracking-tight">
            &ldquo;Explicit rule: automate it with code&rdquo;
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Never use an expensive, stochastic LLM judge to verify a condition that can be evaluated deterministically with code. If a requirement has an explicit schema, length bound, forbidden word, database match, or required trace action, <strong className="text-white">write a code evaluator</strong>.
          </p>

          {/* 4-Stage Pipeline Flowchart */}
          <div className="pt-3 border-t border-slate-800/80">
            <div className="text-[11px] font-mono font-semibold text-slate-400 mb-2 uppercase">
              End-to-End Code Evaluation Pipeline:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-white font-bold">1. Get trace</span>
                <ArrowRight className="h-4 w-4 text-emerald-400 hidden sm:block" />
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-white font-bold">2. Query records</span>
                <ArrowRight className="h-4 w-4 text-emerald-400 hidden sm:block" />
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-white font-bold">3. Apply criteria</span>
                <ArrowRight className="h-4 w-4 text-emerald-400 hidden sm:block" />
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-emerald-500/40 text-emerald-300 font-bold">
                <span>4. Report result</span>
              </div>
            </div>
          </div>
        </div>

        {/* HOW TO USE: The 5 Core Use Cases */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-emerald-400" /> How to Use Code Evaluators: The 5 Essential Checks
            </h3>
            <span className="text-xs font-mono text-slate-400">Production Checklist</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold">
                <FileCheck className="h-4 w-4" /> 1. Format
              </div>
              <h4 className="text-sm font-bold text-white">Valid JSON & Schema</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Verifies payload conforms to expected schema (e.g. volunteer ID, dog ID, approval status).
              </p>
              <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
                Tool: JSON schema / Pydantic
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold">
                <Sliders className="h-4 w-4" /> 2. Length
              </div>
              <h4 className="text-sm font-bold text-white">Character & Bounds</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Guards token budgets by enforcing boundaries (e.g. text length under 500 characters).
              </p>
              <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
                Tool: len(output) &lt; 500
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold">
                <Ban className="h-4 w-4" /> 3. Forbidden Phrase
              </div>
              <h4 className="text-sm font-bold text-white">Negative Constraints</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Flags canned disclaimer phrasing like &ldquo;as an AI assistant&rdquo; or leaked system prompts.
              </p>
              <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
                Tool: Regex blacklist match
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold">
                <Database className="h-4 w-4" /> 4. Facts vs Records
              </div>
              <h4 className="text-sm font-bold text-white">Ground Truth Lookup</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Queries external database: Does volunteer ID exist? Does eligibility match record?
              </p>
              <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
                Tool: SQL / API record assertion
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold">
                <ListOrdered className="h-4 w-4" /> 5. Required Steps
              </div>
              <h4 className="text-sm font-bold text-white">Trace Prerequisite</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Audits execution log: Did the agent check the records before issuing the approval?
              </p>
              <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
                Tool: Action trace parsing
              </div>
            </div>
          </div>
        </div>

        {/* HOW TO WRITE BETTER CODE EVALUATORS: Exact Match vs Normalized */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" /> How to Write Better Code Evaluators: Brittle vs. Robust
            </h3>
            <span className="text-xs font-mono text-cyan-400">Normalization Best Practices</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 rounded-2xl border border-rose-500/40 bg-rose-950/15 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-rose-400">
                <span>Exact Match: Brittle</span>
                <XCircle className="h-4 w-4 text-rose-400" />
              </div>

              <div className="bg-slate-950 rounded-xl p-3.5 font-mono text-xs text-slate-300 border border-slate-800 overflow-x-auto">
                <pre className="text-purple-300 leading-relaxed">{`if agent_output == "approved":
    return "pass"

return "fail"`}</pre>
              </div>

              <div className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-rose-500/20">
                <div className="text-rose-300 font-semibold">Why this fails in production:</div>
                <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
                  <li>Fails on capitalization: <code className="text-rose-300">&quot;Approved&quot;</code> $\rightarrow$ Fail</li>
                  <li>Fails on trailing spaces: <code className="text-rose-300">&quot;approved &quot;</code> $\rightarrow$ Fail</li>
                  <li>Fails on synonymous words: <code className="text-rose-300">&quot;cleared&quot;</code> $\rightarrow$ Fail</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-2xl border border-emerald-500/40 bg-emerald-950/15 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
                <span>Normalized: Robust</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>

              <div className="bg-slate-950 rounded-xl p-3.5 font-mono text-xs space-y-3 border border-slate-800">
                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] block font-semibold">{"# 1. Normalize whitespace:"}</span>
                  <code className="text-emerald-300 text-xs block bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    &quot; &quot;.join(text.split())
                  </code>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] block font-semibold">{"# 2. Ignore capitalization:"}</span>
                  <code className="text-emerald-300 text-xs block bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    text.lower()
                  </code>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] block font-semibold">{"# 3. Accept valid alternative wording:"}</span>
                  <code className="text-emerald-300 text-xs block bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    &#123;&quot;approved&quot;, &quot;cleared&quot;, &quot;eligible&quot;&#125;
                  </code>
                </div>
              </div>

              <div className="text-xs text-slate-300 pt-2 border-t border-emerald-500/20">
                <span className="text-emerald-400 font-semibold">Key Advantage: </span>
                Absorbs harmless syntactic variances without sacrificing deterministic precision or correctness.
              </div>
            </div>
          </div>
        </div>

        {/* Reference Image Viewer Toggle */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
              <Eye className="h-4 w-4 text-indigo-400" /> Code Evaluator Reference Diagrams
            </span>
            <button
              onClick={() => setShowCodeDiagrams(!showCodeDiagrams)}
              className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              {showCodeDiagrams ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" /> Hide Code Diagrams
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" /> Show Code Diagrams
                </>
              )}
            </button>
          </div>

          {showCodeDiagrams && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <span className="text-xs font-mono text-slate-300 block font-semibold">
                  Figure 1: Exact Match (Brittle) vs Normalized (Robust)
                </span>
                <Image
                  src={getAssetPath('/images/code_evaluator_robustness.jpg')}
                  alt="Exact match vs Normalized robust code evaluator"
                  width={800}
                  height={450}
                  unoptimized
                  className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-[420px]"
                />
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <span className="text-xs font-mono text-slate-300 block font-semibold">
                  Figure 2: The 5 Core Checks (Format, Length, Forbidden, Facts vs Records, Required Steps)
                </span>
                <Image
                  src={getAssetPath('/images/code_evaluator_use_cases.jpg')}
                  alt="5 Core use cases of code evaluators"
                  width={800}
                  height={450}
                  unoptimized
                  className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-[420px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* INTERACTIVE CODE EVALUATOR SANDBOX */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" /> Interactive Code Evaluator Sandbox
              </h3>
              <p className="text-xs text-slate-400">
                Test the Dog Foster Volunteer Approval scenario live across both Brittle and Robust Evaluators
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
              <span className="text-slate-400 px-1">Active Engine:</span>
              <button
                onClick={() => setEvaluatorType('brittle')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  evaluatorType === 'brittle'
                    ? 'bg-rose-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Exact Match (Brittle)
              </button>
              <button
                onClick={() => setEvaluatorType('robust')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  evaluatorType === 'robust'
                    ? 'bg-emerald-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Normalized (Robust)
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-mono text-slate-400 block font-semibold">
              Select Preset Scenario:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
              {(Object.keys(presets) as Array<keyof typeof presets>).map((key) => (
                <button
                  key={key}
                  onClick={() => handleSelectPreset(key)}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    selectedPreset === key
                      ? 'bg-indigo-950/40 border-indigo-500 text-white shadow'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="font-bold block truncate">{presets[key].name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="font-bold">Agent Output Payload</span>
                <span>{customInput.length} chars (Limit: 500)</span>
              </div>

              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                rows={5}
                className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder='{"volunteer_id": "7623", "dog_id": "182", "status": "approved"}'
              />

              <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <span className="font-mono text-slate-300 font-bold block">
                    Execution Trace Step:
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Did agent execute <code className="text-cyan-400 font-mono">query_volunteer_record()</code> before generating answer?
                  </span>
                </div>
                <button
                  onClick={() => setSimulatedTraceHasQuery(!simulatedTraceHasQuery)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all border ${
                    simulatedTraceHasQuery
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}
                >
                  {simulatedTraceHasQuery ? 'Trace Step: PRESENT' : 'Trace Step: SKIPPED'}
                </button>
              </div>

              <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800 text-[11px] font-mono space-y-1">
                <span className="text-slate-400 font-bold uppercase block text-[10px]">
                  Underlying Database Records:
                </span>
                <div className="text-slate-300">
                  Volunteer #7623: Sarah Chen (Eligible: True) | Dog #182: Barnaby (Foster Ready: True)
                </div>
                <div className="text-slate-500">
                  Volunteer #8941: Alex Rivera (Eligible: False) | Dog #204: Luna (Foster Ready: False)
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
                <span>Evaluator Scorecard:</span>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-bold border ${
                    evaluationResults.allPassed
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}
                >
                  VERDICT: {evaluationResults.allPassed ? 'PASS' : 'FAIL'}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    {evaluationResults.formatValid ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-400" />
                    )}
                    <span className="text-slate-300">1. Format (Valid JSON & Keys)</span>
                  </div>
                  <span className={evaluationResults.formatValid ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {evaluationResults.formatValid ? 'VALID' : 'INVALID JSON'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    {evaluationResults.lengthValid ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-400" />
                    )}
                    <span className="text-slate-300">2. Length (Under 500 Chars)</span>
                  </div>
                  <span className={evaluationResults.lengthValid ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {customInput.length} / 500
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    {!evaluationResults.hasForbiddenPhrase ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-400" />
                    )}
                    <span className="text-slate-300">3. Forbidden (&ldquo;as an AI assistant&rdquo;)</span>
                  </div>
                  <span className={!evaluationResults.hasForbiddenPhrase ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {!evaluationResults.hasForbiddenPhrase ? 'CLEAN' : 'FORBIDDEN FOUND'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    {evaluationResults.statusAccepted ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-400" />
                    )}
                    <span className="text-slate-300">
                      Status Match ({evaluatorType === 'brittle' ? 'Exact' : 'Normalized'})
                    </span>
                  </div>
                  <span className={evaluationResults.statusAccepted ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {evaluationResults.statusAccepted
                      ? 'ACCEPTED'
                      : evaluatorType === 'brittle'
                      ? 'EXACT MATCH FAILED'
                      : 'UNKNOWN STATUS'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    {evaluationResults.factsMatch ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-400" />
                    )}
                    <span className="text-slate-300">4. Facts vs Records (DB Match)</span>
                  </div>
                  <span className={evaluationResults.factsMatch ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {evaluationResults.factsMatch ? 'RECORD CONFIRMED' : 'DB MISMATCH'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    {evaluationResults.traceValid ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-400" />
                    )}
                    <span className="text-slate-300">5. Required Steps (Trace Audit)</span>
                  </div>
                  <span className={evaluationResults.traceValid ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {evaluationResults.traceValid ? 'AUDITED IN TRACE' : 'SKIPPED IN TRACE'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PILLAR 2: LLM JUDGES EVALUATOR & CUSTOM RUBRIC FORMULA                    */}
      {/* ========================================================================= */}
      <section id="section-llm-judges" className="space-y-8 pt-8 border-t border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                Pillar 2: LLM Judges &amp; Custom Rubric Formula
              </h2>
              <p className="text-xs text-slate-400">
                The 5-part rubric anatomy: Role, Criteria, Inputs, Labeled Examples, and Output Instructions
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            5-Part Rubric Formula
          </span>
        </div>

        {/* 5-STEP RUBRIC STEPPER / NAVIGATION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-cyan-400" /> The 5 Essential Components of a Production Rubric
            </h3>
            <span className="text-xs font-mono text-cyan-400">Click to Inspect Each Stage</span>
          </div>

          {/* Stepper Header Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
            {rubricSteps.map((s) => {
              const isActive = activeRubricStep === s.step;
              return (
                <button
                  key={s.step}
                  onClick={() => setActiveRubricStep(s.step)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold ${isActive ? 'text-cyan-400' : 'text-slate-300'}`}>
                      {s.title}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      Step {s.step}
                    </span>
                  </div>
                  <span className="text-[11px] block text-slate-400 truncate">{s.tagline}</span>
                </button>
              );
            })}
          </div>

          {/* Active Step Deep-Dive Container */}
          {(() => {
            const current = rubricSteps[activeRubricStep - 1];
            return (
              <div className="rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-6 space-y-5 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                      Rubric Anatomy Component #{current.step}
                    </span>
                    <h4 className="text-xl font-bold text-white mt-0.5">
                      {current.title}: {current.tagline}
                    </h4>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                    {current.badge}
                  </span>
                </div>

                {/* Step 1: Role Detail */}
                {current.step === 1 && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      The <strong>Role</strong> sets the evaluation scope, defining exactly what perspective the judge takes and what domain it governs.
                    </p>

                    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2 font-mono">
                      <span className="text-xs text-slate-400 block font-semibold uppercase">
                        Rubric Author System Prompt:
                      </span>
                      <p className="text-sm text-cyan-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                        &ldquo;{current.content.prompt}&rdquo;
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-300">
                      <strong className="text-cyan-400">Core Insight: </strong>
                      {current.content.insight}
                    </div>
                  </div>
                )}

                {/* Step 2: Criteria Detail */}
                {current.step === 2 && current.content.rules && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      <strong>Criteria</strong> dictate how the model makes decisions. Replace vague personas with concrete operational rules.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="rounded-xl border border-rose-500/40 bg-rose-950/20 p-3.5 space-y-1">
                        <span className="text-xs font-bold text-rose-400 block font-mono">Weak Instructions:</span>
                        <p className="text-xs text-slate-300 italic">&ldquo;You are an expert evaluator&rdquo;</p>
                        <span className="text-[10px] text-slate-400 block pt-1">
                          Too generic; gives zero guidance on what matters or how to resolve borderline cases.
                        </span>
                      </div>

                      <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-3.5 space-y-1">
                        <span className="text-xs font-bold text-emerald-400 block font-mono">Specific &amp; Actionable:</span>
                        <p className="text-xs text-slate-300 font-semibold">Names the task and what matters concretely</p>
                        <span className="text-[10px] text-slate-400 block pt-1">
                          Lists explicit, observable conditions that must be verified.
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-mono text-slate-400 font-bold uppercase block">
                        Concrete Safety Criteria List:
                      </span>
                      <div className="space-y-2">
                        {current.content.rules.map((r, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
                            <span className="h-6 w-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-slate-200">
                              {r.rule} (Focus on: <span className="text-rose-400 font-bold underline">{r.emphasis}</span>)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Inputs Detail */}
                {current.step === 3 && current.content.sources && current.content.separation && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      <strong>Inputs</strong> define which data is provided to the judge. Using semantic XML tags strictly separates evaluation instructions from evaluation data.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {current.content.sources.map((src, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <span className="text-[11px] font-mono text-cyan-400 font-bold block">{src.source}</span>
                          <span className="text-xs text-slate-300 font-mono block">{src.data}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-mono text-slate-400 font-bold uppercase block">
                        Tagged Context Prompt Format:
                      </span>
                      <div className="bg-slate-900/90 rounded-xl p-4 font-mono text-xs border border-slate-800 space-y-2">
                        <pre className="text-emerald-300 leading-relaxed">{current.content.xmlExample}</pre>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
                        {current.content.separation.instructions}
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
                        {current.content.separation.taggedInputs}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Labeled Examples Detail */}
                {current.step === 4 && current.content.comparison && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      <strong>Labeled examples</strong> anchor the model to edge cases. Providing few-shot examples vetted by human experts significantly boosts judge accuracy and agreement.
                    </p>

                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
                      <span className="text-xs font-mono font-bold text-amber-400 uppercase block">
                        Core Empirical Benchmark Question:
                      </span>
                      <div className="text-base font-bold text-white">
                        &ldquo;Which rubric agrees more with reviewers?&rdquo;
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-400 text-sm">Rubric with Examples</span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            Higher Agreement
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Anchors ambiguous boundary cases (e.g. handling reactive dogs vs energetic dogs), eliminating subjective variance.
                        </p>
                      </div>

                      <div className="rounded-xl border border-rose-500/40 bg-rose-950/20 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-400 text-sm">Rubric without Examples</span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                            Lower Agreement
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Leaves boundary interpretations to the model&apos;s default internal biases, yielding inconsistent judgments.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                      <strong className="text-white">Gold Standard Protocol: </strong>
                      {current.content.benchmarkNote}
                    </div>
                  </div>
                )}

                {/* Step 5: Output Instructions Detail */}
                {current.step === 5 && current.content.formats && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      <strong>Output instructions</strong> define how the verdict is reported. The output must be standardized for automated parsing and deployment gating.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {current.content.formats.map((fmt, idx) => (
                        <div 
                          key={idx}
                          className={`rounded-xl border p-4 space-y-2 ${
                            fmt.color === 'emerald'
                              ? 'border-emerald-500/40 bg-emerald-950/20'
                              : fmt.color === 'rose'
                              ? 'border-rose-500/40 bg-rose-950/20'
                              : 'border-amber-500/40 bg-amber-950/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs">{fmt.type}</span>
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${
                              fmt.color === 'emerald'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : fmt.color === 'rose'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {fmt.quality}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{fmt.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                      <span className="font-mono text-cyan-400 font-bold block uppercase text-[11px]">
                        Production Recommendation:
                      </span>
                      <p>
                        Avoid 1-10 numeric ratings in automated pipelines. Prefer clear categorical decisions (<code className="text-emerald-300 font-mono">SAFE</code>, <code className="text-rose-300 font-mono">UNSAFE</code>) or actionable escalations (<code className="text-amber-300 font-mono">NEEDS_REVIEW</code>).
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* TREAT FAILURES DIFFERENTLY SECTION (Image 0) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-400" /> Treat Failures Differently: Preference vs. Safety
            </h3>
            <span className="text-xs font-mono text-amber-400">Severity Calibration</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Preference Fit: MISSED */}
            <div className="rounded-2xl border border-amber-500/40 bg-amber-950/15 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Failure Class 1: Soft Preference
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  Accept for now
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">Preference fit: MISSED</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Missed preference: safe match, but not the dog they wanted.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">Volunteer:</span>
                  <span className="text-slate-200">Experienced</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">Dog:</span>
                  <span className="text-slate-200">45 lb, calm</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-400 shrink-0" />
                <span><strong>Deployment Gate:</strong> Non-fatal. Acceptable for staging or pilot release.</span>
              </div>
            </div>

            {/* Right: Safety: UNSAFE */}
            <div className="rounded-2xl border border-rose-500/40 bg-rose-950/15 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                  Failure Class 2: Hard Safety
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                  Guardrail: don&apos;t ship
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">Safety: UNSAFE</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Unsafe match: severe physical or behavioral hazard.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">Volunteer:</span>
                  <span className="text-slate-200">First-time volunteer</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">Dog:</span>
                  <span className="text-slate-200">Reactive, requires exp</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200 flex items-center gap-2">
                <Ban className="h-4 w-4 text-rose-400 shrink-0" />
                <span><strong>Deployment Gate:</strong> Hard blocker. Immediately abort pipeline or block release.</span>
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE RUBRIC EVALUATOR WORKBENCH */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bot className="h-4 w-4 text-cyan-400" /> Interactive Custom Rubric Evaluator
              </h3>
              <p className="text-xs text-slate-400">
                Test the complete 5-part custom rubric against diverse volunteer-dog match candidates
              </p>
            </div>

            {/* Test Case Selector */}
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
              <span className="text-slate-400 px-1">Case:</span>
              <button
                onClick={() => setSelectedTestCase('safe_calm')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedTestCase === 'safe_calm' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Safe Match
              </button>
              <button
                onClick={() => setSelectedTestCase('missed_preference')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedTestCase === 'missed_preference' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Missed Pref
              </button>
              <button
                onClick={() => setSelectedTestCase('unsafe_reactive')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedTestCase === 'unsafe_reactive' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Unsafe Reactive
              </button>
              <button
                onClick={() => setSelectedTestCase('needs_review')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedTestCase === 'needs_review' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Needs Review
              </button>
            </div>
          </div>

          {/* Interactive Split View: Assembled Prompt vs Evaluator Output */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Assembled 5-Part Prompt (6 Cols) */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
                <span>Assembled LLM Judge Prompt</span>
                <span className="text-cyan-400 font-mono text-[10px]">Tagged Context</span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs space-y-3 text-slate-300 overflow-x-auto min-h-[300px]">
                <div className="space-y-1">
                  <span className="text-slate-500 text-[10px] block font-bold">{"# 1. ROLE"}</span>
                  <span className="text-cyan-300">You are evaluating whether a proposed volunteer-dog match is safe.</span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 text-[10px] block font-bold">{"# 2. CRITERIA"}</span>
                  <ul className="text-slate-400 text-[11px] list-disc list-inside space-y-0.5">
                    <li>Volunteer can physically handle the dog</li>
                    <li>Experience matches dog&apos;s behavioral needs</li>
                    <li>Can manage documented risks</li>
                  </ul>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 text-[10px] block font-bold">{"# 3. TAGGED INPUTS"}</span>
                  <pre className="text-emerald-300 text-[11px] bg-slate-900/80 p-2 rounded border border-slate-800/80 leading-relaxed">
{`<volunteer_profile>${activeCase.volunteerProfile}</volunteer_profile>
<dog_record>${activeCase.dogRecord}</dog_record>
<recommendation>${activeCase.recommendation}</recommendation>`}
                  </pre>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 text-[10px] block font-bold">{"# 5. OUTPUT FORMAT INSTRUCTION"}</span>
                  <span className="text-amber-300 text-[11px] block">
                    Report one label: SAFE, UNSAFE, or NEEDS_REVIEW, followed by rationale.
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Evaluator Output & Gate (6 Cols) */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
                <span>LLM Judge Verdict:</span>
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${
                  activeCase.classification === 'SAFE'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : activeCase.classification === 'UNSAFE'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {activeCase.classification}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 min-h-[300px]">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                    Scenario Target:
                  </span>
                  <h4 className="text-base font-bold text-white">{activeCase.name}</h4>
                </div>

                {/* Deployment Gate Banner */}
                <div className={`rounded-xl p-3.5 border flex items-center justify-between text-xs font-mono font-bold ${
                  activeCase.type === 'unsafe'
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                    : activeCase.type === 'missed_preference'
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                    : activeCase.type === 'needs_review'
                    ? 'bg-purple-950/30 border-purple-500/40 text-purple-300'
                    : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                }`}>
                  <span>GATE DECISION:</span>
                  <span>{activeCase.guardrailVerdict}</span>
                </div>

                {/* Judge Reasoning Trace */}
                <div className="rounded-xl bg-slate-900/80 p-3.5 border border-slate-800 space-y-1.5 text-xs">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">
                    Judge Chain-of-Thought Rationale:
                  </span>
                  <p className="text-slate-300 leading-relaxed italic">
                    &ldquo;{activeCase.explanation}&rdquo;
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Reporting Format: Categorical</span>
                  <span className="text-white font-semibold">{activeCase.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: TREAT THE RUBRIC LIKE CODE & MANAGE THE VERSION                */}
        {/* ========================================================================= */}
        <div id="section-rubric-versioning" className="rounded-2xl border border-purple-500/30 bg-purple-950/10 p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-purple-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <GitBranch className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Treat the Rubric Like Code &amp; Manage the Version
                </h3>
                <p className="text-xs text-purple-300">
                  Engineering rigor for prompt evaluation: version control, isolated diffs, and benchmark regression testing
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
              <span className="text-slate-400 px-2">Active Version:</span>
              <button
                onClick={() => setSelectedVersion('v1')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedVersion === 'v1'
                    ? 'bg-purple-600 text-white font-bold shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                rubric_v1.md
              </button>
              <button
                onClick={() => setSelectedVersion('v2')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedVersion === 'v2'
                    ? 'bg-emerald-600 text-white font-bold shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                rubric_v2.md
              </button>
            </div>
          </div>

          {/* Principle Banner: One change, same cases & Keep earlier versions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
              <History className="h-4 w-4 text-purple-400 shrink-0" />
              <div>
                <span className="text-purple-300 font-bold block">Keep earlier versions</span>
                <span className="text-slate-400 text-[11px]">Git-track markdown prompts (`rubric_v1.md`, `rubric_v2.md`)</span>
              </div>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-emerald-300 font-bold block">One change, same cases</span>
                <span className="text-slate-400 text-[11px]">Mutate a single clause, re-run identical test suite</span>
              </div>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
              <Scale className="h-4 w-4 text-cyan-400 shrink-0" />
              <div>
                <span className="text-cyan-300 font-bold block">Human Expert Agreement</span>
                <span className="text-slate-400 text-[11px]">Score against consensus labels to validate rubric drift</span>
              </div>
            </div>
          </div>

          {/* Rubric Version Comparison Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Version 1 (Baseline) */}
            <div className={`lg:col-span-6 rounded-2xl border p-5 space-y-4 transition-all ${
              selectedVersion === 'v1'
                ? 'border-purple-500/60 bg-purple-950/20 shadow-xl'
                : 'border-slate-800 bg-slate-950/60 opacity-80'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase">Baseline File:</span>
                  <code className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-purple-300">rubric_v1.md</code>
                </div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
                  Initial Draft
                </span>
              </div>

              {/* Agreement Metric Gauge */}
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Agreement with reviewers:</span>
                  <span className="text-amber-400 font-bold text-base">70%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: '70%' }} />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                  Baseline prompt evaluated against 100 reviewed benchmark cases. Disagreed on 30 cases where physical strength was required.
                </p>
              </div>

              {/* Prompt Clause */}
              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 font-mono text-xs space-y-2">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Clause 2: Handling Criterion</span>
                <div className="p-2.5 rounded bg-rose-950/30 border border-rose-500/30 text-rose-300">
                  <span className="font-bold">- </span>Consider experience.
                </div>
                <span className="text-[11px] text-slate-400 italic block">
                  Flaw: Too vague. Did not distinguish dog experience from physical ability to control high-pull breeds.
                </span>
              </div>
            </div>

            {/* Right: Version 2 (Refined with Git Diff) */}
            <div className={`lg:col-span-6 rounded-2xl border p-5 space-y-4 transition-all ${
              selectedVersion === 'v2'
                ? 'border-emerald-500/60 bg-emerald-950/20 shadow-xl'
                : 'border-slate-800 bg-slate-950/60 opacity-80'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Target Version:</span>
                  <code className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-300">rubric_v2.md</code>
                </div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  +18% Gain
                </span>
              </div>

              {/* Agreement Metric Gauge */}
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Agreement with reviewers:</span>
                  <span className="text-emerald-400 font-bold text-base">88%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: '88%' }} />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                  Evaluated on the exact same 100 benchmark cases. Fixed 18 false approvals by explicitly commanding physical control checks.
                </p>
              </div>

              {/* Git Diff Representation */}
              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 font-mono text-xs space-y-2">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Git Diff: One change, same cases</span>
                <div className="space-y-1">
                  <div className="p-2 rounded bg-rose-950/40 border border-rose-500/30 text-rose-300 line-through">
                    - Consider experience.
                  </div>
                  <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-bold">
                    + Check experience AND physical control.
                  </div>
                </div>
                <span className="text-[11px] text-emerald-300/80 italic block">
                  Result: Zero regression on safe matches; eliminated 18 severe safety false positives.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 4: METRICS THAT CAN MEASURE THE LLM JUDGES                        */}
        {/* ========================================================================= */}
        <div id="section-judge-metrics" className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-amber-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <BarChart2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Use Several Checks Before You Trust a Judge
                </h3>
                <p className="text-xs text-amber-300">
                  Statistical metrics and qualitative audits to certify an LLM judge before granting deployment authority
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 ${
                judgeCalculatedMetrics.isCertified
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {judgeCalculatedMetrics.isCertified ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    CERTIFIED: Guide Improvement &amp; Block Changes
                  </>
                ) : (
                  <>
                    <XCircle className="h-3.5 w-3.5 text-rose-400" />
                    CALIBRATION REQUIRED: Insufficient Agreement
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Golden Milestone Banner: "Only then: guide improvement or block a change" */}
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-cyan-400 shrink-0" />
              <div>
                <span className="text-xs font-mono uppercase text-cyan-300 font-bold block">
                  Production Readiness Gate
                </span>
                <span className="text-sm font-bold text-white">
                  &ldquo;Only then: guide improvement or block a change&rdquo;
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">
              An unverified LLM judge hallucinating failure labels will block valid PRs or let catastrophic safety bugs slip through. A judge must pass all four criteria before becoming an automated CI gate.
            </p>
          </div>

          {/* THE 4 CHECKS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Check 1: Recall */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">1. Recall</span>
                <span className="text-xs font-mono text-white font-bold">{judgeCalculatedMetrics.recallPct}%</span>
              </div>
              <h4 className="text-sm font-bold text-white">Failure Coverage</h4>
              <p className="text-xs text-slate-300">
                &ldquo;Does it catch the failures you care about?&rdquo;
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                Formula: <MathFormula math="TP / (TP + FN)" />
              </div>
            </div>

            {/* Check 2: Precision */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">2. Precision</span>
                <span className="text-xs font-mono text-white font-bold">{judgeCalculatedMetrics.precisionPct}%</span>
              </div>
              <h4 className="text-sm font-bold text-white">Warning Reliability</h4>
              <p className="text-xs text-slate-300">
                &ldquo;Are its warnings usually right?&rdquo;
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                Formula: <MathFormula math="TP / (TP + FP)" />
              </div>
            </div>

            {/* Check 3: Cohen's Kappa */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">3. Cohen&apos;s Kappa</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">{judgeCalculatedMetrics.kappa}</span>
              </div>
              <h4 className="text-sm font-bold text-white">Beyond Chance</h4>
              <p className="text-xs text-slate-300">
                &ldquo;Agreement beyond chance&rdquo;
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                Formula: <MathFormula math="\kappa = \frac{P_o - P_e}{1 - P_e}" />
              </div>
            </div>

            {/* Check 4: Disagreements & Explanations */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">4. Explanations</span>
                <span className="text-xs font-mono text-cyan-400 font-bold">Audited</span>
              </div>
              <h4 className="text-sm font-bold text-white">Evidence Audit</h4>
              <p className="text-xs text-slate-300">
                &ldquo;Does it use the right evidence?&rdquo;
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                Inspect rationale chain-of-thought
              </div>
            </div>
          </div>

          {/* INTERACTIVE CALIBRATION WORKBENCH (Confusion Matrix) */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-5 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-amber-400" /> Interactive Judge Calibration Matrix (N = {judgeCalculatedMetrics.total} Reviewed Cases)
                </h4>
                <p className="text-xs text-slate-400">
                  Adjust true/false positive/negative failure detections to observe live Recall and Cohen&apos;s Kappa changes
                </p>
              </div>

              {/* Preset Scenarios */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs font-mono flex-wrap">
                <span className="text-slate-400 px-1 text-[11px]">Presets:</span>
                <button
                  onClick={() => applyKappaPreset('well_calibrated')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    kappaPreset === 'well_calibrated'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  Well-Calibrated (95% Raw / &kappa;=0.75)
                </button>
                <button
                  onClick={() => applyKappaPreset('lazy_yes_man')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    kappaPreset === 'lazy_yes_man'
                      ? 'bg-rose-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  &ldquo;Lazy Yes-Man&rdquo; (90% Raw / &kappa;=0.00)
                </button>
                <button
                  onClick={() => applyKappaPreset('noisy')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    kappaPreset === 'noisy'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  Noisy Judge (&kappa;=0.29)
                </button>
                <button
                  onClick={() => applyKappaPreset('balanced')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    kappaPreset === 'balanced'
                      ? 'bg-cyan-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  Balanced (50/50)
                </button>
              </div>
            </div>

            {/* Sliders for Confusion Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold">True Positives (TP):</span>
                  <span className="text-white font-bold">{metricTp}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={metricTp}
                  onChange={(e) => {
                    setMetricTp(parseInt(e.target.value) || 0);
                    setKappaPreset('custom');
                  }}
                  className="w-full accent-emerald-500"
                />
                <span className="text-[10px] text-slate-400 block">Both agree UNSAFE (Hazard caught)</span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-400 font-bold">False Positives (FP):</span>
                  <span className="text-white font-bold">{metricFp}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={metricFp}
                  onChange={(e) => {
                    setMetricFp(parseInt(e.target.value) || 0);
                    setKappaPreset('custom');
                  }}
                  className="w-full accent-amber-500"
                />
                <span className="text-[10px] text-slate-400 block">Human says SAFE, LLM flags UNSAFE (False alarm)</span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-rose-400 font-bold">False Negatives (FN):</span>
                  <span className="text-white font-bold">{metricFn}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={metricFn}
                  onChange={(e) => {
                    setMetricFn(parseInt(e.target.value) || 0);
                    setKappaPreset('custom');
                  }}
                  className="w-full accent-rose-500"
                />
                <span className="text-[10px] text-slate-400 block">Human says UNSAFE, LLM approves SAFE (Critical miss)</span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold">True Negatives (TN):</span>
                  <span className="text-white font-bold">{metricTn}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={metricTn}
                  onChange={(e) => {
                    setMetricTn(parseInt(e.target.value) || 0);
                    setKappaPreset('custom');
                  }}
                  className="w-full accent-cyan-500"
                />
                <span className="text-[10px] text-slate-400 block">Both agree SAFE (Match approved)</span>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* DEEP DIVE: HUMAN EVALUATOR VS. LLM JUDGE CONTINGENCY TABLE & KAPPA MATH   */}
            {/* ========================================================================= */}
            <div className="pt-4 border-t border-slate-800 space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-cyan-400" />
                  <div>
                    <h5 className="text-sm font-bold text-white">
                      Human Evaluator vs. LLM Judge: 2&times;2 Inter-Rater Agreement Matrix
                    </h5>
                    <p className="text-xs text-slate-400">
                      Comparing Ground Truth Human Expert Reviewers against Autonomous LLM Judge Decisions
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${judgeCalculatedMetrics.landisKochColor}`}>
                    {judgeCalculatedMetrics.landisKochLabel}
                  </span>
                </div>
              </div>

              {/* 2x2 Contingency Matrix Table */}
              <div className="overflow-x-auto">
                <div className="min-w-[620px] bg-slate-900/90 rounded-2xl border border-slate-800 p-4">
                  <div className="grid grid-cols-12 gap-2 text-xs font-mono">
                    {/* Top Header Corner */}
                    <div className="col-span-3 p-2 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-col justify-center text-[11px] text-slate-400">
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Bot className="h-3.5 w-3.5" /> LLM &rarr;
                      </span>
                      <span className="text-cyan-300 font-bold flex items-center gap-1">
                        <UserCheck className="h-3.5 w-3.5" /> Human &darr;
                      </span>
                    </div>

                    {/* Top Column Headers (LLM Judge) */}
                    <div className="col-span-4 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-0.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">LLM Judge Decides:</span>
                      <span className="text-rose-400 font-bold text-xs">UNSAFE (Flagged)</span>
                    </div>

                    <div className="col-span-4 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-0.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">LLM Judge Decides:</span>
                      <span className="text-emerald-400 font-bold text-xs">SAFE (Approved)</span>
                    </div>

                    <div className="col-span-1 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center flex flex-col justify-center">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Total</span>
                    </div>

                    {/* Row 1: Human Ground Truth = UNSAFE */}
                    <div className="col-span-3 p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-center space-y-0.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Human Expert:</span>
                      <span className="text-rose-400 font-bold text-xs">UNSAFE (Hazard)</span>
                    </div>

                    {/* Cell 1: TP */}
                    <div className="col-span-4 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-400 font-bold">True Positive (TP)</span>
                        <span className="text-white text-base font-bold">{metricTp}</span>
                      </div>
                      <span className="text-[10px] text-emerald-300/80 block leading-tight">
                        Both agree match is dangerous ({judgeCalculatedMetrics.total > 0 ? ((metricTp / judgeCalculatedMetrics.total) * 100).toFixed(0) : 0}%)
                      </span>
                    </div>

                    {/* Cell 2: FN */}
                    <div className="col-span-4 p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-rose-400 font-bold">False Negative (FN)</span>
                        <span className="text-rose-300 text-base font-bold">{metricFn}</span>
                      </div>
                      <span className="text-[10px] text-rose-300/80 block leading-tight">
                        Critical Miss: Human said UNSAFE, LLM approved!
                      </span>
                    </div>

                    {/* Human UNSAFE Total */}
                    <div className="col-span-1 p-2 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-center text-center">
                      <span className="text-white font-bold text-xs">{judgeCalculatedMetrics.humanUnsafe}</span>
                      <span className="text-[10px] text-slate-400">
                        {judgeCalculatedMetrics.total > 0 ? ((judgeCalculatedMetrics.humanUnsafe / judgeCalculatedMetrics.total) * 100).toFixed(0) : 0}%
                      </span>
                    </div>

                    {/* Row 2: Human Ground Truth = SAFE */}
                    <div className="col-span-3 p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-center space-y-0.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Human Expert:</span>
                      <span className="text-emerald-400 font-bold text-xs">SAFE (Eligible)</span>
                    </div>

                    {/* Cell 3: FP */}
                    <div className="col-span-4 p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-amber-400 font-bold">False Positive (FP)</span>
                        <span className="text-amber-300 text-base font-bold">{metricFp}</span>
                      </div>
                      <span className="text-[10px] text-amber-300/80 block leading-tight">
                        False Alarm: Human approved, LLM blocked
                      </span>
                    </div>

                    {/* Cell 4: TN */}
                    <div className="col-span-4 p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-cyan-400 font-bold">True Negative (TN)</span>
                        <span className="text-white text-base font-bold">{metricTn}</span>
                      </div>
                      <span className="text-[10px] text-cyan-300/80 block leading-tight">
                        Both agree match is safe ({judgeCalculatedMetrics.total > 0 ? ((metricTn / judgeCalculatedMetrics.total) * 100).toFixed(0) : 0}%)
                      </span>
                    </div>

                    {/* Human SAFE Total */}
                    <div className="col-span-1 p-2 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-center text-center">
                      <span className="text-white font-bold text-xs">{judgeCalculatedMetrics.humanSafe}</span>
                      <span className="text-[10px] text-slate-400">
                        {judgeCalculatedMetrics.total > 0 ? ((judgeCalculatedMetrics.humanSafe / judgeCalculatedMetrics.total) * 100).toFixed(0) : 0}%
                      </span>
                    </div>

                    {/* Bottom Margins: LLM Totals */}
                    <div className="col-span-3 p-2 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-center text-[10px] text-slate-400 uppercase font-bold">
                      LLM Total
                    </div>
                    <div className="col-span-4 p-2 bg-slate-950 rounded-xl border border-slate-800 text-center">
                      <span className="text-white font-bold text-xs">{judgeCalculatedMetrics.llmUnsafe}</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">
                        ({judgeCalculatedMetrics.total > 0 ? ((judgeCalculatedMetrics.llmUnsafe / judgeCalculatedMetrics.total) * 100).toFixed(0) : 0}%)
                      </span>
                    </div>
                    <div className="col-span-4 p-2 bg-slate-950 rounded-xl border border-slate-800 text-center">
                      <span className="text-white font-bold text-xs">{judgeCalculatedMetrics.llmSafe}</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">
                        ({judgeCalculatedMetrics.total > 0 ? ((judgeCalculatedMetrics.llmSafe / judgeCalculatedMetrics.total) * 100).toFixed(0) : 0}%)
                      </span>
                    </div>
                    <div className="col-span-1 p-2 bg-slate-950 rounded-xl border border-emerald-500/40 text-center text-emerald-400 font-bold text-xs flex flex-col justify-center">
                      {judgeCalculatedMetrics.total}
                    </div>
                  </div>
                </div>
              </div>

              {/* The "Why Raw Agreement Fails" Insight Banner */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>The &ldquo;Lazy Yes-Man&rdquo; Paradox: Why Raw Agreement Alone Is Deceptive</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  In real-world deployment, critical failure cases are rare (e.g., 90% of volunteer matches are safe, and only 10% are dangerous). A completely broken LLM judge that blindly outputs <code className="text-emerald-300">SAFE</code> 100% of the time will achieve a deceptively high <strong className="text-white">90% Raw Agreement (<MathFormula math="P_o" />)</strong>!
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  However, its expected chance agreement <MathFormula math="P_e" /> is also 90%, yielding a <strong className="text-rose-400">Cohen&apos;s Kappa of exactly 0.00</strong>. Cohen&apos;s Kappa unmasks the illusion by measuring only the agreement that occurs <strong className="text-white">beyond random chance</strong>.
                </p>
              </div>

              {/* Step-by-Step Live Mathematical Walkthrough */}
              <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-3 font-mono text-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">
                  Live Mathematical Computation Walkthrough:
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Step 1: Observed Agreement */}
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase block">
                      Step 1: Observed Agreement (<MathFormula math="P_o" />)
                    </span>
                    <div className="text-white font-bold">
                      <MathFormula math="P_o = \frac{TP + TN}{N}" />
                    </div>
                    <div className="text-slate-300 text-[11px]">
                      = ({metricTp} + {metricTn}) / {judgeCalculatedMetrics.total} = <strong className="text-cyan-300">{judgeCalculatedMetrics.observedAgreementPct}%</strong>
                    </div>
                  </div>

                  {/* Step 2: Chance Agreement */}
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-amber-400 font-bold uppercase block">
                      Step 2: Chance Agreement (<MathFormula math="P_e" />)
                    </span>
                    <div className="text-white font-bold">
                      <MathFormula math="P_e = P_{unsafe} + P_{safe}" />
                    </div>
                    <div className="text-slate-300 text-[11px]">
                      = {judgeCalculatedMetrics.pBothUnsafeChancePct}% + {judgeCalculatedMetrics.pBothSafeChancePct}% = <strong className="text-amber-300">{judgeCalculatedMetrics.chanceAgreementPct}%</strong>
                    </div>
                  </div>

                  {/* Step 3: Cohen's Kappa */}
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-emerald-500/40 space-y-1">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase block">
                      Step 3: Cohen&apos;s Kappa (&kappa;)
                    </span>
                    <div className="text-white font-bold">
                      <MathFormula math="\kappa = \frac{P_o - P_e}{1 - P_e}" />
                    </div>
                    <div className="text-slate-300 text-[11px]">
                      = ({judgeCalculatedMetrics.observedAgreementPct}% &minus; {judgeCalculatedMetrics.chanceAgreementPct}%) / (100% &minus; {judgeCalculatedMetrics.chanceAgreementPct}%) = <strong className="text-emerald-300 text-sm font-extrabold">{judgeCalculatedMetrics.kappa}</strong>
                    </div>
                  </div>
                </div>

                {/* Landis & Koch Benchmark Scale Bar */}
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Landis &amp; Koch Benchmark Scale:</span>
                    <span className="text-slate-300 font-bold">Current &kappa; = {judgeCalculatedMetrics.kappa}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1 text-[10px] text-center font-bold">
                    <div className={`p-1.5 rounded ${judgeCalculatedMetrics.kappa < 0.20 ? 'bg-rose-500 text-white ring-2 ring-rose-400' : 'bg-slate-900 text-rose-400/80 border border-slate-800'}`}>
                      &lt; 0.20 Poor
                    </div>
                    <div className={`p-1.5 rounded ${judgeCalculatedMetrics.kappa >= 0.20 && judgeCalculatedMetrics.kappa < 0.40 ? 'bg-orange-500 text-white ring-2 ring-orange-400' : 'bg-slate-900 text-orange-400/80 border border-slate-800'}`}>
                      0.21&ndash;0.40 Fair
                    </div>
                    <div className={`p-1.5 rounded ${judgeCalculatedMetrics.kappa >= 0.40 && judgeCalculatedMetrics.kappa < 0.60 ? 'bg-amber-500 text-white ring-2 ring-amber-400' : 'bg-slate-900 text-amber-400/80 border border-slate-800'}`}>
                      0.41&ndash;0.60 Moderate
                    </div>
                    <div className={`p-1.5 rounded ${judgeCalculatedMetrics.kappa >= 0.60 && judgeCalculatedMetrics.kappa < 0.80 ? 'bg-teal-500 text-white ring-2 ring-teal-400' : 'bg-slate-900 text-teal-400/80 border border-slate-800'}`}>
                      0.61&ndash;0.80 Substantial (Gate)
                    </div>
                    <div className={`p-1.5 rounded ${judgeCalculatedMetrics.kappa >= 0.80 ? 'bg-emerald-500 text-white ring-2 ring-emerald-400' : 'bg-slate-900 text-emerald-400/80 border border-slate-800'}`}>
                      0.81&ndash;1.00 Almost Perfect
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4-STAGE ARCHITECTURAL PIPELINE (Slide Flowchart) */}
          <div className="pt-4 border-t border-amber-500/20 space-y-3">
            <span className="text-xs font-mono text-slate-400 uppercase font-bold block">
              The 4-Stage Production Evaluation Lifecycle:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-3.5 space-y-1.5">
                <span className="text-[10px] font-mono text-blue-400 uppercase font-bold block">Stage 1</span>
                <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Code2 className="h-4 w-4 text-blue-400" /> Code evaluator
                </h5>
                <p className="text-[11px] text-slate-300">
                  Automate explicit rules first (JSON, bounds, blacklist, records). Zero token spend.
                </p>
              </div>

              <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-3.5 space-y-1.5">
                <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block">Stage 2</span>
                <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Bot className="h-4 w-4 text-purple-400" /> LLM judge
                </h5>
                <p className="text-[11px] text-slate-300">
                  Assess nuanced semantic behavior, physical plausibility, and conversational quality.
                </p>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 space-y-1.5">
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">Stage 3</span>
                <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-amber-400" /> Rubric
                </h5>
                <p className="text-[11px] text-slate-300">
                  Structure with 5 parts: Role, Criteria, Inputs, Labeled examples, Output instructions.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 space-y-1.5">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">Stage 4</span>
                <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Validated labels
                </h5>
                <p className="text-[11px] text-slate-300">
                  Compare against human reviewer consensus to establish Cohen&apos;s Kappa certification.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Source Reference Images Gallery (Toggleable) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
              <Eye className="h-4 w-4 text-cyan-400" /> LLM Judge &amp; Rubric Architecture Slides (8 Figures)
            </span>
            <button
              onClick={() => setShowJudgeDiagrams(!showJudgeDiagrams)}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              {showJudgeDiagrams ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" /> Hide Rubric Slides
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" /> View Rubric Slides
                </>
              )}
            </button>
          </div>

          {showJudgeDiagrams && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <span className="text-xs font-mono text-slate-300 block font-semibold">
                  1. Role: What it evaluates
                </span>
                <Image
                  src={getAssetPath('/images/llm_judge_1_role.png')}
                  alt="Step 1: Role"
                  width={800}
                  height={450}
                  unoptimized
                  className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-[440px]"
                />
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <span className="text-xs font-mono text-slate-300 block font-semibold">
                  2. Criteria: How to decide
                </span>
                <Image
                  src={getAssetPath('/images/llm_judge_2_criteria.jpg')}
                  alt="Step 2: Criteria"
                  width={800}
                  height={450}
                  unoptimized
                  className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-[440px]"
                />
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <span className="text-xs font-mono text-slate-300 block font-semibold">
                  3. Inputs: Which information
                </span>
                <Image
                  src={getAssetPath('/images/llm_judge_3_inputs.jpg')}
                  alt="Step 3: Inputs"
                  width={800}
                  height={450}
                  unoptimized
                  className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-[440px]"
                />
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <span className="text-xs font-mono text-slate-300 block font-semibold">
                  4. Labeled examples: How criteria apply
                </span>
                <Image
                  src={getAssetPath('/images/llm_judge_4_labeled_examples.jpg')}
                  alt="Step 4: Labeled examples"
                  width={800}
                  height={450}
                  unoptimized
                  className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-[440px]"
                />
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <span className="text-xs font-mono text-slate-300 block font-semibold">
                  5. Output instructions: How to report
                </span>
                <Image
                  src={getAssetPath('/images/llm_judge_5_output_instructions.jpg')}
                  alt="Step 5: Output instructions"
                  width={800}
                  height={450}
                  unoptimized
                  className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-[440px]"
                />
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <span className="text-xs font-mono text-slate-300 block font-semibold">
                  Treat failures differently (Safety vs Preference)
                </span>
                <Image
                  src={getAssetPath('/images/llm_judge_treat_failures_differently.jpg')}
                  alt="Treat failures differently"
                  width={800}
                  height={450}
                  unoptimized
                  className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-[440px]"
                />
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <span className="text-xs font-mono text-slate-300 block font-semibold">
                  Treat rubric like code (Versioning)
                </span>
                <Image
                  src={getAssetPath('/images/llm_judge_versioning.jpg')}
                  alt="Treat rubric like code and manage the version"
                  width={800}
                  height={450}
                  unoptimized
                  className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-[440px]"
                />
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <span className="text-xs font-mono text-slate-300 block font-semibold">
                  Judge Evaluation Metrics &amp; Checks
                </span>
                <Image
                  src={getAssetPath('/images/llm_judge_metrics.jpg')}
                  alt="Metrics that can measure the LLM judges"
                  width={800}
                  height={450}
                  unoptimized
                  className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-[440px]"
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
