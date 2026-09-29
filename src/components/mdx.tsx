import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import {
  BuildCheckpoint,
  CaseStudy,
  ConceptCheck,
  ExpectedResult,
  KeyTakeaways,
  LearningObjectives,
  ThinkAbout,
  Troubleshooting,
} from '@/components/learn/lesson-components';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    BuildCheckpoint,
    CaseStudy,
    ConceptCheck,
    ExpectedResult,
    KeyTakeaways,
    LearningObjectives,
    ThinkAbout,
    Troubleshooting,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
