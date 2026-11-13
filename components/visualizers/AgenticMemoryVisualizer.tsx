"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { getAssetPath } from '@/lib/asset';
import {
  Database,
  FileText,
  GitBranch,
  Layers,
  Maximize2,
  Minimize2,
  Search,
  ShieldCheck,
  Terminal,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Award,
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
          height={480}
          unoptimized
          className="rounded-lg object-contain max-h-80 w-auto group-hover:scale-[1.01] transition-transform duration-300"
        />
      </div>
    </div>
  );
};

type SourceRankId = 'user_direct' | 'user_indirect' | 'model';
type UpdateOpId = 'override' | 'merge' | 'version';
type ReadModeId = 'hook' | 'tool';

const DATA_SOURCES = [
  {
    id: 'message_history',
    name: 'Message history',
    format: 'JSONL file',
    organization: 'Raw',
    volatility: 'Dynamic',
    desc: 'Raw turn-by-turn conversation transcript logged during the session; source input for post-session memory extraction.',
    badgeColor: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
  },
  {
    id: 'scratchpads',
    name: 'Scratchpads',
    format: 'Markdown / JSON Files',
    organization: 'Raw (Snapshot)',
    volatility: 'Dynamic (Short-Term)',
    desc: 'Short-term session storage for offloading query plans or large tool outputs from the active context window.',
    badgeColor: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30',
  },
  {
    id: 'memories',
    name: 'Memories',
    format: 'Vector Store',
    organization: 'Curated (Digest)',
    volatility: 'Dynamic (Long-Term)',
    desc: 'Long-term cross-session store capturing curated facts, rules, and decisions with recency & reusability metadata.',
    badgeColor: 'text-purple-300 bg-purple-500/10 border-purple-500/30',
  },
  {
    id: 'agents_md',
    name: 'Agents.md',
    format: 'Markdown file',
    organization: 'Curated',
    volatility: 'Static',
    desc: 'Static, curated project instructions and conventions loaded consistently across sessions.',
    badgeColor: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
  },
] as const;

const SOURCE_RANKS: Record<SourceRankId, {
  rank: string;
  label: string;
  medals: string;
  origin: string;
  example: string;
  traceSnippet: string;
  color: string;
}> = {
  user_direct: {
    rank: 'Rank 1 (Highest Trust)',
    label: 'user_direct',
    medals: '3 Medals',
    origin: 'Direct response from the user to the AskUser tool.',
    example: '"Archive marketing emails..."',
    traceSnippet: 'Tool Output: ask_user -> "Mark marketing emails as read and archive them."',
    color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
  },
  user_indirect: {
    rank: 'Rank 2 (Medium Trust)',
    label: 'user_indirect',
    medals: '2 Medals',
    origin: 'Inferred by the model from user messages in chat history.',
    example: '"Robert and Jeff are working together on a new product..."',
    traceSnippet: 'User Message -> "Robert is sending me a marketing email this week about our product launch..."',
    color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
  },
  model: {
    rank: 'Rank 3 (Lowest Trust)',
    label: 'model',
    medals: '1 Medal',
    origin: 'Model reflections on its own reasoning and execution work.',
    example: '"4+ steps lead to successful outcomes on complex queries..."',
    traceSnippet: 'Reasoning Trace -> query plan: step 1 -> step 2 -> step 3 -> step 4',
    color: 'border-purple-500/40 bg-purple-950/20 text-purple-300',
  },
};

const UPDATE_OPS: Record<UpdateOpId, {
  title: string;
  badge: string;
  reconcilable: string;
  whenUsed: string;
  existingRecord: string;
  incomingRecord: string;
  storedResult: string[];
  note: string;
}> = {
  override: {
    title: 'Override',
    badge: 'Lossy',
    reconcilable: 'No (Conflicting / Superseding)',
    whenUsed: 'New information replaces the old information.',
    existingRecord: 'Robert is an engineer',
    incomingRecord: 'Robert is a researcher',
    storedResult: ['Robert is a researcher'],
    note: 'Overriding is a lossy operation on memory records — the previous role ("engineer") is discarded.',
  },
  merge: {
    title: 'Merge',
    badge: 'Combined',
    reconcilable: 'Yes (Compatible Detail)',
    whenUsed: 'New information adds a compatible detail to the existing memory.',
    existingRecord: 'Robert is an engineer',
    incomingRecord: 'Robert is a researcher',
    storedResult: ['Robert is a research engineer'],
    note: 'Merging synthesizes both facts into a single richer record without duplicating entries.',
  },
  version: {
    title: 'Version',
    badge: 'Lossless',
    reconcilable: 'Yes / No (History Required)',
    whenUsed: 'Earlier information must stay available alongside the new fact.',
    existingRecord: 'Robert is an engineer',
    incomingRecord: 'Robert is a researcher',
    storedResult: ['V1: Robert is an engineer', 'V2: Robert is a researcher'],
    note: 'Versioning is lossless — both historical state (V1) and current state (V2) are preserved.',
  },
};

