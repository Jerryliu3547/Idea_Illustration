import { DPOVisualizer } from '@/components/visualizers/DPOVisualizer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DPO Visualizer - AI Term Visualizer',
  description: 'Interactive Direct Preference Optimization visualizer demonstrating implicit reward derivation and log-prob shifts.',
};

export default function DPOPage() {
  return <DPOVisualizer />;
}
