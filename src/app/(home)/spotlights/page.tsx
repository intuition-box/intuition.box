import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getPublishedSpotlights } from '@/lib/spotlights-source';
import { formatAuthors, formatDate } from '@/lib/format';
import { cn } from '@/lib/cn';
import {
  Card,
  CardContent,
  CardFooter,
  CardGrid,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { PageHero } from '@/components/page-hero';

const DESCRIPTION =
  'Stories from the grantees and builders shaping the Intuition ecosystem.';

// Root layout's title template appends `| ${appName}`.
export const metadata: Metadata = {
  title: 'Spotlights',
  description: DESCRIPTION,
};

export default function SpotlightsIndexPage() {
  const posts = getPublishedSpotlights();

  return (
    <main>
      <PageHero tone="yellow" title="Spotlights" description={DESCRIPTION} />

      <section className="max-w-5xl mx-auto px-6 md:px-8 pb-16">
        {posts.length === 0 ? (
          <p className="text-fd-muted-foreground">
            No spotlights yet. Check back soon.
          </p>
        ) : (
          <CardGrid>
            {posts.map((post) => (
              <Link key={post.url} href={post.url} className="no-underline">
                <Card
                  className={cn(
                    'h-full transition-colors hover:bg-fd-accent/40 border-ib-yellow-alpha',
                    // Flush cover image at the top — only drop the padding
                    // when there is actually an image to fill it.
                    post.data.cover_image && 'pt-0',
                  )}
                >
                  {post.data.cover_image && (
                    <div className="relative aspect-[16/9] w-full">
                      <Image
                        src={post.data.cover_image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover"
                      />
                    </div>
                  )}
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
                  <CardFooter className="text-xs text-fd-muted-foreground gap-2 flex-wrap mt-auto bg-transparent bg-linear-to-b from-transparent to-ib-yellow-dark">
                    {post.data.author && (
                      <>
                        <span>{formatAuthors(post.data.author)}</span>
                        <span aria-hidden>·</span>
                      </>
                    )}
                    {post.data.tags && post.data.tags.length > 0 && (
                      <>
                        <span>{post.data.tags.join(', ')}</span>
                        <span aria-hidden>·</span>
                      </>
                    )}
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
