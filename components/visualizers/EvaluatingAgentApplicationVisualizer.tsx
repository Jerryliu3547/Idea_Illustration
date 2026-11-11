"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAssetPath } from '@/lib/asset';
import { 
  Bot, 
  Workflow, 
  Scale, 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  ShieldCheck, 
  Terminal, 
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
  AlertTriangle,
  RotateCcw,
  Layers,
  MessageSquare,
  User,
  ArrowDown,
  Layers2,
  Cpu
} from 'lucide-react';

export const EvaluatingAgentApplicationVisualizer: React.FC = () => {
  // ==========================================
  // SECTION 1: HIERARCHY & ACTION CHECK STATES
  // ==========================================
  const [selectedHierarchyLevel, setSelectedHierarchyLevel] = useState<'action' | 'trajectory' | 'session' | 'outcome'>('action');
  const [showSection1Diagrams, setShowSection1Diagrams] = useState<boolean>(true);

  // Action presets
  const [selectedActionPreset, setSelectedActionPreset] = useState<'cancel_fail_booked' | 'order_typo' | 'valid_cancel' | 'unsafe_dog'>('cancel_fail_booked');

  const actionPresets = {
    cancel_fail_booked: {
      title: '1. Pamela & Pepper: Booking Instead of Cancellation (Prohibited Action)',
      userPrompt: "I can't make Saturday anymore. Please cancel my outing.",
      context: 'Volunteer: Pamela (safely handles large dogs). Dog: Pepper (100 lb Dalmatian). Booking: Saturday 2 PM.',
      selectedTool: 'book_outing',
      toolArgs: JSON.stringify({ volunteer: 'Pamela', dog: 'Pepper', date: 'Saturday', time: '14:00' }, null, 2),
      toolCorrect: false,
      toolReason: 'Agent selected `book_outing` instead of `cancel_outing`. User explicitly requested cancellation.',
      argsCorrect: false,
      argsReason: 'Action parameters scheduled an appointment rather than releasing the slot.',
      requiredActionPassed: false,
      prohibitedActionPassed: false,
      prohibitedReason: 'Agent performed a prohibited modification: confirmed a new booking during a cancellation request.',
      overallVerdict: 'FAIL' as const,
    },
    order_typo: {
      title: '2. Order Lookup: Transposed Argument Digits (Detail Check)',
      userPrompt: 'Can you check status for order 4521?',
      context: 'User requested order 4521 lookup.',
      selectedTool: 'order_lookup',
      toolArgs: JSON.stringify({ order_id: 4512 }, null, 2),
      toolCorrect: true,
      toolReason: 'Selected correct tool `order_lookup`.',
      argsCorrect: false,
      argsReason: 'Digit transposition typo: Expected order_id 4521, but invoked with 4512.',
      requiredActionPassed: true,
      prohibitedActionPassed: true,
      prohibitedReason: 'No prohibited tool invoked.',
      overallVerdict: 'FAIL' as const,
    },
    valid_cancel: {
      title: '3. Clean Cancellation: Right Tool & Right Details (All Pass)',
      userPrompt: "I can't make Saturday anymore. Please cancel my outing.",
      context: 'Volunteer: Pamela. Outing ID: OUT-882 (Saturday with Pepper).',
      selectedTool: 'cancel_outing',
      toolArgs: JSON.stringify({ outing_id: 'OUT-882', volunteer_name: 'Pamela', reason: 'User conflict' }, null, 2),
      toolCorrect: true,
      toolReason: 'Correct tool selected: `cancel_outing`.',
      argsCorrect: true,
      argsReason: 'Matched accurate outing identifier and volunteer details.',
      requiredActionPassed: true,
      prohibitedActionPassed: true,
      prohibitedReason: 'Executed within safe boundaries.',
      overallVerdict: 'PASS' as const,
    },
    unsafe_dog: {
      title: '4. Safety Constraint Violation: Incompatible Dog Assignment',
      userPrompt: 'Book an outing for volunteer Alex with Pepper.',
      context: 'Volunteer Alex: Max dog weight limit is 30 lbs. Dog Pepper: 100 lbs.',
      selectedTool: 'book_outing',
      toolArgs: JSON.stringify({ volunteer: 'Alex', dog: 'Pepper (100 lb)', override_warning: false }, null, 2),
      toolCorrect: true,
      toolReason: 'Tool `book_outing` matches task category.',
      argsCorrect: false,
      argsReason: 'Violates safety constraint: Pepper (100 lb) exceeds Alex’s approved threshold (30 lb).',
      requiredActionPassed: true,
      prohibitedActionPassed: false,
      prohibitedReason: 'Prohibited safety violation: Assigning high-risk dog without special handling clearance.',
      overallVerdict: 'FAIL' as const,
    },
  };

  const currentAction = actionPresets[selectedActionPreset];

  // ==========================================
  // SECTION 2: TRAJECTORY AUDITING STATES
  // ==========================================
  const [showSection2Diagrams, setShowSection2Diagrams] = useState<boolean>(true);
  const [selectedTrajectoryPreset, setSelectedTrajectoryPreset] = useState<'golden' | 'wrong_order' | 'skipped_verification' | 'broken_propagation'>('golden');

  const trajectoryPresets = {
    golden: {
      name: '1. Golden Path (All 3 Criteria Pass)',
      description: 'Order lookup -> Get Customer -> Verify Identity -> Process Refund (Data propagates correctly).',
      steps: [
        { id: 'step-1', name: 'order_lookup', args: 'order_id: 4521', output: '{ customer_id: "C103", amount: 49.99 }', status: 'pass' },
        { id: 'step-2', name: 'get_customer', args: 'customer_id: "C103"', output: '{ verified: false, challenge: "PIN_REQUIRED" }', status: 'pass' },
        { id: 'step-3', name: 'verify_customer', args: 'customer_id: "C103", pin: "9912"', output: '{ verified: true, auth_token: "AUTH_OK" }', status: 'pass' },
        { id: 'step-4', name: 'process_refund', args: 'order_id: 4521, amount: 49.99, auth_token: "AUTH_OK"', output: '{ refund_id: "RF-882", status: "SUCCESS" }', status: 'pass' },
      ],
      requiredStepsCheck: { pass: true, detail: 'All 4 required lifecycle operations occurred.' },
      orderCheck: { pass: true, detail: 'Verification happened strictly BEFORE the financial refund operation.' },
      propagationCheck: { pass: true, detail: '`process_refund` consumed exact `amount` (49.99) and `auth_token` from prior steps.' },
    },
    wrong_order: {
      name: '2. Critical Ordering Hazard: Refund Issued BEFORE Verification',
      description: 'Agent issues refund first, then attempts to verify identity after funds are already transferred.',
      steps: [
        { id: 'step-1', name: 'order_lookup', args: 'order_id: 4521', output: '{ customer_id: "C103", amount: 49.99 }', status: 'pass' },
        { id: 'step-2', name: 'process_refund', args: 'order_id: 4521, amount: 49.99', output: '{ refund_id: "RF-882", status: "SUCCESS" }', status: 'warning' },
        { id: 'step-3', name: 'get_customer', args: 'customer_id: "C103"', output: '{ verified: false }', status: 'fail' },
        { id: 'step-4', name: 'verify_customer', args: 'customer_id: "C103"', output: 'Customer verified AFTER refund complete', status: 'fail' },
      ],
      requiredStepsCheck: { pass: true, detail: 'All required tool names were eventually called.' },
      orderCheck: { pass: false, detail: 'SECURITY ORDER VIOLATION: `process_refund` executed prior to identity verification.' },
      propagationCheck: { pass: false, detail: '`process_refund` executed without receiving an authorized token from verification.' },
    },
    skipped_verification: {
      name: '3. Skipped Required Step: Missing Customer Verification',
      description: 'Agent jumps straight from lookup to refund without verifying customer ownership.',
      steps: [
        { id: 'step-1', name: 'order_lookup', args: 'order_id: 4521', output: '{ customer_id: "C103", amount: 49.99 }', status: 'pass' },
        { id: 'step-2', name: 'process_refund', args: 'order_id: 4521, amount: 49.99', output: '{ refund_id: "RF-882", status: "SUCCESS" }', status: 'fail' },
      ],
      requiredStepsCheck: { pass: false, detail: 'MISSING REQUIRED STEP: `verify_customer` was completely omitted from the trace.' },
      orderCheck: { pass: false, detail: 'Cannot satisfy ordering constraint when prerequisite step is absent.' },
      propagationCheck: { pass: true, detail: 'Amount was propagated, but security payload was omitted.' },
    },
    broken_propagation: {
      name: '4. Data Flow Broken: Hardcoded / Stale Value Injected',
      description: 'Agent successfully looked up order 4521 with amount $49.99, but passed default $10.00 to refund tool.',
      steps: [
        { id: 'step-1', name: 'order_lookup', args: 'order_id: 4521', output: '{ customer_id: "C103", amount: 49.99 }', status: 'pass' },
        { id: 'step-2', name: 'get_customer', args: 'customer_id: "C103"', output: '{ verified: true }', status: 'pass' },
        { id: 'step-3', name: 'verify_customer', args: 'customer_id: "C103"', output: '{ verified: true, auth_token: "AUTH_OK" }', status: 'pass' },
        { id: 'step-4', name: 'process_refund', args: 'order_id: 4521, amount: 10.00 (HARDCODED BUG)', output: '{ refund_id: "RF-882", status: "PARTIAL" }', status: 'fail' },
      ],
      requiredStepsCheck: { pass: true, detail: 'All required steps were called.' },
      orderCheck: { pass: true, detail: 'Order-sensitive sequence respected.' },
      propagationCheck: { pass: false, detail: 'DATA PROPAGATION FAILURE: Step 4 ignored $49.99 from Step 1 and passed default 10.00.' },
    },
  };

  const currentTrajectory = trajectoryPresets[selectedTrajectoryPreset];

  // ==========================================
  // SECTION 3: MULTI-TURN & SIMULATED USER
  // ==========================================
  const [showSection3Diagrams, setShowSection3Diagrams] = useState<boolean>(true);
  const [sessionVariant, setSessionVariant] = useState<'success' | 'loss_a' | 'hallucination_b'>('success');
  const [testingMethod, setTestingMethod] = useState<'scripted' | 'simulated_llm'>('simulated_llm');

  // ==========================================
  // SECTION 4: OUTCOME VS PROCESS DECOUPLING
  // ==========================================
  const [showSection4Diagrams, setShowSection4Diagrams] = useState<boolean>(true);
  const [selectedMatrixCell, setSelectedMatrixCell] = useState<'pass_pass' | 'pass_fail' | 'fail_pass' | 'fail_fail'>('pass_fail');

  const matrixDetails = {
    pass_pass: {
      title: 'Pass Outcome + Pass Process: Certified Production Quality',
      color: 'emerald',
      badge: 'Certified Safe',
      systemOutcome: 'PASS (Customer refunded $49.99, order state updated to REFUNDED)',
      trajectoryState: 'PASS (order_lookup -> verify_customer -> process_refund executed in compliance)',
      verdict: 'Ready for full production deployment without manual intervention.',
      takeaway: 'Both business metric and security governance are satisfied.',
    },
    pass_fail: {
      title: 'Pass Outcome + Fail Process: High-Risk Security Shortcut',
      color: 'rose',
      badge: 'Critical Hazard',
      systemOutcome: 'PASS (Customer refunded $49.99 in database)',
      trajectoryState: 'FAIL (Customer verified AFTER refund or identity check bypassed)',
      verdict: 'MUST BLOCK DEPLOYMENT. This is the exact trap of evaluating only task outcomes.',
      takeaway: 'If you only measure the database outcome, you score this 100%. In reality, attackers can exploit this shortcut to drain funds without account authentication.',
    },
    fail_pass: {
      title: 'Fail Outcome + Pass Process: Benign Block / Guardrail Working',
      color: 'amber',
      badge: 'Benign Guardrail',
      systemOutcome: 'FAIL (No refund issued in database)',
      trajectoryState: 'PASS (Agent halted execution because user failed verification challenge)',
      verdict: 'Expected and correct behavior when unverified or malicious requests occur.',
      takeaway: 'Outcome metric alone flags this as an error, yet the agent behaved with perfect safety discipline.',
    },
    fail_fail: {
      title: 'Fail Outcome + Fail Process: Complete Execution Breakdown',
      color: 'slate',
      badge: 'Total Failure',
      systemOutcome: 'FAIL (Task not completed)',
      trajectoryState: 'FAIL (Agent hallucinated nonexistent tools or crashed midway)',
      verdict: 'Agent requires core prompt and tool definition refactoring.',
      takeaway: 'Both system state and procedural compliance failed completely.',
    },
  };

  const currentMatrix = matrixDetails[selectedMatrixCell];

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
          className="px-4 py-2 rounded-xl text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 transition-all flex items-center gap-2 shadow-lg shadow-cyan-950/20 shrink-0"
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
        <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-1">
          <Bot className="h-4 w-4" /> Comprehensive Agentic Evaluation Framework
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Evaluating Agent Applications: Action, Trajectory, Session &amp; Outcome
        </h1>
        <p className="text-slate-400 mt-2 text-base leading-relaxed">
          Robust evaluation must dissect an agent at four distinct granularities: validating single <strong className="text-emerald-400">tool calls</strong>, auditing multi-step <strong className="text-cyan-400">trajectories</strong>, simulating <strong className="text-purple-400">multi-turn sessions</strong>, and strictly decoupling <strong className="text-amber-400">system outcomes from process integrity</strong>.
        </p>
      </div>

      {/* QUICK SECTION BOOKMARKS */}
      <div className="sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
          <Bookmark className="h-4 w-4 text-cyan-400" />
          <span>Quick Section Jump:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-mono">
          <button
            onClick={() => document.getElementById('section-action-checks')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2 truncate">
              <Terminal className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="font-semibold truncate">1. 4-Tier &amp; Action Checks</span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30 shrink-0">
              Tool Level
            </span>
          </button>

          <button
            onClick={() => document.getElementById('section-trajectory-auditing')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2 truncate">
              <Workflow className="h-4 w-4 text-cyan-400 shrink-0" />
              <span className="font-semibold truncate">2. Trajectory Auditing</span>
            </div>
            <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30 shrink-0">
              3 Checks
            </span>
          </button>

          <button
            onClick={() => document.getElementById('section-multi-turn-sessions')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2 truncate">
              <MessageSquare className="h-4 w-4 text-purple-400 shrink-0" />
              <span className="font-semibold truncate">3. Multi-Turn Sessions</span>
            </div>
            <span className="text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/30 shrink-0">
              LLM Users
            </span>
          </button>

          <button
            onClick={() => document.getElementById('section-outcome-vs-process')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2 truncate">
              <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
              <span className="font-semibold truncate">4. Outcome vs Process</span>
            </div>
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30 shrink-0">
              2x2 Matrix
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: THE 4 EVALUATION LEVELS & ACTION VALIDATION                     */}
      {/* ========================================================================= */}
      <section id="section-action-checks" className="space-y-8 pt-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Terminal className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                Pillar 1: 4-Tier Hierarchy &amp; Action/Tool Call Validation
              </h2>
              <p className="text-xs text-slate-400">
                Granularity breakdown and four core tool-call safety checks: Right Action, Right Details, Required Actions, Prohibited Actions
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Atomic Verification
          </span>
        </div>

        {/* 4 Levels Visual Hierarchy Cards */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 font-mono">
            <Layers className="h-4 w-4 text-emerald-400" /> Granularity Spectrum of Agent Evaluation
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                id: 'action',
                title: '1. Action / Tool Call',
                subtitle: 'One action: Name + arguments',
                detail: 'Validates individual tool selection, exact parameter types/ranges, and safety constraint compliance.',
                color: 'emerald',
              },
              {
                id: 'trajectory',
                title: '2. Trajectory',
                subtitle: 'Several actions: Steps + order',
                detail: 'Validates that every required step happened, order-sensitive dependencies were respected, and data propagated cleanly.',
                color: 'cyan',
              },
              {
                id: 'session',
                title: '3. Session',
                subtitle: 'Earlier turns: Context + constraints',
                detail: 'Audits memory retention across multiple conversation rounds, resisting context loss and parameter hallucination.',
                color: 'purple',
              },
              {
                id: 'outcome',
                title: '4. System Outcome',
                subtitle: 'External system: Actual state',
                detail: 'Measures changes in external environment/databases (e.g., refund table, booking calendar), decoupled from process.',
                color: 'amber',
              },
            ].map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedHierarchyLevel(tier.id as any)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  selectedHierarchyLevel === tier.id
                    ? 'bg-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{tier.title}</span>
                  {selectedHierarchyLevel === tier.id && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                  )}
                </div>
                <div className="text-[11px] font-mono text-cyan-400 font-medium mb-2">
                  {tier.subtitle}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {tier.detail}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Section 1 Diagram Drawer Toggle */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Eye className="h-4 w-4 text-emerald-400" />
              <span>Reference Figures from Evaluation Architecture</span>
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
                  <Maximize2 className="h-3.5 w-3.5" /> Show Architecture Diagrams (Figures 1-3)
                </>
              )}
            </button>
          </div>

          {showSection1Diagrams && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                <span className="text-[11px] font-mono text-slate-400 block font-semibold">
                  Figure 1: The 4 Evaluation Hierarchy Levels
                </span>
                <Image
                  src={getAssetPath('/images/eval_agent_hierarchy_levels.png')}
                  alt="4 Evaluation Hierarchy Levels: Action, Trajectory, Session, System Outcome"
                  width={600}
                  height={250}
                  unoptimized
                  className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-48"
                />
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                <span className="text-[11px] font-mono text-slate-400 block font-semibold">
                  Figure 2: Tool Selection vs Tool Invocation Check
                </span>
                <Image
                  src={getAssetPath('/images/eval_action_tool_selection_args.png')}
                  alt="Tool selection vs tool invocation checks: Expected 4521 vs Argument 4512"
                  width={600}
                  height={250}
                  unoptimized
                  className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-48"
                />
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                <span className="text-[11px] font-mono text-slate-400 block font-semibold">
                  Figure 3: Action Choice Failure (Booking vs Cancel)
                </span>
                <Image
                  src={getAssetPath('/images/eval_action_booking_fail_example.png')}
                  alt="Pamela & Pepper booking instead of cancellation action failure"
                  width={600}
                  height={250}
                  unoptimized
                  className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-48"
                />
              </div>
            </div>
          )}
        </div>

        {/* INTERACTIVE ACTION/TOOL CALL VALIDATOR */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-emerald-400" /> Interactive Tool Call Inspector
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Test action choices against the four cardinal action checks: Right Tool, Right Arguments, Required Actions, and Prohibited Actions.
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border ${
              currentAction.overallVerdict === 'PASS'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}>
              {currentAction.overallVerdict === 'PASS' ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> ACTION PASSED
                </>
              ) : (
                <>
                  <XCircle className="h-3.5 w-3.5 text-rose-400" /> ACTION FAILED
                </>
              )}
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 block font-semibold">
              Select Preset Evaluation Scenario:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {(Object.keys(actionPresets) as Array<keyof typeof actionPresets>).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedActionPreset(key)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    selectedActionPreset === key
                      ? 'bg-slate-800 border-emerald-500/50 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="font-semibold text-xs mb-1">
                    {actionPresets[key].title}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono truncate">
                    User: &quot;{actionPresets[key].userPrompt}&quot;
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* User Request Context & Agent Invocation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                  <User className="h-3.5 w-3.5 text-amber-400" /> Input Scenario Context
                </span>
                <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Ground Truth
                </span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-400 block">User Request:</span>
                <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-amber-200 text-xs font-mono mt-1">
                  &quot;{currentAction.userPrompt}&quot;
                </div>
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-400 block">System State / Profile:</span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  {currentAction.context}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                  <Terminal className="h-3.5 w-3.5 text-cyan-400" /> Agent Tool Invocation Output
                </span>
                <span className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Under Evaluation
                </span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-400 block">Invoked Tool:</span>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-xs font-bold mt-1">
                  {currentAction.selectedTool}()
                </div>
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-400 block">Arguments Payload:</span>
                <pre className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto mt-1">
                  {currentAction.toolArgs}
                </pre>
              </div>
            </div>
          </div>

          {/* 4 Core Action Checks Evaluation Grid */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono text-slate-400 block font-semibold">
              The 4 Core Action Checkpoints:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Check 1: Right Tool */}
              <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                currentAction.toolCorrect 
                  ? 'bg-emerald-950/20 border-emerald-500/30' 
                  : 'bg-rose-950/20 border-rose-500/30'
              }`}>
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    1. Right Action / Tool?
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    currentAction.toolCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {currentAction.toolCorrect ? 'PASS' : 'FAIL'}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {currentAction.toolReason}
                </p>
              </div>

              {/* Check 2: Right Details */}
              <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                currentAction.argsCorrect 
                  ? 'bg-emerald-950/20 border-emerald-500/30' 
                  : 'bg-rose-950/20 border-rose-500/30'
              }`}>
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    2. Right Details / Arguments?
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    currentAction.argsCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {currentAction.argsCorrect ? 'PASS' : 'FAIL'}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {currentAction.argsReason}
                </p>
              </div>

              {/* Check 3: Required Actions */}
              <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                currentAction.requiredActionPassed 
                  ? 'bg-emerald-950/20 border-emerald-500/30' 
                  : 'bg-rose-950/20 border-rose-500/30'
              }`}>
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    3. Required Actions Satisfied?
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    currentAction.requiredActionPassed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {currentAction.requiredActionPassed ? 'PASS' : 'FAIL'}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {currentAction.requiredActionPassed
                    ? 'All mandatory preconditions and side-effects required for this user intent were triggered.'
                    : 'Mandatory required action was not triggered by the agent.'}
                </p>
              </div>

              {/* Check 4: Prohibited Actions */}
              <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                currentAction.prohibitedActionPassed 
                  ? 'bg-emerald-950/20 border-emerald-500/30' 
                  : 'bg-rose-950/20 border-rose-500/30'
              }`}>
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    4. Prohibited Action Avoided?
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    currentAction.prohibitedActionPassed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {currentAction.prohibitedActionPassed ? 'PASS' : 'FAIL'}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {currentAction.prohibitedReason}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: TRAJECTORY AUDITING (THE 3 CHECKS)                              */}
      {/* ========================================================================= */}
      <section id="section-trajectory-auditing" className="space-y-8 pt-8 border-t border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Workflow className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                Pillar 2: Trajectory Auditing (The 3 Cardinal Checks)
              </h2>
              <p className="text-xs text-slate-400">
                Evaluating the execution path: 1. Required Steps, 2. Correct Order, and 3. Correct Data Propagation
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            Path &amp; Data Flow
          </span>
        </div>

        {/* 3 Trajectory Criteria Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
              <span className="h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40">1</span>
              <span>Required Steps</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Did every required step in the business process happen? Did the agent skip critical authorization, logging, or verification tools?
            </p>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
              <span className="h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40">2</span>
              <span>Correct Order</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Did order-sensitive steps happen in order? For example, did identity verification occur strictly <em>before</em> processing financial transactions?
            </p>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
              <span className="h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40">3</span>
              <span>Correct Propagation</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Did the next step consume returned data from preceding steps? Did it pass the exact extracted amount or customer ID, or hallucinate fresh values?
            </p>
          </div>
        </div>

        {/* Trajectory Diagram Drawer Toggle */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Eye className="h-4 w-4 text-cyan-400" />
              <span>Reference Figure: The 3 Trajectory Requirements</span>
            </div>
            <button
              onClick={() => setShowSection2Diagrams(!showSection2Diagrams)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              {showSection2Diagrams ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" /> Hide Diagram
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" /> Show Figure 4 (Trajectory Checks)
                </>
              )}
            </button>
          </div>

          {showSection2Diagrams && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 block font-semibold">
                Figure 4: The 3 Cardinal Trajectory Checks (Required steps, Correct order, Correct propagation)
              </span>
              <Image
                src={getAssetPath('/images/eval_trajectory_three_checks.png')}
                alt="Trajectory requirements: 1. Required steps, 2. Correct order, 3. Correct propagation"
                width={800}
                height={320}
                unoptimized
                className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-60"
              />
            </div>
          )}
        </div>

        {/* INTERACTIVE TRAJECTORY PIPELINE DEBUGGER */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ListOrdered className="h-4 w-4 text-cyan-400" /> Interactive Execution Trajectory Simulator
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulate how code evaluators trace step dependencies, ordering gates, and data flow pipelines.
              </p>
            </div>
          </div>

          {/* Preset Selector */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 block font-semibold">
              Select Trajectory Test Case:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
              {(Object.keys(trajectoryPresets) as Array<keyof typeof trajectoryPresets>).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedTrajectoryPreset(key)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    selectedTrajectoryPreset === key
                      ? 'bg-slate-800 border-cyan-500/50 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="font-semibold text-xs mb-1">
                    {trajectoryPresets[key].name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono line-clamp-2">
                    {trajectoryPresets[key].description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Trajectory Step Flow Visualization */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-slate-400 block font-semibold">
              Recorded Execution Trace:
            </span>
            <div className="space-y-2">
              {currentTrajectory.steps.map((step, idx) => (
                <div
                  key={step.id}
                  className={`p-3 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs ${
                    step.status === 'pass'
                      ? 'bg-slate-950/90 border-slate-800 text-slate-200'
                      : step.status === 'warning'
                      ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                      : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400 text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-white text-sm">{step.name}()</span>
                      <div className="text-[11px] text-slate-400 font-normal">
                        Input: <code className="text-slate-300">{step.args}</code>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div className="text-[11px]">
                      <span className="text-slate-400 block text-[10px]">Return Value:</span>
                      <code className="text-cyan-300">{step.output}</code>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      step.status === 'pass'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : step.status === 'warning'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {step.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluator Live Checklist for the 3 Criteria */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            <span className="text-xs font-mono text-slate-300 font-bold block">
              Trajectory Evaluator Audit Results:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* Check 1 */}
              <div className={`p-3 rounded-lg border space-y-1 ${
                currentTrajectory.requiredStepsCheck.pass
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-rose-950/20 border-rose-500/30'
              }`}>
                <div className="flex items-center justify-between font-mono font-bold">
                  <span className="text-slate-200">1. Required Steps</span>
                  <span className={currentTrajectory.requiredStepsCheck.pass ? 'text-emerald-400' : 'text-rose-400'}>
                    {currentTrajectory.requiredStepsCheck.pass ? 'PASS' : 'FAIL'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {currentTrajectory.requiredStepsCheck.detail}
                </p>
              </div>

              {/* Check 2 */}
              <div className={`p-3 rounded-lg border space-y-1 ${
                currentTrajectory.orderCheck.pass
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-rose-950/20 border-rose-500/30'
              }`}>
                <div className="flex items-center justify-between font-mono font-bold">
                  <span className="text-slate-200">2. Correct Order</span>
                  <span className={currentTrajectory.orderCheck.pass ? 'text-emerald-400' : 'text-rose-400'}>
                    {currentTrajectory.orderCheck.pass ? 'PASS' : 'FAIL'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {currentTrajectory.orderCheck.detail}
                </p>
              </div>

              {/* Check 3 */}
              <div className={`p-3 rounded-lg border space-y-1 ${
                currentTrajectory.propagationCheck.pass
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-rose-950/20 border-rose-500/30'
              }`}>
                <div className="flex items-center justify-between font-mono font-bold">
                  <span className="text-slate-200">3. Propagation</span>
                  <span className={currentTrajectory.propagationCheck.pass ? 'text-emerald-400' : 'text-rose-400'}>
                    {currentTrajectory.propagationCheck.pass ? 'PASS' : 'FAIL'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {currentTrajectory.propagationCheck.detail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: MULTI-TURN SESSIONS & SIMULATED USERS                           */}
      {/* ========================================================================= */}
      <section id="section-multi-turn-sessions" className="space-y-8 pt-8 border-t border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                Pillar 3: Multi-Turn Conversation Sessions &amp; Simulated Users
              </h2>
              <p className="text-xs text-slate-400">
                Context retention across turns, avoiding context loss and hallucination, and evaluating via Scripted vs Simulated LLM Users
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
            Session Memory
          </span>
        </div>

        {/* Section 3 Diagrams Drawer */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Eye className="h-4 w-4 text-purple-400" />
              <span>Reference Figures: Context Retention &amp; LLM User Simulation</span>
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
                  <Maximize2 className="h-3.5 w-3.5" /> Show Figures 5 &amp; 7
                </>
              )}
            </button>
          </div>

          {showSection3Diagrams && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                <span className="text-[11px] font-mono text-slate-400 block font-semibold">
                  Figure 7: Carrying Context Across Multi-Turn Sessions
                </span>
                <Image
                  src={getAssetPath('/images/eval_session_order_context_turns.png')}
                  alt="Context loss Failure A vs wrong digit Failure B"
                  width={600}
                  height={280}
                  unoptimized
                  className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-56"
                />
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                <span className="text-[11px] font-mono text-slate-400 block font-semibold">
                  Figure 5: Simulated LLM User vs Scripted Evaluator
                </span>
                <Image
                  src={getAssetPath('/images/eval_session_simulated_user_llm.png')}
                  alt="Let simulated LLM user respond to the agent dynamically"
                  width={600}
                  height={280}
                  unoptimized
                  className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-56"
                />
              </div>
            </div>
          )}
        </div>

        {/* INTERACTIVE CONTEXT RETENTION SIMULATOR */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Context Retention across turns */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="h-4 w-4 text-purple-400" /> Multi-Turn Context Carryover
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Earlier Turn: &quot;My order number is 4521&quot; &rarr; Later Turn: &quot;Can you refund it?&quot;
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 font-semibold block">
                Select Agent Response Variant:
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <button
                  onClick={() => setSessionVariant('success')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    sessionVariant === 'success'
                      ? 'bg-purple-950/40 border-purple-500/50 text-purple-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Success
                </button>
                <button
                  onClick={() => setSessionVariant('loss_a')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    sessionVariant === 'loss_a'
                      ? 'bg-rose-950/40 border-rose-500/50 text-rose-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Failure A
                </button>
                <button
                  onClick={() => setSessionVariant('hallucination_b')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    sessionVariant === 'hallucination_b'
                      ? 'bg-rose-950/40 border-rose-500/50 text-rose-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Failure B
                </button>
              </div>
            </div>

            {/* Conversation Flow Display */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200">
                <span className="text-[10px] text-amber-400 font-bold block uppercase">Turn 1 (Earlier) &bull; User:</span>
                &quot;My order number is 4521&quot;
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Turn 1 &bull; Agent:</span>
                &quot;I see order 4521 in our records. How can I assist you with this order today?&quot;
              </div>

              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200">
                <span className="text-[10px] text-amber-400 font-bold block uppercase">Turn 2 (Later) &bull; User:</span>
                &quot;Can you refund it?&quot;
              </div>

              {/* Agent Turn 2 response based on selected variant */}
              <div className={`p-3 rounded-xl border ${
                sessionVariant === 'success'
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
              }`}>
                <span className="text-[10px] font-bold block uppercase mb-1">
                  Turn 2 &bull; Agent Response ({sessionVariant === 'success' ? 'Optimal Memory' : sessionVariant === 'loss_a' ? 'Context Loss' : 'Parameter Hallucination'}):
                </span>
                {sessionVariant === 'success' && (
                  <div>
                    &quot;Certainly. I am verifying customer identity for order 4521 to issue your refund.&quot;
                    <div className="text-[10px] text-emerald-400 mt-1 font-sans">
                      &bull; Successfully carried order 4521 forward from Turn 1 without re-prompting.
                    </div>
                  </div>
                )}
                {sessionVariant === 'loss_a' && (
                  <div>
                    &quot;Sure, I can help with a refund. Could you please provide your order number?&quot;
                    <div className="text-[10px] text-rose-400 mt-1 font-sans">
                      &bull; <strong>Context Loss:</strong> Failed to carry forward order context already given in Turn 1.
                    </div>
                  </div>
                )}
                {sessionVariant === 'hallucination_b' && (
                  <div>
                    &quot;Certainly. Processing refund request for order 4512 now.&quot;
                    <div className="text-[10px] text-rose-400 mt-1 font-sans">
                      &bull; <strong>Digit Corruption / Hallucination:</strong> Recalled 4512 instead of 4521.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Scripted User vs Simulated LLM User */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bot className="h-4 w-4 text-purple-400" /> Scripted User vs Simulated LLM User
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Moving beyond rigid pre-recorded scripts to test dynamic agent conversational abilities.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => setTestingMethod('scripted')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  testingMethod === 'scripted'
                    ? 'bg-slate-800 border-cyan-500/50 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-bold mb-1">A. Scripted User</div>
                <div className="text-[10px] text-slate-400">Static benchmark dataset</div>
              </button>
              <button
                onClick={() => setTestingMethod('simulated_llm')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  testingMethod === 'simulated_llm'
                    ? 'bg-purple-950/40 border-purple-500/50 text-purple-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-bold mb-1">B. Simulated User (LLM)</div>
                <div className="text-[10px] text-purple-400">Dynamic goal-driven persona</div>
              </button>
            </div>

            {testingMethod === 'scripted' ? (
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3 text-xs">
                <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono">
                  <Database className="h-4 w-4" /> Scripted Benchmark Limitations
                </div>
                <ul className="space-y-2 text-slate-300 leading-relaxed list-disc list-inside">
                  <li><strong>Rigid Linear Branches:</strong> If the agent asks for clarification differently, the scripted answer no longer aligns.</li>
                  <li><strong>Zero Adversarial Depth:</strong> Cannot challenge an agent when it makes minor mistakes or prompts for missing info.</li>
                  <li><strong>Good For:</strong> Deterministic regression suites &amp; continuous integration smoke tests.</li>
                </ul>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/20 space-y-3 text-xs">
                <div className="flex items-center gap-2 text-purple-300 font-bold font-mono">
                  <Sparkles className="h-4 w-4" /> Simulated LLM User Architecture
                </div>
                <div className="space-y-2 text-slate-300 leading-relaxed font-sans">
                  <p>
                    The simulated user is initialized with a <strong className="text-white">Customer Goal</strong> (&quot;Get a refund for order 4521 because item was damaged&quot;) and private facts.
                  </p>
                  <p>
                    On every conversation turn, the LLM user chooses its next natural reply based on the agent&apos;s actual question, creating realistic, unconstrained multi-turn stress tests.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-purple-300">
                  LLM Persona &rarr; &quot;I want my money back.&quot; &rarr; Agent &rarr; &quot;Sure. Which order?&quot; &rarr; Dynamic response generated based on customer goal.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: DECOUPLING SYSTEM OUTCOMES FROM TRAJECTORY PROCESS              */}
      {/* ========================================================================= */}
      <section id="section-outcome-vs-process" className="space-y-8 pt-8 border-t border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                Pillar 4: Decoupling System Outcome vs. Trajectory Process
              </h2>
              <p className="text-xs text-slate-400">
                Never conflate end-state results with execution compliance: An outcome can be correct while the process commits critical safety violations
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
            Safety &amp; Compliance
          </span>
        </div>

        {/* The Fundamental Principle Alert */}
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-xs text-amber-200 leading-relaxed space-y-1">
          <div className="font-bold flex items-center gap-2 text-sm text-amber-300">
            <AlertTriangle className="h-4 w-4" /> Core Principle: Keep Outcome and Process Results Strictly Separate
          </div>
          <p>
            Do not just measure the final outcome. The trajectory reveals critical compliance differences: the database refund may succeed (System Outcome = PASS), but the agent may have forgotten the mandatory step of verifying customer identity <em>before</em> issuing the refund (Process Integrity = FAIL).
          </p>
        </div>

        {/* Section 4 Diagram Drawer */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Eye className="h-4 w-4 text-amber-400" />
              <span>Reference Figure: Outcome vs Process Separation</span>
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
                  <Maximize2 className="h-3.5 w-3.5" /> Show Figure 6 (Separate Outcome &amp; Process)
                </>
              )}
            </button>
          </div>

          {showSection4Diagrams && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 block font-semibold">
                Figure 6: Keep outcome and process results separate (Verification after refund example)
              </span>
              <Image
                src={getAssetPath('/images/eval_outcome_vs_trajectory_separate.png')}
                alt="Keep outcome and process results separate: Outcome PASS vs Identity before refund FAIL"
                width={800}
                height={380}
                unoptimized
                className="rounded-lg w-full h-auto object-contain border border-slate-800 max-h-72"
              />
            </div>
          )}
        </div>

        {/* 2x2 CONTINGENCY MATRIX: OUTCOME VS PROCESS */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="h-4 w-4 text-amber-400" /> The 2x2 Outcome vs. Process Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any quadrant to inspect how decoupled evaluators safeguard enterprise deployments.
            </p>
          </div>

          {/* Matrix Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Quadrant 1: Pass Outcome + Pass Process */}
            <button
              onClick={() => setSelectedMatrixCell('pass_pass')}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedMatrixCell === 'pass_pass'
                  ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-emerald-300">Pass Outcome &bull; Pass Process</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">
                  Gold Standard
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Task succeeded via safe, authorized, and compliant sequence.
              </p>
            </button>

            {/* Quadrant 2: Pass Outcome + Fail Process */}
            <button
              onClick={() => setSelectedMatrixCell('pass_fail')}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedMatrixCell === 'pass_fail'
                  ? 'bg-rose-950/40 border-rose-500 ring-1 ring-rose-500/50 shadow-lg'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-rose-300">Pass Outcome &bull; Fail Process</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-mono">
                  Dangerous Hazard
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Money refunded, but identity verification skipped or occurred after payout.
              </p>
            </button>

            {/* Quadrant 3: Fail Outcome + Pass Process */}
            <button
              onClick={() => setSelectedMatrixCell('fail_pass')}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedMatrixCell === 'fail_pass'
                  ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500/50 shadow-lg'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-amber-300">Fail Outcome &bull; Pass Process</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-mono">
                  Safe Rejection
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Outcome denied because customer failed verification challenge. Perfect safety discipline.
              </p>
            </button>

            {/* Quadrant 4: Fail Outcome + Fail Process */}
            <button
              onClick={() => setSelectedMatrixCell('fail_fail')}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedMatrixCell === 'fail_fail'
                  ? 'bg-slate-800 border-slate-600 ring-1 ring-slate-500/50 shadow-lg'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-300">Fail Outcome &bull; Fail Process</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 font-mono">
                  Total Breakdown
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Both external target state and execution steps collapsed.
              </p>
            </button>
          </div>

          {/* Detailed Selected Quadrant Breakdown */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white text-sm">
                {currentMatrix.title}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-900 border border-slate-700 text-cyan-300">
                {currentMatrix.badge}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">
                  System Database Outcome:
                </span>
                <div className="text-slate-200 text-xs">
                  {currentMatrix.systemOutcome}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">
                  Trajectory Process Result:
                </span>
                <div className="text-slate-200 text-xs">
                  {currentMatrix.trajectoryState}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-sans text-xs space-y-1">
              <span className="font-bold text-slate-300 block">Evaluator Verdict:</span>
              <p className="text-slate-400 leading-relaxed">
                {currentMatrix.verdict}
              </p>
              <div className="pt-1 text-cyan-300 font-mono text-[11px]">
                &gt; {currentMatrix.takeaway}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
