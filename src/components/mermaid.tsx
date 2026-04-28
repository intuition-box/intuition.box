'use client';

import { useEffect, useRef } from 'react';

interface MermaidProps {
  children: string;
  className?: string;
}

/**
 * Renders a Mermaid diagram. The `mermaid` library (~600KB) is dynamically
 * imported on first render — without this, every page that transitively
 * touches this file (via fumadocs-mdx's generated `.source/server.ts`) ships
 * the entire library in its bundle.
 */
export function Mermaid({ children, className = '' }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !children) return;
    let cancelled = false;

    void (async () => {
      const { default: mermaid } = await import('mermaid');
      if (cancelled) return;

      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        themeVariables: {
          primaryColor: '#f9fafb',
          primaryTextColor: '#111827',
          primaryBorderColor: '#d1d5db',
          lineColor: '#6b7280',
          secondaryColor: '#f3f4f6',
          tertiaryColor: '#ffffff',
        },
      });

      const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`;

      try {
        const { svg } = await mermaid.render(id, children);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'unknown error';
        if (!cancelled && ref.current) {
          ref.current.textContent = `Error rendering diagram: ${message}`;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [children]);

  return (
    <div
      ref={ref}
      className={`mermaid-container my-6 ${className}`}
      style={{ textAlign: 'center' }}
    />
  );
}
