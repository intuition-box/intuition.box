import type { Metadata } from 'next';
import { source } from '@/lib/learn-source';
import { LearnClient } from './client';

export const metadata: Metadata = {
  title: 'Learn',
  description: 'Tutorials and guides to master Intuition Box.',
};

export default function LearnIndexPage() {
  const rawPages = source.getPages();
  
  // Serialize the data so it can be passed to the Client Component
  const tutorials = rawPages.map((post) => ({
    url: post.url,
    data: {
      title: post.data.title,
      description: post.data.description,
      category: post.data.category as string | undefined,
      tags: post.data.tags as string[] | undefined,
      youtube_id: post.data.youtube_id as string | undefined,
    },
  }));

  return (
    <main className="min-h-screen bg-fd-background">
      <LearnClient tutorials={tutorials} />
    </main>
  );
}
