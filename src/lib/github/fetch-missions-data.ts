import 'server-only';

import { unstable_cache } from 'next/cache';

const GH_GRAPHQL_API = 'https://api.github.com/graphql';

function headers(): HeadersInit {
  const h: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github+json'
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

export interface Mission {
  id: string;
  title: string;
  status: string;
  priority?: string;
  url?: string;
  body?: string;
  labels: Array<{ name: string }>;
  assignees: Array<{ login: string }>;
  number?: number;
}

// Fallback missions data when GitHub API is not available
function getFallbackMissions(): Mission[] {
  return [
    {
      id: 'fallback-1',
      title: 'Add Intuition to observatory.intuition.box',
      status: 'Application open',
      priority: 'P0',
      url: undefined,
      body: 'Integrate Intuition protocol data into the observatory platform to provide comprehensive ecosystem insights for the builder community.',
      labels: [{ name: 'integration' }, { name: 'data' }],
      assignees: [],
    },
    {
      id: 'fallback-2',
      title: 'Proxy Fee Template',
      status: 'Application open',
      priority: 'P0',
      url: undefined,
      body: 'Create a standardized template for proxy fee contracts that builders can easily implement and customize for their applications.',
      labels: [{ name: 'smart-contracts' }, { name: 'template' }],
      assignees: [],
    },
    {
      id: 'fallback-3',
      title: 'Improvement of https://graph.intuition.box to mainnet',
      status: 'Application open',
      url: undefined,
      body: 'Enhance the graph explorer interface and extend support for mainnet data visualization and querying capabilities.',
      labels: [{ name: 'frontend' }, { name: 'mainnet' }],
      assignees: [],
    },
    {
      id: 'fallback-4',
      title: 'Intuition.box Socials creation',
      status: 'Ideas',
      url: undefined,
      body: 'Establish and manage social media presence for Intuition Box to engage with the developer community and share updates.',
      labels: [{ name: 'marketing' }, { name: 'community' }],
      assignees: [],
    }
  ];
}

async function fetchMissionsUncached(org: string, projectNumber: number): Promise<Mission[]> {
  // Check if GitHub token is available
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.log('[missions] No GitHub token found, using fallback data');
    return getFallbackMissions();
  }

  try {
    const response = await fetch(GH_GRAPHQL_API, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        query: `
          query {
            organization(login: "${org}") {
              projectV2(number: ${projectNumber}) {
                title
                items(first: 50) {
                  nodes {
                    id
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
        `
      }),
    });

    if (!response.ok) {
      console.log(`[missions] GitHub API returned ${response.status}, using fallback data`);
      return getFallbackMissions();
    }

    const data = await response.json();

    if (data.errors) {
      console.log(`[missions] GraphQL errors: ${JSON.stringify(data.errors)}, using fallback data`);
      return getFallbackMissions();
    }

    const items = data.data?.organization?.projectV2?.items?.nodes || [];
    return transformMissionData(items);
  } catch (error) {
    console.log('[missions] Failed to fetch missions data, using fallback data:', error);
    return getFallbackMissions();
  }
}

function transformMissionData(items: any[]): Mission[] {
  return items.map((item) => {
    const fields = item.fieldValues.nodes.reduce((acc: any, field: any) => {
      if (field.field?.name) {
        acc[field.field.name] = field.text || field.name;
      }
      return acc;
    }, {});

    const issue = item.content;

    return {
      id: item.id,
      title: fields.Title || issue?.title || 'Untitled Mission',
      status: fields.Status || 'Ideas',
      priority: fields.Priority,
      url: issue?.url,
      body: issue?.body,
      labels: issue?.labels?.nodes || [],
      assignees: issue?.assignees?.nodes || [],
      number: issue?.number
    };
  });
}

export async function fetchMissionsData(
  org: string = 'intuition-box',
  projectNumber: number = 21
): Promise<Mission[]> {
  const cachedFetch = unstable_cache(
    () => fetchMissionsUncached(org, projectNumber),
    [`missions-data-${org}-${projectNumber}`],
    { revalidate: 300 }, // Cache for 5 minutes
  );

  try {
    return await cachedFetch();
  } catch (error) {
    console.error('[missions] Failed to fetch missions data:', error);
    return [];
  }
}