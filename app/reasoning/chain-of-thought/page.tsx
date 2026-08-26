import React from 'react';
import { ChainOfThoughtVisualizer } from '@/components/visualizers/ChainOfThoughtVisualizer';

export const metadata = {
  title: 'Chain of Thought (CoT) Visualizer | AI Concepts',
  description: 'Interactive visualization of Chain-of-Thought (CoT) prompting and reasoning token decomposition.',
};

export default function ChainOfThoughtPage() {
  return <ChainOfThoughtVisualizer />;
}
