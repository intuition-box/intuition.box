import 'server-only';

import { async as icalAsync, type VEvent } from 'node-ical';
import type { CalendarEvent } from './types';
import { inferTag } from './tags';

/**
 * node-ical types string properties as `string | { val: string; params: ... }`
 * because iCal fields can carry parameters. Normalize to a plain string.
 */
function asString(v: unknown): string | null {
  if (v == null) return null;
  if (typeof v === 'string') return v;
  if (typeof v === 'object' && 'val' in v && typeof (v as { val: unknown }).val === 'string') {
    return (v as { val: string }).val;
  }
  return null;
}

function buildEvent(source: VEvent, start: Date, end: Date | null): CalendarEvent {
  const title = asString(source.summary) ?? '(untitled)';
  const description = asString(source.description);
  const location = asString(source.location);
  const url = asString((source as unknown as { url?: unknown }).url);
  const allDay =
    (source as unknown as { datetype?: string }).datetype === 'date' ||
    (typeof source.start === 'object' &&
      (source.start as unknown as { dateOnly?: boolean }).dateOnly === true);

  return {
    // Per-occurrence ID so SWR / React keys stay stable across re-renders
    // even when the same UID yields multiple instances via RRULE expansion.
    id: `${asString(source.uid) ?? title}-${start.toISOString()}`,
    title,
    description,
    location,
    url,
    start: start.toISOString(),
    end: end?.toISOString() ?? null,
    allDay,
    tag: inferTag({ location, description, url }),
  };
}

/**
 * Fetch a public iCal (.ics) URL and return a flat list of event occurrences
 * normalized into CalendarEvent. When a `range` is supplied, recurring events
 * (RRULE) are expanded into individual instances that fall inside it, with
 * EXDATE exclusions honored. Without a range, recurring events yield only
 * their seed occurrence — callers should always pass a range.
 */
export async function fetchAndParseICS(
  url: string,
  range?: { from: Date; to: Date },
): Promise<CalendarEvent[]> {
  const data = await icalAsync.fromURL(url);
  const events: CalendarEvent[] = [];

  for (const key in data) {
    const item = data[key];
    if (!item || item.type !== 'VEVENT') continue;
    const e = item as VEvent;

    const seedStart = e.start instanceof Date ? e.start : new Date(e.start as unknown as string);
    const seedEnd = e.end instanceof Date ? e.end : e.end ? new Date(e.end as unknown as string) : null;

    // Non-recurring: emit the single occurrence.
    if (!e.rrule || !range) {
      events.push(buildEvent(e, seedStart, seedEnd));
      continue;
    }

    // Recurring: expand between range.from and range.to (inclusive).
    const occurrences = e.rrule.between(range.from, range.to, true);

    // Collect EXDATE (excluded recurrence instances).
    const exdates = new Set<number>();
    const exdateRaw = (e as unknown as { exdate?: Record<string, Date | string> }).exdate;
    if (exdateRaw) {
      for (const k in exdateRaw) {
        const d = exdateRaw[k];
        const asDate = d instanceof Date ? d : new Date(d as string);
        if (!Number.isNaN(asDate.getTime())) exdates.add(asDate.getTime());
      }
    }

    const duration = seedEnd ? seedEnd.getTime() - seedStart.getTime() : 0;

    for (const occ of occurrences) {
      if (exdates.has(occ.getTime())) continue;
      const instEnd = duration ? new Date(occ.getTime() + duration) : null;
      events.push(buildEvent(e, occ, instEnd));
    }
  }

  return events;
}
