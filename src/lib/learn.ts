export type LearnAccent = 'mint' | 'teal' | 'purple' | 'yellow';

export interface CoursePreview {
  slug?: string;
  title: string;
  description: string;
  outcome: string;
  level: 'Beginner' | 'Intermediate';
  duration: string;
  lessons: number;
  accent: LearnAccent;
  balance: 'Theory';
}

export interface TutorialPreview {
  slug?: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate';
  duration: string;
  stack: string;
  kind: 'Quickstart' | 'Tutorial' | 'AI workflow';
}

export const featuredCourses: CoursePreview[] = [
  {
    slug: 'intuition-foundations',
    title: 'Intuition Foundations',
    description: 'A grounded introduction to Intuition, its knowledge model, economic signals, and responsible product design.',
    outcome: 'Explain the protocol and evaluate an Intuition-shaped use case.',
    level: 'Beginner',
    duration: '2h 35m',
    lessons: 12,
    accent: 'mint',
    balance: 'Theory',
  },
  {
    title: 'Semantic Knowledge Graphs',
    description: 'Study graph semantics, identity, relationships, provenance, context, and the choices that make shared knowledge coherent.',
    outcome: 'Evaluate and design a clear, reusable knowledge model.',
    level: 'Intermediate',
    duration: '3h 10m',
    lessons: 14,
    accent: 'purple',
    balance: 'Theory',
  },
  {
    title: 'AI Agents and Verifiable Knowledge',
    description: 'Understand how agents use identity, provenance, shared context, reputation, and inspectable knowledge in open systems.',
    outcome: 'Evaluate an agent trust design and explain its evidence boundaries.',
    level: 'Intermediate',
    duration: '2h 50m',
    lessons: 12,
    accent: 'purple',
    balance: 'Theory',
  },
];

export const tutorialPreviews: TutorialPreview[] = [
  {
    slug: 'query-display-first-atom',
    title: 'Query your first atom',
    description: 'Query the public GraphQL API and render structured atom data with deliberate loading, empty, and error states.',
    level: 'Beginner',
    duration: '20 min',
    stack: 'Next.js + GraphQL',
    kind: 'Quickstart',
  },
  {
    title: 'Create an onchain triple',
    description: 'Connect a wallet and publish a subject-predicate-object claim on testnet.',
    level: 'Beginner',
    duration: '35 min',
    stack: 'React + viem',
    kind: 'Tutorial',
  },
  {
    title: 'Add signaling to an application',
    description: 'Let users express economic confidence in knowledge from a product interface.',
    level: 'Intermediate',
    duration: '50 min',
    stack: 'Next.js',
    kind: 'Tutorial',
  },
  {
    title: 'Build with the Intuition Skill',
    description: 'Give your coding agent canonical protocol context before it writes an integration.',
    level: 'Beginner',
    duration: '15 min',
    stack: 'AI agent',
    kind: 'AI workflow',
  },
];
