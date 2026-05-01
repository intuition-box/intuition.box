'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/cn';

interface MarkdownBodyProps {
  children: string;
  className?: string;
}

/**
 * Runtime markdown renderer for content fetched at request time
 * (mission bodies, etc.). Uses fumadocs's typography preset (`prose`)
 * so the look matches docs/blog automatically. `prose-sm` keeps the
 * scale tight enough for a dialog/card context. Link colors are
 * pinned to brand tokens via `prose-a:` modifiers.
 */
export function MarkdownBody({ children, className }: MarkdownBodyProps) {
  return (
    <div
      className={cn(
        'prose prose-invert prose-sm max-w-none',
        'prose-a:text-fd-foreground prose-a:underline-offset-2 hover:prose-a:text-ib-brand',
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

/**
 * Strips a mission body down to a one-paragraph plain-text preview.
 *
 * Mission bodies on the project board start with a metadata block —
 * `**Status:** Ideas`, `**Priority:** P0`, `**Reward:** $2,000` — that
 * duplicates data already shown as Badges. We drop that block, then
 * strip markdown syntax from the rest so `line-clamp-3` can show the
 * actually-useful prose. Used for the card preview only; the dialog
 * still renders the full markdown.
 */
export function bodyToPreview(body: string | undefined): string | undefined {
  if (!body) return undefined;
  let text = body.replace(/\r\n/g, '\n');

  // Drop a leading metadata block: consecutive lines that start with
  // `**Field:**`. Stop at the first blank line or a non-metadata line.
  const lines = text.split('\n');
  let start = 0;
  while (start < lines.length) {
    const line = lines[start].trim();
    if (line === '') {
      start += 1;
      continue;
    }
    if (/^\*\*[^*:]+:\*\*/.test(line)) {
      start += 1;
      continue;
    }
    break;
  }
  text = lines.slice(start).join('\n');

  // Strip markdown syntax: headers, emphasis, links, code, images, blockquotes.
  text = text
    .replace(/^#{1,6}\s+/gm, '')           // headers
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')   // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links → label
    .replace(/`{1,3}([^`]+)`{1,3}/g, '$1')   // inline / fenced code
    .replace(/(\*\*|__)(.*?)\1/g, '$2')     // bold
    .replace(/(\*|_)(.*?)\1/g, '$2')        // italic
    .replace(/^\s*[-*+]\s+/gm, '')          // list bullets
    .replace(/^\s*>\s?/gm, '')              // blockquote markers
    .replace(/\s+/g, ' ')                   // collapse whitespace
    .trim();

  return text || undefined;
}
