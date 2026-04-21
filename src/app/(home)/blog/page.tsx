import Link from 'next/link';
import type { Metadata } from 'next';
import { blogSource } from '@/lib/blog-source';
import { appName } from '@/lib/shared';

const formatDate = (value: string | Date) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value));

const formatAuthors = (author: string | string[]): string =>
  Array.isArray(author) ? author.join(', ') : author;

export const metadata: Metadata = {
  title: `Blog | ${appName}`,
  description: 'Updates, essays, and announcements from the Intuition Box DAO.',
};

export default function BlogIndexPage() {
  const posts = [...blogSource.getPages()].sort(
    (a, b) =>
      new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );

  return (
    <main className="max-w-5xl mx-auto px-6 md:px-8 pt-24 pb-16">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight m-0">
          Blog
        </h1>
        <p className="text-fd-muted-foreground mt-3 max-w-2xl m-0">
          Updates, essays, and announcements from the Intuition Box DAO.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-fd-muted-foreground">No posts yet. Check back soon.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.url}
              href={post.url}
              className="group flex flex-col justify-between rounded-xl border border-fd-border bg-fd-card p-5 transition-colors hover:bg-fd-accent hover:border-fd-accent no-underline"
            >
              <div>
                <h2 className="text-lg font-semibold text-fd-foreground m-0 group-hover:text-fd-accent-foreground">
                  {post.data.title}
                </h2>
                {post.data.description && (
                  <p className="text-sm text-fd-muted-foreground mt-2 line-clamp-3 m-0">
                    {post.data.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 mt-6 text-xs text-fd-muted-foreground flex-wrap">
                <span>{formatAuthors(post.data.author)}</span>
                {post.data.category && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{post.data.category}</span>
                  </>
                )}
                <span aria-hidden>·</span>
                <time dateTime={new Date(post.data.date).toISOString()}>
                  {formatDate(post.data.date)}
                </time>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
