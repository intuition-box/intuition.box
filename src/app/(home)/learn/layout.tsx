import type { ReactNode } from 'react';
import { LearnProgressProvider } from '@/components/learn/learn-progress';
import { getLearnLessons } from '@/lib/learn-source';

export default function LearnLayout({ children }: { children: ReactNode }) {
  const validSlugs = getLearnLessons().map((lesson) => lesson.slug);

  return (
    <LearnProgressProvider validSlugs={validSlugs}>
      {children}
    </LearnProgressProvider>
  );
}
