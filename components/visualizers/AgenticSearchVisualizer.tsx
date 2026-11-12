"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { getAssetPath } from '@/lib/asset';
import {
  Search,
  Sparkles,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Play,
  ShieldAlert,
  Terminal,
  Database,
  Cpu,
  Sliders,
  FileText,
  Filter,
  Minimize2,
  Maximize2,
  HelpCircle,
  Layers2,
  Table,
  FileCode,
  HardDrive
} from 'lucide-react';

export const AgenticSearchVisualizer: React.FC = () => {
  // -------------------------------------------------------------
  // MODAL IMAGE PREVIEW STATE
  // -------------------------------------------------------------
  const [modalImage, setModalImage] = useState<{ src: string; alt: string; title: string } | null>(null);

  // -------------------------------------------------------------
  // SECTION 1: AGENTIC SEARCH VS RAG STATE
  // -------------------------------------------------------------
  const [retrievalMode, setRetrievalMode] = useState<'rag' | 'agentic'>('agentic');
  const [agenticSimStep, setAgenticSimStep] = useState<number>(0);

  const agenticHops = [
    {
      hop: 1,
      target: "Relational DB (SQL)",
      tool: "database_query",
      args: { user_id: 9182, query: "SELECT * FROM transactions WHERE date = '2024-05-10'" },
      finding: "Transaction #TX-9102 failed with code 'ERR_EXPIRED_CARD'. Account tier: VIP Gold.",
      rationale: "Decided to first check transactional records to identify why the payment failed.",
      color: "border-blue-500/40 bg-blue-950/20 text-blue-300"
    },
    {
      hop: 2,
      target: "Filesystem Logs (.txt)",
      tool: "log_search",
      args: { pattern: "TX-9102", service: "payment_gateway" },
      finding: "Gateway trace: Card expiration date (04/24) triggered automated rejection on retry.",
      rationale: "Inspected raw server logs to confirm if it was user-side or gateway network failure.",
      color: "border-amber-500/40 bg-amber-950/20 text-amber-300"
    },
    {
      hop: 3,
      target: "Vector Store (.md)",
      tool: "policy_semantic_search",
      args: { query: "VIP Gold exception refund for expired card charge" },
      finding: "Policy POL-VIP-88: VIP Gold members receive a 14-day automatic fee waiver and grace period.",
      rationale: "Searched unstructured policy docs to check if customer qualifies for automatic waiver.",
      color: "border-emerald-500/40 bg-emerald-950/20 text-emerald-300"
    }
  ];

  // -------------------------------------------------------------
  // SECTION 2: 4 SEARCH STRATEGIES STATE
  // -------------------------------------------------------------
  const [selectedStrategy, setSelectedStrategy] = useState<'exact' | 'ranked' | 'semantic' | 'hybrid'>('hybrid');
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0);
  const [scenarioAnswers, setScenarioAnswers] = useState<Record<number, string>>({});

  const scenarios = [
    {
      query: "Looking up customer by ID: CUST-88392",
      best: "exact",
      explanation: "Exact Lexical Search is optimal for unique IDs, hashes, and error codes where exact character matching is required."
    },
    {
      query: "Find documentation about 'Authentication timeout API endpoint'",
      best: "ranked",
      explanation: "Ranked Lexical Search (BM25) ranks documents by the frequency of multiple specific keywords."
    },
    {
      query: "Customer states: 'I am deeply dissatisfied with how long my package took to arrive'",
      best: "semantic",
      explanation: "Semantic Search uses dense vector embeddings to capture conceptual meaning ('dissatisfied with package delay' -> shipping refund policy)."
    },
    {
      query: "Investigating 'Payment failures from expired credit cards'",
      best: "hybrid",
      explanation: "Hybrid Search combines lexical precision on 'expired credit cards' with semantic search on conceptual reasons for payment failure."
    }
  ];

  // -------------------------------------------------------------
  // SECTION 3: TOOL DEFINITION ENGINEERING STATE
  // -------------------------------------------------------------
  const [toolViewMode, setToolViewMode] = useState<'bad' | 'good'>('good');

  // -------------------------------------------------------------
  // SECTION 4: TOOL REGISTRIES JUST-IN-TIME STATE
  // -------------------------------------------------------------
  const [totalToolsCount, setTotalToolsCount] = useState<number>(24);
  const [avgTokensPerTool, setAvgTokensPerTool] = useState<number>(220);

  const calculatedStaticPromptTokens = totalToolsCount * avgTokensPerTool;
  const calculatedJITPromptTokens = 1 * avgTokensPerTool + 150; // search_tools + overhead
  const tokenSavingsPercent = Math.round(((calculatedStaticPromptTokens - calculatedJITPromptTokens) / calculatedStaticPromptTokens) * 100);

  // -------------------------------------------------------------
  // SECTION 5: TROUBLESHOOTING & EVALS STATE
  // -------------------------------------------------------------
  const [selectedFailureIssue, setSelectedFailureIssue] = useState<'no_tool' | 'wrong_tool' | 'wrong_data' | 'wrong_query'>('no_tool');
  const [evalRunning, setEvalRunning] = useState<boolean>(false);
  const [evalProgress, setEvalProgress] = useState<number>(0);
  const [evalTrials, setEvalTrials] = useState<Array<{ id: number; query: string; expectedTool: string; actualTool: string; passed: boolean }>>([
    { id: 1, query: "Find documentation for payment retry limits", expectedTool: "semantic_search", actualTool: "semantic_search", passed: true },
    { id: 2, query: "Find error 0x8004101 in deployment logs", expectedTool: "ranked_lexical_search", actualTool: "semantic_search", passed: false },
    { id: 3, query: "Lookup user account for ID 90124", expectedTool: "exact_lexical_search", actualTool: "exact_lexical_search", passed: true }
  ]);

  const runEvaluationTest = () => {
    setEvalRunning(true);
    setEvalProgress(0);
    const interval = setInterval(() => {
      setEvalProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setEvalRunning(false);
          // Simulate fixed regression
          setEvalTrials([
            { id: 1, query: "Find documentation for payment retry limits", expectedTool: "semantic_search", actualTool: "semantic_search", passed: true },
            { id: 2, query: "Find error 0x8004101 in deployment logs", expectedTool: "ranked_lexical_search", actualTool: "ranked_lexical_search", passed: true },
            { id: 3, query: "Lookup user account for ID 90124", expectedTool: "exact_lexical_search", actualTool: "exact_lexical_search", passed: true }
          ]);
          return 100;
        }
        return prev + 35;
      });
    }, 200);
  };

  // -------------------------------------------------------------
  // SECTION 6: DATA PREPARATION STATE
  // -------------------------------------------------------------
  const [activeDataPrepStep, setActiveDataPrepStep] = useState<'parsing' | 'chunking' | 'metadata'>('parsing');

  // -------------------------------------------------------------
  // SECTION 7: QUIZ STATE
  // -------------------------------------------------------------
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);

  const quizQuestions = [
    {
      id: 1,
      question: "Why does Agentic Search provide a major advantage over traditional static RAG pipelines?",
      options: [
        "Agentic search automatically encrypts all retrieved vector embeddings.",
        "Agentic search is autonomous and multi-turn: it can formulate narrow queries, query multiple heterogeneous data sources, evaluate intermediate results, and search iteratively until stopping conditions are met.",
        "Agentic search eliminates the need for any embedding model or tokenizer.",
        "Agentic search guarantees that context windows never exceed 100 tokens."
      ],
      correctIndex: 1,
      explanation: "Unlike static RAG which forces an agent into a single rigid retrieval step, Agentic Search allows the model to decide what info it needs, call specialized tools across databases, and search again if initial results are incomplete."
    },
    {
      id: 2,
      question: "Which search strategy should you select when an agent is searching for an error code (e.g. '0x80070005') or an exact Customer ID?",
      options: [
        "Dense Semantic Vector Search",
        "Ranked BM25 Keyword Search",
        "Exact Lexical Search",
        "Hierarchical Clustering"
      ],
      correctIndex: 2,
      explanation: "Exact Lexical Search is explicitly designed for exact character matches (IDs, error codes, hashes) where semantic embeddings often fail due to token fragmentation."
    },
    {
      id: 3,
      question: "When should an engineering team implement a 'Tool Registry' (Just-in-Time Tool Loading)?",
      options: [
        "Only when building mobile apps with fewer than 3 tools.",
        "When available tools exceed ~10+, tool definitions consume >5,000–10,000 tokens of the system prompt, or the agent experiences tool selection confusion.",
        "When all tools are called every single turn without exception.",
        "Only when using PostgreSQL databases."
      ],
      correctIndex: 1,
      explanation: "Tool Registries shine when tool catalogs grow large (>10 tools, >10k tokens). They save context window capacity by loading tool definitions just-in-time via a `search_tools` function."
    },
    {
      id: 4,
      question: "Why should a tool description for `SemanticSearch` explicitly state: 'Do not use this to prove that something is absent from the codebase'?",
      options: [
        "Because semantic search returns relevant nearest-neighbor matches rather than exhaustive occurrences, so missing results do not guarantee non-existence.",
        "Because semantic search automatically deletes unreferenced files.",
        "Because vector databases cannot store text longer than 20 words.",
        "Because LLMs refuse to process negative sentences."
      ],
      correctIndex: 0,
      explanation: "Semantic search retrieves by similarity threshold. It is not an exhaustive boolean grep. Stating this negative limitation prevents agents from hallucinating that a feature does not exist when it simply wasn't retrieved."
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
      <div className="sticky top-2 z-30 bg-slate-950/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-2 overflow-x-auto text-xs font-mono">
        <div className="flex items-center gap-1.5 shrink-0 text-cyan-400 font-bold px-2">
          <Bookmark className="h-3.5 w-3.5" />
          <span>Quick Jump:</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="#section-agentic-vs-rag"
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950/60 hover:text-cyan-300 text-slate-300 transition-colors border border-slate-800"
          >
            1. Agentic vs. RAG
          </a>
          <a
            href="#section-strategies"
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950/60 hover:text-cyan-300 text-slate-300 transition-colors border border-slate-800"
          >
            2. 4 Search Strategies
          </a>
          <a
            href="#section-tool-definitions"
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950/60 hover:text-cyan-300 text-slate-300 transition-colors border border-slate-800"
          >
            3. Tool Definitions
          </a>
          <a
            href="#section-registries"
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950/60 hover:text-cyan-300 text-slate-300 transition-colors border border-slate-800"
          >
            4. Tool Registries
          </a>
          <a
            href="#section-evals"
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950/60 hover:text-cyan-300 text-slate-300 transition-colors border border-slate-800"
          >
            5. Troubleshooting &amp; Evals
          </a>
          <a
            href="#section-data-prep"
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950/60 hover:text-cyan-300 text-slate-300 transition-colors border border-slate-800"
          >
            6. Data Prep
          </a>
          <a
            href="#section-quiz"
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950/60 hover:text-cyan-300 text-slate-300 transition-colors border border-slate-800"
          >
            7. Quiz
          </a>
        </div>
        <div className="hidden sm:flex items-center gap-2 shrink-0 pl-2 border-l border-slate-800 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-cyan-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Tab 2 Curriculum
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: AGENTIC SEARCH VS TRADITIONAL RAG */}
      {/* ========================================================= */}
      <section id="section-agentic-vs-rag" className="space-y-6 pt-2">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Search className="h-4 w-4" /> Core Architectural Paradigm
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            1. Agentic Search vs. Traditional RAG
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed max-w-4xl">
            Traditional Retrieval-Augmented Generation (RAG) locks an agent into a rigid, one-turn retrieval pipeline. In contrast, <strong>Agentic Search</strong> empowers the model to decide what information it needs, orchestrate multiple search tools across disparate data stores, and iterate until a stopping condition is reached.
          </p>
        </div>

        {/* 3 Core Steps of Agentic Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded-2xl border border-cyan-500/30 bg-slate-950/80 space-y-2">
            <div className="flex items-center justify-between text-cyan-400">
              <span className="text-xs font-bold uppercase">Step 1: Decide</span>
              <Cpu className="h-4 w-4" />
            </div>
            <div className="text-white font-bold text-sm">Formulate Information Need</div>
            <p className="text-slate-400 font-sans leading-relaxed text-xs">
              The agent evaluates the current conversation state and determines what specific facts are missing to advance the task.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-cyan-500/30 bg-slate-950/80 space-y-2">
            <div className="flex items-center justify-between text-cyan-400">
              <span className="text-xs font-bold uppercase">Step 2: Choose &amp; Sourcing</span>
              <Terminal className="h-4 w-4" />
            </div>
            <div className="text-white font-bold text-sm">Select Tool &amp; Source</div>
            <p className="text-slate-400 font-sans leading-relaxed text-xs">
              Chooses optimal search tools (SQL, lexical, vector, logs) tailored to where the target data actually resides.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-cyan-500/30 bg-slate-950/80 space-y-2">
            <div className="flex items-center justify-between text-cyan-400">
              <span className="text-xs font-bold uppercase">Step 3: Iterate &amp; Stop</span>
              <RotateCcw className="h-4 w-4" />
            </div>
            <div className="text-white font-bold text-sm">Search Again or Halt</div>
            <p className="text-slate-400 font-sans leading-relaxed text-xs">
              Inspects intermediate tool returns, refines queries, or stops cleanly when sufficient evidence is accumulated.
            </p>
          </div>
        </div>

        {/* Implications for Context Engineering (High Quality vs More Context) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-sm">
              <Sparkles className="h-4 w-4" /> Higher Information Quality
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Tailors search strategies to narrow, targeted queries. By breaking monolithic questions into focused tool invocations, the agent captures highly relevant context with high signal-to-noise ratio.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold font-mono text-sm">
              <AlertTriangle className="h-4 w-4" /> The Context Management Problem
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              <strong>More context is generated!</strong> Each iterative round accumulates reasoning traces, tool arguments, and tool payloads. This directly causes token bloat, requiring strict compaction and pruning (explored in Tab 3).
            </p>
          </div>
        </div>

        {/* Interactive Multi-Hop Simulation */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                Interactive Simulation: Complex Multi-Source Investigation
              </span>
              <p className="text-xs text-slate-400 mt-1">
                Query: &quot;Why did payment fail for user 9182 on May 10, and do they qualify for a VIP exception refund?&quot;
              </p>
            </div>
            <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setRetrievalMode('rag')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  retrievalMode === 'rag' ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1-Shot Static RAG
              </button>
              <button
                onClick={() => setRetrievalMode('agentic')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  retrievalMode === 'agentic' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Multi-Hop Agentic Search
              </button>
            </div>
          </div>

          {retrievalMode === 'rag' ? (
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-3 font-mono text-xs">
              <div className="text-rose-300 font-bold">1-Shot Static Vector Search Attempt:</div>
              <p className="text-slate-300 font-sans text-xs">
                Static RAG sends the entire user prompt to an embedding index. Because user 9182&apos;s transaction lives in a SQL table and gateway logs live on a disk filesystem, vector similarity returns generic refund marketing docs.
              </p>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-rose-400 space-y-1">
                <div>❌ Result: Hallucination or Failure</div>
                <div className="text-slate-400 font-sans text-[11px]">
                  Agent replies: &quot;I found our general refund policy, but I do not have access to user 9182&apos;s transaction records or error logs.&quot;
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                {agenticHops.map((hop, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAgenticSimStep(idx)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      agenticSimStep === idx
                        ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200 shadow-md ring-1 ring-cyan-500/30'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-cyan-400">Hop {hop.hop}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400">{hop.target}</span>
                    </div>
                    <code className="text-white text-xs block font-bold truncate">{hop.tool}()</code>
                    <p className="text-[11px] font-sans text-slate-300 mt-1 line-clamp-2">{hop.finding}</p>
                  </button>
                ))}
              </div>

              {/* Hop Detail Card */}
              <div className="p-4 rounded-xl border border-cyan-500/30 bg-slate-900/60 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-cyan-300 font-bold">
                  <span>Hop {agenticHops[agenticSimStep].hop}: Querying {agenticHops[agenticSimStep].target}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Tool: {agenticHops[agenticSimStep].tool}</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 text-[11px]">
                  <span className="text-slate-500 block">Arguments:</span>
                  <code>{JSON.stringify(agenticHops[agenticSimStep].args)}</code>
                </div>
                <div className="text-emerald-300 text-[11px]">
                  <strong>Evidence Discovered:</strong> {agenticHops[agenticSimStep].finding}
                </div>
                <p className="text-slate-400 font-sans text-xs pt-1">
                  💡 <strong>Agent Rationale:</strong> {agenticHops[agenticSimStep].rationale}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Diagram 1 Presentation Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                Figure 1
              </span>
              <span className="text-sm font-bold text-white">
                Agentic Search: Core Steps &amp; Context Engineering Implications
              </span>
            </div>
            <button
              onClick={() => setModalImage({
                src: getAssetPath('/images/ctx_search_agentic_vs_rag.png'),
                alt: 'Agentic Search Steps & Implications',
                title: 'Figure 1: Agentic Search vs RAG'
              })}
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800"
            >
              <Maximize2 className="h-3.5 w-3.5" /> Fullscreen
            </button>
          </div>

          <div
            onClick={() => setModalImage({
              src: getAssetPath('/images/ctx_search_agentic_vs_rag.png'),
              alt: 'Agentic Search Steps & Implications',
              title: 'Figure 1: Agentic Search vs RAG'
            })}
            className="cursor-pointer group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-2 flex justify-center"
          >
            <Image
              src={getAssetPath('/images/ctx_search_agentic_vs_rag.png')}
              alt="Agentic Search Steps & Implications Diagram"
              width={900}
              height={400}
              unoptimized
              className="rounded-lg object-contain max-h-72 w-auto group-hover:scale-[1.01] transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: THE 4 SEARCH STRATEGIES */}
      {/* ========================================================= */}
      <section id="section-strategies" className="space-y-6 pt-4">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Filter className="h-4 w-4" /> Retrieval Modalities
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            2. Searching Information with Computers: The 4 Strategies
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed max-w-4xl">
            Computers do not search text monolithically. Depending on whether you are querying exact identifiers, keyword frequencies, conceptual intent, or a mixture of both, different search algorithms are required.
          </p>
        </div>

        {/* 4 Search Strategies Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setSelectedStrategy('exact')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
              selectedStrategy === 'exact'
                ? 'border-indigo-500 bg-indigo-950/40 shadow-lg'
                : 'border-slate-800 bg-slate-950 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-indigo-400 text-xs font-mono font-bold">
              <span>Exact Lexical</span>
              <FileCode className="h-4 w-4" />
            </div>
            <div className="text-white font-bold text-sm">Exact Keyword Match</div>
            <p className="text-slate-400 text-xs font-sans">
              Matches full characters or exact pattern substrings.
            </p>
            <div className="text-[11px] font-mono text-indigo-300 pt-1">
              Best for: Customer ID, error code, exact symbol.
            </div>
          </button>

          <button
            onClick={() => setSelectedStrategy('ranked')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
              selectedStrategy === 'ranked'
                ? 'border-cyan-500 bg-cyan-950/40 shadow-lg'
                : 'border-slate-800 bg-slate-950 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-cyan-400 text-xs font-mono font-bold">
              <span>Ranked Lexical</span>
              <Table className="h-4 w-4" />
            </div>
            <div className="text-white font-bold text-sm">BM25 / Keyword Frequency</div>
            <p className="text-slate-400 text-xs font-sans">
              Ranks documents by shared keywords and inverse document frequency.
            </p>
            <div className="text-[11px] font-mono text-cyan-300 pt-1">
              Best for: &quot;Authentication timeout API&quot;.
            </div>
          </button>

          <button
            onClick={() => setSelectedStrategy('semantic')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
              selectedStrategy === 'semantic'
                ? 'border-purple-500 bg-purple-950/40 shadow-lg'
                : 'border-slate-800 bg-slate-950 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-purple-400 text-xs font-mono font-bold">
              <span>Semantic Search</span>
              <Cpu className="h-4 w-4" />
            </div>
            <div className="text-white font-bold text-sm">Dense Vector Embeddings</div>
            <p className="text-slate-400 text-xs font-sans">
              Transforms strings to numbers in dense vectors; ranks by conceptual similarity.
            </p>
            <div className="text-[11px] font-mono text-purple-300 pt-1">
              Best for: &quot;Unhappy with delivery&quot;.
            </div>
          </button>

          <button
            onClick={() => setSelectedStrategy('hybrid')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
              selectedStrategy === 'hybrid'
                ? 'border-emerald-500 bg-emerald-950/40 shadow-lg'
                : 'border-slate-800 bg-slate-950 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-emerald-400 text-xs font-mono font-bold">
              <span>Hybrid Search</span>
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="text-white font-bold text-sm">Weighted Combination (RRF)</div>
            <p className="text-slate-400 text-xs font-sans">
              Combines lexical precision with semantic embeddings into 1 unified ranking.
            </p>
            <div className="text-[11px] font-mono text-emerald-300 pt-1">
              Best for: Exact terms + broad meaning.
            </div>
          </button>
        </div>

        {/* Interactive Scenario Matcher */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" /> Interactive Strategy Matcher
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Scenario {activeScenarioIdx + 1} of {scenarios.length}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3 font-mono text-xs">
            <div className="text-slate-400 text-[11px] uppercase">User Search Query:</div>
            <div className="text-white font-bold text-sm sm:text-base font-sans">
              &quot;{scenarios[activeScenarioIdx].query}&quot;
            </div>

            <div className="pt-2 text-slate-400 text-[11px]">Select the optimal strategy:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['exact', 'ranked', 'semantic', 'hybrid'] as const).map(stratKey => {
                const isSelected = scenarioAnswers[activeScenarioIdx] === stratKey;
                const isCorrect = scenarios[activeScenarioIdx].best === stratKey;

                let style = "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700";
                if (isSelected) {
                  style = isCorrect
                    ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-1 ring-emerald-500/30"
                    : "border-rose-500 bg-rose-950/40 text-rose-300";
                }

                return (
                  <button
                    key={stratKey}
                    onClick={() => setScenarioAnswers(prev => ({ ...prev, [activeScenarioIdx]: stratKey }))}
                    className={`p-2.5 rounded-xl border font-mono text-xs capitalize transition-all cursor-pointer ${style}`}
                  >
                    {stratKey}
                  </button>
                );
              })}
            </div>

            {scenarioAnswers[activeScenarioIdx] && (
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 font-sans text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  {scenarioAnswers[activeScenarioIdx] === scenarios[activeScenarioIdx].best ? (
                    <span className="text-emerald-400">✓ Correct Choice!</span>
                  ) : (
                    <span className="text-rose-400">✗ Suboptimal Strategy</span>
                  )}
                </div>
                <p className="text-slate-400">{scenarios[activeScenarioIdx].explanation}</p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center text-xs font-mono">
            <button
              onClick={() => setActiveScenarioIdx(prev => Math.max(0, prev - 1))}
              disabled={activeScenarioIdx === 0}
              className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 disabled:opacity-40"
            >
              Previous Scenario
            </button>
            <button
              onClick={() => setActiveScenarioIdx(prev => Math.min(scenarios.length - 1, prev + 1))}
              disabled={activeScenarioIdx === scenarios.length - 1}
              className="px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 disabled:opacity-40 font-bold"
            >
              Next Scenario &rarr;
            </button>
          </div>
        </div>

        {/* Diagrams 2 & 3 Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 font-bold">Figure 2: Computer Search Strategies</span>
              <button
                onClick={() => setModalImage({
                  src: getAssetPath('/images/ctx_search_computer_strategies.png'),
                  alt: 'Searching Information with Computers',
                  title: 'Figure 2: Computer Search Strategies'
                })}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
              >
                <Maximize2 className="h-3 w-3" /> Zoom
              </button>
            </div>
            <div
              onClick={() => setModalImage({
                src: getAssetPath('/images/ctx_search_computer_strategies.png'),
                alt: 'Searching Information with Computers',
                title: 'Figure 2: Computer Search Strategies'
              })}
              className="cursor-pointer group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-2 flex justify-center"
            >
              <Image
                src={getAssetPath('/images/ctx_search_computer_strategies.png')}
                alt="Computer Search Strategies Diagram"
                width={500}
                height={260}
                unoptimized
                className="rounded-lg object-contain max-h-56 w-auto group-hover:scale-[1.01] transition-transform"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 font-bold">Figure 3: When to Use Each Strategy</span>
              <button
                onClick={() => setModalImage({
                  src: getAssetPath('/images/ctx_search_when_to_use_strategies.png'),
                  alt: 'When to Use Each Strategy Table',
                  title: 'Figure 3: When to Use Each Strategy'
                })}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
              >
                <Maximize2 className="h-3 w-3" /> Zoom
              </button>
            </div>
            <div
              onClick={() => setModalImage({
                src: getAssetPath('/images/ctx_search_when_to_use_strategies.png'),
                alt: 'When to Use Each Strategy Table',
                title: 'Figure 3: When to Use Each Strategy'
              })}
              className="cursor-pointer group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-2 flex justify-center"
            >
              <Image
                src={getAssetPath('/images/ctx_search_when_to_use_strategies.png')}
                alt="When to Use Each Strategy Table Diagram"
                width={500}
                height={260}
                unoptimized
                className="rounded-lg object-contain max-h-56 w-auto group-hover:scale-[1.01] transition-transform"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: TOOL DEFINITIONS & THE 5-POINT FORMULA */}
      {/* ========================================================= */}
      <section id="section-tool-definitions" className="space-y-6 pt-4">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <FileText className="h-4 w-4" /> Prompt Engineering for Tools
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            3. Tool Definition Engineering &amp; The 5-Point Formula
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed max-w-4xl">
            Tool definitions in the context window consist of three fields in JSON format: <code className="text-cyan-300">name</code>, <code className="text-cyan-300">description</code>, and <code className="text-cyan-300">parameters</code>. How you write the description directly determines whether an LLM invokes the right tool or hallucinates.
          </p>
        </div>

        {/* 5 Pillars of Tool Definition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 space-y-1">
            <span className="text-cyan-400 font-bold block text-[11px]">1. Functionality</span>
            <div className="text-white font-bold">Data Sources</div>
            <p className="text-slate-400 font-sans text-[11px]">What does the tool search, and what kind of retrieval does it run?</p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 space-y-1">
            <span className="text-cyan-400 font-bold block text-[11px]">2. Inputs &amp; Outputs</span>
            <div className="text-white font-bold">Query Format</div>
            <p className="text-slate-400 font-sans text-[11px]">How should queries be formatted? What gets returned?</p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 space-y-1">
            <span className="text-cyan-400 font-bold block text-[11px]">3. Selection</span>
            <div className="text-white font-bold">When to Use</div>
            <p className="text-slate-400 font-sans text-[11px]">Clear criteria for when this tool SHOULD and should NOT be called.</p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 space-y-1">
            <span className="text-cyan-400 font-bold block text-[11px]">4. Limitations</span>
            <div className="text-white font-bold">Negative Bounds</div>
            <p className="text-slate-400 font-sans text-[11px]">What can it miss? Cannot prove absence from the codebase.</p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 space-y-1">
            <span className="text-cyan-400 font-bold block text-[11px]">5. Relationships</span>
            <div className="text-white font-bold">Sibling Tools</div>
            <p className="text-slate-400 font-sans text-[11px]">How it fits into workflow: when to prefer lexical or hybrid.</p>
          </div>
        </div>

        {/* Interactive Bad vs Good Tool Description Inspector */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Sliders className="h-4 w-4 text-cyan-400" /> Tool Description Comparison: SemanticSearch()
              </h3>
              <p className="text-xs text-slate-400">
                Observe how adding boundary criteria and tool relationships eliminates false invocations.
              </p>
            </div>
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setToolViewMode('bad')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  toolViewMode === 'bad' ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ❌ Naive 1-Line Description
              </button>
              <button
                onClick={() => setToolViewMode('good')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  toolViewMode === 'good' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ✅ Production 5-Point Formula
              </button>
            </div>
          </div>

          {toolViewMode === 'bad' ? (
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-rose-300">
                <span className="font-bold">Tool: SemanticSearch()</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">High Failure Rate</span>
              </div>
              <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-400 text-xs">
{`"description": "Search the codebase using semantic similarity. Best for general exploration."`}
              </pre>
              <div className="text-rose-400 text-xs font-sans space-y-1">
                <div>⚠️ Why this fails in production:</div>
                <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-0.5">
                  <li>No mention of what data is indexed (code vs docs vs git commits).</li>
                  <li>No guidance on when to prefer lexical search for exact function names.</li>
                  <li>Agent uses it to search for exact error codes, getting noisy irrelevant results.</li>
                  <li>Agent assumes a missing match means the function does not exist anywhere.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-emerald-300">
                <span className="font-bold">Tool: SemanticSearch()</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Deterministic &amp; Robust</span>
              </div>
              <pre className="p-3 bg-slate-950 rounded-lg border border-emerald-500/30 text-emerald-200 text-xs leading-relaxed overflow-x-auto">
{`"description": "Search the platform's indexed source code and documentation by conceptual similarity.

- Use this when exploring how a feature, behavior, or architectural concept is implemented and you do not know the exact identifiers or terminology used in the codebase.
- Prefer hybrid search when the query contains useful exact terms as well as conceptual intent.
- Prefer lexical search for exact symbols, filenames, paths, string literals, configuration keys, error messages, or exhaustive reference searches.
- Semantic search returns relevant matches rather than all occurrences, so do not use it to prove that something is absent from the codebase."`}
              </pre>
              <div className="text-emerald-300 text-xs font-sans">
                ✨ Eliminates tool confusion, establishes clear sibling relationships with lexical/hybrid tools, and sets strict negative boundaries.
              </div>
            </div>
          )}
        </div>

        {/* Diagrams Presentation: 2 in top row, 1 with richer information in its own row */}
        <div className="space-y-4">
          {/* Row 1: 2 figures in a row (Figure 4 & Figure 5) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 font-bold">Figure 4: Tool Definitions</span>
                <button
                  onClick={() => setModalImage({
                    src: getAssetPath('/images/ctx_search_tool_definitions.png'),
                    alt: 'Tool Definitions JSON structure',
                    title: 'Figure 4: Tool Definitions JSON Structure'
                  })}
                  className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <Maximize2 className="h-3 w-3" /> Zoom
                </button>
              </div>
              <div
                onClick={() => setModalImage({
                  src: getAssetPath('/images/ctx_search_tool_definitions.png'),
                  alt: 'Tool Definitions JSON structure',
                  title: 'Figure 4: Tool Definitions JSON Structure'
                })}
                className="cursor-pointer group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-2 flex justify-center"
              >
                <Image
                  src={getAssetPath('/images/ctx_search_tool_definitions.png')}
                  alt="Tool Definitions JSON structure Diagram"
                  width={500}
                  height={260}
                  unoptimized
                  className="rounded-lg object-contain max-h-56 w-auto group-hover:scale-[1.01] transition-transform"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 font-bold">Figure 5: Improving Tool Definitions</span>
                <button
                  onClick={() => setModalImage({
                    src: getAssetPath('/images/ctx_search_improving_definitions.png'),
                    alt: 'Improving Tool Definitions Bad vs Good',
                    title: 'Figure 5: Improving Tool Definitions'
                  })}
                  className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <Maximize2 className="h-3 w-3" /> Zoom
                </button>
              </div>
              <div
                onClick={() => setModalImage({
                  src: getAssetPath('/images/ctx_search_improving_definitions.png'),
                  alt: 'Improving Tool Definitions Bad vs Good',
                  title: 'Figure 5: Improving Tool Definitions'
                })}
                className="cursor-pointer group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-2 flex justify-center"
              >
                <Image
                  src={getAssetPath('/images/ctx_search_improving_definitions.png')}
                  alt="Improving Tool Definitions Diagram"
                  width={500}
                  height={260}
                  unoptimized
                  className="rounded-lg object-contain max-h-56 w-auto group-hover:scale-[1.01] transition-transform"
                />
              </div>
            </div>
          </div>

          {/* Row 2: 1 figure with richer information in its own row (Figure 6) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  Figure 6
                </span>
                <span className="text-sm font-bold text-white">
                  Best Practices Formula: The 5 Essential Pillars of a Tool Definition
                </span>
              </div>
              <button
                onClick={() => setModalImage({
                  src: getAssetPath('/images/ctx_search_best_practices.png'),
                  alt: 'Best Practices for Tool Definitions',
                  title: 'Figure 6: Best Practices for Tool Definitions'
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
                  src: getAssetPath('/images/ctx_search_best_practices.png'),
                  alt: 'Best Practices for Tool Definitions',
                  title: 'Figure 6: Best Practices for Tool Definitions'
                })}
                className="lg:col-span-6 cursor-pointer group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-3 flex justify-center"
              >
                <Image
                  src={getAssetPath('/images/ctx_search_best_practices.png')}
                  alt="Best Practices for Tool Definitions Diagram"
                  width={650}
                  height={340}
                  unoptimized
                  className="rounded-lg object-contain max-h-72 w-auto group-hover:scale-[1.01] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-cyan-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-3 py-1.5 rounded-lg bg-slate-950/90 text-xs font-mono text-white border border-cyan-500/40 shadow-xl flex items-center gap-1.5">
                    <Maximize2 className="h-3.5 w-3.5 text-cyan-400" /> Click to Inspect Full Diagram
                  </span>
                </div>
              </div>

              {/* Rich Information Panel */}
              <div className="lg:col-span-6 space-y-2.5 text-xs font-sans">
                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
                  <span className="text-cyan-400 font-mono font-bold text-[11px] block">1. Functionality &amp; Data Sources</span>
                  <p className="text-slate-300 leading-relaxed">
                    Specifies exact index boundaries and retrieval methods (e.g., &quot;Searches indexed source code and documentation by conceptual similarity&quot;).
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
                  <span className="text-cyan-400 font-mono font-bold text-[11px] block">2. Inputs &amp; Outputs Schema</span>
                  <p className="text-slate-300 leading-relaxed">
                    Clarifies how input queries must be formatted and the exact structure/fields of the returned payload to prevent argument hallucination.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
                  <span className="text-cyan-400 font-mono font-bold text-[11px] block">3. Selection Criterion (Positive &amp; Negative Triggers)</span>
                  <p className="text-slate-300 leading-relaxed">
                    Explicitly tells the model when to choose this tool and when <em>not</em> to call it (e.g., &quot;Use when exploring behaviors without knowing identifiers&quot;).
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
                  <span className="text-cyan-400 font-mono font-bold text-[11px] block">4. Negative Limitations (Cannot Prove Absence)</span>
                  <p className="text-slate-300 leading-relaxed">
                    Warns that nearest-neighbor semantic search cannot prove non-existence, stopping agents from falsely claiming a symbol does not exist.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
                  <span className="text-cyan-400 font-mono font-bold text-[11px] block">5. Sibling Tool Relationships</span>
                  <p className="text-slate-300 leading-relaxed">
                    Maps routing hierarchy: prefer lexical search for exact symbols and filenames; prefer hybrid search when both exact keywords and conceptual intent matter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: JUST-IN-TIME TOOL REGISTRIES */}
      {/* ========================================================= */}
      <section id="section-registries" className="space-y-6 pt-4">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <HardDrive className="h-4 w-4" /> Token Economics &amp; Scale
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            4. Tool Registries: Dynamic Just-in-Time Tool Loading
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed max-w-4xl">
            In production agent frameworks (such as Claude, Codex, or Gemini), comprehensive tool catalogs consume <strong>5,000 to 10,000+ tokens</strong> of the system prompt every turn. <strong>Tool Registries</strong> solve this by loading tool schemas dynamically just-in-time via a <code className="text-cyan-300">search_tools(...)</code> gateway.
          </p>
        </div>

        {/* 3 Step Lifecycle of Tool Registry */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
            <span className="text-cyan-400 font-bold block text-[11px]">Step 1: Minimal Prompt</span>
            <div className="text-white font-bold">Only Core Tools in Prompt</div>
            <p className="text-slate-400 font-sans text-xs">
              System prompt contains only general tools plus <code className="text-cyan-300">search_tools</code> which connects to the registry.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
            <span className="text-cyan-400 font-bold block text-[11px]">Step 2: External Vector Store</span>
            <div className="text-white font-bold">Deferred Tool Catalog</div>
            <p className="text-slate-400 font-sans text-xs">
              Dozens of specialized tool schemas are indexed in an external vector store or registry database.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
            <span className="text-cyan-400 font-bold block text-[11px]">Step 3: Dynamic Harness Injection</span>
            <div className="text-white font-bold">Just-in-Time Activation</div>
            <p className="text-slate-400 font-sans text-xs">
              Harness receives the retrieved tool schema and injects it into available tools for the very next model call.
            </p>
          </div>
        </div>

        {/* Interactive Token Savings & Registry Calculator */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Sliders className="h-4 w-4 text-cyan-400" /> Interactive Token Economics Calculator
              </h3>
              <p className="text-xs text-slate-400">
                Adjust tool catalog size to inspect when a Tool Registry becomes advantageous.
              </p>
            </div>
            <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
              Token Savings: ~{tokenSavingsPercent}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4 font-mono text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Total Available Tools in Catalog:</span>
                  <strong className="text-cyan-400">{totalToolsCount} tools</strong>
                </div>
                <input
                  type="range"
                  min="4"
                  max="60"
                  step="2"
                  value={totalToolsCount}
                  onChange={(e) => setTotalToolsCount(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Average Tokens per Tool Schema:</span>
                  <strong className="text-cyan-400">{avgTokensPerTool} tokens</strong>
                </div>
                <input
                  type="range"
                  min="100"
                  max="400"
                  step="20"
                  value={avgTokensPerTool}
                  onChange={(e) => setAvgTokensPerTool(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Comparison Output */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-rose-400">Static All-in-Prompt:</span>
                <span className="text-rose-300 font-bold">{calculatedStaticPromptTokens.toLocaleString()} tokens / turn</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-emerald-400">Just-in-Time Tool Registry:</span>
                <span className="text-emerald-300 font-bold">{calculatedJITPromptTokens.toLocaleString()} tokens / turn</span>
              </div>
              <div className="text-[11px] font-sans text-slate-300">
                {totalToolsCount > 10 ? (
                  <span className="text-emerald-300">
                    ✅ <strong>Highly Recommended:</strong> With {totalToolsCount} tools, a Tool Registry frees up {calculatedStaticPromptTokens - calculatedJITPromptTokens} tokens for user conversation history and reduces attention confusion.
                  </span>
                ) : (
                  <span className="text-amber-300">
                    ℹ️ <strong>Direct Prompt Feasible:</strong> For fewer than 10 tools, the extra network hop of <code className="text-amber-200">search_tools</code> may add unnecessary latency.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Diagrams 7 & 8 Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 font-bold">Figure 7: Tool Registries Just-in-Time</span>
              <button
                onClick={() => setModalImage({
                  src: getAssetPath('/images/ctx_search_tool_registries.png'),
                  alt: 'Tool Registries load tool definitions just-in-time',
                  title: 'Figure 7: Tool Registries Just-in-Time'
                })}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
              >
                <Maximize2 className="h-3 w-3" /> Zoom
              </button>
            </div>
            <div
              onClick={() => setModalImage({
                src: getAssetPath('/images/ctx_search_tool_registries.png'),
                alt: 'Tool Registries load tool definitions just-in-time',
                title: 'Figure 7: Tool Registries Just-in-Time'
              })}
              className="cursor-pointer group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-2 flex justify-center"
            >
              <Image
                src={getAssetPath('/images/ctx_search_tool_registries.png')}
                alt="Tool Registries load tool definitions just-in-time Diagram"
                width={500}
                height={260}
                unoptimized
                className="rounded-lg object-contain max-h-56 w-auto group-hover:scale-[1.01] transition-transform"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 font-bold">Figure 8: When to Use Tool Registries</span>
              <button
                onClick={() => setModalImage({
                  src: getAssetPath('/images/ctx_search_when_to_use_registries.png'),
                  alt: 'When to Use Tool Registries Decision Table',
                  title: 'Figure 8: When to Use Tool Registries'
                })}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
              >
                <Maximize2 className="h-3 w-3" /> Zoom
              </button>
            </div>
            <div
              onClick={() => setModalImage({
                src: getAssetPath('/images/ctx_search_when_to_use_registries.png'),
                alt: 'When to Use Tool Registries Decision Table',
                title: 'Figure 8: When to Use Tool Registries'
              })}
              className="cursor-pointer group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-2 flex justify-center"
            >
              <Image
                src={getAssetPath('/images/ctx_search_when_to_use_registries.png')}
                alt="When to Use Tool Registries Decision Table Diagram"
                width={500}
                height={260}
                unoptimized
                className="rounded-lg object-contain max-h-56 w-auto group-hover:scale-[1.01] transition-transform"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 5: TROUBLESHOOTING & SYSTEMATIC EVALUATIONS */}
      {/* ========================================================= */}
      <section id="section-evals" className="space-y-6 pt-4">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="h-4 w-4" /> Rigorous Quality Control
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            5. Troubleshooting Tool Failures &amp; Systematic Evals
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed max-w-4xl">
            When models pick the wrong tool or fail to call tools altogether, diagnosing the root cause requires systematic categorization and multi-trial regression test suites (Evals).
          </p>
        </div>

        {/* 4 Tool Calling Failure Modes Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
          <button
            onClick={() => setSelectedFailureIssue('no_tool')}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
              selectedFailureIssue === 'no_tool'
                ? 'bg-rose-950/40 border-rose-500 text-rose-300 ring-1 ring-rose-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            1. No Tool Call
          </button>
          <button
            onClick={() => setSelectedFailureIssue('wrong_tool')}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
              selectedFailureIssue === 'wrong_tool'
                ? 'bg-amber-950/40 border-amber-500 text-amber-300 ring-1 ring-amber-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            2. Wrong Tool
          </button>
          <button
            onClick={() => setSelectedFailureIssue('wrong_data')}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
              selectedFailureIssue === 'wrong_data'
                ? 'bg-yellow-950/40 border-yellow-500 text-yellow-300 ring-1 ring-yellow-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            3. Wrong Data Source
          </button>
          <button
            onClick={() => setSelectedFailureIssue('wrong_query')}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
              selectedFailureIssue === 'wrong_query'
                ? 'bg-purple-950/40 border-purple-500 text-purple-300 ring-1 ring-purple-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            4. Wrong Query Args
          </button>
        </div>

        {/* Diagnostic Detail Card */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 font-mono text-xs space-y-3">
          {selectedFailureIssue === 'no_tool' && (
            <div className="space-y-2">
              <span className="text-rose-400 font-bold uppercase text-[11px]">Issue: No Tool Call Triggered</span>
              <div className="text-white font-bold text-sm">Cause: Description is too brief or lacks clear trigger criteria</div>
              <p className="text-slate-300 font-sans text-xs">
                The LLM cannot determine when the tool is appropriate because the description is a vague 4-word summary.
              </p>
              <div className="p-3 bg-slate-950 rounded-lg border border-emerald-500/30 text-emerald-300 text-[11px]">
                <strong>Recommended Fix:</strong> Expand the tool description with explicit usage scenarios and concrete phrasing that matches typical user requests.
              </div>
            </div>
          )}

          {selectedFailureIssue === 'wrong_tool' && (
            <div className="space-y-2">
              <span className="text-amber-400 font-bold uppercase text-[11px]">Issue: Model Calls Wrong Tool</span>
              <div className="text-white font-bold text-sm">Cause: Tool definitions are too similar or overlap in scope</div>
              <p className="text-slate-300 font-sans text-xs">
                When two tools have overlapping descriptions (e.g. `search_policies` vs `search_articles`), the LLM arbitrarily flips a coin.
              </p>
              <div className="p-3 bg-slate-950 rounded-lg border border-emerald-500/30 text-emerald-300 text-[11px]">
                <strong>Recommended Fix:</strong> Differentiate definitions by describing negative boundaries and the exact relationship among tools (e.g., &quot;Use Tool A for legal policies; use Tool B for marketing blogs&quot;).
              </div>
            </div>
          )}

          {selectedFailureIssue === 'wrong_data' && (
            <div className="space-y-2">
              <span className="text-yellow-400 font-bold uppercase text-[11px]">Issue: Right Tool, But Wrong Data Source</span>
              <div className="text-white font-bold text-sm">Cause: Tools retrieving data from the wrong backend table or index</div>
              <p className="text-slate-300 font-sans text-xs">
                The agent knows it needs to query a database, but queries `archive_logs` instead of `active_transactions`.
              </p>
              <div className="p-3 bg-slate-950 rounded-lg border border-emerald-500/30 text-emerald-300 text-[11px]">
                <strong>Recommended Fix:</strong> Add more explicit details about the data sources inside the description (e.g., table schemas, date ranges, API docs).
              </div>
            </div>
          )}

          {selectedFailureIssue === 'wrong_query' && (
            <div className="space-y-2">
              <span className="text-purple-400 font-bold uppercase text-[11px]">Issue: Right Tool, But Invalid Query Arguments</span>
              <div className="text-white font-bold text-sm">Cause: Arguments missing, wrongly typed, or inverted</div>
              <p className="text-slate-300 font-sans text-xs">
                The agent passes a natural language paragraph into a tool parameter that requires an ISO-8601 date format.
              </p>
              <div className="p-3 bg-slate-950 rounded-lg border border-emerald-500/30 text-emerald-300 text-[11px]">
                <strong>Recommended Fix:</strong> Provide explicit input examples in the schema. Hardcode default inputs for specialized tools that run frequently (especially custom tools not seen in training).
              </div>
            </div>
          )}
        </div>

        {/* Interactive Systematic Evaluation (Eval) Runner */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" /> Multi-Trial Evaluation Harness (Evals)
              </h3>
              <p className="text-xs text-slate-400">
                Testing across multiple trials ensures that tool revisions improve performance without introducing regressions.
              </p>
            </div>
            <button
              onClick={runEvaluationTest}
              disabled={evalRunning}
              className="px-4 py-2 rounded-xl border border-emerald-500/40 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <Play className="h-3.5 w-3.5" /> {evalRunning ? 'Running Evals...' : 'Run Regression Evals'}
            </button>
          </div>

          {/* Eval Progress Bar */}
          {evalRunning && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-emerald-400">
                <span>Executing multi-trial regression test harness...</span>
                <span>{evalProgress}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${evalProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Eval Trial Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 px-3">Trial</th>
                  <th className="py-2 px-3">Query</th>
                  <th className="py-2 px-3">Expected Tool</th>
                  <th className="py-2 px-3">Actual Invocation</th>
                  <th className="py-2 px-3">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {evalTrials.map(trial => (
                  <tr key={trial.id}>
                    <td className="py-2.5 px-3 text-cyan-400 font-bold">#{trial.id}</td>
                    <td className="py-2.5 px-3 text-slate-200">{trial.query}</td>
                    <td className="py-2.5 px-3 text-slate-400"><code>{trial.expectedTool}</code></td>
                    <td className="py-2.5 px-3 text-white"><code>{trial.actualTool}</code></td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        trial.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {trial.passed ? 'PASS ✓' : 'FAIL ✗'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800 text-slate-400">
            <span>Overall Success Rate: <strong className="text-emerald-400">
              {evalTrials.filter(t => t.passed).length} / {evalTrials.length} ({Math.round((evalTrials.filter(t => t.passed).length / evalTrials.length) * 100)}%)
            </strong></span>
            <span>Regression Safeguard: <strong className="text-cyan-400">Automated CI/CD Ready</strong></span>
          </div>
        </div>

        {/* Diagrams 9 & 10 Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 font-bold">Figure 9: Troubleshooting Failures</span>
              <button
                onClick={() => setModalImage({
                  src: getAssetPath('/images/ctx_search_troubleshooting_failures.png'),
                  alt: 'Troubleshooting Tool Failures Table',
                  title: 'Figure 9: Troubleshooting Failures'
                })}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
              >
                <Maximize2 className="h-3 w-3" /> Zoom
              </button>
            </div>
            <div
              onClick={() => setModalImage({
                src: getAssetPath('/images/ctx_search_troubleshooting_failures.png'),
                alt: 'Troubleshooting Tool Failures Table',
                title: 'Figure 9: Troubleshooting Failures'
              })}
              className="cursor-pointer group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-2 flex justify-center"
            >
              <Image
                src={getAssetPath('/images/ctx_search_troubleshooting_failures.png')}
                alt="Troubleshooting Tool Failures Diagram"
                width={500}
                height={260}
                unoptimized
                className="rounded-lg object-contain max-h-56 w-auto group-hover:scale-[1.01] transition-transform"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 font-bold">Figure 10: Building Evaluations (Evals)</span>
              <button
                onClick={() => setModalImage({
                  src: getAssetPath('/images/ctx_search_building_evals.png'),
                  alt: 'Building Evaluations Diagram',
                  title: 'Figure 10: Building Evaluations'
                })}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
              >
                <Maximize2 className="h-3 w-3" /> Zoom
              </button>
            </div>
            <div
              onClick={() => setModalImage({
                src: getAssetPath('/images/ctx_search_building_evals.png'),
                alt: 'Building Evaluations Diagram',
                title: 'Figure 10: Building Evaluations'
              })}
              className="cursor-pointer group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-2 flex justify-center"
            >
              <Image
                src={getAssetPath('/images/ctx_search_building_evals.png')}
                alt="Building Evaluations Diagram"
                width={500}
                height={260}
                unoptimized
                className="rounded-lg object-contain max-h-56 w-auto group-hover:scale-[1.01] transition-transform"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 6: PREPARING DATA FOR SEARCH */}
      {/* ========================================================= */}
      <section id="section-data-prep" className="space-y-6 pt-4">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Database className="h-4 w-4" /> Data Engineering Foundation
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            6. Preparing Data for Search
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed max-w-4xl">
            Sometimes tool failures are not tool description problems at all—they are <strong>data problems</strong>. If documents are badly parsed or chunked, even a perfect tool will retrieve corrupted noise.
          </p>
        </div>

        {/* 3 Techniques & Storage Targets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Parsing */}
          <button
            onClick={() => setActiveDataPrepStep('parsing')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
              activeDataPrepStep === 'parsing'
                ? 'border-indigo-500 bg-indigo-950/40 shadow-lg ring-1 ring-indigo-500/30'
                : 'border-slate-800 bg-slate-950 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-indigo-400 text-xs font-mono font-bold">
              <span>Technique 1</span>
              <FileCode className="h-4 w-4" />
            </div>
            <div className="text-white font-bold text-sm">AST-Aware Parsing</div>
            <p className="text-slate-400 text-xs font-sans">
              Split source code at functions and classes so each semantic code unit remains whole, rather than arbitrary character slicing.
            </p>
          </button>

          {/* Chunking */}
          <button
            onClick={() => setActiveDataPrepStep('chunking')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
              activeDataPrepStep === 'chunking'
                ? 'border-cyan-500 bg-cyan-950/40 shadow-lg ring-1 ring-cyan-500/30'
                : 'border-slate-800 bg-slate-950 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-cyan-400 text-xs font-mono font-bold">
              <span>Technique 2</span>
              <Layers2 className="h-4 w-4" />
            </div>
            <div className="text-white font-bold text-sm">Natural Chunking</div>
            <p className="text-slate-400 text-xs font-sans">
              Split at natural semantic boundaries (blank lines, markdown headings, and periods) to preserve logical paragraphs.
            </p>
          </button>

          {/* Metadata Labelling */}
          <button
            onClick={() => setActiveDataPrepStep('metadata')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
              activeDataPrepStep === 'metadata'
                ? 'border-emerald-500 bg-emerald-950/40 shadow-lg ring-1 ring-emerald-500/30'
                : 'border-slate-800 bg-slate-950 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-emerald-400 text-xs font-mono font-bold">
              <span>Technique 3</span>
              <Bookmark className="h-4 w-4" />
            </div>
            <div className="text-white font-bold text-sm">Metadata Labelling</div>
            <p className="text-slate-400 text-xs font-sans">
              Inject headings, file paths, line numbers, and author tags directly into chunk headers to ground embedding retrieval.
            </p>
          </button>
        </div>

        {/* Storage Tier Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-4">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Database className="h-4 w-4 text-cyan-400" /> Mapping Search Data to Storage Paradigms
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-blue-400 font-bold block text-[11px]">Relational Database (SQL)</span>
              <div className="text-white font-bold">Customer Tickets &amp; Forms</div>
              <p className="text-slate-400 font-sans text-xs">
                Stores structured intake messages and transactional states in tabular SQL rows.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-purple-400 font-bold block text-[11px]">Vector Store (.py, .md)</span>
              <div className="text-white font-bold">Source Code &amp; Docs</div>
              <p className="text-slate-400 font-sans text-xs">
                Stores dense embeddings of markdown docs, code functions, and design policies.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-amber-400 font-bold block text-[11px]">Filesystem (.txt, .log)</span>
              <div className="text-white font-bold">System Event Logs</div>
              <p className="text-slate-400 font-sans text-xs">
                Stores append-only event streams and raw execution traces on disk for grep searches.
              </p>
            </div>
          </div>
        </div>

        {/* Diagram 11 Presentation Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                Figure 11
              </span>
              <span className="text-sm font-bold text-white">
                Preparing Data for Search: Parsing, Chunking, and Storage Paradigms
              </span>
            </div>
            <button
              onClick={() => setModalImage({
                src: getAssetPath('/images/ctx_search_data_preparation.png'),
                alt: 'Preparing Data for Search',
                title: 'Figure 11: Preparing Data for Search'
              })}
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800"
            >
              <Maximize2 className="h-3.5 w-3.5" /> Fullscreen
            </button>
          </div>

          <div
            onClick={() => setModalImage({
              src: getAssetPath('/images/ctx_search_data_preparation.png'),
              alt: 'Preparing Data for Search',
              title: 'Figure 11: Preparing Data for Search'
            })}
            className="cursor-pointer group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-2 flex justify-center"
          >
            <Image
              src={getAssetPath('/images/ctx_search_data_preparation.png')}
              alt="Preparing Data for Search Diagram"
              width={900}
              height={400}
              unoptimized
              className="rounded-lg object-contain max-h-72 w-auto group-hover:scale-[1.01] transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 7: KNOWLEDGE CHECK & SUMMARY */}
      {/* ========================================================= */}
      <section id="section-quiz" className="space-y-6 pt-4">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <HelpCircle className="h-4 w-4" /> Self-Assessment
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            7. Interactive Knowledge Check &amp; Best Practices
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed max-w-4xl">
            Test your grasp of Agentic Search paradigms, search strategy selection, tool definition formula, and evaluation mechanics.
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
                    <span className="text-xs font-mono text-cyan-400 font-bold">
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
                        btnStyle = "border-cyan-500 bg-cyan-950/40 text-cyan-200 ring-1 ring-cyan-500/40";
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
                className="px-4 py-2 rounded-xl border border-cyan-500/40 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 text-xs font-mono font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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

        {/* Production Best Practices Cheatsheet */}
        <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 via-slate-950 to-slate-900 p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" /> Production Agentic Search Rules of Thumb
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-slate-300">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="font-bold text-cyan-300 font-mono">1. Never Rely on 1-Shot Retrieval</div>
              <p className="text-slate-400">
                Complex enterprise workflows span SQL databases, log files, and vector stores. Empower the agent to execute atomic multi-hop searches across specialized tools.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="font-bold text-cyan-300 font-mono">2. State What Tools Cannot Do (Negative Bounds)</div>
              <p className="text-slate-400">
                Explicitly document limitations in tool descriptions (e.g., &quot;Semantic search cannot prove absence; use lexical for exhaustive audits&quot;).
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="font-bold text-cyan-300 font-mono">3. Gate Large Tool Catalogs with JIT Registries</div>
              <p className="text-slate-400">
                Once available tools exceed 10 or consume &gt;5,000 tokens of system prompt, defer schemas to a vector registry and load definitions just-in-time via <code className="text-cyan-300">search_tools</code>.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="font-bold text-cyan-300 font-mono">4. Guard Against Regressions with Multi-Trial Evals</div>
              <p className="text-slate-400">
                Whenever you modify a tool description, run systematic automated evaluations over multiple query variations to prevent regressions.
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
              <span>Source: Agentic Search.docx</span>
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
