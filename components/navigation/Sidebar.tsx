"use client";

import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';

interface NavSubItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  desc?: string;
  color?: string;
}

interface NavCategoryGroup {
  category: string;
  items: NavSubItem[];
}

interface NavSingleItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

type NavGroupItem = NavCategoryGroup | NavSingleItem;

const navigationItems: NavGroupItem[] = [
  {
    name: 'Overview Dashboard',
    href: '/',
    icon: LayoutDashboard,
    description: 'All RL concepts at a glance',
  },
  {
    category: 'Reinforcement Learning in LLMs',
    items: [
      {
        name: 'RLHF Pipeline',
        href: '/rlhf',
        icon: Workflow,
        badge: '3 Stages',
        desc: 'SFT -> Reward Model -> PPO Policy',
        color: 'text-amber-400',
      },
      {
        name: 'PPO Visualizer',
        href: '/ppo',
        icon: Sliders,
        badge: 'Clipping',
        desc: 'Proximal Policy Optimization & Ratio Clipping',
        color: 'text-indigo-400',
      },
      {
        name: 'DPO Visualizer',
        href: '/dpo',
        icon: GitCompare,
        badge: 'Direct Policy',
        desc: 'Direct Preference Optimization & Log-Prob Shift',
        color: 'text-emerald-400',
      },
      {
        name: 'GRPO Visualizer',
        href: '/grpo',
        icon: Users,
        badge: 'DeepSeek R1',
        desc: 'Group Relative Policy Optimization',
        color: 'text-purple-400',
      },
      {
        name: 'KL Divergence',
        href: '/kl-divergence',
        icon: Activity,
        badge: 'Constraint',
        desc: 'Distribution Shift & Reward Hacking Control',
        color: 'text-cyan-400',
      },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4">
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

        {/* Navigation Section */}
        <nav className="space-y-6">
          {navigationItems.map((group, idx) => (
            <div key={idx} className="space-y-2">
              {'category' in group ? (
                <div>
                  <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {group.category}
                  </h2>
                  <div className="mt-2 space-y-1">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-slate-800/90 text-white border border-slate-700/80 shadow-md shadow-indigo-500/10'
                              : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Icon className={`h-4 w-4 shrink-0 ${isActive ? item.color : 'text-slate-400'}`} />
                            <span className="truncate">{item.name}</span>
                          </div>
                          {item.badge && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              isActive ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <Link
                  href={group.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    pathname === group.href
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4 text-indigo-400" />
                  <span>{group.name}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-400">
        <div className="flex items-center justify-between text-slate-300 font-medium mb-1">
          <span>Module Focus</span>
          <span className="text-cyan-400 font-mono text-[11px]">RL in LLMs</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          Visualizing mathematical objectives & policy optimization algorithms.
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
