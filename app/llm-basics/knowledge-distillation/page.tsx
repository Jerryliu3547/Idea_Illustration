import React from 'react';
import { KnowledgeDistillationVisualizer } from '@/components/visualizers/KnowledgeDistillationVisualizer';

export const metadata = {
  title: 'Knowledge Distillation Visualizer | LLM Basics',
  description: 'Interactive visualization of LLM Knowledge Distillation: Teacher-Student alignment, Soft Logit Loss, Forward/Reverse KL divergence, and compression efficiency benchmarks.',
};

export default function KnowledgeDistillationPage() {
  return <KnowledgeDistillationVisualizer />;
}
