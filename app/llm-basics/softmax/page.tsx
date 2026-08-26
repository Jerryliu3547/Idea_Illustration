import React from 'react';
import { SoftmaxVisualizer } from '@/components/visualizers/SoftmaxVisualizer';

export const metadata = {
  title: 'Softmax & Temperature Visualizer | AI Concepts',
  description: 'Interactive visualization of Softmax probability distribution and Temperature parameter scaling.',
};

export default function SoftmaxPage() {
  return <SoftmaxVisualizer />;
}
