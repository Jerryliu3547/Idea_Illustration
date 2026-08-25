import { PPOVisualizer } from '@/components/visualizers/PPOVisualizer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PPO Visualizer - AI Term Visualizer',
  description: 'Interactive Proximal Policy Optimization visualizer with dynamic ratio clipping graphs and advantage sliders.',
};

export default function PPOPage() {
  return <PPOVisualizer />;
}
