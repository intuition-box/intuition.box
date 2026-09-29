import { courseLessons } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';
import type { CourseCatalogItem } from './course-catalog';

export const courseLessonSource = loader({
  baseUrl: '/learn/courses',
  source: toFumadocsSource(courseLessons, []),
});

export type CourseLesson = ReturnType<typeof courseLessonSource.getPages>[number];

export function getCourseLessons(course: string): CourseLesson[] {
  return courseLessonSource
    .getPages()
    .filter((page) => !page.data.draft && page.data.course === course)
    .sort((a, b) => a.data.order - b.data.order);
}

export function getCourseLesson(
  course: string,
  lesson: string,
): CourseLesson | undefined {
  const page = courseLessonSource.getPage([course, lesson]);
  if (!page || page.data.draft || page.data.course !== course) return undefined;
  return page;
}

export function getCourseModules(
  course: CourseCatalogItem,
  lessons: CourseLesson[] = getCourseLessons(course.slug),
) {
  return course.modules.map((module) => ({
    ...module,
    lessons: lessons
      .filter((lesson) => lesson.data.module === module.id)
      .map((lesson) => ({
        slug: lesson.slugs[1],
        title: lesson.data.title,
        description: lesson.data.description,
        duration: lesson.data.duration,
        order: lesson.data.order,
        href: lesson.url,
      })),
  }));
}
