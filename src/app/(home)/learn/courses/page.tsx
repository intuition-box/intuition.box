import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Clock3,
  GraduationCap,
  Layers3,
  LockKeyhole,
} from 'lucide-react';
import { AnimateOnView } from '@/components/animate';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/card';
import { PageHero } from '@/components/page-hero';
import { courseCatalog, type CourseCatalogItem } from '@/lib/course-catalog';

const DESCRIPTION =
  'Deep, structured courses for understanding the ideas, systems, and incentives behind Intuition.';

export const metadata: Metadata = {
  title: 'Courses',
  description: DESCRIPTION,
};

const ACCENTS = {
  mint: {
    border: 'border-ib-brand-alpha',
    text: 'text-ib-brand',
    soft: 'bg-ib-brand-alpha',
    gradient: 'from-ib-brand-dark',
  },
  teal: {
    border: 'border-ib-teal-alpha',
    text: 'text-ib-teal',
    soft: 'bg-ib-teal-alpha',
    gradient: 'from-ib-teal-alpha',
  },
  purple: {
    border: 'border-ib-purple-alpha',
    text: 'text-ib-purple',
    soft: 'bg-ib-purple-alpha',
    gradient: 'from-ib-purple-dark',
  },
  yellow: {
    border: 'border-ib-yellow-alpha',
    text: 'text-ib-yellow',
    soft: 'bg-ib-yellow-alpha',
    gradient: 'from-ib-yellow-dark',
  },
} as const;

export default function CoursesPage() {
  const available = courseCatalog.filter((course) => course.status === 'available').length;

  return (
    <main>
      <PageHero
        tone="mint"
        before={
          <span className="inline-flex items-center gap-2 rounded-full border border-ib-brand-alpha bg-ib-brand-alpha px-3 py-1 text-xs font-medium tracking-wide text-ib-brand uppercase">
            <GraduationCap className="size-3.5" />
            Intuition Learn
          </span>
        }
        title="Courses"
        description={DESCRIPTION}
      />

      <section className="max-w-5xl mx-auto px-6 md:px-8 pb-24">
        <AnimateOnView>
          <div className="mb-10 grid gap-px overflow-hidden rounded-xl border border-fd-border bg-fd-border sm:grid-cols-3">
            <Stat value={courseCatalog.length.toString()} label="Course curriculum" />
            <Stat value={available.toString()} label="Available now" accent />
            <Stat value="Theory-first" label="No coding required" />
          </div>
        </AnimateOnView>

        <div className="grid gap-6 md:grid-cols-2">
          {courseCatalog.map((course, index) => (
            <AnimateOnView key={course.slug} delay={(index % 2) * 0.06}>
              <CourseCard course={course} />
            </AnimateOnView>
          ))}
        </div>

        <AnimateOnView>
          <div className="mt-16 flex flex-col items-start justify-between gap-5 rounded-2xl border border-ib-teal-alpha bg-ib-teal-alpha/30 p-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-ib-teal-alpha text-ib-teal">
                <BrainCircuit className="size-5" />
              </span>
              <div>
                <h2 className="m-0 text-lg font-semibold">Looking for hands-on development?</h2>
                <p className="mt-1 mb-0 text-sm text-fd-muted-foreground">
                  Courses explain the system. Builder activities help you use it in working products.
                </p>
              </div>
            </div>
            <Link
              href="/learn/build"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-ib-teal no-underline hover:opacity-70"
            >
              Explore Build <ArrowRight className="size-4" />
            </Link>
          </div>
        </AnimateOnView>
      </section>
    </main>
  );
}

function CourseCard({ course }: { course: CourseCatalogItem }) {
  const accent = ACCENTS[course.accent];
  const available = course.status === 'available';

  const card = (
    <Card
      className={`group h-full overflow-hidden transition-colors ${accent.border} ${
        available ? 'hover:bg-fd-accent/20' : 'opacity-80'
      }`}
    >
      <div className={`relative h-32 overflow-hidden border-b border-fd-border bg-linear-to-br ${accent.gradient} to-fd-card p-5`}>
        <div aria-hidden className="absolute -right-12 -top-16 size-44 rounded-full border border-white/5" />
        <div aria-hidden className="absolute right-2 top-1 size-24 rounded-full border border-white/5" />
        <span className={`flex size-10 items-center justify-center rounded-xl ${accent.soft} ${accent.text}`}>
          <Layers3 className="size-5" />
        </span>
        <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-fd-border bg-black/20 px-2.5 py-1 text-[10px] text-fd-muted-foreground backdrop-blur">
          {available ? (
            <>
              <span className="size-1.5 rounded-full bg-ib-brand" /> Available
            </>
          ) : (
            <>
              <LockKeyhole className="size-3" /> In research
            </>
          )}
        </span>
      </div>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-fd-muted-foreground">
          <span className={accent.text}>{course.category}</span>
          <span aria-hidden>·</span>
          <span>{course.level}</span>
          <span aria-hidden>·</span>
          <span>{course.lessonCount} lessons</span>
          <span aria-hidden>·</span>
          <span>{course.duration}</span>
        </div>
        <div>
          <h2 className="m-0 text-xl font-semibold tracking-tight">{course.title}</h2>
          <p className="mt-2 mb-0 text-sm leading-6 text-fd-muted-foreground">{course.description}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2">
          {course.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-fd-muted px-2 py-1 text-[10px] text-fd-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between bg-transparent">
        <span className="flex items-center gap-1.5 text-xs text-fd-muted-foreground">
          <Clock3 className="size-3.5" /> {course.duration}
        </span>
        {available ? (
          <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${accent.text}`}>
            View course <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        ) : (
          <span className="text-xs text-fd-muted-foreground">Syllabus in development</span>
        )}
      </CardFooter>
    </Card>
  );

  return available ? (
    <Link href={`/learn/courses/${course.slug}`} className="block h-full no-underline">
      {card}
    </Link>
  ) : (
    card
  );
}

function Stat({ value, label, accent = false }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="bg-fd-card p-5 text-center">
      <p className={`m-0 text-xl font-semibold ${accent ? 'text-ib-brand' : 'text-fd-foreground'}`}>{value}</p>
      <p className="mt-1 mb-0 text-[10px] tracking-widest text-fd-muted-foreground uppercase">{label}</p>
    </div>
  );
}
