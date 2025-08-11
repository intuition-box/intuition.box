import type {ReactNode} from 'react';
import React, { useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import Hero from '../components/Hero/Hero';
import SciFiPanel from '../components/Panels/SciFiPanel';
import Galaxy from '../components/Galaxy/Galaxy';

import styles from './index.module.css';
import Iridescence from '../components/Backgrounds/Iridescence/Iridescence';
import DarkVeil from '../components/Backgrounds/DarkVeil/DarkVeil';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        {/* <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Docusaurus Tutorial - 5min ⏱️
          </Link>
        </div> */}
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
              {/* <Iridescence
                color={[0.2, 0.8, 0.6]}
                mouseReact={false}
                amplitude={0.1}
                speed={0.4}
              /> */}
  {/* <DarkVeil hueShift={55} speed={0.4} warpAmount={3}/> */}
      {/* <HomepageHeader /> */}  
      <main>
        <Hero />
        <SciFiPanel variant='large' >
          <h2>THE FABLAB NETWORK</h2>
          <p>
            Compteur + liste des contributeurs
          </p>
        </SciFiPanel>
        <Galaxy/>
        {/* <HomepageFeatures /> */}
      </main>
    </Layout>
  );
}
