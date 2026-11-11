import React from 'react';
import { ContextEngineeringVisualizer } from '@/components/visualizers/ContextEngineeringVisualizer';

export const metadata = {
  title: 'Agentic Search | Context Engineering',
  description: 'Autonomous multi-hop search, query reformulation, and web retrieval for agents.',
};

export default function AgenticSearchPage() {
  return <ContextEngineeringVisualizer activeTab="search" />;
}
