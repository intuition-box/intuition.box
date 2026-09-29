import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FlaskConical,
  Layers3,
  Network,
  ShieldCheck,
} from 'lucide-react';
import { BuildCompletion } from '@/components/learn/build-progress';
import { LearningObjectives } from '@/components/learn/lesson-components';
import { getMDXComponents } from '@/components/mdx';
import { getBuildGuide } from '@/lib/build-catalog';
import {
  buildGuideSource,
  getBuildGuidePage,
  getBuildGuides,
} from '@/lib/build-source';

export function generateStaticParams() {
  return buildGuideSource.getPages().map((guide) => ({ guide: guide.slugs[0] }));
}

export async function generateMetadata(
  props: PageProps<'/learn/build/[guide]'>,
): Promise<Metadata> {
  const params = await props.params;
  const guide = getBuildGuidePage(params.guide);
  if (!guide) return {};
  return { title: guide.data.title, description: guide.data.description };
}

export default async function BuildGuidePage(
  props: PageProps<'/learn/build/[guide]'>,
) {
  const params = await props.params;
  const guide = getBuildGuidePage(params.guide);
  const catalogGuide = getBuildGuide(params.guide);
  if (!guide || !catalogGuide || catalogGuide.status !== 'available') notFound();

  const guides = getBuildGuides();
  const index = guides.findIndex((item) => item.slugs[0] === params.guide);
  const next = index >= 0 ? guides[index + 1] : undefined;
  const MDX = guide.data.body;

  return (
    <main className="min-h-screen border-t border-fd-border">
      <header className="relative isolate overflow-hidden border-b border-fd-border">
        <div aria-hidden className="absolute inset-0 -z-10 bg-hero-glow-teal opacity-60" />
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-14">
          <Link href="/learn/build" className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground no-underline hover:text-fd-foreground">
            <ArrowLeft className="size-4" /> All builds
          </Link>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-ib-teal-alpha bg-ib-teal-alpha px-2.5 py-1 font-medium text-ib-teal">{guide.data.kind}</span>
                <span className="rounded-full border border-fd-border bg-fd-card/70 px-2.5 py-1 text-fd-muted-foreground">{guide.data.level}</span>
                <span className="rounded-full border border-fd-border bg-fd-card/70 px-2.5 py-1 text-fd-muted-foreground">Read-only</span>
              </div>
              <h1 className="mt-5 mb-0 max-w-3xl text-4xl leading-tight font-semibold tracking-tight sm:text-6xl">{guide.data.title}</h1>
              <p className="mt-5 mb-0 max-w-2xl text-lg leading-8 text-fd-muted-foreground">{guide.data.description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-fd-muted-foreground">
                <span className="flex items-center gap-1.5"><Clock3 className="size-4" /> {guide.data.duration} min</span>
                <span className="flex items-center gap-1.5"><Network className="size-4" /> {guide.data.network}</span>
                <span className="flex items-center gap-1.5"><FlaskConical className="size-4" /> Tested {formatDate(guide.data.lastTested)}</span>
              </div>
            </div>
            <div className="rounded-xl border border-ib-teal-alpha bg-fd-card/85 p-5 backdrop-blur">
              <p className="m-0 text-[10px] font-semibold tracking-widest text-ib-teal uppercase">You will ship</p>
              <p className="mt-3 mb-0 text-sm leading-6">{guide.data.outcome}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-12 md:px-8 lg:grid-cols-[minmax(0,760px)_280px] lg:items-start">
        <article className="min-w-0">
          <LearningObjectives items={[
            'Configure Intuition GraphQL reads for the intended network',
            'Search live atoms without requiring a wallet or private key',
            'Render missing metadata and API failures as deliberate interface states',
            'Explain which displayed fields are protocol data and which are presentation choices',
          ]} />

          <div className="prose prose-invert max-w-none course-prose build-prose">
            <MDX components={getMDXComponents()} />

            <section className="not-prose mt-12 border-t border-fd-border pt-8">
              <h2 className="m-0 text-sm font-semibold">Official references</h2>
              <ul className="mt-4 mb-0 grid list-none gap-2 p-0">
                {guide.data.references.map((reference) => (
                  <li key={reference.url}>
                    <a href={reference.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-ib-teal no-underline hover:opacity-70">
                      {reference.title} <ExternalLink className="size-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <BuildCompletion guide={params.guide} outcome={guide.data.outcome} />
          </div>

          <nav aria-label="Build pagination" className="mt-8">
            {next ? (
              <Link href={next.url} className="block rounded-xl border border-fd-border bg-fd-card p-4 text-right no-underline hover:bg-fd-accent">
                <span className="block text-[10px] font-medium tracking-widest text-fd-muted-foreground uppercase">Next build</span>
                <span className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-fd-foreground">{next.data.title} <ArrowRight className="size-4" /></span>
              </Link>
            ) : (
              <Link href="/learn/paths" className="block rounded-xl border border-ib-brand-alpha bg-ib-brand-dark/30 p-4 text-right no-underline hover:bg-ib-brand-dark/50">
                <span className="block text-[10px] font-medium tracking-widest text-fd-muted-foreground uppercase">Continue learning</span>
                <span className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-ib-brand">Choose a guided path <ArrowRight className="size-4" /></span>
              </Link>
            )}
          </nav>
        </article>

        <aside className="lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card">
            <div className="border-b border-fd-border p-5">
              <div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="size-4 text-ib-teal" /> Build brief</div>
              <dl className="mt-4 mb-0 grid gap-3 text-xs">
                <BriefRow label="Time" value={`${guide.data.duration} minutes`} />
                <BriefRow label="Network" value={guide.data.network} />
                <BriefRow label="Access" value="No wallet required" />
                <BriefRow label="Review" value={formatDate(guide.data.lastTested)} />
              </dl>
            </div>
            <div className="border-b border-fd-border p-5">
              <p className="m-0 text-[10px] font-semibold tracking-widest text-fd-muted-foreground uppercase">Prerequisites</p>
              <ul className="mt-3 mb-0 grid list-none gap-2 p-0 text-xs text-fd-muted-foreground">
                {guide.data.prerequisites.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-ib-teal" /> {item}</li>)}
              </ul>
            </div>
            <div className="p-5">
              <p className="m-0 text-[10px] font-semibold tracking-widest text-fd-muted-foreground uppercase">Tested versions</p>
              <dl className="mt-3 mb-0 grid gap-2">
                {guide.data.testedVersions.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-3 font-mono text-[10px]">
                    <dt className="text-fd-muted-foreground">{item.name}</dt>
                    <dd className="m-0 text-fd-foreground">{item.version}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-fd-border bg-black/10 p-4 text-xs leading-5 text-fd-muted-foreground">
            <Layers3 className="mb-2 size-4 text-ib-purple" />
            This build reads public indexed data. It does not submit transactions or prove that an atom’s metadata is true.
          </div>
        </aside>
      </div>
    </main>
  );
}

function BriefRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-4"><dt className="text-fd-muted-foreground">{label}</dt><dd className="m-0 text-right">{value}</dd></div>;
}

function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(value));
}
