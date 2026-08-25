import { KLDivergenceVisualizer } from '@/components/visualizers/KLDivergenceVisualizer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KL Divergence - AI Term Visualizer',
  description: 'Interactive KL Divergence constraint visualizer explaining distribution drift and reward hacking prevention.',
};

export default function KLDivergencePage() {
  return <KLDivergenceVisualizer />;
}
