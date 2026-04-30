import { Button } from '@waveso/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/card';
import Link from 'next/link';
import { Suspense } from 'react';
import { GRANTS_URL, MISSIONS_PROJECT_URL } from '@/lib/github/constants';
import {
  fetchMissionsData,
  type Mission,
} from '@/lib/github/fetch-missions-data';
import { PageHero } from '@/components/page-hero';
import { MissionsGrid } from './missions-grid';

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

interface MissionStats {
  open: number;
  inProgress: number;
  totalReward: number;
}

/**
 * "Open" = missions a builder can still claim (Ideas, Backlog, Application open).
 * "In progress" = active work (In progress, In review) — claimed, not done.
 * "Rewards available" sums rewards on Open missions only — once work is claimed
 *  the money is committed to a specific builder, not available to others.
 */
const OPEN_STATUSES = new Set(['Ideas', 'Backlog', 'Application open']);
const IN_PROGRESS_STATUSES = new Set(['In progress', 'In review']);

function computeStats(missions: Mission[]): MissionStats {
  let open = 0;
  let inProgress = 0;
  let totalReward = 0;
  for (const m of missions) {
    if (OPEN_STATUSES.has(m.status)) {
      open += 1;
      if (typeof m.reward === 'number') totalReward += m.reward;
    } else if (IN_PROGRESS_STATUSES.has(m.status)) {
      inProgress += 1;
    }
  }
  return { open, inProgress, totalReward };
}

export default async function MissionsPage() {
  const missions = await fetchMissionsData();
  const usingFallbackData = missions.some((m) => m.id.startsWith('fallback-'));
  const stats = computeStats(missions);

  return (
    <main>
      <PageHero
        tone="missions"
        title="Missions"
        description="Open contributions that serve the whole builder community — from ideas to rewards."
      />

      {usingFallbackData && (
        <section className="max-w-5xl mx-auto px-6 md:px-8 mb-4">
          <div className="rounded-lg border border-fd-border bg-fd-card/40 p-4 text-sm text-fd-muted-foreground">
            <strong className="text-fd-foreground">Demo Mode:</strong> Showing
            example missions. Set <code className="px-1 rounded bg-fd-muted">GITHUB_TOKEN</code> to
            display live data from GitHub.
          </div>
        </section>
      )}

      {missions.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 md:px-8">
          <dl className="grid grid-cols-3 gap-4 rounded-xl border border-ib-brand-dark ring-ib-brand-dark bg-fd-card p-5">
            <Stat label="Open" value={stats.open.toString()} />
            <Stat label="In progress" value={stats.inProgress.toString()} />
            <Stat
              label="Rewards available"
              value={
                stats.totalReward > 0 ? USD.format(stats.totalReward) : '—'
              }
              accent
            />
          </dl>
        </section>
      )}

      <section className="max-w-5xl mx-auto pt-6 pb-4 px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card variant="compact" className="text-center border-ib-brand-dark ring-ib-brand-dark">
            <CardHeader>
              <h3 className="text-lg leading-tight font-semibold text-fd-foreground m-0">How missions work?</h3>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-fd-muted-foreground m-0">
                Learn more about the process, rewards, and how to get started.
              </p>
            </CardContent>
            <CardFooter className="justify-center pb-0 bg-transparent bg-linear-to-b from-transparent to-ib-brand-dark">
              <Button
                size="sm"
                className="bg-ib-brand text-ib-brand-dark hover:opacity-60 hover:bg-ib-brand"
                render={<Link href="/docs/missions" />}
              >
                Read docs
              </Button>
            </CardFooter>
          </Card>

          <Card variant="compact" className="text-center border-ib-brand-dark ring-ib-brand-dark">
            <CardHeader>
              <h3 className="text-lg leading-tight font-semibold text-fd-foreground m-0">Bigger scope?</h3>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-fd-muted-foreground m-0">
                Apply for grants for larger, longer-term projects.
              </p>
            </CardContent>
            <CardFooter className="justify-center pb-0 bg-transparent bg-linear-to-b from-transparent to-ib-brand-dark">
              <Button
                size="sm"
                className="bg-ib-brand text-ib-brand-dark hover:opacity-60 hover:bg-ib-brand"
                render={<a href={GRANTS_URL} target="_blank" rel="noopener noreferrer" />}
              >
                View grants
              </Button>
            </CardFooter>
          </Card>

          <Card variant="compact" className="text-center border-ib-brand-dark ring-ib-brand-dark">
            <CardHeader>
              <h3 className="text-lg leading-tight font-semibold text-fd-foreground m-0">Have an idea?</h3>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-fd-muted-foreground m-0">
                Submit your own mission to grow the ecosystem.
              </p>
            </CardContent>
            <CardFooter className="justify-center pb-0 bg-transparent bg-linear-to-b from-transparent to-ib-brand-dark">
              <Button
                size="sm"
                className="bg-ib-brand text-ib-brand-dark hover:opacity-60 hover:bg-ib-brand"
                render={<a href={MISSIONS_PROJECT_URL} target="_blank" rel="noopener noreferrer" />}
              >
                Propose mission
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className="max-w-5xl mx-auto pt-32 pb-16 px-6 md:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl leading-tight font-semibold m-0">Available Missions</h2>
          <p className="text-lg text-fd-muted-foreground mt-1 m-0">
            Live from{' '}
            <a
              href={MISSIONS_PROJECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline-offset-2 hover:underline"
            >
              the project board
            </a>
            . Filter by status, sort by priority or recency.
          </p>
        </div>

        {missions.length > 0 ? (
          <Suspense fallback={null}>
            <MissionsGrid missions={missions} />
          </Suspense>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">No Missions Available</h2>
            <p className="text-fd-muted-foreground mb-6">
              Check back soon for new missions or explore other opportunities.
            </p>
            <Button
              variant="outline"
              render={<a href={GRANTS_URL} target="_blank" rel="noopener noreferrer" />}
            >
              Explore Grants Instead
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 text-center">
      <dt className="text-[10px] tracking-widest text-fd-muted-foreground uppercase">
        {label}
      </dt>
      <dd
        className={
          accent
            ? 'text-2xl font-semibold tabular-nums text-ib-brand m-0'
            : 'text-2xl font-semibold tabular-nums text-fd-foreground m-0'
        }
      >
        {value}
      </dd>
    </div>
  );
}
