import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './admin.module.css';

export default function AdminPage(): JSX.Element {
  return (
    <Layout
      title="Admin Dashboard"
      description="Administrative tools for contributors and developers">
      <main className="container margin-vert--lg">
        <div className="row">
          <div className="col col--12">
            <div className={styles.adminHeader}>
              <h1>🛠️ Admin Dashboard</h1>
              <p className="text--secondary">
                Administrative tools for contributors and developers to manage projects and repositories.
              </p>
            </div>

            <div className={styles.toolsGrid}>
              <div className={styles.toolCard}>
                <div className={styles.toolIcon}>📋</div>
                <h3>Project Planner</h3>
                <p>
                  Manage contributors, assign projects to team members, and track development timelines. 
                  Drag and drop weeks to projects to indicate active development periods.
                </p>
                <div className={styles.features}>
                  <span className={styles.feature}>• Contributor management</span>
                  <span className={styles.feature}>• Project assignments</span>
                  <span className={styles.feature}>• Timeline tracking</span>
                  <span className={styles.feature}>• JSON export/import</span>
                </div>
                <Link
                  className="button button--primary button--block"
                  to="/admin/projects">
                  Open Project Planner
                </Link>
              </div>

              <div className={styles.toolCard}>
                <div className={styles.toolIcon}>📦</div>
                <h3>Repository Manager</h3>
                <p>
                  View all repositories from the intuition-box GitHub organization and assign them to projects. 
                  Create new projects and manage repository-project mappings.
                </p>
                <div className={styles.features}>
                  <span className={styles.feature}>• GitHub integration</span>
                  <span className={styles.feature}>• Repository assignment</span>
                  <span className={styles.feature}>• Project creation</span>
                  <span className={styles.feature}>• Mapping export</span>
                </div>
                <Link
                  className="button button--primary button--block"
                  to="/admin/repos">
                  Open Repository Manager
                </Link>
              </div>
            </div>

            <div className={styles.workflowSection}>
              <h2>🔄 Contributor Workflow</h2>
              <div className={styles.workflowSteps}>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>1</div>
                  <div className={styles.stepContent}>
                    <h4>Manage Repositories</h4>
                    <p>Use Repository Manager to assign repos to projects and create new projects as needed.</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>2</div>
                  <div className={styles.stepContent}>
                    <h4>Plan Projects</h4>
                    <p>Use Project Planner to assign contributors to projects and track development timelines.</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>3</div>
                  <div className={styles.stepContent}>
                    <h4>Export Data</h4>
                    <p>Copy the JSON data from either tool to your clipboard for easy integration.</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>4</div>
                  <div className={styles.stepContent}>
                    <h4>Create PR</h4>
                    <p>Update the JSON files in the repository and submit a pull request with your changes.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.accessNote}>
              <h3>🔐 Access Note</h3>
              <p>
                These tools are intended for contributors and developers who need to manage project data. 
                Regular users don't need access to these administrative functions.
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
