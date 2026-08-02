import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Code2, ExternalLink } from 'lucide-react';
import { ChapterRail } from '@/components/learn/chapter-rail';
import { GraphDiagram } from '@/components/learn/graph-diagram';
import { LearnProgressSummary } from '@/components/learn/learn-progress';
import { QuickstartPreview } from '@/components/learn/quickstart-preview';
import { TestnetNotice } from '@/components/learn/testnet-notice';
import { Logomark } from '@/components/logomark';
import { PageHero } from '@/components/page-hero';
import { getLearnLessons } from '@/lib/learn-source';
import { docsRoute } from '@/lib/shared';

export const metadata: Metadata = {
  title: 'Learn',
  description:
    'A guided Intuition curriculum and Testnet builder Quickstart covering atoms, triples, signal, graph discovery, and a small app.',
};

export default function LearnPage() {
  const lessons = getLearnLessons();

  return (
    <main>
      <PageHero
        tone="mint"
        before={<Logomark size={72} />}
        title="Learn Intuition"
        description="Build a clear mental model of the protocol, then turn one graph-shaped idea into a small Testnet product."
      />

      <section className="mx-auto w-full max-w-5xl px-5 pb-16 sm:px-8">
        <div className="grid gap-6 border-y border-fd-border py-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="m-0 text-xs font-medium uppercase tracking-[0.2em] text-ib-brand">
              Two connected tracks
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-fd-muted-foreground sm:text-base">
              Learn the protocol from first principles, or open the builder
              Quickstart when you are ready to model and render an app idea.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#syllabus"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ib-brand px-5 text-sm font-medium text-ib-brand-dark no-underline transition-opacity duration-150 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand"
            >
              <BookOpen className="size-4" />
              Start learning
            </Link>
            <Link
              href="/learn/quickstart"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-fd-border px-5 text-sm font-medium text-fd-foreground no-underline transition-colors duration-150 hover:border-ib-brand/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand"
            >
              Open Quickstart
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 pb-20 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <p className="m-0 text-xs font-medium uppercase tracking-[0.2em] text-ib-brand">
              The protocol model
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-fd-foreground sm:text-4xl">
              Concepts become claims. Claims become context.
            </h2>
            <p className="mt-5 text-base leading-7 text-fd-muted-foreground">
              Atoms give people, projects, and ideas persistent identities.
              Triples connect them through explicit relationships. Vaults let
              participants add economic signal that products can interpret.
            </p>
            <p className="mt-4 text-sm leading-6 text-fd-muted-foreground">
              The curriculum builds those ideas one layer at a time, with no
              prior protocol knowledge required.
            </p>
          </div>
          <GraphDiagram
            kind="overview"
            title="A reusable knowledge layer"
            description="Persistent concepts connect as claims, while support and opposition add signal an application can explain."
          />
        </div>

        <LearnProgressSummary total={lessons.length} />
      </section>

      <section
        id="syllabus"
        className="mx-auto w-full max-w-5xl scroll-mt-24 px-5 pb-24 sm:px-8"
      >
        <div className="mb-10 grid gap-5 md:grid-cols-[1fr_0.7fr] md:items-end">
          <div>
            <p className="m-0 text-xs font-medium uppercase tracking-[0.2em] text-ib-brand">
              Learn the protocol
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-fd-foreground sm:text-4xl">
              Seven chapters, from first principles to product.
            </h2>
          </div>
          <p className="m-0 text-sm leading-6 text-fd-muted-foreground md:text-right">
            Complete lessons explicitly and return at any time. Progress stays
            in this browser—no account, analytics, or wallet required.
          </p>
        </div>
        <ChapterRail lessons={lessons} />
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 pb-24 sm:px-8">
        <div className="mb-9 max-w-3xl">
          <p className="m-0 text-xs font-medium uppercase tracking-[0.2em] text-ib-brand">
            Build with Intuition
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-fd-foreground sm:text-4xl">
            Choose an idea. Model the graph. See the product.
          </h2>
          <p className="mt-4 text-base leading-7 text-fd-muted-foreground">
            The Quickstart combines a genuinely runnable, read-only agent
            workflow with static SDK and transaction simulations. Your selected
            idea carries into its atom, triple, checkpoint, and rendered-app examples.
          </p>
        </div>
        <QuickstartPreview />
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 pb-24 sm:px-8">
        <TestnetNotice />
        <div className="mt-12 grid gap-7 border-t border-fd-border pt-9 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <Code2 className="size-5 text-ib-brand" />
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-fd-foreground">
              Learn for the guided path. Docs for the complete reference.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-fd-muted-foreground">
              Continue into protocol APIs, SDK details, and deeper technical
              material when the curriculum has given you the mental model.
            </p>
          </div>
          <Link
            href={docsRoute}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-fd-border px-5 text-sm font-medium text-fd-foreground no-underline transition-colors duration-150 hover:border-ib-brand/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand"
          >
            Open Docs
            <ExternalLink className="size-3.5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
