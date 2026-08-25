import React from 'react';
import Link from 'next/link';
import { MathFormula } from '@/components/ui/MathFormula';
import { 
  Workflow, 
  Sliders, 
  GitCompare, 
  Users, 
  Activity, 
  ArrowRight, 
  Brain, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Zap, 
  BookOpen
} from 'lucide-react';

const concepts = [
  {
    id: 'rlhf',
    title: 'RLHF Pipeline',
    subtitle: 'End-to-End Alignment Framework',
    href: '/rlhf',
    icon: Workflow,
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    badge: '3 Stages',
    formula: 'R(x, y) = R_\\phi(x, y) - \\beta D_{\\text{KL}}(\\pi_\\theta \\parallel \\pi_{\\text{ref}})',
    desc: 'Aligns LLMs with human preference through Supervised Fine-Tuning, Reward Modeling, and RL policy optimization.',
  },
  {
    id: 'ppo',
    title: 'PPO (Proximal Policy Optimization)',
    subtitle: 'Clipped Surrogate Policy Gradient',
    href: '/ppo',
    icon: Sliders,
    color: 'from-indigo-500/20 to-blue-500/10 border-indigo-500/30 text-indigo-400',
    badge: 'Clipping Loss',
    formula: 'L^{\\text{CLIP}}(\\theta) = \\min\\left(r_t \\hat{A}_t, \\text{clip}(r_t, 1-\\epsilon, 1+\\epsilon)\\hat{A}_t\\right)',
    desc: 'Prevents destructive policy shifts by constraining the probability ratio r_t between new and old policy updates.',
  },
  {
    id: 'dpo',
    title: 'DPO (Direct Preference Optimization)',
    subtitle: 'Direct Implicit Reward Alignment',
    href: '/dpo',
    icon: GitCompare,
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    badge: 'No Critic Needed',
    formula: '\\mathcal{L}_{\\text{DPO}} = -\\log \\sigma\\left(\\beta \\log \\frac{\\pi_\\theta(y_w)}{\\pi_{\\text{ref}}(y_w)} - \\beta \\log \\frac{\\pi_\\theta(y_l)}{\\pi_{\\text{ref}}(y_l)}\\right)',
    desc: 'Bypasses reward models & actor-critic loops by optimizing policy token log-probabilities directly on preference pairs.',
  },
  {
    id: 'grpo',
    title: 'GRPO (Group Relative Policy)',
    subtitle: 'DeepSeek-R1 Group Advantage Sampling',
    href: '/grpo',
    icon: Users,
    color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
    badge: 'DeepSeek R1',
    formula: 'A_i = \\frac{r_i - \\text{mean}(\\{r\\})}{\\text{std}(\\{r\\})}',
    desc: 'Samples a group of candidate outputs per prompt to estimate advantages relative to the group mean, eliminating the critic model.',
  },
  {
    id: 'kl',
    title: 'KL Divergence',
    subtitle: 'Distribution Drift & Reward Hacking Regularizer',
    href: '/kl-divergence',
    icon: Activity,
    color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
    badge: 'Regularization',
    formula: 'D_{\\text{KL}}(\\pi_\\theta \\parallel \\pi_{\\text{ref}}) = \\mathbb{E}\\left[\\log \\pi_\\theta(y|x) - \\log \\pi_{\\text{ref}}(y|x)\\right]',
    desc: 'Anchors the RL policy to the initial SFT reference distribution, preventing reward hacking and speech degeneration.',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10 max-w-6xl mx-auto p-4 sm:p-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/40 p-8 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Module 1: Reinforcement Learning in LLMs
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Interactive AI Term & Mathematical Visualizer
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Explore and manipulate key RL concepts in LLM post-training. From traditional PPO actor-critic loops to modern DPO direct alignment and DeepSeek-R1 GRPO group sampling.
          </p>
        </div>
      </div>

      {/* Grid of Concept Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-400" /> Interactive Modules
          </h2>
          <span className="text-xs font-mono text-slate-400">5 Visual Explanations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concepts.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-br border ${item.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-slate-400 block mb-0.5">{item.subtitle}</span>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 font-mono text-xs overflow-x-auto">
                    <MathFormula math={item.formula} />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800/60 text-xs font-semibold text-indigo-400 group-hover:text-cyan-300 transition-colors">
                  <span>Launch Visualizer</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Algorithm Comparison Matrix Table */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="h-5 w-5 text-purple-400" /> RL Method Comparison Matrix
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Algorithm</th>
                <th className="py-3 px-4">Reward Model?</th>
                <th className="py-3 px-4">Critic Model?</th>
                <th className="py-3 px-4">Models in VRAM</th>
                <th className="py-3 px-4">Primary Advantage</th>
                <th className="py-3 px-4">Notable Applications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-amber-400">PPO (RLHF)</td>
                <td className="py-3 px-4 text-emerald-400">Yes (Explicit)</td>
                <td className="py-3 px-4 text-emerald-400">Yes (Critic LLM)</td>
                <td className="py-3 px-4">4 LLMs</td>
                <td className="py-3 px-4">High expressive capacity & online sampling</td>
                <td className="py-3 px-4 text-slate-400">InstructGPT, ChatGPT</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-emerald-400">DPO</td>
                <td className="py-3 px-4 text-rose-400">No (Implicit)</td>
                <td className="py-3 px-4 text-rose-400">No Critic</td>
                <td className="py-3 px-4">2 LLMs (Policy + Ref)</td>
                <td className="py-3 px-4">Stable supervised-like training & fast setup</td>
                <td className="py-3 px-4 text-slate-400">Llama 3, Zephyr, Mistral</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-purple-400">GRPO</td>
                <td className="py-3 px-4 text-emerald-400">Optional / Rule-based</td>
                <td className="py-3 px-4 text-rose-400">No Critic</td>
                <td className="py-3 px-4">2 LLMs (Policy + Ref)</td>
                <td className="py-3 px-4">50% VRAM savings + Group relative baseline</td>
                <td className="py-3 px-4 text-slate-400">DeepSeek Math, DeepSeek R1</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
