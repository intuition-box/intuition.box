import React from 'react';
import Layout from '@theme/Layout';
import { RepoManager } from '../../components/RepoManager';

export default function ReposPage(): JSX.Element {
  return (
    <Layout
      title="Repository Management"
      description="Manage GitHub repositories and assign them to projects">
      <main className="container margin-vert--lg">
        <div className="row">
          <div className="col col--12">
            <h1>Repository Management</h1>
            <p className="text--secondary">
              View all repositories from the intuition-box GitHub organization and assign them to projects.
            </p>
            <RepoManager />
          </div>
        </div>
      </main>
    </Layout>
  );
}
