export interface EcosystemProject {
  slug: string;
  name: string;
  website: string;
  description?: string;
  builder?: string;
  spotlight?: string;
  image?: string;
  imageAlt?: string;
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
    image: '/images/spotlights_sofia.jpg',
    imageAlt: 'Sofia product artwork',
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
    image: '/images/spotlights_nexura.jpg',
    imageAlt: 'Nexura product artwork',
    tags: ['Discovery', 'Quests', 'Engagement'],
  },
  {
    slug: 'inturank',
    name: 'IntuRank',
    website: 'https://inturank.intuition.box/',
  },
  {
    slug: 'tns',
    name: 'TNS',
    website: 'https://tns.intuition.box/',
    description:
      'Register human-readable .trust names for wallets, profiles, apps, and other onchain resources.',
    builder: 'Oriola Samson Omobolaji',
    spotlight: '/spotlights/tns',
    image: '/images/spotlights_tns.jpg',
    imageAlt: 'Trust Name Service product artwork',
    tags: ['Identity', 'Names', 'Onchain'],
  },
  { slug: 'atlas', name: 'Atlas', website: 'https://atlas.box/' },
  { slug: 'hourglass', name: 'Hourglass', website: 'https://hourglass.box/' },
  {
    slug: 'ourglass',
    name: 'OurGlass',
    website: 'https://ourglass.intuition.box/',
  },
  {
    slug: 'ontology',
    name: 'Ontology',
    website: 'https://ontology.intuition.box/',
  },
  {
    slug: 'hunch',
    name: 'Hunch',
    website: 'https://ideation.intuition.box/',
  },
  {
    slug: 'collate',
    name: 'Collate',
    website: 'https://collate.intuition.box/',
  },
  {
    slug: 'graph',
    name: 'Graph',
    website: 'https://graph.intuition.box/',
  },
  {
    slug: 'pulse',
    name: 'Pulse',
    website: 'https://pulse.intuition.box/',
  },
  {
    slug: 'mcp-playground',
    name: 'MCP Playground',
    website: 'https://mcp.intuition.box/',
    description:
      'Give AI agents natural-language access to onchain trust scores and reputation signals.',
    builder: 'Elijah Esin',
    spotlight: '/spotlights/mcp',
    image: '/images/spotlights_mcp.png',
    imageAlt: 'MCP Playground product artwork',
    tags: ['AI Agents', 'MCP', 'Trust'],
  },
  {
    slug: 'caveat-enforcers-registry',
    name: 'Caveat Enforcers Registry',
    website: 'https://caveat-enforcers-registry.vercel.app/',
  },
  { slug: 'agentid', name: 'AgentID', website: 'https://agentids.xyz/' },
  {
    slug: 'trustnomiks',
    name: 'TrustNomiks',
    website: 'https://trustnomiks-app.vercel.app/',
  },
  {
    slug: 'hive-mind',
    name: 'Hive Mind',
    website: 'https://hivemindhq.io/',
    description:
      'See reputation and context from the Intuition network while you browse the open web.',
    builder: 'Kylan Hurt',
    spotlight: '/spotlights/hivemind',
    image: '/images/spotlights_hive_mind.png',
    imageAlt: 'Hive Mind product artwork',
    tags: ['Reputation', 'Browser', 'Safety'],
  },
  {
    slug: 'signal-finder',
    name: 'Signal Finder',
    website: 'https://signal-finder.intuition.box/',
  },
  {
    slug: 'resonance',
    name: 'Resonance',
    website: 'https://resonance.intuition.box/',
  },
  {
    slug: 'intuition-reviews',
    name: 'Intuition Reviews',
    website: 'https://review.intuition.box/',
  },
  {
    slug: 'quiz',
    name: 'Quiz',
    website: 'https://quiz.intuition.box/',
  },
  {
    slug: 'pfp-generator',
    name: 'PFP Generator',
    website: 'https://pfp.intuition.box/',
  },
  {
    slug: 'banner',
    name: 'Banner',
    website: 'https://banner.intuition.box/',
  },
];
