import React from 'react';
import { ImprovingAgentApplicationVisualizer } from '@/components/visualizers/ImprovingAgentApplicationVisualizer';

export const metadata = {
  title: 'Improve Agentic Applications in Production | AI Concepts',
  description: 'Interactive visualizer exploring continuous improvement for agentic applications in production: eval-driven development, evidence-matched interventions, the 4 production pillars, and the continuous production-to-eval flywheel.',
};

export default function ImprovingAgentApplicationPage() {
  return <ImprovingAgentApplicationVisualizer />;
}
