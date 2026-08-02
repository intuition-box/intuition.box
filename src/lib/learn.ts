export interface LearnModule {
  id: string;
  number: string;
  title: string;
  duration: string;
  level: string;
  description: string;
  outcome: string;
  concepts: readonly string[];
}

export interface QuickstartStep {
  id: string;
  number: string;
  title: string;
  eyebrow: string;
  summary: string;
  command: string;
  file: string;
  code: string;
  output: string;
  checkpoint: string;
}

export interface LearnNetwork {
  name: string;
  chainId: number;
  symbol: string;
  multiVault: string;
  rpcUrl: string;
  graphUrl: string;
  explorerUrl: string;
}

export const intuitionTestnetLearnNetwork: LearnNetwork = {
  name: 'Intuition Testnet',
  chainId: 13579,
  symbol: 'tTRUST',
  multiVault: '0x2Ece8D4dEdcB9918A398528f3fa4688b1d2CAB91',
  rpcUrl: 'https://testnet.rpc.intuition.systems/http',
  graphUrl: 'https://testnet.intuition.sh/v1/graphql',
  explorerUrl: 'https://testnet.explorer.intuition.systems',
};

export const syllabusModules = [
  {
    id: 'what-is-intuition',
    number: '01',
    title: 'What Intuition is',
    duration: '6 min',
    level: 'Beginner',
    description:
      'Understand Intuition as shared infrastructure for creating, discovering, and signaling around knowledge.',
    outcome:
      'You can explain why Intuition is a knowledge graph with economic signal, not just another app database.',
    concepts: ['knowledge graph', 'claims', 'signal', 'builder surface'],
  },
  {
    id: 'atoms',
    number: '02',
    title: 'Atoms as concepts and entities',
    duration: '8 min',
    level: 'Beginner',
    description:
      'Learn how atoms give people, projects, URLs, accounts, labels, and ideas persistent identifiers.',
    outcome:
      'You can identify what should become an atom before you write protocol data.',
    concepts: ['atom IDs', 'IPFS metadata', 'CAIP-10 accounts', 'global dictionary'],
  },
  {
    id: 'triples',
    number: '03',
    title: 'Triples as claims',
    duration: '8 min',
    level: 'Beginner',
    description:
      'Build claims from three atoms: subject, predicate, and object. The graph becomes useful when claims connect.',
    outcome:
      'You can model a first claim such as “My app integrates Intuition” as a protocol triple.',
    concepts: ['subject', 'predicate', 'object', 'counter-triple'],
  },
  {
    id: 'signals-and-vaults',
    number: '04',
    title: 'Signals and vaults',
    duration: '7 min',
    level: 'Beginner',
    description:
      'See how vaults let builders and users put weight behind atoms and claims with TRUST or tTRUST.',
    outcome:
      'You understand why signal gives graph data a useful confidence layer.',
    concepts: ['vaults', 'shares', 'agreement', 'disagreement'],
  },
  {
    id: 'reading-the-graph',
    number: '05',
    title: 'Reading the graph',
    duration: '10 min',
    level: 'Builder',
    description:
      'Query existing atoms and triples before writing new data so apps reuse canonical graph context.',
    outcome:
      'You can search the graph and decide whether to reuse or create terms.',
    concepts: ['GraphQL', 'canonical predicates', 'reuse before create', 'explorer'],
  },
  {
    id: 'first-testnet-claim',
    number: '06',
    title: 'Writing your first Testnet claim',
    duration: '12 min',
    level: 'Builder',
    description:
      'Preview the safe write path on Intuition Testnet using tTRUST: prepare atoms, create a triple, and inspect the result.',
    outcome:
      'You can trace the exact app flow for a first atom plus triple without touching mainnet funds.',
    concepts: ['testnet', 'wallet client', 'SDK write', 'transaction preview'],
  },
  {
    id: 'small-app',
    number: '07',
    title: 'Building a small app',
    duration: '15 min',
    level: 'Builder',
    description:
      'Turn the protocol flow into a small React app with clear states, copyable snippets, and a path to production.',
    outcome:
      'You leave with a starter structure that can become a real Intuition-powered product.',
    concepts: ['React', 'TypeScript', 'viem', 'production handoff'],
  },
] as const satisfies readonly LearnModule[];

