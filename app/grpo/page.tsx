import { GRPOVisualizer } from '@/components/visualizers/GRPOVisualizer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GRPO Visualizer - AI Term Visualizer',
  description: 'Interactive Group Relative Policy Optimization visualizer (DeepSeek R1 architecture) with live group sampling normalization.',
};

export default function GRPOPage() {
  return <GRPOVisualizer />;
}
