import React from 'react';
import { ContextEngineeringVisualizer } from '@/components/visualizers/ContextEngineeringVisualizer';

export const metadata = {
  title: 'Context Management | Context Engineering',
  description: 'Token budgeting, semantic compression, sliding windows, and context assembly for agents.',
};

export default function ContextManagementPage() {
  return <ContextEngineeringVisualizer activeTab="management" />;
}
