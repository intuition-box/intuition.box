import { blog } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';
import { blogRoute } from './shared';

// `defineCollections` (as used for the blog) returns a plain array of entries
// rather than a `Source`, so we convert it with `toFumadocsSource(pages, metas)`.
export const blogSource = loader({
  baseUrl: blogRoute,
  source: toFumadocsSource(blog, []),
});
