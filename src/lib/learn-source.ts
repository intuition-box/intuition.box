import { learn } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';
import { learnRoute } from './shared';
import type { LearnLessonMeta, LearnLessonSummary } from './learn';

export const learnSource = loader({
  baseUrl: learnRoute,
  source: toFumadocsSource(learn, []),
});

export function getLearnLessons(): LearnLessonSummary[] {
  return learnSource
    .getPages()
    .map((page) => {
      const meta: LearnLessonMeta = {
        slug: page.data.slug,
        order: page.data.order,
        title: page.data.title,
        description: page.data.description ?? '',
        level: page.data.level,
        durationMinutes: page.data.durationMinutes,
        objectives: page.data.objectives,
        concepts: page.data.concepts,
        outcome: page.data.outcome,
      };

      return {
        ...meta,
        href: page.url,
        number: String(meta.order).padStart(2, '0'),
      };
    })
    .sort((a, b) => a.order - b.order);
}
