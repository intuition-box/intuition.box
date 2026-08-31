export interface EcosystemProject {
  slug: string;
  name: string;
  website: string;
  description: string;
  builder?: string;
  spotlight?: string;
  tags?: string[];
}

/**
 * Curated Intuition ecosystem projects. Keep this list in display order.
 * Optional editorial fields are included only when they are already backed by
 * an Intuition Box spotlight in this repository.
 */
export const ECOSYSTEM_PROJECTS: EcosystemProject[] = [
  {
    slug: 'sofia',
    name: 'Sofia',
    website: 'https://sofia.intuition.box/',
    description:
      'Save and certify useful pages, turning personal curation into shared, onchain intelligence.',
    builder: 'Samuel Chauche & Maxime Saint-Joannis',
    spotlight: '/spotlights/sofia',
    tags: ['Curation', 'Reputation', 'Browser'],
  },
  {
    slug: 'nexura',
    name: 'Nexura',
    website: 'https://nexura.intuition.box/',
    description:
      'Discover ecosystem apps, join quests, and turn participation into a rewarding daily habit.',
    builder: 'Reuben O. Christopher & Onuigbo Emmanuel',
    spotlight: '/spotlights/nexura',
    tags: ['Discovery', 'Quests', 'Engagement'],
  },
  {
    slug: 'inturank',
    name: 'IntuRank',
    website: 'https://inturank.intuition.box/',
    description:
      'Analyze knowledge-graph signals to rank identities and surface actionable credibility metrics.',
  },
  {
    slug: 'tns',
    name: 'TNS',
    website: 'https://tns.intuition.box/',
    description:
      'Register human-readable .trust names for wallets, profiles, apps, and other onchain resources.',
    builder: 'Oriola Samson Omobolaji',
    spotlight: '/spotlights/tns',
    tags: ['Identity', 'Names', 'Onchain'],
  },
  {
    slug: 'atlas',
    name: 'Atlas',
    website: 'https://atlas.box/',
    description:
      'A framework for communities to build and manage reputation across their shared spaces.',
  },
  {
    slug: 'hourglass',
    name: 'Hourglass',
    website: 'https://hourglass.box/',
    description:
      'Set up recurring onchain Safe payments with capped charges and IPFS-pinned agreements.',
  },
  {
    slug: 'ourglass',
    name: 'OurGlass',
    website: 'https://ourglass.intuition.box/',
    description:
      'Set up recurring onchain Safe payments with capped charges and IPFS-pinned agreements.',
  },
  {
    slug: 'ontology',
    name: 'Ontology',
    website: 'https://ontology.intuition.box/',
    description:
      'Explore entity schemas, predicate relationships, and build valid claims for the Intuition graph.',
  },
  {
    slug: 'hunch',
    name: 'Hunch',
    website: 'https://ideation.intuition.box/',
    description:
      'Turn raw hunches into structured ideas through AI brainstorming, GitHub proposals, and onchain attestations.',
  },
  {
    slug: 'collate',
    name: 'Collate',
    website: 'https://collate.intuition.box/',
    description:
      'Use review-first community tools to create atoms and curated lists on Intuition.',
  },
  {
    slug: 'graph',
    name: 'Graph',
    website: 'https://graph.intuition.box/',
    description:
      'Visualize and explore connections across the Intuition knowledge graph.',
  },
  {
    slug: 'pulse',
    name: 'Pulse',
    website: 'https://pulse.intuition.box/',
    description:
      'Take a position on what you believe and see where the wider community stands.',
  },
  {
    slug: 'mcp-playground',
    name: 'MCP Playground',
    website: 'https://mcp.intuition.box/',
    description:
      'Give AI agents natural-language access to onchain trust scores and reputation signals.',
    builder: 'Elijah Esin',
    spotlight: '/spotlights/mcp',
    tags: ['AI Agents', 'MCP', 'Trust'],
  },
  {
    slug: 'caveat-enforcers-registry',
    name: 'Caveat Enforcers Registry',
    website: 'https://caveat-enforcers-registry.vercel.app/',
    description:
      'Discover ERC-7710 caveat enforcers by purpose, chain, terms, and community evidence.',
  },
  {
    slug: 'agentid',
    name: 'AgentID',
    website: 'https://agentids.xyz/',
    description:
      'Register, stake on, and discover AI agents with portable identity and reputation on Intuition.',
  },
  {
    slug: 'trustnomiks',
    name: 'TrustNomiks',
    website: 'https://trustnomiks-app.vercel.app/',
    description:
      'Turn fragmented tokenomics into verifiable onchain claims curated through the Intuition graph.',
  },
  {
    slug: 'hive-mind',
    name: 'Hive Mind',
    website: 'https://hivemindhq.io/',
    description:
      'See reputation and context from the Intuition network while you browse the open web.',
    builder: 'Kylan Hurt',
    spotlight: '/spotlights/hivemind',
    tags: ['Reputation', 'Browser', 'Safety'],
  },
  {
    slug: 'signal-finder',
    name: 'Signal Finder',
    website: 'https://signal-finder.intuition.box/',
    description:
      'Track live staking velocity to find signals of emerging trust across Intuition.',
  },
  {
    slug: 'resonance',
    name: 'Resonance',
    website: 'https://resonance.intuition.box/',
    description:
      'Revisit ecosystem talks and AMAs through curated context, speakers, themes, and missions.',
  },
  {
    slug: 'intuition-reviews',
    name: 'Intuition Reviews',
    website: 'https://review.intuition.box/',
    description:
      'Review and discover dApps built on the Intuition network.',
  },
  {
    slug: 'quiz',
    name: 'Quiz',
    website: 'https://quiz.intuition.box/',
    description:
      'Test your Intuition knowledge with timed quizzes, difficulty levels, and a community leaderboard.',
  },
  {
    slug: 'pfp-generator',
    name: 'PFP Generator',
    website: 'https://pfp.intuition.box/',
    description:
      'Create a custom Intuition profile picture by adding branded frames to your image.',
  },
  {
    slug: 'banner',
    name: 'Banner',
    website: 'https://banner.intuition.box/',
    description:
      'Create downloadable $TRUST community banners sized for Discord and X.',
  },
];
