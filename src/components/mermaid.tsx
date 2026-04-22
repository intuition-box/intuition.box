'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  children: string;
  className?: string;
}

export function Mermaid({ children, className = '' }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && children) {
      // Initialize mermaid with custom config
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

      // Generate unique ID for this diagram
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

      // Render the diagram
      mermaid.render(id, children).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      }).catch(error => {
        console.error('Mermaid rendering error:', error);
        if (ref.current) {
          ref.current.innerHTML = `<pre class="text-red-500">Error rendering diagram: ${error.message}</pre>`;
        }
      });
    }
  }, [children]);

  return (
    <div
      ref={ref}
      className={`mermaid-container my-6 ${className}`}
      style={{ textAlign: 'center' }}
    />
  );
}