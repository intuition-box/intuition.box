import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock3 } from 'lucide-react';
import { getMDXComponents } from '@/components/mdx';
import { GraphDiagram } from '@/components/learn/graph-diagram';
import { KnowledgeCheck } from '@/components/learn/knowledge-check';
import { LearnProgressSummary, LessonCompletion } from '@/components/learn/learn-progress';
import { LessonRail } from '@/components/learn/lesson-rail';
import { QuickstartEmbed } from '@/components/learn/quickstart-embed';
import { TestnetNotice } from '@/components/learn/testnet-notice';
import { UseCaseScenario } from '@/components/learn/use-case-scenario';
import { getLearnLessons, learnSource } from '@/lib/learn-source';

export default async function LearnLessonPage(
  props: PageProps<'/learn/[slug]'>,
) {
  const { slug } = await props.params;
  const page = learnSource.getPage([slug]);
  if (!page) notFound();

  const lessons = getLearnLessons();
  const lessonIndex = lessons.findIndex((lesson) => lesson.slug === slug);
  const lesson = lessons[lessonIndex];
  if (!lesson) notFound();

  const previousLesson = lessons[lessonIndex - 1];
  const nextLesson = lessons[lessonIndex + 1];
  const MDX = page.data.body;
  const toc = page.data.toc.map((item) => ({
    title: typeof item.title === 'string' ? item.title : 'Section',
    url: item.url,
  }));

  return (
    <main className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-48 -z-10 h-[42rem] bg-hero-glow-mint opacity-70"
      />

      <header className="mx-auto w-full max-w-5xl px-5 pb-12 pt-24 sm:px-8 sm:pt-32">
        <Link
          href="/learn"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-fd-muted-foreground no-underline hover:text-fd-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand"
        >
          <ArrowLeft className="size-4" />
          Learn the protocol
        </Link>

        <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.18em] text-fd-muted-foreground">
          <span className="text-ib-brand">Lesson {lesson.number}</span>
          <span>{lesson.level}</span>
          <span className="inline-flex items-center gap-1.5 normal-case tracking-normal">
            <Clock3 className="size-3.5" />
            {lesson.durationMinutes} minutes
          </span>
        </div>

        <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight text-fd-foreground sm:text-5xl lg:text-6xl">
          {lesson.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-fd-muted-foreground">
          {lesson.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {lesson.concepts.map((concept) => (
            <span
              key={concept}
              className="rounded-full border border-fd-border bg-fd-card/50 px-3 py-1.5 text-xs text-fd-muted-foreground"
            >
              {concept}
            </span>
          ))}
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-5xl gap-10 px-5 pb-24 sm:px-8 lg:grid-cols-[15rem_minmax(0,45rem)] lg:items-start lg:gap-14">
        <LessonRail
          slug={lesson.slug}
          lessonNumber={lesson.number}
          objectives={lesson.objectives}
          toc={toc}
        />

        <article className="prose prose-invert learn-prose min-w-0 max-w-none">
          <MDX
            components={getMDXComponents({
              GraphDiagram,
              KnowledgeCheck,
              QuickstartEmbed,
              TestnetNotice,
              UseCaseScenario,
            })}
          />

          <section className="not-prose mt-14 border-y border-fd-border py-7">
            <p className="m-0 text-xs font-medium uppercase tracking-[0.2em] text-ib-brand">
              Lesson outcome
            </p>
            <p className="mt-3 text-lg leading-8 text-fd-foreground">
              {lesson.outcome}
            </p>
            <div className="mt-6">
              <LessonCompletion slug={lesson.slug} />
            </div>
          </section>

          <nav
            aria-label="Lesson navigation"
            className="not-prose mt-8 grid gap-3 sm:grid-cols-2"
          >
            {previousLesson ? (
              <Link
                href={previousLesson.href}
                className="group min-h-28 rounded-2xl border border-fd-border p-5 no-underline transition-colors duration-150 hover:border-ib-brand/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand"
              >
                <span className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-fd-muted-foreground">
                  <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5 motion-reduce:transform-none" />
                  Previous
                </span>
                <span className="mt-3 block font-medium text-fd-foreground">
                  {previousLesson.title}
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}

            {nextLesson ? (
              <Link
                href={nextLesson.href}
                className="group min-h-28 rounded-2xl border border-fd-border p-5 text-right no-underline transition-colors duration-150 hover:border-ib-brand/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand"
              >
                <span className="flex items-center justify-end gap-2 text-xs uppercase tracking-[0.16em] text-fd-muted-foreground">
                  Next
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
                </span>
                <span className="mt-3 block font-medium text-fd-foreground">
                  {nextLesson.title}
                </span>
              </Link>
            ) : (
              <Link
                href="/learn/quickstart"
                className="group min-h-28 rounded-2xl border border-ib-brand/30 bg-ib-brand-alpha p-5 text-right no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ib-brand"
              >
                <span className="flex items-center justify-end gap-2 text-xs uppercase tracking-[0.16em] text-ib-brand">
                  Build next
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
                </span>
                <span className="mt-3 block font-medium text-fd-foreground">
                  Open the Quickstart
                </span>
              </Link>
            )}
          </nav>

          <div className="not-prose mt-14">
            <LearnProgressSummary total={lessons.length} />
          </div>
        </article>
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return getLearnLessons().map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata(
  props: PageProps<'/learn/[slug]'>,
): Promise<Metadata> {
  const { slug } = await props.params;
  const page = learnSource.getPage([slug]);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
