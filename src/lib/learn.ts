export type LearnLevel = 'Beginner' | 'Builder';

export interface LearnLessonMeta {
  slug: string;
  order: number;
  title: string;
  description: string;
  level: LearnLevel;
  durationMinutes: number;
  objectives: readonly string[];
  concepts: readonly string[];
  outcome: string;
}

export interface LearnLessonSummary extends LearnLessonMeta {
  href: string;
  number: string;
}

export interface KnowledgeCheckOption {
  id: string;
  label: string;
}

export interface KnowledgeCheckProps {
  id: string;
  prompt: string;
  options: readonly KnowledgeCheckOption[];
  answer: string;
  explanation: string;
}

export interface AppIdea {
  title: string;
  problem: string;
  graphPattern: string;
  reusableTerms: readonly string[];
  readPath: string;
  futureSignalPath: string;
}

export type QuickstartPhase = 'discover' | 'build' | 'signal';
export type QuickstartStepKind =
  | 'shell'
  | 'agent-prompt'
  | 'code'
  | 'simulated';

export interface QuickstartStep {
  id: string;
  phase: QuickstartPhase;
  kind: QuickstartStepKind;
  title: string;
  summary: string;
  command?: string;
  prompt?: string;
  file?: string;
  code?: string;
  output: string;
  checkpoint: string;
  walletRequired: boolean;
}

export interface LearnProgress {
  completedSlugs: string[];
  updatedAt: string;
}

export type GraphDiagramKind =
  | 'overview'
  | 'atom'
  | 'triple'
  | 'signal'
  | 'use-case'
  | 'read-write'
  | 'small-app';

export interface LearnNetwork {
  name: string;
  chainId: number;
  symbol: string;
  multiVault: string;
  rpcUrl: string;
  graphUrl: string;
  explorerUrl: string;
}

export const learnProgressStorageKey = 'intuition-box:learn-progress:v1';

export const intuitionTestnetLearnNetwork: LearnNetwork = {
  name: 'Intuition Testnet',
  chainId: 13579,
  symbol: 'tTRUST',
  multiVault: '0x2Ece8D4dEdcB9918A398528f3fa4688b1d2CAB91',
  rpcUrl: 'https://testnet.rpc.intuition.systems/http',
  graphUrl: 'https://testnet.intuition.sh/v1/graphql',
  explorerUrl: 'https://testnet.explorer.intuition.systems',
};

export const agentIdeaPrompt = [
  'Use the installed Intuition skill in read-only mode on Intuition Testnet.',
  '',
  'Explore the Testnet knowledge graph and propose five small, buildable app ideas.',
  'For each idea, identify:',
  '- the user problem;',
  '- the atoms involved;',
  '- the subject, predicate, and object structure;',
  '- existing graph data or predicates worth reusing;',
  '- what the app could read;',
  '- where users could signal agreement or disagreement.',
  '',
  'Do not create atoms, create triples, sign transactions, spend tTRUST, or use Mainnet.',
].join('\n');

export const appIdeas = [
  {
    title: 'Builder Stack Mapper',
    problem:
      'New builders cannot quickly see which projects, tools, and SDKs are already connected in the ecosystem.',
    graphPattern: 'Builder project → uses → Intuition SDK',
    reusableTerms: ['uses', 'Intuition SDK', 'React'],
    readPath:
      'Read projects connected through “uses” and group them by reusable tooling.',
    futureSignalPath:
      'Builders could signal that an integration is useful, current, or well documented.',
  },
  {
    title: 'Agent Capability Registry',
    problem:
      'People need a structured way to discover agents by capability instead of relying on self-written profile text.',
    graphPattern: 'Research agent → provides capability → Graph discovery',
    reusableTerms: ['provides capability', 'AI agent', 'Graph discovery'],
    readPath:
      'Read capability claims for agents and trace supporting or opposing signal.',
    futureSignalPath:
      'Users could signal whether an agent reliably demonstrates the claimed capability.',
  },
  {
    title: 'Community Resource Curator',
    problem:
      'Useful onboarding guides are scattered, duplicated, and difficult to rank for a particular audience.',
    graphPattern: 'Builder guide → recommended for → New Intuition builders',
    reusableTerms: ['recommended for', 'guide', 'Intuition builders'],
    readPath:
      'Read resources, intended audiences, and the signal attached to each recommendation.',
    futureSignalPath:
      'Readers could support recommendations that helped them reach a working integration.',
  },
  {
    title: 'Trust-aware Service Directory',
    problem:
      'Teams evaluating protocol specialists have little portable context about services and completed work.',
    graphPattern: 'Protocol studio → delivers → Intuition integration',
    reusableTerms: ['delivers', 'service provider', 'Intuition integration'],
    readPath:
      'Read delivery claims and connected project atoms before displaying a provider profile.',
    futureSignalPath:
      'Clients could signal agreement or disagreement with individual delivery claims.',
  },
  {
    title: 'Open Source Dependency Map',
    problem:
      'Developers cannot easily follow which ecosystem applications depend on the same protocol packages.',
    graphPattern: 'Open source app → depends on → Intuition SDK',
    reusableTerms: ['depends on', 'open source', 'Intuition SDK'],
    readPath:
      'Traverse dependency triples to show projects connected to an SDK or shared library.',
    futureSignalPath:
      'Maintainers could signal that a dependency claim is current or needs revision.',
  },
] as const satisfies readonly AppIdea[];

