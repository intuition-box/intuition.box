'use client';

import Link from 'next/link';
import { BookOpen, ChevronDown } from 'lucide-react';
import { LessonCompletion } from './learn-progress';

interface TocItem {
  title: string;
  url: string;
}

interface LessonRailProps {
  slug: string;
  objectives: readonly string[];
  toc: readonly TocItem[];
  lessonNumber: string;
}

function RailContent({
  slug,
  objectives,
  toc,
  lessonNumber,
}: LessonRailProps) {
  return (
    <div className="space-y-7">
      <div>
        <p className="m-0 text-xs font-medium uppercase tracking-[0.2em] text-ib-brand">
          Lesson {lessonNumber}
        </p>
        <Link
          href="/learn"
          className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-fd-muted-foreground no-underline hover:text-fd-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand"
        >
          <BookOpen className="size-4" />
          All lessons
        </Link>
      </div>

      <div>
        <h2 className="m-0 text-xs font-medium uppercase tracking-[0.18em] text-fd-muted-foreground">
          Objectives
        </h2>
        <ul className="mt-3 space-y-3 pl-0">
          {objectives.map((objective) => (
            <li
              key={objective}
              className="grid grid-cols-[0.65rem_1fr] gap-2 text-sm leading-5 text-fd-muted-foreground"
            >
              <span className="mt-2 size-1.5 rounded-full bg-ib-brand" />
              {objective}
            </li>
          ))}
        </ul>
      </div>

      {toc.length > 0 && (
        <nav aria-label="On this lesson">
          <h2 className="m-0 text-xs font-medium uppercase tracking-[0.18em] text-fd-muted-foreground">
            On this lesson
          </h2>
          <ul className="mt-3 space-y-1 pl-0">
            {toc.map((item) => (
              <li key={item.url}>
                <a
                  href={item.url}
                  className="flex min-h-10 items-center border-l border-fd-border pl-3 text-sm leading-5 text-fd-muted-foreground no-underline transition-colors hover:border-ib-brand hover:text-fd-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <LessonCompletion slug={slug} compact />
    </div>
  );
}

export function LessonRail(props: LessonRailProps) {
  return (
    <>
      <details className="group mb-10 rounded-2xl border border-fd-border bg-fd-card/60 p-4 lg:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-fd-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand">
          Lesson guide
          <ChevronDown className="size-4 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" />
        </summary>
        <div className="mt-5 border-t border-fd-border pt-5">
          <RailContent {...props} />
        </div>
      </details>

      <aside className="hidden lg:block" aria-label="Lesson guide">
        <div className="sticky top-24">
          <RailContent {...props} />
        </div>
      </aside>
    </>
  );
}
