import React from 'react';
import { ReActVisualizer } from '@/components/visualizers/ReActVisualizer';

export const metadata = {
  title: 'ReAct (Reasoning and Acting) Visualizer | AI Concepts',
  description: 'Interactive visualization of ReAct (Reasoning and Acting) framework, interleaving internal thoughts with external actions.',
};

export default function ReActPage() {
  return <ReActVisualizer />;
}
