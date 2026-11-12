"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { getAssetPath } from '@/lib/asset';
import {
  Layers,
  Sparkles,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Play,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Cpu,
  Clock,
  EyeOff,
  Sliders,
  FileText,
  Search,
  Minimize2,
  Maximize2,
  HelpCircle,
  Layers2
} from 'lucide-react';

export const IntroContextEngineeringVisualizer: React.FC = () => {
  // -------------------------------------------------------------
  // MODAL IMAGE PREVIEW STATE
  // -------------------------------------------------------------
  const [modalImage, setModalImage] = useState<{ src: string; alt: string; title: string } | null>(null);

  // -------------------------------------------------------------
  // SECTION 1: THREE PILLARS STATE
  // -------------------------------------------------------------
  const [activePillar, setActivePillar] = useState<'info' | 'format' | 'time'>('info');
  const [decompMode, setDecompMode] = useState<'naive' | 'decomposed'>('decomposed');
  const [formatMode, setFormatMode] = useState<'raw' | 'formatted'>('formatted');

  // -------------------------------------------------------------
  // SECTION 2: ACCUMULATION LOOP TRACE SIMULATION
  // -------------------------------------------------------------
  const [simStep, setSimStep] = useState<number>(0);

  const simulationSteps = [
    {
      step: 0,
      title: "Step 0: Initial Query & System Prompt",
      badge: "Turn 0",
      description: "User submits a refund request for ticket order 8934. The harness prepares the initial context window with the system prompt and user input.",
      userQuery: "Can I get a refund on my tickets? My order number is 8934.",
      systemPrompt: "You are a helpful customer service agent. You always respond politely and follow company refund policies strictly.",
      activeActor: "Harness & Model",
      tokensAdded: 145,
      totalTokens: 145,
      newBlock: {
        type: "system",
        label: "System Prompt",
        content: "You are a helpful customer service agent. You always respond politely...",
        color: "border-blue-500/40 bg-blue-950/30 text-blue-300"
      },
      secondBlock: {
        type: "user",
        label: "User Prompt",
        content: "Can I get a refund on my tickets? My order number is 8934.",
        color: "border-amber-500/40 bg-amber-950/30 text-amber-300"
      },
      harnessAction: "Harness constructs context and calls LLM.",
      modelThought: "User wants a refund for order 8934. First, I need to look up this order's purchase date and status."
    },
    {
      step: 1,
      title: "Step 1: Order Lookup Tool Invocation",
      badge: "Turn 1 - Tool",
      description: "Model generates tool call `LookupOrder(order_id='8934')`. The harness intercepts the call, executes it against the Orders Database, and returns purchase details.",
      toolInput: {
        tool: "LookupOrder",
        args: { order_id: "8934" }
      },
      toolOutput: {
        order_id: "8934",
        item: "VIP Concert Tickets (2)",
        purchase_date: "2024-05-10",
        days_since_purchase: 30,
        status: "CONFIRMED",
        total_amount: 180.00
      },
      activeActor: "Orders Database",
      tokensAdded: 235,
      totalTokens: 380,
      newBlock: {
        type: "tool-call",
        label: "Tool Input: LookupOrder(8934)",
        content: '{"tool": "LookupOrder", "args": {"order_id": "8934"}}',
        color: "border-rose-500/40 bg-rose-950/30 text-rose-300"
      },
      secondBlock: {
        type: "tool-output",
        label: "Tool Output: Order #8934",
        content: "Order 8934 was purchased 30 days ago. Status: CONFIRMED. Total: $180.00.",
        color: "border-emerald-500/40 bg-emerald-950/30 text-emerald-300"
      },
      harnessAction: "Harness queries Orders DB and injects structured tool response into context window.",
      modelThought: "Order was purchased 30 days ago. Now I need to check the ticket refund policy window to see if 30 days is eligible."
    },
    {
      step: 2,
      title: "Step 2: Policy Knowledge Retrieval",
      badge: "Turn 2 - Policy Retrieval",
      description: "Model outputs reasoning trace and calls `SearchPolicies(category='tickets')`. Harness searches policy documents and injects the 45-day window rule.",
      toolInput: {
        tool: "SearchPolicies",
        args: { category: "tickets", query: "refund policy window" }
      },
      toolOutput: {
        policy_id: "POL-TKT-04",
        policy_window: "45 days from purchase date",
        condition: "Full refund eligible within 45 days. Order is at 30 days -> ELIGIBLE.",
        fee: "$0 processing fee for VIP"
      },
      activeActor: "Policy Data Store",
      tokensAdded: 330,
      totalTokens: 710,
      newBlock: {
        type: "reasoning",
        label: "Reasoning Trace",
        content: "Order 8934 was purchased 30 days ago. I need the refund window policy before I can answer.",
        color: "border-purple-500/40 bg-purple-950/30 text-purple-300"
      },
      secondBlock: {
        type: "tool-output",
        label: "Tool Output: Policies",
        content: "Policy POL-TKT-04: 30 days since purchase, policy window is 45 days. This order is eligible for a refund.",
        color: "border-emerald-500/40 bg-emerald-950/30 text-emerald-300"
      },
      harnessAction: "Harness fetches vector policy match, parses JSON output, and injects into context window.",
      modelThought: "30 days <= 45 days window. Order is eligible! I will execute the refund and confirm to the user."
    },
    {
      step: 3,
      title: "Step 3: Action Execution & Grounded Assistant Output",
      badge: "Turn 3 - Completion",
      description: "Model calls `RefundOrder(8934)` and generates the final assistant response. The user receives a fully verified and polite refund confirmation.",
      toolInput: {
        tool: "RefundOrder",
        args: { order_id: "8934", amount: 180.00, method: "original_payment" }
      },
      assistantResponse: "You are eligible for a refund. I have issued a refund of $180.00 for order 8934 back to your original payment method. Please allow 3-5 business days for it to appear on your statement.",
      activeActor: "LLM Completion",
      tokensAdded: 180,
      totalTokens: 890,
      newBlock: {
        type: "tool-call",
        label: "Tool Input: RefundOrder(8934)",
        content: '{"tool": "RefundOrder", "args": {"order_id": "8934", "amount": 180.00}}',
        color: "border-rose-500/40 bg-rose-950/30 text-rose-300"
      },
      secondBlock: {
        type: "assistant",
        label: "Assistant Response",
        content: "You are eligible for a refund. I have issued it to your original payment method.",
        color: "border-fuchsia-500/40 bg-fuchsia-950/30 text-fuchsia-300"
      },
      harnessAction: "Harness runs transaction tool, verifies completion, and streams final text to user.",
      modelThought: "Task completed successfully. All constraints satisfied."
    }
  ];

  // -------------------------------------------------------------
  // SECTION 3: FAILURE MODES & CONTEXT ROT STATE
  // -------------------------------------------------------------
  const [selectedFailureMode, setSelectedFailureMode] = useState<'poisoning' | 'clash' | 'confusion' | 'distraction' | 'rot'>('poisoning');

  const failureModeData = {
    poisoning: {
      name: "Context Poisoning",
      subtitle: "Incorrect or corrupted information entering context",
      diagramStep: "Step 1: Incorrect Info Injected -> Step 2: Cascading Bad Response",
      color: "rose",
      badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      description: "A single corrupted tool output, false user assumption, or hallucinated calculation is written into the context window. Subsequent reasoning steps treat it as ground truth, cascading into wrong actions.",
      concreteExample: {
        scenario: "Tool `LookupAccountBalance` erroneously returns negative debt of -$4,200 due to a malformed DB query.",
        consequence: "Agent panics, denies legitimate user transaction, and flags account for debt collection.",
        remedy: "Harness post-tool validation hooks, strict JSON schema validation, and sanity assertion checks before writing to context."
      }
    },
    clash: {
      name: "Context Clash",
      subtitle: "Inconsistent or contradictory information in context",
      diagramStep: "Version A (e.g. 15-day refund window) vs Version B (e.g. 45-day refund window)",
      color: "amber",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      description: "Context contains mutually incompatible statements. For example, an earlier tool output cited Policy 2023 (15 days), while a later tool output cited Policy 2024 (45 days). The model arbitrarily chooses one or hallucinates a blend.",
      concreteExample: {
        scenario: "Step 1 policy says 'Tickets refundable up to 15 days'. Step 3 updated policy says 'Tickets refundable up to 45 days'.",
        consequence: "Model rejects an eligible user or flip-flops between two conflicting answers in the same dialogue.",
        remedy: "Context deduplication, timestamp metadata tagging, and active memory invalidation of deprecated state."
      }
    },
    confusion: {
      name: "Context Confusion",
      subtitle: "Ambiguous, overlapping, or poorly specified facts",
      diagramStep: "Version A & Version B overlapping without distinct boundaries",
      color: "yellow",
      badgeColor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      description: "Information lacks disambiguating identifiers or provenance metadata. Two entities share similar names or IDs, causing the LLM attention heads to conflate attributes.",
      concreteExample: {
        scenario: "Customer mentions Order #8934 (Concert Ticket) and Order #8943 (Festival Pass) in the same chat.",
        consequence: "Agent issues refund to the wrong ticket because the tool response didn't clearly bind entity IDs to item types.",
        remedy: "Enforce strict key-value provenance metadata (entity_id, created_at, scope) when formatting tool outputs."
      }
    },
    distraction: {
      name: "Context Distraction",
      subtitle: "Flooding the context with irrelevant, high-token noise",
      diagramStep: "Huge irrelevant payload drowning out tiny relevant signal",
      color: "orange",
      badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      description: "Raw payloads like massive JSON dumps, full HTML documents, or verbose stack traces flood the window. Critical constraints are pushed out or diluted, causing 'lost-in-the-middle' attention failure.",
      concreteExample: {
        scenario: "Harness dumps a 6,000-word raw webpage HTML when the agent only needed a 2-line return policy.",
        consequence: "The LLM skips the return policy buried at line 842 and hallucinates a generic refund answer instead.",
        remedy: "Context compaction: strip HTML tags, extract semantic keys only, and enforce maximum token limits per tool return."
      }
    },
    rot: {
      name: "Context Rot (Capacity Degradation)",
      subtitle: "Performance drop as tokens approach effective context length",
      diagramStep: "Degradation kicks in at 20% - 40% of physical context limit",
      color: "purple",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      description: "Unlike failure modes (which are semantic errors), Context Rot is a capacity limit. Even when 100% of the tokens are correct, models exhibit steep degradation in reasoning fidelity, attention focus, and instruction following past their effective length.",
      concreteExample: {
        scenario: "In a 128k context model, multi-turn tool traces accumulate to 40k tokens (31% capacity).",
        consequence: "Attention degrades; the model begins ignoring negative constraints in the system prompt, latency jumps 4x, and API cost explodes.",
        remedy: "Sliding window compaction, hierarchical summarization, and memory checkpoints to keep active tokens under the effective threshold."
      }
    }
  };

  // -------------------------------------------------------------
  // SECTION 4: HARNESS ARCHITECTURE - TOOLS VS HOOKS STATE
  // -------------------------------------------------------------
  const [hookPermissionOn, setHookPermissionOn] = useState<boolean>(true);
  const [hookSanitizeOn, setHookSanitizeOn] = useState<boolean>(true);
  const [hookAuditOn, setHookAuditOn] = useState<boolean>(true);
  const [harnessSimTriggered, setHarnessSimTriggered] = useState<boolean>(false);

  // -------------------------------------------------------------
  // SECTION 5: KNOWLEDGE CHECK STATE
  // -------------------------------------------------------------
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);

  const quizQuestions = [
    {
      id: 1,
      question: "Which of the following best defines 'Context Rot' compared to 'Context Failure Modes'?",
      options: [
        "Context Rot refers to corrupted data in context, while Failure Modes describe hardware crashes.",
        "Context Rot is degradation in model reasoning as token count passes effective context length (often 20-40%), while Failure Modes are semantic corruptions (poisoning, clash, confusion, distraction) that can happen even in short context.",
        "Context Rot only occurs in local open-weight models, whereas Failure Modes only affect proprietary API models.",
        "Context Rot means the prompt was deleted from memory, while Failure Modes mean tool calls timed out."
      ],
      correctIndex: 1,
      explanation: "Context Rot is a quantitative capacity limit (models degrade well before their physical token limit, around 20-40%), whereas Failure Modes are qualitative errors in the information itself."
    },
    {
      id: 2,
      question: "Why does the agent harness execute 'hooks' that are completely hidden from the LLM?",
      options: [
        "Because LLMs cannot read code written in Python or TypeScript.",
        "To enforce security, permission checks, and token sanitization deterministically without wasting prompt tokens or allowing the LLM to bypass guardrails.",
        "Because hooks are only needed when using SQLite databases.",
        "To deceive the user into thinking the model is faster than it actually is."
      ],
      correctIndex: 1,
      explanation: "Hooks are deterministic harness functions (e.g. check_permission, sanitize_output). They run outside the model's view so the model cannot hallucinate or bypass safety and hygiene policies."
    },
    {
      id: 3,
      question: "An agent is told 'Version 1: Refund window is 15 days' in Step 1, but retrieves 'Version 2: Refund window is 45 days' in Step 3. Which failure mode is this?",
      options: [
        "Context Poisoning",
        "Context Distraction",
        "Context Clash",
        "Context Rot"
      ],
      correctIndex: 2,
      explanation: "Context Clash occurs when incompatible or contradictory versions of information co-exist within the active context window, causing unpredictable agent decisions."
    },
    {
      id: 4,
      question: "Under the 'Right Format' pillar of Context Engineering, what should the harness do before passing a raw 5,000-line JSON database dump to the LLM?",
      options: [
        "Convert the entire JSON into binary hexadecimal code.",
        "Prune redundant fields, extract relevant entities, structure clear metadata, and summarize to maximize signal-to-noise ratio.",
        "Duplicate the JSON 3 times to ensure the LLM pays attention.",
        "Leave it as raw HTML to preserve original DOM structure."
      ],
      correctIndex: 1,
      explanation: "Right Format emphasizes noise reduction: stripping unnecessary fields, extracting critical keys, adding metadata, and formatting data to minimize token consumption and attention dilution."
    }
  ];

  const handleSelectQuiz = (questionId: number, optionIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const getQuizScore = () => {
    let score = 0;
    quizQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.correctIndex) score++;
    });
    return score;
  };

  return (
    <div className="space-y-12">
      {/* ========================================================= */}
      {/* QUICK STICKY ANCHOR NAVIGATION BAR */}
      {/* ========================================================= */}
      <div className="sticky top-2 z-30 bg-slate-950/90 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-2 overflow-x-auto text-xs font-mono">
        <div className="flex items-center gap-1.5 shrink-0 text-indigo-400 font-bold px-2">
          <Bookmark className="h-3.5 w-3.5" />
          <span>Quick Jump:</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="#section-pillars"
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-950/60 hover:text-indigo-300 text-slate-300 transition-colors border border-slate-800"
          >
            1. Three Pillars
          </a>
          <a
            href="#section-accumulation"
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-950/60 hover:text-indigo-300 text-slate-300 transition-colors border border-slate-800"
          >
            2. Accumulation Loop
          </a>
          <a
            href="#section-failure-modes"
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-950/60 hover:text-indigo-300 text-slate-300 transition-colors border border-slate-800"
          >
            3. Failure Modes vs Rot
          </a>
          <a
            href="#section-tools-hooks"
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-950/60 hover:text-indigo-300 text-slate-300 transition-colors border border-slate-800"
          >
            4. Tools vs Hooks
          </a>
          <a
            href="#section-quiz"
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-950/60 hover:text-indigo-300 text-slate-300 transition-colors border border-slate-800"
          >
            5. Knowledge Check
          </a>
        </div>
        <div className="hidden sm:flex items-center gap-2 shrink-0 pl-2 border-l border-slate-800 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Interactive Guide
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: THE THREE PILLARS OF CONTEXT ENGINEERING */}
      {/* ========================================================= */}
      <section id="section-pillars" className="space-y-6 pt-2">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Layers className="h-4 w-4" /> Core Architectural Axiom
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            1. The Three Pillars of Context Engineering
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed max-w-4xl">
            In modern autonomous agent systems, performance is rarely bottlenecked by model capability alone—it is governed by what information is in the context window, how it is structured, and when it arrives.
          </p>
        </div>

        {/* 3 Pillars Card Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pillar 1 */}
          <button
            onClick={() => setActivePillar('info')}
            className={`p-5 rounded-2xl border text-left transition-all space-y-3 cursor-pointer ${
              activePillar === 'info'
                ? 'bg-rose-950/30 border-rose-500/50 shadow-lg shadow-rose-950/30 ring-1 ring-rose-500/30'
                : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-bold">
                Pillar 1
              </span>
              <Search className={`h-5 w-5 ${activePillar === 'info' ? 'text-rose-400' : 'text-slate-500'}`} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Right Information</h3>
              <p className="text-xs text-slate-400 mt-1">
                Decomposing broad queries, leveraging multi-index search, and aggregating from diverse tools.
              </p>
            </div>
            <ul className="text-xs text-slate-300 space-y-1 font-mono pt-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-rose-400 shrink-0" /> Decompose broad into narrow
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-rose-400 shrink-0" /> Multiple search methods
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-rose-400 shrink-0" /> Retrieve from many sources
              </li>
            </ul>
          </button>

          {/* Pillar 2 */}
          <button
            onClick={() => setActivePillar('format')}
            className={`p-5 rounded-2xl border text-left transition-all space-y-3 cursor-pointer ${
              activePillar === 'format'
                ? 'bg-blue-950/30 border-blue-500/50 shadow-lg shadow-blue-950/30 ring-1 ring-blue-500/30'
                : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold">
                Pillar 2
              </span>
              <FileText className={`h-5 w-5 ${activePillar === 'format' ? 'text-blue-400' : 'text-slate-500'}`} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Right Format</h3>
              <p className="text-xs text-slate-400 mt-1">
                Noise reduction, structured metadata annotation, compact schema, and targeted summarization.
              </p>
            </div>
            <ul className="text-xs text-slate-300 space-y-1 font-mono pt-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-blue-400 shrink-0" /> Strip unnecessary tokens
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-blue-400 shrink-0" /> Add provenance metadata
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-blue-400 shrink-0" /> Structured summarization
              </li>
            </ul>
          </button>

          {/* Pillar 3 */}
          <button
            onClick={() => setActivePillar('time')}
            className={`p-5 rounded-2xl border text-left transition-all space-y-3 cursor-pointer ${
              activePillar === 'time'
                ? 'bg-emerald-950/30 border-emerald-500/50 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/30'
                : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                Pillar 3
              </span>
              <Clock className={`h-5 w-5 ${activePillar === 'time' ? 'text-emerald-400' : 'text-slate-500'}`} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Right Time</h3>
              <p className="text-xs text-slate-400 mt-1">
                Dynamic state persistence, just-in-time injection, memory mutation, and avoiding premature clutter.
              </p>
            </div>
            <ul className="text-xs text-slate-300 space-y-1 font-mono pt-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" /> Store state to memory
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" /> Mutate memory on change
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" /> Just-in-time injection
              </li>
            </ul>
          </button>
        </div>

        {/* Interactive Deep-Dive Explorer per Pillar */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-5">
          {activePillar === 'info' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="text-base font-bold text-rose-300 flex items-center gap-2">
                    <Search className="h-4 w-4" /> Interactive Simulation: Query Decomposition
                  </h4>
                  <p className="text-xs text-slate-400">
                    Compare single-shot monolithic search against decomposed parallel sourcing.
                  </p>
                </div>
                <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-mono">
                  <button
                    onClick={() => setDecompMode('naive')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      decompMode === 'naive' ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Naive Broad Query
                  </button>
                  <button
                    onClick={() => setDecompMode('decomposed')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      decompMode === 'decomposed' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Decomposed Context Strategy
                  </button>
                </div>
              </div>

              {decompMode === 'naive' ? (
                <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-3 font-mono text-xs">
                  <div className="text-rose-300 font-bold">Query: &quot;Can order 8934 get refund ticket policy customer status&quot;</div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-400 space-y-2">
                    <div className="text-rose-400">❌ Problem: Semantic dilution &amp; index mismatch.</div>
                    <p className="font-sans text-xs text-slate-300">
                      The search engine retrieves 50 irrelevant results because the query blends order IDs, policies, and customer status into one unindexed string. The context window is flooded with noise.
                    </p>
                    <div className="flex items-center gap-3 pt-2 text-[11px]">
                      <span className="text-slate-500">Precision: <strong className="text-rose-400">18%</strong></span>
                      <span className="text-slate-500">Noise Tokens: <strong className="text-rose-400">~3,400</strong></span>
                      <span className="text-slate-500">Failure Risk: <strong className="text-rose-400">High (Distraction)</strong></span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-3 font-mono text-xs">
                  <div className="text-emerald-300 font-bold">Decomposed into 3 Specialized Atomic Retrieval Paths:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="p-3 bg-slate-950 rounded-lg border border-emerald-500/20 space-y-1">
                      <div className="text-emerald-400 font-semibold">1. Orders DB Lookup</div>
                      <code className="text-[11px] text-slate-300 block">Orders.get(order_id=&quot;8934&quot;)</code>
                      <span className="text-[10px] text-slate-400 block font-sans">Targeted row lookup: 30 days since purchase</span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-lg border border-emerald-500/20 space-y-1">
                      <div className="text-emerald-400 font-semibold">2. Policy Vector Search</div>
                      <code className="text-[11px] text-slate-300 block">Policies.search(&quot;ticket refund window&quot;)</code>
                      <span className="text-[10px] text-slate-400 block font-sans">Exact clause match: 45 days window limit</span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-lg border border-emerald-500/20 space-y-1">
                      <div className="text-emerald-400 font-semibold">3. Deterministic Delta</div>
                      <code className="text-[11px] text-slate-300 block">Delta = today - purchase_date</code>
                      <span className="text-[10px] text-slate-400 block font-sans">Evaluated in harness: 30 &le; 45 &rarr; Eligible</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                    <span>Precision: <strong className="text-emerald-400">99.2%</strong></span>
                    <span>Tokens Injected: <strong className="text-emerald-400">140 tokens</strong> (95% token savings)</span>
                    <span>Accuracy: <strong className="text-emerald-400">Deterministic</strong></span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activePillar === 'format' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="text-base font-bold text-blue-300 flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Interactive Simulation: Token Compaction &amp; Formatting
                  </h4>
                  <p className="text-xs text-slate-400">
                    Observe how stripping raw boilerplate and formatting metadata preserves 100% signal while drastically reducing token cost.
                  </p>
                </div>
                <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-mono">
                  <button
                    onClick={() => setFormatMode('raw')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      formatMode === 'raw' ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Raw API Dump (Noisy)
                  </button>
                  <button
                    onClick={() => setFormatMode('formatted')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      formatMode === 'formatted' ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Context-Engineered Payload
                  </button>
                </div>
              </div>

              {formatMode === 'raw' ? (
                <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-rose-300">
                    <span className="font-bold">Raw Backend Response (HTTP 200)</span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">Token Cost: 680 tokens</span>
                  </div>
                  <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-400 overflow-x-auto text-[11px] leading-relaxed">
{`{
  "status": "success",
  "_internal_trace_id": "req-9884-fa00129",
  "server_headers": { "cache-control": "no-cache", "x-runtime": "0.012s", "edge": "iad-1" },
  "schema_version": "v3.1.0",
  "data": {
    "order": {
      "db_id": 994218,
      "public_reference_key": "8934",
      "customer_fk": "cust_88203",
      "created_at_epoch": 1715347200,
      "items": [
        { "sku": "TKT-VIP-CONCERT", "name": "VIP Concert Ticket", "price_cents": 18000, "currency": "USD" }
      ],
      "payment_log": { "gateway": "stripe_v2", "auth_code": "ch_39f20104", "risk_score": 0.01 }
    }
  }
}`}
                  </pre>
                  <div className="text-[11px] text-rose-400 font-sans">
                    ⚠️ 85% of this payload is infrastructure noise (epoch timestamps, internal trace IDs, payment gateway hashes) that will distract attention and increase inference latency.
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-950/20 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-blue-300">
                    <span className="font-bold">Context-Engineered Token Formatter Output</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Token Cost: 62 tokens (91% reduction)</span>
                  </div>
                  <pre className="p-3 bg-slate-950 rounded-lg border border-blue-500/30 text-emerald-300 overflow-x-auto text-[11px] leading-relaxed">
{`# ORDER DETAILS [Verified via Orders DB]
- Order ID: 8934
- Item: VIP Concert Ticket (Qty: 1)
- Amount: $180.00 USD
- Purchase Date: 2024-05-10 (30 days ago)
- Status: Confirmed / Paid`}
                  </pre>
                  <div className="text-[11px] text-blue-300 font-sans">
                    ✨ Clean markdown key-value formatting with zero extraneous headers. The model can instantly extract facts without token bloat.
                  </div>
                </div>
              )}
            </div>
          )}

          {activePillar === 'time' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-emerald-300 flex items-center gap-2">
                <Clock className="h-4 w-4" /> Pillar 3: Right Time (Just-in-Time Injection vs Eager Bloat)
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Injecting every rule, database table, and user profile at Turn 0 creates immediate Context Rot. Instead, the harness operates on a <strong>Just-in-Time (JIT)</strong> retrieval protocol:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-indigo-400 font-bold uppercase block">Stage 1: Intent</span>
                  <div className="text-white font-semibold">User Asks for Refund</div>
                  <p className="text-[11px] font-sans text-slate-400">Context contains only System Prompt + User Query. Tools are exposed via schemas.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-amber-400 font-bold uppercase block">Stage 2: Tool Call</span>
                  <div className="text-white font-semibold">Order Fetched Dynamically</div>
                  <p className="text-[11px] font-sans text-slate-400">Order facts enter context only after model decides it needs order metadata.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase block">Stage 3: JIT Policy</span>
                  <div className="text-white font-semibold">Ticket Policy Injected</div>
                  <p className="text-[11px] font-sans text-slate-400">Policy window injected right before decision, then archived to episodic memory.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Diagram 1 Presentation Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                Figure 1
              </span>
              <span className="text-sm font-bold text-white">
                Context Engineering Pillars: Right Info, Right Format, Right Time
              </span>
            </div>
            <button
              onClick={() => setModalImage({
                src: getAssetPath('/images/ctx_intro_three_pillars.png'),
                alt: 'Context Engineering Three Pillars',
                title: 'Figure 1: Context Engineering Three Pillars'
              })}
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800"
            >
              <Maximize2 className="h-3.5 w-3.5" /> Fullscreen
            </button>
          </div>

          <div
            onClick={() => setModalImage({
              src: getAssetPath('/images/ctx_intro_three_pillars.png'),
              alt: 'Context Engineering Three Pillars',
              title: 'Figure 1: Context Engineering Three Pillars'
            })}
            className="cursor-pointer group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-2 flex justify-center"
          >
            <Image
              src={getAssetPath('/images/ctx_intro_three_pillars.png')}
              alt="Context Engineering Three Pillars: Right Information, Right Format, Right Time"
              width={900}
              height={400}
              unoptimized
              className="rounded-lg object-contain max-h-72 w-auto group-hover:scale-[1.01] transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-indigo-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="px-3 py-1.5 rounded-lg bg-slate-950/90 text-xs font-mono text-white border border-indigo-500/40 shadow-xl flex items-center gap-1.5">
                <Maximize2 className="h-3.5 w-3.5 text-indigo-400" /> Click to Inspect Full Diagram
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: CONTEXT ACCUMULATION ARCHITECTURE */}
      {/* ========================================================= */}
      <section id="section-accumulation" className="space-y-6 pt-4">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Cpu className="h-4 w-4" /> Multi-Turn Execution Trace
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            2. Context Accumulates During a Task
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed max-w-4xl">
            In an agentic loop, the context window is not static. It grows incrementally with user messages, system rules, tool calls, structured outputs, and chain-of-thought traces orchestrated by the <strong>Agent Harness</strong>.
          </p>
        </div>

        {/* Step-by-Step Interactive Execution Trace Simulation */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase">
                Interactive Multi-Step Simulator: Ticket Refund (Order #8934)
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {simulationSteps[simStep].title}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSimStep(prev => Math.max(0, prev - 1))}
                disabled={simStep === 0}
                className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-mono text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Previous Step
              </button>
              <button
                onClick={() => setSimStep(prev => Math.min(simulationSteps.length - 1, prev + 1))}
                disabled={simStep === simulationSteps.length - 1}
                className="px-3.5 py-1.5 rounded-xl border border-indigo-500/40 bg-indigo-600/20 text-xs font-mono text-indigo-300 hover:bg-indigo-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-bold flex items-center gap-1.5"
              >
                Next Step <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setSimStep(0)}
                className="p-1.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-colors"
                title="Reset simulation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="grid grid-cols-4 gap-2">
            {simulationSteps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setSimStep(idx)}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                  simStep === idx
                    ? 'border-indigo-500 bg-indigo-950/40 shadow-md'
                    : idx < simStep
                    ? 'border-emerald-500/30 bg-emerald-950/10 text-slate-300'
                    : 'border-slate-800 bg-slate-900/40 text-slate-500 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className={simStep === idx ? 'text-indigo-400 font-bold' : idx < simStep ? 'text-emerald-400' : 'text-slate-500'}>
                    Step {idx}
                  </span>
                  {idx < simStep && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                </div>
                <div className="text-xs font-bold truncate text-white mt-1">
                  {idx === 0 ? "Initial Prompt" : idx === 1 ? "Lookup Order" : idx === 2 ? "Policy Search" : "Issue Refund"}
                </div>
              </button>
            ))}
          </div>

          {/* Live Context Window Stack vs Harness Operation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Live Context Window Stack (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-indigo-400" /> Live Context Window Content
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  Tokens: <strong className="text-indigo-400">{simulationSteps[simStep].totalTokens}</strong> / 8,192
                </span>
              </div>

              {/* Token Bar Meter */}
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(simulationSteps[simStep].totalTokens / 8192) * 100}%` }}
                />
              </div>

              {/* Stacked Window Blocks */}
              <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-3 max-h-96 overflow-y-auto">
                {/* Always active step 0 blocks */}
                <div className="p-2.5 rounded-lg border border-blue-500/40 bg-blue-950/20 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-blue-400 font-bold uppercase">
                    <span>System Prompt</span>
                    <span>105 tokens</span>
                  </div>
                  <p className="text-slate-300">{simulationSteps[0].systemPrompt}</p>
                </div>

                <div className="p-2.5 rounded-lg border border-amber-500/40 bg-amber-950/20 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold uppercase">
                    <span>User Prompt</span>
                    <span>40 tokens</span>
                  </div>
                  <p className="text-slate-200">{simulationSteps[0].userQuery}</p>
                </div>

                {/* Step 1 Blocks */}
                {simStep >= 1 && (
                  <>
                    <div className="p-2.5 rounded-lg border border-rose-500/40 bg-rose-950/20 text-xs font-mono space-y-1 animate-fadeIn">
                      <div className="flex items-center justify-between text-[10px] text-rose-400 font-bold uppercase">
                        <span>Tool Input: LookupOrder()</span>
                        <span>35 tokens</span>
                      </div>
                      <code className="text-rose-200 text-[11px] block">{JSON.stringify(simulationSteps[1].toolInput)}</code>
                    </div>

                    <div className="p-2.5 rounded-lg border border-emerald-500/40 bg-emerald-950/20 text-xs font-mono space-y-1 animate-fadeIn">
                      <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold uppercase">
                        <span>Tool Output: Orders DB</span>
                        <span>200 tokens</span>
                      </div>
                      <p className="text-emerald-200 text-[11px]">
                        Order 8934: Purchase Date 2024-05-10 (30 days ago). Amount: $180.00. Status: CONFIRMED.
                      </p>
                    </div>
                  </>
                )}

                {/* Step 2 Blocks */}
                {simStep >= 2 && (
                  <>
                    <div className="p-2.5 rounded-lg border border-purple-500/40 bg-purple-950/20 text-xs font-mono space-y-1 animate-fadeIn">
                      <div className="flex items-center justify-between text-[10px] text-purple-400 font-bold uppercase">
                        <span>Reasoning Trace</span>
                        <span>80 tokens</span>
                      </div>
                      <p className="text-purple-200 text-[11px] italic">
                        &quot;Order 8934 was purchased 30 days ago. I need the refund window before I can answer.&quot;
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg border border-rose-500/40 bg-rose-950/20 text-xs font-mono space-y-1 animate-fadeIn">
                      <div className="flex items-center justify-between text-[10px] text-rose-400 font-bold uppercase">
                        <span>Tool Input: SearchPolicies()</span>
                        <span>40 tokens</span>
                      </div>
                      <code className="text-rose-200 text-[11px] block">{JSON.stringify(simulationSteps[2].toolInput)}</code>
                    </div>

                    <div className="p-2.5 rounded-lg border border-emerald-500/40 bg-emerald-950/20 text-xs font-mono space-y-1 animate-fadeIn">
                      <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold uppercase">
                        <span>Tool Output: Policies DB</span>
                        <span>210 tokens</span>
                      </div>
                      <p className="text-emerald-200 text-[11px]">
                        Policy POL-TKT-04: 30 days since purchase, policy window is 45 days. This order is eligible for a refund.
                      </p>
                    </div>
                  </>
                )}

                {/* Step 3 Blocks */}
                {simStep >= 3 && (
                  <>
                    <div className="p-2.5 rounded-lg border border-fuchsia-500/40 bg-fuchsia-950/20 text-xs font-mono space-y-1 animate-fadeIn">
                      <div className="flex items-center justify-between text-[10px] text-fuchsia-400 font-bold uppercase">
                        <span>Assistant Response</span>
                        <span>95 tokens</span>
                      </div>
                      <p className="text-fuchsia-200 text-[11px] font-sans font-medium">
                        &quot;You are eligible for a refund. I have issued it to your original payment method.&quot;
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right: Harness & Model Co-Execution Inspector (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Terminal className="h-4 w-4 text-emerald-400" /> Harness &amp; Model Orchestration
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">Active Actor</span>
                  <div className="text-indigo-300 font-mono font-bold text-sm">
                    {simulationSteps[simStep].activeActor}
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-2 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">Harness Action</span>
                  <p className="text-slate-300 font-sans leading-relaxed">
                    {simulationSteps[simStep].harnessAction}
                  </p>
                </div>

                <div className="border-t border-slate-800 pt-2 space-y-1">
                  <span className="text-[10px] font-mono text-purple-400 uppercase block font-semibold">Model Internal Reasoning</span>
                  <p className="text-purple-200 font-sans italic bg-purple-950/30 p-2.5 rounded-lg border border-purple-500/20">
                    &quot;{simulationSteps[simStep].modelThought}&quot;
                  </p>
                </div>

                <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Step Tokens Added: <strong className="text-white">+{simulationSteps[simStep].tokensAdded}</strong></span>
                  <span>Cumulative: <strong className="text-indigo-400">{simulationSteps[simStep].totalTokens}</strong></span>
                </div>
              </div>

              {/* Callout */}
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 font-sans leading-relaxed">
                💡 <strong>Key Takeaway:</strong> The model never talks directly to databases. The harness receives model intent via structured JSON function calls, queries systems securely, and injects validated results.
              </div>
            </div>
          </div>
        </div>

        {/* Diagram 2 Presentation Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                Figure 2
              </span>
              <span className="text-sm font-bold text-white">
                Context Accumulates During a Task (User, Harness, Tools, Policies, Model)
              </span>
            </div>
            <button
              onClick={() => setModalImage({
                src: getAssetPath('/images/ctx_intro_accumulation_loop.png'),
                alt: 'Context Accumulates During a Task',
                title: 'Figure 2: Context Accumulation Architecture'
              })}
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800"
            >
              <Maximize2 className="h-3.5 w-3.5" /> Fullscreen
            </button>
          </div>

          <div
            onClick={() => setModalImage({
              src: getAssetPath('/images/ctx_intro_accumulation_loop.png'),
              alt: 'Context Accumulates During a Task',
              title: 'Figure 2: Context Accumulation Architecture'
            })}
            className="cursor-pointer group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-2 flex justify-center"
          >
            <Image
              src={getAssetPath('/images/ctx_intro_accumulation_loop.png')}
              alt="Context Accumulates During a Task Diagram"
              width={900}
              height={450}
              unoptimized
              className="rounded-lg object-contain max-h-80 w-auto group-hover:scale-[1.01] transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-indigo-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="px-3 py-1.5 rounded-lg bg-slate-950/90 text-xs font-mono text-white border border-indigo-500/40 shadow-xl flex items-center gap-1.5">
                <Maximize2 className="h-3.5 w-3.5 text-indigo-400" /> Click to Inspect Full Diagram
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: FAILURE MODES & CONTEXT ROT */}
      {/* ========================================================= */}
      <section id="section-failure-modes" className="space-y-6 pt-4">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="h-4 w-4" /> Fragility &amp; Degradation
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            3. Context Failure Modes vs. Context Rot
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed max-w-4xl">
            When agent systems break down, failures stem from two fundamentally distinct root causes: <strong>qualitative semantic corruption</strong> (Failure Modes) vs. <strong>quantitative capacity exhaustion</strong> (Context Rot).
          </p>
        </div>

        {/* Failure Modes & Rot Switcher Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono font-semibold">
          <button
            onClick={() => setSelectedFailureMode('poisoning')}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
              selectedFailureMode === 'poisoning'
                ? 'bg-rose-950/40 border-rose-500 text-rose-300 shadow-md ring-1 ring-rose-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            1. Poisoning
          </button>
          <button
            onClick={() => setSelectedFailureMode('clash')}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
              selectedFailureMode === 'clash'
                ? 'bg-amber-950/40 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            2. Clash
          </button>
          <button
            onClick={() => setSelectedFailureMode('confusion')}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
              selectedFailureMode === 'confusion'
                ? 'bg-yellow-950/40 border-yellow-500 text-yellow-300 shadow-md ring-1 ring-yellow-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            3. Confusion
          </button>
          <button
            onClick={() => setSelectedFailureMode('distraction')}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
              selectedFailureMode === 'distraction'
                ? 'bg-orange-950/40 border-orange-500 text-orange-300 shadow-md ring-1 ring-orange-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            4. Distraction
          </button>
          <button
            onClick={() => setSelectedFailureMode('rot')}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer col-span-2 sm:col-span-1 ${
              selectedFailureMode === 'rot'
                ? 'bg-purple-950/40 border-purple-500 text-purple-300 shadow-md ring-1 ring-purple-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            ⚡ Context Rot
          </button>
        </div>

        {/* Selected Failure Mode Card */}
        {(() => {
          const item = failureModeData[selectedFailureMode];
          return (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className={`text-xs font-mono px-2.5 py-0.5 rounded border font-bold ${item.badgeColor}`}>
                    {selectedFailureMode === 'rot' ? 'Capacity Issue' : 'Semantic Failure Mode'}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1.5">{item.name}</h3>
                  <p className="text-xs text-slate-400">{item.subtitle}</p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                  {item.diagramStep}
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {item.description}
              </p>

              {/* Concrete Scenario Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs pt-1">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-rose-400 font-bold uppercase block">What Triggers It</span>
                  <p className="text-slate-300 font-sans text-xs">{item.concreteExample.scenario}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold uppercase block">Agent Impact</span>
                  <p className="text-slate-300 font-sans text-xs">{item.concreteExample.consequence}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase block">Context Eng Remedy</span>
                  <p className="text-slate-300 font-sans text-xs">{item.concreteExample.remedy}</p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Deep Dive Matrix: Context Rot vs Failure Modes */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-purple-400 font-bold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
              Comparative Matrix
            </span>
            <h3 className="text-lg font-bold text-white">
              Context Rot vs. Context Failure Modes (Two Different Issues)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-2.5 px-3">Dimension</th>
                  <th className="py-2.5 px-3 text-purple-400 font-bold">Context Rot</th>
                  <th className="py-2.5 px-3 text-rose-400 font-bold">Context Failure Modes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans text-slate-300">
                <tr>
                  <td className="py-3 px-3 font-mono text-slate-400 font-semibold">Root Problem</td>
                  <td className="py-3 px-3">
                    Model accepts tokens up to physical length, but cannot reliably utilize tokens past effective length.
                  </td>
                  <td className="py-3 px-3">
                    Information written inside the context is factually incorrect, contradictory, ambiguous, or irrelevant.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-mono text-slate-400 font-semibold">What Goes Wrong</td>
                  <td className="py-3 px-3">
                    Loss of attention focus, needle-in-haystack blindness, slower responses, and quadratic inference cost.
                  </td>
                  <td className="py-3 px-3">
                    Agent provides wrong answers, follows outdated rules, or executes hazardous unauthorized tools.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-mono text-slate-400 font-semibold">When It Happens</td>
                  <td className="py-3 px-3">
                    Empirically kicks in around <strong>20% – 40%</strong> of nominal context window length.
                  </td>
                  <td className="py-3 px-3">
                    Can happen in <strong>short contexts (Turn 1)</strong>, but probability compounds as conversations lengthen.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-mono text-slate-400 font-semibold">Primary Fix</td>
                  <td className="py-3 px-3 text-purple-300 font-mono text-[11px]">
                    Sliding window, token budgeting, hierarchical summarization, semantic pruning.
                  </td>
                  <td className="py-3 px-3 text-rose-300 font-mono text-[11px]">
                    Harness hooks, metadata validation, deduplication, JSON schema gating.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Diagrams Presentation Grid (Figure 3 & Figure 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Figure 3 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 font-bold">Figure 3: Context Failure Modes</span>
              <button
                onClick={() => setModalImage({
                  src: getAssetPath('/images/ctx_intro_failure_modes.png'),
                  alt: 'Context Failure Modes: Poisoning, Clash, Confusion, Distraction',
                  title: 'Figure 3: Context Failure Modes'
                })}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
              >
                <Maximize2 className="h-3 w-3" /> Zoom
              </button>
            </div>
            <div
              onClick={() => setModalImage({
                src: getAssetPath('/images/ctx_intro_failure_modes.png'),
                alt: 'Context Failure Modes',
                title: 'Figure 3: Context Failure Modes'
              })}
              className="cursor-pointer group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-2 flex justify-center"
            >
              <Image
                src={getAssetPath('/images/ctx_intro_failure_modes.png')}
                alt="Context Failure Modes Diagram"
                width={500}
                height={260}
                unoptimized
                className="rounded-lg object-contain max-h-52 w-auto group-hover:scale-[1.01] transition-transform"
              />
            </div>
          </div>

          {/* Figure 4 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 font-bold">Figure 4: Context Rot vs Failure Modes</span>
              <button
                onClick={() => setModalImage({
                  src: getAssetPath('/images/ctx_intro_rot_vs_failure_modes.png'),
                  alt: 'Context Rot vs Context Failure Modes',
                  title: 'Figure 4: Context Rot vs Context Failure Modes'
                })}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
              >
                <Maximize2 className="h-3 w-3" /> Zoom
              </button>
            </div>
            <div
              onClick={() => setModalImage({
                src: getAssetPath('/images/ctx_intro_rot_vs_failure_modes.png'),
                alt: 'Context Rot vs Context Failure Modes',
                title: 'Figure 4: Context Rot vs Context Failure Modes'
              })}
              className="cursor-pointer group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-2 flex justify-center"
            >
              <Image
                src={getAssetPath('/images/ctx_intro_rot_vs_failure_modes.png')}
                alt="Context Rot vs Context Failure Modes Comparison Table"
                width={500}
                height={260}
                unoptimized
                className="rounded-lg object-contain max-h-52 w-auto group-hover:scale-[1.01] transition-transform"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: AGENT HARNESSES — TOOLS VS HOOKS */}
      {/* ========================================================= */}
      <section id="section-tools-hooks" className="space-y-6 pt-4">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Sliders className="h-4 w-4" /> Orchestration Mechanics
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            4. Components of Agent Harnesses: Tools vs. Hooks
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed max-w-4xl">
            An <strong>Agent Harness</strong> is the runtime execution harness that wraps the model. It controls tool invocations, manages context mutations, and enforces deterministic guardrails through <strong>Hooks</strong> that are completely invisible to the LLM.
          </p>
        </div>

        {/* Hook Visibility Boundary Callout */}
        <div className="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-300 font-mono">
              <EyeOff className="h-4 w-4 text-indigo-400" /> Crucial Architectural Insight: The Hook Visibility Boundary
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              The System Prompt provided to the LLM contains full schemas and descriptions for <strong>Tools</strong>. However, there are <strong>ZERO descriptions of Hooks</strong> in the context window. Hooks run strictly within the harness runtime.
            </p>
          </div>
          <span className="shrink-0 text-xs font-mono px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold">
            Invisible to Model
          </span>
        </div>

        {/* Tools vs Hooks Interactive Matrix */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
            <Layers2 className="h-4 w-4 text-indigo-400" /> Building Block Comparison: Tools vs. Hooks
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Tools Block */}
            <div className="p-4 rounded-xl border border-indigo-500/30 bg-slate-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-indigo-300 font-mono">🛠️ Tools</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Model-Driven</span>
              </div>
              <div className="space-y-2 text-slate-300 font-sans">
                <div>
                  <strong className="text-white block font-mono text-[11px]">Examples:</strong>
                  <code className="text-indigo-300 text-[11px]">search_policies, order_lookup, refund_order, cancel_order</code>
                </div>
                <div>
                  <strong className="text-white block font-mono text-[11px]">When It Runs:</strong>
                  <p className="text-slate-400">Visible to the model; the model explicitly chooses which one to call and supplies arguments.</p>
                </div>
                <div>
                  <strong className="text-white block font-mono text-[11px]">How It&apos;s Used:</strong>
                  <p className="text-slate-400">Expands agent capability to read databases, execute API mutations, or search the web.</p>
                </div>
              </div>
            </div>

            {/* Hooks Block */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-slate-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-emerald-300 font-mono">🪝 Hooks</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Harness-Driven</span>
              </div>
              <div className="space-y-2 text-slate-300 font-sans">
                <div>
                  <strong className="text-white block font-mono text-[11px]">Examples:</strong>
                  <code className="text-emerald-300 text-[11px]">check_permission, check_current, sanitize_output, rate_limiter</code>
                </div>
                <div>
                  <strong className="text-white block font-mono text-[11px]">When It Runs:</strong>
                  <p className="text-slate-400"><strong>Not visible to the model</strong>; fired deterministically by the harness before or after a tool runs.</p>
                </div>
                <div>
                  <strong className="text-white block font-mono text-[11px]">How It&apos;s Used:</strong>
                  <p className="text-slate-400">Enforces safety, blocks unauthorized mutations, prunes bloated token payloads, and guarantees audit trails.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Hook Guardrails Sandbox */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
                <Terminal className="h-4 w-4 text-emerald-400" /> Interactive Harness Sandbox: Toggle Guardrail Hooks
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulate an agent attempting a high-risk tool call: <code className="text-indigo-300">RefundOrder(order_id=&quot;8934&quot;, amount=$4,500.00)</code>
              </p>
            </div>
            <button
              onClick={() => setHarnessSimTriggered(!harnessSimTriggered)}
              className="px-3.5 py-1.5 rounded-xl border border-indigo-500/40 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="h-3.5 w-3.5" /> Re-Run Execution
            </button>
          </div>

          {/* Toggle Switches */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <button
              onClick={() => setHookPermissionOn(!hookPermissionOn)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                hookPermissionOn
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                  : 'border-rose-500/30 bg-rose-950/20 text-rose-300'
              }`}
            >
              <div>
                <span className="block font-bold">pre_tool: check_permission</span>
                <span className="text-[10px] text-slate-400 block font-sans">Auth &amp; max amount check</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${hookPermissionOn ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                {hookPermissionOn ? 'ACTIVE' : 'BYPASSED'}
              </span>
            </button>

            <button
              onClick={() => setHookSanitizeOn(!hookSanitizeOn)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                hookSanitizeOn
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                  : 'border-rose-500/30 bg-rose-950/20 text-rose-300'
              }`}
            >
              <div>
                <span className="block font-bold">post_tool: sanitize_output</span>
                <span className="text-[10px] text-slate-400 block font-sans">Compress 4k DB tokens to 80</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${hookSanitizeOn ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                {hookSanitizeOn ? 'ACTIVE' : 'BYPASSED'}
              </span>
            </button>

            <button
              onClick={() => setHookAuditOn(!hookAuditOn)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                hookAuditOn
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                  : 'border-rose-500/30 bg-rose-950/20 text-rose-300'
              }`}
            >
              <div>
                <span className="block font-bold">post_tool: check_current</span>
                <span className="text-[10px] text-slate-400 block font-sans">Verify policy window fresh</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${hookAuditOn ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                {hookAuditOn ? 'ACTIVE' : 'BYPASSED'}
              </span>
            </button>
          </div>

          {/* Execution Result Box */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span>Harness Execution Pipeline Outcome:</span>
              {!hookPermissionOn ? (
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" /> High Risk Failure
                </span>
              ) : !hookSanitizeOn ? (
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Context Bloat Warning
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Safe &amp; Clean Execution
                </span>
              )}
            </div>

            {!hookPermissionOn ? (
              <div className="space-y-2 text-rose-300 bg-rose-950/20 p-3 rounded-lg border border-rose-500/30">
                <div className="font-bold">❌ Catastrophic Risk: Tool Dispatched Without Pre-Tool Validation</div>
                <p className="font-sans text-slate-300 text-xs">
                  The model attempted to refund $4,500.00 (which exceeds the customer&apos;s $180 order limit). Because the <code className="text-rose-300">pre_tool check_permission</code> hook was disabled, the call executed directly against the Stripe gateway.
                </p>
              </div>
            ) : !hookSanitizeOn ? (
              <div className="space-y-2 text-amber-300 bg-amber-950/20 p-3 rounded-lg border border-amber-500/30">
                <div className="font-bold">⚠️ Warning: Context Distraction &amp; Rot Hazard</div>
                <p className="font-sans text-slate-300 text-xs">
                  Tool succeeded, but returned <strong>4,200 raw database debug tokens</strong> directly into the context window. The agent now risks attention degradation and token cost spikes.
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-emerald-300 bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/30">
                <div className="font-bold">✅ Deterministic Interception &amp; Safe Context Mutation</div>
                <p className="font-sans text-slate-300 text-xs">
                  1. <code className="text-emerald-300">pre_tool hook</code> verified user identity and clamped refund to actual purchase price ($180).<br />
                  2. Tool executed safely against Orders backend.<br />
                  3. <code className="text-emerald-300">post_tool hook</code> pruned raw headers and injected a clean 75-token markdown payload into the context window.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Diagrams Presentation: 2 in top row, 1 with richer information in its own row */}
        <div className="space-y-4">
          {/* Row 1: 2 figures in a row (Figure 5 & Figure 7) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Tool Output Diagram */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 font-bold">Figure 5: Tool Output Structure</span>
                <button
                  onClick={() => setModalImage({
                    src: getAssetPath('/images/ctx_intro_tool_output.png'),
                    alt: 'Tool Output Context Injection',
                    title: 'Figure 5: Tool Output in Context Window'
                  })}
                  className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <Maximize2 className="h-3 w-3" /> Zoom
                </button>
              </div>
              <div
                onClick={() => setModalImage({
                  src: getAssetPath('/images/ctx_intro_tool_output.png'),
                  alt: 'Tool Output Context Injection',
                  title: 'Figure 5: Tool Output in Context Window'
                })}
                className="cursor-pointer group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-2 flex justify-center"
              >
                <Image
                  src={getAssetPath('/images/ctx_intro_tool_output.png')}
                  alt="Tool Output Structure in Context Window"
                  width={500}
                  height={260}
                  unoptimized
                  className="rounded-lg object-contain max-h-56 w-auto group-hover:scale-[1.01] transition-transform"
                />
              </div>
            </div>

            {/* Tools vs Hooks Diagram */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 font-bold">Figure 7: Tools vs Hooks Table</span>
                <button
                  onClick={() => setModalImage({
                    src: getAssetPath('/images/ctx_intro_tools_vs_hooks.png'),
                    alt: 'Tools vs Hooks Table',
                    title: 'Figure 7: Tools vs Hooks Comparison'
                  })}
                  className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <Maximize2 className="h-3 w-3" /> Zoom
                </button>
              </div>
              <div
                onClick={() => setModalImage({
                  src: getAssetPath('/images/ctx_intro_tools_vs_hooks.png'),
                  alt: 'Tools vs Hooks Table',
                  title: 'Figure 7: Tools vs Hooks Comparison'
                })}
                className="cursor-pointer group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-2 flex justify-center"
              >
                <Image
                  src={getAssetPath('/images/ctx_intro_tools_vs_hooks.png')}
                  alt="Tools vs Hooks Table"
                  width={500}
                  height={260}
                  unoptimized
                  className="rounded-lg object-contain max-h-56 w-auto group-hover:scale-[1.01] transition-transform"
                />
              </div>
            </div>
          </div>

          {/* Row 2: 1 figure with richer information in its own row (Figure 6: Hooks Lifecycle) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                  Figure 6
                </span>
                <span className="text-sm font-bold text-white">
                  The Hooks Execution Lifecycle &amp; Model Visibility Boundary
                </span>
              </div>
              <button
                onClick={() => setModalImage({
                  src: getAssetPath('/images/ctx_intro_hooks_lifecycle.png'),
                  alt: 'Hooks Lifecycle Diagram',
                  title: 'Figure 6: Pre-tool & Post-tool Hooks Lifecycle'
                })}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 transition-colors"
              >
                <Maximize2 className="h-3.5 w-3.5" /> Fullscreen Zoom
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Diagram column */}
              <div
                onClick={() => setModalImage({
                  src: getAssetPath('/images/ctx_intro_hooks_lifecycle.png'),
                  alt: 'Hooks Lifecycle Diagram',
                  title: 'Figure 6: Pre-tool & Post-tool Hooks Lifecycle'
                })}
                className="lg:col-span-6 cursor-pointer group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-3 flex justify-center"
              >
                <Image
                  src={getAssetPath('/images/ctx_intro_hooks_lifecycle.png')}
                  alt="Hooks Lifecycle Diagram"
                  width={650}
                  height={340}
                  unoptimized
                  className="rounded-lg object-contain max-h-72 w-auto group-hover:scale-[1.01] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-indigo-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-3 py-1.5 rounded-lg bg-slate-950/90 text-xs font-mono text-white border border-indigo-500/40 shadow-xl flex items-center gap-1.5">
                    <Maximize2 className="h-3.5 w-3.5 text-indigo-400" /> Click to Inspect Full Diagram
                  </span>
                </div>
              </div>

              {/* Rich Information Panel */}
              <div className="lg:col-span-6 space-y-2.5 text-xs font-sans">
                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
                  <span className="text-indigo-400 font-mono font-bold text-[11px] block">1. pre_tool Hook (Runs Before Tool)</span>
                  <p className="text-slate-300 leading-relaxed">
                    Harness runs deterministic checks (e.g., <code className="text-indigo-300">check_permission(...)</code>) before the tool touches any database or API, preventing unauthorized actions.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
                  <span className="text-indigo-400 font-mono font-bold text-[11px] block">2. Tool Execution (Orchestrated by Harness)</span>
                  <p className="text-slate-300 leading-relaxed">
                    Harness dispatches the verified tool call (e.g. <code className="text-indigo-300">SearchPolicies()</code>) against external services or database layers.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
                  <span className="text-indigo-400 font-mono font-bold text-[11px] block">3. post_tool Hook (Runs After Tool)</span>
                  <p className="text-slate-300 leading-relaxed">
                    Harness executes post-processing (e.g., <code className="text-indigo-300">check_current(...)</code>, PII redaction, token truncation) to eliminate raw payload bloat before context injection.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-indigo-500/30 bg-indigo-950/20 space-y-1">
                  <span className="text-indigo-300 font-mono font-bold text-[11px] block">4. Model Visibility Boundary (Zero Leakage)</span>
                  <p className="text-slate-300 leading-relaxed">
                    The System Prompt provides Tool descriptions, but <strong>NO descriptions of hooks</strong>. Hooks are completely invisible to the LLM, guaranteeing unbreakable enforcement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 5: KNOWLEDGE CHECK & SUMMARY */}
      {/* ========================================================= */}
      <section id="section-quiz" className="space-y-6 pt-4">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <HelpCircle className="h-4 w-4" /> Self-Assessment
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            5. Interactive Knowledge Check &amp; Best Practices
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed max-w-4xl">
            Test your understanding of the foundational principles of Context Engineering, Failure Modes, and Agent Harness mechanics.
          </p>
        </div>

        {/* Quiz Container */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:p-6 space-y-6">
          <div className="space-y-6">
            {quizQuestions.map((q, qIndex) => {
              const selectedIdx = quizAnswers[q.id];
              const isAnswered = selectedIdx !== undefined;
              const isCorrect = selectedIdx === q.correctIndex;

              return (
                <div key={q.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-mono text-indigo-400 font-bold">
                      Question {qIndex + 1} of {quizQuestions.length}
                    </span>
                    {showQuizResults && isAnswered && (
                      <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                        isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-white font-sans">{q.question}</p>

                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedIdx === optIdx;
                      let btnStyle = "border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-slate-300";

                      if (isOptionSelected) {
                        btnStyle = "border-indigo-500 bg-indigo-950/40 text-indigo-200 ring-1 ring-indigo-500/40";
                      }

                      if (showQuizResults) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = "border-emerald-500 bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-500/50";
                        } else if (isOptionSelected && !isCorrect) {
                          btnStyle = "border-rose-500 bg-rose-950/40 text-rose-200";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectQuiz(q.id, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between gap-3 ${btnStyle}`}
                        >
                          <span className="font-sans leading-relaxed">{opt}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {showQuizResults && isAnswered && (
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-sans leading-relaxed">
                      💡 <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quiz Controls & Score Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
            <div className="text-xs font-mono text-slate-400">
              Answered: {Object.keys(quizAnswers).length} / {quizQuestions.length} questions
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowQuizResults(!showQuizResults)}
                disabled={Object.keys(quizAnswers).length === 0}
                className="px-4 py-2 rounded-xl border border-indigo-500/40 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-mono font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {showQuizResults ? 'Hide Review' : 'Check Answers'}
              </button>
              {showQuizResults && (
                <div className="text-xs font-mono font-bold text-white px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                  Score: <span className="text-emerald-400">{getQuizScore()}</span> / {quizQuestions.length} ({Math.round((getQuizScore() / quizQuestions.length) * 100)}%)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Production Context Engineering Cheatsheet */}
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 via-slate-950 to-slate-900 p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400" /> Production Context Engineering Rules of Thumb
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-slate-300">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="font-bold text-indigo-300 font-mono">1. Budget for the 20-40% Degradation Cliff</div>
              <p className="text-slate-400">
                Never fill context windows past 40% capacity on complex reasoning tasks without aggressive summarization or pruning hooks.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="font-bold text-indigo-300 font-mono">2. Keep Security Outside the Model (Hooks)</div>
              <p className="text-slate-400">
                Place authorization, rate-limits, and input guards in harness pre-tool hooks. Never trust system prompts alone for security.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="font-bold text-indigo-300 font-mono">3. Format for High Signal-to-Noise</div>
              <p className="text-slate-400">
                Always transform raw backend JSON payloads into compact markdown key-values with timestamp provenance before writing to context.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="font-bold text-indigo-300 font-mono">4. Separate Tools from State Mutations</div>
              <p className="text-slate-400">
                Decompose queries into atomic tools, and let post-tool hooks reconcile memory state so contradictory facts never clash in context.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* MODAL IMAGE EXPAND VIEW */}
      {/* ========================================================= */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setModalImage(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
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

            <div className="flex justify-center items-center bg-slate-900/50 rounded-xl p-2 max-h-[75vh] overflow-auto">
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
              <span>Source: Intro of Context Engineering.docx</span>
              <button
                onClick={() => setModalImage(null)}
                className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors"
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
