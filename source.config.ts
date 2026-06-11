import { defineCollections, defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
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
    cover_image: z.string().url().optional(),
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
