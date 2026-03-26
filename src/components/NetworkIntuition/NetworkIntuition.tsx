import React, { useEffect, useRef, useState } from 'react';
import useGlobalData from '@docusaurus/useGlobalData';
import styles from './NetworkIntuition.module.css';

interface OrgCounters {
  projects: number;
  contributors: number;
  commits: number;
  fetchedAt: string;
}

/** Simple count-up animation using requestAnimationFrame. */
function AnimatedNumber({ value, duration = 900 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const delta = value - from;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(from + delta * easeOut(t)));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return (
    <span className={styles.number}>
      {display.toLocaleString()}
    </span>
  );
}

export default function NetworkIntuition() {
  const globalData = useGlobalData();
  const stats = globalData['github-stats']?.default as OrgCounters | undefined;

  const projects = stats?.projects ?? 0;
  const contributors = stats?.contributors ?? 0;
  const commits = stats?.commits ?? 0;

  return (
    <div className={styles.wrap}>
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
    </div>
  );
}
