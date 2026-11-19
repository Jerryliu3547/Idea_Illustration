import React from 'react';
import { PostTrainingVisualizer } from '@/components/visualizers/PostTrainingVisualizer';

export const metadata = {
  title: 'Data-Driven Post-Training | Post-Training',
  description:
    'Data-driven post-training: quality vs. scale, eval-first data sizing, LoRA behavior, online vs. offline preference learning, DeepSeek-R1 data pipeline, synthetic data (Constitutional AI, rejection sampling, template engineering), data mixing, and reward balancing.',
};

export default function DataDrivenPostTrainingPage() {
  return <PostTrainingVisualizer activeTab="data-driven" />;
}
