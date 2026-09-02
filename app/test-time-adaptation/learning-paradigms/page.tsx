import React from 'react';
import { LearningParadigmsVisualizer } from '@/components/visualizers/LearningParadigmsVisualizer';

export const metadata = {
  title: 'Train-Time vs Test-Time vs Inference-Time Learning | AI Concepts Explorer',
  description: 'Interactive visualization and comparison of Train-Time Learning (SFT/RLHF), Test-Time Learning (TTA/TTT/PERK), and Inference-Time Learning (ICL/CoT).',
};

export default function LearningParadigmsPage() {
  return <LearningParadigmsVisualizer />;
}
