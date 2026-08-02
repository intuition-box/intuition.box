import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@waveso/ui/button';
import { BookOpen, Code2, Network, ShieldCheck } from 'lucide-react';
import { AnimateOnView } from '@/components/animate';
import { Logomark } from '@/components/logomark';
import { PageHero } from '@/components/page-hero';
import { Card, CardContent } from '@/components/card';
import {
  intuitionTestnetLearnNetwork,
  quickstartSteps,
  syllabusModules,
} from '@/lib/learn';
import { docsRoute } from '@/lib/shared';
import { LearnExperience } from './learn-experience';

export const metadata: Metadata = {
  title: 'Learn',
  description:
    'A guided Intuition Box syllabus and Testnet quickstart for new builders learning atoms, triples, and protocol-backed claims.',
};

const VALUE_PROPS = [
  {
    title: 'Start from zero',
    description:
      'The syllabus begins with the Intuition mental model before it asks builders to touch code.',
    icon: BookOpen,
  },
  {
    title: 'Build the first claim',
    description:
      'The interactive track keeps the aha moment concrete: create an atom, then connect it with a triple.',
    icon: Network,
  },
  {
    title: 'Stay safe on Testnet',
    description:
      'Every protocol example defaults to Intuition Testnet and tTRUST. No real wallet write is required for the pitch demo.',
    icon: ShieldCheck,
  },
] as const;

export default function LearnPage() {
  return (
    <>
      <PageHero
        tone="mint"
        before={<Logomark size={72} />}
        title="Learn Intuition"
        description="A calm path from protocol basics to a first builder app: atoms, triples, signal, and a Testnet quickstart."
      />

      <section className="max-w-5xl mx-auto w-full px-8 pb-8">
        <AnimateOnView>
          <div className="grid gap-4 border-y border-fd-border py-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="m-0 text-sm font-medium uppercase tracking-[0.22em] text-ib-brand">
                Builder onboarding
              </p>
              <p className="mt-2 max-w-2xl text-fd-muted-foreground">
                Designed as a pitchable Learn section for Intuition Box: easy to scan, simple to update, and grounded in the existing brand.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                className="bg-ib-brand text-ib-brand-dark hover:bg-ib-brand hover:opacity-70"
                render={<a href="#quickstart" />}
              >
                Run the demo
              </Button>
              <Button
                className="bg-ib-white text-ib-brand-dark hover:bg-ib-white hover:opacity-70"
                render={<a href="#syllabus" />}
              >
                View syllabus
              </Button>
            </div>
          </div>
        </AnimateOnView>
      </section>

      <section className="max-w-5xl mx-auto w-full px-8 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {VALUE_PROPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <AnimateOnView key={item.title} delay={index * 0.08}>
                <div className="h-full border-t border-fd-border pt-5">
                  <Icon className="mb-6 size-5 text-ib-brand" />
                  <h2 className="m-0 text-xl font-semibold">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-fd-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </AnimateOnView>
            );
          })}
        </div>
      </section>

      <LearnExperience
        modules={syllabusModules}
        steps={quickstartSteps}
        network={intuitionTestnetLearnNetwork}
      />

      <AnimateOnView>
        <section className="max-w-5xl mx-auto w-full px-8 py-16">
          <Card
            variant="interactive"
            className="relative w-full overflow-hidden rounded-3xl border-ib-brand-dark bg-linear-to-b from-fd-card from-50% to-ib-brand-dark text-center ring-ib-brand-dark"
          >
            <CardContent className="relative z-10 flex flex-col items-center gap-5 px-6 py-12 sm:px-16">
              <Code2 className="size-6 text-ib-brand" />
              <h2 className="m-0 text-3xl font-semibold">Ready for the next pass</h2>
              <p className="m-0 max-w-2xl text-fd-muted-foreground">
                This branch proves the learning surface. The mission proposal can later point to this demo, define scope, and invite builders to extend the starter into a real Testnet app.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <Button
                  className="bg-ib-brand text-ib-brand-dark hover:bg-ib-brand hover:opacity-70"
                  render={<Link href={docsRoute} />}
                >
                  Open Docs
                </Button>
                <Button
                  className="bg-ib-white text-ib-brand-dark hover:bg-ib-white hover:opacity-70"
                  render={<Link href="/missions" />}
                >
                  See Missions
                </Button>
              </div>
            </CardContent>
            <div
              aria-hidden
              className="absolute inset-0 bg-assets-art bg-cover bg-center bg-no-repeat opacity-10"
            />
          </Card>
        </section>
      </AnimateOnView>
    </>
  );
}
