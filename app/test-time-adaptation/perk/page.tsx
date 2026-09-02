import React from 'react';
import { PERKVisualizer } from '@/components/visualizers/PERKVisualizer';

export const metadata = {
  title: 'PERK: Parameter-Efficient Test-Time Learning | AI Concepts Explorer',
  description: 'Interactive visualization of PERK (Parameter-Efficient Reasoning over Knowledge), reframing long-context reasoning as test-time LoRA parameter adaptation.',
};

export default function PERKPage() {
  return <PERKVisualizer />;
}
