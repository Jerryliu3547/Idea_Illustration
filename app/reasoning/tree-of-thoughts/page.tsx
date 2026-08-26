import React from 'react';
import { TreeOfThoughtsVisualizer } from '@/components/visualizers/TreeOfThoughtsVisualizer';

export const metadata = {
  title: 'Tree of Thoughts (ToT) Visualizer | AI Concepts',
  description: 'Interactive visualization of Tree of Thoughts (ToT) search, state evaluation, and branch pruning.',
};

export default function TreeOfThoughtsPage() {
  return <TreeOfThoughtsVisualizer />;
}
