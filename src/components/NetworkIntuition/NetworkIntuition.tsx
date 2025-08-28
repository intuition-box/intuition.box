import React, { useEffect, useRef, useState } from "react";
import { fetchLightweightOrgSnapshot, OrgCounters } from "../../utils/gitActivity";
import styles from "./NetworkIntuition.module.css";

const CACHE_KEY = "network_intuition_snapshot_v2";
const CACHE_TTL_MS = 15 * 60 * 1000;

function NumberTicker({
  value,
  startValue = 0,
  duration = 900,
  delay = 0,
  prefix = "",
  className = "",
}: {
  value: number;
  startValue?: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  className?: string;
}) {
  const [animated, setAnimated] = useState(startValue);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const startAt = performance.now() + (delay || 0);
    const from = animated;
    const to = value;
    const delta = to - from;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

    const loop = (ts: number) => {
      const t = Math.max(0, Math.min(1, (ts - startAt) / duration));
      const next = Math.round(from + delta * easeOut(t));
      setAnimated(prev => (prev !== next ? next : prev));
      if (t < 1) raf.current = requestAnimationFrame(loop);
    };

    raf.current = requestAnimationFrame(loop);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [value, duration, delay]);

  const digits = Math.max(String(animated).length, String(value).length);
  const str = Math.abs(animated).toString().padStart(digits, "0");
  const negative = animated < 0;

  return (
    <div className={`${styles.tickerRow} ${className}`} aria-live="polite">
      {prefix && <span className={styles.tickerPrefix}>{prefix}</span>}
      {negative && <span className={styles.tickerPrefix}>-</span>}
      <div className={styles.tickerReels} aria-hidden="true">
        {str.split("").map((ch, i) => {
          const d = Number.isNaN(Number(ch)) ? 0 : Number(ch);
          return (
            <span className={styles.tickerReel} key={`${i}-${digits}`}>
              <span
                className={styles.tickerReelInner}
                style={
                  {
                    "--y": -d,
                    "--dur": `${Math.max(120, duration - i * 40)}ms`,
                  } as React.CSSProperties
                }
              >
                <span className={styles.tickerDigit}>0</span>
                <span className={styles.tickerDigit}>1</span>
                <span className={styles.tickerDigit}>2</span>
                <span className={styles.tickerDigit}>3</span>
                <span className={styles.tickerDigit}>4</span>
                <span className={styles.tickerDigit}>5</span>
                <span className={styles.tickerDigit}>6</span>
                <span className={styles.tickerDigit}>7</span>
                <span className={styles.tickerDigit}>8</span>
                <span className={styles.tickerDigit}>9</span>
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function NetworkIntuition({
  org = "intuition-box",
  refreshSec = 120,
}: {
  org?: string;
  refreshSec?: number;
}) {
  const [counters, setCounters] = useState<OrgCounters>({ projects: 0, contributors: 0, commits: 0 });
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw) as { ts: number; val: OrgCounters };
        if (Date.now() - cached.ts < CACHE_TTL_MS && cached.val) {
          setCounters(cached.val);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    let disposed = false;
    let backoff = 1;
    let timer: number | null = null;

    const schedule = () => {
      if (disposed) return;
      timer = window.setTimeout(runOnce, refreshSec * 1000 * backoff);
    };

    const runOnce = async () => {
      try {
        setErr(null);
        const snap = await fetchLightweightOrgSnapshot(org);
        if (disposed) return;

        setCounters(snap);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), val: snap }));
        } catch {}

        backoff = 1;
      } catch (e) {
        setErr("rate-limited");
        backoff = Math.min(backoff * 2, 8);
      } finally {
        schedule();
      }
    };

    runOnce();
    return () => {
      disposed = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [org, refreshSec]);

  return (
    <div className={styles.wrap} aria-busy={!!err}>
      <div className={styles.row}>
        <div className={styles.block}>
          <NumberTicker value={counters.projects} duration={1100} />
          <div className={styles.label}>Projects</div>
        </div>
        <div className={styles.block}>
          <NumberTicker value={counters.contributors} duration={1100} delay={80} />
          <div className={styles.label}>Active contributors</div>
        </div>
        <div className={styles.block}>
          <NumberTicker value={counters.commits} duration={1100} delay={120} />
          <div className={styles.label}>Commits</div>
        </div>
      </div>
    </div>
  );
}
