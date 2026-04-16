import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { Logomark } from '@/components/logomark';
import { appName } from '@/lib/shared';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const base = baseOptions();
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...base}
      nav={{
        ...base.nav,
        title: (
          <>
            <Logomark size={24} />
            <span>{appName}</span>
          </>
        ),
      }}
      sidebar={{ footer: null }}
      themeSwitch={{ enabled: false }}
    >
      {children}
    </DocsLayout>
  );
}
