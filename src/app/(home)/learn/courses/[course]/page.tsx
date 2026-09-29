import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Layers3,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { CourseProgressCard } from '@/components/learn/course-progress';
import { getCourse, courseCatalog } from '@/lib/course-catalog';
import { getCourseLessons, getCourseModules } from '@/lib/course-source';

export function generateStaticParams() {
  return courseCatalog
    .filter((course) => course.status === 'available')
    .map((course) => ({ course: course.slug }));
}

export async function generateMetadata(
  props: PageProps<'/learn/courses/[course]'>,
): Promise<Metadata> {
  const params = await props.params;
  const course = getCourse(params.course);
  if (!course || course.status !== 'available') return {};
  return { title: course.title, description: course.description };
}

export default async function CourseOverviewPage(
  props: PageProps<'/learn/courses/[course]'>,
) {
  const params = await props.params;
  const course = getCourse(params.course);
  if (!course || course.status !== 'available') notFound();

  const lessons = getCourseLessons(course.slug);
  const modules = getCourseModules(course, lessons);
  if (lessons.length === 0) notFound();

  return (
    <main className="pb-24">
      <header className="relative isolate overflow-hidden border-b border-fd-border">
        <div aria-hidden className="absolute inset-0 -z-10 bg-hero-glow-mint" />
        <div className="max-w-5xl mx-auto px-6 md:px-8 pt-20 pb-16">
          <Link
            href="/learn/courses"
            className="mb-10 inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground no-underline hover:text-fd-foreground"
          >
            <ArrowLeft className="size-4" /> All courses
          </Link>
          <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:items-end">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-ib-brand-alpha bg-ib-brand-alpha px-2.5 py-1 font-medium text-ib-brand">
                  Foundations
                </span>
                <span className="rounded-full border border-fd-border bg-fd-card/70 px-2.5 py-1 text-fd-muted-foreground">
                  Beta
                </span>
              </div>
              <h1 className="m-0 max-w-3xl text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
                {course.title}
              </h1>
              <p className="mt-5 mb-0 max-w-2xl text-lg leading-8 text-fd-muted-foreground">
                {course.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-fd-muted-foreground">
                <span className="flex items-center gap-1.5"><GraduationCap className="size-4" /> {course.level}</span>
                <span className="flex items-center gap-1.5"><Clock3 className="size-4" /> {course.duration}</span>
                <span className="flex items-center gap-1.5"><BookOpen className="size-4" /> {lessons.length} lessons</span>
              </div>
            </div>
            <CourseProgressCard
              course={course.slug}
              lessons={lessons.map((lesson) => ({ slug: lesson.slugs[1], href: lesson.url }))}
            />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto grid gap-16 px-6 md:px-8 pt-16 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <section>
            <Eyebrow icon={<Sparkles className="size-4" />}>What you will understand</Eyebrow>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {course.outcomes.map((outcome) => (
                <div key={outcome} className="flex gap-3 rounded-xl border border-fd-border bg-fd-card p-4 text-sm leading-6">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-ib-brand" />
                  {outcome}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <Eyebrow icon={<Layers3 className="size-4" />}>Course syllabus</Eyebrow>
            <div className="mt-5 grid gap-4">
              {modules.map((module, moduleIndex) => (
                <details
                  key={module.id}
                  open={moduleIndex === 0}
                  className="group overflow-hidden rounded-xl border border-fd-border bg-fd-card"
                >
                  <summary className="flex cursor-pointer list-none items-start gap-4 p-5 marker:content-none">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-ib-brand-alpha text-xs font-semibold text-ib-brand">
                      {moduleIndex + 1}
                    </span>
                    <span>
                      <span className="block font-medium">{module.title}</span>
                      <span className="mt-1 block text-sm leading-6 text-fd-muted-foreground">{module.description}</span>
                    </span>
                    <span className="ml-auto shrink-0 text-xs text-fd-muted-foreground">
                      {module.lessons.length} lessons
                    </span>
                  </summary>
                  <ol className="m-0 list-none border-t border-fd-border p-2">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <li key={lesson.slug}>
                        <Link
                          href={lesson.href}
                          className="group/lesson flex items-center gap-3 rounded-lg px-3 py-3 text-sm no-underline hover:bg-fd-accent"
                        >
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-fd-border text-[10px] text-fd-muted-foreground">
                            {lessonIndex + 1}
                          </span>
                          <span>{lesson.title}</span>
                          <span className="ml-auto flex items-center gap-1 text-xs text-fd-muted-foreground">
                            {lesson.duration} min <ArrowRight className="size-3.5 transition-transform group-hover/lesson:translate-x-0.5" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <div className="rounded-xl border border-fd-border bg-fd-card p-5">
            <Eyebrow icon={<ShieldCheck className="size-4" />}>Prerequisites</Eyebrow>
            <ul className="mt-4 mb-0 grid list-none gap-3 p-0 text-sm text-fd-muted-foreground">
              {course.prerequisites.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-ib-brand" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-fd-border bg-fd-card p-5 text-sm">
            <p className="m-0 font-medium">How this course teaches</p>
            <p className="mt-2 mb-0 leading-6 text-fd-muted-foreground">
              Short conceptual lessons, worked examples, visual models, reflection prompts, and checks for understanding. No coding is required.
            </p>
          </div>
          {course.lastReviewed && (
            <p className="px-1 text-xs leading-5 text-fd-muted-foreground">
              Research reviewed {new Date(`${course.lastReviewed}T00:00:00Z`).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
              })}. Technical concepts link to current official sources.
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}

function Eyebrow({ children, icon }: { children: ReactNode; icon: ReactNode }) {
  return (
    <h2 className="m-0 flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-ib-brand uppercase">
      {icon} {children}
    </h2>
  );
}
