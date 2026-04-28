'use client';

import { useTransition } from 'react';
import { Button } from '@waveso/ui/button';
import { RefreshCw } from 'lucide-react';
import { refreshMissions } from './actions';

/**
 * Calls the `refreshMissions` server action to bust the cache, then
 * lets the route re-render with fresh data. Disabled while pending.
 */
export function RefreshButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => refreshMissions())}
      aria-label="Refresh missions from GitHub"
    >
      <RefreshCw className={`size-3.5 mr-2 ${isPending ? 'animate-spin' : ''}`} />
      {isPending ? 'Refreshing…' : 'Refresh'}
    </Button>
  );
}
