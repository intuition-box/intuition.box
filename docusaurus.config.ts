import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Intuition Box',
  tagline: '',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://intuition.box',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'intuition-box', // Usually your GitHub org/user name.
  projectName: 'intuition.box', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          // Expand all categories by default
          async sidebarItemsGenerator(
            args,
          ) {
            const items = await args.defaultSidebarItemsGenerator(args);
            const expandAll = (sidebarItems: any[]): any[] =>
              sidebarItems.map((item) => {
                if (item.type === 'category') {
                  return {
                    ...item,
                    collapsed: false,
                    items: expandAll(item.items),
                  };
                }
                return item;
              });
            return expandAll(items);
          },
        },
        // Remove bog and pages from navbar
        // Keep it a focus on documentation
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'brand/social-card.jpg',
    docs: {
      sidebar: {
        hideable: true, // shows the collapse button on desktop
        autoCollapseCategories: true, // keep multiple categories open
      },
    },
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      logo: {
        alt: 'Intuition logo',
        src: 'brand/logo.svg',
      },
    },
    footer: {
      logo: {
        src: 'brand/logo.svg',
        alt: 'Intuition Box logo'
      },
      links: [
        {
          title: 'Ressources',
          items: [
            {
              label: 'Brand',
              to: '/brand',
            },
            {
              label: 'Ecosystem',
              href: 'https://intuition.systems/ecosystem',
            },
            {
              label: 'Roadmap',
              to: '/roadmap',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Github',
              href: '#',
            },
            {
              label: 'X',
              href: '#',
            },
            {
              label: 'Discord',
              href: '#',
            },
            {
              label: 'Intuition Protocol',
              href: 'https://intuition.systems',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Intuition Box, LLC`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
