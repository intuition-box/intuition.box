'use client';

import {
  useCallback,
  useMemo,
  useRef,
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Badge } from '@waveso/ui/badge';
import { Button } from '@waveso/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@waveso/ui/dialog';
import { Masonry, MasonryItem } from '@waveso/ui/masonry';
import { ScrollArea } from '@waveso/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@waveso/ui/select';
import { RefreshButton } from './refresh-button';
import { cardClasses, getCardColumnWidth } from '@/components/card';
import { MarkdownBody, bodyToPreview } from '@/components/markdown-body';
import {
  ExternalLink,
  Clock,
  CheckCircle,
  Zap,
  CircleDashed,
  PlayCircle,
  Eye,
  CreditCard,
  Users,
  FileText,
} from 'lucide-react';
import type { Mission } from '@/lib/github/fetch-missions-data';
import { MISSIONS_PROJECT_URL } from '@/lib/github/constants';
import { cn } from '@/lib/cn';

type BadgeVariant = ComponentProps<typeof Badge>['variant'];

interface StatusToken {
  /** Tailwind classes layered onto wave-ui's `outline` variant. */
  className: string;
  icon: ReactNode;
  /** Lower = appears earlier in default ("status") sort. */
  weight: number;
}

// Color spec (per Saulo): Ideas/Pending Payment outline · Backlog & Paid green
// · Application open orange · In progress yellow · In review purple.
const STATUS_TOKENS: Record<string, StatusToken> = {
  'Application open': {
    className:
      'bg-ib-orange-alpha text-ib-orange border-ib-orange/30',
    icon: <Clock className="size-3" />,
    weight: 0,
  },
  'In progress': {
    className:
      'bg-ib-yellow-alpha text-ib-yellow border-ib-yellow/30',
    icon: <PlayCircle className="size-3" />,
    weight: 1,
  },
  'In review': {
    className:
      'bg-ib-purple-alpha text-ib-purple border-ib-purple/30',
    icon: <Eye className="size-3" />,
    weight: 2,
  },
  'Pending Payment': {
    className: 'border-fd-border text-fd-muted-foreground bg-transparent',
    icon: <CreditCard className="size-3" />,
    weight: 3,
  },
  Backlog: {
    className: 'bg-ib-brand-alpha text-ib-brand border-ib-brand/30',
    icon: <CircleDashed className="size-3" />,
    weight: 4,
  },
  Ideas: {
    className: 'border-fd-border text-fd-muted-foreground bg-transparent',
    icon: <Zap className="size-3" />,
    weight: 5,
  },
  Paid: {
    className: 'bg-ib-brand-alpha text-ib-brand border-ib-brand/30',
    icon: <CheckCircle className="size-3" />,
    weight: 6,
  },
};

const FALLBACK_TOKEN: StatusToken = {
  className: 'border-fd-border text-fd-muted-foreground bg-transparent',
  icon: <Clock className="size-3" />,
  weight: 99,
};

function getStatusToken(status: string): StatusToken {
  return STATUS_TOKENS[status] ?? FALLBACK_TOKEN;
}

/** Higher = sorted earlier when sortBy is 'priority'. */
const PRIORITY_WEIGHT: Record<string, number> = { P0: 3, P1: 2, P2: 1 };

type SortKey = 'priority' | 'status' | 'updated';
type StatusFilter = 'all' | string;

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'priority', label: 'Priority' },
  { value: 'status', label: 'Status' },
  { value: 'updated', label: 'Recently updated' },
];

const DEFAULT_SORT: SortKey = 'priority';

function statusToSlug(status: string): string {
  return status.toLowerCase().replace(/\s+/g, '-');
}

const RELATIVE_TIME = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const sec = Math.round(ms / 1000);
  if (sec < 60) return RELATIVE_TIME.format(-sec, 'second');
  const min = Math.round(sec / 60);
  if (min < 60) return RELATIVE_TIME.format(-min, 'minute');
  const hr = Math.round(min / 60);
  if (hr < 24) return RELATIVE_TIME.format(-hr, 'hour');
  const day = Math.round(hr / 24);
  if (day < 30) return RELATIVE_TIME.format(-day, 'day');
  const mo = Math.round(day / 30);
  if (mo < 12) return RELATIVE_TIME.format(-mo, 'month');
  const yr = Math.round(mo / 12);
  return RELATIVE_TIME.format(-yr, 'year');
}

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function formatReward(amount: number): string {
  return USD.format(amount);
}

interface MissionsGridProps {
  missions: Mission[];
}

