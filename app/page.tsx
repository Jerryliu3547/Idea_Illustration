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
  BookOpen,
  Cpu,
  BarChart3,
  ListTree,
  Bot,
  GraduationCap,
  Zap,
  RefreshCw
} from 'lucide-react';

interface ConceptItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge: string;
  formula: string;
  desc: string;
}

interface ConceptCategory {
  title: string;
  subtitle: string;
  badge: string;
  items: ConceptItem[];
}

const categories: ConceptCategory[] = [
  {
    title: 'LLM Basics & Architecture',
    subtitle: 'Core building blocks of Transformer language models',
    badge: 'Foundations',
    items: [
      {
        id: 'transformer',
        title: 'Transformer Architecture',
        subtitle: 'Scaled Dot-Product Self-Attention',
        href: '/llm-basics/transformer',
        icon: Cpu,
        color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
        badge: 'Attention',
        formula: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V',
        desc: 'Maps token-to-token contextual dependencies in parallel via Query, Key, and Value matrix projections.',
      },
      {
        id: 'softmax',
        title: 'Softmax & Temperature',
        subtitle: 'Sampling Entropy & Logit Normalization',
        href: '/llm-basics/softmax',
        icon: BarChart3,
        color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
        badge: 'Sampling',
        formula: 'P(y_i) = \\frac{e^{z_i / T}}{\\sum_j e^{z_j / T}}',
        desc: 'Converts unnormalized raw output logits into probabilities; temperature T controls greediness vs randomness.',
      },
      {
        id: 'knowledge-distillation',
        title: 'Knowledge Distillation',
        subtitle: 'Teacher-Student Capacity Transfer',
        href: '/llm-basics/knowledge-distillation',
        icon: GraduationCap,
        color: 'from-rose-500/20 to-purple-500/10 border-rose-500/30 text-rose-400',
        badge: 'Teacher-Student',
        formula: '\\mathcal{L}_{\\text{KD}} = (1 - \\alpha) \\mathcal{L}_{\\text{CE}} + \\alpha T^2 D_{\\text{KL}}(P_T^T \\parallel P_S^T)',
        desc: 'Transfers dark knowledge & reasoning trajectories from a high-capacity Teacher (e.g. 70B) to a compact Student (e.g. 8B).',
      },
    ],
  },
  {
    title: 'Reinforcement Learning in LLMs',
    subtitle: 'Post-training alignment algorithms & preference optimization',
    badge: 'RL Alignment',
    items: [
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
    ],
  },
  {
    title: 'Parameter Efficient Fine-Tuning (PEFT)',
    subtitle: 'Low-resource adaptation methods for large models',
    badge: 'PEFT Fine-Tuning',
    items: [
      {
        id: 'lora',
        title: 'LoRA & QLoRA',
        subtitle: 'Low-Rank Weight Adaptation',
        href: '/peft/lora',
        icon: Layers,
        color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
        badge: 'Rank Adaptation',
        formula: 'W = W_0 + \\Delta W = W_0 + \\frac{\\alpha}{r} (B \\cdot A)',
        desc: 'Injects trainable low-rank decomposition matrices while freezing base model weights, reducing trainable params by up to 99.9%.',
      },
    ],
  },
  {
    title: 'Reasoning & Chain of Thoughts',
    subtitle: 'Decomposition & tree search inference capabilities',
    badge: 'Reasoning',
    items: [
      {
        id: 'cot',
        title: 'Chain of Thought (CoT)',
        subtitle: 'Intermediate Inference Step Decomposition',
        href: '/reasoning/chain-of-thought',
        icon: Brain,
        color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-300',
        badge: 'Decomposition',
        formula: 'P(Y \\mid X) = \\sum_C P(Y \\mid C, X) P(C \\mid X)',
        desc: 'Prompts LLMs to generate explicit intermediate step-by-step reasoning tokens before producing final answers.',
      },
      {
        id: 'tot',
        title: 'Tree of Thoughts (ToT)',
        subtitle: 'Deliberate Tree Search & State Evaluation',
        href: '/reasoning/tree-of-thoughts',
        icon: ListTree,
        color: 'from-cyan-500/20 to-teal-500/10 border-cyan-500/30 text-cyan-300',
        badge: 'Tree Search',
        formula: 'v(s) \\in [0, 1], \\quad s = (x, y_{1..i})',
        desc: 'Explores multiple reasoning branches simultaneously with LLM thought generation, state evaluation v(s), and BFS/DFS search.',
      },
      {
        id: 'react',
        title: 'ReAct (Reasoning and Acting)',
        subtitle: 'Synergizing Internal Thoughts with External Actions',
        href: '/reasoning/react',
        icon: Bot,
        color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300',
        badge: 'ICLR 2023',
        formula: '\\text{Thought}_t \\rightarrow \\text{Action}_t \\rightarrow \\text{Observation}_t',
        desc: 'Interleaves reasoning traces with external environment API actions (e.g. Wikipedia search) to eliminate hallucinations.',
      },
    ],
  },
  {
    title: 'LLM Self-Improvement',
    subtitle: 'Self-play, bootstrapping & iterative self-reasoning refinement',
    badge: 'Self-Improvement',
    items: [
      {
        id: 'star',
        title: 'STaR: Self-Taught Reasoner',
        subtitle: 'Bootstrapping Reasoning With Reasoning',
        href: '/llm-self-improvement/star',
        icon: Sparkles,
        color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-300',
        badge: 'Bootstrapping',
        formula: 'D_{n} \\cup D_{n}^{\\text{rat}} \\rightarrow \\text{Fine-tune } M',
        desc: 'Iteratively bootstraps reasoning by fine-tuning on self-generated rationales that yield correct answers, augmented by rationalization hints for failed problems.',
      },
    ],
  },
  {
    title: 'Test-Time Adaptation & Learning',
    subtitle: 'Parameter-efficient gradient updates and context encoding at test time',
    badge: 'TTA / TTT',
    items: [
      {
        id: 'perk',
        title: 'PERK: Parameter-Efficient Test-Time Learning',
        subtitle: 'Long-Context Reasoning as Meta-Learned LoRA Encoding',
        href: '/test-time-adaptation/perk',
        icon: Zap,
        color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-300',
        badge: 'LoRA Memory',
        formula: '\\theta_{\\text{inner}} = \\theta_0 - \\eta \\nabla_\\theta \\mathcal{L}_{\\text{enc}}(C; \\theta)',
        desc: 'Encodes massive long contexts into lightweight LoRA adapters via inner-loop test-time gradient updates, eliminating KV-cache memory explosions.',
      },
      {
        id: 'learning-paradigms',
        title: 'Train-Time vs. Test-Time vs. Inference-Time',
        subtitle: '3-Way Machine Learning Adaptation Taxonomy',
        href: '/test-time-adaptation/learning-paradigms',
        icon: RefreshCw,
        color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-300',
        badge: 'Paradigms',
        formula: '\\theta^*_{\\text{Train}} \\; \\text{vs.} \\; \\theta_{\\text{Test}}(x) \\; \\text{vs.} \\; P_\\theta(y \\mid x)',
        desc: 'Differentiates static pre-training weight updates, dynamic test-time parameter adaptation (TTA/TTT), and zero-gradient in-context inference (ICL/CoT).',
      },
    ],
  },
  {
    title: 'Philosophy of AI',
    subtitle: 'Fundamental principles, scaling laws & foundational essays',
    badge: 'AI Philosophy',
    items: [
      {
        id: 'bitter-lesson',
        title: 'The Bitter Lesson',
        subtitle: 'General Computation vs Human Engineering',
        href: '/philosophy-of-ai/bitter-lesson',
        icon: BookOpen,
        color: 'from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-300',
        badge: 'Richard Sutton (2019)',
        formula: '\\text{Performance}(C) \\propto \\text{General Search & Learning}(C)',
        desc: 'General methods leveraging massive computation ultimately defeat human-engineered domain knowledge by a large margin in the long run.',
      },
    ],
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-12 max-w-6xl mx-auto p-4 sm:p-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/40 p-8 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Interactive AI Term & Mathematics Visualizer
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Comprehensive AI & LLM Concept Explorer
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Explore 14 interactive visualizers across 5 core domains: LLM Basics, RL Alignment, PEFT, Reasoning Algorithms, and Test-Time Adaptation.
          </p>
        </div>
      </div>

      {/* Domain Categories Grid */}
      <div className="space-y-10">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-400" /> {cat.title}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{cat.subtitle}</p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                {cat.badge}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.items.map((item) => {
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
        ))}
      </div>
    </div>
  );
}
