"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Search, 
  Sliders, 
  Brain, 
  FileText, 
  Clock 
} from 'lucide-react';
import { IntroContextEngineeringVisualizer } from '@/components/visualizers/IntroContextEngineeringVisualizer';
import { AgenticSearchVisualizer } from '@/components/visualizers/AgenticSearchVisualizer';

export type ContextEngineeringTab = 'intro' | 'search' | 'management' | 'memory';

interface ContextEngineeringVisualizerProps {
  activeTab: ContextEngineeringTab;
}

const tabConfig: Record<ContextEngineeringTab, {
  tabNumber: number;
  title: string;
  shortTitle: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  activeBg: string;
  activeBorder: string;
  activeText: string;
  badge: string;
  subtitle: string;
  description: string;
  keyTopics: string[];
}> = {
  intro: {
    tabNumber: 1,
    title: 'Intro Context Eng',
    shortTitle: 'Intro Context Eng',
    href: '/context-engineering',
    icon: FileText,
    color: 'text-indigo-400',
    activeBg: 'bg-indigo-950/40',
    activeBorder: 'border-indigo-500/30',
    activeText: 'text-indigo-300',
    badge: 'Foundations',
    subtitle: 'Core Principles & Architecture of Context Engineering',
    description: 'Foundations of how context shapes agent reasoning, attention distribution, multi-turn accumulation, and harness-orchestrated execution.',
    keyTopics: [
      'Three Pillars: Right Info, Right Format, Right Time',
      'Context Accumulation Loop (Order #8934 Refund)',
      'Failure Modes: Poisoning, Clash, Confusion, Distraction',
      'Context Rot vs. Nominal Context Limits (20-40% Cliff)',
      'Agent Harnesses: Tools vs. Invisible Hooks'
    ],
  },
  search: {
    tabNumber: 2,
    title: 'Agentic Search',
    shortTitle: 'Agentic Search',
    href: '/context-engineering/agentic-search',
    icon: Search,
    color: 'text-cyan-400',
    activeBg: 'bg-cyan-950/40',
    activeBorder: 'border-cyan-500/30',
    activeText: 'text-cyan-300',
    badge: 'Retrieval',
    subtitle: 'Autonomous Multi-Source Sourcing, 4 Search Strategies & Tool Registries',
    description: 'Architectures for autonomous search: Exact, Ranked, Semantic, and Hybrid retrieval, 5-point tool definition engineering, JIT tool registries, and systematic evals.',
    keyTopics: [
      'Agentic Search vs. RAG (Multi-Hop Sourcing)',
      '4 Search Strategies: Exact, Ranked, Semantic, Hybrid',
      'Tool Definition Engineering (5-Point Formula)',
      'JIT Tool Registries (Token Overhead Optimization)',
      'Troubleshooting Failures & Multi-Trial Evals',
      'Data Prep: AST Parsing, Chunking & Metadata'
    ],
  },
  management: {
    tabNumber: 3,
    title: 'Context Management',
    shortTitle: 'Context Management',
    href: '/context-engineering/context-management',
    icon: Sliders,
    color: 'text-amber-400',
    activeBg: 'bg-amber-950/40',
    activeBorder: 'border-amber-500/30',
    activeText: 'text-amber-300',
    badge: 'Compaction',
    subtitle: 'Token Budgeting, Compression, Pruning & Dynamic Assembly',
    description: 'Techniques for managing finite context capacity: sliding windows, structured compaction, state checkpointing, and token budgeting.',
    keyTopics: [
      'Context Compaction & Semantic Pruning',
      'Token Budgeting & Rate Management',
      'Hierarchical Summarization',
      'Window Sliding & State Checkpointing'
    ],
  },
  memory: {
    tabNumber: 4,
    title: 'Agentic Memory',
    shortTitle: 'Agentic Memory',
    href: '/context-engineering/agentic-memory',
    icon: Brain,
    color: 'text-purple-400',
    activeBg: 'bg-purple-950/40',
    activeBorder: 'border-purple-500/30',
    activeText: 'text-purple-300',
    badge: 'Long-Term',
    subtitle: 'Episodic, Semantic, Working & Procedural Memory Systems',
    description: 'Architectures for long-term agent persistence: vector-indexed memories, reflection logs, episodic recall, and user profile adaptation.',
    keyTopics: [
      'Episodic vs. Semantic vs. Working Memory',
      'Vector Memory Stores & Reflection Buffers',
      'Associative Recall & Experience Replay',
      'Persistent User & Task Personas'
    ],
  },
};

export const ContextEngineeringVisualizer: React.FC<ContextEngineeringVisualizerProps> = ({ activeTab }) => {
  const current = tabConfig[activeTab];

  return (
    <div className="space-y-10 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Top 4-Tab Navigation Bar */}
      <div className="flex border-b border-slate-800 pb-3 gap-2 sm:gap-4 overflow-x-auto text-sm font-semibold">
        {(Object.keys(tabConfig) as ContextEngineeringTab[]).map((tabKey) => {
          const tab = tabConfig[tabKey];
          const isActive = activeTab === tabKey;
          const TabIcon = tab.icon;
          return (
            <Link
              key={tabKey}
              href={tab.href}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? `${tab.activeText} ${tab.activeBg} border ${tab.activeBorder} shadow-lg shadow-indigo-950/20`
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <TabIcon className={`h-4 w-4 ${isActive ? tab.color : 'text-slate-500'}`} />
              <span>Tab {tab.tabNumber}: {tab.shortTitle}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                isActive ? 'bg-white/10 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.badge}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-6 space-y-3">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider">
          <Layers className="h-4 w-4" /> Context Engineering Framework
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <current.icon className={`h-8 w-8 ${current.color}`} />
          {current.title}
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-4xl">
          {current.description}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {current.keyTopics.map((topic, idx) => (
            <span 
              key={idx}
              className="px-3 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${current.color.replace('text-', 'bg-')}`} />
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Tab 1 & Tab 2 Content vs Future Tab Scaffold */}
      {activeTab === 'intro' ? (
        <IntroContextEngineeringVisualizer />
      ) : activeTab === 'search' ? (
        <AgenticSearchVisualizer />
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/70 p-8 sm:p-12 text-center space-y-5">
          <div className="inline-flex p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <current.icon className={`h-10 w-10 ${current.color}`} />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-xl font-bold text-white font-mono">
              Ready for Materials: {current.title}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              This tab scaffold is set up and ready for your notes, screenshots, diagrams, and interactive visualizers.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              <Clock className="h-3.5 w-3.5" /> Awaiting Notes &amp; Screenshots
            </span>
          </div>
        </div>
      )}

      {/* Overview Cards of all 4 Tabs in Context Engineering */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          All Tabs in this Section
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(tabConfig) as ContextEngineeringTab[]).map((tabKey) => {
            const tab = tabConfig[tabKey];
            const isCurrent = activeTab === tabKey;
            const Icon = tab.icon;
            return (
              <Link
                key={tabKey}
                href={tab.href}
                className={`p-4 rounded-2xl border transition-all space-y-2 flex flex-col justify-between group ${
                  isCurrent
                    ? 'border-indigo-500/40 bg-slate-900/80 shadow-lg'
                    : 'border-slate-800 bg-slate-950/60 hover:bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Icon className={`h-5 w-5 ${tab.color}`} />
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      Tab {tab.tabNumber}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {tab.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {tab.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs font-mono">
                  <span className={isCurrent ? 'text-indigo-400 font-bold' : 'text-slate-500 group-hover:text-slate-300'}>
                    {isCurrent ? 'Active View' : 'Explore Tab →'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
