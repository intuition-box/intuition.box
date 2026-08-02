import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen, ExternalLink } from 'lucide-react';
import { Logomark } from '@/components/logomark';
import { PageHero } from '@/components/page-hero';
import { QuickstartExperience } from '@/components/learn/quickstart-experience';
import { docsRoute } from '@/lib/shared';

export const metadata: Metadata = {
  title: 'Builder Quickstart',
  description:
    'Discover an Intuition-shaped app idea, model it with atoms and a triple, and render a simulated Testnet product in ten guided steps.',
};

export default function QuickstartPage() {
  return (
    <main>
      <PageHero
        tone="mint"
        before={<Logomark size={64} />}
        title="Build with Intuition"
        description="A ten-step builder path from read-only discovery to a simulated Testnet app—without connecting a wallet or broadcasting a transaction."
      />

      <section className="mx-auto w-full max-w-6xl px-5 pb-10 sm:px-8">
        <div className="grid gap-6 border-y border-fd-border py-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <Link
              href="/learn"
              className="inline-flex min-h-11 items-center gap-2 text-sm text-fd-muted-foreground no-underline hover:text-fd-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand"
            >
              <ArrowLeft className="size-4" />
              Back to the syllabus
            </Link>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-fd-muted-foreground">
              Basic React and TypeScript familiarity is useful. Protocol concepts
              are introduced in the Learn track and full API details remain in Docs.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/learn/what-is-intuition"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-fd-border px-4 text-sm text-fd-foreground no-underline transition-colors hover:border-ib-brand/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand"
            >
              <BookOpen className="size-4" />
              Start lesson one
            </Link>
            <Link
              href={docsRoute}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-fd-border px-4 text-sm text-fd-foreground no-underline transition-colors hover:border-ib-brand/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand"
            >
              Open Docs
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <QuickstartExperience />
    </main>
  );
}
