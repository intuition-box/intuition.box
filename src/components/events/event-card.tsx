'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@waveso/ui/dialog';
import type { CalendarEvent } from '@/lib/calendar/types';

interface EventCardProps {
  event: CalendarEvent;
  /** When true, renders the card with a brand-colored border (for days with events). */
  withBrandBorder?: boolean;
}

const TIMEZONE = 'America/New_York';

function formatTime(iso: string, allDay: boolean): string {
  if (allDay) return 'All day';
  return (
    new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: TIMEZONE,
    }).format(new Date(iso)) + ' ET'
  );
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: TIMEZONE,
  }).format(new Date(iso));
}

function formatTimeRange(event: CalendarEvent): string {
  if (event.allDay) return 'All day';
  const start = formatTime(event.start, false);
  if (!event.end) return start;
  return `${start} – ${formatTime(event.end, false)}`;
}

function isUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

export function EventCard({ event, withBrandBorder = false }: EventCardProps) {
  const borderClass = withBrandBorder ? 'border-ib-brand/40' : 'border-fd-border';
  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            aria-label={`View details for ${event.title}`}
            className={`text-left rounded-lg border ${borderClass} bg-fd-card p-3 flex flex-col gap-1.5 transition-colors hover:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring cursor-pointer`}
          />
        }
      >
        <p className="text-[10px] tracking-wide text-fd-muted-foreground uppercase">
          {formatTime(event.start, event.allDay)}
        </p>
        <h4 className="text-sm font-semibold text-fd-foreground leading-snug m-0">
          {event.title}
        </h4>
        {event.description && (
          <p className="text-xs text-fd-muted-foreground leading-snug line-clamp-3 m-0">
            {event.description}
          </p>
        )}
        {event.tag && (
          <span className="inline-flex self-start mt-1 px-2 py-0.5 rounded border border-fd-border text-[9px] font-medium tracking-widest uppercase text-fd-muted-foreground">
            {event.tag}
          </span>
        )}
      </DialogTrigger>

      <DialogContent
        showCloseButton
        className="sm:max-w-screen-sm p-6"
      >
        <DialogHeader>
          <DialogTitle className="pr-8">{event.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <p className="text-xs tracking-widest text-fd-muted-foreground uppercase m-0">
              When
            </p>
            <p className="text-sm text-fd-foreground m-0">
              {formatDate(event.start)}
            </p>
            <p className="text-sm text-fd-muted-foreground m-0">
              {formatTimeRange(event)}
            </p>
          </div>

          {event.description && (
            <div className="flex flex-col gap-1">
              <p className="text-xs tracking-widest text-fd-muted-foreground uppercase m-0">
                Details
              </p>
              <p className="text-sm text-fd-foreground leading-relaxed whitespace-pre-wrap m-0">
                {event.description}
              </p>
            </div>
          )}

          {event.location && (
            <div className="flex flex-col gap-1">
              <p className="text-xs tracking-widest text-fd-muted-foreground uppercase m-0">
                Location
              </p>
              {isUrl(event.location) ? (
                <a
                  href={event.location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-fd-primary hover:underline break-all m-0"
                >
                  {event.location}
                </a>
              ) : (
                <p className="text-sm text-fd-foreground m-0">{event.location}</p>
              )}
            </div>
          )}

          {event.tag && (
            <span className="inline-flex self-start px-2 py-0.5 rounded border border-fd-border text-[9px] font-medium tracking-widest uppercase text-fd-muted-foreground">
              {event.tag}
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
