import React from 'react';
import { STaRVisualizer } from '@/components/visualizers/STaRVisualizer';

export const metadata = {
  title: 'STaR: Self-Taught Reasoner | AI Concepts & Mathematics',
  description: 'Interactive visualizer and deep dive into STaR (Self-Taught Reasoner): Bootstrapping Reasoning With Reasoning, Rationale Generation, Policy Gradient Objectives, and Rationalization.',
};

export default function STaRPage() {
  return <STaRVisualizer />;
}
