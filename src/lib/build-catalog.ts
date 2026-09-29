import type { LearnAccent } from './learn';

export type BuildGuideStatus = 'available' | 'planned';
export type BuildGuideKind = 'Quickstart' | 'Tutorial' | 'Project' | 'AI workflow';

export interface BuildGuideCatalogItem {
  slug: string;
  title: string;
  description: string;
  outcome: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
  stack: string[];
  kind: BuildGuideKind;
  status: BuildGuideStatus;
  accent: LearnAccent;
  requires: string[];
}

export const buildGuideCatalog: BuildGuideCatalogItem[] = [
  {
    slug: 'query-display-first-atom',
    title: 'Build an Intuition Atom Explorer',
    description:
      'Create a searchable Next.js interface that reads live atoms from the Intuition knowledge graph and renders their identity safely.',
    outcome: 'A working, read-only atom search experience powered by the Intuition GraphQL API.',
    level: 'Beginner',
    duration: '35 min',
    stack: ['Next.js', 'TypeScript', 'GraphQL'],
    kind: 'Quickstart',
    status: 'available',
    accent: 'teal',
    requires: ['Basic React and TypeScript', 'Node.js 20+', 'No wallet or tokens'],
  },
  {
    slug: 'render-a-triple',
    title: 'Turn a Triple Into Product UI',
    description:
      'Query a subject–predicate–object relationship and present its participants, provenance, and signal without losing context.',
    outcome: 'A reusable, evidence-aware claim card.',
    level: 'Beginner',
    duration: '45 min',
    stack: ['Next.js', 'GraphQL', 'TypeScript'],
    kind: 'Tutorial',
    status: 'planned',
    accent: 'purple',
    requires: ['Intuition Foundations', 'Atom Explorer quickstart'],
  },
  {
    slug: 'create-knowledge-on-testnet',
    title: 'Create Knowledge on Testnet',
    description:
      'Add wallet connectivity, check for existing atoms, and create a new atom and triple through the protocol safely.',
    outcome: 'A tested create flow with transaction feedback and duplicate checks.',
    level: 'Intermediate',
    duration: '75 min',
    stack: ['React', 'wagmi', 'viem'],
    kind: 'Project',
    status: 'planned',
    accent: 'yellow',
    requires: ['Atom Explorer quickstart', 'A disposable Testnet wallet'],
  },
  {
    slug: 'add-explainable-signaling',
    title: 'Add Explainable Signaling',
    description:
      'Let users support or oppose a term while clearly separating economic conviction from verification or truth.',
    outcome: 'A signal flow with previews, transaction states, and responsible labels.',
    level: 'Intermediate',
    duration: '70 min',
    stack: ['React', 'Intuition Protocol', 'viem'],
    kind: 'Project',
    status: 'planned',
    accent: 'mint',
    requires: ['Testnet create flow', 'Signals and Protocol Economics'],
  },
  {
    slug: 'agent-live-context',
    title: 'Give an Agent Live Intuition Context',
    description:
      'Connect an agent to runtime graph tools and make its evidence, uncertainty, and source trail inspectable.',
    outcome: 'An agent workflow that retrieves and cites live Intuition knowledge.',
    level: 'Advanced',
    duration: '90 min',
    stack: ['MCP', 'TypeScript', 'AI agent'],
    kind: 'AI workflow',
    status: 'planned',
    accent: 'purple',
    requires: ['Graph query experience', 'Basic agent-tool familiarity'],
  },
];

export function getBuildGuide(slug: string): BuildGuideCatalogItem | undefined {
  return buildGuideCatalog.find((guide) => guide.slug === slug);
}
