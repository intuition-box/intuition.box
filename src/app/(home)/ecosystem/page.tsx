import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@waveso/ui/button';
import { ArrowUpRight, Boxes, Globe2, Sparkles } from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import { AnimateOnView } from '@/components/animate';
import { ECOSYSTEM_PROJECTS } from '@/lib/ecosystem';
import { discordUrl } from '@/lib/shared';
import { EcosystemGrid } from './ecosystem-grid';

const DESCRIPTION =
  'Discover the products, protocols, and experiments growing around Intuition.';

export const metadata: Metadata = {
  title: 'Ecosystem',
  description: DESCRIPTION,
};

export default function EcosystemPage() {
  return (
    <main>
      <PageHero
        tone="teal"
        title="Explore the Intuition ecosystem"
        description={DESCRIPTION}
      >
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-fd-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Boxes aria-hidden className="size-4 text-ib-teal" />
            {ECOSYSTEM_PROJECTS.length} projects
          </span>
          <span className="inline-flex items-center gap-2">
            <Globe2 aria-hidden className="size-4 text-ib-teal" />
            One open ecosystem
          </span>
          <span className="inline-flex items-center gap-2">
            <Sparkles aria-hidden className="size-4 text-ib-teal" />
            Curated by Intuition Box
          </span>
        </div>
      </PageHero>

      <AnimateOnView>
        <section className="mx-auto max-w-5xl px-6 pb-20 md:px-8">
          <div className="mb-9 max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-ib-teal">
              Ecosystem directory
            </p>
            <h2 className="m-0 text-2xl font-semibold sm:text-3xl">
              See what the community is building
            </h2>
            <p className="mt-3 text-fd-muted-foreground">
              Explore live apps, developer infrastructure, and community
              experiments powered by Intuition.
            </p>
          </div>

          <EcosystemGrid projects={ECOSYSTEM_PROJECTS} />
        </section>
      </AnimateOnView>

      <AnimateOnView>
        <section className="mx-auto max-w-5xl px-6 pb-24 md:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-ib-teal-alpha bg-linear-to-br from-fd-card via-fd-card to-[#0d2227] px-6 py-10 sm:px-10 sm:py-12">
            <div className="relative z-10 max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-ib-teal">
                Join the directory
              </p>
              <h2 className="m-0 text-2xl font-semibold sm:text-3xl">
                Building something with Intuition?
              </h2>
              <p className="mb-7 mt-3 text-fd-muted-foreground">
                Share what you&apos;re shipping with the community and help more
                people discover it.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  className="bg-ib-teal text-ib-black hover:bg-ib-teal hover:opacity-80"
                  render={
                    <a
                      href={discordUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  Submit a project
                  <ArrowUpRight aria-hidden className="size-4" />
                </Button>
                <Button variant="outline" render={<Link href="/missions" />}>
                  Explore missions
                </Button>
              </div>
            </div>
            <div
              aria-hidden
              className="absolute -bottom-28 -right-20 size-72 rounded-full bg-ib-teal/10 blur-3xl"
            />
          </div>
        </section>
      </AnimateOnView>
    </main>
  );
}