export function MissionsGrid({ missions }: MissionsGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Statuses present in the data, ordered by canonical weight. Computed
  // before reading URL state because we use it to validate the slug.
  const statuses = useMemo(() => {
    const seen = new Set<string>();
    for (const m of missions) seen.add(m.status);
    return Array.from(seen).sort(
      (a, b) => getStatusToken(a).weight - getStatusToken(b).weight,
    );
  }, [missions]);

  // ── URL state ────────────────────────────────────────────────────
  // Status as slug ("in-progress"), sort as-is. Default values (`all`,
  // `priority`) are dropped from the URL so a clean page has no params.
  const statusSlug = searchParams.get('status');
  const selectedStatus: StatusFilter = useMemo(() => {
    if (!statusSlug) return 'all';
    const match = statuses.find((s) => statusToSlug(s) === statusSlug);
    return match ?? 'all';
  }, [statusSlug, statuses]);

  const sortParam = searchParams.get('sort') as SortKey | null;
  const sortBy: SortKey = SORT_OPTIONS.some((o) => o.value === sortParam)
    ? (sortParam as SortKey)
    : DEFAULT_SORT;

  const updateParams = useCallback(
    (next: { status?: StatusFilter; sort?: SortKey }) => {
      const params = new URLSearchParams(searchParams.toString());
      if ('status' in next) {
        if (next.status && next.status !== 'all') {
          params.set('status', statusToSlug(next.status));
        } else {
          params.delete('status');
        }
      }
      if ('sort' in next) {
        if (next.sort && next.sort !== DEFAULT_SORT) {
          params.set('sort', next.sort);
        } else {
          params.delete('sort');
        }
      }
      const qs = params.toString();
      // `replace` so the back button isn't polluted with every chip click.
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const setSelectedStatus = useCallback(
    (status: StatusFilter) => updateParams({ status }),
    [updateParams],
  );
  const setSortBy = useCallback(
    (sort: SortKey) => updateParams({ sort }),
    [updateParams],
  );

  // ── Filter + sort ────────────────────────────────────────────────
  const visibleMissions = useMemo(() => {
    const filtered =
      selectedStatus === 'all'
        ? missions
        : missions.filter((m) => m.status === selectedStatus);

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'priority') {
        const pa = PRIORITY_WEIGHT[a.priority ?? ''] ?? 0;
        const pb = PRIORITY_WEIGHT[b.priority ?? ''] ?? 0;
        if (pa !== pb) return pb - pa;
        const sa = getStatusToken(a.status).weight;
        const sb = getStatusToken(b.status).weight;
        if (sa !== sb) return sa - sb;
        return compareUpdatedDesc(a, b);
      }
      if (sortBy === 'status') {
        const sa = getStatusToken(a.status).weight;
        const sb = getStatusToken(b.status).weight;
        if (sa !== sb) return sa - sb;
        return compareUpdatedDesc(a, b);
      }
      return compareUpdatedDesc(a, b);
    });

    return sorted;
  }, [missions, selectedStatus, sortBy]);

  return (
    <div className="flex flex-col gap-6">
      <Toolbar
        statuses={statuses}
        missions={missions}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalCount={missions.length}
      />

      {visibleMissions.length > 0 ? (
        <Masonry columnWidth={getCardColumnWidth('default')} gap={6}>
          {visibleMissions.map((mission) => (
            <MasonryItem key={mission.id}>
              <MissionCard mission={mission} />
            </MasonryItem>
          ))}
        </Masonry>
      ) : (
        <div className="rounded-xl border border-fd-border bg-fd-card/40 p-8 text-center">
          <p className="text-sm text-fd-muted-foreground m-0">
            No missions match{' '}
            <span className="text-fd-foreground font-medium">
              {selectedStatus}
            </span>
            .
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => setSelectedStatus('all')}
          >
            Reset filter
          </Button>
        </div>
      )}
    </div>
  );
}

function compareUpdatedDesc(a: Mission, b: Mission): number {
  const ta = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
  const tb = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
  return tb - ta;
}

// ── Toolbar ──────────────────────────────────────────────────────────

interface ToolbarProps {
  statuses: string[];
  missions: Mission[];
  selectedStatus: StatusFilter;
  onStatusChange: (next: StatusFilter) => void;
  sortBy: SortKey;
  onSortChange: (next: SortKey) => void;
  totalCount: number;
}

