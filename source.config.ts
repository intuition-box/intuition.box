import { defineCollections, defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

// Content source configuration — see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: pageSchema.extend({
    // Accept a single author or a list of co-authors.
    author: z.string().or(z.array(z.string())),
    date: z.string().date().or(z.date()),
    // Optional taxonomy + media metadata
    category: z.string().optional(),
    cover_image: z.string().url().optional(),
    paragraph_url: z.string().url().optional(),
  }),
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
