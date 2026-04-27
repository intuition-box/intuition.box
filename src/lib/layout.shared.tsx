import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { gitConfig } from './shared';
import { Logomark } from '@/components/logomark';
import { GRANTS_URL } from './github/constants';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Logomark size={24} />,
    },
    links: [
      { text: 'Docs', url: '/docs', active: 'nested-url' },
      { text: 'Blog', url: '/blog', active: 'nested-url' },
      { text: 'Missions', url: '/missions', active: 'nested-url' },
      { text: 'Grants', url: GRANTS_URL, external: true },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
