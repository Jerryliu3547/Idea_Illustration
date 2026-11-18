import React from 'react';
import { PostTrainingVisualizer } from '@/components/visualizers/PostTrainingVisualizer';

export const metadata = {
  title: 'Core Techniques | Post-Training',
  description:
    'Core engineering techniques for LLM post-training: data splitting & anti-leakage, tokenizer/LR/LoRA memory, programmatic verifiers, reward models, DPO derivation, and PPO vs. GRPO.',
};

export default function CoreTechniquesPage() {
  return <PostTrainingVisualizer activeTab="techniques" />;
}
