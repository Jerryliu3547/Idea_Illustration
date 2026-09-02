import React from 'react';
import { MoEVisualizer } from '@/components/visualizers/MoEVisualizer';

export const metadata = {
  title: 'Mixture of Experts (MoE) | AI Concepts Explorer',
  description: 'Interactive visualization of Mixture of Experts (MoE), sparse gating mechanisms, top-K expert routing, load balancing loss, and Transformer FFN replacements.',
};

export default function MoEPage() {
  return <MoEVisualizer />;
}
