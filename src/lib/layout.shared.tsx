import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';
import { Logomark } from '@/components/logomark';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Logomark size={24} />
          <span>{appName}</span>
        </>
      ),
    },
  };
}
