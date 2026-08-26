import React from 'react';
import { TransformerVisualizer } from '@/components/visualizers/TransformerVisualizer';

export const metadata = {
  title: 'Transformer Architecture Visualizer | AI Concepts',
  description: 'Interactive visualization of scaled dot-product self-attention, positional encoding, and multi-head attention layers.',
};

export default function TransformerPage() {
  return <TransformerVisualizer />;
}
