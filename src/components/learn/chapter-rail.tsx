'use client';

import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import type { LearnLessonSummary } from '@/lib/learn';
import { useLearnProgress } from './learn-progress';
import { cn } from '@/lib/cn';

export function ChapterRail({
  lessons,
}: {
  lessons: readonly LearnLessonSummary[];
}) {
  const { completedSlugs, hydrated } = useLearnProgress();

  return (
    <ol className="m-0 list-none border-b border-fd-border p-0">
      {lessons.map((lesson) => {
        const complete = hydrated && completedSlugs.includes(lesson.slug);
        return (
          <li key={lesson.slug} className="border-t border-fd-border">
            <Link
              href={lesson.href}
              className="group grid min-h-32 gap-5 py-7 no-underline transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ib-brand md:grid-cols-[5rem_1fr_auto] md:items-start"
            >
              <div className="flex items-center gap-3 md:block">
                <span
                  className={cn(
                    'inline-flex size-11 items-center justify-center rounded-full border text-sm font-medium tabular-nums',
                    complete
                      ? 'border-ib-brand/40 bg-ib-brand-alpha text-ib-brand'
                      : 'border-fd-border text-fd-muted-foreground group-hover:border-ib-brand/40 group-hover:text-fd-foreground',
                  )}
                >
                  {complete ? <Check className="size-4" /> : lesson.number}
                </span>
                <span className="text-xs uppercase tracking-[0.16em] text-fd-muted-foreground md:mt-3 md:block">
                  {lesson.durationMinutes} min
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="m-0 text-xl font-semibold tracking-tight text-fd-foreground sm:text-2xl">
                    {lesson.title}
                  </h3>
                  <span className="rounded-full border border-fd-border px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-fd-muted-foreground">
                    {lesson.level}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-fd-muted-foreground">
                  {lesson.outcome}
                </p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                  {lesson.concepts.slice(0, 4).map((concept) => (
                    <span
                      key={concept}
                      className="text-xs text-fd-muted-foreground before:mr-2 before:text-ib-brand before:content-['·']"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              <ArrowUpRight className="hidden size-5 text-fd-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ib-brand motion-reduce:transform-none md:block" />
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
