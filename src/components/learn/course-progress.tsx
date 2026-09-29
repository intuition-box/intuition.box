'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@waveso/ui/button';
import { Check, CheckCircle2, Circle, Play, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'intuition-box:course-progress:v1';
const PROGRESS_EVENT = 'intuition-box:course-progress';

interface StoredCourseProgress {
  completed: string[];
  lastVisited?: string;
}

type StoredProgress = Record<string, StoredCourseProgress>;

interface SidebarModule {
  id: string;
  title: string;
  lessons: Array<{
    slug: string;
    title: string;
    duration: number;
  }>;
}

function readAllProgress(): StoredProgress {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as StoredProgress;
  } catch {
    return {};
  }
}

function writeCourseProgress(course: string, progress: StoredCourseProgress) {
  const all = readAllProgress();
  all[course] = progress;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: { course } }));
}

function useCourseProgress(course: string) {
  const [progress, setProgress] = useState<StoredCourseProgress>({ completed: [] });

  const refresh = useCallback(() => {
    setProgress(readAllProgress()[course] ?? { completed: [] });
  }, [course]);

  useEffect(() => {
    refresh();
    const onProgress = (event: Event) => {
      const detail = (event as CustomEvent<{ course?: string }>).detail;
      if (!detail?.course || detail.course === course) refresh();
    };
    const onStorage = () => refresh();
    window.addEventListener(PROGRESS_EVENT, onProgress);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, onProgress);
      window.removeEventListener('storage', onStorage);
    };
  }, [course, refresh]);

  return { progress, refresh };
}

export function CourseProgressCard({
  course,
  lessons,
}: {
  course: string;
  lessons: Array<{ slug: string; href: string }>;
}) {
  const { progress, refresh } = useCourseProgress(course);
  const completedCount = lessons.filter((lesson) => progress.completed.includes(lesson.slug)).length;
  const percentage = lessons.length === 0 ? 0 : Math.round((completedCount / lessons.length) * 100);
  const last = lessons.find((lesson) => lesson.slug === progress.lastVisited);
  const target = last ?? lessons[0];

  function reset() {
    writeCourseProgress(course, { completed: [] });
    refresh();
  }

  return (
    <div className="rounded-2xl border border-ib-brand-alpha bg-linear-to-b from-ib-brand-dark/70 to-fd-card p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-fd-muted-foreground">Your progress</span>
        <span className="text-xs font-semibold tabular-nums text-ib-brand">{percentage}%</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-fd-muted">
        <div
          className="h-full rounded-full bg-ib-brand transition-[width] duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-3 mb-5 text-xs text-fd-muted-foreground">
        {completedCount} of {lessons.length} lessons completed. Progress is saved in this browser.
      </p>
      {target && (
        <Button
          className="w-full bg-ib-brand text-ib-brand-dark hover:bg-ib-brand hover:opacity-70"
          render={<Link href={target.href} />}
        >
          <Play className="size-4" />
          {progress.lastVisited ? 'Continue course' : 'Begin course'}
        </Button>
      )}
      {completedCount > 0 && (
        <button
          type="button"
          onClick={reset}
          className="mt-3 flex w-full items-center justify-center gap-1.5 text-xs text-fd-muted-foreground hover:text-fd-foreground"
        >
          <RotateCcw className="size-3" />
          Reset progress
        </button>
      )}
    </div>
  );
}

export function CourseSidebar({
  course,
  courseTitle,
  modules,
  currentLesson,
}: {
  course: string;
  courseTitle: string;
  modules: SidebarModule[];
  currentLesson: string;
}) {
  const { progress } = useCourseProgress(course);
  const completed = useMemo(() => new Set(progress.completed), [progress.completed]);

  useEffect(() => {
    const current = readAllProgress()[course] ?? { completed: [] };
    if (current.lastVisited !== currentLesson) {
      writeCourseProgress(course, { ...current, lastVisited: currentLesson });
    }
  }, [course, currentLesson]);

  return (
    <nav aria-label={`${courseTitle} lessons`}>
      <Link
        href={`/learn/courses/${course}`}
        className="mb-5 block text-sm font-semibold text-fd-foreground no-underline hover:text-ib-brand"
      >
        {courseTitle}
      </Link>
      <div className="grid gap-5">
        {modules.map((module) => (
          <div key={module.id}>
            <p className="mb-2 text-[10px] font-semibold tracking-[0.14em] text-fd-muted-foreground uppercase">
              {module.title}
            </p>
            <ol className="m-0 grid list-none gap-1 p-0">
              {module.lessons.map((lesson) => {
                const isActive = lesson.slug === currentLesson;
                const isComplete = completed.has(lesson.slug);
                return (
                  <li key={lesson.slug}>
                    <Link
                      href={`/learn/courses/${course}/${lesson.slug}`}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-start gap-2 rounded-lg px-2.5 py-2 text-xs leading-5 no-underline transition-colors ${
                        isActive
                          ? 'bg-ib-brand-alpha text-ib-brand'
                          : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground'
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-ib-brand" />
                      ) : (
                        <Circle className="mt-0.5 size-3.5 shrink-0 opacity-50" />
                      )}
                      <span>{lesson.title}</span>
                      <span className="ml-auto shrink-0 text-[9px] opacity-60">{lesson.duration}m</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </nav>
  );
}

export function LessonCompletion({
  course,
  lesson,
  nextHref,
  nextTitle,
}: {
  course: string;
  lesson: string;
  nextHref?: string;
  nextTitle?: string;
}) {
  const { progress, refresh } = useCourseProgress(course);
  const isComplete = progress.completed.includes(lesson);

  function markComplete() {
    const current = readAllProgress()[course] ?? { completed: [] };
    const completed = Array.from(new Set([...current.completed, lesson]));
    writeCourseProgress(course, {
      completed,
      lastVisited: nextHref ? nextHref.split('/').pop() : lesson,
    });
    refresh();
  }

  return (
    <div className="not-prose mt-14 rounded-2xl border border-ib-brand-alpha bg-ib-brand-dark/45 p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ib-brand-alpha text-ib-brand">
          <Check className="size-4" />
        </span>
        <div>
          <h2 className="m-0 text-lg font-semibold">
            {isComplete ? 'Lesson complete' : 'Ready to continue?'}
          </h2>
          <p className="mt-1 mb-0 text-sm text-fd-muted-foreground">
            {nextTitle ? `Next: ${nextTitle}` : 'You have reached the end of this course.'}
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {!isComplete && (
          <Button
            onClick={markComplete}
            className="bg-ib-brand text-ib-brand-dark hover:bg-ib-brand hover:opacity-70"
          >
            Mark lesson complete
          </Button>
        )}
        {nextHref ? (
          <Button variant={isComplete ? 'default' : 'outline'} render={<Link href={nextHref} />}>
            Continue to next lesson
          </Button>
        ) : (
          <Button variant="outline" render={<Link href={`/learn/courses/${course}`} />}>
            Return to course
          </Button>
        )}
      </div>
    </div>
  );
}
