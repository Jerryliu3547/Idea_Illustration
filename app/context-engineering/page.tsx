import React from 'react';
import { ContextEngineeringVisualizer } from '@/components/visualizers/ContextEngineeringVisualizer';

export const metadata = {
  title: 'Intro Context Eng | Context Engineering',
  description: 'Foundations of Context Engineering for LLMs & Autonomous Agents.',
};

export default function IntroContextEngPage() {
  return <ContextEngineeringVisualizer activeTab="intro" />;
}
