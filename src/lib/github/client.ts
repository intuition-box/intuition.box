import 'server-only';

export const GH_REST_API = 'https://api.github.com';
export const GH_GRAPHQL_API = 'https://api.github.com/graphql';

function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    ...extra,
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/**
 * Server-side fetch helper for GitHub's REST v3 API.
 * Throws on non-2xx so callers can decide whether to fall back or bubble.
 */
export async function githubFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: authHeaders(init?.headers as Record<string, string> | undefined),
  });
  if (!res.ok) {
    throw new Error(`GitHub REST ${res.status}: ${url}`);
  }
  return (await res.json()) as T;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

/**
 * Server-side helper for GitHub's GraphQL v4 API. Always uses query variables
 * (never string interpolation) so callers can't accidentally introduce
 * injection-shaped queries.
 */
export async function githubGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const res = await fetch(GH_GRAPHQL_API, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(`GitHub GraphQL ${res.status}`);
  }
  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    throw new Error(`GitHub GraphQL errors: ${json.errors.map((e) => e.message).join('; ')}`);
  }
  if (!json.data) {
    throw new Error('GitHub GraphQL: empty response');
  }
  return json.data;
}

export function hasGitHubToken(): boolean {
  return Boolean(process.env.GITHUB_TOKEN);
}
