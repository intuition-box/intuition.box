# Production Intuition Learn & Build Experience — V1

## Summary

Evolve the existing `/learn` demo into a production-quality learning platform for new Intuition builders.

The final experience has two equally important tracks:

1. **Learn the Protocol** — seven complete, first-class lessons.
2. **Build with Intuition** — an expanded Quickstart that moves from agent-assisted idea discovery to a simulated Testnet app flow.

The current Intuition Box shell remains intact: navigation, footer, dark theme, typography, mint accent, spacing system, motion primitives, and existing components are reused rather than replaced.

The implementation remains non-functional with respect to wallets and on-chain writes. The Intuition skill installation and read-only graph-discovery workflow are real and copyable; SDK and transaction behavior remain clearly labeled simulations.

## Information Architecture

### Learn overview

Keep `/learn` as the entry point. It should contain:

1. Learn hero and protocol graph visual.
2. Short explanation of the learning journey.
3. Seven-module editorial chapter rail.
4. Prominent “Build with Intuition” Quickstart preview.
5. Testnet safety notice.
6. Links to Docs and the full Quickstart route.

Add a dedicated `/learn/quickstart` route for the complete builder flow. `/learn` should contain a preview, while `/learn/quickstart` provides enough space for the full stepper, generated files, prompts, output, and checkpoints.

### Seven lessons

All seven lessons are published as complete, first-class routes. There is no flagship/secondary/coming-soon hierarchy.

| Order | Route | Lesson | Primary outcome |
|---|---|---|---|
| 1 | `/learn/what-is-intuition` | What Intuition is | Explain Intuition as shared knowledge infrastructure with signal. |
| 2 | `/learn/atoms` | Atoms as concepts and entities | Identify what should become a persistent protocol term. |
| 3 | `/learn/triples` | Triples as claims | Model relationships using subject, predicate, and object. |
| 4 | `/learn/signals-and-vaults` | Signals and vaults | Understand conviction, agreement, disagreement, and vault shares. |
| 5 | `/learn/what-this-makes-possible` | What this makes possible | Connect protocol primitives to real-world products and use cases. |
| 6 | `/learn/reading-the-graph` | Reading and writing the graph | Explore existing graph data and trace a first Testnet claim. |
| 7 | `/learn/small-app` | Building a small app | Turn graph concepts into a practical React/TypeScript product. |

The former “first Testnet claim” material becomes a major section inside lesson six rather than a separate eighth concept.

If existing MVP links reference `/learn/first-testnet-claim`, redirect them to `/learn/reading-the-graph`.

### Lesson structure

Every lesson follows the same production template:

1. Lesson header with title, summary, level, and estimated time.
2. Learning objectives.
3. Main MDX content.
4. One or more Intuition-native SVG graph diagrams.
5. Practical example or scenario.
6. Formative knowledge check.
7. Key takeaways.
8. Previous/next navigation.
9. Explicit completion action.

Lesson five intentionally reduces technical density. Each use case follows:

`real-world problem → graph model → role of signal → possible product`

Candidate scenarios include reputation, attestations, discovery, curation, community knowledge, agent coordination, and trust-aware marketplaces. These should be framed as product patterns or documented examples, not unsupported claims of live adoption.

## Visual Direction

Use the selected **Premium Curriculum** direction with the following concrete rules.

### Learn overview

- Use a large editorial hero with a responsive SVG graph showing concepts becoming relationships and signals.
- Present the seven lessons as a vertical chapter rail rather than a generic dashboard grid.
- Each chapter includes number, title, duration, level, outcome, concepts, and a small semantic visual marker.
- Use larger, more spacious scenario panels for “What this makes possible.”
- Keep graph lines and nodes as a recurring Intuition signature, not background decoration.

### Lesson pages

- Use a readable central article column.
- Add a desktop lesson rail containing objectives, table of contents, progress, and completion.
- Collapse the rail into a compact top section on mobile.
- Keep code and technical panels inside the article flow except where a split layout materially improves comprehension.
- Use SVG/CSS diagrams rather than bitmap or 3D assets.
- Do not introduce LMS conventions such as points, badges, streaks, or gamified rewards.

### Quickstart

Use a dedicated three-phase visual system:

- **Discover** — skill installation and app-idea exploration.
- **Build** — SDK installation, Testnet configuration, and graph modeling.
- **Signal** — atom, triple, vault, and app-state previews.

The main layout should include:

- a persistent step rail;
- a primary command/prompt/code panel;
- simulated terminal output;
- a checkpoint panel;
- clear labels for `Agent prompt`, `Shell command`, `Generated file`, `Read-only`, and `Simulated`;
- copy actions for every command, prompt, and code sample;
- a persistent Testnet/tTRUST safety indicator.

Motion should be calm and precise: progress transitions, section reveals, graph signal pulses, hover states, and copy feedback. Respect `prefers-reduced-motion`.

## Content and Data Architecture

Create a dedicated `content/learn/` MDX collection in `source.config.ts`, separate from the technical Docs collection.

Each lesson should support typed metadata:

```ts
type LearnLevel = "Beginner" | "Builder";

interface LearnLessonMeta {
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
```

All seven lessons should have published metadata and complete content. Do not add `coming-soon` states to the core syllabus.

Add reusable MDX components:

```ts
interface KnowledgeCheckOption {
  id: string;
  label: string;
}

interface KnowledgeCheckProps {
  id: string;
  prompt: string;
  options: readonly KnowledgeCheckOption[];
  answer: string;
  explanation: string;
}
```

Additional components:

- `GraphDiagram`
- `UseCaseScenario`
- `TestnetNotice`
- `QuickstartEmbed`
- `KnowledgeCheck`

Knowledge checks provide immediate feedback and retries. They are formative and never block lesson completion.

