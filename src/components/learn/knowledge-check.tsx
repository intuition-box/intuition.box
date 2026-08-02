'use client';

import { useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import type { KnowledgeCheckProps } from '@/lib/learn';
import { cn } from '@/lib/cn';

export function KnowledgeCheck({
  id,
  prompt,
  options,
  answer,
  explanation,
}: KnowledgeCheckProps) {
  const [selected, setSelected] = useState('');
  const [checked, setChecked] = useState(false);
  const correct = checked && selected === answer;

  function checkAnswer() {
    if (selected) setChecked(true);
  }

  function retry() {
    setSelected('');
    setChecked(false);
  }

  return (
    <section
      aria-labelledby={id + '-legend'}
      className="not-prose my-10 border-y border-fd-border py-7"
    >
      <p className="m-0 text-xs font-medium uppercase tracking-[0.2em] text-ib-brand">
        Knowledge check
      </p>
      <fieldset className="mt-4">
        <legend
          id={id + '-legend'}
          className="text-lg font-medium leading-7 text-fd-foreground"
        >
          {prompt}
        </legend>
        <div className="mt-5 grid gap-3">
          {options.map((option) => {
            const active = selected === option.id;
            return (
              <label
                key={option.id}
                className={cn(
                  'grid min-h-12 cursor-pointer grid-cols-[1.25rem_1fr] items-center gap-3 rounded-xl border px-4 py-3 text-sm leading-6 transition-colors duration-150',
                  active
                    ? 'border-ib-brand/50 bg-ib-brand-alpha text-fd-foreground'
                    : 'border-fd-border text-fd-muted-foreground hover:border-fd-muted-foreground/40 hover:text-fd-foreground',
                )}
              >
                <input
                  type="radio"
                  name={id}
                  value={option.id}
                  checked={active}
                  disabled={checked}
                  onChange={() => setSelected(option.id)}
                  className="size-4 accent-[var(--color-ib-brand)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand"
                />
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {!checked ? (
        <button
          type="button"
          onClick={checkAnswer}
          disabled={!selected}
          className="mt-5 inline-flex min-h-11 items-center rounded-full bg-ib-brand px-5 text-sm font-medium text-ib-brand-dark transition-opacity duration-150 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand disabled:cursor-not-allowed disabled:opacity-40"
        >
          Check answer
        </button>
      ) : (
        <div
          className={cn(
            'mt-5 rounded-xl border p-4',
            correct
              ? 'border-ib-brand/30 bg-ib-brand-alpha'
              : 'border-ib-red/30 bg-ib-red-alpha',
          )}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            {correct ? (
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-ib-brand" />
            ) : (
              <XCircle className="mt-0.5 size-5 shrink-0 text-ib-red" />
            )}
            <div>
              <p className="m-0 font-medium text-fd-foreground">
                {correct ? 'That’s it.' : 'Not quite yet.'}
              </p>
              <p className="mt-1 text-sm leading-6 text-fd-muted-foreground">
                {explanation}
              </p>
            </div>
          </div>
          {!correct && (
            <button
              type="button"
              onClick={retry}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-fd-border px-4 text-sm text-fd-foreground transition-colors duration-150 hover:border-ib-brand/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand"
            >
              <RotateCcw className="size-4" />
              Try again
            </button>
          )}
        </div>
      )}
    </section>
  );
}
