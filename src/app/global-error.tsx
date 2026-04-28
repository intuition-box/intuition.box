'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[global] critical error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem',
          padding: '2rem',
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          background: '#0b1013',
          color: '#f6f6f6',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
          Critical error
        </h1>
        <p style={{ color: '#a1a1aa', maxWidth: '36rem', textAlign: 'center', margin: 0 }}>
          The application failed to load. Please refresh the page; if the
          problem persists, contact the team.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #2a2f33',
            borderRadius: '0.5rem',
            background: 'transparent',
            color: '#f6f6f6',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
        {error.digest && (
          <p
            style={{
              color: '#71717a',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              margin: 0,
            }}
          >
            {error.digest}
          </p>
        )}
      </body>
    </html>
  );
}