## Quickstart Flow and Contracts

The current six-step MVP flow should be expanded and reordered.

### Step 1 — Scaffold

```bash
npm create vite@latest first-intuition-app -- --template react-ts
cd first-intuition-app
```

Show the generated project tree and explain the role of `src/lib/intuition.ts` and `src/lib/first-claim.ts`.

### Step 2 — Install the Intuition skill

```bash
npx skills add 0xIntuition/agent-skills --skill intuition
```

The official [Intuition Agent Skills repository](https://github.com/0xIntuition/agent-skills) documents this installation flow and the `/intuition` invocation model.

The UI must explain:

- this installs an agent skill, not an npm package;
- it is used by compatible agents such as Codex or Claude Code;
- it provides verified protocol guidance;
- wallet infrastructure and signing remain the builder’s responsibility.

### Step 3 — Generate app ideas

Provide this copyable agent prompt:

```text
Use the installed Intuition skill in read-only mode on Intuition Testnet.

Explore the Testnet knowledge graph and propose five small, buildable app ideas.
For each idea, identify:
- the user problem;
- the atoms involved;
- the subject, predicate, and object structure;
- existing graph data or predicates worth reusing;
- what the app could read;
- where users could signal agreement or disagreement.

Do not create atoms, create triples, sign transactions, spend tTRUST, or use Mainnet.
```

The demo should show a typed static example response so the page remains non-functional, while the prompt itself remains genuinely runnable in an installed agent.

The output shape should be:

```ts
interface AppIdea {
  title: string;
  problem: string;
  graphPattern: string;
  reusableTerms: readonly string[];
  readPath: string;
  futureSignalPath: string;
}
```

### Step 4 — Select an idea

Let the user select one of the example ideas. The selected idea should populate the later simulated atom, triple, and UI examples.

No backend persistence is required; selection may remain local component state.

### Step 5 — Install SDK tooling

```bash
npm install @0xintuition/sdk viem
```

This must appear after skill installation and graph-idea discovery.

### Step 6 — Configure Testnet

Show:

- Intuition Testnet;
- chain ID `13579`;
- tTRUST;
- Testnet RPC;
- Testnet GraphQL endpoint;
- Testnet MultiVault address;
- custom viem chain configuration.

All examples must default to Testnet and must not imply mainnet readiness.

### Step 7 — Read before writing

Show the read-only workflow:

- search for existing atoms;
- resolve canonical predicates;
- avoid duplicate terms;
- use the graph endpoint;
- distinguish graph discovery from on-chain writes.

### Step 8 — Preview atom creation

Show:

- structured metadata/IPFS preparation;
- URI-to-bytes encoding;
- deterministic `bytes32` atom IDs;
- existence checks;
- simulated creation output.

### Step 9 — Preview triple creation and signal

Show:

- subject, predicate, and object;
- required existing atom IDs;
- triple ID;
- automatic counter-triple;
- creation costs;
- vault/share behavior;
- simulated tTRUST value;
- the need to preview fees and curve parameters before real execution.

### Step 10 — Render the app

Show the selected idea and claim rendered inside a small React interface, including:

- network label;
- claim state;
- atom/triple identifiers;
- simulated transaction state;
- future handoff to wallet-backed Testnet writes.

Represent each step with:

```ts
type QuickstartPhase = "discover" | "build" | "signal";
type QuickstartStepKind = "shell" | "agent-prompt" | "code" | "simulated";

interface QuickstartStep {
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
```

## Progress, State, and Safety

Persist anonymous lesson progress using:

```ts
interface LearnProgress {
  completedSlugs: string[];
  updatedAt: string;
}
```

Use `intuition-box:learn-progress:v1`.

Behavior:

- progress is local-only;
- completion is explicit;
- storage failure falls back to in-memory state;
- no account or wallet is required;
- reset progress is available;
- knowledge-check answers are not persisted;
- no analytics are added in this phase.

Every write-related Quickstart step must be labeled `Simulated`, `Wallet required later`, or equivalent. Read-only skill exploration must be labeled separately.

## Migration and Implementation Scope

Preserve the existing uncommitted MVP work and evolve it rather than replacing it destructively.

Implementation should:

- retain the existing `/learn` route and home-layout integration;
- expand `src/lib/learn.ts` into shared typed lesson/Quickstart data;
- add the MDX Learn collection and seven lesson files;
- refactor `LearnExperience` into reusable lesson and Quickstart components;
- preserve existing navigation, footer, homepage CTA, Testnet facts, and explorer links;
- add `/learn/quickstart`;
- add route compatibility for renamed lesson content;
- keep Docs as a separate complete-reference track;
- avoid adding wallet, RPC write, backend, CMS, analytics, or live code-editor infrastructure.

## Verification and Acceptance

Run:

```bash
npm run types:check
npm run build
```

Verify all of the following:

- all seven lesson routes load;
- each lesson contains complete content, diagrams, objectives, knowledge checks, and navigation;
- no module is visually treated as a flagship or placeholder;
- `/learn/quickstart` and the overview Quickstart preview work;
- the Intuition skill install command is copyable and accurately labeled;
- the app-ideas prompt is copyable and clearly identified as an agent prompt;
- SDK installation appears after skill installation and idea discovery;
- shell, agent, code, and simulated-output panels are visually distinct;
- selected app ideas flow through the later Quickstart steps;
- Testnet and tTRUST are consistently shown;
- mobile layouts stack without horizontal overflow;
- lesson rails collapse correctly;
- copy buttons provide confirmation and keyboard access;
- focus states, headings, contrast, and reduced-motion behavior are accessible;
- local progress survives reload and handles unavailable storage;
- external links, Docs links, and redirects do not produce dead ends.
