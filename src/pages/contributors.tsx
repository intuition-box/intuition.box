import React from 'react';
import Layout from '@theme/Layout';
import { ContributorsActivity } from '../components/ContributorsActivity';

export default function ContributorsPage(): JSX.Element {
  return (
    <Layout
      title="Contributors Activity"
      description="Visualize contributor activity and project engagement over time">
      <ContributorsActivity />
    </Layout>
  );
}
