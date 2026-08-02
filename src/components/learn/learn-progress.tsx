'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Check, RotateCcw } from 'lucide-react';
import type { LearnProgress } from '@/lib/learn';
import { learnProgressStorageKey } from '@/lib/learn';
import { cn } from '@/lib/cn';

interface LearnProgressContextValue {
  completedSlugs: readonly string[];
  hydrated: boolean;
  storageAvailable: boolean;
  completeLesson: (slug: string) => void;
  resetProgress: () => void;
}

const LearnProgressContext = createContext<LearnProgressContextValue | null>(
  null,
);

interface LearnProgressProviderProps {
  children: ReactNode;
  validSlugs: readonly string[];
}

export function LearnProgressProvider({
  children,
  validSlugs,
}: LearnProgressProviderProps) {
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const validSlugSet = useMemo(() => new Set(validSlugs), [validSlugs]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(learnProgressStorageKey);

      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Partial<LearnProgress>;
          const completed = Array.isArray(parsed.completedSlugs)
            ? parsed.completedSlugs.filter(
                (slug): slug is string =>
                  typeof slug === 'string' && validSlugSet.has(slug),
              )
            : [];
          setCompletedSlugs([...new Set(completed)]);
        } catch {
          window.localStorage.removeItem(learnProgressStorageKey);
        }
      }
    } catch {
      setStorageAvailable(false);
    } finally {
      setHydrated(true);
    }
  }, [validSlugSet]);

  const persist = useCallback((next: string[]) => {
    const progress: LearnProgress = {
      completedSlugs: next,
      updatedAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(
        learnProgressStorageKey,
        JSON.stringify(progress),
      );
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
  }, []);

  const completeLesson = useCallback(
    (slug: string) => {
      if (!validSlugSet.has(slug)) return;

      setCompletedSlugs((current) => {
        if (current.includes(slug)) return current;
        const next = [...current, slug];
        persist(next);
        return next;
      });
    },
    [persist, validSlugSet],
  );

  const resetProgress = useCallback(() => {
    setCompletedSlugs([]);

    try {
      window.localStorage.removeItem(learnProgressStorageKey);
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      completedSlugs,
      hydrated,
      storageAvailable,
      completeLesson,
      resetProgress,
    }),
    [
      completeLesson,
      completedSlugs,
      hydrated,
      resetProgress,
      storageAvailable,
    ],
  );

  return (
    <LearnProgressContext.Provider value={value}>
      {children}
    </LearnProgressContext.Provider>
  );
}

export function useLearnProgress() {
  const value = useContext(LearnProgressContext);
  if (!value) {
    throw new Error('useLearnProgress must be used inside LearnProgressProvider');
  }
  return value;
}

export function LearnProgressSummary({ total }: { total: number }) {
  const {
    completedSlugs,
    hydrated,
    resetProgress,
    storageAvailable,
  } = useLearnProgress();
  const completed = completedSlugs.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="border-y border-fd-border py-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="m-0 text-xs font-medium uppercase tracking-[0.2em] text-ib-brand">
            Your progress
          </p>
          <p className="mt-2 text-lg font-medium text-fd-foreground">
            {hydrated ? completed + ' of ' + total + ' lessons complete' : 'Loading local progress…'}
          </p>
          <p className="mt-1 text-sm text-fd-muted-foreground">
            {storageAvailable
              ? 'Saved only in this browser. No account or wallet required.'
              : 'Browser storage is unavailable. Progress will last for this visit.'}
          </p>
        </div>
        {completed > 0 && (
          <button
            type="button"
            onClick={resetProgress}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-fd-border px-4 text-sm text-fd-muted-foreground transition-colors duration-150 hover:border-ib-brand/40 hover:text-fd-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand"
          >
            <RotateCcw className="size-4" />
            Reset progress
          </button>
        )}
      </div>
      <div
        className="mt-5 h-1 overflow-hidden rounded-full bg-fd-muted"
        role="progressbar"
        aria-label="Lesson completion"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={completed}
      >
        <div
          className="h-full origin-left bg-ib-brand transition-transform duration-300 motion-reduce:transition-none"
          style={{ transform: 'scaleX(' + percent / 100 + ')' }}
        />
      </div>
    </div>
  );
}

interface LessonCompletionProps {
  slug: string;
  compact?: boolean;
}

export function LessonCompletion({
  slug,
  compact = false,
}: LessonCompletionProps) {
  const { completedSlugs, completeLesson, hydrated } = useLearnProgress();
  const complete = completedSlugs.includes(slug);

  return (
    <button
      type="button"
      onClick={() => completeLesson(slug)}
      disabled={!hydrated || complete}
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand disabled:cursor-default',
        compact ? 'w-full px-4 text-sm' : 'px-6 text-sm',
        complete
          ? 'border border-ib-brand/30 bg-ib-brand-alpha text-ib-brand'
          : 'bg-ib-brand text-ib-brand-dark hover:opacity-80 disabled:opacity-60',
      )}
    >
      {complete && <Check className="size-4" />}
      {complete ? 'Lesson complete' : 'Mark lesson complete'}
    </button>
  );
}
