"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Workflow, 
  Sliders, 
  GitCompare, 
  Users, 
  Activity, 
  LayoutDashboard,
  Brain,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Cpu,
  BarChart3,
  Layers,
  ListTree,
  GraduationCap
} from 'lucide-react';

interface NavTreeSubItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  color?: string;
}

interface NavTreeCategory {
  id: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: NavTreeSubItem[];
}

const treeNavigation: NavTreeCategory[] = [
  {
    id: 'llm-basics',
    category: 'LLM Basics',
    icon: Cpu,
    color: 'text-amber-400',
    items: [
      {
        name: 'Transformer Architecture',
        href: '/llm-basics/transformer',
        icon: Cpu,
        badge: 'Attention',
        color: 'text-cyan-400',
      },
      {
        name: 'Softmax & Temperature',
        href: '/llm-basics/softmax',
        icon: BarChart3,
        badge: 'Sampling',
        color: 'text-amber-400',
      },
      {
        name: 'Knowledge Distillation',
        href: '/llm-basics/knowledge-distillation',
        icon: GraduationCap,
        badge: 'Teacher-Student',
        color: 'text-rose-400',
      },
    ],
  },
  {
    id: 'rl-in-llms',
    category: 'Reinforcement Learning in LLMs',
    icon: Workflow,
    color: 'text-purple-400',
    items: [
      {
        name: 'RLHF Pipeline',
        href: '/rlhf',
        icon: Workflow,
        badge: '3 Stages',
        color: 'text-amber-400',
      },
      {
        name: 'PPO Visualizer',
        href: '/ppo',
        icon: Sliders,
        badge: 'Clipping',
        color: 'text-indigo-400',
      },
      {
        name: 'DPO Visualizer',
        href: '/dpo',
        icon: GitCompare,
        badge: 'Direct Policy',
        color: 'text-emerald-400',
      },
      {
        name: 'GRPO Visualizer',
        href: '/grpo',
        icon: Users,
        badge: 'DeepSeek R1',
        color: 'text-purple-400',
      },
      {
        name: 'KL Divergence',
        href: '/kl-divergence',
        icon: Activity,
        badge: 'Constraint',
        color: 'text-cyan-400',
      },
    ],
  },
  {
    id: 'peft',
    category: 'Parameter Efficient Fine-Tuning',
    icon: Layers,
    color: 'text-emerald-400',
    items: [
      {
        name: 'LoRA & QLoRA',
        href: '/peft/lora',
        icon: Layers,
        badge: 'Rank Adaptation',
        color: 'text-emerald-400',
      },
    ],
  },
  {
    id: 'reasoning',
    category: 'Reasoning & Chain of Thoughts',
    icon: ListTree,
    color: 'text-cyan-400',
    items: [
      {
        name: 'Chain of Thought (CoT)',
        href: '/reasoning/chain-of-thought',
        icon: Brain,
        badge: 'Decomposition',
        color: 'text-purple-400',
      },
      {
        name: 'Tree of Thoughts (ToT)',
        href: '/reasoning/tree-of-thoughts',
        icon: ListTree,
        badge: 'Tree Search',
        color: 'text-cyan-400',
      },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Tree expansion state: Default all categories to open
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'llm-basics': true,
    'rl-in-llms': true,
    'peft': true,
    'reasoning': true,
  });

  // Auto expand category folder if user is currently visiting a route inside it
  useEffect(() => {
    treeNavigation.forEach((cat) => {
      if (cat.items.some((item) => pathname === item.href)) {
        setExpandedCategories((prev) => ({ ...prev, [cat.id]: true }));
      }
    });
  }, [pathname]);

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* Brand Header */}
        <Link 
          href="/" 
          className="flex items-center gap-3 px-2 py-3 group"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              AI Term Visualizer
            </h1>
            <p className="text-xs text-indigo-400 font-medium flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Interactive Explorer
            </p>
          </div>
        </Link>

        {/* Dashboard Overview Home Link */}
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
            pathname === '/'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-md shadow-indigo-500/10'
              : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="h-4 w-4 text-indigo-400 shrink-0" />
          <span className="font-semibold">Overview Dashboard</span>
        </Link>

        {/* Tree Directory Navigation */}
        <nav className="space-y-4">
          {treeNavigation.map((cat) => {
            const isExpanded = !!expandedCategories[cat.id];
            const hasActiveChild = cat.items.some((item) => pathname === item.href);

            return (
              <div key={cat.id} className="space-y-1">
                {/* Tree Category Folder Header */}
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition-colors ${
                    hasActiveChild ? 'text-white bg-slate-900/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {isExpanded ? (
                      <FolderOpen className={`h-4 w-4 shrink-0 ${cat.color}`} />
                    ) : (
                      <Folder className="h-4 w-4 shrink-0 text-slate-500" />
                    )}
                    <span className="truncate">{cat.category}</span>
                  </div>

                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  )}
                </button>

                {/* Sub-Items Tree Branch */}
                {isExpanded && (
                  <div className="pl-4 ml-3 border-l border-slate-800/80 space-y-1 pt-0.5">
                    {cat.items.map((item) => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-slate-800 text-white border border-slate-700/80 shadow-md shadow-indigo-500/10'
                              : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? item.color : 'text-slate-500'}`} />
                            <span className="truncate">{item.name}</span>
                          </div>

                          {item.badge && (
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${
                              isActive ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-900 text-slate-500'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-400 mt-6">
        <div className="flex items-center justify-between text-slate-300 font-medium mb-1">
          <span>Interactive Explorer</span>
          <span className="text-cyan-400 font-mono text-[11px]">4 Core Domains</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          Visualizing LLM Basics, RL Alignment, PEFT, and Reasoning Algorithms.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 shadow-lg"
        aria-label="Toggle Navigation"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-72 transform bg-slate-950/95 border-r border-slate-800 transition-transform duration-300 md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-screen w-72 flex-col shrink-0 border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0">
        {sidebarContent}
      </aside>
    </>
  );
};
