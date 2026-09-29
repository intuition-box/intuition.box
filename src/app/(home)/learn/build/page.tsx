import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  Braces,
  CheckCircle2,
  Clock3,
  FlaskConical,
  LockKeyhole,
  ShieldCheck,
  TerminalSquare,
} from 'lucide-react';
import { AnimateOnView } from '@/components/animate';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/card';
import { BuildProgressBadge } from '@/components/learn/build-progress';
import { PageHero } from '@/components/page-hero';
import {
  buildGuideCatalog,
  type BuildGuideCatalogItem,
} from '@/lib/build-catalog';

const DESCRIPTION =
  'Version-aware tutorials and projects for turning Intuition concepts into working, inspectable software.';

export const metadata: Metadata = {
  title: 'Build',
  description: DESCRIPTION,
};

const ACCENTS = {
  mint: { border: 'border-ib-brand-alpha', text: 'text-ib-brand', soft: 'bg-ib-brand-alpha' },
  teal: { border: 'border-ib-teal-alpha', text: 'text-ib-teal', soft: 'bg-ib-teal-alpha' },
  purple: { border: 'border-ib-purple-alpha', text: 'text-ib-purple', soft: 'bg-ib-purple-alpha' },
  yellow: { border: 'border-ib-yellow-alpha', text: 'text-ib-yellow', soft: 'bg-ib-yellow-alpha' },
} as const;

export default function BuildPage() {
  const available = buildGuideCatalog.filter((guide) => guide.status === 'available').length;

  return (
    <main>
      <PageHero
        tone="teal"
        before={
          <span className="inline-flex items-center gap-2 rounded-full border border-ib-teal-alpha bg-ib-teal-alpha px-3 py-1 text-xs font-medium tracking-wide text-ib-teal uppercase">
            <Braces className="size-3.5" /> Intuition Learn
          </span>
        }
        title="Build with Intuition"
        description={DESCRIPTION}
      />

      <section className="max-w-5xl mx-auto px-6 md:px-8 pb-24">
        <AnimateOnView>
          <div className="mb-10 grid gap-px overflow-hidden rounded-xl border border-fd-border bg-fd-border sm:grid-cols-3">
            <Stat value={buildGuideCatalog.length.toString()} label="Builder curricula" />
            <Stat value={available.toString()} label="Battle-tested now" accent />
            <Stat value="Local" label="Progress, no account" />
          </div>
        </AnimateOnView>

        <AnimateOnView>
          <section className="mb-12 grid gap-5 rounded-2xl border border-ib-teal-alpha bg-linear-to-br from-ib-teal-alpha/50 to-fd-card p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div className="max-w-2xl">
              <p className="m-0 text-xs font-semibold tracking-[0.16em] text-ib-teal uppercase">Publishing standard</p>
              <h2 className="mt-3 mb-0 text-2xl font-semibold tracking-tight">Every build must survive contact with a clean project.</h2>
              <p className="mt-3 mb-0 text-sm leading-6 text-fd-muted-foreground">
                Published guides declare versions, network, prerequisites, expected output, checkpoints, failure states, and the date their code was last verified.
              </p>
            </div>
            <div className="grid gap-2 text-xs text-fd-muted-foreground sm:grid-cols-3 md:grid-cols-1">
              <Standard icon={<CheckCircle2 className="size-3.5" />} label="Reproducible result" />
              <Standard icon={<ShieldCheck className="size-3.5" />} label="Safe defaults" />
              <Standard icon={<FlaskConical className="size-3.5" />} label="Version recorded" />
            </div>
          </section>
        </AnimateOnView>

        <div className="grid gap-6 md:grid-cols-2">
          {buildGuideCatalog.map((guide, index) => (
            <AnimateOnView key={guide.slug} delay={(index % 2) * 0.06}>
              <GuideCard guide={guide} featured={index === 0} />
            </AnimateOnView>
          ))}
        </div>

        <AnimateOnView>
          <div className="mt-16 flex flex-col items-start justify-between gap-5 rounded-2xl border border-ib-purple-alpha bg-ib-purple-dark/30 p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="m-0 text-lg font-semibold">Need the mental model first?</h2>
              <p className="mt-1 mb-0 text-sm text-fd-muted-foreground">
                Courses explain why the primitives work. Build assumes that understanding and focuses on implementation.
              </p>
            </div>
            <Link href="/learn/courses" className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-ib-purple no-underline hover:opacity-70">
              Browse courses <ArrowRight className="size-4" />
            </Link>
          </div>
        </AnimateOnView>
      </section>
    </main>
  );
}

