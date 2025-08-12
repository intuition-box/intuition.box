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
        <SciFiPanel variant='large' halo={true}>
          <h2>THE FABLAB NETWORK</h2>
          <p>
            Compteur + liste des contributeurs
          </p>
        </SciFiPanel>
        <Galaxy/>
        <SciFiPanel variant='small' >
          <h2>PARTNERS</h2>
        </SciFiPanel>
        <SciFiPanel variant='large'>
          <h2>WHY FABLAB ?</h2>
          <div className="why-wrapper">
            <div className="why-card">
              <h3>Context & Origin</h3>
              <p>The FabLab Charter</p>

              <div className="charter-acc">
                <details className="charter-row" open>
                  <summary>What is a fab lab?</summary>
                  <p>Fab labs are a global network of <span className="strike">local</span> labs, enabling invention by providing access to tools for digital fabrication.</p>
                </details>

                <details className="charter-row">
                  <summary>What's in a fab lab?</summary>
                  <p>Fab labs share an evolving inventory of core capabilities to make (almost) anything, allowing people and projects to be shared.</p>
                </details>

                <details className="charter-row">
                  <summary>What does the fab lab network provide?</summary>
                  <p>Operational, educational, technical, financial, and logistical assistance beyond what's available within one lab.</p>
                </details>

                <details className="charter-row">
                  <summary>Who can use a fab lab?</summary>
                  <p>Fab labs are available as a community resource, offering open access for individuals as well as scheduled access for programs.</p>
                </details>

                <details className="charter-row">
                  <summary>What are your responsibilities?</summary>
                  <ul className="charter-bullets">
                    <li><strong>safety</strong>: not hurting people or machines</li>
                    <li><strong>operations</strong>: assisting with cleaning, maintaining, and improving the lab</li>
                    <li><strong>knowledge</strong>: contributing to documentation and instruction</li>
                  </ul>
                </details>

                <details className="charter-row">
                  <summary>Who owns fab lab inventions?</summary>
                  <p>Designs and processes developed in fab labs can be protected and sold however an inventor chooses, but should remain available for individuals to use and learn from.</p>
                </details>

                <details className="charter-row">
                  <summary>How can businesses use a fab lab?</summary>
                  <p>Commercial activities can be prototyped and incubated in a fab lab, but they must not conflict with other uses, they should grow beyond rather than within the lab, and they are expected to benefit the inventors, labs, and networks that contribute to their success.</p>
                </details>
              </div>
            </div>

            <div className="why-card">
              <h3>Our Values</h3>
              <p>Ethereum org values exemple</p>
            </div>
          </div>
        </SciFiPanel>
        <SciFiPanel variant='large'>
          <h2>WHAT FABLAB OFFERS ?</h2>
        </SciFiPanel>
      </main>
    </Layout>
  );
}
