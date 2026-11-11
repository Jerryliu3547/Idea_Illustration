import React from 'react';
import { EvaluatingAgentApplicationVisualizer } from '@/components/visualizers/EvaluatingAgentApplicationVisualizer';

export const metadata = {
  title: 'Evaluating Agent Applications: Actions, Trajectories & Outcomes | AI Concepts',
  description: 'Interactive visualizer exploring Agent Application Evaluation across 4 granularities: Actions/Tool Calls, Multi-step Trajectories, Multi-Turn Sessions with Simulated LLM Users, and Outcome vs Process Decoupling.',
};

export default function EvaluatingAgentApplicationPage() {
  return <EvaluatingAgentApplicationVisualizer />;
}
