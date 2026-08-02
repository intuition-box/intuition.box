import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { blogSource } from '@/lib/blog-source';
import { getPublishedSpotlights } from '@/lib/spotlights-source';
import { getLearnLessons } from '@/lib/learn-source';
import { learnRoute, siteUrl } from '@/lib/shared';

const STATIC_ROUTES = ['', learnRoute, '/docs', '/blog', '/missions', '/spotlights'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.8,
  }));

  const docsEntries: MetadataRoute.Sitemap = source.getPages().map((page) => ({
    url: `${siteUrl}${page.url}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogSource.getPages().map((post) => ({
    url: `${siteUrl}${post.url}`,
    lastModified: new Date(post.data.date),
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  const spotlightEntries: MetadataRoute.Sitemap = getPublishedSpotlights().map(
    (post) => ({
      url: `${siteUrl}${post.url}`,
      lastModified: new Date(post.data.date),
      changeFrequency: 'yearly',
      priority: 0.6,
    }),
  );

  const learnEntries: MetadataRoute.Sitemap = [
    ...getLearnLessons().map((lesson) => ({
      url: `${siteUrl}${lesson.href}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    {
      url: `${siteUrl}${learnRoute}/quickstart`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  return [
    ...staticEntries,
    ...learnEntries,
    ...docsEntries,
    ...blogEntries,
    ...spotlightEntries,
  ];
}
