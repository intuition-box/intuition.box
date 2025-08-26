import type {ReactNode} from 'react';
import React, { useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import Hero from '../components/Hero/Hero';
import Panel from '../components/Panels/Panel';
import Galaxy from '../components/Galaxy/Galaxy';
import WhyPanel from '../components/Panels/WhyPanel';
import OffersPanel from '../components/Panels/OffersPanel';
import Blog from '../components/Blog/Blog';
import EventGrid from "@site/src/components/Events/EventGrid";
import { EVENTS } from "@site/src/components/Events/events.data";

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
      title={`${siteConfig.title}`}
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
        <Panel variant='large'>
          <h2>THE INTUITION NETWORK</h2>
          <p>
            Compteur + liste des contributeurs
          </p>
        </Panel>
        <Galaxy/>
        <Panel variant='small' >
          <h2>PARTNERS</h2>
        </Panel>
        <WhyPanel />
        <OffersPanel />
        <Blog />
        <EventGrid events={EVENTS} />
      </main>
    </Layout>
  );
}
