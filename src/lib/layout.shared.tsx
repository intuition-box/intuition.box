import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { gitConfig } from './shared';
import { Logomark } from '@/components/logomark';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Logomark size={24} />,
    },
    links: [
      { text: 'Documentation', url: '/docs', active: 'nested-url' },
    ],
  };
}
