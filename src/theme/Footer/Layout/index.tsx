import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {Props} from '@theme/Footer/Layout';

export default function FooterLayout({
  style,
  links,
  logo,
  copyright,
}: Props): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const tagline = siteConfig.tagline;

  return (
    <footer
      className={clsx(
        ThemeClassNames.layout.footer.container,
        'footer',
        {'footer--dark': style === 'dark'},
      )}>
      <div className="footer__directory container container-fluid">
        <div className="footer__left">
          {logo && <div className="margin-bottom--sm">{logo}</div>}
          {tagline && <p className="footer__description">{tagline}</p>}
          {copyright && <div className="footer__copyright">{copyright}</div>}
        </div>
        <div className="footer__right">
          {links && links}
        </div>
      </div>
      <div className="footer__signature">
        <img src="/brand/logotext_light.png" alt="Intuition logo" />
      </div>
    </footer>
  );
}
