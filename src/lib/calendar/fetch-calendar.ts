import 'server-only';

import { fetchAndParseICS } from './parse-ics';
import { buildCurrentWeek } from './week';
import type { WeekData } from './types';

/**
 * Server-side fetch of the public iCal feed, grouped into the current Mon–Fri
 * week in ET. No caching — every page render pulls fresh data. For a curated
 * weekly calendar, ICS parse is ~200ms and Google's feed has no CORS headers,
 * so a server-rendered fresh fetch is the simplest path to real-time.
 */
export async function fetchCurrentWeek(): Promise<WeekData> {
  const url = process.env.INTUITION_CALENDAR_ICS_URL;
  if (!url) {
    throw new Error('INTUITION_CALENDAR_ICS_URL env var is not set');
  }
  // Expand recurring events in a wide window around now. The display week
  // rolls forward at Fri 00:00 ET (see week.ts#activeMonday), so we need up
  // to ~2 weeks of forward coverage to ensure next week's events are expanded
  // by Thursday night. ±14 days is plenty with room for timezone edges.
  const now = new Date();
  const from = new Date(now.getTime() - 14 * 86_400_000);
  const to = new Date(now.getTime() + 14 * 86_400_000);
  const events = await fetchAndParseICS(url, { from, to });
  return buildCurrentWeek(events, now);
}
