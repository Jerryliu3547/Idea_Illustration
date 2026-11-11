import React from 'react';
import { AgenticEvaluationVisualizer } from '@/components/visualizers/AgenticEvaluationVisualizer';

export const metadata = {
  title: 'Agentic Evaluation: Code Evaluators & LLM Judges | AI Concepts',
  description: 'Interactive visualizer exploring Code Evaluators (Docker test harnesses, pass@k) and LLM Judges Evaluators (multi-dimensional rubrics, bias mitigation).',
};

export default function AgenticEvaluationPage() {
  return <AgenticEvaluationVisualizer />;
}
