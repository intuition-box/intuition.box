import { source } from '@/lib/learn-source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import {
  FullSearchTrigger,
  SearchTrigger,
} from 'fumadocs-ui/layouts/shared/slots/search-trigger';
import { baseOptions } from '@/lib/layout.shared';
import { Logomark } from '@/components/logomark';
import { appName } from '@/lib/shared';

export default function Layout({ children }: { children: React.ReactNode }) {
  const base = baseOptions();
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...base}
      nav={{
        ...base.nav,
        title: (
          <div className="flex items-center gap-2">
            <Logomark size={24} />
            <span className="font-semibold text-foreground">{appName}</span>
          </div>
        ),
      }}
      sidebar={{ 
        footer: null,
      }}
      themeSwitch={{ enabled: false }}
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
