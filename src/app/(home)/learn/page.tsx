import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@waveso/ui/button';
import {
  ArrowRight,
  BookOpen,
  Bot,
  Braces,
  CheckCircle2,
  Clock3,
  Code2,
  Compass,
  ExternalLink,
  GitBranch,
  GraduationCap,
  Library,
  Route,
  Sparkles,
  TerminalSquare,
} from 'lucide-react';
import { AnimateOnView } from '@/components/animate';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/card';
import { PageHero } from '@/components/page-hero';
import {
  featuredCourses,
  tutorialPreviews,
  type LearnAccent,
} from '@/lib/learn';
import { learningPathCatalog } from '@/lib/path-catalog';

const DESCRIPTION =
  'Understand the Intuition protocol, follow structured courses, and build useful applications with practical, tested guidance.';

const INTUITION_DOCS_URL = 'https://www.docs.intuition.systems/docs';
const SDK_QUICKSTART_URL =
  'https://www.docs.intuition.systems/docs/quick-start/using-the-sdk';
const INTUITION_SKILL_URL = 'https://agents.intuition.systems/';
const INTUITION_GITHUB_URL = 'https://github.com/0xIntuition';

export const metadata: Metadata = {
  title: 'Learn',
  description: DESCRIPTION,
};

const ACCENT_STYLES: Record<
  LearnAccent,
  { border: string; text: string; soft: string; glow: string }
> = {
  mint: {
    border: 'border-ib-brand-alpha',
    text: 'text-ib-brand',
    soft: 'bg-ib-brand-alpha',
    glow: 'from-ib-brand-dark',
  },
  teal: {
    border: 'border-ib-teal-alpha',
    text: 'text-ib-teal',
    soft: 'bg-ib-teal-alpha',
    glow: 'from-ib-teal-alpha',
  },
  purple: {
    border: 'border-ib-purple-alpha',
    text: 'text-ib-purple',
    soft: 'bg-ib-purple-alpha',
    glow: 'from-ib-purple-dark',
  },
  yellow: {
    border: 'border-ib-yellow-alpha',
    text: 'text-ib-yellow',
    soft: 'bg-ib-yellow-alpha',
    glow: 'from-ib-yellow-dark',
  },
};

