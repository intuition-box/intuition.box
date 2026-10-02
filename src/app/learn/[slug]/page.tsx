import { getPageImage, getPageMarkdownUrl, source } from '@/lib/learn-source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { gitConfig } from '@/lib/shared';
import { Play, BookOpen } from 'lucide-react';
import { StickyVideoPlayer } from './video-player';

export function generateStaticParams() {
  return source.getPages().map((post) => ({ slug: post.slugs[0] }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage([params.slug]);
  if (!page) return {};

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}

export default async function TutorialPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const page = source.getPage([params.slug]);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const isWorkshop = page.data.category?.toLowerCase() === 'workshop';

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <div className="flex items-center gap-3 text-ib-purple-light mb-4">
        {isWorkshop ? <Play className="size-6" /> : <BookOpen className="size-6" />}
        <span className="font-medium tracking-wide uppercase text-sm">{page.data.category || 'Tutorial'}</span>
      </div>
      
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      
      <div className="flex flex-row gap-2 items-center border-b pb-6 mt-4 mb-8">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/learn/${page.path}`}
        />
      </div>
      
      <DocsBody>
        {/* Render sticky video at the top of the content if youtube_id exists */}
        {page.data.youtube_id && (
          <StickyVideoPlayer youtubeId={page.data.youtube_id} />
        )}
        
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}
