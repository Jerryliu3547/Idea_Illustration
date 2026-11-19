import React from 'react';
import { PostTrainingVisualizer } from '@/components/visualizers/PostTrainingVisualizer';

export const metadata = {
  title: 'Evaluation | Post-Training',
  description:
    'Comprehensive post-training evaluation: pairwise Elo, pass@k vs pass^k, ECE calibration, efficiency (TTFT/TPOT), HELM & GDPval, online RL monitoring & reward hacking, 14-bucket error analysis, and automated red teaming.',
};

export default function PostTrainingEvaluationPage() {
  return <PostTrainingVisualizer activeTab="evaluation" />;
}
