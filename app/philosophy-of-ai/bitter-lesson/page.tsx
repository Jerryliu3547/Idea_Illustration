import React from 'react';
import { BitterLessonVisualizer } from '@/components/visualizers/BitterLessonVisualizer';

export const metadata = {
  title: 'The Bitter Lesson by Richard Sutton | AI Philosophy & Scaling',
  description: 'Interactive visualization and breakdown of "The Bitter Lesson" by Richard Sutton (2019): Why general computation-heavy algorithms ultimately defeat human-engineered domain knowledge.',
};

export default function BitterLessonPage() {
  return <BitterLessonVisualizer />;
}
