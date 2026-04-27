import 'server-only';

import { unstable_cache } from 'next/cache';
import { githubGraphQL, hasGitHubToken } from './client';

export interface Mission {
  id: string;
  databaseId?: number;
  title: string;
  status: string;
  priority?: string;
  url?: string;
  body?: string;
  labels: Array<{ name: string }>;
  assignees: Array<{ login: string }>;
  number?: number;
}

// ── GraphQL response shapes ──────────────────────────────────────────

interface ProjectV2FieldRef {
  name?: string;
}

interface ProjectV2ItemFieldTextValue {
  text?: string;
  field?: ProjectV2FieldRef;
}

interface ProjectV2ItemFieldSingleSelectValue {
  name?: string;
  field?: ProjectV2FieldRef;
}

type ProjectV2ItemFieldValue =
  | ProjectV2ItemFieldTextValue
  | ProjectV2ItemFieldSingleSelectValue
  | Record<string, never>;

interface ProjectV2IssueContent {
  title?: string;
  url?: string;
  number?: number;
  body?: string | null;
  labels?: { nodes: Array<{ name: string }> };
  assignees?: { nodes: Array<{ login: string }> };
}

interface ProjectV2Item {
  id: string;
  databaseId?: number;
  fieldValues: { nodes: ProjectV2ItemFieldValue[] };
  content: ProjectV2IssueContent | null;
}

interface MissionsQueryData {
  organization?: {
    projectV2?: {
      title: string;
      items: { nodes: ProjectV2Item[] };
    } | null;
  } | null;
}

const MISSIONS_QUERY = /* GraphQL */ `
  query OrgProjectMissions($org: String!, $projectNumber: Int!) {
    organization(login: $org) {
      projectV2(number: $projectNumber) {
        title
        items(first: 50) {
          nodes {
            id
            databaseId
            fieldValues(first: 10) {
              nodes {
                ... on ProjectV2ItemFieldTextValue {
                  text
                  field {
                    ... on ProjectV2FieldCommon {
                      name
                    }
                  }
                }
                ... on ProjectV2ItemFieldSingleSelectValue {
                  name
                  field {
                    ... on ProjectV2FieldCommon {
                      name
                    }
                  }
                }
              }
            }
            content {
              ... on Issue {
                title
                url
                number
                body
                labels(first: 10) {
                  nodes {
                    name
                  }
                }
                assignees(first: 5) {
                  nodes {
                    login
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// ── Fallback data (shown when no token is configured) ────────────────

function getFallbackMissions(): Mission[] {
  return [
    {
      id: 'fallback-1',
      databaseId: 167766956,
      title: 'Add Intuition to observatory.intuition.box',
      status: 'Application open',
      priority: 'P0',
      body: 'Integrate Intuition protocol data into the observatory platform to provide comprehensive ecosystem insights for the builder community.',
      labels: [{ name: 'integration' }, { name: 'data' }],
      assignees: [],
    },
    {
      id: 'fallback-2',
      databaseId: 167766957,
      title: 'Proxy Fee Template',
      status: 'Application open',
      priority: 'P0',
      body: 'Create a standardized template for proxy fee contracts that builders can easily implement and customize for their applications.',
      labels: [{ name: 'smart-contracts' }, { name: 'template' }],
      assignees: [],
    },
    {
      id: 'fallback-3',
      databaseId: 167766958,
      title: 'Improvement of https://graph.intuition.box to mainnet',
      status: 'Application open',
      body: 'Enhance the graph explorer interface and extend support for mainnet data visualization and querying capabilities.',
      labels: [{ name: 'frontend' }, { name: 'mainnet' }],
      assignees: [],
    },
    {
      id: 'fallback-4',
      databaseId: 167766959,
      title: 'Intuition.box Socials creation',
      status: 'Ideas',
      body: 'Establish and manage social media presence for Intuition Box to engage with the developer community and share updates.',
      labels: [{ name: 'marketing' }, { name: 'community' }],
      assignees: [],
    },
  ];
}

// ── Transform ────────────────────────────────────────────────────────

function readFieldValues(item: ProjectV2Item): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const node of item.fieldValues.nodes) {
    const fieldName = (node as { field?: ProjectV2FieldRef }).field?.name;
    if (!fieldName) continue;
    if ('text' in node && typeof node.text === 'string') {
      fields[fieldName] = node.text;
    } else if ('name' in node && typeof node.name === 'string') {
      fields[fieldName] = node.name;
    }
  }
  return fields;
}

function transformMissionData(items: ProjectV2Item[]): Mission[] {
  return items.map((item) => {
    const fields = readFieldValues(item);
    const issue = item.content ?? null;
    return {
      id: item.id,
      databaseId: item.databaseId,
      title: fields.Title ?? issue?.title ?? 'Untitled Mission',
      status: fields.Status ?? 'Ideas',
      priority: fields.Priority,
      url: issue?.url,
      body: issue?.body ?? undefined,
      labels: issue?.labels?.nodes ?? [],
      assignees: issue?.assignees?.nodes ?? [],
      number: issue?.number,
    };
  });
}

// ── Fetcher ──────────────────────────────────────────────────────────

async function fetchMissionsUncached(
  org: string,
  projectNumber: number,
): Promise<Mission[]> {
  if (!hasGitHubToken()) {
    console.log('[missions] No GitHub token found, using fallback data');
    return getFallbackMissions();
  }

  try {
    const data = await githubGraphQL<MissionsQueryData>(MISSIONS_QUERY, {
      org,
      projectNumber,
    });
    const items = data.organization?.projectV2?.items.nodes ?? [];
    return transformMissionData(items);
  } catch (error) {
    console.log('[missions] Failed to fetch missions data, using fallback:', error);
    return getFallbackMissions();
  }
}

// ── Cached export ────────────────────────────────────────────────────
// Hoisted to module scope so the wrapper is allocated once. Args are
// part of the cache key, so different (org, projectNumber) pairs get
// distinct cache entries.

const cachedFetch = unstable_cache(
  (org: string, projectNumber: number) => fetchMissionsUncached(org, projectNumber),
  ['missions-data', 'v2'],
  { revalidate: 300 },
);

export async function fetchMissionsData(
  org: string = 'intuition-box',
  projectNumber: number = 21,
): Promise<Mission[]> {
  try {
    return await cachedFetch(org, projectNumber);
  } catch (error) {
    console.error('[missions] Failed to fetch missions data:', error);
    return [];
  }
}
