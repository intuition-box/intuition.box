import { buildGuides } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';

export const buildGuideSource = loader({
  baseUrl: '/learn/build',
  source: toFumadocsSource(buildGuides, []),
});

export type BuildGuide = ReturnType<typeof buildGuideSource.getPages>[number];

export function getBuildGuides(): BuildGuide[] {
  return buildGuideSource
    .getPages()
    .filter((guide) => !guide.data.draft)
    .sort((a, b) => a.data.order - b.data.order);
}

export function getBuildGuidePage(slug: string): BuildGuide | undefined {
  const guide = buildGuideSource.getPage([slug]);
  if (!guide || guide.data.draft) return undefined;
  return guide;
}
