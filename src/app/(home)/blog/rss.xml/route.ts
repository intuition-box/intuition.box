import { Feed } from 'feed';
import { NextResponse } from 'next/server';
import { blogSource } from '@/lib/blog-source';
import { appName, blogRoute, siteUrl } from '@/lib/shared';

export const revalidate = 0;

export function GET() {
  const feed = new Feed({
    title: `${appName} Blog`,
    description: 'Updates, essays, and announcements from the Intuition Box DAO.',
    id: `${siteUrl}${blogRoute}`,
    link: `${siteUrl}${blogRoute}`,
    language: 'en',
    copyright: `© ${new Date().getFullYear()} Intuition Box`,
  });

  const posts = [...blogSource.getPages()].sort(
    (a, b) =>
      new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );

  for (const post of posts) {
    const url = `${siteUrl}${post.url}`;
    feed.addItem({
      id: url,
      link: url,
      title: post.data.title,
      description: post.data.description,
      date: new Date(post.data.date),
      author: (Array.isArray(post.data.author)
        ? post.data.author
        : [post.data.author]
      ).map((name) => ({ name })),
    });
  }

  return new NextResponse(feed.rss2(), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
