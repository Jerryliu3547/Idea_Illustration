"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { getAssetPath } from '@/lib/asset';
import {
  Scissors,
  Layers,
  Minimize2,
  Maximize2,
  FileText,
  Database,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  Sliders,
  Code2,
  Clock,
  RefreshCw,
  Copy,
  Check,
  BookOpen,
  ArrowRight
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
          height={480}
          unoptimized
          className="rounded-lg object-contain max-h-80 w-auto group-hover:scale-[1.01] transition-transform duration-300"
        />
      </div>
    </div>
  );
};

type PruningMode = 'deduplication' | 'extraction' | 'truncation';
type CompactionTrigger = 'pre_hook' | 'tool';
type PromptVariant = 'claude_code' | 'better';

const CLAUDE_CODE_PROMPT = `You have written a partial transcript for the initial task above. Please write a summary of the transcript.

The purpose of this summary is to provide continuity so you can continue to make progress towards solving the task in a future context, where the raw history above may not be accessible and will be replaced with this summary.

Write down anything that would be helpful, including the state, next steps, learnings etc. You must wrap your summary in a <summary></summary> block.`;

const COMPACTION_PROMPT_BETTER = `COMPACTION_PROMPT_BETTER = """You are compacting the research context for another \\
agent that will pick up this task where it was left.
What you write replaces the research history, so the next agent works only from it.
Fill every field, or leave it null when there is genuinely nothing to report. Use short \\
bullets rather than paragraphs.
- Copy names, titles, dates and identifiers exactly as the searches wrote them.
- Give the doc_id of the document each fact came from.
- Record searches that have already run and found nothing, so they are not run again.
- Record every answer already ruled out, and say why it was ruled out.
- Check the retrieved search results against every part of the question, including the parts no \\
search has looked for yet. If a search already answers a part, that part is settled, even \\
though nothing searched for it."""`;

const SCRATCHPAD_STEPS = [
  {
    step: 1,
    title: 'Store Full Results in Scratchpad, Keep Pointers in Context',
    contextLines: [
      { role: 'System Prompt', text: 'Research assistant instructions + ReadScratchpad() schema', tone: 'blue' },
      { role: 'User Prompt', text: 'Find researcher who coordinated a group, co-edited 2018 Routledge book...', tone: 'amber' },
      { role: 'Tool Output', text: 'Result 1 (full in scratchpad id 1)\nResult 2 (full in scratchpad id 2)\nResult 3 (full in scratchpad id 3)\nResult 4 (full in scratchpad id 4)\nResult 5 (full in scratchpad id 5)', tone: 'emerald' },
    ],
    scratchpadActiveIds: [1, 2, 3, 4, 5],
    editedId: null as number | null,
    note: 'Full retrieved documents live in an external Scratchpad dictionary; the context window only pays tokens for compact IDs and summaries.',
  },
  {
    step: 2,
    title: 'On-Demand Retrieval via ReadScratchpad()',
    contextLines: [
      { role: 'Reasoning Trace', text: 'Need exact publication details from Result 1 before ruling it out.', tone: 'purple' },
      { role: 'Tool Input', text: 'ReadScratchpad(id=1)', tone: 'rose' },
      { role: 'Tool Output', text: 'Full result 1 (from scratchpad): "Dr. Laura Lojo-Rodriguez co-edited..."', tone: 'emerald' },
    ],
    scratchpadActiveIds: [1],
    editedId: null as number | null,
    note: 'The model calls ReadScratchpad(id=1) only when necessary, keeping irrelevant document payloads out of earlier turns.',
  },
  {
    step: 3,
    title: 'Dead End & Updating Stale Scratchpad Records',
    contextLines: [
      { role: 'Reasoning Trace', text: 'This is a dead end. Restart. Need to edit old records in scratchpad.', tone: 'purple' },
      { role: 'Tool Input', text: 'UpdateScratchpad(id=5, status="ruled_out_missing_phd_match")', tone: 'rose' },
    ],
    scratchpadActiveIds: [5],
    editedId: 5,
    note: 'Because scratchpads persist outside the context window, stale entries must be explicitly updated so future reads do not rely on outdated data.',
  },
];