function GuideCard({ guide, featured }: { guide: BuildGuideCatalogItem; featured: boolean }) {
  const accent = ACCENTS[guide.accent];
  const available = guide.status === 'available';
  const icon = guide.kind === 'AI workflow'
    ? <Bot className="size-5" />
    : guide.kind === 'Quickstart'
      ? <TerminalSquare className="size-5" />
      : <Braces className="size-5" />;

  const card = (
    <Card className={`group h-full overflow-hidden transition-colors ${accent.border} ${available ? 'hover:bg-fd-accent/20' : 'opacity-80'} ${featured ? 'md:min-h-[430px]' : ''}`}>
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <span className={`flex size-11 items-center justify-center rounded-xl ${accent.soft} ${accent.text}`}>{icon}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border bg-fd-muted/40 px-2.5 py-1 text-[10px] text-fd-muted-foreground">
            {available ? <><span className="size-1.5 rounded-full bg-ib-teal" /> Tested build</> : <><LockKeyhole className="size-3" /> Planned</>}
          </span>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] text-fd-muted-foreground">
            <span className={accent.text}>{guide.kind}</span>
            <span aria-hidden>·</span>
            <span>{guide.level}</span>
            {guide.duration && <><span aria-hidden>·</span><span>{guide.duration}</span></>}
          </div>
          <h2 className="mt-3 mb-0 text-xl font-semibold tracking-tight">{guide.title}</h2>
          <p className="mt-2 mb-0 text-sm leading-6 text-fd-muted-foreground">{guide.description}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="rounded-lg border border-fd-border bg-fd-muted/25 p-3">
          <p className="m-0 text-[9px] font-semibold tracking-widest text-fd-muted-foreground uppercase">Finished result</p>
          <p className="mt-1 mb-0 text-xs leading-5">{guide.outcome}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {guide.stack.map((item) => <span key={item} className="rounded-md bg-fd-muted px-2 py-1 font-mono text-[10px] text-fd-muted-foreground">{item}</span>)}
        </div>
      </CardContent>
      <CardFooter className="justify-between bg-transparent">
        {available ? <BuildProgressBadge guide={guide.slug} /> : (
          <span className="inline-flex items-center gap-1.5 text-xs text-fd-muted-foreground"><Clock3 className="size-3.5" /> Curriculum queued</span>
        )}
        <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${available ? accent.text : 'text-fd-muted-foreground'}`}>
          {available ? 'Start building' : 'In development'}
          {available && <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />}
        </span>
      </CardFooter>
    </Card>
  );

  return available ? <Link href={`/learn/build/${guide.slug}`} className="block h-full no-underline">{card}</Link> : card;
}

function Standard({ icon, label }: { icon: ReactNode; label: string }) {
  return <span className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-black/10 px-3 py-2">{icon}{label}</span>;
}

function Stat({ value, label, accent = false }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="bg-fd-card p-5 text-center">
      <p className={`m-0 text-xl font-semibold ${accent ? 'text-ib-teal' : ''}`}>{value}</p>
      <p className="mt-1 mb-0 text-[10px] tracking-widest text-fd-muted-foreground uppercase">{label}</p>
    </div>
  );
}
