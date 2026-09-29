import type { LearnAccent } from './learn';

export type LearningPathStatus = 'available' | 'curriculum-preview';

export interface LearningPathCatalogItem {
  slug: string;
  title: string;
  description: string;
  audience: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  accent: LearnAccent;
  status: LearningPathStatus;
  duration?: string;
  stepCount?: number;
  outcome: string;
  courseSlugs: string[];
  learn: string[];
  build: string[];
  previewSteps: Array<{
    mode: 'Learn' | 'Explore' | 'Build';
    label: string;
  }>;
}

export const learningPathCatalog: LearningPathCatalogItem[] = [
  {
    slug: 'understand-intuition',
    title: 'Understand Intuition',
    description:
      'Build the complete mental model, inspect the live graph, and decide where your skills fit before writing code.',
    audience: 'New to Intuition',
    level: 'Beginner',
    accent: 'mint',
    status: 'available',
    duration: '3h 25m',
    stepCount: 15,
    outcome:
      'Explain Intuition clearly, evaluate a graph-shaped use case, and choose the right specialist path.',
    courseSlugs: ['intuition-foundations'],
    learn: [
      'Why Intuition exists',
      'Atoms, triples, context, and provenance',
      'Signals, vaults, incentives, and their limits',
      'Architecture and responsible product interpretation',
    ],
    build: [
      'Inspect a real atom and claim in the Portal',
      'Write an evidence-aware interpretation of signal',
      'Evaluate one idea with the Intuition use-case fit test',
    ],
    previewSteps: [
      { mode: 'Learn', label: 'Mental model' },
      { mode: 'Explore', label: 'Inspect the graph' },
      { mode: 'Explore', label: 'Choose your direction' },
    ],
  },
  {
    slug: 'build-an-intuition-app',
    title: 'Build an Intuition App',
    description:
      'Turn graph data and protocol actions into a trustworthy user-facing web application.',
    audience: 'Frontend and full-stack builders',
    level: 'Intermediate',
    accent: 'teal',
    status: 'curriculum-preview',
    outcome: 'Ship a Testnet application with graph reads, wallet UX, and protocol writes.',
    courseSlugs: [
      'intuition-foundations',
      'semantic-knowledge-graphs',
      'identity-trust-attestations',
    ],
    learn: ['Semantic graph modeling', 'Identity and contextual trust', 'Responsible signal UX'],
    build: ['GraphQL reads', 'SDK and wallet integration', 'Testnet deployment'],
    previewSteps: [
      { mode: 'Learn', label: 'Model the product' },
      { mode: 'Build', label: 'Read and write' },
      { mode: 'Build', label: 'Ship on Testnet' },
    ],
  },
  {
    slug: 'query-and-interpret-the-graph',
    title: 'Query and Interpret the Graph',
    description:
      'Build search, analytics, curation, and discovery products from indexed Intuition data.',
    audience: 'Data and backend builders',
    level: 'Intermediate',
    accent: 'purple',
    status: 'curriculum-preview',
    outcome: 'Ship a provenance-aware graph explorer, dashboard, or ranking system.',
    courseSlugs: [
      'intuition-foundations',
      'semantic-knowledge-graphs',
      'network-protocol-architecture',
    ],
    learn: ['Graph semantics and provenance', 'Indexing boundaries', 'Responsible aggregation'],
    build: ['GraphQL querying', 'Search and pagination', 'Ranking and analytics'],
    previewSteps: [
      { mode: 'Learn', label: 'Read the graph' },
      { mode: 'Build', label: 'Shape the data' },
      { mode: 'Build', label: 'Explain a ranking' },
    ],
  },
  {
    slug: 'integrate-intuition-onchain',
    title: 'Integrate Intuition Onchain',
    description:
      'Work with the deployed protocol through low-level TypeScript and Solidity interfaces.',
    audience: 'Smart contract builders',
    level: 'Advanced',
    accent: 'yellow',
    status: 'curriculum-preview',
    outcome: 'Build and test a contract-level integration against Intuition Testnet.',
    courseSlugs: [
      'intuition-foundations',
      'signals-protocol-economics',
      'network-protocol-architecture',
    ],
    learn: ['Protocol architecture', 'Vault and curve mechanics', 'Authority and security boundaries'],
    build: ['Protocol package and viem', 'MultiVault and events', 'Contract integration testing'],
    previewSteps: [
      { mode: 'Learn', label: 'Trace protocol state' },
      { mode: 'Build', label: 'Call contracts' },
      { mode: 'Build', label: 'Test the integration' },
    ],
  },
  {
    slug: 'build-agent-trust-systems',
    title: 'Build Agent Trust Systems',
    description:
      'Give AI applications live Intuition context and build explainable agent discovery or reputation experiences.',
    audience: 'AI and agent builders',
    level: 'Advanced',
    accent: 'purple',
    status: 'curriculum-preview',
    outcome: 'Ship an agent context or ERC-8004 trust integration with inspectable provenance.',
    courseSlugs: [
      'intuition-foundations',
      'ai-verifiable-knowledge',
      'identity-trust-attestations',
    ],
    learn: ['Agent identity and provenance', 'Verifiable knowledge', 'Contextual reputation'],
    build: ['Runtime MCP tools', 'Agent discovery', 'ERC-8004 trust assessment flows'],
    previewSteps: [
      { mode: 'Learn', label: 'Model agent trust' },
      { mode: 'Build', label: 'Connect live context' },
      { mode: 'Build', label: 'Explain reputation' },
    ],
  },
];

export function getLearningPath(slug: string): LearningPathCatalogItem | undefined {
  return learningPathCatalog.find((path) => path.slug === slug);
}