export const ContextManagementVisualizer: React.FC = () => {
  const [modalImage, setModalImage] = useState<ModalImageState | null>(null);

  // Section 1: Pruning Mode Explorer
  const [pruningMode, setPruningMode] = useState<PruningMode>('deduplication');
  const [truncationFillPct, setTruncationFillPct] = useState<number>(82);
  const truncationThreshold = 75;
  const isTruncated = truncationFillPct >= truncationThreshold;

  // Section 2: Compaction & Trigger Simulator
  const [compactionTrigger, setCompactionTrigger] = useState<CompactionTrigger>('pre_hook');
  const [contextUsagePct, setContextUsagePct] = useState<number>(78);
  const compactionThreshold = 75;
  const compactionTriggered = contextUsagePct >= compactionThreshold;

  // Section 3: Compaction Prompt Comparison
  const [promptVariant, setPromptVariant] = useState<PromptVariant>('better');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  // Section 4: Scratchpad Stepper
  const [scratchpadStepIdx, setScratchpadStepIdx] = useState<number>(0);

  const activePromptText = promptVariant === 'claude_code' ? CLAUDE_CODE_PROMPT : COMPACTION_PROMPT_BETTER;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(activePromptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 1800);
  };

  const currentScratchpadStep = SCRATCHPAD_STEPS[scratchpadStepIdx];

  return (
    <div className="space-y-12">
      {/* ========================================================= */}
      {/* SECTION 1: PRUNING (DEDUPLICATION, EXTRACTION, TRUNCATION) */}
      {/* ========================================================= */}
      <section id="section-pruning" className="space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Scissors className="h-4 w-4" /> Section 1 · Context Pruning
          </div>
          <h2 className="text-2xl font-bold text-white">
            Pruning: Cutting Content That Adds No New Information
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Pruning <strong className="text-slate-200">does not alter the meaning of the context</strong>—it removes redundant, irrelevant, or stale tokens via harness hooks (<code className="text-amber-300 font-mono text-xs">deduplicate</code>, <code className="text-amber-300 font-mono text-xs">extract</code>, <code className="text-amber-300 font-mono text-xs">truncate</code>) while preserving a complete record of what the agent already tried.
          </p>
        </div>

        {/* Technique Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {([
            { id: 'deduplication', label: '1. Deduplication', badge: 'deduplicate(...)' },
            { id: 'extraction', label: '2. Extraction', badge: 'extract(...)' },
            { id: 'truncation', label: '3. Truncation', badge: 'truncate(...)' },
          ] as const).map((tab) => {
            const active = pruningMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setPruningMode(tab.id)}
                className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  active
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-200 shadow-lg shadow-amber-950/20'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                  active ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Pruning View */}
        {pruningMode === 'deduplication' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-rose-400">
                    Without Deduplication
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Redundant Tokens</span>
                </div>
                <div className="space-y-2 font-mono text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    Search 1 → <span className="text-cyan-300">doc id=23, 42, 54, 21, 95</span> (full text)
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-200">
                    Search 2 → <span className="line-through opacity-75">doc id=42 (full text repeated)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-200">
                    Search 2 → <span className="line-through opacity-75">doc id=67 (near-duplicate of doc 95)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    Search 2 → <span className="text-emerald-300">doc id=69 (new content)</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-amber-300">
                    With deduplicate(...) Hook
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">Complete Search Picture</span>
                </div>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
{`<doc id=42 score = 0.37>
  duplicate
</doc>
<doc id=67 score = 0.33>
  near duplicate to doc 95
</doc>
<doc id=69 score = 0.29>
  [Full new document content kept]
</doc>`}
                </pre>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Instead of silently dropping duplicates, recording <code className="text-amber-300">duplicate</code> / <code className="text-amber-300">near duplicate to doc 95</code> gives the agent a <strong className="text-white">complete picture of past searches</strong> so it does not re-run the same query expecting new results.
                </p>
              </div>
            </div>

            <FigureCard
              figureNumber={1}
              title="Deduplication Hook & Duplicate Record in Context Window"
              src="/images/ctx_mgmt_deduplication.png"
              alt="Deduplication diagram showing duplicate and near-duplicate records in Tool Output"
              onExpand={setModalImage}
            />
          </div>
        )}

        {pruningMode === 'extraction' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-3">
                <div className="text-xs font-mono font-bold uppercase text-slate-400">
                  Raw Retrieved Document (doc id=69)
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-1.5 leading-relaxed">
                  <p className="text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                    [Line 1-2 · Relevant] &ldquo;Dr. Laura Lojo-Rodriguez coordinated a state-funded research group founded by Dr Singh in August 2009. Dr Singh later wrote a paper sharing the results in 2014.&rdquo;
                  </p>
                  <p className="text-slate-500 px-2 py-0.5">
                    [Lines 3-18 · Pruned] Boilerplate biography, committee memberships, unrelated conference travel, formatting footers...
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-5 space-y-3">
                <div className="text-xs font-mono font-bold uppercase text-amber-300">
                  Tool Output After extract(...) Hook
                </div>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
{`<doc id=69 score = 0.29>
Extracted lines 1-2:
Dr. Laura Lojo-Rodriguez coordinated a state...
</doc>`}
                </pre>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The <code className="text-amber-300 font-mono">extract(...)</code> hook isolates only the lines relevant to the user&apos;s query before inserting them into the context window, preventing long documents from diluting attention.
                </p>
              </div>
            </div>

            <FigureCard
              figureNumber={2}
              title="Extraction Hook Isolating Relevant Lines"
              src="/images/ctx_mgmt_extraction.png"
              alt="Extraction diagram showing extract hook pulling lines 1-2 from doc 69"
              onExpand={setModalImage}
            />
          </div>
        )}

        {pruningMode === 'truncation' && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Threshold-Triggered Truncation Simulator
                  </h3>
                  <p className="text-xs text-slate-400">
                    Drag context fill level past <span className="text-amber-400 font-mono">{truncationThreshold}%</span> to see <code className="text-amber-300 font-mono">truncate(...)</code> drop older turns while keeping a truncation notice.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={30}
                    max={98}
                    value={truncationFillPct}
                    onChange={(e) => setTruncationFillPct(Number(e.target.value))}
                    className="w-40 accent-amber-400 cursor-pointer"
                  />
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                    isTruncated
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                      : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  }`}>
                    {truncationFillPct}% Full
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="text-blue-300 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20">
                    System Prompt (Always Preserved)
                  </div>
                  <div className="text-amber-300 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                    User Prompt (Always Preserved)
                  </div>
                  {isTruncated ? (
                    <div className="text-rose-300 px-2 py-2 rounded bg-rose-500/10 border border-dashed border-rose-500/40">
                      [Notice: Earlier Tool Inputs, Outputs &amp; Reasoning Traces (turns 1–3) were truncated due to context limit]
                    </div>
                  ) : (
                    <div className="text-slate-300 px-2 py-2 rounded bg-slate-800/70 border border-slate-700">
                      Older Turns 1–3: Search results 1, 4, 5, 8 + &ldquo;This is a dead end. Restart.&rdquo;
                    </div>
                  )}
                  <div className="text-emerald-300 px-2 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    Latest Turn: New search result 1, New search result 2...
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-center space-y-2 font-sans">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-mono font-bold uppercase">
                    <AlertTriangle className="h-4 w-4" /> Key Truncation Rule
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    When truncation cuts older turns after reaching a context window threshold, it <strong className="text-white">must leave metadata/information indicating that earlier history was truncated</strong>, so the model does not assume it has never searched before.
                  </p>
                </div>
              </div>
            </div>

            <FigureCard
              figureNumber={3}
              title="Truncation Hook Dropping Older Turns"
              src="/images/ctx_mgmt_truncation.png"
              alt="Truncation diagram showing older tool outputs and reasoning traces crossed out"
              onExpand={setModalImage}
            />
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: COMPACTION & TRIGGER STRATEGIES                */}
      {/* ========================================================= */}
      <section id="section-compaction" className="space-y-6 pt-2">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Layers className="h-4 w-4" /> Section 2 · Context Compaction
          </div>
          <h2 className="text-2xl font-bold text-white">
            Compaction: Summarizing History into a Compact State
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Unlike truncation (which simply cuts old messages), <strong className="text-slate-200">compaction summarizes past tool calls, search results, and reasoning traces</strong> into a compact block (e.g., <code className="text-amber-300 font-mono text-xs">&lt;compaction&gt;...&lt;/compaction&gt;</code>) so progress is preserved without blowing up the context window.
          </p>
        </div>

        {/* Two Ways to Trigger Compaction */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setCompactionTrigger('pre_hook')}
            className={`text-left p-5 rounded-2xl border transition-all space-y-2 cursor-pointer ${
              compactionTrigger === 'pre_hook'
                ? 'bg-amber-950/30 border-amber-500/40 shadow-lg'
                : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-amber-400">
                Trigger Mode 1 · Harness Pre-Hook
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                e.g. 75% Context Limit
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              Length-Triggered Pre-Hook
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Triggered automatically when context length reaches a threshold (such as <strong className="text-white">75% of the context window</strong>). Implemented as a pre-hook that compacts message history <em>before</em> the current model call executes.
            </p>
          </button>

          <button
            onClick={() => setCompactionTrigger('tool')}
            className={`text-left p-5 rounded-2xl border transition-all space-y-2 cursor-pointer ${
              compactionTrigger === 'tool'
                ? 'bg-cyan-950/30 border-cyan-500/40 shadow-lg'
                : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-cyan-400">
                Trigger Mode 2 · Agent-Initiated
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                compact_context() Tool
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              Compaction Exposed as a Tool
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Exposes compaction as a callable tool so the <strong className="text-white">model itself decides</strong> when a sub-task or dead-end branch is finished and message history should be compacted.
            </p>
          </button>
        </div>

        {/* Interactive Compaction Budget Simulator */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-indigo-400">
                <Sliders className="h-3.5 w-3.5" /> Interactive Compaction Simulator ({compactionTrigger === 'pre_hook' ? 'Pre-Hook @ 75%' : 'Model Tool Call'})
              </div>
              <p className="text-xs text-slate-400">
                Adjust simulated context window usage to see when compaction fires and how history collapses into a <code className="text-emerald-300 font-mono">&lt;compaction&gt;</code> block.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={25}
                max={95}
                value={contextUsagePct}
                onChange={(e) => setContextUsagePct(Number(e.target.value))}
                className="w-40 accent-indigo-400 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white">
                {contextUsagePct}% Used
              </span>
            </div>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden relative">
            <div
              className={`h-full transition-all duration-300 ${
                compactionTriggered ? 'bg-amber-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${contextUsagePct}%` }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-1.5">
              <div className="text-slate-400 text-[11px]">Raw History Before Compaction:</div>
              <div className="text-slate-300">• 6 HybridSearch() calls across 35 distinct sources</div>
              <div className="text-slate-300">• Reasoning trace: candidate scholars &amp; dead ends</div>
              <div className="text-slate-400">• Status: {compactionTriggered ? 'Threshold exceeded -> Pre-hook compact() active' : 'Below 75% threshold'}</div>
            </div>

            <div className={`p-3.5 rounded-xl border font-mono text-xs space-y-1.5 ${
              compactionTriggered || compactionTrigger === 'tool'
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                : 'bg-slate-900/50 border-slate-800 text-slate-500'
            }`}>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold uppercase">
                  {compactionTrigger === 'tool'
                    ? 'Model Called compact_context()'
                    : compactionTriggered
                      ? 'Pre-Hook Compacted Output'
                      : 'Waiting for 75% Threshold'}
                </span>
                {(compactionTriggered || compactionTrigger === 'tool') && (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> ~18% Post-Compact
                  </span>
                )}
              </div>
              <p className="leading-relaxed">
                &lt;compaction&gt; Tackled two questions. Ran 6 searches and retrieved 35 distinct sources. Identified candidate scholars: dr. Jorge Sacido-Romero, dr. Manuela Palacios. Need to confirm which candidate has a PhD on an English writer... &lt;/compaction&gt;
              </p>
            </div>
          </div>
        </div>

        <FigureCard
          figureNumber={4}
          title="Compaction Hook Replacing History with <compaction> Summary"
          src="/images/ctx_mgmt_compaction.png"
          alt="Compaction diagram showing older context blocks replaced by a <compaction> summary"
          onExpand={setModalImage}
        />
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: COMPACTION PROMPT ENGINEERING                  */}
      {/* ========================================================= */}
      <section id="section-compaction-prompts" className="space-y-6 pt-2">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Code2 className="h-4 w-4" /> Section 3 · Compaction Prompt Design
          </div>
          <h2 className="text-2xl font-bold text-white">
            Structuring Compaction Prompts &amp; XML Metadata
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Compaction quality depends heavily on the prompt. Good compaction prompts frame continuity for the next context/agent, wrap output in XML tags like <code className="text-amber-300 font-mono text-xs">&lt;summary&gt;&lt;/summary&gt;</code>, and enforce strict preservation of identifiers, <code className="text-amber-300 font-mono text-xs">doc_id</code> citations, and ruled-out paths.
          </p>
        </div>

        {/* Prompt Comparison Toggle */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                onClick={() => setPromptVariant('better')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                  promptVariant === 'better'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Structured Research Prompt (COMPACTION_PROMPT_BETTER)
              </button>
              <button
                onClick={() => setPromptVariant('claude_code')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                  promptVariant === 'claude_code'
                    ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Claude Code Style Prompt (&lt;summary&gt;)
              </button>
            </div>

            <button
              onClick={handleCopyPrompt}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              {copiedPrompt ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedPrompt ? 'Copied' : 'Copy Prompt'}
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">
            {activePromptText}
          </pre>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {[
              { title: 'Exact Identifiers', desc: 'Copy names, titles, dates, and IDs verbatim so downstream steps never hallucinate.' },
              { title: 'Cite doc_id', desc: 'Attach the source doc_id to every fact for traceability across compacted turns.' },
              { title: 'Track Empty & Ruled-Out Searches', desc: 'Record searches that found nothing and ruled-out answers with reasons so they are not repeated.' },
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
                <div className="text-xs font-mono font-bold text-amber-300">{item.title}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <FigureCard
          figureNumber={5}
          title="Example Compaction Prompt with <summary> XML Metadata"
          src="/images/ctx_mgmt_compaction_prompt.png"
          alt="Claude Code compaction prompt example highlighting <summary></summary> XML tags"
          onExpand={setModalImage}
        />
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: SCRATCHPADS & EXTERNAL STATE                   */}
      {/* ========================================================= */}
      <section id="section-scratchpads" className="space-y-6 pt-2">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Database className="h-4 w-4" /> Section 4 · Scratchpads
          </div>
          <h2 className="text-2xl font-bold text-white">
            Scratchpads: Offloading Live Information Outside the Context Window
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            The context window should not be the only place passing live information. A <strong className="text-slate-200">Scratchpad</strong> (such as an external dictionary or filesystem store) holds full data while the context window keeps compact references, paired with a <code className="text-amber-300 font-mono text-xs">ReadScratchpad()</code> tool for on-demand retrieval.
          </p>
        </div>

        {/* Interactive Scratchpad Step-Through */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {SCRATCHPAD_STEPS.map((s, idx) => (
                <button
                  key={s.step}
                  onClick={() => setScratchpadStepIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                    scratchpadStepIdx === idx
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Step {s.step}
                </button>
              ))}
            </div>
            <span className="text-xs font-mono text-slate-400">
              {currentScratchpadStep.title}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* External Scratchpad Dictionary */}
            <div className="lg:col-span-5 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> External Scratchpad (Dict / FS)
                </span>
                <span className="text-slate-500">Out-of-Context</span>
              </div>
              <div className="space-y-1.5 font-mono text-xs">
                {[1, 2, 3, 4, 5].map((id) => {
                  const isActive = currentScratchpadStep.scratchpadActiveIds.includes(id);
                  const isEdited = currentScratchpadStep.editedId === id;
                  return (
                    <div
                      key={id}
                      className={`px-2.5 py-2 rounded-lg border flex items-center justify-between transition-all ${
                        isEdited
                          ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                          : isActive
                            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                            : 'bg-slate-950/60 border-slate-800 text-slate-500'
                      }`}
                    >
                      <span>id = {id} · Full retrieved document</span>
                      <span className="text-[10px]">
                        {isEdited ? 'EDITED' : isActive ? 'ACCESSED' : 'STORED'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Context Window View */}
            <div className="lg:col-span-7 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5" /> Context Window
                </span>
                <span className="text-slate-500">Active Token Budget</span>
              </div>
              <div className="space-y-2 font-mono text-xs">
                {currentScratchpadStep.contextLines.map((line, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1"
                  >
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      {line.role}
                    </div>
                    <pre className="text-slate-200 whitespace-pre-wrap font-mono text-xs leading-relaxed">
                      {line.text}
                    </pre>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-300 pt-1 leading-relaxed flex items-start gap-2">
                <ArrowRight className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{currentScratchpadStep.note}</span>
              </p>
            </div>
          </div>

          {/* 3 Trade-offs / Caveats from Screenshot */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                icon: BookOpen,
                title: 'Agent Awareness',
                desc: 'The agent has to know what is inside the scratchpad (via concise IDs or summaries in context).',
              },
              {
                icon: Clock,
                title: 'Latency & Cost',
                desc: 'Scratchpads can add extra round-trip latency or tool-call cost if frequently accessed.',
              },
              {
                icon: RefreshCw,
                title: 'Stale Information',
                desc: 'Information stored in scratchpads can become outdated over time unless explicitly edited or invalidated.',
              },
            ].map((caveat, idx) => {
              const Icon = caveat.icon;
              return (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300">
                    <Icon className="h-3.5 w-3.5" /> {caveat.title}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{caveat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <FigureCard
          figureNumber={6}
          title="Scratchpads Architecture & Key Trade-Offs"
          src="/images/ctx_mgmt_scratchpads.png"
          alt="Scratchpads diagram showing external scratchpad IDs, ReadScratchpad tool calls, and trade-offs"
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
              <span>Source: Context Management.docx</span>
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
