'use server';

import { updateTag } from 'next/cache';
import { MISSIONS_CACHE_TAG } from '@/lib/github/constants';

/**
 * Server action — busts the missions cache so the next render fetches
 * fresh data from GitHub. Uses Next 16's `updateTag` (the server-action
 * counterpart to `revalidateTag`, no deprecation warning).
 */
export async function refreshMissions(): Promise<void> {
  updateTag(MISSIONS_CACHE_TAG);
}
