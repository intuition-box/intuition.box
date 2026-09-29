import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Braces,
  Clock3,
  Compass,
  LockKeyhole,
  Route,
} from 'lucide-react';
import { AnimateOnView } from '@/components/animate';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/card';
import { PageHero } from '@/components/page-hero';
import {
  learningPathCatalog,
  type LearningPathCatalogItem,
} from '@/lib/path-catalog';

const DESCRIPTION =
  'Goal-driven routes that sequence the right theory, field work, and builder activities without duplicating Courses or Build.';

export const metadata: Metadata = {
  title: 'Learning Paths',
  description: DESCRIPTION,
};

const ACCENTS = {
  mint: { border: 'border-ib-brand-alpha', text: 'text-ib-brand', soft: 'bg-ib-brand-alpha' },
  teal: { border: 'border-ib-teal-alpha', text: 'text-ib-teal', soft: 'bg-ib-teal-alpha' },
  purple: { border: 'border-ib-purple-alpha', text: 'text-ib-purple', soft: 'bg-ib-purple-alpha' },
  yellow: { border: 'border-ib-yellow-alpha', text: 'text-ib-yellow', soft: 'bg-ib-yellow-alpha' },
} as const;

export default function LearningPathsPage() {
  const available = learningPathCatalog.filter((path) => path.status === 'available').length;

  return (
    <main>
      <PageHero
        tone="mint"
        before={
          <span className="inline-flex items-center gap-2 rounded-full border border-ib-brand-alpha bg-ib-brand-alpha px-3 py-1 text-xs font-medium tracking-wide text-ib-brand uppercase">
            <Route className="size-3.5" /> Intuition Learn
          </span>
        }
        title="Learning paths"
        description={DESCRIPTION}
      />

      <section className="max-w-5xl mx-auto px-6 md:px-8 pb-24">
        <AnimateOnView>
          <div className="mb-12 grid gap-px overflow-hidden rounded-xl border border-fd-border bg-fd-border sm:grid-cols-3">
            <Stat value={learningPathCatalog.length.toString()} label="Goal-driven paths" />
            <Stat value={available.toString()} label="Complete today" accent />
            <Stat value="Local" label="No account needed" />
          </div>
        </AnimateOnView>

        <AnimateOnView>
          <div className="mb-10 grid gap-6 rounded-2xl border border-fd-border bg-fd-card p-6 sm:grid-cols-2 sm:p-8">
            <div>
              <BookOpen className="size-5 text-ib-purple" />
              <h2 className="mt-4 mb-0 text-xl font-semibold">Courses explain the system</h2>
              <p className="mt-2 mb-0 text-sm leading-6 text-fd-muted-foreground">
                Deep, theory-first curricula build durable understanding without hiding implementation inside the lesson library.
              </p>
            </div>
            <div>
              <Braces className="size-5 text-ib-teal" />
              <h2 className="mt-4 mb-0 text-xl font-semibold">Build turns it into practice</h2>
              <p className="mt-2 mb-0 text-sm leading-6 text-fd-muted-foreground">
                Verified activities produce working outcomes. Paths select and sequence both surfaces for one specific goal.
              </p>
            </div>
          </div>
        </AnimateOnView>

        <div className="grid gap-6 md:grid-cols-2">
          {learningPathCatalog.map((path, index) => (
            <AnimateOnView key={path.slug} delay={(index % 2) * 0.06}>
              <PathCard path={path} />
            </AnimateOnView>
          ))}
        </div>
      </section>
    </main>
  );
}

function PathCard({ path }: { path: LearningPathCatalogItem }) {
  const accent = ACCENTS[path.accent];
  const available = path.status === 'available';
  const card = (
    <Card className={`group h-full overflow-hidden ${accent.border} ${available ? 'hover:bg-fd-accent/20' : 'opacity-80'}`}>
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <span className={`flex size-10 items-center justify-center rounded-xl ${accent.soft} ${accent.text}`}>
            <Compass className="size-5" />
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border bg-fd-muted/40 px-2.5 py-1 text-[10px] text-fd-muted-foreground">
            {available ? <><span className="size-1.5 rounded-full bg-ib-brand" /> Complete</> : <><LockKeyhole className="size-3" /> Curriculum preview</>}
          </span>
        </div>
        <div>
          <p className={`m-0 text-[10px] font-semibold tracking-widest uppercase ${accent.text}`}>{path.audience}</p>
          <h2 className="mt-2 mb-0 text-xl font-semibold tracking-tight">{path.title}</h2>
          <p className="mt-2 mb-0 text-sm leading-6 text-fd-muted-foreground">{path.description}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ol className="m-0 grid list-none gap-2 p-0 sm:grid-cols-3">
          {path.previewSteps.map((step) => (
            <li key={step.label} className="rounded-lg border border-fd-border bg-fd-muted/30 p-3">
              <span className={`block text-[9px] font-semibold tracking-widest uppercase ${step.mode === 'Learn' ? 'text-ib-purple' : 'text-ib-teal'}`}>{step.mode}</span>
              <span className="mt-1 block text-xs leading-4">{step.label}</span>
            </li>
          ))}
        </ol>
        <div className="mt-4 rounded-lg border border-fd-border p-3">
          <p className="m-0 text-[9px] font-semibold tracking-widest text-fd-muted-foreground uppercase">Outcome</p>
          <p className="mt-1 mb-0 text-xs leading-5">{path.outcome}</p>
        </div>
      </CardContent>
      <CardFooter className="justify-between bg-transparent">
        <span className="inline-flex items-center gap-1.5 text-xs text-fd-muted-foreground">
          {path.duration ? <><Clock3 className="size-3.5" /> {path.duration} · {path.stepCount} steps</> : path.level}
        </span>
        {available ? (
          <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${accent.text}`}>
            Start path <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        ) : (
          <span className="text-xs text-fd-muted-foreground">In development</span>
        )}
      </CardFooter>
    </Card>
  );

  return available ? (
    <Link href={`/learn/paths/${path.slug}`} className="block h-full no-underline">{card}</Link>
  ) : card;
}

function Stat({ value, label, accent = false }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="bg-fd-card p-5 text-center">
      <p className={`m-0 text-xl font-semibold ${accent ? 'text-ib-brand' : ''}`}>{value}</p>
      <p className="mt-1 mb-0 text-[10px] tracking-widest text-fd-muted-foreground uppercase">{label}</p>
    </div>
  );
}

