import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { blogSource } from '@/lib/blog-source';
import { getPublishedSpotlights } from '@/lib/spotlights-source';
import { siteUrl } from '@/lib/shared';
import { courseCatalog } from '@/lib/course-catalog';
import { getCourseLessons } from '@/lib/course-source';
import { getBuildGuides } from '@/lib/build-source';

const STATIC_ROUTES = [
  '',
  '/docs',
  '/blog',
  '/missions',
  '/learn',
  '/learn/courses',
  '/learn/build',
  '/learn/paths',
  '/learn/paths/understand-intuition',
  '/spotlights',
  '/ecosystem',
] as const;

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

  const courseEntries: MetadataRoute.Sitemap = courseCatalog
    .filter((course) => course.status === 'available')
    .flatMap((course) => [
      {
        url: `${siteUrl}/learn/courses/${course.slug}`,
        lastModified: course.lastReviewed ? new Date(course.lastReviewed) : now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
      ...getCourseLessons(course.slug).map((lesson) => ({
        url: `${siteUrl}${lesson.url}`,
        lastModified: course.lastReviewed ? new Date(course.lastReviewed) : now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
    ]);

  const buildEntries: MetadataRoute.Sitemap = getBuildGuides().map((guide) => ({
    url: `${siteUrl}${guide.url}`,
    lastModified: new Date(guide.data.lastTested),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    ...staticEntries,
    ...docsEntries,
    ...blogEntries,
    ...spotlightEntries,
    ...courseEntries,
    ...buildEntries,
  ];
}