export const quickstartSteps = [
  {
    id: 'scaffold',
    phase: 'discover',
    kind: 'shell',
    title: 'Scaffold the starter',
    summary:
      'Create a plain React and TypeScript app so the graph model stays visible.',
    command: [
      'npm create vite@latest first-intuition-app -- --template react-ts',
      'cd first-intuition-app',
    ].join('\n'),
    file: 'Generated project',
    code: [
      'first-intuition-app/',
      '  src/',
      '    App.tsx',
      '    lib/',
      '      intuition.ts',
      '      first-claim.ts',
      '  package.json',
    ].join('\n'),
    output: [
      'Created first-intuition-app',
      'Template: react-ts',
      'No protocol or wallet code has run.',
    ].join('\n'),
    checkpoint:
      'You have a small local shell with dedicated files for network setup and the first claim.',
    walletRequired: false,
  },
  {
    id: 'install-skill',
    phase: 'discover',
    kind: 'shell',
    title: 'Install the Intuition skill',
    summary:
      'Give a compatible coding agent verified protocol guidance before asking it to explore.',
    command: 'npx skills add 0xintuition/agent-skills --skill intuition',
    file: 'Agent capability',
    code: [
      'Installs: an agent skill',
      'Does not install: an npm package',
      'Works with: Codex, Claude Code, compatible agents',
      'Still required later: wallet infrastructure and signing',
    ].join('\n'),
    output: [
      'Skill: intuition',
      'Mode for this guide: read-only',
      'Transactions generated: 0',
    ].join('\n'),
    checkpoint:
      'Your agent can reason with verified V2 contract and graph rules without receiving wallet authority.',
    walletRequired: false,
  },
  {
    id: 'generate-ideas',
    phase: 'discover',
    kind: 'agent-prompt',
    title: 'Generate app ideas',
    summary:
      'Ask the installed skill to inspect Testnet graph structure and return small product opportunities.',
    prompt: agentIdeaPrompt,
    file: 'Static example response',
    code: [
      '1. Builder Stack Mapper',
      '2. Agent Capability Registry',
      '3. Community Resource Curator',
      '4. Trust-aware Service Directory',
      '5. Open Source Dependency Map',
    ].join('\n'),
    output: [
      'Read-only exploration requested',
      'Network constrained to Testnet',
      'Five typed app ideas returned',
    ].join('\n'),
    checkpoint:
      'You have ideas grounded in atoms, triples, reusable terms, and a clear read path.',
    walletRequired: false,
  },
  {
    id: 'select-idea',
    phase: 'discover',
    kind: 'simulated',
    title: 'Select an idea',
    summary:
      'Choose one model and carry it through every later atom, triple, and interface preview.',
    file: 'Selected graph model',
    code: [
      'Product: {{title}}',
      '',
      'Subject:   {{subject}}',
      'Predicate: {{predicate}}',
      'Object:    {{object}}',
      '',
      'Claim: {{graphPattern}}',
    ].join('\n'),
    output: [
      'Selected: {{title}}',
      'Reusable terms: {{reusableTerms}}',
      'No graph write performed.',
    ].join('\n'),
    checkpoint:
      'The rest of the Quickstart now uses one concrete product and one consistent claim.',
    walletRequired: false,
  },
  {
    id: 'install-sdk',
    phase: 'build',
    kind: 'shell',
    title: 'Install SDK tooling',
    summary:
      'Add the high-level Intuition SDK and its viem peer dependency after the graph model is clear.',
    command: 'npm install @0xintuition/sdk@latest viem@latest',
    file: 'package.json',
    code: [
      '{',
      '  \"dependencies\": {',
      '    \"@0xintuition/sdk\": \"latest\",',
      '    \"viem\": \"latest\"',
      '  }',
      '}',
    ].join('\n'),
    output: [
      'Installed @0xintuition/sdk',
      'Installed viem',
      'Target architecture: Intuition V2',
    ].join('\n'),
    checkpoint:
      'The starter has the client and protocol helpers required for a future Testnet integration.',
    walletRequired: false,
  },
  {
    id: 'configure-testnet',
    phase: 'build',
    kind: 'code',
    title: 'Configure Testnet',
    summary:
      'Make the development boundary explicit with a custom viem chain and public client.',
    file: 'src/lib/intuition.ts',
    code: [
      "import { defineChain, createPublicClient, http } from 'viem';",
      '',
      'export const intuitionTestnet = defineChain({',
      '  id: 13579,',
      "  name: 'Intuition Testnet',",
      "  nativeCurrency: { decimals: 18, name: 'Test Trust', symbol: 'tTRUST' },",
      "  rpcUrls: { default: { http: ['https://testnet.rpc.intuition.systems/http'] } },",
      "  blockExplorers: { default: { name: 'Explorer', url: 'https://testnet.explorer.intuition.systems' } },",
      '});',
      '',
      'export const publicClient = createPublicClient({',
      '  chain: intuitionTestnet,',
      '  transport: http(),',
      '});',
      '',
      "export const multiVault = '0x2Ece8D4dEdcB9918A398528f3fa4688b1d2CAB91';",
    ].join('\n'),
    output: [
      'Network: Intuition Testnet',
      'Chain ID: 13579',
      'Currency: tTRUST',
      'Wallet client: not configured',
    ].join('\n'),
    checkpoint:
      'Every later example is bound to Testnet and cannot silently imply Mainnet readiness.',
    walletRequired: false,
  },
  {
    id: 'read-before-writing',
    phase: 'build',
    kind: 'code',
    title: 'Read before writing',
    summary:
      'Search by label, resolve canonical term IDs, and reuse established predicates before preparing new data.',
    file: 'src/lib/first-claim.ts',
    code: [
      "const GRAPHQL = 'https://testnet.intuition.sh/v1/graphql';",
      '',
      "const query = 'query FindPredicate($label: String!) { atoms(where: { label: { _eq: $label } }) { term_id label type } }';",
      '',
      '// Treat labels as display text. term_id is the canonical identity.',
      '// Order matching predicates by usage and prefer structured, non-TextObject terms.',
    ].join('\n'),
    output: [
      'Discovery layer: public GraphQL',
      'Canonical anchor: bytes32 term_id',
      'On-chain writes: none',
    ].join('\n'),
    checkpoint:
      'You can distinguish graph discovery from the revalidated, wallet-backed write path that would follow.',
    walletRequired: false,
  },
  {
    id: 'preview-atom',
    phase: 'signal',
    kind: 'simulated',
    title: 'Preview atom creation',
    summary:
      'Prepare structured metadata, encode its IPFS URI, calculate the deterministic ID, and stop before writing.',
    file: 'src/lib/first-claim.ts',
    code: [
      "import { stringToHex } from 'viem';",
      '',
      'const metadata = {',
      "  name: '{{subject}}',",
      "  description: 'Subject atom for {{title}}',",
      "  image: '',",
      "  url: '',",
      '};',
      '',
      "const ipfsUri = 'ipfs://bafy...'; // returned by pinThing",
      'const atomData = stringToHex(ipfsUri);',
      '',
      '// calculateAtomId(atomData)',
      '// isTermCreated(atomId)',
      '// A real createAtoms call requires current cost, simulation, and a wallet.',
    ].join('\n'),
    output: [
      'Simulated atom preview',
      'label: {{subject}}',
      'metadata: prepared for IPFS',
      'termId: 0x8f1c...42aa',
      'Transaction broadcast: no',
    ].join('\n'),
    checkpoint:
      'The subject is modeled as a persistent term without creating a duplicate or requesting a signature.',
    walletRequired: true,
  },
  {
    id: 'preview-triple',
    phase: 'signal',
    kind: 'simulated',
    title: 'Preview triple and signal',
    summary:
      'Connect three existing atom IDs, inspect the counter-triple, and preview configurable costs and shares.',
    file: 'src/lib/first-claim.ts',
    code: [
      'const claim = {',
      "  subjectId: '0x8f1c...42aa', // {{subject}}",
      "  predicateId: '0xa137...10ce', // {{predicate}}",
      "  objectId: '0x42bb...7d91', // {{object}}",
      '};',
      '',
      '// calculateTripleId(subjectId, predicateId, objectId)',
      '// isTermCreated(tripleId)',
      '// getTripleCost() and getBondingCurveConfig()',
      '// previewTripleCreate(tripleId, assets)',
      '// createTriples uses four matching single-item arrays.',
      '// The counter-triple is created automatically.',
    ].join('\n'),
    output: [
      'Simulated triple preview',
      'claim: {{graphPattern}}',
      'tripleId: 0xb6d2...91ef',
      'counterTripleId: 0x64af...108c',
      'simulated value: 0.1 tTRUST',
      'Transaction broadcast: no',
    ].join('\n'),
    checkpoint:
      'You understand the safe write sequence: revalidate, query costs and curve, preview, simulate, then request signing.',
    walletRequired: true,
  },
  {
    id: 'render-app',
    phase: 'signal',
    kind: 'code',
    title: 'Render the app',
    summary:
      'Turn the selected graph model into a small interface with honest simulated transaction state.',
    file: 'src/App.tsx',
    code: [
      "import { useState } from 'react';",
      '',
      'export default function App() {',
      "  const [state, setState] = useState<'idle' | 'previewed'>('idle');",
      '',
      '  return (',
      '    <main>',
      '      <p>Intuition Testnet · tTRUST</p>',
      '      <h1>{{title}}</h1>',
      '      <p>{{graphPattern}}</p>',
      "      <button onClick={() => setState('previewed')}>",
      '        Preview claim',
      '      </button>',
      "      {state === 'previewed' && <p>Triple 0xb6d2...91ef · simulated</p>}",
      '    </main>',
      '  );',
      '}',
    ].join('\n'),
    output: [
      'Local product preview ready',
      'Idea: {{title}}',
      'Network: Intuition Testnet',
      'Claim state: simulated',
      'Wallet action: none',
    ].join('\n'),
    checkpoint:
      'You have moved from an idea to a legible graph model and product surface, ready for a future wallet-backed Testnet pass.',
    walletRequired: false,
  },
] as const satisfies readonly QuickstartStep[];

