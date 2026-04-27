'use client';

import { useEffect, useRef, useState } from 'react';
import type { OrgCounters } from '@/lib/github/types';
import { cn } from '@/lib/cn';

interface NetworkStatsProps {
  counters: OrgCounters;
}

function AnimatedNumber({ value, duration = 900 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (value === 0) {
      setDisplay(0);
      return;
    }

    const fromValue = display;
    const start = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(fromValue + (value - fromValue) * easeOut(t)));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // `display` is intentionally excluded — using it as the animation start
    // would re-trigger the effect on every frame. We only want a fresh
    // animation when `visible`, `value`, or `duration` change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, value, duration]);

  return (
    <span
      ref={ref}
      className="block text-3xl font-extrabold tabular-nums text-fd-primary sm:text-4xl"
    >
      {display.toLocaleString()}
    </span>
  );
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

export function NetworkStats({ counters }: NetworkStatsProps) {
  const { projects, contributors, commits, fetchedAt } = counters;
  const isEmpty = projects === 0 && contributors === 0 && commits === 0;

  if (isEmpty) {
    return (
      <p className="text-center italic text-fd-muted-foreground py-8">
        Stats are temporarily unavailable. Check back soon.
      </p>
    );
  }

  return (
    <div className="mt-5 mb-2">
      <div
        className={cn(
          'grid grid-cols-3 items-start justify-items-center',
          'gap-x-5 gap-y-6 sm:gap-x-16 lg:gap-x-24',
        )}
      >
        {[
          { value: projects, label: 'Projects' },
          { value: contributors, label: 'Active contributors' },
          { value: commits, label: 'Commits' },
        ].map((stat) => (
          <div key={stat.label} className="text-center min-w-[120px]">
            <AnimatedNumber value={stat.value} />
            <div className="mt-2 text-sm uppercase tracking-wider text-fd-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
