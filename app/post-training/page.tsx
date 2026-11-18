import React from 'react';
import { PostTrainingVisualizer } from '@/components/visualizers/PostTrainingVisualizer';

export const metadata = {
  title: 'Intro Post-Training | Post-Training',
  description:
    'Interactive guide to LLM Post-Training: Pre-training vs. Mid-training, Supervised Fine-Tuning (SFT) vs. Reinforcement Learning (RL), Reasoning <think> tokens, DeepSeek-R1 pipeline, and RLAIF / Constitutional AI.',
};

export default function IntroPostTrainingPage() {
  return <PostTrainingVisualizer activeTab="intro" />;
}
