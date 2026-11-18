"use client";

import React from 'react';
import Link from 'next/link';
import { FileText, Sliders, Sparkles } from 'lucide-react';
import { IntroPostTrainingVisualizer } from '@/components/visualizers/IntroPostTrainingVisualizer';
import { CoreTechniquesVisualizer } from '@/components/visualizers/CoreTechniquesVisualizer';

export type PostTrainingTab = 'intro' | 'techniques';

interface PostTrainingVisualizerProps {
  activeTab: PostTrainingTab;
}

const tabConfig: Record<
  PostTrainingTab,
  {
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
  }
> = {
  intro: {
    tabNumber: 1,
    title: 'Intro Post-Training',
    shortTitle: 'Intro Post-Training',
    href: '/post-training',
    icon: FileText,
    color: 'text-indigo-400',
    activeBg: 'bg-indigo-950/40',
    activeBorder: 'border-indigo-500/30',
    activeText: 'text-indigo-300',
    badge: 'Foundations',
    subtitle: 'Pre/Mid-Training, SFT vs. RL, Reasoning Recipes & RLAIF',
    description:
      'Foundations of LLM post-training: how pre-training and continuous mid-training prepare the base model, how Fine-Tuning (SFT) compares to Reinforcement Learning (RL), how DeepSeek-R1 combines both for reasoning, and how Constitutional AI scales alignment via RLAIF.',
    keyTopics: [
      'Pre-Training vs. Mid-Training (Languages, Multimodality, Context)',
      'Fine-Tuning (SFT) vs. Reinforcement Learning (RL) & Needs Matrix',
      'Frontier Pipeline: Base Model -> Fine-Tuning -> RL -> New Model',
      'Reasoning <think> Tokens & DeepSeek-R1 4-Stage Pipeline',
      'RLAIF & Constitutional AI (Critique, Revise & AI Grader)',
    ],
  },
  techniques: {
    tabNumber: 2,
    title: 'Core Techniques',
    shortTitle: 'Core Techniques',
    href: '/post-training/techniques',
    icon: Sliders,
    color: 'text-purple-400',
    activeBg: 'bg-purple-950/40',
    activeBorder: 'border-purple-500/30',
    activeText: 'text-purple-300',
    badge: 'Techniques',
    subtitle: 'Data Splits, Anti-Leakage, LR/LoRA Memory, Verifiers/DPO & PPO vs. GRPO',
    description:
      'Essential engineering techniques for post-training: train/val/test & RL-test splitting with MinHash deduplication, tokenizer/embedding freezing, LR & LoRA memory math, programmatic verifiers vs. reward models, DPO derivation, and PPO vs. GRPO.',
    keyTopics: [
      'Data Splits, RL-Test New RM & MinHash / Time Splitting',
      'Tokenizer Freezing, Learning Rate Diagnostics & LoRA VRAM',
      'GRPO Verifiers, Preference RM & Full DPO Derivation',
      'Policy Optimization: PPO (Critic + GAE) vs. GRPO (Group Relative)',
    ],
  },
};

export const PostTrainingVisualizer: React.FC<PostTrainingVisualizerProps> = ({ activeTab }) => {
  const current = tabConfig[activeTab];

  return (
    <div className="space-y-10 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Top Tab Navigation Bar */}
      <div className="flex border-b border-slate-800 pb-3 gap-2 sm:gap-4 overflow-x-auto text-sm font-semibold">
        {(Object.keys(tabConfig) as PostTrainingTab[]).map((tabKey) => {
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
              <span>
                Tab {tab.tabNumber}: {tab.shortTitle}
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  isActive ? 'bg-white/10 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.badge}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Hero Overview Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-indigo-950/40 via-slate-900/70 to-purple-950/30 p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Post-Training · Tab {current.tabNumber}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono">
            {current.badge}
          </span>
        </div>

        <div className="space-y-2 max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {current.title}
          </h1>
          <p className="text-sm font-mono text-indigo-300">{current.subtitle}</p>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {current.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {current.keyTopics.map((topic, idx) => (
            <span
              key={topic}
              className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300"
            >
              <span className="text-indigo-400 font-bold mr-1.5">{idx + 1}.</span>
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Active Tab Content */}
      {activeTab === 'intro' && <IntroPostTrainingVisualizer />}
      {activeTab === 'techniques' && <CoreTechniquesVisualizer />}
    </div>
  );
};