const READ_SCENARIOS = [
  {
    task: 'Draft a reply to Robert about the Q2 product launch email.',
    shouldSearch: true,
    reason: 'Involves a person (Robert), an ongoing project (product launch), and prior communication rules — search_memory should be called.',
  },
  {
    task: 'Convert 100 USD to EUR using the standard exchange rate formula.',
    shouldSearch: false,
    reason: 'Clearly self-contained calculation with no dependency on people, projects, or earlier decisions — skip memory search.',
  },
  {
    task: 'Organize my unread inbox according to my usual preferences.',
    shouldSearch: true,
    reason: 'Depends on user-specific rules and earlier decisions stored in long-term memory (e.g., archiving marketing emails).',
  },
] as const;

const SAMPLE_MEMORY_RECORDS = [
  {
    id: 1,
    data: 'star every email from Robert',
    metadata: {
      time_created: '2026-03-14',
      last_accessed: '2026-03-16',
      source: 'user_direct',
      access_count: 3,
      type: 'rule',
    },
  },
  {
    id: 2,
    data: 'mark marketing read, archive',
    metadata: {
      time_created: '2026-03-12',
      last_accessed: '2026-03-16',
      source: 'user_direct',
      access_count: 5,
      type: 'rule',
    },
  },
  {
    id: 3,
    data: "Robert is Jeff's coworker",
    metadata: {
      time_created: '2026-03-10',
      last_accessed: '2026-03-15',
      source: 'user_indirect',
      access_count: 2,
      type: 'fact',
    },
  },
  {
    id: 4,
    data: "example of Jeff's writing style",
    metadata: {
      time_created: '2026-03-08',
      last_accessed: '2026-03-11',
      source: 'model',
      access_count: 1,
      type: 'artifact',
    },
  },
] as const;