function Toolbar({
  statuses,
  missions,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  totalCount,
}: ToolbarProps) {
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const m of missions) {
      map[m.status] = (map[m.status] ?? 0) + 1;
    }
    return map;
  }, [missions]);

  // Roving tabindex for the radiogroup: only the active chip is tabbable.
  // Arrow keys move focus + selection between siblings.
  const groupRef = useRef<HTMLDivElement>(null);
  const allValues: StatusFilter[] = ['all', ...statuses];

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const { key } = event;
    if (
      key !== 'ArrowRight' &&
      key !== 'ArrowLeft' &&
      key !== 'Home' &&
      key !== 'End'
    ) {
      return;
    }
    event.preventDefault();
    const currentIndex = allValues.indexOf(selectedStatus);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % allValues.length;
    } else if (key === 'ArrowLeft') {
      nextIndex =
        (currentIndex - 1 + allValues.length) % allValues.length;
    } else if (key === 'Home') {
      nextIndex = 0;
    } else if (key === 'End') {
      nextIndex = allValues.length - 1;
    }

    const nextValue = allValues[nextIndex];
    onStatusChange(nextValue);

    // Move focus to the chip that's about to become active.
    requestAnimationFrame(() => {
      const next = groupRef.current?.querySelector<HTMLButtonElement>(
        `[data-chip-value="${chipDataValue(nextValue)}"]`,
      );
      next?.focus();
    });
  };

  return (
    <div className="flex items-center justify-between gap-6">
      <div
        ref={groupRef}
        role="radiogroup"
        aria-label="Filter missions by status"
        onKeyDown={handleKeyDown}
        className="flex flex-wrap items-center gap-1.5"
      >
        <FilterChip
          value="all"
          active={selectedStatus === 'all'}
          onSelect={onStatusChange}
          label="All"
          count={totalCount}
        />
        {statuses.map((status) => (
          <FilterChip
            key={status}
            value={status}
            active={selectedStatus === status}
            onSelect={onStatusChange}
            label={status}
            count={counts[status] ?? 0}
            icon={getStatusToken(status).icon}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <RefreshButton />
        <Select<SortKey>
          value={sortBy}
          onValueChange={(v) => onSortChange(v as SortKey)}
        >
          <SelectTrigger size="sm" className="min-w-[180px]">
            <span className="text-fd-muted-foreground">Sort:</span>
            <SelectValue>
              {(value) =>
                SORT_OPTIONS.find((o) => o.value === value)?.label ?? value
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="end">
            <SelectGroup>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function chipDataValue(value: StatusFilter): string {
  return value === 'all' ? 'all' : statusToSlug(value);
}

interface FilterChipProps {
  value: StatusFilter;
  active: boolean;
  label: string;
  count: number;
  icon?: ReactNode;
  onSelect: (value: StatusFilter) => void;
}

function FilterChip({
  value,
  active,
  label,
  count,
  icon,
  onSelect,
}: FilterChipProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      // Roving tabindex: only the active chip is reachable by Tab; arrow
      // keys move focus among siblings inside the radiogroup.
      tabIndex={active ? 0 : -1}
      data-chip-value={chipDataValue(value)}
      onClick={() => onSelect(value)}
      className={cn(
        'rounded-full px-3 py-1 text-xs font-medium transition-colors',
        'border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-foreground/40',
        active
          ? 'border-fd-foreground/30 bg-fd-foreground/10 text-fd-foreground'
          : 'border-fd-border bg-transparent text-fd-muted-foreground hover:text-fd-foreground hover:border-fd-foreground/20',
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        {icon}
        {label}
        <span
          className={cn(
            'tabular-nums',
            active ? 'text-fd-muted-foreground' : 'opacity-60',
          )}
        >
          {count}
        </span>
      </span>
    </button>
  );
}

// ── Mission card ─────────────────────────────────────────────────────

function StatusBadge({
  status,
  variant,
}: {
  status: string;
  variant?: BadgeVariant;
}) {
  const token = getStatusToken(status);
  return (
    <Badge variant={variant ?? 'outline'} className={cn('gap-1', token.className)}>
      {token.icon}
      {status}
    </Badge>
  );
}

// `Ideas` / `Backlog` already imply "not yet a workable Issue" — the Draft
// badge would be redundant noise on those statuses. Only surface Draft when
// status has progressed past early scoping (e.g. Application open without
// an Issue created yet — a process bug worth flagging).
const DRAFT_REDUNDANT_STATUSES = new Set(['Ideas', 'Backlog']);

function MissionCard({ mission }: { mission: Mission }) {
  // Prefer the actual issue URL; fall back to the project-board pane
  // when GitHub didn't return a content URL (drafts have none).
  const href =
    mission.url ??
    `${MISSIONS_PROJECT_URL}?pane=issue&itemId=${mission.databaseId ?? mission.id}`;
  const isDraft = !mission.url && !DRAFT_REDUNDANT_STATUSES.has(mission.status);
  const previewBody = bodyToPreview(mission.body);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            aria-label={`View details for ${mission.title}`}
            className={cn(
              cardClasses('default'),
              'w-full text-left transition-colors hover:bg-fd-accent/40 hover:ring-fd-accent cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring',
            )}
          />
        }
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusBadge status={mission.status} />
            {isDraft && (
              <Badge
                variant="outline"
                className="gap-1 border-fd-border/60 text-fd-muted-foreground"
              >
                <FileText className="size-3" />
                Draft
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {mission.priority && (
              <Badge variant="outline">{mission.priority}</Badge>
            )}
            {typeof mission.reward === 'number' && (
              <Badge
                variant="outline"
                className="bg-ib-brand-alpha text-ib-brand border-ib-brand/30"
              >
                {formatReward(mission.reward)}
              </Badge>
            )}
          </div>
        </div>
        <h3 className="text-lg leading-tight font-semibold text-fd-foreground m-0">
          {mission.title}
        </h3>
        {mission.updatedAt && (
          <p
            className="text-xs text-fd-muted-foreground m-0"
            suppressHydrationWarning
          >
            Updated{' '}
            <time dateTime={mission.updatedAt}>
              {relativeTime(mission.updatedAt)}
            </time>
          </p>
        )}
        {previewBody && (
          <p className="text-sm text-fd-muted-foreground line-clamp-3 m-0">
            {previewBody}
          </p>
        )}
        {(mission.labels.length > 0 || mission.assignees.length > 0) && (
          <div className="flex flex-wrap gap-1 items-center">
            {mission.labels.slice(0, 3).map((label) => (
              <Badge key={label.name} variant="outline">
                {label.name}
              </Badge>
            ))}
            {mission.labels.length > 3 && (
              <Badge variant="outline">+{mission.labels.length - 3}</Badge>
            )}
            {mission.assignees.length > 0 && (
              <Badge variant="outline" className="gap-1">
                <Users className="size-3" />
                Assigned
                {mission.assignees.length > 1 && (
                  <span className="tabular-nums">
                    · {mission.assignees.length}
                  </span>
                )}
              </Badge>
            )}
          </div>
        )}
      </DialogTrigger>

      <DialogContent
        showCloseButton
        className="sm:max-w-screen-sm max-h-[85vh] p-0 overflow-hidden flex flex-col"
      >
        <DialogHeader className="shrink-0 gap-2 border-b p-5 pr-12">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex flex-wrap items-center gap-1.5">
              <StatusBadge status={mission.status} />
              {isDraft && (
                <Badge
                  variant="outline"
                  className="gap-1 border-fd-border/60 text-fd-muted-foreground"
                >
                  <FileText className="size-3" />
                  Draft
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {mission.priority && (
                <Badge variant="outline">{mission.priority}</Badge>
              )}
              {typeof mission.reward === 'number' && (
                <Badge
                  variant="outline"
                  className="bg-ib-brand-alpha text-ib-brand border-ib-brand/30"
                >
                  {formatReward(mission.reward)}
                </Badge>
              )}
            </div>
          </div>
          <DialogTitle className="text-xl leading-snug">
            {mission.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="flex flex-col gap-5 p-5">
        {mission.updatedAt && (
            <p
              className="text-xs text-fd-muted-foreground m-0"
              suppressHydrationWarning
            >
              Updated{' '}
              <time dateTime={mission.updatedAt}>
                {relativeTime(mission.updatedAt)}
              </time>
            </p>
          )}

        {mission.body && <MarkdownBody>{mission.body}</MarkdownBody>}

        {mission.labels.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] tracking-widest text-fd-muted-foreground uppercase m-0">
              Labels
            </p>
            <div className="flex flex-wrap gap-1">
              {mission.labels.map((label) => (
                <Badge key={label.name} variant="outline">
                  {label.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {mission.assignees.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] tracking-widest text-fd-muted-foreground uppercase m-0">
              Assigned to
            </p>
            <div className="flex flex-wrap gap-2">
              {mission.assignees.map((a) => (
                <a
                  key={a.login}
                  href={`https://github.com/${a.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-fd-foreground underline underline-offset-2 hover:text-ib-brand"
                >
                  @{a.login}
                </a>
              ))}
            </div>
          </div>
        )}
          </div>
        </div>
        <DialogFooter className="shrink-0 bg-muted/50 border-t p-5">
          <Button
            className="w-full"
            render={<a href={href} target="_blank" rel="noopener noreferrer" />}
          >
            <ExternalLink className="size-4 mr-2" />
            {mission.url ? 'View on GitHub' : 'View on Project Board'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
