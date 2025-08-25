import { GitHubRepo } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';
const ORGANIZATION = 'intuition-box';

export class GitHubService {
  private static async makeRequest(endpoint: string): Promise<any> {
    try {
      const response = await fetch(`${GITHUB_API_BASE}${endpoint}`);
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('GitHub API request failed:', error);
      throw error;
    }
  }

  static async getOrganizationRepos(): Promise<GitHubRepo[]> {
    try {
      const repos = await this.makeRequest(`/orgs/${ORGANIZATION}/repos?per_page=100&sort=updated`);
      
      // Filter out archived and disabled repos, and sort by name
      return repos
        .filter((repo: any) => !repo.archived && !repo.disabled)
        .sort((a: any, b: any) => a.name.localeCompare(b.name))
        .map((repo: any) => ({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          description: repo.description,
          html_url: repo.html_url,
          clone_url: repo.clone_url,
          language: repo.language,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          updated_at: repo.updated_at,
          topics: repo.topics || [],
          archived: repo.archived,
          disabled: repo.disabled,
          private: repo.private,
        }));
    } catch (error) {
      console.error('Failed to fetch organization repositories:', error);
      throw error;
    }
  }

  static async getRepoTopics(repoName: string): Promise<string[]> {
    try {
      const topics = await this.makeRequest(`/repos/${ORGANIZATION}/${repoName}/topics`);
      return topics.names || [];
    } catch (error) {
      console.error(`Failed to fetch topics for ${repoName}:`, error);
      return [];
    }
  }
}
