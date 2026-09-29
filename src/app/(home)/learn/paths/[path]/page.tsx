import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock3,
  Compass,
  GraduationCap,
  Route,
  ShieldCheck,
} from 'lucide-react';
import {
  PathExperience,
  type PathActivityStep,
  type PathLessonStep,
  type PathStage,
} from '@/components/learn/path-progress';
import { getCourse } from '@/lib/course-catalog';
import { getCourseLessons } from '@/lib/course-source';
import { getLearningPath, learningPathCatalog } from '@/lib/path-catalog';

const PORTAL_URL = 'https://portal.intuition.systems';

export function generateStaticParams() {
  return learningPathCatalog
    .filter((path) => path.status === 'available')
    .map((path) => ({ path: path.slug }));
}

export async function generateMetadata(
  props: PageProps<'/learn/paths/[path]'>,
): Promise<Metadata> {
  const params = await props.params;
  const path = getLearningPath(params.path);
  if (!path || path.status !== 'available') return {};
  return { title: path.title, description: path.description };
}

export default async function LearningPathPage(
  props: PageProps<'/learn/paths/[path]'>,
) {
  const params = await props.params;
  const path = getLearningPath(params.path);
  if (!path || path.status !== 'available' || path.slug !== 'understand-intuition') notFound();

  const course = getCourse('intuition-foundations');
  if (!course) notFound();
  const lessons = getCourseLessons(course.slug);
  const stages = buildStages(lessons.map((lesson) => ({
    order: lesson.data.order,
    module: lesson.data.module,
    step: {
      kind: 'lesson' as const,
      id: `lesson-${course.slug}-${lesson.slugs[1]}`,
      slug: lesson.slugs[1],
      title: lesson.data.title,
      description: lesson.data.description ?? 'Continue the Foundations curriculum.',
      duration: lesson.data.duration,
      href: lesson.url,
      course: course.slug,
    },
  })));

  const nextPaths = learningPathCatalog.filter((item) => item.slug !== path.slug);

  return (
    <main className="pb-24">
      <header className="relative isolate overflow-hidden border-b border-fd-border">
        <div aria-hidden className="absolute inset-0 -z-10 bg-hero-glow-mint opacity-70" />
        <div className="max-w-5xl mx-auto px-6 md:px-8 pt-16 pb-16">
          <Link href="/learn/paths" className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground no-underline hover:text-fd-foreground">
            <ArrowLeft className="size-4" /> All learning paths
          </Link>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_280px] lg:items-end">
            <div>
              <div className="mb-5 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-ib-brand-alpha bg-ib-brand-alpha px-2.5 py-1 font-medium text-ib-brand">Complete path</span>
                <span className="rounded-full border border-fd-border bg-fd-card/70 px-2.5 py-1 text-fd-muted-foreground">No coding required</span>
              </div>
              <p className="m-0 text-xs font-semibold tracking-[0.16em] text-ib-brand uppercase">{path.audience}</p>
              <h1 className="mt-3 mb-0 max-w-3xl text-4xl leading-tight font-semibold tracking-tight sm:text-6xl">{path.title}</h1>
              <p className="mt-5 mb-0 max-w-2xl text-lg leading-8 text-fd-muted-foreground">{path.description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-fd-muted-foreground">
                <span className="flex items-center gap-1.5"><GraduationCap className="size-4" /> {path.level}</span>
                <span className="flex items-center gap-1.5"><Clock3 className="size-4" /> {path.duration}</span>
                <span className="flex items-center gap-1.5"><Route className="size-4" /> {path.stepCount} steps</span>
              </div>
            </div>
            <div className="rounded-xl border border-fd-border bg-fd-card/80 p-5 backdrop-blur">
              <p className="m-0 text-[10px] font-semibold tracking-widest text-ib-brand uppercase">You will leave able to</p>
              <p className="mt-3 mb-0 text-sm leading-6 text-fd-foreground">{path.outcome}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 md:px-8 pt-14">
        <section className="mb-14 grid gap-5 md:grid-cols-3">
          <OverviewCard icon={<BookOpen className="size-4" />} title="One complete course" description="All 12 Intuition Foundations lessons, kept in their original theory-first curriculum." />
          <OverviewCard icon={<Compass className="size-4" />} title="Three field activities" description="Observe the live graph, interpret signal, and test a product idea without writing code." />
          <OverviewCard icon={<ShieldCheck className="size-4" />} title="Responsible by design" description="Every exercise separates protocol evidence, application inference, and unresolved uncertainty." />
        </section>

        <PathExperience path={path.slug} stages={stages} />

        <section className="mt-24 border-t border-fd-border pt-14">
          <div className="max-w-2xl">
            <p className="m-0 text-xs font-semibold tracking-[0.16em] text-ib-brand uppercase">After Foundations</p>
            <h2 className="mt-3 mb-0 text-3xl font-semibold tracking-tight">Choose what you want to make useful.</h2>
            <p className="mt-3 mb-0 leading-7 text-fd-muted-foreground">
              Your fit memo should make the next direction clearer. These specialist curricula remain visible while their courses and labs are being verified.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {nextPaths.map((nextPath) => (
              <article key={nextPath.slug} className="rounded-xl border border-fd-border bg-fd-card p-5">
                <p className="m-0 text-[10px] font-semibold tracking-widest text-fd-muted-foreground uppercase">{nextPath.audience}</p>
                <h3 className="mt-2 mb-0 text-lg font-medium">{nextPath.title}</h3>
                <p className="mt-2 mb-0 text-sm leading-6 text-fd-muted-foreground">{nextPath.outcome}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-fd-muted-foreground">Curriculum preview <ArrowRight className="size-3.5" /></span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function buildStages(
  lessons: Array<{ order: number; module: string; step: PathLessonStep }>,
): PathStage[] {
  const inModule = (module: string) => lessons
    .filter((lesson) => lesson.module === module)
    .sort((a, b) => a.order - b.order)
    .map((lesson) => lesson.step);

  return [
    {
      id: 'why-intuition',
      eyebrow: 'Orient',
      title: 'See the problem clearly',
      description: 'Understand the information problem, Intuition’s thesis, and the boundaries of each system layer.',
      steps: inModule('why-intuition'),
    },
    {
      id: 'language-of-knowledge',
      eyebrow: 'Model',
      title: 'Learn the graph’s language',
      description: 'Move from identifiers to explicit claims, then inspect how those ideas appear in a live interface.',
      steps: [...inModule('language-of-knowledge'), portalActivity],
    },
    {
      id: 'economic-trust',
      eyebrow: 'Interpret',
      title: 'Read conviction without calling it truth',
      description: 'Understand signal and incentives, then practice describing market-weighted information honestly.',
      steps: [...inModule('economic-trust'), signalActivity],
    },
    {
      id: 'from-protocol-to-products',
      eyebrow: 'Decide',
      title: 'Recognize a strong use case',
      description: 'Apply the complete mental model to a product idea and choose the specialist path that fits.',
      steps: [...inModule('from-protocol-to-products'), fitMemoActivity],
    },
  ];
}

const portalActivity: PathActivityStep = {
  kind: 'activity',
  id: 'portal-field-study',
  title: 'Inspect one real claim in the Portal',
  description: 'Translate a live graph object back into the atoms, relationship, provenance, and context you just learned.',
  duration: 15,
  externalHref: PORTAL_URL,
  externalLabel: 'Open Intuition Portal',
  instructions: [
    'Open the Portal and choose one person, project, organization, or concept you can recognize.',
    'Identify the atom used to represent it. Note which metadata helps you believe it refers to the intended subject.',
    'Find one connected claim and rewrite it explicitly as subject — predicate — object.',
    'Identify who created or supported the claim and what evidence or context is visible.',
    'Write down one important detail the interface does not establish.',
  ],
  deliverable: 'A short claim record containing the atom, one triple, its visible provenance, and one unresolved uncertainty.',
};

const signalActivity: PathActivityStep = {
  kind: 'activity',
  id: 'signal-interpretation',
  title: 'Write an honest signal interpretation',
  description: 'Practice turning support and opposition into a useful explanation without promoting economic weight into truth.',
  duration: 15,
  externalHref: PORTAL_URL,
  externalLabel: 'Inspect signal in Portal',
  instructions: [
    'Choose an atom or claim with visible economic activity.',
    'Record the support, opposition, position count, or other signal the interface exposes.',
    'Separate what you directly observed from what you are tempted to infer.',
    'Name one alternative explanation for the activity, such as popularity, speculation, coordination, or early discovery.',
    'Write the precise label you would show a user instead of “verified,” “true,” or “safe.”',
  ],
  deliverable: 'A five-line interpretation that states the observed signal, its provenance, a plausible inference, an alternative explanation, and an honest UI label.',
};

const fitMemoActivity: PathActivityStep = {
  kind: 'activity',
  id: 'use-case-fit-memo',
  title: 'Write your Intuition fit memo',
  description: 'Use the course’s four-part fit test to decide whether an idea deserves shared protocol infrastructure.',
  duration: 20,
  instructions: [
    'Name one product or feature you might want to improve with Intuition.',
    'Identify the entities that independent applications would need to recognize as the same things.',
    'List the claims that become more useful when they are portable and attributable.',
    'Explain whether plural support and opposition add meaningful information.',
    'Describe how another application could reuse or extend the resulting graph.',
    'Name the privacy, permanence, incentive, or interpretation risk introduced by making this shared.',
    'Conclude with “use Intuition,” “use a conventional database,” or “research further,” and defend the decision.',
  ],
  deliverable: 'A one-page decision memo plus your recommended next path: app, data, onchain integration, or agent trust.',
};

function OverviewCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-fd-border bg-fd-card p-5">
      <span className="flex size-8 items-center justify-center rounded-lg bg-ib-brand-alpha text-ib-brand">{icon}</span>
      <h2 className="mt-4 mb-0 text-sm font-semibold">{title}</h2>
      <p className="mt-2 mb-0 text-xs leading-5 text-fd-muted-foreground">{description}</p>
    </div>
  );
}
