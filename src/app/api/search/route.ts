import { source as docsSource } from '@/lib/source';
import { source as learnSource } from '@/lib/learn-source';
import { createSearchAPI } from 'fumadocs-core/search/server';

export const { GET } = createSearchAPI('advanced', {
  language: 'english',
  indexes: [
    ...docsSource.getPages().map((page) => ({
      title: page.data.title,
      description: page.data.description,
      structuredData: page.data.structuredData,
      id: page.url,
      url: page.url,
    })),
    ...learnSource.getPages().map((page) => ({
      title: page.data.title,
      description: page.data.description,
      structuredData: page.data.structuredData,
      id: page.url,
      url: page.url,
    })),
  ],
});
