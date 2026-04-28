import { Button } from '@waveso/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { fetchGitHubData } from '@/lib/github/fetch-github-data';
import { GITHUB_ORG, GOVERNANCE_URL, GRANTS_URL } from '@/lib/github/constants';
import { fetchCurrentWeek } from '@/lib/calendar/fetch-calendar';
import { NetworkStats } from '@/components/github/network-stats';
import { ErrorBoundary } from '@/components/error-boundary';
import { Galaxy } from '@/components/github/galaxy/galaxy';
import { DarkVeil } from '@/components/backgrounds/dark-veil';
import { AnimateIn, AnimateOnView } from '@/components/animate';
import { WeekGrid } from '@/components/events/week-grid';
import { Footer } from '@/components/footer';
import { Logomark } from '@/components/logomark';
import { PageHero } from '@/components/page-hero';
import { Code, Coins, Network, Wallet, Signal, Award, Rocket, GitBranch } from 'lucide-react';
import Link from 'next/link';

const STEPS = [
  'Contributors',
  'Membership',
  'Reputation',
  'Governance',
  'Proposals',
  'Grants',
  'Treasury',
] as const;

export default async function HomePage() {
  const [data, week] = await Promise.all([
    fetchGitHubData(GITHUB_ORG),
    fetchCurrentWeek().catch(() => null),
  ]);

  return (
    <>
      <PageHero
        tone="default"
        before={<Logomark size={80} />}
        title="Intuition Box"
        description="We fund work, govern decisions, and shape the Intuition ecosystem with a coordination protocol for everyone."
      />

      <AnimateOnView>
        <section className="max-w-5xl mx-auto w-full py-16 px-8">
          <Card
            variant="interactive"
            className="w-full text-center rounded-3xl bg-linear-to-b from-fd-card from-50% to-ib-brand-dark border-ib-brand-dark ring-ib-brand-dark"
          >
            <CardContent className="py-12 px-16 flex flex-col gap-4">
              <h2 className="text-3xl font-semibold m-0">Start Building</h2>
              <p className="text-fd-muted-foreground m-0">
                Join the developer community and use Intuition to transform your ideas into products.
              </p>
              <div className="flex justify-center gap-4 pt-4 max-sm:flex-col max-sm:gap-3">
                <Button
                  className="bg-ib-white text-ib-brand-dark hover:opacity-60 hover:bg-ib-white"
                  variant="default"
                  size="lg"
                  render={<Link href="/missions" />}
                >
                  Work on a Mission
                </Button>
                <Button
                  className="bg-ib-brand text-ib-brand-dark hover:opacity-60 hover:bg-ib-brand"
                  variant="default"
                  size="lg"
                  render={<a href="https://atlas.discourse.group/c/ecosystem-development/grant-applications/36" target="_blank" rel="noopener noreferrer" />}
                >
                  Apply for a Grant
                </Button>
                <Button
                  className="bg-ib-brand text-ib-brand-dark hover:opacity-60 hover:bg-ib-brand"
                  variant="default"
                  size="lg"
                  render={<a href="https://atlas.discourse.group/c/governance/intuition-box/35" target="_blank" rel="noopener noreferrer" />}
                >
                  Submit a Proposal
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </AnimateOnView>

      <section className="max-w-5xl mx-auto py-16 px-8">
        <AnimateOnView>
          <h2 className="text-3xl font-semibold text-center mb-12">
            How it works
          </h2>
        </AnimateOnView>
        <div className="grid md:grid-cols-7 gap-4">
          {STEPS.map((step, i) => (
            <AnimateOnView key={step} delay={i * 0.08} distance={30}>
              <Card className="h-full text-center">
                <CardContent className="py-2">
                  <p className="text-sm text-fd-muted-foreground m-0">Step {i + 1}</p>
                  <h3 className="font-medium mt-2 m-0">{step}</h3>
                </CardContent>
              </Card>
            </AnimateOnView>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto py-16 px-8">
        <AnimateOnView>
          <h2 className="text-3xl font-semibold text-center mb-12">
            Our Principles
          </h2>
        </AnimateOnView>
        <div className="grid md:grid-cols-2 gap-6">
          <AnimateOnView>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl font-bold">For Builders</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-6 m-0 list-none p-0">
                  <li className="flex gap-3">
                    <Code className="size-5 text-fd-primary/40 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Open-source first</p>
                      <p className="text-sm text-fd-muted-foreground mt-1">Build in the open, ship what matters</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Coins className="size-5 text-fd-primary/40 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Flexible grants</p>
                      <p className="text-sm text-fd-muted-foreground mt-1">KPI-based or one-time, fast decisions</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Network className="size-5 text-fd-primary/40 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">DAO-native coordination</p>
                      <p className="text-sm text-fd-muted-foreground mt-1">Proposals, voting, and execution on-chain</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Wallet className="size-5 text-fd-primary/40 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Crypto-native payments</p>
                      <p className="text-sm text-fd-muted-foreground mt-1">Get paid directly, no middlemen</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </AnimateOnView>

          <AnimateOnView delay={0.15}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl font-bold">For the Ecosystem</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-6 m-0 list-none p-0">
                  <li className="flex gap-3">
                    <Signal className="size-5 text-fd-primary/40 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Signal over noise</p>
                      <p className="text-sm text-fd-muted-foreground mt-1">Substance wins, hype doesn't</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Award className="size-5 text-fd-primary/40 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Merit over capital</p>
                      <p className="text-sm text-fd-muted-foreground mt-1">Contributions matter more than connections</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Rocket className="size-5 text-fd-primary/40 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Shipping over promises</p>
                      <p className="text-sm text-fd-muted-foreground mt-1">Working code beats pitch decks</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <GitBranch className="size-5 text-fd-primary/40 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Progressive decentralization</p>
                      <p className="text-sm text-fd-muted-foreground mt-1">Earn trust, then distribute power</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </AnimateOnView>
        </div>
      </section>

      <section className="max-w-5xl mx-auto py-16 px-8">
        <AnimateOnView>
          <h2 className="text-2xl font-bold text-center mb-10 sm:text-3xl">
            Our Network
          </h2>
        </AnimateOnView>
        <NetworkStats counters={data.counters} />
      </section>

      <section className="relative">
        <div className="relative">
          <ErrorBoundary>
            <Galaxy activity={data.activity} fetchedAt={data.counters.fetchedAt} />
          </ErrorBoundary>
        </div>
      </section>

      {week && (
        <AnimateOnView>
          <section className="max-w-5xl mx-auto w-full py-16 px-8">
            <WeekGrid week={week} />
          </section>
        </AnimateOnView>
      )}


      <Footer />
    </>
  );
}
