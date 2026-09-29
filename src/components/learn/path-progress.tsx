'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  ExternalLink,
  Map as MapIcon,
  Telescope,
} from 'lucide-react';

const COURSE_STORAGE_KEY = 'intuition-box:course-progress:v1';
const COURSE_PROGRESS_EVENT = 'intuition-box:course-progress';
const PATH_STORAGE_KEY = 'intuition-box:path-progress:v1';
const PATH_PROGRESS_EVENT = 'intuition-box:path-progress';

export interface PathLessonStep {
  kind: 'lesson';
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: number;
  href: string;
  course: string;
}

export interface PathActivityStep {
  kind: 'activity';
  id: string;
  title: string;
  description: string;
  duration: number;
  instructions: string[];
  deliverable: string;
  externalHref?: string;
  externalLabel?: string;
}

export type PathStep = PathLessonStep | PathActivityStep;

export interface PathStage {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  steps: PathStep[];
}

interface CourseProgress {
  completed?: string[];
}

type StoredCourseProgress = Record<string, CourseProgress>;
type StoredPathProgress = Record<string, { completedActivities?: string[] }>;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? '') as T;
  } catch {
    return fallback;
  }
}

function writeActivities(path: string, completedActivities: string[]) {
  try {
    const all = readJson<StoredPathProgress>(PATH_STORAGE_KEY, {});
    all[path] = { completedActivities };
    window.localStorage.setItem(PATH_STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent(PATH_PROGRESS_EVENT, { detail: { path } }));
  } catch {
    // Keep the in-memory interaction usable when browser storage is unavailable.
  }
}

