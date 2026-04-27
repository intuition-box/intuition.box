import { Button } from '@waveso/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardGrid,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { GRANTS_URL, MISSIONS_PROJECT_URL } from '@/lib/github/constants';
import { fetchMissionsData } from '@/lib/github/fetch-missions-data';
import { PageHero } from '@/components/page-hero';
import { MissionsGrid } from './missions-grid';
import { RefreshButton } from './refresh-button';

export default async function MissionsPage() {
  const missions = await fetchMissionsData();
  const usingFallbackData = missions.some((m) => m.id.startsWith('fallback-'));

  return (
    <main>
      <PageHero
        tone="mint"
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

      <section className="max-w-5xl mx-auto py-8 px-6 md:px-8">
        <CardGrid>
          <Card>
            <CardHeader>
              <CardTitle>How do missions work?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-fd-muted-foreground m-0">
                Learn about our mission process, rewards, and how to get started.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                render={<Link href="/docs/missions" />}
              >
                Read Documentation
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Looking for bigger scope?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-fd-muted-foreground m-0">
                Apply for grants with larger rewards and longer-term projects.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                render={<a href={GRANTS_URL} target="_blank" rel="noopener noreferrer" />}
              >
                View Grants
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Have an idea?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-fd-muted-foreground m-0">
                Submit your own mission ideas to help grow the ecosystem.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                render={<a href={MISSIONS_PROJECT_URL} target="_blank" rel="noopener noreferrer" />}
              >
                Propose Mission
              </Button>
            </CardFooter>
          </Card>
        </CardGrid>
      </section>

      <section className="max-w-5xl mx-auto py-8 px-6 md:px-8">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <h2 className="text-2xl font-semibold m-0">Available Missions</h2>
            <p className="text-sm text-fd-muted-foreground mt-1 m-0">
              {missions.length} mission{missions.length !== 1 ? 's' : ''} from{' '}
              <a
                href={MISSIONS_PROJECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-fd-foreground"
              >
                the project board
              </a>
              .
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RefreshButton />
            <Button
              variant="outline"
              size="sm"
              render={<a href={MISSIONS_PROJECT_URL} target="_blank" rel="noopener noreferrer" />}
            >
              <ExternalLink className="size-3.5 mr-2" />
              GitHub
            </Button>
          </div>
        </div>

        {missions.length > 0 ? (
          <MissionsGrid missions={missions} />
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
