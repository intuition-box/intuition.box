import { spotlights } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';
import { spotlightsRoute } from './shared';

// Same conversion as the blog: `defineCollections` returns a plain array of
// entries rather than a `Source`, so wrap it with `toFumadocsSource`.
export const spotlightsSource = loader({
  baseUrl: spotlightsRoute,
  source: toFumadocsSource(spotlights, []),
});

/** Published spotlights only (drafts excluded), newest first. */
export function getPublishedSpotlights() {
  return spotlightsSource
    .getPages()
    .filter((page) => !page.data.draft)
    .sort(
      (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
    );
}
