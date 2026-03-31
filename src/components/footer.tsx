import Link from 'next/link';
import { GradientRevealText } from '@/components/gradient-reveal-text';
import { AnimateOnView } from '@/components/animate';
import { Logomark } from '@/components/logomark';

const COLUMNS = [
  {
    title: 'Developers',
    links: [
      { label: 'GitHub', href: 'https://github.com/intuition-box', external: true },
      { label: 'Quick Start', href: '/docs/quick-start' },
      { label: 'GraphQL API', href: '/docs/graphql-api' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Governance', href: 'https://atlas.discourse.group/c/governance/intuition-box/35', external: true },
      { label: 'Grants', href: 'https://atlas.discourse.group/c/ecosystem-development/grant-applications/36', external: true },
      { label: 'Discord', href: 'https://discord.gg/0xintuition', external: true },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Portal', href: 'https://portal.intuition.systems', external: true },
      { label: 'Explorer', href: 'https://explorer.intuition.systems', external: true },
      { label: 'System Status', href: 'https://status.intuition.systems', external: true },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="max-w-5xl mx-auto w-full relative pt-40">
      <div className="flex flex-col space-between items-start justify-between text-sm text-fd-muted-foreground sm:flex-row md:px-8">
        <p className="mb-4 flex flex-col gap-2 align-center font-medium text-fd-foreground space-x-2 px-2 py-1">
          <Logomark size={60} />
          <span className="text-sm">
            © {new Date().getFullYear()} Intuition Box, LLC
          </span>
        </p>

        <div className="mt-10 grid grid-cols-2 items-start gap-10 sm:mt-0 lg:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col space-y-4">
              <p className="font-bold text-fd-foreground">
                {col.title}
              </p>
              <ul className="list-none space-y-4">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-fd-foreground"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-fd-foreground"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <AnimateOnView distance={0}>
        <GradientRevealText className="mt-20" text="INTUITION" colors={['#8df1c9', '#8df1c9']} hoverOpacity={0.3} strokeWidth={0.1} />
      </AnimateOnView>
    </footer>
  );
}
