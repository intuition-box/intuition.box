import Link from 'next/link';
import type { Metadata } from 'next';
import { blogSource } from '@/lib/blog-source';
import { appName } from '@/lib/shared';
import {
  Card,
  CardContent,
  CardFooter,
  CardGrid,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { PageHero } from '@/components/page-hero';

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
    <main>
      <PageHero
        tone="lilac"
        title="Blog"
        description="Updates, essays, and announcements from the Intuition Box DAO."
      />

      <section className="max-w-5xl mx-auto px-6 md:px-8 pb-16">
      {posts.length === 0 ? (
        <p className="text-fd-muted-foreground">No posts yet. Check back soon.</p>
      ) : (
        <CardGrid>
          {posts.map((post) => (
            <Link key={post.url} href={post.url} className="no-underline">
              <Card className="h-full transition-colors hover:bg-fd-accent/40 hover:ring-fd-accent border-ib-purple-alpha">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-fd-foreground">
                    {post.data.title}
                  </CardTitle>
                </CardHeader>
                {post.data.description && (
                  <CardContent>
                    <p className="text-sm text-fd-muted-foreground line-clamp-3 m-0">
                      {post.data.description}
                    </p>
                  </CardContent>
                )}
                <CardFooter className="text-xs text-fd-muted-foreground gap-2 flex-wrap mt-auto bg-transparent bg-linear-to-b from-transparent to-ib-purple-dark">
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
                </CardFooter>
              </Card>
            </Link>
          ))}
        </CardGrid>
      )}
      </section>
    </main>
  );
}
