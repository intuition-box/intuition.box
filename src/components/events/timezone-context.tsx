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

const STORAGE_KEY = 'ib-events-timezone';

/**
 * Curated timezone list. User's browser-detected TZ is inserted at runtime
 * if it isn't already here, so anyone in an uncommon TZ still sees theirs.
 */
export const TIMEZONE_OPTIONS: { label: string; value: string }[] = [
  { label: 'Eastern (ET)', value: 'America/New_York' },
  { label: 'Pacific (PT)', value: 'America/Los_Angeles' },
  { label: 'Central (CT)', value: 'America/Chicago' },
  { label: 'London (GMT/BST)', value: 'Europe/London' },
  { label: 'Central Europe (CET)', value: 'Europe/Paris' },
  { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
  { label: 'UTC', value: 'UTC' },
];

const DEFAULT_TIMEZONE = 'America/New_York';

interface TimezoneContextValue {
  timezone: string;
  setTimezone: (tz: string) => void;
  /** Stable across SSR — use this for rendering to avoid hydration mismatch. */
  ready: boolean;
  /** Short label like "ET", "PT", "CET", "JST" derived from the active tz. */
  shortLabel: string;
}

const TimezoneContext = createContext<TimezoneContextValue | null>(null);

function deriveShortLabel(timezone: string, now: Date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    }).formatToParts(now);
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? timezone;
  } catch {
    return timezone;
  }
}

export function TimezoneProvider({ children }: { children: ReactNode }) {
  const [timezone, setTimezoneState] = useState<string>(DEFAULT_TIMEZONE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTimezoneState(stored);
      } else {
        // First visit: adopt the user's detected timezone if Intl can resolve one.
        const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (detected) setTimezoneState(detected);
      }
    } catch {
      // localStorage unavailable (Safari private mode, etc.) — stick with default.
    }
    setReady(true);
  }, []);

  const setTimezone = useCallback((tz: string) => {
    setTimezoneState(tz);
    try {
      localStorage.setItem(STORAGE_KEY, tz);
    } catch {
      // ignore storage failures
    }
  }, []);

  const value = useMemo<TimezoneContextValue>(
    () => ({
      timezone,
      setTimezone,
      ready,
      shortLabel: deriveShortLabel(timezone),
    }),
    [timezone, setTimezone, ready],
  );

  return <TimezoneContext.Provider value={value}>{children}</TimezoneContext.Provider>;
}

export function useTimezone(): TimezoneContextValue {
  const ctx = useContext(TimezoneContext);
  if (!ctx) {
    throw new Error('useTimezone must be used inside <TimezoneProvider>');
  }
  return ctx;
}
