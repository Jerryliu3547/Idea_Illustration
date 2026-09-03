"use client";

import React, { useState, useEffect } from 'react';
import { getAssetPath } from '@/lib/asset';
import { MathFormula } from '@/components/ui/MathFormula';
import { 
  ListTree, 
  Sparkles, 
  Bookmark, 
  ArrowUp,
  CheckCircle2,
  XCircle,
  Search,
  Brain,
  FileText,
  ExternalLink,
  Workflow,
  TrendingUp,
  BarChart2,
  Play,
  RotateCcw,
  GitBranch,
  Layers,
  Zap,
  Check,
  Copy,
  Sliders,
  HelpCircle,
  ChevronRight,
  Target
} from 'lucide-react';

export const TreeOfThoughtsVisualizer: React.FC = () => {
  // Navigation & Tab States
  const [activeParadigmTab, setActiveParadigmTab] = useState<'tot' | 'cot_sc' | 'cot' | 'io'>('tot');
  const [activeTask, setActiveTask] = useState<'game24' | 'creative' | 'crosswords'>('game24');
  const [searchAlgorithm, setSearchAlgorithm] = useState<'bfs' | 'dfs'>('bfs');
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('root');
  const [copiedBibtex, setCopiedBibtex] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // BibTeX string for arXiv:2305.10601
  const bibtexCitation = `@inproceedings{yao2023tree,
  title={Tree of thoughts: Deliberate problem solving with large language models},
  author={Yao, Shunyu and Yu, Dian and Zhao, Jeffrey and Shafran, Izhak and Griffiths, Thomas L and Cao, Yuan and Narasimhan, Karthik},
  booktitle={Advances in Neural Information Processing Systems (NeurIPS)},
  volume={36},
  year={2023}
}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  // Game of 24 Tree Data structure for simulation
  // Input: [4, 9, 10, 13] -> Target: 24
  const game24Nodes = [
    {
      id: 'root',
      level: 0,
      label: 'Root State s_0',
      thought: 'Input numbers: [4, 9, 10, 13]',
      valueScore: 1.0,
      status: 'root',
      statusLabel: 'Initial State',
      remainingNumbers: '[4, 9, 10, 13]',
      evalDetails: 'Initial 4 numbers provided by Game of 24 prompt.',
      parentId: null
    },
    // Level 1 Nodes
    {
      id: 'node1_1',
      level: 1,
      label: 'Thought 1.1',
      thought: '13 - 9 = 4 (remaining: 4, 4, 10)',
      valueScore: 0.9,
      status: 'sure',
      statusLabel: 'Sure (v=0.9)',
      remainingNumbers: '[4, 4, 10]',
      evalDetails: 'State Evaluator V(s): 10 + 4 + 4 = 18, 10 * 4 / 4... Can make 24 with (10-4)*4 = 24! High probability of success.',
      parentId: 'root'
    },
    {
      id: 'node1_2',
      level: 1,
      label: 'Thought 1.2',
      thought: '10 * 13 = 130 (remaining: 4, 9, 130)',
      valueScore: 0.05,
      status: 'impossible',
      statusLabel: 'Impossible (v=0.05)',
      remainingNumbers: '[4, 9, 130]',
      evalDetails: 'State Evaluator V(s): 130 is far too large to reach 24 with remaining numbers 4 and 9 using basic arithmetic. PRUNED.',
      parentId: 'root'
    },
    {
      id: 'node1_3',
      level: 1,
      label: 'Thought 1.3',
      thought: '13 + 4 = 17 (remaining: 9, 10, 17)',
      valueScore: 0.4,
      status: 'likely',
      statusLabel: 'Likely (v=0.4)',
      remainingNumbers: '[9, 10, 17]',
      evalDetails: 'State Evaluator V(s): 17 + 10 - 9 = 18, 17 - 9 = 8. Might be possible, but 1.1 is strictly more promising.',
      parentId: 'root'
    },
    // Level 2 Nodes (from 1.1)
    {
      id: 'node2_1',
      level: 2,
      label: 'Thought 2.1',
      thought: '10 - 4 = 6 (remaining: 4, 6)',
      valueScore: 1.0,
      status: 'sure',
      statusLabel: 'Sure (v=1.0)',
      remainingNumbers: '[4, 6]',
      evalDetails: 'State Evaluator V(s): 4 * 6 = 24! Direct path to solution detected with 100% certainty.',
      parentId: 'node1_1'
    },
    {
      id: 'node2_2',
      level: 2,
      label: 'Thought 2.2',
      thought: '4 + 4 = 8 (remaining: 8, 10)',
      valueScore: 0.1,
      status: 'impossible',
      statusLabel: 'Impossible (v=0.1)',
      remainingNumbers: '[8, 10]',
      evalDetails: 'State Evaluator V(s): 10 + 8 = 18, 10 - 8 = 2, 10 * 8 = 80, 10 / 8 = 1.25. None equal 24. PRUNED.',
      parentId: 'node1_1'
    },
    // Level 3 Node (Goal)
    {
      id: 'node3_1',
      level: 3,
      label: 'Thought 3.1 (Goal)',
      thought: '4 * 6 = 24 (remaining: 24)',
      valueScore: 1.0,
      status: 'solved',
      statusLabel: 'Goal Reached (24 ✔️)',
      remainingNumbers: '[24]',
      evalDetails: 'SUCCESS: Final arithmetic expression (10 - (13 - 9)) * 4 = 24 verified correct!',
      parentId: 'node2_1'
    }
  ];

  // Simulation Steps Sequence for Game of 24
  const game24Steps = [
    { step: 0, activeNodeId: 'root', title: 'Step 0: Root State Initialization', description: 'Input prompt receives numbers [4, 9, 10, 13]. Tree search begins at root state s_0.', highlightedBeam: ['root'] },
    { step: 1, activeNodeId: 'node1_1', title: 'Step 1: Thought Generation G(s_0, k=3)', description: 'Model proposes 3 candidate first operations: 13-9=4, 10*13=130, 13+4=17.', highlightedBeam: ['node1_1', 'node1_2', 'node1_3'] },
    { step: 2, activeNodeId: 'node1_1', title: 'Step 2: State Evaluation V(s) & Beam Selection', description: 'State Evaluator scores states. Node 1.2 (130) is evaluated as Impossible and pruned. Beam keeps top b=2 states (1.1 and 1.3).', highlightedBeam: ['node1_1', 'node1_3'] },
    { step: 3, activeNodeId: 'node2_1', title: 'Step 3: Expanding Level 1.1 ➔ Level 2', description: 'From Thought 1.1 ([4, 4, 10]), candidate thoughts are proposed. Thought 2.1 (10-4=6) scores v=1.0 (Sure).', highlightedBeam: ['node2_1', 'node2_2'] },
    { step: 4, activeNodeId: 'node3_1', title: 'Step 4: Goal State Reached (Solution Found!)', description: 'Thought 3.1 completes the chain: 4 * 6 = 24! Tree search halts immediately with verified correct output.', highlightedBeam: ['node3_1'] }
  ];

  const currentStepInfo = game24Steps[simulationStep];
  const currentNodeData = game24Nodes.find(n => n.id === selectedNodeId) || game24Nodes[0];

  // Timer for Auto-play
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setSimulationStep(prev => {
          if (prev >= game24Steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, game24Steps.length]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold uppercase tracking-wider">
            <ListTree className="h-4 w-4" /> Deliberate Problem Solving & Tree Search
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" /> NeurIPS 2023 / arXiv:2305.10601
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Tree of Thoughts (ToT): Deliberate Problem Solving with LLMs
        </h1>
        <p className="text-slate-400 mt-2 text-base leading-relaxed">
          Tree of Thoughts (ToT) generalizes Chain-of-Thought prompting by allowing Large Language Models to explore multiple reasoning paths simultaneously in a tree structure. By evaluating intermediate state quality <MathFormula math="v(s)" /> and executing tree search algorithms (BFS and DFS with backtracking), ToT enables System 2 deliberate reasoning and solves complex tasks where standard prompting fails.
        </p>
      </div>

      {/* QUICK SECTION BOOKMARK NAVIGATION BAR */}
      <div className="sticky top-2 z-30 bg-slate-950/95 backdrop-blur-md border border-cyan-500/40 rounded-2xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
          <Bookmark className="h-4 w-4 text-cyan-400" />
          <span>Quick Section Bookmarks:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
          <button
            onClick={() => document.getElementById('section-paradigms')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Workflow className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="font-semibold truncate">1. 4 Paradigms</span>
          </button>

          <button
            onClick={() => document.getElementById('section-formulation')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <Brain className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span className="font-semibold truncate">2. Formulation</span>
          </button>

          <button
            onClick={() => document.getElementById('section-simulator')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <GitBranch className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold truncate">3. Interactive Tree</span>
          </button>

          <button
            onClick={() => document.getElementById('section-benchmarks')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-start gap-2 text-left"
          >
            <TrendingUp className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold truncate">4. Benchmarks</span>
          </button>

          <button
            onClick={() => document.getElementById('section-paper')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-rose-500/20 text-slate-200 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-all flex items-center justify-start gap-2 text-left col-span-2 sm:col-span-1"
          >
            <FileText className="h-3.5 w-3.5 text-rose-400 shrink-0" />
            <span className="font-semibold truncate">5. Paper Reference</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Original Paper Paradigm Schematic (Yao et al. Figure 1) */}
      <div id="section-paradigms" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-cyan-400" /> ORIGINAL PAPER SCHEMATIC (YAO ET AL. FIGURE 1)
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            From IO Prompting to Tree of Thoughts
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Comparing how each problem-solving paradigm structures language model generation, thought evaluation, and search.
          </p>
        </div>

        {/* Paper Figure 1 Image Display Container */}
        <div className="bg-slate-950 p-4 sm:p-6 rounded-2xl border-2 border-cyan-500/50 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-400" /> Figure 1: Schematic Illustrating Various Approaches to Problem Solving with LLMs
            </span>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
              Yao et al. (2023) / NeurIPS 2023
            </span>
          </div>

          <div className="rounded-xl overflow-hidden bg-white p-3 border border-slate-700 shadow-inner flex justify-center">
            <img 
              src={getAssetPath('/images/tot_schematic.png')} 
              alt="Figure 1: Schematic illustrating various approaches to problem solving with LLMs: (a) Input-Output Prompting (IO), (b) Chain of Thought Prompting (CoT), (c) Self Consistency with CoT (CoT-SC), and (d) Tree of Thoughts (ToT)."
              className="max-h-[480px] w-auto object-contain rounded"
            />
          </div>

          <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed font-sans">
            <div className="font-mono font-bold text-cyan-400 text-xs uppercase tracking-wider flex items-center justify-between">
              <span>Paper Caption & Visual Legend:</span>
              <span className="text-[10px] text-slate-400 font-normal">arXiv:2305.10601</span>
            </div>
            <p className="italic text-slate-300 text-[11px]">
              &quot;Figure 1: Schematic illustrating various approaches to problem solving with LLMs. Each rectangle box represents a <strong>thought</strong>, which is a coherent language sequence that serves as an intermediate step toward problem solving. See concrete examples of how thoughts are generated, evaluated, and searched in Figures 2, 4, 6.&quot;
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] font-mono pt-1">
              <span className="px-2 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800">⬜ Grey Rectangle: Thought <MathFormula math="z_t" /></span>
              <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">🟩 Green Box: Promising State <MathFormula math="v(s) \approx 1" /></span>
              <span className="px-2 py-1 rounded bg-rose-950 text-rose-300 border border-rose-500/40">🟥 Light Red Box: Pruned Dead-End <MathFormula math="v(s) \approx 0" /></span>
              <span className="px-2 py-1 rounded bg-purple-950 text-purple-300 border border-purple-500/40">🟢 Oval: Input / Output State</span>
            </div>
          </div>
        </div>

        {/* 4 Paradigms Side-by-Side Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* (a) Input-Output Prompting */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-rose-500/30 space-y-3 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-mono font-bold text-rose-400 text-xs flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-rose-400" /> (a) Input-Output (IO)
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                  7.3% Game of 24
                </span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed font-sans">
                <strong>How it Works:</strong> Direct mapping from input to output (<MathFormula math="x \to y" />). No intermediate reasoning thoughts or scratchpad computation.
              </p>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-rose-300">
              <strong>Limitation:</strong> Lacks step-by-step reasoning tokens; fails complex planning tasks.
            </div>
          </div>

          {/* (b) Chain of Thought Prompting */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-indigo-500/30 space-y-3 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-mono font-bold text-indigo-300 text-xs flex items-center gap-1.5">
                  <Brain className="h-4 w-4 text-indigo-400" /> (b) Chain-of-Thought
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  4.0% Game of 24
                </span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed font-sans">
                <strong>How it Works:</strong> Generates a single linear sequence of thoughts (<MathFormula math="x \to z_1 \to z_2 \to \dots \to y" />) before producing final output.
              </p>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-indigo-300">
              <strong>Limitation:</strong> Single linear path without lookahead or backtracking from early errors.
            </div>
          </div>

          {/* (c) Self Consistency with CoT */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-purple-500/30 space-y-3 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-mono font-bold text-purple-300 text-xs flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-purple-400" /> (c) CoT Self-Consistency
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  9.0% Game of 24
                </span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed font-sans">
                <strong>How it Works:</strong> Samples <MathFormula math="k" /> independent CoT chains and takes a <strong>Majority Vote</strong> over final output answers.
              </p>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-purple-300">
              <strong>Limitation:</strong> Independent chains cannot share or evaluate intermediate state nodes.
            </div>
          </div>

          {/* (d) Tree of Thoughts */}
          <div className="bg-slate-950 p-5 rounded-2xl border-2 border-cyan-500/60 shadow-2xl shadow-cyan-500/10 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-mono font-bold text-cyan-300 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" /> (d) Tree of Thoughts
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  74.0% Game of 24 🚀
                </span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed font-sans">
                <strong>How it Works:</strong> Frames reasoning as tree search over thought states <MathFormula math="s = [x, z_{1..t}]" />. Generates candidate thoughts <MathFormula math="G(s, k)" />, evaluates state quality <MathFormula math="V(s)" /> (Dark Green = Promising, Light Red = Pruned), and executes BFS/DFS tree search with backtracking.
              </p>
            </div>
            <div className="p-2.5 bg-cyan-950/40 rounded-xl border border-cyan-500/40 text-xs font-mono text-cyan-200">
              <strong>Key Breakthrough:</strong> System 2 deliberate search enables global lookahead & error recovery!
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Algorithmic Formulation & Math */}
      <div id="section-formulation" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-purple-500/40 bg-gradient-to-br from-purple-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Brain className="h-4 w-4 text-purple-400" /> FORMAL MATHEMATICAL SPECIFICATION
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            The Four Building Blocks of ToT
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            ToT abstracts problem solving into four modular components parameterized by the LLM <MathFormula math="p_\theta" />.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
          {/* Component 1: Thought Decomposition */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-cyan-400 font-bold block uppercase text-xs">1. Thought Decomposition</span>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">State Partitioning</span>
            </div>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              Decomposes the overall solution into intermediate thought steps <MathFormula math="z_t" />. Depending on the problem domain:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 font-sans text-xs">
              <li><strong>Game of 24:</strong> A single arithmetic step (e.g. &quot;13 - 9 = 4&quot;).</li>
              <li><strong>Creative Writing:</strong> A 1-sentence paragraph outline.</li>
              <li><strong>Mini Crosswords:</strong> A candidate word clue entry.</li>
            </ul>
          </div>

          {/* Component 2: Thought Generator */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/40 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-purple-400 font-bold block uppercase text-xs">2. Thought Generator <MathFormula math="G(p_\theta, s, k)" /></span>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">Temperature vs. Prompt Control</span>
            </div>
            <div className="space-y-2 text-slate-300 font-sans text-xs leading-relaxed">
              <p>Generates <MathFormula math="k" /> candidate next thoughts for state <MathFormula math="s = [x, z_{1..t}]" /> tailored to the task search landscape:</p>
              
              <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-500/40 space-y-2 font-mono text-xs">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-purple-300 font-bold">
                    <span>1. Sample i.i.d. (<MathFormula math="z^{(i)} \sim p_\theta" />)</span>
                    <span className="text-[11px] bg-purple-500/20 text-purple-200 px-1.5 py-0.5 rounded border border-purple-500/30">Control: Temperature (T &gt; 0)</span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs leading-relaxed">
                    <strong>Used for Rich / Open-Ended Spaces (e.g. Creative Writing):</strong> Generates <MathFormula math="k" /> independent completions in parallel. Temperature <MathFormula math="T > 0" /> promotes diverse story/outline directions where the search space is infinite (<MathFormula math="\mathbb{R}^\infty" />).
                  </p>
                </div>

                <div className="pt-2 border-t border-purple-500/30 space-y-1">
                  <div className="flex items-center justify-between text-cyan-300 font-bold">
                    <span>2. Propose Sequentially</span>
                    <span className="text-[11px] bg-cyan-500/20 text-cyan-200 px-1.5 py-0.5 rounded border border-cyan-500/30">Control: In-Context Prompting</span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs leading-relaxed">
                    <strong>Used for Constrained Spaces (e.g. Game of 24, Crosswords):</strong> Requests all <MathFormula math="k" /> distinct candidates in one prompt. In-context attention prevents generating duplicate moves and avoids wasting search budget.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Component 3: State Evaluator */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-emerald-400 font-bold block uppercase text-xs">3. State Evaluator Prompt <MathFormula math="V(p_\theta, S)" /></span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Anticipatory & In-Context</span>
            </div>
            <div className="space-y-2 text-slate-300 font-sans text-xs leading-relaxed">
              <p>Evaluates state promisingness to act as a heuristic guide for lookahead search:</p>
              
              {/* Anticipatory & In-Context Callout */}
              <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/40 space-y-1.5">
                <span className="text-emerald-300 font-mono font-bold text-xs block flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> Anticipatory & In-Context Projection:
                </span>
                <p className="text-slate-200 font-sans text-xs leading-relaxed">
                  The prompt explicitly instructs the LLM to mentally project 1–2 forward moves (e.g., &quot;can <MathFormula math="\{5, 5, 14\}" /> reach 24 via <MathFormula math="5 + 5 + 14 = 24" />?&quot;) to determine the score <MathFormula math="v(s)" />.
                </p>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 font-mono text-xs">
                <p>• <strong>Value Evaluation:</strong> LLM evaluates state <MathFormula math="s" /> independently ➔ <MathFormula math="v(s) \in \{ \text{Sure}, \text{Likely}, \text{Impossible} \}" /> or scalar score.</p>
                <p>• <strong>Vote Evaluation:</strong> LLM compares sibling states and votes ➔ <MathFormula math="v(s) = \mathbb{I}(s \in \text{top-}b)" />.</p>
              </div>
            </div>
          </div>

          {/* Component 4: Search Algorithm */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-amber-400 font-bold block uppercase text-xs">4. Search Algorithm (BFS / DFS)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Lookahead & Pruning</span>
            </div>
            <div className="space-y-2 text-slate-300 font-sans text-[11px] leading-relaxed">
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1 font-mono text-[10px]">
                <p>• <strong>Breadth-First Search (BFS):</strong> Maintains top-<MathFormula math="b" /> beam of states at each level. Ideal for shallow, fixed-depth tasks (Game of 24, Creative Writing).</p>
                <p>• <strong>Depth-First Search (DFS):</strong> Explores most promising branch first. Prunes when <MathFormula math="v(s) \le \tau" /> and backtracks to parent node. Ideal for deep search (Crosswords).</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Interactive Tree Search Visualizer & Simulator */}
      <div id="section-simulator" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <GitBranch className="h-4 w-4 text-emerald-400" /> LIVE INTERACTIVE TREE SEARCH SIMULATOR
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Game of 24 Case Study: Interactive ToT Beam Search
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Input numbers: <code className="text-cyan-300 font-mono font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">[4, 9, 10, 13]</code> ➔ Target sum: <code className="text-emerald-400 font-mono font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">24</code>
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setSimulationStep(0);
                setSelectedNodeId('root');
                setIsPlaying(false);
              }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
              title="Reset Search Simulation"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                isPlaying ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Play className={`h-3.5 w-3.5 ${isPlaying ? 'fill-slate-950' : 'fill-slate-200'}`} />
              <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setSimulationStep(prev => Math.min(prev + 1, game24Steps.length - 1));
              }}
              disabled={simulationStep >= game24Steps.length - 1}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <span>Next Search Step ({simulationStep + 1}/{game24Steps.length})</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Current Step Description Card */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/30 text-xs font-mono space-y-1">
          <div className="flex items-center justify-between text-emerald-400 font-bold uppercase text-[11px]">
            <span>{currentStepInfo.title}</span>
            <span className="text-slate-400 font-normal">Active Beam: [{currentStepInfo.highlightedBeam.join(', ')}]</span>
          </div>
          <p className="text-slate-300 font-sans text-xs leading-relaxed">{currentStepInfo.description}</p>
        </div>

        {/* Main Grid: Tree Graph (Left 7 cols) vs Node Inspector (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Tree Graph Visual (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6 overflow-x-auto shadow-2xl">
            {/* Level 0: Root */}
            <div className="flex justify-center">
              <div
                onClick={() => setSelectedNodeId('root')}
                className={`p-3.5 rounded-xl border cursor-pointer font-mono text-xs text-center transition-all ${
                  selectedNodeId === 'root'
                    ? 'bg-cyan-950/60 border-cyan-400 ring-2 ring-cyan-500/50 shadow-lg scale-105'
                    : currentStepInfo.highlightedBeam.includes('root')
                    ? 'bg-slate-900 border-cyan-500/60 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 opacity-60'
                }`}
              >
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Level 0 (Root)</span>
                <span className="text-white font-bold text-xs block mt-0.5">Input: [4, 9, 10, 13]</span>
              </div>
            </div>

            {/* Tree Branch Connectors */}
            <div className="flex justify-around text-slate-700 text-xs font-mono">
              <span>│</span>
              <span>│</span>
              <span>│</span>
            </div>

            {/* Level 1: 3 Candidates */}
            <div className="grid grid-cols-3 gap-3">
              {game24Nodes.filter(n => n.level === 1).map((node) => {
                const isSelected = selectedNodeId === node.id;
                const isInBeam = currentStepInfo.highlightedBeam.includes(node.id);
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-3 rounded-xl border cursor-pointer font-mono text-xs space-y-1.5 transition-all ${
                      isSelected
                        ? 'bg-purple-950/80 border-purple-400 ring-2 ring-purple-500/50 scale-105 shadow-xl'
                        : node.status === 'impossible'
                        ? 'bg-rose-950/20 border-rose-500/30 opacity-40 hover:opacity-80'
                        : isInBeam
                        ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md'
                        : 'bg-slate-900/80 border-slate-800 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-300">{node.label}</span>
                      <span className={`px-1.5 py-0.5 rounded font-bold ${
                        node.status === 'sure' ? 'bg-emerald-500/20 text-emerald-300' :
                        node.status === 'impossible' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        v={node.valueScore}
                      </span>
                    </div>
                    <p className="text-slate-200 text-[11px] leading-tight font-semibold">{node.thought}</p>
                  </div>
                );
              })}
            </div>

            {/* Level 2 Connectors (from Thought 1.1) */}
            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div className="flex justify-around text-slate-700">
                <span>┌───┴───┐</span>
              </div>
              <div className="text-center text-slate-700 font-sans text-[10px] italic">Pruned ❌</div>
              <div className="text-center text-slate-700 font-sans text-[10px] italic">Standby</div>
            </div>

            {/* Level 2 Nodes (from 1.1) */}
            <div className="grid grid-cols-3 gap-3">
              {/* Node 2.1 */}
              <div
                onClick={() => setSelectedNodeId('node2_1')}
                className={`p-3 rounded-xl border cursor-pointer font-mono text-xs space-y-1 transition-all ${
                  selectedNodeId === 'node2_1'
                    ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-500/50 scale-105 shadow-xl'
                    : currentStepInfo.highlightedBeam.includes('node2_1')
                    ? 'bg-emerald-950/40 border-emerald-500/60 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-emerald-400 font-bold">Thought 2.1</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">v=1.0</span>
                </div>
                <p className="text-slate-200 text-[11px]">10 - 4 = 6 (rem: 4, 6)</p>
              </div>

              {/* Node 2.2 */}
              <div
                onClick={() => setSelectedNodeId('node2_2')}
                className={`p-3 rounded-xl border cursor-pointer font-mono text-xs space-y-1 transition-all opacity-40 ${
                  selectedNodeId === 'node2_2' ? 'border-rose-500 opacity-100' : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-rose-400 font-bold">Thought 2.2</span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">v=0.1</span>
                </div>
                <p className="text-slate-200 text-[11px]">4 + 4 = 8 (rem: 8, 10)</p>
              </div>

              <div className="p-3 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 text-[10px] text-slate-500 text-center flex items-center justify-center">
                Unexpanded
              </div>
            </div>

            {/* Level 3 Connector */}
            <div className="flex justify-start pl-[15%] text-slate-700 text-xs font-mono">
              <span>│</span>
            </div>

            {/* Level 3 (Goal Node) */}
            <div className="flex justify-start pl-[5%]">
              <div
                onClick={() => setSelectedNodeId('node3_1')}
                className={`w-2/3 p-3.5 rounded-xl border cursor-pointer font-mono text-xs space-y-1 transition-all ${
                  selectedNodeId === 'node3_1'
                    ? 'bg-emerald-950/90 border-emerald-400 ring-2 ring-emerald-500/60 scale-105 shadow-2xl'
                    : currentStepInfo.highlightedBeam.includes('node3_1')
                    ? 'bg-emerald-950/60 border-emerald-500/80 shadow-xl'
                    : 'bg-slate-900/60 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Goal Reached
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[10px]">Solved 24 ✔️</span>
                </div>
                <p className="text-white font-bold text-sm">4 * 6 = 24</p>
              </div>
            </div>
          </div>

          {/* Node Inspector Panel (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-purple-500/40 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-mono font-bold text-purple-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Search className="h-4 w-4 text-purple-400" /> Node Evaluator Inspector
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {currentNodeData.id}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block font-bold">Node Label:</span>
                <span className="text-white font-bold text-sm">{currentNodeData.label}</span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase block font-bold">Proposed Thought:</span>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-200 leading-relaxed">
                  {currentNodeData.thought}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase block font-bold">State Score V(s):</span>
                  <span className="text-emerald-400 font-bold text-sm">{currentNodeData.valueScore}</span>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase block font-bold">Remaining Numbers:</span>
                  <span className="text-cyan-300 font-bold text-xs">{currentNodeData.remainingNumbers}</span>
                </div>
              </div>

              <div>
                <span className="text-purple-400 text-[10px] uppercase block font-bold">LLM State Evaluation Rationale:</span>
                <p className="p-3 bg-purple-950/30 rounded-xl border border-purple-500/30 text-purple-200 font-sans text-[11px] leading-relaxed">
                  {currentNodeData.evalDetails}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Empirical Results & Benchmark Comparisons */}
      <div id="section-benchmarks" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-amber-400" /> PAPER EXPERIMENTAL BENCHMARKS (YAO ET AL. 2023)
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Empirical Results Across 3 Benchmark Tasks
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Comparing IO, CoT, CoT Self-Consistency, and ToT performance across Game of 24, Creative Writing, and 5x5 Mini Crosswords.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Card 1: Game of 24 */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-cyan-500/40 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-mono font-bold text-cyan-300 text-sm flex items-center gap-2">
                  <Target className="h-4 w-4 text-cyan-400" /> 1. Game of 24 (Math Search)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                  Success Rate %
                </span>
              </div>

              <div className="space-y-2.5 font-mono text-[11px]">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>IO Prompting:</span>
                    <span>7.3%</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-600 w-[7.3%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>CoT Prompting:</span>
                    <span>4.0%</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[4%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>CoT-SC (k=100):</span>
                    <span>9.0%</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-[9%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-cyan-300 font-bold mb-1">
                    <span>ToT (BFS, b=5):</span>
                    <span className="text-cyan-400 font-extrabold text-xs">74.0% 🚀</span>
                  </div>
                  <div className="h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-cyan-500/50">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full w-[74%]" />
                  </div>
                </div>
              </div>
            </div>

            <p className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-sans leading-relaxed">
              <strong>Key Insight:</strong> CoT fails on Game of 24 because local step errors derail the entire chain. ToT’s lookahead and BFS beam search achieve a <strong>10x performance boost</strong>!
            </p>
          </div>

          {/* Card 2: Creative Writing */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-purple-500/40 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-mono font-bold text-purple-300 text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400" /> 2. Creative Writing
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  Coherence Score (1-10)
                </span>
              </div>

              <div className="space-y-2.5 font-mono text-[11px]">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>IO Prompting:</span>
                    <span>5.80 / 10</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-600 w-[58%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>CoT Prompting:</span>
                    <span>6.19 / 10</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-[61.9%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-purple-300 font-bold mb-1">
                    <span>ToT (BFS, b=5):</span>
                    <span className="text-purple-400 font-extrabold text-xs">7.56 / 10 ✨</span>
                  </div>
                  <div className="h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-purple-500/50">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full w-[75.6%]" />
                  </div>
                </div>
              </div>
            </div>

            <p className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-sans leading-relaxed">
              <strong>Key Insight:</strong> Planning paragraph outlines via ToT before writing produces significantly higher narrative cohesion and satisfies target constraint sentences.
            </p>
          </div>

          {/* Card 3: 5x5 Mini Crosswords */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/40 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-mono font-bold text-emerald-300 text-sm flex items-center gap-2">
                  <GridIcon className="h-4 w-4 text-emerald-400" /> 3. 5x5 Mini Crosswords
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Solve Rate %
                </span>
              </div>

              <div className="space-y-2.5 font-mono text-[11px]">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>IO / CoT Prompting:</span>
                    <span>0.0% Puzzles</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-700 w-[1%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-emerald-300 font-bold mb-1">
                    <span>ToT (DFS with Pruning):</span>
                    <span className="text-emerald-400 font-extrabold text-xs">20.0% Puzzles (60% letters)</span>
                  </div>
                  <div className="h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-emerald-500/50">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[60%]" />
                  </div>
                </div>
              </div>
            </div>

            <p className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-sans leading-relaxed">
              <strong>Key Insight:</strong> Crosswords require deep search and backtracking when candidate words clash. ToT DFS is the only method capable of solving non-zero crosswords.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5: Original Research Paper Reference */}
      <div id="section-paper" className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-rose-500/40 bg-gradient-to-br from-rose-950/20 via-slate-900/80 to-slate-950 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-rose-400" /> ORIGINAL RESEARCH PAPER (NeurIPS 2023)
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Tree of Thoughts: Deliberate Problem Solving with Large Language Models
            </h2>
            <p className="text-xs text-slate-300 font-mono">
              Shunyu Yao, Dian Yu, Jeffrey Zhao, Izhak Shafran, Thomas L. Griffiths, Yuan Cao, Karthik Narasimhan
            </p>
            <p className="text-[11px] text-slate-400">
              Princeton University & Google DeepMind
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
            <a
              href="https://arxiv.org/abs/2305.10601"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <ExternalLink className="h-4 w-4 text-cyan-400" />
              <span>ArXiv Abstract</span>
            </a>

            <a
              href="https://arxiv.org/pdf/2305.10601"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 transition-all flex items-center gap-2"
            >
              <FileText className="h-4 w-4 text-purple-400" />
              <span>Open PDF (arXiv:2305.10601)</span>
            </a>
          </div>
        </div>

        {/* Paper Abstract Quote Block */}
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
          &quot;Language models are increasingly deployed for general problem solving across a wide range of tasks, but are still restricted to token-level, left-to-right decision-making processes during inference. This means they can fall short in tasks that require exploration, strategic lookahead, or where initial decisions play a pivotal role. To surmount these challenges, we introduce &apos;Tree of Thoughts&apos; (ToT), which allows LLMs to perform deliberate decision making by considering multiple reasoning paths and self-evaluating choices to decide the next course of action, as well as looking ahead or backtracking when necessary to make global choices.&quot;
        </div>

        {/* BibTeX Citation Copy Block */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">BibTeX Citation:</span>
            <button
              onClick={() => copyToClipboard(bibtexCitation)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-mono flex items-center gap-1.5 transition-all"
            >
              {copiedBibtex ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                  <span>Copy BibTeX</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 text-[11px] font-mono text-cyan-300 overflow-x-auto">
            {bibtexCitation}
          </pre>
        </div>
      </div>

      {/* Footer Back to Top Button Bar */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg"
        >
          <ArrowUp className="h-4 w-4 text-cyan-400" />
          <span>Back to Top</span>
        </button>
      </div>
    </div>
  );
};

// Helper Grid Icon Component
const GridIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
  </svg>
);

