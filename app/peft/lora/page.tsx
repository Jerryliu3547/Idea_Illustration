import React from 'react';
import { LoRAVisualizer } from '@/components/visualizers/LoRAVisualizer';

export const metadata = {
  title: 'LoRA & QLoRA Visualizer | AI Concepts',
  description: 'Interactive visualization of Low-Rank Adaptation (LoRA) parameter reduction and QLoRA 4-bit quantization.',
};

export default function LoRAPage() {
  return <LoRAVisualizer />;
}
