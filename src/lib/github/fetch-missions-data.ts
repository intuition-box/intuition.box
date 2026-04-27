import 'server-only';

import { unstable_cache } from 'next/cache';
import { githubGraphQL, hasGitHubToken } from './client';
import {
  GITHUB_ORG,
  MISSIONS_CACHE_TAG,
  MISSIONS_PROJECT_NUMBER,
} from './constants';

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
    // Both fragment shapes can show up; just look for whichever value is present.
    const n = node as { text?: string | null; name?: string | null; field?: { name?: string } };
    const fieldName = n.field?.name;
    if (!fieldName) continue;
    const value = n.text ?? n.name;
    if (typeof value === 'string') {
      fields[fieldName] = value;
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

/**
 * One round-trip to GitHub. Distinguishes:
 *   - `projectV2` missing / null  → treat as transient failure (throw)
 *   - `projectV2.items.nodes` empty → legitimate empty project (return [])
 *
 * Throwing on the first case is important: it stops the caller from
 * caching an empty result, so the next request retries instead of
 * pinning "No Missions Available" for a full TTL.
 */
async function fetchMissionsOnce(
  org: string,
  projectNumber: number,
): Promise<Mission[]> {
  const data = await githubGraphQL<MissionsQueryData>(MISSIONS_QUERY, {
    org,
    projectNumber,
  });
  const projectV2 = data.organization?.projectV2;
  if (!projectV2) {
    throw new Error(
      `[missions] projectV2 was null for org=${org} project=${projectNumber}. ` +
        'Likely a transient GitHub error or insufficient token scope.',
    );
  }
  return transformMissionData(projectV2.items?.nodes ?? []);
}

async function fetchMissionsUncached(
  org: string,
  projectNumber: number,
): Promise<Mission[]> {
  if (!hasGitHubToken()) {
    console.log('[missions] No GitHub token found, using fallback data');
    return getFallbackMissions();
  }

  // One retry with a short delay handles flaky GitHub responses (the
  // most common shape of "everything broke until you reload").
  try {
    return await fetchMissionsOnce(org, projectNumber);
  } catch (firstError) {
    console.warn('[missions] First fetch failed, retrying once:', firstError);
    await new Promise((resolve) => setTimeout(resolve, 400));
    try {
      return await fetchMissionsOnce(org, projectNumber);
    } catch (secondError) {
      console.error('[missions] Both attempts failed, using fallback:', secondError);
      return getFallbackMissions();
    }
  }
}

// ── Cached export ────────────────────────────────────────────────────
// Hoisted to module scope so the wrapper is allocated once. Args are
// part of the cache key, so different (org, projectNumber) pairs get
// distinct cache entries.

const cachedFetch = unstable_cache(
  (org: string, projectNumber: number) => fetchMissionsUncached(org, projectNumber),
  ['missions-data', 'v3'],
  // Short TTL (60s) so edits propagate within a minute. The cache is
  // also tagged so a server action can call `revalidateTag(MISSIONS_CACHE_TAG)`
  // for instant refresh on demand.
  { revalidate: 60, tags: [MISSIONS_CACHE_TAG] },
);

export async function fetchMissionsData(
  org: string = GITHUB_ORG,
  projectNumber: number = MISSIONS_PROJECT_NUMBER,
): Promise<Mission[]> {
  try {
    return await cachedFetch(org, projectNumber);
  } catch (error) {
    console.error('[missions] Failed to fetch missions data:', error);
    return [];
  }
}
