import React from 'react';
import { ContextEngineeringVisualizer } from '@/components/visualizers/ContextEngineeringVisualizer';

export const metadata = {
  title: 'Agentic Memory | Context Engineering',
  description: 'Episodic, semantic, working, and procedural memory systems for autonomous agents.',
};

export default function AgenticMemoryPage() {
  return <ContextEngineeringVisualizer activeTab="memory" />;
}
