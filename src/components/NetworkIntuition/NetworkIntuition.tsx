import React, { useEffect, useRef, useState } from 'react';
import useGlobalData from '@docusaurus/useGlobalData';
import styles from './NetworkIntuition.module.css';

interface OrgCounters {
  projects: number;
  contributors: number;
  commits: number;
  fetchedAt: string;
}

/** Count-up animation triggered by IntersectionObserver. */
function AnimatedNumber({ value, duration = 900 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);

  // Observe visibility
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Animate when visible
  useEffect(() => {
    if (!visible || value === 0) return;

    const start = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(value * easeOut(t)));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible, value, duration]);

  return (
    <span ref={ref} className={styles.number}>
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

export default function NetworkIntuition() {
  const globalData = useGlobalData();
  const pluginData = globalData['github-stats']?.default as
    | { counters: OrgCounters }
    | undefined;

  const stats = pluginData?.counters;
  const projects = stats?.projects ?? 0;
  const contributors = stats?.contributors ?? 0;
  const commits = stats?.commits ?? 0;
  const isEmpty = projects === 0 && contributors === 0 && commits === 0;

  return (
    <div className={styles.wrap}>
      {isEmpty ? (
        <p className={styles.empty}>
          Stats are temporarily unavailable. Check back soon.
        </p>
      ) : (
        <>
          <div className={styles.row}>
            <div className={styles.block}>
              <AnimatedNumber value={projects} />
              <div className={styles.label}>Projects</div>
            </div>
            <div className={styles.block}>
              <AnimatedNumber value={contributors} />
              <div className={styles.label}>Active contributors</div>
            </div>
            <div className={styles.block}>
              <AnimatedNumber value={commits} />
              <div className={styles.label}>Commits</div>
            </div>
          </div>
          {stats?.fetchedAt && (
            <div className={styles.timestamp}>
              as of {formatDate(stats.fetchedAt)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
