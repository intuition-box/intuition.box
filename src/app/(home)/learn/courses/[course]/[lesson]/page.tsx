import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, Clock3 } from 'lucide-react';
import { getMDXComponents } from '@/components/mdx';
import { CourseSidebar, LessonCompletion } from '@/components/learn/course-progress';
import { LearningObjectives } from '@/components/learn/lesson-components';
import { getCourse } from '@/lib/course-catalog';
import {
  courseLessonSource,
  getCourseLesson,
  getCourseLessons,
  getCourseModules,
} from '@/lib/course-source';

export function generateStaticParams() {
  return courseLessonSource.getPages().map((lesson) => ({
    course: lesson.slugs[0],
    lesson: lesson.slugs[1],
  }));
}

export async function generateMetadata(
  props: PageProps<'/learn/courses/[course]/[lesson]'>,
): Promise<Metadata> {
  const params = await props.params;
  const lesson = getCourseLesson(params.course, params.lesson);
  if (!lesson) return {};
  return { title: lesson.data.title, description: lesson.data.description };
}

export default async function CourseLessonPage(
  props: PageProps<'/learn/courses/[course]/[lesson]'>,
) {
  const params = await props.params;
  const course = getCourse(params.course);
  const lesson = getCourseLesson(params.course, params.lesson);
  if (!course || course.status !== 'available' || !lesson) notFound();

  const lessons = getCourseLessons(course.slug);
  const modules = getCourseModules(course, lessons);
  const lessonIndex = lessons.findIndex((item) => item.slugs[1] === params.lesson);
  const previous = lessonIndex > 0 ? lessons[lessonIndex - 1] : undefined;
  const next = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : undefined;
  const module = course.modules.find((item) => item.id === lesson.data.module);
  const MDX = lesson.data.body;

  return (
    <main className="min-h-screen border-t border-fd-border">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[270px_minmax(0,760px)] xl:grid-cols-[270px_minmax(0,760px)_220px]">
        <aside className="hidden border-r border-fd-border px-5 py-8 lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
            <CourseSidebar
              course={course.slug}
              courseTitle={course.title}
              modules={modules}
              currentLesson={params.lesson}
            />
          </div>
        </aside>

        <article className="min-w-0 px-6 py-10 md:px-10 lg:py-14">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link
              href={`/learn/courses/${course.slug}`}
              className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground no-underline hover:text-fd-foreground"
            >
              <ArrowLeft className="size-4" /> Course overview
            </Link>
            <span className="text-xs text-fd-muted-foreground">
              Lesson {lessonIndex + 1} of {lessons.length}
            </span>
          </div>

          <details className="mb-8 rounded-xl border border-fd-border bg-fd-card p-4 lg:hidden">
            <summary className="cursor-pointer text-sm font-medium">Course outline</summary>
            <div className="mt-4 border-t border-fd-border pt-4">
              <CourseSidebar
                course={course.slug}
                courseTitle={course.title}
                modules={modules}
                currentLesson={params.lesson}
              />
            </div>
          </details>

          <header className="mb-10 border-b border-fd-border pb-8">
            <p className="m-0 text-xs font-semibold tracking-[0.16em] text-ib-brand uppercase">
              {module?.title}
            </p>
            <h1 className="mt-3 mb-0 text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
              {lesson.data.title}
            </h1>
            <p className="mt-4 mb-0 text-lg leading-8 text-fd-muted-foreground">
              {lesson.data.description}
            </p>
            <div className="mt-5 flex items-center gap-4 text-xs text-fd-muted-foreground">
              <span className="flex items-center gap-1.5"><Clock3 className="size-3.5" /> {lesson.data.duration} min</span>
              <span className="flex items-center gap-1.5"><BookOpen className="size-3.5" /> Conceptual lesson</span>
            </div>
          </header>

          <LearningObjectives items={lesson.data.objectives} />

          <div className="prose prose-invert max-w-none course-prose">
            <MDX components={getMDXComponents()} />

            {lesson.data.references && lesson.data.references.length > 0 && (
              <section className="not-prose mt-12 border-t border-fd-border pt-8">
                <h2 className="m-0 text-sm font-semibold">Official references</h2>
                <ul className="mt-4 mb-0 grid list-none gap-2 p-0">
                  {lesson.data.references.map((reference) => (
                    <li key={reference.url}>
                      <a
                        href={reference.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-ib-brand no-underline hover:opacity-70"
                      >
                        {reference.title} <ArrowRight className="size-3.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <LessonCompletion
              course={course.slug}
              lesson={params.lesson}
              nextHref={next?.url}
              nextTitle={next?.data.title}
            />
          </div>

          <nav aria-label="Lesson pagination" className="mt-8 grid gap-3 sm:grid-cols-2">
            {previous ? (
              <LessonLink direction="Previous" title={previous.data.title} href={previous.url} />
            ) : <span />}
            {next && <LessonLink direction="Next" title={next.data.title} href={next.url} align="right" />}
          </nav>
        </article>

        <aside className="hidden border-l border-fd-border px-5 py-10 xl:block">
          <div className="sticky top-20">
            <p className="mb-3 text-[10px] font-semibold tracking-[0.14em] text-fd-muted-foreground uppercase">
              On this page
            </p>
            {lesson.data.toc.length > 0 ? (
              <nav aria-label="On this page">
                <ul className="m-0 grid list-none gap-2 p-0 text-xs">
                  {lesson.data.toc.map((item) => (
                    <li key={item.url} style={{ paddingLeft: `${Math.max(0, item.depth - 2) * 12}px` }}>
                      <a href={item.url} className="text-fd-muted-foreground no-underline hover:text-fd-foreground">
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : (
              <p className="text-xs text-fd-muted-foreground">No headings</p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}

function LessonLink({
  direction,
  title,
  href,
  align = 'left',
}: {
  direction: string;
  title: string;
  href: string;
  align?: 'left' | 'right';
}) {
  return (
    <Link
      href={href}
      className={`rounded-xl border border-fd-border bg-fd-card p-4 no-underline transition-colors hover:bg-fd-accent ${
        align === 'right' ? 'text-right' : ''
      }`}
    >
      <span className="block text-[10px] font-medium tracking-widest text-fd-muted-foreground uppercase">{direction}</span>
      <span className="mt-1 block text-sm font-medium text-fd-foreground">{title}</span>
    </Link>
  );
}
