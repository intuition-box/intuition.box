'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@waveso/ui/dialog';
import { Calendar, FileText, MapPin, Expand } from 'lucide-react';
import type { CalendarEvent } from '@/lib/calendar/types';
import { useTimezone } from './timezone-context';

interface EventCardProps {
  event: CalendarEvent;
}

function formatTime(iso: string, allDay: boolean, timezone: string): string {
  if (allDay) return 'All day';
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
  }).format(new Date(iso));
}

function formatDate(iso: string, timezone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: timezone,
  }).format(new Date(iso));
}

function formatTimeRange(event: CalendarEvent, timezone: string): string {
  if (event.allDay) return 'All day';
  const start = formatTime(event.start, false, timezone);
  if (!event.end) return start;
  return `${start} – ${formatTime(event.end, false, timezone)}`;
}

function isUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

export function EventCard({ event }: EventCardProps) {
  const { timezone } = useTimezone();

  const time = formatTime(event.start, event.allDay, timezone);
  const location = event.location;

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            aria-label={`View details for ${event.title}`}
            className="text-left rounded-lg border border-fd-border bg-fd-card p-3 flex flex-col gap-1.5 transition-colors hover:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring cursor-pointer"
          />
        }
      >
        <p className="text-[10px] tracking-wide text-fd-muted-foreground uppercase">
          {time}
        </p>
        <h4 className="text-sm font-semibold text-fd-foreground leading-snug m-0">
          {event.title}
        </h4>
        {location && (
          <p className="text-xs text-fd-muted-foreground leading-snug line-clamp-2 m-0">
            {location}
          </p>
        )}
        <span className="mt-2 inline-flex self-start items-center gap-1 text-[10px] tracking-wide text-fd-muted-foreground/80 uppercase">
          <Expand className="size-3" />
          Expand
        </span>
      </DialogTrigger>

      <DialogContent showCloseButton className="sm:max-w-screen-sm p-6">
        <DialogHeader>
          <DialogTitle className="pr-8">{event.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <p className="inline-flex items-center gap-1.5 text-xs tracking-widest text-fd-muted-foreground uppercase m-0">
              <Calendar className="size-3.5" />
              When
            </p>
            <p className="text-sm text-fd-foreground m-0">
              {formatDate(event.start, timezone)}
            </p>
            <p className="text-sm text-fd-muted-foreground m-0">
              {formatTimeRange(event, timezone)}
            </p>
          </div>

          {event.description && (
            <div className="flex flex-col gap-1">
              <p className="inline-flex items-center gap-1.5 text-xs tracking-widest text-fd-muted-foreground uppercase m-0">
                <FileText className="size-3.5" />
                Details
              </p>
              <p className="text-sm text-fd-foreground leading-relaxed whitespace-pre-wrap m-0">
                {event.description}
              </p>
            </div>
          )}

          {event.location && (
            <div className="flex flex-col gap-1">
              <p className="inline-flex items-center gap-1.5 text-xs tracking-widest text-fd-muted-foreground uppercase m-0">
                <MapPin className="size-3.5" />
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
