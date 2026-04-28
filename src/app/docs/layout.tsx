import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import {
  FullSearchTrigger,
  SearchTrigger,
} from 'fumadocs-ui/layouts/shared/slots/search-trigger';
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
      // The global default in `baseOptions()` uses an icon-only search
      // trigger (cleaner for the navbar). The docs sidebar has space for
      // a proper labeled trigger — left-aligned icon + "Search" + ⌘K hint.
      slots={{
        searchTrigger: {
          sm: SearchTrigger,
          full: FullSearchTrigger,
        },
      }}
    >
      {children}
    </DocsLayout>
  );
}
