export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  url: string | null;
  /** ISO 8601 UTC timestamp */
  start: string;
  /** ISO 8601 UTC timestamp */
  end: string | null;
  allDay: boolean;
  tag: string | null;
}

export interface DayEvents {
  /** YYYY-MM-DD in America/New_York */
  date: string;
  /** e.g., "MONDAY" */
  dayLabel: string;
  /** Day of month in ET, e.g., 13 */
  dayNumber: number;
  isToday: boolean;
  events: CalendarEvent[];
}

export interface WeekData {
  /** YYYY-MM-DD — Monday of the current week in ET */
  weekStart: string;
  /** YYYY-MM-DD — Friday of the current week in ET */
  weekEnd: string;
  /** Exactly 5 entries, Mon → Fri */
  days: DayEvents[];
  /** e.g., "Apr 13 – Apr 17, 2026" */
  rangeLabel: string;
}