export interface IdeaTerms {
  subject: string;
  predicate: string;
  object: string;
}

export function getIdeaTerms(idea: AppIdea): IdeaTerms {
  const [subject, predicate, object] = idea.graphPattern
    .split('→')
    .map((term) => term.trim());

  return {
    subject: subject || idea.title,
    predicate: predicate || 'relates to',
    object: object || 'Intuition Protocol',
  };
}

export function applyIdeaTemplate(value: string, idea: AppIdea): string {
  const terms = getIdeaTerms(idea);

  return value
    .replaceAll('{{title}}', idea.title)
    .replaceAll('{{graphPattern}}', idea.graphPattern)
    .replaceAll('{{reusableTerms}}', idea.reusableTerms.join(', '))
    .replaceAll('{{subject}}', terms.subject)
    .replaceAll('{{predicate}}', terms.predicate)
    .replaceAll('{{object}}', terms.object);
}

export function hydrateQuickstartStep(
  step: QuickstartStep,
  idea: AppIdea,
): QuickstartStep {
  return {
    ...step,
    command: step.command ? applyIdeaTemplate(step.command, idea) : undefined,
    prompt: step.prompt ? applyIdeaTemplate(step.prompt, idea) : undefined,
    code: step.code ? applyIdeaTemplate(step.code, idea) : undefined,
    output: applyIdeaTemplate(step.output, idea),
    checkpoint: applyIdeaTemplate(step.checkpoint, idea),
  };
}
