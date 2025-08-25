import React from 'react';
import Layout from '@theme/Layout';
import { ProjectPlanner } from '@site/src/components/ProjectPlanner';

export default function Projects(): React.ReactElement {
  return (
    <Layout
      title="Project Planning"
      description="Visual planning tool for organizing contributions across GitHub projects">
      <ProjectPlanner />
    </Layout>
  );
}
