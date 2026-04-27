'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '@waveso/ui/button';

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[home] route error:', error);
  }, [error]);

  return (
    <main className="max-w-3xl mx-auto px-6 md:px-8 pt-24 pb-24 text-center">
      <p className="text-xs tracking-widest text-fd-muted-foreground uppercase mb-4">
        Something went wrong
      </p>
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight m-0 mb-4">
        We hit an unexpected error
      </h1>
      <p className="text-fd-muted-foreground max-w-xl mx-auto mb-10">
        The page failed to render. You can try again, or head back home and
        keep exploring.
      </p>
      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={reset}>
          Try again
        </Button>
        <Button render={<Link href="/" />}>Back home</Button>
      </div>
      {error.digest && (
        <p className="mt-12 text-xs text-fd-muted-foreground/60">
          Error ID: <span className="font-mono">{error.digest}</span>
        </p>
      )}
    </main>
  );
}
