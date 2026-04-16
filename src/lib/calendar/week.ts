import type { CalendarEvent, DayEvents, WeekData } from './types';

const TIMEZONE = 'America/New_York';
const DAY_LABELS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'] as const;
const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

interface ETParts {
  year: number;
  month: number;
  day: number;
  weekday: number; // 0 = Sun, 1 = Mon, …
}

/** Returns Y/M/D + weekday as observed in America/New_York for a given instant. */
function getETParts(d: Date): ETParts {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).formatToParts(d);
  const val = (t: string) => parts.find((p) => p.type === t)!.value;
  return {
    year: Number(val('year')),
    month: Number(val('month')),
    day: Number(val('day')),
    weekday: WEEKDAYS_SHORT.indexOf(val('weekday') as (typeof WEEKDAYS_SHORT)[number]),
  };
}

/**
 * Returns the Monday that begins the current week in ET as a UTC-noon Date.
 * Using noon avoids DST boundary ambiguities when comparing day buckets later.
 */
function mondayOfWeek(now: Date): Date {
  const { year, month, day, weekday } = getETParts(now);
  const delta = weekday === 0 ? 6 : weekday - 1;
  return new Date(Date.UTC(year, month - 1, day - delta, 12, 0, 0));
}

/**
 * "Active" Monday used for the displayed grid. The week flips FORWARD at
 * Friday 00:00 ET — once Friday arrives, we show the next Mon–Fri so the
 * weekend serves as a preview/prep window for the upcoming week.
 *
 * Implementation: shift `now` forward by 3 days before computing the Monday.
 *   Mon–Thu + 3 days → still in the same Mon–Fri → THIS week
 *   Fri–Sun + 3 days → rolls into the next week → NEXT Monday
 */
function activeMonday(now: Date): Date {
  const shifted = new Date(now.getTime() + 3 * 86_400_000);
  return mondayOfWeek(shifted);
}

function addDays(d: Date, days: number): Date {
  const nd = new Date(d);
  nd.setUTCDate(d.getUTCDate() + days);
  return nd;
}

function sameETDay(a: Date, b: Date): boolean {
  const p = getETParts(a);
  const q = getETParts(b);
  return p.year === q.year && p.month === q.month && p.day === q.day;
}

function ymdInET(d: Date): string {
  const p = getETParts(d);
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`;
}

function formatRangeLabel(start: Date, end: Date): string {
  const year = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    timeZone: TIMEZONE,
  }).format(end);
  const fmtMd = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: TIMEZONE,
  });
  return `${fmtMd.format(start)} – ${fmtMd.format(end)}, ${year}`;
}

/**
 * Given a flat list of events, build a 5-day (Mon–Fri) week anchored to the
 * current Monday in ET. Events are bucketed by their ET calendar day.
 */
export function buildCurrentWeek(events: CalendarEvent[], now: Date = new Date()): WeekData {
  const monday = activeMonday(now);
  const friday = addDays(monday, 4);

  const days: DayEvents[] = DAY_LABELS.map((label, i) => {
    const d = addDays(monday, i);
    const parts = getETParts(d);
    const dayEvents = events
      .filter((ev) => sameETDay(new Date(ev.start), d))
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    return {
      date: ymdInET(d),
      dayLabel: label,
      dayNumber: parts.day,
      isToday: sameETDay(d, now),
      events: dayEvents,
    };
  });

  return {
    weekStart: ymdInET(monday),
    weekEnd: ymdInET(friday),
    days,
    rangeLabel: formatRangeLabel(monday, friday),
  };
}
