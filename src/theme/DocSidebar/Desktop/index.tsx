import React from 'react';
import clsx from 'clsx';
import { useThemeConfig } from '@docusaurus/theme-common';
import Navbar from '@theme/Navbar';
import Logo from '@theme/Logo';
import CollapseButton from '@theme/DocSidebar/Desktop/CollapseButton';
import Content from '@theme/DocSidebar/Desktop/Content';
import type {Props} from '@theme/DocSidebar/Desktop';

import styles from './styles.module.css';

function DocSidebarDesktop({path, sidebar, onCollapse, isHidden}: Props) {
  const {
    navbar: {hideOnScroll},
    docs: {
      sidebar: {hideable},
    },
  } = useThemeConfig();

  return (
    <>
      <div
        className={clsx(
          styles.sidebar,
          hideOnScroll && styles.sidebarWithHideableNavbar,
          isHidden && styles.sidebarHidden,
        )}
      >
        {hideable && <CollapseButton onClick={onCollapse} />}
      </div>
      <div
        className={clsx(
          styles.sidebar,
          hideOnScroll && styles.sidebarWithHideableNavbar,
          isHidden && styles.sidebarHidden,
        )}>
        <header className={styles.sidebarHeader}>
          <Navbar />
        </header>
        <Content path={path} sidebar={sidebar} />
      </div>
    </>
  );
}

export default React.memo(DocSidebarDesktop);
