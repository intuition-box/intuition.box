import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { blogSource } from '@/lib/blog-source';
import { siteUrl } from '@/lib/shared';

const STATIC_ROUTES = ['', '/docs', '/blog', '/missions'] as const;

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

  return [...staticEntries, ...docsEntries, ...blogEntries];
}
