import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import {
  getPublishedSpotlights,
  spotlightsSource,
} from '@/lib/spotlights-source';
import { getMDXComponents } from '@/components/mdx';
import { spotlightsRoute } from '@/lib/shared';
import { formatAuthors, formatDate } from '@/lib/format';

export function generateStaticParams() {
  // fumadocs returns `{ slug: string[] }`; our [slug] route needs a single
  // string. Drafts are excluded — they 404 until published.
  return getPublishedSpotlights().map((post) => ({ slug: post.slugs[0] }));
}

export async function generateMetadata(
  props: PageProps<'/spotlights/[slug]'>,
): Promise<Metadata> {
  const params = await props.params;
  const post = spotlightsSource.getPage([params.slug]);
  if (!post || post.data.draft) return {};
  return {
    // Root layout's title template appends `| ${appName}`.
    title: post.data.title,
    description: post.data.description,
    openGraph: post.data.cover_image
      ? { images: [post.data.cover_image] }
      : undefined,
  };
}

export default async function SpotlightPage(
  props: PageProps<'/spotlights/[slug]'>,
) {
  const params = await props.params;
  const post = spotlightsSource.getPage([params.slug]);
  if (!post || post.data.draft) notFound();

  const MDX = post.data.body;
  const coverImage = post.data.cover_image;

  return (
    // overflow-x-clip absorbs the few px the full-bleed quote strips can
    // overshoot when a vertical scrollbar narrows the viewport vs 100vw.
    <article className="w-full pt-16 pb-24 overflow-x-clip">
      {/* Hero & back link — 860px wide */}
      <div className="max-w-[860px] mx-auto w-full px-6 md:px-8">
        <Link
          href={spotlightsRoute}
          className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground hover:text-fd-foreground no-underline mb-8"
        >
          <ArrowLeft className="size-4" />
          Back to spotlights
        </Link>

        {coverImage && (
          <figure className="mb-10">
            <div className="overflow-hidden rounded-2xl border border-fd-border relative aspect-[16/9]">
              <Image
                src={coverImage}
                alt={post.data.title}
                fill
                priority
                sizes="(max-width: 860px) 100vw, 860px"
                className="object-cover object-top"
              />
            </div>
            {post.data.cover_credit && (
              <figcaption className="mt-3 text-right text-xs text-fd-muted-foreground">
                {post.data.cover_credit.url ? (
                  <a
                    href={post.data.cover_credit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-fd-foreground"
                  >
                    {post.data.cover_credit.name}
                  </a>
                ) : (
                  post.data.cover_credit.name
                )}
                {post.data.cover_credit.note && (
                  <>. {post.data.cover_credit.note}</>
                )}
              </figcaption>
            )}
          </figure>
        )}
      </div>

      {/* Title + meta + body — narrower 710px column */}
      <div className="max-w-[710px] mx-auto w-full px-6 md:px-8">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight m-0">
            {post.data.title}
          </h1>
          {post.data.description && (
            <p className="text-lg text-fd-muted-foreground mt-4 m-0">
              {post.data.description}
            </p>
          )}
          {/* Same meta-row convention as the blog: bold lead name = author.
              The spotlighted builder is already named in the description
              and the article body, so it stays out of the byline row. */}
          <div className="flex items-center gap-3 mt-6 text-sm text-fd-muted-foreground flex-wrap">
            {post.data.author && (
              <>
                <span className="font-medium text-fd-foreground">
                  {formatAuthors(post.data.author)}
                </span>
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
          </div>
        </header>

        <div className="prose prose-invert max-w-none article-prose spotlight-prose">
          <MDX components={getMDXComponents()} />
        </div>
      </div>
    </article>
  );
}
