import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { blogSource } from '@/lib/blog-source';
import { getMDXComponents } from '@/components/mdx';
import { appName, blogRoute } from '@/lib/shared';

const formatDate = (value: string | Date) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value));

const formatAuthors = (author: string | string[]): string =>
  Array.isArray(author) ? author.join(', ') : author;

export function generateStaticParams() {
  // fumadocs returns `{ slug: string[] }`; our [slug] route needs a single string.
  return blogSource.getPages().map((post) => ({ slug: post.slugs[0] }));
}

export async function generateMetadata(
  props: PageProps<'/blog/[slug]'>,
): Promise<Metadata> {
  const params = await props.params;
  const post = blogSource.getPage([params.slug]);
  if (!post) return {};
  return {
    title: `${post.data.title} | ${appName}`,
    description: post.data.description,
    openGraph: post.data.cover_image
      ? { images: [post.data.cover_image] }
      : undefined,
  };
}

export default async function BlogPostPage(props: PageProps<'/blog/[slug]'>) {
  const params = await props.params;
  const post = blogSource.getPage([params.slug]);
  if (!post) notFound();

  const MDX = post.data.body;
  const coverImage = post.data.cover_image;

  return (
    <article className="w-full pt-16 pb-24">
      {/* Hero & back link — 860px wide */}
      <div className="max-w-[860px] mx-auto w-full px-6 md:px-8">
        <Link
          href={blogRoute}
          className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground hover:text-fd-foreground no-underline mb-8"
        >
          <ArrowLeft className="size-4" />
          Back to blog
        </Link>

        {coverImage && (
          <figure className="mb-10 overflow-hidden rounded-2xl border border-fd-border relative aspect-[16/9]">
            <Image
              src={coverImage}
              alt={post.data.title}
              fill
              priority
              sizes="(max-width: 860px) 100vw, 860px"
              className="object-cover"
            />
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
          <div className="flex items-center gap-3 mt-6 text-sm text-fd-muted-foreground">
            <span className="font-medium text-fd-foreground">
              {formatAuthors(post.data.author)}
            </span>
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
        </header>

        <div className="prose prose-invert max-w-none">
          <MDX components={getMDXComponents()} />
        </div>
      </div>
    </article>
  );
}