export const AgenticMemoryVisualizer: React.FC = () => {
  const [modalImage, setModalImage] = useState<ModalImageState | null>(null);

  // Section 1: Data Source Selection
  const [selectedSourceId, setSelectedSourceId] = useState<string>('memories');

  // Section 2: Phase 1 & Phase 2 Interactive State
  const [selectedRank, setSelectedRank] = useState<SourceRankId>('user_direct');
  const [selectedUpdateOp, setSelectedUpdateOp] = useState<UpdateOpId>('merge');

  // Section 3: Reading Memories Mode & Scenario Tester
  const [readMode, setReadMode] = useState<ReadModeId>('tool');
  const [scenarioIdx, setScenarioIdx] = useState<number>(0);

  // Section 4: Vector Store Record Inspector
  const [selectedRecordId, setSelectedRecordId] = useState<number>(1);

  const activeSource = DATA_SOURCES.find((d) => d.id === selectedSourceId) ?? DATA_SOURCES[2];
  const activeRank = SOURCE_RANKS[selectedRank];
  const activeUpdateOp = UPDATE_OPS[selectedUpdateOp];
  const activeScenario = READ_SCENARIOS[scenarioIdx];
  const activeRecord = SAMPLE_MEMORY_RECORDS.find((r) => r.id === selectedRecordId) ?? SAMPLE_MEMORY_RECORDS[0];

  return (
    <div className="space-y-12">
      {/* ========================================================= */}
      {/* SECTION 1: SCRATCHPADS VS MEMORIES & DATA SOURCES         */}
      {/* ========================================================= */}
      <section id="section-memory-vs-scratchpad" className="space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Layers className="h-4 w-4" /> Section 1 · Complementary Memory Systems
          </div>
          <h2 className="text-2xl font-bold text-white">
            Scratchpads (Short-Term) vs. Memories (Long-Term)
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            <strong className="text-slate-200">Scratchpads and memories are complementary:</strong> scratchpads store raw, short-term snapshots during a single session, whereas memories (typically backed by a <strong className="text-slate-200">Vector Store</strong>) persist curated digests—facts, rules, personal info, and past decisions—across sessions.
          </p>
        </div>

        {/* Interactive Data Sources Explorer */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-bold text-white">
              Data Sources for Storing Context (Raw ↔ Curated · Dynamic ↔ Static)
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Click a store to inspect its role
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {DATA_SOURCES.map((ds) => {
              const active = ds.id === selectedSourceId;
              return (
                <button
                  key={ds.id}
                  onClick={() => setSelectedSourceId(ds.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all space-y-1.5 cursor-pointer ${
                    active
                      ? 'bg-purple-950/30 border-purple-500/40 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-sm font-bold text-white">{ds.name}</div>
                  <div className="text-[11px] font-mono text-slate-400">{ds.format}</div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${ds.badgeColor}`}>
                      {ds.organization}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {ds.volatility}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
            <ArrowRight className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-mono font-bold text-white">{activeSource.name} ({activeSource.format}): </span>
              {activeSource.desc}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FigureCard
            figureNumber={1}
            title="Scratchpads and Memories Are Complementary"
            src="/images/ctx_memory_scratchpad_vs_memory.png"
            alt="Comparison table of Scratchpad vs Memory across data source, persistence, format, and purpose"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={2}
            title="Data Sources for Storing Context (Raw vs. Curated)"
            src="/images/ctx_memory_data_sources.png"
            alt="2D chart mapping Message history, Scratchpads, Memories, and Agents.md on raw/curated and dynamic/static axes"
            onExpand={setModalImage}
          />
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: WRITING MEMORIES (2-PHASE HOOK PIPELINE)       */}
      {/* ========================================================= */}
      <section id="section-writing-memories" className="space-y-6 pt-2">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <GitBranch className="h-4 w-4" /> Section 2 · Writing Memories (Post-Session Hook)
          </div>
          <h2 className="text-2xl font-bold text-white">
            Two-Phase Memory Writing: Generate &amp; Reconcile
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Adding information into memories runs via a post-session hook (<code className="text-purple-300 font-mono text-xs">write_memories(...)</code>) that reads the JSONL message history and writes curated records into the Vector Store in <strong className="text-slate-200">two phases</strong>: first generating a candidate record, then comparing it against existing memories.
          </p>
        </div>

        <FigureCard
          figureNumber={3}
          title="When Are Records Written to Memory? (Phase 1 & Phase 2)"
          src="/images/ctx_memory_write_phases.png"
          alt="Post-session write_memories hook diagram showing Phase 1 Extract/Summarize and Phase 2 Add/Update/No-Op"
          onExpand={setModalImage}
        />

        {/* Phase 1: Source Provenance Ranking */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-mono font-bold uppercase text-purple-400">
                Phase 1 · Generate a New Record
              </div>
              <h3 className="text-base font-bold text-white">
                3-Tier Source Provenance Ranking in Chat History Metadata
              </h3>
            </div>
            <div className="flex gap-2">
              {(['user_direct', 'user_indirect', 'model'] as const).map((rankKey) => (
                <button
                  key={rankKey}
                  onClick={() => setSelectedRank(rankKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                    selectedRank === rankKey
                      ? 'bg-purple-500/20 border-purple-500/40 text-purple-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {rankKey}
                </button>
              ))}
            </div>
          </div>

          <div className={`p-4 rounded-xl border space-y-2 ${activeRank.color}`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-mono font-bold flex items-center gap-1.5">
                <Award className="h-4 w-4" /> {activeRank.rank} — <code className="underline">{activeRank.label}</code>
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/30">
                {activeRank.medals}
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {activeRank.origin} Example: <span className="italic text-white">{activeRank.example}</span>
            </p>
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-300">
              {activeRank.traceSnippet}
            </div>
          </div>
        </div>

        {/* Phase 2: Compare & Update Operations */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-mono font-bold uppercase text-purple-400">
                Phase 2 · Compare New Record to Old Records
              </div>
              <h3 className="text-base font-bold text-white">
                Duplicate Check (ADD / NO-OP / UPDATE) &amp; Update Operations
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                A newly generated record does not automatically enter memory—it is compared against existing records to trigger <code className="text-slate-200">ADD</code> (not a duplicate), <code className="text-slate-200">NO-OP</code> (exact duplicate), or <code className="text-slate-200">UPDATE</code> (near duplicate).
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              {(['override', 'merge', 'version'] as const).map((opKey) => (
                <button
                  key={opKey}
                  onClick={() => setSelectedUpdateOp(opKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border capitalize transition-all cursor-pointer ${
                    selectedUpdateOp === opKey
                      ? 'bg-purple-500/20 border-purple-500/40 text-purple-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {opKey}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="text-[11px] text-slate-400 uppercase font-bold">Inputs Being Compared</div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
                Existing: &ldquo;{activeUpdateOp.existingRecord}&rdquo;
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-cyan-300">
                New: &ldquo;{activeUpdateOp.incomingRecord}&rdquo;
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 uppercase font-bold">Operation</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  {activeUpdateOp.badge}
                </span>
              </div>
              <div className="text-sm font-bold text-white">{activeUpdateOp.title}</div>
              <div className="text-slate-400 font-sans text-xs">
                Reconcilable: <strong className="text-slate-200">{activeUpdateOp.reconcilable}</strong>
              </div>
              <p className="text-slate-400 font-sans text-xs leading-relaxed">
                {activeUpdateOp.whenUsed}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
              <div className="text-[11px] text-emerald-400 uppercase font-bold">What Is Stored</div>
              {activeUpdateOp.storedResult.map((res, i) => (
                <div key={i} className="p-2 rounded bg-slate-950/90 border border-emerald-500/20 text-emerald-200">
                  {res}
                </div>
              ))}
              <p className="text-[11px] font-sans text-slate-300 pt-1 leading-relaxed">
                {activeUpdateOp.note}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <FigureCard
            figureNumber={4}
            title="Phase 1: Source Provenance Ranking"
            src="/images/ctx_memory_source_ranking.png"
            alt="Phase 1 source ranking diagram showing user direct, user indirect, and model"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={5}
            title="Phase 2: Comparing New vs. Old Records"
            src="/images/ctx_memory_compare_records.png"
            alt="Phase 2 decision flowchart for ADD, NO-OP, UPDATE, MERGE, OVERRIDE, and VERSIONING"
            onExpand={setModalImage}
          />
          <FigureCard
            figureNumber={6}
            title="Operations for Updating Records"
            src="/images/ctx_memory_update_operations.png"
            alt="Table comparing Override, Merge, and Version operations on memory records"
            onExpand={setModalImage}
          />
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: READING MEMORIES (HOOK VS TOOL + PROMPT)       */}
      {/* ========================================================= */}
      <section id="section-reading-memories" className="space-y-6 pt-2">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Search className="h-4 w-4" /> Section 3 · Reading Memories
          </div>
          <h2 className="text-2xl font-bold text-white">
            Two Ways to Trigger Memory Retrieval: Hooks vs. <code className="text-purple-300">search_memory</code> Tool
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Reading memories can be triggered automatically via a <strong className="text-slate-200">hook</strong> or exposed as a <strong className="text-slate-200">retrieval tool</strong> (<code className="text-purple-300 font-mono text-xs">search_memory</code>) steered by the System Prompt. By default, the agent should search for memories whenever a task involves people, projects, or earlier decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setReadMode('hook')}
            className={`text-left p-5 rounded-2xl border transition-all space-y-2 cursor-pointer ${
              readMode === 'hook'
                ? 'bg-purple-950/30 border-purple-500/40 shadow-lg'
                : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-mono font-bold uppercase text-purple-400">
              Trigger 1 · Pre-Turn Hook
            </div>
            <h3 className="text-base font-bold text-white">Automatic Hook Injection</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The harness automatically queries the memory Vector Store before the model call and injects relevant memories into context—zero tool-call round-trip required.
            </p>
          </button>

          <button
            onClick={() => setReadMode('tool')}
            className={`text-left p-5 rounded-2xl border transition-all space-y-2 cursor-pointer ${
              readMode === 'tool'
                ? 'bg-cyan-950/30 border-cyan-500/40 shadow-lg'
                : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-mono font-bold uppercase text-cyan-400">
              Trigger 2 · System Prompt + Tool
            </div>
            <h3 className="text-base font-bold text-white">Model-Invoked <code className="text-cyan-300">search_memory</code> Tool</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              System Prompt instructs: &ldquo;Search for memories when the task involves people, projects or earlier decisions. Don&apos;t search for memories only in cases where the task is clearly self-contained.&rdquo;
            </p>
          </button>
        </div>

        {/* Interactive Scenario Tester */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs font-mono font-bold uppercase text-purple-300 flex items-center gap-2">
              <Terminal className="h-4 w-4" /> System Prompt Decision Tester ({readMode === 'hook' ? 'Hook Always Fires' : 'Tool Decision'})
            </div>
            <div className="flex gap-2">
              {READ_SCENARIOS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setScenarioIdx(i)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border cursor-pointer ${
                    scenarioIdx === i
                      ? 'bg-purple-500/20 border-purple-500/40 text-purple-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Task {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="text-sm font-semibold text-white">
              User Task: &ldquo;{activeScenario.task}&rdquo;
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-mono font-bold border ${
              activeScenario.shouldSearch
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}>
              {activeScenario.shouldSearch ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Call search_memory()
                </>
              ) : (
                <>
                  <XCircle className="h-3.5 w-3.5" /> Skip search_memory() (Self-Contained)
                </>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{activeScenario.reason}</p>
          </div>
        </div>

        <FigureCard
          figureNumber={7}
          title="System Prompt Guiding search_memory Tool Invocation"
          src="/images/ctx_memory_reading_system_prompt.png"
          alt="System prompt diagram showing search_memory tool input and output in context window"
          onExpand={setModalImage}
        />
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: VECTOR STORE SCHEMA (DATA + METADATA)          */}
      {/* ========================================================= */}
      <section id="section-vector-schema" className="space-y-6 pt-2">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Database className="h-4 w-4" /> Section 4 · Vector Store Schema
          </div>
          <h2 className="text-2xl font-bold text-white">
            Memory Record Structure: Clear <code className="text-purple-300">data</code> + Recency &amp; Reusability <code className="text-purple-300">metadata</code>
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Each memory in the Vector Store pairs clearly formatted <code className="text-purple-300 font-mono text-xs">data</code> with structured <code className="text-purple-300 font-mono text-xs">metadata</code> indicating <strong className="text-slate-200">recency</strong> (<code className="text-slate-200 font-mono text-xs">time_created</code>, <code className="text-slate-200 font-mono text-xs">last_accessed</code>) and <strong className="text-slate-200">reusability / provenance</strong> (<code className="text-slate-200 font-mono text-xs">source</code>, <code className="text-slate-200 font-mono text-xs">access_count</code>, <code className="text-slate-200 font-mono text-xs">type</code>).
          </p>
        </div>

        {/* Interactive Record Inspector */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-6 space-y-2">
              <div className="text-xs font-mono font-bold uppercase text-slate-400">
                Vector Store Memory Records
              </div>
              {SAMPLE_MEMORY_RECORDS.map((rec) => {
                const selected = rec.id === selectedRecordId;
                return (
                  <button
                    key={rec.id}
                    onClick={() => setSelectedRecordId(rec.id)}
                    className={`w-full text-left p-3 rounded-xl border font-mono text-xs transition-all cursor-pointer ${
                      selected
                        ? 'bg-purple-950/30 border-purple-500/40 text-white'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-purple-300">id: {rec.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        type: {rec.metadata.type}
                      </span>
                    </div>
                    <div className="mt-1 text-slate-200">data: {rec.data}</div>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-6 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-purple-300 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> Record #{activeRecord.id} Metadata
                </span>
                <span className="text-[11px] font-mono text-slate-400">Recency + Reusability</span>
              </div>
              <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
{JSON.stringify(activeRecord.metadata, null, 2)}
              </pre>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-sans">
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>Recency via timestamps</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>Reusability via access_count</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Trust via source</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <FigureCard
          figureNumber={8}
          title="Vector Store of Memory Records & Metadata Fields"
          src="/images/ctx_memory_vector_store_schema.png"
          alt="Vector store memory records diagram showing data and metadata including time_created, last_accessed, source, access_count, and type"
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
              <span>Source: Agentic Memory.docx</span>
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