export function PathExperience({
  path,
  stages,
}: {
  path: string;
  stages: PathStage[];
}) {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const allSteps = useMemo(() => stages.flatMap((stage) => stage.steps), [stages]);

  const refresh = useCallback(() => {
    const courses = readJson<StoredCourseProgress>(COURSE_STORAGE_KEY, {});
    const lessonIds = Object.entries(courses ?? {}).flatMap(([course, progress]) =>
      (progress.completed ?? []).map((lesson) => `${course}:${lesson}`),
    );
    const paths = readJson<StoredPathProgress>(PATH_STORAGE_KEY, {});
    setCompletedLessons(lessonIds);
    setCompletedActivities(paths?.[path]?.completedActivities ?? []);
  }, [path]);

  useEffect(() => {
    refresh();
    const onProgress = () => refresh();
    window.addEventListener(COURSE_PROGRESS_EVENT, onProgress);
    window.addEventListener(PATH_PROGRESS_EVENT, onProgress);
    window.addEventListener('storage', onProgress);
    return () => {
      window.removeEventListener(COURSE_PROGRESS_EVENT, onProgress);
      window.removeEventListener(PATH_PROGRESS_EVENT, onProgress);
      window.removeEventListener('storage', onProgress);
    };
  }, [refresh]);

  useEffect(() => {
    const openLinkedActivity = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target instanceof HTMLDetailsElement) target.open = true;
    };
    openLinkedActivity();
    window.addEventListener('hashchange', openLinkedActivity);
    return () => window.removeEventListener('hashchange', openLinkedActivity);
  }, []);

  const isComplete = useCallback(
    (step: PathStep) =>
      step.kind === 'lesson'
        ? completedLessons.includes(`${step.course}:${step.slug}`)
        : completedActivities.includes(step.id),
    [completedActivities, completedLessons],
  );

  const completedCount = allSteps.filter(isComplete).length;
  const percentage = allSteps.length === 0
    ? 0
    : Math.round((completedCount / allSteps.length) * 100);
  const nextStep = allSteps.find((step) => !isComplete(step));
  const stepNumbers = new globalThis.Map(allSteps.map((step, index) => [step.id, index + 1]));

  function toggleActivity(id: string) {
    const next = completedActivities.includes(id)
      ? completedActivities.filter((item) => item !== id)
      : [...completedActivities, id];
    writeActivities(path, next);
    setCompletedActivities(next);
  }

  return (
    <>
      <section className="rounded-2xl border border-ib-brand-alpha bg-linear-to-br from-ib-brand-dark/70 via-fd-card to-fd-card p-6 sm:p-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-sm font-medium text-ib-brand">
              <MapIcon className="size-4" /> Your path progress
            </div>
            <p className="mt-3 mb-0 text-sm leading-6 text-fd-muted-foreground">
              Lessons sync with the Foundations course. Activities and progress stay in this browser—no account required.
            </p>
          </div>
          <p className="m-0 text-sm tabular-nums text-fd-muted-foreground">
            <strong className="text-2xl font-semibold text-fd-foreground">{completedCount}</strong>
            <span> / {allSteps.length} steps</span>
          </p>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-fd-muted">
          <div
            className="h-full rounded-full bg-ib-brand transition-[width] duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs font-medium text-ib-brand">{percentage}% complete</span>
          {nextStep ? (
            <Link
              href={nextStep.kind === 'lesson' ? nextStep.href : `#activity-${nextStep.id}`}
              className="inline-flex items-center gap-2 text-sm font-medium no-underline hover:text-ib-brand"
            >
              Continue: {nextStep.title} <ArrowRight className="size-4" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2 text-sm font-medium text-ib-brand">
              <CheckCircle2 className="size-4" /> Path complete
            </span>
          )}
        </div>
      </section>

      <div className="mt-12 grid gap-8">
        {stages.map((stage, stageIndex) => {
          const stageComplete = stage.steps.every(isComplete);
          return (
            <section key={stage.id} className="relative grid gap-5 lg:grid-cols-[190px_minmax(0,1fr)]">
              <header className="lg:sticky lg:top-24 lg:self-start">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-full border border-ib-brand-alpha bg-ib-brand-alpha text-xs font-semibold text-ib-brand">
                    {stageIndex + 1}
                  </span>
                  {stageComplete && <CheckCircle2 className="size-4 text-ib-brand" />}
                </div>
                <p className="mt-4 mb-0 text-[10px] font-semibold tracking-[0.16em] text-ib-brand uppercase">
                  {stage.eyebrow}
                </p>
                <h2 className="mt-2 mb-0 text-xl font-semibold tracking-tight">{stage.title}</h2>
                <p className="mt-2 mb-0 text-xs leading-5 text-fd-muted-foreground">{stage.description}</p>
              </header>

              <ol className="m-0 grid list-none gap-3 p-0">
                {stage.steps.map((step) => {
                  const complete = isComplete(step);
                  return (
                    <li key={step.id}>
                      {step.kind === 'lesson' ? (
                        <Link
                          href={step.href}
                          className="group flex items-start gap-4 rounded-xl border border-fd-border bg-fd-card p-4 no-underline transition-colors hover:border-ib-brand-alpha hover:bg-fd-accent/30 sm:p-5"
                        >
                          <StepMarker complete={complete} number={stepNumbers.get(step.id) ?? 0} />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-[10px] text-fd-muted-foreground">
                              <span className="font-medium tracking-wider text-ib-purple uppercase">Course lesson</span>
                              <span aria-hidden>·</span>
                              <span className="inline-flex items-center gap-1"><Clock3 className="size-3" /> {step.duration} min</span>
                            </div>
                            <h3 className="mt-2 mb-0 text-base font-medium text-fd-foreground">{step.title}</h3>
                            <p className="mt-1 mb-0 text-sm leading-6 text-fd-muted-foreground">{step.description}</p>
                          </div>
                          <ArrowRight className="mt-2 size-4 shrink-0 text-fd-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-ib-brand" />
                        </Link>
                      ) : (
                        <details
                          id={`activity-${step.id}`}
                          className="group scroll-mt-24 overflow-hidden rounded-xl border border-ib-teal-alpha bg-fd-card"
                        >
                          <summary className="flex cursor-pointer list-none items-start gap-4 p-4 marker:content-none sm:p-5">
                            <StepMarker complete={complete} number={stepNumbers.get(step.id) ?? 0} activity />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2 text-[10px] text-fd-muted-foreground">
                                <span className="font-medium tracking-wider text-ib-teal uppercase">No-code field activity</span>
                                <span aria-hidden>·</span>
                                <span className="inline-flex items-center gap-1"><Clock3 className="size-3" /> {step.duration} min</span>
                              </div>
                              <h3 className="mt-2 mb-0 text-base font-medium text-fd-foreground">{step.title}</h3>
                              <p className="mt-1 mb-0 text-sm leading-6 text-fd-muted-foreground">{step.description}</p>
                            </div>
                            <span className="mt-2 shrink-0 text-xs text-fd-muted-foreground group-open:hidden">Open</span>
                          </summary>
                          <div className="border-t border-ib-teal-alpha px-5 py-5 sm:pl-[76px]">
                            <ol className="m-0 grid list-decimal gap-2 pl-5 text-sm leading-6 text-fd-muted-foreground">
                              {step.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}
                            </ol>
                            <div className="mt-5 rounded-lg border border-fd-border bg-fd-muted/30 p-4 text-sm">
                              <strong className="block text-xs tracking-wider text-fd-foreground uppercase">Your deliverable</strong>
                              <p className="mt-2 mb-0 leading-6 text-fd-muted-foreground">{step.deliverable}</p>
                            </div>
                            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                              {step.externalHref && (
                                <a
                                  href={step.externalHref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 rounded-lg border border-fd-border px-4 py-2.5 text-sm font-medium no-underline hover:bg-fd-accent"
                                >
                                  <Telescope className="size-4" /> {step.externalLabel} <ExternalLink className="size-3.5" />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => toggleActivity(step.id)}
                                className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                                  complete
                                    ? 'border border-ib-brand-alpha bg-ib-brand-alpha text-ib-brand'
                                    : 'bg-ib-brand text-ib-brand-dark hover:opacity-80'
                                }`}
                              >
                                <Check className="size-4" /> {complete ? 'Completed—mark incomplete' : 'Mark activity complete'}
                              </button>
                            </div>
                          </div>
                        </details>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </>
  );
}

function StepMarker({
  complete,
  number,
  activity = false,
}: {
  complete: boolean;
  number: number;
  activity?: boolean;
}) {
  return (
    <span
      className={`flex size-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
        complete
          ? 'border-ib-brand bg-ib-brand text-ib-brand-dark'
          : activity
            ? 'border-ib-teal-alpha bg-ib-teal-alpha text-ib-teal'
            : 'border-fd-border bg-fd-muted text-fd-muted-foreground'
      }`}
    >
      {complete ? <Check className="size-4" /> : number || <Circle className="size-3" />}
    </span>
  );
}
