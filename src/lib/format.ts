/**
 * Shared date/byline formatters for article-style pages (blog, spotlights).
 */

export const formatDate = (value: string | Date): string =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    // Frontmatter dates like '2026-05-01' parse as UTC midnight. Without
    // an explicit zone, formatting follows the build machine's local zone
    // and shifts the displayed day backwards anywhere west of UTC.
    timeZone: 'UTC',
  }).format(new Date(value));

export const formatAuthors = (author: string | string[]): string =>
  Array.isArray(author) ? author.join(', ') : author;
