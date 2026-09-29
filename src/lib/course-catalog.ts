import type { LearnAccent } from './learn';

export type CourseStatus = 'available' | 'in-research';

export interface CourseModule {
  id: string;
  title: string;
  description: string;
}

export interface CourseCatalogItem {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessonCount: number;
  accent: LearnAccent;
  status: CourseStatus;
  category: string;
  tags: string[];
  prerequisites: string[];
  outcomes: string[];
  modules: CourseModule[];
  lastReviewed?: string;
}

export const courseCatalog: CourseCatalogItem[] = [
  {
    slug: 'intuition-foundations',
    title: 'Intuition Foundations',
    shortTitle: 'Foundations',
    description:
      'Build a durable mental model of Intuition: why it exists, how its knowledge graph works, and how economic signal turns information into programmable trust.',
    level: 'Beginner',
    duration: '2h 35m',
    lessonCount: 12,
    accent: 'mint',
    status: 'available',
    category: 'Foundations',
    tags: ['Primitives', 'Knowledge graphs', 'Trust'],
    prerequisites: [
      'No previous Intuition knowledge',
      'General familiarity with the internet and digital products',
      'No wallet, tokens, or programming required',
    ],
    outcomes: [
      'Explain the information problem Intuition is designed to solve',
      'Model entities and claims with atoms and triples',
      'Distinguish claims, provenance, and economic signal',
      'Reason about vaults, incentives, and canonical identifiers',
      'Evaluate whether a product idea is a strong fit for Intuition',
    ],
    modules: [
      {
        id: 'why-intuition',
        title: 'Why Intuition',
        description:
          'The information problem, Intuition’s thesis, and the system that turns attestations into shared infrastructure.',
      },
      {
        id: 'language-of-knowledge',
        title: 'The language of knowledge',
        description:
          'Atoms, triples, context, provenance, and the compositional model behind the graph.',
      },
      {
        id: 'economic-trust',
        title: 'Economic trust',
        description:
          'Signals, opposing positions, vaults, shares, incentives, and the limits of market-weighted information.',
      },
      {
        id: 'from-protocol-to-products',
        title: 'From protocol to products',
        description:
          'How applications interpret the graph, recognize good use cases, and design with the primitives responsibly.',
      },
    ],
    lastReviewed: '2026-08-14',
  },
  {
    slug: 'semantic-knowledge-graphs',
    title: 'Knowledge Graphs and Semantic Data',
    shortTitle: 'Semantic Knowledge Graphs',
    description:
      'Go deeper on identifiers, predicates, schemas, provenance, graph composition, canonicalization, and high-quality semantic modeling.',
    level: 'Intermediate',
    duration: '3h 10m',
    lessonCount: 14,
    accent: 'teal',
    status: 'in-research',
    category: 'Knowledge',
    tags: ['Semantics', 'Data modeling', 'Provenance'],
    prerequisites: ['Intuition Foundations or equivalent protocol knowledge'],
    outcomes: [
      'Design coherent atom and predicate systems',
      'Model contextual and nested claims',
      'Reduce fragmentation through reusable identifiers',
    ],
    modules: [
      { id: 'identifiers', title: 'Identity for anything', description: 'Identifiers, metadata, and canonical representation.' },
      { id: 'semantics', title: 'Semantic relationships', description: 'Predicates, schemas, context, and composition.' },
      { id: 'provenance', title: 'Provenance and interoperability', description: 'Attribution, reuse, and cross-application meaning.' },
      { id: 'graph-design', title: 'Designing durable graphs', description: 'Modeling tradeoffs, anti-patterns, and case studies.' },
    ],
  },
  {
    slug: 'identity-trust-attestations',
    title: 'Identity, Trust, and Attestations',
    shortTitle: 'Identity and Attestations',
    description:
      'Study portable identity, attributable claims, contextual reputation, subjective trust, credentials, and the design of verifiable social systems.',
    level: 'Intermediate',
    duration: '2h 45m',
    lessonCount: 12,
    accent: 'purple',
    status: 'in-research',
    category: 'Trust',
    tags: ['Identity', 'Attestations', 'Reputation'],
    prerequisites: ['Intuition Foundations or equivalent protocol knowledge'],
    outcomes: [
      'Separate identity, claims, evidence, and reputation',
      'Reason about contextual rather than universal trust',
      'Design portable attestation systems responsibly',
    ],
    modules: [
      { id: 'identity', title: 'Portable identity', description: 'Identifiers, ownership, and cross-platform identity.' },
      { id: 'attestations', title: 'Claims and attestations', description: 'Attribution, evidence, verification, and subjectivity.' },
      { id: 'reputation', title: 'Contextual reputation', description: 'Trust graphs, expertise, and composable scores.' },
      { id: 'systems', title: 'Trust system design', description: 'Credentials, social systems, and failure modes.' },
    ],
  },
  {
    slug: 'signals-protocol-economics',
    title: 'Signals and Protocol Economics',
    shortTitle: 'Signals and Economics',
    description:
      'Understand how positions, vaults, shares, bonding curves, fees, and incentive design coordinate attention and value across the graph.',
    level: 'Advanced',
    duration: '3h 20m',
    lessonCount: 14,
    accent: 'yellow',
    status: 'in-research',
    category: 'Economics',
    tags: ['Signals', 'Vaults', 'Bonding curves'],
    prerequisites: ['Intuition Foundations', 'Comfort with basic market concepts'],
    outcomes: [
      'Interpret signal and counter-signal without treating either as truth',
      'Explain vault share and bonding-curve mechanics',
      'Analyze incentive alignment and manipulation risks',
    ],
    modules: [
      { id: 'positions', title: 'Positions and conviction', description: 'Signal, opposition, relevance, and uncertainty.' },
      { id: 'vaults', title: 'Vaults and shares', description: 'Deposits, ownership, liquidity, and fees.' },
      { id: 'markets', title: 'Markets for information', description: 'Bonding curves, discovery, and coordination.' },
      { id: 'incentives', title: 'Incentive design', description: 'Canonicalization, attack surfaces, and responsible interpretation.' },
    ],
  },
  {
    slug: 'network-protocol-architecture',
    title: 'Intuition Network and Architecture',
    shortTitle: 'Network and Architecture',
    description:
      'Trace information through the Intuition L3, protocol contracts, indexing pipeline, GraphQL layer, and developer interfaces.',
    level: 'Intermediate',
    duration: '3h',
    lessonCount: 12,
    accent: 'mint',
    status: 'in-research',
    category: 'Architecture',
    tags: ['Network', 'Protocol', 'Indexing'],
    prerequisites: ['Intuition Foundations', 'Basic blockchain architecture knowledge'],
    outcomes: [
      'Explain the responsibility of each Intuition system layer',
      'Trace writes from transaction to indexed query',
      'Reason about authority, latency, and data integrity',
    ],
    modules: [
      { id: 'network', title: 'The Intuition Network', description: 'L3 architecture, settlement, availability, and EVM compatibility.' },
      { id: 'protocol', title: 'The protocol layer', description: 'Terms, MultiVault, events, and state.' },
      { id: 'indexing', title: 'Indexing and query', description: 'Event processing, the Rust subnet, and GraphQL.' },
      { id: 'interfaces', title: 'Developer interfaces', description: 'SDKs, contracts, authority, and system boundaries.' },
    ],
  },
  {
    slug: 'ai-verifiable-knowledge',
    title: 'AI Agents and Verifiable Knowledge',
    shortTitle: 'AI and Verifiable Knowledge',
    description:
      'Explore why agents need provenance and trust, how structured knowledge improves context, and how agent identity and reputation can become portable.',
    level: 'Intermediate',
    duration: '2h 50m',
    lessonCount: 12,
    accent: 'purple',
    status: 'in-research',
    category: 'AI',
    tags: ['AI agents', 'Provenance', 'MCP'],
    prerequisites: ['Intuition Foundations', 'Basic familiarity with AI agents'],
    outcomes: [
      'Explain the trust and provenance problem for agents',
      'Distinguish static skills, runtime tools, and graph knowledge',
      'Evaluate agent identity and reputation designs',
    ],
    modules: [
      { id: 'context', title: 'The context problem', description: 'Why models need structured, attributable knowledge.' },
      { id: 'agents', title: 'Agents as graph participants', description: 'Identity, claims, capabilities, and feedback.' },
      { id: 'interfaces', title: 'Skills and runtime tools', description: 'Agent Skills, MCP, and separation of knowledge from authority.' },
      { id: 'trust', title: 'Agent trust systems', description: 'Reputation, evaluation, provenance, and emerging standards.' },
    ],
  },
];

export function getCourse(slug: string): CourseCatalogItem | undefined {
  return courseCatalog.find((course) => course.slug === slug);
}
