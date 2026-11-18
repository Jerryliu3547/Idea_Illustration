import React from 'react';
import { Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Post-Training | AI Concepts Explorer',
  description: 'Placeholder section for Post-Training concepts and visualizers.',
};

export default function PostTrainingPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 sm:p-12 text-center space-y-4 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" /> Coming Soon
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Post-Training
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          This is a placeholder tab for the Post-Training section. Materials and interactive visualizers will be added here soon.
        </p>
      </div>
    </div>
  );
}
