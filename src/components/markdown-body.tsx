'use client';

import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/cn';

interface MarkdownBodyProps {
  children: string;
  className?: string;
}

/**
 * Tight, prose-like markdown renderer for issue/mission bodies.
 *
 * Avoids fumadocs's `prose` plugin so the rules stay scoped and small —
 * we don't want headers as big as page H2s inside a card dialog. Each
 * element gets a small custom style that matches the rest of the site.
 */
const components: Components = {
  h1: ({ children, ...props }) => (
    <h3
      className="text-base font-semibold text-fd-foreground m-0 mt-4 first:mt-0"
      {...props}
    >
      {children}
    </h3>
  ),
  h2: ({ children, ...props }) => (
    <h3
      className="text-sm font-semibold text-fd-foreground m-0 mt-4 first:mt-0 uppercase tracking-wide"
      {...props}
    >
      {children}
    </h3>
  ),
  h3: ({ children, ...props }) => (
    <h4
      className="text-sm font-semibold text-fd-foreground m-0 mt-3 first:mt-0"
      {...props}
    >
      {children}
    </h4>
  ),
  h4: ({ children, ...props }) => (
    <h5
      className="text-sm font-medium text-fd-foreground m-0 mt-3 first:mt-0"
      {...props}
    >
      {children}
    </h5>
  ),
  p: ({ children, ...props }) => (
    <p className="text-sm text-fd-muted-foreground m-0 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-fd-foreground underline underline-offset-2 hover:text-ib-brand transition-colors"
      {...props}
    >
      {children}
    </a>
  ),
  ul: ({ children, ...props }) => (
    <ul
      className="list-disc list-outside ps-5 m-0 text-sm text-fd-muted-foreground space-y-1"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="list-decimal list-outside ps-5 m-0 text-sm text-fd-muted-foreground space-y-1"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  code: ({ children, className, ...props }) => {
    // `code` inside a `pre` is the block form. ReactMarkdown sets a
    // language- className on inline blocks too, but inline code never has
    // a parent <pre> so we let the css cascade differentiate via :where.
    const isInline = !/^language-/.test(className ?? '');
    if (isInline) {
      return (
        <code
          className="rounded bg-fd-muted px-1 py-0.5 text-[0.8125rem] font-mono text-fd-foreground"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={cn('font-mono text-xs', className)} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }) => (
    <pre
      className="rounded-lg bg-fd-muted px-3 py-2 overflow-x-auto text-xs leading-relaxed m-0"
      {...props}
    >
      {children}
    </pre>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-2 border-fd-border ps-3 text-fd-muted-foreground italic m-0"
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: (props) => <hr className="border-fd-border my-4" {...props} />,
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-fd-foreground" {...props}>
      {children}
    </strong>
  ),
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto">
      <table
        className="w-full text-sm border-collapse border border-fd-border rounded-md m-0"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th
      className="text-left font-semibold text-fd-foreground border border-fd-border px-2 py-1"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td
      className="text-fd-muted-foreground border border-fd-border px-2 py-1 align-top"
      {...props}
    >
      {children}
    </td>
  ),
};

export function MarkdownBody({ children, className }: MarkdownBodyProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
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
