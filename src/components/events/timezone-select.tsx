'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectList,
  SelectTrigger,
} from '@waveso/ui/select';
import { Globe } from 'lucide-react';
import { TIMEZONE_OPTIONS, useTimezone } from './timezone-context';

export function TimezoneSelect() {
  const { timezone, setTimezone, ready, shortLabel } = useTimezone();

  // Don't render until we've read localStorage — prevents the flash where
  // the trigger shows the SSR default, then pops to the stored value.
  if (!ready) {
    return <div className="h-8 w-24" aria-hidden />;
  }

  // Ensure the browser-detected timezone is selectable even if it isn't in
  // the curated list.
  const options = TIMEZONE_OPTIONS.some((o) => o.value === timezone)
    ? TIMEZONE_OPTIONS
    : [{ label: timezone, value: timezone }, ...TIMEZONE_OPTIONS];

  return (
    <Select
      value={timezone}
      onValueChange={(value) => value && setTimezone(value)}
    >
      <SelectTrigger
        size="sm"
        className="gap-1.5 text-xs text-fd-muted-foreground"
        aria-label={`Change timezone (current: ${shortLabel})`}
      >
        <Globe className="size-3.5" />
        <span>{shortLabel}</span>
      </SelectTrigger>
      <SelectContent>
        <SelectList>
          <SelectGroup>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectList>
      </SelectContent>
    </Select>
  );
}