export const quickstartSteps = [
  {
    id: 'scaffold',
    number: '01',
    title: 'Scaffold the starter',
    eyebrow: 'Local app',
    summary:
      'Start with a plain React + TypeScript app so the protocol concepts stay visible.',
    command: [
      'npm create vite@latest first-intuition-app -- --template react-ts',
      'cd first-intuition-app',
    ].join('\n'),
    file: 'project tree',
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
      'Next checkpoint: install the Intuition SDK',
    ].join('\n'),
    checkpoint: 'You have a minimal app shell ready for protocol code.',
  },
  {
    id: 'install-sdk',
    number: '02',
    title: 'Install the SDK',
    eyebrow: 'Protocol tooling',
    summary:
      'Use the high-level Intuition SDK plus viem, the wallet/client layer it builds on.',
    command: 'npm install @0xintuition/sdk@latest viem@latest',
    file: 'package.json',
    code: [
      '{',
      '  "dependencies": {',
      '    "@0xintuition/sdk": "latest",',
      '    "viem": "latest"',
      '  }',
      '}',
    ].join('\n'),
    output: [
      'Installed @0xintuition/sdk',
      'Installed viem',
      'SDK target: v2 Intuition contracts',
    ].join('\n'),
    checkpoint: 'The app can import Intuition network helpers and SDK actions.',
  },
  {
    id: 'configure-testnet',
    number: '03',
    title: 'Configure Testnet',
    eyebrow: 'Safe default',
    summary:
      'Keep first-builder education on Intuition Testnet with tTRUST and the Testnet MultiVault.',
    command: 'mkdir src/lib',
    file: 'src/lib/intuition.ts',
    code: [
      "import { getMultiVaultAddressFromChainId, intuitionTestnet } from '@0xintuition/sdk';",
      "import { createPublicClient, http } from 'viem';",
      '',
      'export const publicClient = createPublicClient({',
      '  chain: intuitionTestnet,',
      '  transport: http(),',
      '});',
      '',
      'export const multiVaultAddress = getMultiVaultAddressFromChainId(',
      '  intuitionTestnet.id,',
      ');',
      '',
      'export const networkLabel = `${intuitionTestnet.name} · tTRUST`;',
    ].join('\n'),
    output: [
      'Network: Intuition Testnet',
      'Chain ID: 13579',
      'Currency: tTRUST',
    ].join('\n'),
    checkpoint: 'All examples now point at Testnet instead of mainnet.',
  },
  {
    id: 'create-atom',
    number: '04',
    title: 'Preview the first atom',
    eyebrow: 'Concept',
    summary:
      'Create the app or idea as an atom before connecting it to other claims.',
    command: 'touch src/lib/first-claim.ts',
    file: 'src/lib/first-claim.ts',
    code: [
      "import type { WalletClient } from 'viem';",
      "import { createAtomFromString } from '@0xintuition/sdk';",
      "import { multiVaultAddress, publicClient } from './intuition';",
      '',
      'export async function createProjectAtom(walletClient: WalletClient) {',
      '  return createAtomFromString(',
      '    { walletClient, publicClient, address: multiVaultAddress },',
      "    'My first Intuition builder app',",
      '  );',
      '}',
    ].join('\n'),
    output: [
      'Simulated atom preview',
      'label: My first Intuition builder app',
      'termId: 0x8f1c...42aa',
    ].join('\n'),
    checkpoint: 'The builder sees atoms as stable identifiers for app concepts.',
  },
  {
    id: 'create-triple',
    number: '05',
    title: 'Preview the first triple',
    eyebrow: 'Claim',
    summary:
      'Use subject, predicate, and object atoms to write the first protocol-backed claim.',
    command: 'npm run dev',
    file: 'src/lib/first-claim.ts',
    code: [
      "import type { WalletClient } from 'viem';",
      "import { createAtomFromString, createTripleStatement } from '@0xintuition/sdk';",
      "import { multiVaultAddress, publicClient } from './intuition';",
      '',
      'export async function createFirstClaim(walletClient: WalletClient) {',
      '  const clients = { walletClient, publicClient, address: multiVaultAddress };',
      '',
      "  const subject = await createAtomFromString(clients, 'My first Intuition builder app');",
      "  const predicate = await createAtomFromString(clients, 'integrates');",
      "  const object = await createAtomFromString(clients, 'Intuition Protocol');",
      '',
      '  return createTripleStatement(clients, {',
      '    args: [subject.state.termId, predicate.state.termId, object.state.termId],',
      '    value: 100000000000000000n,',
      '  });',
      '}',
    ].join('\n'),
    output: [
      'Simulated triple preview',
      'claim: My first Intuition builder app → integrates → Intuition Protocol',
      'deposit: 0.1 tTRUST',
      'tripleId: 0xb6d2...91ef',
    ].join('\n'),
    checkpoint: 'The builder understands the first atom + triple write path.',
  },
  {
    id: 'render-app',
    number: '06',
    title: 'Render the app state',
    eyebrow: 'Product surface',
    summary:
      'Expose the protocol result in a small UI so the starter feels like an app, not a script.',
    command: 'npm run dev',
    file: 'src/App.tsx',
    code: [
      "import { useState } from 'react';",
      "import { networkLabel } from './lib/intuition';",
      '',
      'export default function App() {',
      "  const [claimState, setClaimState] = useState<'idle' | 'previewed'>('idle');",
      '',
      '  return (',
      '    <main>',
      '      <p>{networkLabel}</p>',
      '      <button onClick={() => setClaimState(\'previewed\')}>',
      '        Preview first claim',
      '      </button>',
      "      {claimState === 'previewed' && (",
      '        <p>My builder app integrates Intuition Protocol</p>',
      '      )}',
      '    </main>',
      '  );',
      '}',
    ].join('\n'),
    output: [
      'Local app ready',
      'No wallet action required for this demo',
      'Next step: replace preview state with wallet-backed Testnet writes',
    ].join('\n'),
    checkpoint: 'The pitch demo ends with a clear handoff to a real Testnet app.',
  },
] as const satisfies readonly QuickstartStep[];
