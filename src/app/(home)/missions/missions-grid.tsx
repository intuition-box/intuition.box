'use client';

import { useMemo, useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@waveso/ui/select';
import { cardClasses, getCardColumnWidth } from '@/components/card';
import {
  ExternalLink,
  Clock,
  CheckCircle,
  Zap,
  CircleDashed,
  PlayCircle,
  Eye,
  CreditCard,
} from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import type { Mission } from '@/lib/github/fetch-missions-data';
import { MISSIONS_PROJECT_URL } from '@/lib/github/constants';
import { cn } from '@/lib/cn';

type BadgeVariant = ComponentProps<typeof Badge>['variant'];

interface StatusToken {
  variant: BadgeVariant;
  icon: ReactNode;
  /** Lower = appears earlier in default ("status") sort. */
  weight: number;
}

const STATUS_TOKENS: Record<string, StatusToken> = {
  'Application open': { variant: 'success', icon: <Clock className="size-3" />, weight: 0 },
  'In progress': { variant: 'warning', icon: <PlayCircle className="size-3" />, weight: 1 },
  'In review': { variant: 'default', icon: <Eye className="size-3" />, weight: 2 },
  'Pending Payment': { variant: 'warning', icon: <CreditCard className="size-3" />, weight: 3 },
  Backlog: { variant: 'outline', icon: <CircleDashed className="size-3" />, weight: 4 },
  Ideas: { variant: 'secondary', icon: <Zap className="size-3" />, weight: 5 },
  Paid: { variant: 'success', icon: <CheckCircle className="size-3" />, weight: 6 },
};

const FALLBACK_TOKEN: StatusToken = {
  variant: 'secondary',
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
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortKey>('priority');

  // Statuses present in the data, ordered by canonical weight.
  const statuses = useMemo(() => {
    const seen = new Set<string>();
    for (const m of missions) seen.add(m.status);
    return Array.from(seen).sort(
      (a, b) => getStatusToken(a).weight - getStatusToken(b).weight,
    );
  }, [missions]);

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
        // Tiebreaker: status weight, then recency.
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
      // sortBy === 'updated'
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
        visibleCount={visibleMissions.length}
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
  visibleCount: number;
  totalCount: number;
}

function Toolbar({
  statuses,
  missions,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  visibleCount,
  totalCount,
}: ToolbarProps) {
  // Per-status counts so the chips can show "Application open · 4".
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const m of missions) {
      map[m.status] = (map[m.status] ?? 0) + 1;
    }
    return map;
  }, [missions]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-1.5">
        <FilterChip
          active={selectedStatus === 'all'}
          onClick={() => onStatusChange('all')}
          label="All"
          count={totalCount}
        />
        {statuses.map((status) => (
          <FilterChip
            key={status}
            active={selectedStatus === status}
            onClick={() => onStatusChange(status)}
            label={status}
            count={counts[status] ?? 0}
            icon={getStatusToken(status).icon}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 text-sm text-fd-muted-foreground">
        <span className="tabular-nums">
          {visibleCount === totalCount
            ? `${totalCount} mission${totalCount === 1 ? '' : 's'}`
            : `${visibleCount} of ${totalCount}`}
        </span>
        <Select<SortKey>
          value={sortBy}
          onValueChange={(v) => onSortChange(v as SortKey)}
        >
          <SelectTrigger size="sm" className="min-w-[180px]">
            <span className="text-fd-muted-foreground">Sort:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

interface FilterChipProps {
  active: boolean;
  label: string;
  count: number;
  icon?: ReactNode;
  onClick: () => void;
}

function FilterChip({ active, label, count, icon, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full px-3 py-1 text-xs font-medium transition-colors',
        'border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring',
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

function MissionCard({ mission }: { mission: Mission }) {
  const status = getStatusToken(mission.status);
  // Prefer the actual issue URL; fall back to the project-board pane
  // when GitHub didn't return a content URL (drafts have none).
  const href =
    mission.url ??
    `${MISSIONS_PROJECT_URL}?pane=issue&itemId=${mission.databaseId ?? mission.id}`;

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
          <Badge variant={status.variant} className="gap-1">
            {status.icon}
            {mission.status}
          </Badge>
          <div className="flex items-center gap-1.5">
            {mission.priority && (
              <Badge variant="outline">{mission.priority}</Badge>
            )}
            {typeof mission.reward === 'number' && (
              <Badge variant="default">{formatReward(mission.reward)}</Badge>
            )}
          </div>
        </div>
        <h3 className="text-lg leading-tight font-semibold text-fd-foreground m-0 mt-1">
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
        {mission.body && (
          <p className="text-sm text-fd-muted-foreground line-clamp-3 m-0">
            {mission.body}
          </p>
        )}
        {mission.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {mission.labels.slice(0, 3).map((label) => (
              <Badge key={label.name} variant="outline">
                {label.name}
              </Badge>
            ))}
            {mission.labels.length > 3 && (
              <Badge variant="outline">+{mission.labels.length - 3}</Badge>
            )}
          </div>
        )}
      </DialogTrigger>

      <DialogContent showCloseButton className="sm:max-w-screen-sm p-6">
        <DialogHeader className="gap-2">
          <div className="flex items-center justify-between gap-2 flex-wrap pr-8">
            <Badge variant={status.variant} className="gap-1">
              {status.icon}
              {mission.status}
            </Badge>
            <div className="flex items-center gap-1.5">
              {mission.priority && (
                <Badge variant="outline">{mission.priority}</Badge>
              )}
              {typeof mission.reward === 'number' && (
                <Badge variant="default">{formatReward(mission.reward)}</Badge>
              )}
            </div>
          </div>
          <DialogTitle className="pr-8 text-xl leading-snug">
            {mission.title}
          </DialogTitle>
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
        </DialogHeader>

        <div className="flex flex-col gap-5 mt-2">
          {mission.body && (
            <p className="text-sm text-fd-muted-foreground whitespace-pre-wrap m-0">
              {mission.body}
            </p>
          )}

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
                    className="text-sm text-fd-foreground underline underline-offset-2 hover:text-fd-primary"
                  >
                    @{a.login}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
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
