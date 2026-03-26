import type { ReactNode } from 'react';
import React, { useMemo, useState, useCallback } from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useGlobalData from '@docusaurus/useGlobalData';
import { useLocation } from '@docusaurus/router';
import { prefersReducedMotion, ThemeClassNames } from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import DocSidebar from '@theme/DocSidebar';
import ExpandButton from '@theme/DocRoot/Layout/Sidebar/ExpandButton';
import type { PropSidebarItem } from '@docusaurus/plugin-content-docs';
import Hero from '../components/Hero/Hero';
import Panel from '../components/Panels/Panel';
import Galaxy from '../components/Galaxy/Galaxy';
import NetworkIntuition from '../components/NetworkIntuition/NetworkIntuition';

// Reuse the doc layout styles so the sidebar looks identical to doc pages
import sidebarStyles from '../theme/DocRoot/Layout/Sidebar/styles.module.css';
import docLayoutStyles from '../theme/DocRoot/Layout/styles.module.css';
import styles from './index.module.css';

interface GlobalDoc {
  id: string;
  path: string;
  sidebar?: string;
}

/** Convert a path segment like "tutorial-basics" → "Tutorial Basics" */
function segmentToLabel(segment: string): string {
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Build PropSidebarItem[] from the flat docs list in global data.
 * Includes the external links from sidebars.ts that aren't in global data.
 */
function buildSidebarItems(docs: GlobalDoc[]): PropSidebarItem[] {
  const items: PropSidebarItem[] = [];

  // Separate root docs from nested docs
  const rootDocs: GlobalDoc[] = [];
  const categories = new Map<string, GlobalDoc[]>();

  const realDocs = docs.filter((d) => !d.id.startsWith('/'));

  for (const doc of realDocs) {
    const segments = doc.id.split('/');
    if (segments.length === 1) {
      rootDocs.push(doc);
    } else {
      const categoryKey = segments[0];
      if (!categories.has(categoryKey)) {
        categories.set(categoryKey, []);
      }
      categories.get(categoryKey)!.push(doc);
    }
  }

  // Root-level doc links
  for (const doc of rootDocs) {
    items.push({
      type: 'link' as const,
      label: segmentToLabel(doc.id),
      href: doc.path,
      docId: doc.id,
    });
  }

  // Category groups
  for (const [key, catDocs] of categories) {
    items.push({
      type: 'category' as const,
      label: segmentToLabel(key),
      collapsed: false,
      collapsible: true,
      items: catDocs.map((doc) => ({
        type: 'link' as const,
        label: segmentToLabel(doc.id.split('/').pop()!),
        href: doc.path,
        docId: doc.id,
      })),
    });
  }

  return items;
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const { pathname } = useLocation();
  const globalData = useGlobalData();

  const docsPluginData = globalData['docusaurus-plugin-content-docs']?.default as
    | { versions: Array<{ docs: GlobalDoc[] }> }
    | undefined;

  const sidebarItems = useMemo(() => {
    const docs = docsPluginData?.versions?.[0]?.docs ?? [];
    return buildSidebarItems(docs);
  }, [docsPluginData]);

  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);
  const [hiddenSidebar, setHiddenSidebar] = useState(false);

  const toggleSidebar = useCallback(() => {
    if (hiddenSidebar) {
      setHiddenSidebar(false);
    }
    if (!hiddenSidebar && prefersReducedMotion()) {
      setHiddenSidebar(true);
    }
    setHiddenSidebarContainer((value) => !value);
  }, [hiddenSidebar]);

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <div className={docLayoutStyles.docsWrapper}>
        <div className={docLayoutStyles.docRoot}>
          {/* Sidebar — same wrapper structure as DocRoot/Layout/Sidebar */}
          <aside
            className={clsx(
              ThemeClassNames.docs.docSidebarContainer,
              sidebarStyles.docSidebarContainer,
              hiddenSidebarContainer && sidebarStyles.docSidebarContainerHidden,
            )}
            onTransitionEnd={(e) => {
              if (!e.currentTarget.classList.contains(sidebarStyles.docSidebarContainer!)) {
                return;
              }
              if (hiddenSidebarContainer) {
                setHiddenSidebar(true);
              }
            }}>
            <div
              className={clsx(
                sidebarStyles.sidebarViewport,
                hiddenSidebar && sidebarStyles.sidebarViewportHidden,
              )}>
              <DocSidebar
                sidebar={sidebarItems}
                path={pathname}
                onCollapse={toggleSidebar}
                isHidden={hiddenSidebar}
              />
              {hiddenSidebar && <ExpandButton toggleSidebar={toggleSidebar} />}
            </div>
          </aside>

          {/* Main content */}
          <main className={styles.mainColumn}>
            <Hero />
            <Panel variant='large'>
              <h2>THE INTUITION.BOX NETWORK</h2>
              <NetworkIntuition />
            </Panel>
            <Galaxy />
          </main>
        </div>
      </div>
    </Layout>
  );
}