export default function LearnPage() {
  return (
    <main>
      <PageHero
        tone="mint"
        before={
          <span className="inline-flex items-center gap-2 rounded-full border border-ib-brand-alpha bg-ib-brand-alpha px-3 py-1 text-xs font-medium tracking-wide text-ib-brand uppercase">
            <Sparkles className="size-3.5" />
            Intuition Learn
          </span>
        }
        title={
          <>
            Understand deeply.
            <br />
            Build confidently.
          </>
        }
        description={DESCRIPTION}
      />

      <div className="max-w-5xl mx-auto px-6 md:px-8 -mt-2">
        <nav
          aria-label="Learn page sections"
          className="flex items-center gap-1 overflow-x-auto rounded-xl border border-fd-border bg-fd-card/80 p-1.5 shadow-2xl shadow-black/20 backdrop-blur"
        >
          {[
            ['Start', '#start'],
            ['Paths', '#paths'],
            ['Courses', '#courses'],
            ['Build', '#build'],
            ['Resources', '#resources'],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="shrink-0 rounded-lg px-4 py-2 text-sm text-fd-muted-foreground no-underline transition-colors hover:bg-fd-accent hover:text-fd-foreground"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      <section id="start" className="scroll-mt-24 max-w-5xl mx-auto px-6 md:px-8 pt-24 pb-16">
        <AnimateOnView>
          <SectionHeading
            eyebrow="Choose how you begin"
            title="Two ways in. One connected system."
            description="Start with the ideas behind Intuition or move directly into building. Courses and paths connect both sides when you want more structure."
          />
        </AnimateOnView>

        <div className="grid gap-6 md:grid-cols-2">
          <AnimateOnView>
            <Card className="group relative h-full overflow-hidden border-ib-purple-alpha bg-linear-to-b from-ib-purple-dark/70 to-fd-card">
              <div
                aria-hidden
                className="absolute -right-16 -top-16 size-48 rounded-full bg-ib-purple/10 blur-3xl transition-transform duration-500 group-hover:scale-125"
              />
              <CardHeader className="relative gap-5">
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl border border-ib-purple-alpha bg-ib-purple-alpha text-ib-purple">
                    <Library className="size-5" />
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-ib-purple uppercase">
                    Learn
                  </span>
                </div>
                <div>
                  <h2 className="m-0 text-2xl font-semibold tracking-tight">
                    Understand Intuition
                  </h2>
                  <p className="mt-3 mb-0 max-w-md text-sm leading-6 text-fd-muted-foreground">
                    Build a durable mental model of the protocol, from structured knowledge and identity to signaling and economics.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="relative flex-1">
                <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2">
                  {['Core concepts', 'Protocol architecture', 'Knowledge graphs', 'Trust & incentives'].map(
                    (item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 rounded-lg border border-fd-border bg-black/10 px-3 py-2.5 text-sm"
                      >
                        <CheckCircle2 className="size-3.5 shrink-0 text-ib-purple" />
                        {item}
                      </li>
                    ),
                  )}
                </ul>
              </CardContent>
              <CardFooter className="relative bg-transparent">
                <Link
                  href="/learn/courses"
                  className="inline-flex items-center gap-2 text-sm font-medium text-ib-purple no-underline hover:opacity-70"
                >
                  Explore learning courses <ArrowRight className="size-4" />
                </Link>
              </CardFooter>
            </Card>
          </AnimateOnView>

          <AnimateOnView delay={0.1}>
            <Card className="group relative h-full overflow-hidden border-ib-teal-alpha bg-linear-to-b from-ib-teal-alpha/60 to-fd-card">
              <div
                aria-hidden
                className="absolute -right-16 -top-16 size-48 rounded-full bg-ib-teal/10 blur-3xl transition-transform duration-500 group-hover:scale-125"
              />
              <CardHeader className="relative gap-5">
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl border border-ib-teal-alpha bg-ib-teal-alpha text-ib-teal">
                    <Braces className="size-5" />
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-ib-teal uppercase">
                    Build
                  </span>
                </div>
                <div>
                  <h2 className="m-0 text-2xl font-semibold tracking-tight">
                    Build with Intuition
                  </h2>
                  <p className="mt-3 mb-0 max-w-md text-sm leading-6 text-fd-muted-foreground">
                    Start from a working example, use the SDK directly, or bring canonical Intuition context into your coding agent.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="relative flex-1">
                <div className="grid gap-2">
                  <ExternalRow
                    icon={<TerminalSquare className="size-4" />}
                    title="Start with the SDK"
                    label="Quickstart"
                    href={SDK_QUICKSTART_URL}
                  />
                  <ExternalRow
                    icon={<Bot className="size-4" />}
                    title="Code with an AI agent"
                    label="Intuition Skill"
                    href={INTUITION_SKILL_URL}
                  />
                </div>
              </CardContent>
              <CardFooter className="relative bg-transparent">
                <Link
                  href="/learn/build"
                  className="inline-flex items-center gap-2 text-sm font-medium text-ib-teal no-underline hover:opacity-70"
                >
                  Browse builder activities <ArrowRight className="size-4" />
                </Link>
              </CardFooter>
            </Card>
          </AnimateOnView>
        </div>

        <AnimateOnView delay={0.15}>
          <div className="relative mx-auto -mt-px flex max-w-3xl flex-col items-start gap-4 rounded-b-2xl border border-t-0 border-ib-brand-alpha bg-linear-to-r from-ib-brand-dark/80 via-fd-card to-ib-brand-dark/80 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-ib-brand-alpha text-ib-brand">
                <Route className="size-4" />
              </span>
              <div>
                <p className="m-0 text-sm font-medium">Want a guided route?</p>
                <p className="mt-1 mb-0 text-xs text-fd-muted-foreground">
                  Paths combine the right concepts, courses, and builds for a specific goal.
                </p>
              </div>
            </div>
            <Link
              href="/learn/paths"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-ib-brand no-underline hover:opacity-70"
            >
              Find your path <ArrowRight className="size-4" />
            </Link>
          </div>
        </AnimateOnView>
      </section>

      <section id="paths" className="scroll-mt-24 border-y border-fd-border bg-black/10">
        <div className="max-w-5xl mx-auto px-6 md:px-8 py-24">
          <AnimateOnView>
            <SectionHeading
              eyebrow="Guided paths"
              title="A route for what you want to accomplish."
              description="Paths do not create another library. They sequence the best learning and building activities into a clear next step."
            />
          </AnimateOnView>

          <div className="grid gap-4 md:grid-cols-2">
            {learningPathCatalog.map((path, index) => {
              const accent = ACCENT_STYLES[path.accent];
              const available = path.status === 'available';
              const card = (
                <Card className={`group h-full ${accent.border} ${available ? 'hover:bg-fd-accent/20' : 'opacity-75'}`}>
                  <CardHeader className="gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium tracking-wide uppercase ${accent.soft} ${accent.text}`}>
                        {path.audience}
                      </span>
                      <Compass className={`size-4 ${accent.text}`} />
                    </div>
                    <div>
                      <h3 className="m-0 text-lg font-semibold">{path.title}</h3>
                      <p className="mt-2 mb-0 text-sm leading-6 text-fd-muted-foreground">
                        {path.description}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <ol className="m-0 grid list-none gap-2 p-0 sm:grid-cols-3">
                      {path.previewSteps.map((step, stepIndex) => (
                        <li key={step.label} className="relative rounded-lg bg-fd-muted/50 px-3 py-3">
                          <span className={`block text-[9px] font-semibold tracking-widest uppercase ${step.mode === 'Learn' ? 'text-ib-purple' : 'text-ib-teal'}`}>
                            {step.mode}
                          </span>
                          <span className="mt-1 block text-xs leading-4">{step.label}</span>
                          {stepIndex < path.previewSteps.length - 1 && (
                            <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden size-3 -translate-y-1/2 text-fd-muted-foreground sm:block" />
                          )}
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                  <CardFooter className="justify-between bg-transparent">
                    <span className="text-xs text-fd-muted-foreground">
                      {available ? `${path.stepCount} steps · ${path.duration}` : 'Curriculum preview'}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${available ? accent.text : 'text-fd-muted-foreground'}`}>
                      {available ? 'Start path' : 'In development'}
                      {available && <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />}
                    </span>
                  </CardFooter>
                </Card>
              );
              return (
                <AnimateOnView key={path.title} delay={index * 0.06}>
                  {available ? (
                    <Link href={`/learn/paths/${path.slug}`} className="block h-full no-underline">{card}</Link>
                  ) : card}
                </AnimateOnView>
              );
            })}
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              href="/learn/paths"
              className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-5 py-2.5 text-sm font-medium no-underline transition-colors hover:bg-fd-accent"
            >
              Explore all learning paths <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="courses" className="scroll-mt-24 max-w-5xl mx-auto px-6 md:px-8 py-24">
        <AnimateOnView>
          <SectionHeading
            eyebrow="Featured courses"
            title="Build the mental model in full."
            description="Structured, self-paced courses for understanding the ideas, systems, and tradeoffs behind Intuition. Practical implementation stays in Build."
          />
        </AnimateOnView>

        <div className="grid gap-6 lg:grid-cols-3">
          {featuredCourses.map((course, index) => {
            const accent = ACCENT_STYLES[course.accent];
            const card = (
              <AnimateOnView key={course.title} delay={index * 0.08}>
                <Card className={`group h-full overflow-hidden ${accent.border}`}>
                  <div className={`relative flex h-36 items-end overflow-hidden border-b border-fd-border bg-linear-to-br ${accent.glow} to-fd-card p-5`}>
                    <div
                      aria-hidden
                      className="absolute -right-10 -top-14 size-40 rounded-full border border-white/5"
                    />
                    <div
                      aria-hidden
                      className="absolute -right-3 -top-2 size-24 rounded-full border border-white/5"
                    />
                    <GraduationCap className={`relative size-8 ${accent.text}`} />
                    <span className="absolute right-4 top-4 rounded-full border border-fd-border bg-black/20 px-2.5 py-1 text-[10px] text-fd-muted-foreground backdrop-blur">
                      Curriculum preview
                    </span>
                  </div>
                  <CardHeader>
                    <div className="flex flex-wrap gap-2 text-[10px] text-fd-muted-foreground">
                      <span>{course.level}</span>
                      <span aria-hidden>·</span>
                      <span>{course.lessons} lessons</span>
                      <span aria-hidden>·</span>
                      <span>{course.duration}</span>
                    </div>
                    <h3 className="m-0 text-lg leading-6 font-semibold">{course.title}</h3>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="m-0 text-sm leading-6 text-fd-muted-foreground">
                      {course.description}
                    </p>
                    <div className="mt-5 rounded-lg border border-fd-border bg-fd-muted/30 p-3">
                      <p className="m-0 text-[9px] font-semibold tracking-widest text-fd-muted-foreground uppercase">
                        You will understand
                      </p>
                      <p className="mt-1 mb-0 text-xs leading-5">{course.outcome}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between bg-transparent">
                    <span className={`text-xs font-medium ${accent.text}`}>{course.balance}</span>
                    <BookOpen className="size-4 text-fd-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </CardFooter>
                </Card>
              </AnimateOnView>
            );
            return course.slug ? (
              <Link key={course.title} href={`/learn/courses/${course.slug}`} className="block h-full no-underline">
                {card}
              </Link>
            ) : card;
          })}
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            href="/learn/courses"
            className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-5 py-2.5 text-sm font-medium no-underline transition-colors hover:bg-fd-accent"
          >
            Browse all six courses <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section id="build" className="scroll-mt-24 border-y border-fd-border bg-black/10">
        <div className="max-w-5xl mx-auto px-6 md:px-8 py-24">
          <AnimateOnView>
            <SectionHeading
              eyebrow="Builder activities"
              title="Small steps. Working outcomes."
              description="Every tutorial will declare its prerequisites, tested versions, expected result, and last technical review before publication."
            />
          </AnimateOnView>

          <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card">
            {tutorialPreviews.map((tutorial, index) => {
              const article = (
                <article
                  className={`group grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center ${
                    index < tutorialPreviews.length - 1 ? 'border-b border-fd-border' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-ib-teal-alpha bg-ib-teal-alpha text-ib-teal">
                      {tutorial.kind === 'AI workflow' ? (
                        <Bot className="size-4" />
                      ) : tutorial.kind === 'Quickstart' ? (
                        <TerminalSquare className="size-4" />
                      ) : (
                        <Code2 className="size-4" />
                      )}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="m-0 text-base font-medium">{tutorial.title}</h3>
                        <span className="rounded-full bg-fd-muted px-2 py-0.5 text-[9px] font-medium tracking-wide text-fd-muted-foreground uppercase">
                          {tutorial.kind}
                        </span>
                      </div>
                      <p className="mt-1.5 mb-0 max-w-2xl text-sm leading-6 text-fd-muted-foreground">
                        {tutorial.description}
                      </p>
                    </div>
                  </div>
                  <dl className="m-0 flex items-center gap-4 pl-14 text-xs text-fd-muted-foreground sm:pl-0">
                    <div>
                      <dt className="sr-only">Level</dt>
                      <dd className="m-0">{tutorial.level}</dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">Duration</dt>
                      <Clock3 className="size-3.5" />
                      <dd className="m-0">{tutorial.duration}</dd>
                    </div>
                    <div>
                      <dt className="sr-only">Technology</dt>
                      <dd className="m-0 rounded bg-fd-muted px-2 py-1 font-mono text-[10px]">
                        {tutorial.stack}
                      </dd>
                    </div>
                  </dl>
                </article>
              );

              return (
                <AnimateOnView key={tutorial.title} delay={index * 0.04}>
                  {tutorial.slug ? (
                    <Link href={`/learn/build/${tutorial.slug}`} className="block text-fd-foreground no-underline hover:bg-fd-accent/20">
                      {article}
                    </Link>
                  ) : article}
                </AnimateOnView>
              );
            })}
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              href="/learn/build"
              className="inline-flex items-center gap-2 rounded-full border border-ib-teal-alpha bg-ib-teal-alpha px-5 py-2.5 text-sm font-medium text-ib-teal no-underline transition-colors hover:opacity-75"
            >
              Open the Build directory <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="resources" className="scroll-mt-24 max-w-5xl mx-auto px-6 md:px-8 py-24">
        <AnimateOnView>
          <SectionHeading
            eyebrow="Developer toolbelt"
            title="Move from learning to working code."
            description="The playground and ecosystem live here as useful tools and context—not as extra learning categories."
          />
        </AnimateOnView>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ResourceCard
            icon={<BookOpen className="size-5" />}
            title="Protocol docs"
            description="Canonical concepts and technical reference."
            href={INTUITION_DOCS_URL}
          />
          <ResourceCard
            icon={<Braces className="size-5" />}
            title="TypeScript SDK"
            description="Read, create, and signal on protocol data."
            href={SDK_QUICKSTART_URL}
          />
          <ResourceCard
            icon={<Bot className="size-5" />}
            title="Intuition Skill"
            description="Protocol context made for coding agents."
            href={INTUITION_SKILL_URL}
          />
          <ResourceCard
            icon={<GitBranch className="size-5" />}
            title="Open source"
            description="Explore contracts, packages, and repositories."
            href={INTUITION_GITHUB_URL}
          />
        </div>

        <AnimateOnView>
          <div className="relative mt-16 overflow-hidden rounded-3xl border border-ib-brand-dark bg-linear-to-r from-fd-card via-ib-brand-dark/70 to-fd-card p-8 sm:p-10">
            <div aria-hidden className="absolute inset-0 opacity-10 bg-assets-art bg-cover bg-center" />
            <div className="relative flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <p className="m-0 text-xs font-semibold tracking-[0.18em] text-ib-brand uppercase">
                  Learn → Build → Contribute
                </p>
                <h2 className="mt-3 mb-0 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Put what you learn to work in the ecosystem.
                </h2>
                <p className="mt-3 mb-0 text-sm leading-6 text-fd-muted-foreground">
                  Study real builder work, find an open mission, and turn new protocol knowledge into a meaningful contribution.
                </p>
              </div>
              <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
                <Button
                  className="bg-ib-brand text-ib-brand-dark hover:bg-ib-brand hover:opacity-70"
                  render={<Link href="/missions" />}
                >
                  Explore missions
                </Button>
                <Button variant="outline" render={<Link href="/spotlights" />}>
                  Meet builders
                </Button>
              </div>
            </div>
          </div>
        </AnimateOnView>
      </section>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="m-0 text-xs font-semibold tracking-[0.18em] text-ib-brand uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-3 mb-0 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 mb-0 text-base leading-7 text-fd-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function ExternalRow({
  icon,
  title,
  label,
  href,
}: {
  icon: ReactNode;
  title: string;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/row flex items-center justify-between gap-3 rounded-lg border border-fd-border bg-black/10 px-3 py-2.5 text-sm text-fd-foreground no-underline transition-colors hover:bg-ib-teal-alpha"
    >
      <span className="flex items-center gap-2.5">
        <span className="text-ib-teal">{icon}</span>
        {title}
      </span>
      <span className="flex items-center gap-1 text-[10px] text-fd-muted-foreground">
        {label}
        <ExternalLink className="size-3" />
      </span>
    </a>
  );
}

function ResourceCard({
  icon,
  title,
  description,
  href,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group no-underline">
      <Card className="h-full transition-colors group-hover:border-ib-brand-alpha group-hover:bg-ib-brand-dark/30">
        <CardHeader className="flex-row items-start justify-between">
          <span className="flex size-10 items-center justify-center rounded-lg bg-ib-brand-alpha text-ib-brand">
            {icon}
          </span>
          <ExternalLink className="size-3.5 text-fd-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </CardHeader>
        <CardContent className="mt-auto">
          <h3 className="m-0 text-sm font-medium text-fd-foreground">{title}</h3>
          <p className="mt-2 mb-0 text-xs leading-5 text-fd-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </a>
  );
}
