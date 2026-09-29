'use client';

import { useCallback, useEffect, useState } from 'react';
import { Check, CheckCircle2, Circle } from 'lucide-react';

const STORAGE_KEY = 'intuition-box:build-progress:v1';
const PROGRESS_EVENT = 'intuition-box:build-progress';

type StoredProgress = Record<string, { completed: boolean; completedAt?: string }>;

function readProgress(): StoredProgress {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as StoredProgress;
  } catch {
    return {};
  }
}

function useBuildProgress(guide: string) {
  const [complete, setComplete] = useState(false);

  const refresh = useCallback(() => {
    setComplete(Boolean(readProgress()?.[guide]?.completed));
  }, [guide]);

  useEffect(() => {
    refresh();
    const onProgress = () => refresh();
    window.addEventListener(PROGRESS_EVENT, onProgress);
    window.addEventListener('storage', onProgress);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, onProgress);
      window.removeEventListener('storage', onProgress);
    };
  }, [refresh]);

  function toggle() {
    const next = !complete;
    setComplete(next);
    try {
      const all = readProgress() ?? {};
      all[guide] = {
        completed: next,
        completedAt: next ? new Date().toISOString() : undefined,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: { guide } }));
    } catch {
      // The current session remains usable if browser storage is unavailable.
    }
  }

  return { complete, toggle };
}

export function BuildProgressBadge({ guide }: { guide: string }) {
  const { complete } = useBuildProgress(guide);
  return complete ? (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ib-brand">
      <CheckCircle2 className="size-3.5" /> Completed
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-xs text-fd-muted-foreground">
      <Circle className="size-3.5" /> Ready to build
    </span>
  );
}

export function BuildCompletion({ guide, outcome }: { guide: string; outcome: string }) {
  const { complete, toggle } = useBuildProgress(guide);

  return (
    <section className="not-prose mt-14 rounded-2xl border border-ib-teal-alpha bg-ib-teal-alpha/25 p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-sm font-semibold text-ib-teal">
            <CheckCircle2 className="size-4" /> Build checkpoint
          </div>
          <h2 className="mt-3 mb-0 text-xl font-semibold text-fd-foreground">
            {complete ? 'Build completed' : 'Does your finished result work?'}
          </h2>
          <p className="mt-2 mb-0 text-sm leading-6 text-fd-muted-foreground">{outcome}</p>
        </div>
        <button
          type="button"
          onClick={toggle}
          className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            complete
              ? 'border border-ib-brand-alpha bg-ib-brand-alpha text-ib-brand'
              : 'bg-ib-teal text-ib-brand-dark hover:opacity-80'
          }`}
        >
          <Check className="size-4" />
          {complete ? 'Completed—mark incomplete' : 'Mark build complete'}
        </button>
      </div>
    </section>
  );
}
