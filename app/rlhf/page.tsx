import { RLHFPipelineVisualizer } from '@/components/visualizers/RLHFPipelineVisualizer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RLHF Pipeline - AI Term Visualizer',
  description: 'Interactive explanation of Reinforcement Learning from Human Feedback: SFT, Reward Modeling, and PPO Policy Optimization.',
};

export default function RLHFPage() {
  return <RLHFPipelineVisualizer />;
}
