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
    tags: z.array(z.string()).optional(),
    // Accepts a full URL (external CDN) or a local path under /public.
    cover_image: z.string().optional(),
    paragraph_url: z.string().url().optional(),
  }),
});

export const spotlights = defineCollections({
  type: 'doc',
  dir: 'content/spotlights',
  schema: pageSchema.extend({
    date: z.string().date().or(z.date()),
    // Author is optional — spotlight drafts are often written before the
    // byline is decided. Accepts one name or a list, same as blog.
    author: z.string().or(z.array(z.string())).optional(),
    // The builder(s) being spotlighted, e.g. "Kylan Hurt".
    builder: z.string().optional(),
    tags: z.array(z.string()).optional(),
    project_url: z.string().url().optional(),
    // Plain string (not .url()) — spotlight covers live in /public/images.
    cover_image: z.string().optional(),
    // Photo attribution rendered under the cover. `name` is the credited
    // party (linked when `url` is present); `note` is the rights text.
    cover_credit: z
      .object({
        name: z.string(),
        url: z.string().url().optional(),
        note: z.string().optional(),
      })
      .optional(),
    // Drafts stay in the repo but are excluded from the index, sitemap,
    // and static params.
    draft: z.boolean().optional(),
  }),
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
