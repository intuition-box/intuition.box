import { Button } from '@waveso/ui/button';
import { Card, CardContent } from '@waveso/ui/card';
import { fetchGitHubData } from '@/lib/github/fetch-github-data';
import { GITHUB_ORG, GOVERNANCE_URL, GRANTS_URL } from '@/lib/github/constants';
import { NetworkStats } from '@/components/github/network-stats';
import { ErrorBoundary } from '@/components/error-boundary';
import { Galaxy } from '@/components/github/galaxy/galaxy';
import { DarkVeil } from '@/components/backgrounds/dark-veil';
import { AnimateIn, AnimateOnView } from '@/components/animate';
import { Footer } from '@/components/footer';
import { Logomark } from '@/components/logomark';
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
  const data = await fetchGitHubData(GITHUB_ORG);

  return (
    <>
      <AnimateIn distance={0} transition={{ duration: 1.2 }}>
        <div className="absolute inset-x-0 top-0 h-[800px] -z-1 pointer-events-none bg-hero-glow" />
      </AnimateIn>

      <section className="relative max-w-5xl mx-auto py-16 px-8 text-center">
        <AnimateIn>
          <Logomark size={80} className="mx-auto mb-8" />
        </AnimateIn>

        <AnimateIn delay={0.08}>
          <h1 className="text-6xl leading-none font-bold mb-6 tracking-tight bg-clip-text text-transparent antialiased [box-decoration-break:clone] sm:text-5xl bg-linear-[103deg] from-fd-primary from-15% to-fd-muted-foreground to-85%">
            Intuition Box
          </h1>
        </AnimateIn>
        <AnimateIn delay={0.16}>
          <p className="text-lg text-fd-muted-foreground max-w-2xl mx-auto mb-8">
            We fund work, govern decisions, and shape the Intuition ecosystem with a coordination protocol for everyone.
          </p>
        </AnimateIn>
      </section>

      <section className="max-w-5xl mx-auto py-16 px-8">
        <AnimateOnView>
          <h2 className="text-3xl font-semibold text-center mb-12">
            How it works
          </h2>
        </AnimateOnView>
        <div className="grid md:grid-cols-7 gap-4">
          {STEPS.map((step, i) => (
            <AnimateOnView key={step} delay={i * 0.08} distance={30}>
              <Card className="h-full hover:scale-105 transition-transform">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-fd-muted-foreground">Step {i + 1}</p>
                  <h3 className="font-medium mt-2">{step}</h3>
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
              <CardContent className="p-8 space-y-8">
                <h3 className="text-xl font-bold">For Builders</h3>
                <ul className="space-y-6">
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
            <Card className="h-full bg-fd-card">
              <CardContent className="p-8 space-y-8">
                <h3 className="text-xl font-bold">For the Ecosystem</h3>
                <ul className="space-y-6">
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
        <DarkVeil
          className="absolute inset-0 z-[5] mix-blend-screen opacity-20 pointer-events-none"
          style={{ mask: 'radial-gradient(ellipse at center, black 20%, transparent 65%)' }}
          speed={0.3}
          warpAmount={0.3}
          noiseIntensity={0.02}
        />
        <div className="relative">
          <ErrorBoundary>
            <Galaxy activity={data.activity} fetchedAt={data.counters.fetchedAt} />
          </ErrorBoundary>
        </div>
      </section>

      <AnimateOnView>
        <section className="max-w-5xl mx-auto w-full py-16 px-8">
          <Card className="w-full py-12 px-16 bg-linear-to-b from-fd-card from-50% to-ib-brand-dark ring-ib-brand-dark rounded-3xl text-center">
            <h2 className="text-3xl font-semibold">
              Start Building
            </h2>
            <p className="text-fd-muted-foreground">
              Join the developer community and use Intuition to transform your ideas into products.
            </p>
            <div className="flex justify-center gap-6 pt-4 max-sm:flex-col max-sm:gap-3">
              <Button
                className="bg-ib-white text-ib-brand-dark hover:opacity-60 hover:bg-ib-white"
                variant="default"
                size="lg"
                render={<Link href="/docs" />}
              >
                Find more
              </Button>
              <Button
                className="bg-ib-brand text-ib-brand-dark hover:opacity-60 hover:bg-ib-brand"
                variant="default"
                size="lg"
                render={<a href={GRANTS_URL} target="_blank" rel="noopener noreferrer" />}
              >
                Submit a Proposal
              </Button>
            </div>
          </Card>
        </section>
      </AnimateOnView>

      <Footer />
    </>
  );
}
