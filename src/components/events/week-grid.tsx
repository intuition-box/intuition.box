'use client';

import { CalendarPlus, Maximize2 } from 'lucide-react';
import type { WeekData } from '@/lib/calendar/types';
import { calendarEmbedUrl, calendarSubscribeUrl } from '@/lib/shared';
import { EventCard } from './event-card';
import { TimezoneProvider } from './timezone-context';
import { TimezoneSelect } from './timezone-select';

interface WeekGridProps {
  week: WeekData;
}

function WeekGridInner({ week }: WeekGridProps) {
  return (
    <div className="rounded-2xl border border-fd-border bg-fd-card/40 backdrop-blur-sm p-6 md:p-8">
      {/* Header */}
      <header className="relative mb-10">
        <a
          href={calendarSubscribeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-0 top-0 inline-flex items-center gap-2 rounded-md border border-ib-brand/40 bg-ib-brand-alpha px-3 py-1.5 text-xs font-medium text-ib-brand hover:bg-ib-brand/20 transition-colors no-underline"
        >
          <CalendarPlus className="size-3.5" />
          Subscribe
        </a>

        <a
          href={calendarEmbedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-0 top-0 inline-flex items-center gap-2 rounded-md border border-fd-border px-3 py-1.5 text-xs font-medium text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground transition-colors no-underline"
        >
          <Maximize2 className="size-3.5" />
          Full calendar
        </a>

        <div className="text-center">
          <h2 className="text-3xl font-semibold m-0">Intuition Community Events</h2>
          <div className="mt-3 flex justify-center">
            <TimezoneSelect />
          </div>
        </div>
      </header>

      {/* 5-day grid — items-stretch is the default, so each column fills the tallest column's height */}
      <div className="grid grid-cols-5 gap-3">
        {week.days.map((day) => (
          <div key={day.date} className="flex flex-col gap-3 min-w-0">
            {/* Day header */}
            <div className="text-center pb-2">
              <p className="text-[10px] tracking-widest text-fd-muted-foreground uppercase m-0">
                {day.dayLabel}
              </p>
              <div className="mt-1">
                {day.isToday ? (
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ib-brand text-ib-brand-dark font-semibold text-base">
                    {day.dayNumber}
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center w-8 h-8 text-base font-semibold text-fd-foreground">
                    {day.dayNumber}
                  </span>
                )}
              </div>
            </div>

            {/* Events or ghost placeholder */}
            {day.events.length > 0 ? (
              <div className="flex flex-col gap-2">
                {day.events.map((ev) => (
                  <EventCard key={ev.id} event={ev} />
                ))}
              </div>
            ) : (
              <div
                className={`flex-1 min-h-[140px] rounded-lg border border-dashed bg-fd-card/20 grid place-items-center p-3 ${
                  day.isToday ? 'border-ib-brand' : 'border-fd-border/40'
                }`}
                aria-hidden
              >
                <p className="text-[10px] tracking-widest text-fd-muted-foreground/60 uppercase text-center m-0">
                  No events
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

export function WeekGrid(props: WeekGridProps) {
  return (
    <TimezoneProvider>
      <WeekGridInner {...props} />
    </TimezoneProvider>
  );
}
