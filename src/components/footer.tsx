import Link from 'next/link';
import Image from 'next/image';
import { GradientRevealText } from './gradient-reveal-text';

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
    <footer className="max-w-6xl mx-auto relative px-8 py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between text-sm text-fd-muted-foreground sm:flex-row md:px-8">
        <div>
          <div className="mb-4 flex items-center space-x-2 px-2 py-1">
            <Image
              src="/logomark.svg"
              alt="Intuition Box"
              width={30}
              height={30}
              className="dark:invert"
            />
            <p className="font-medium text-fd-foreground">
              Intuition Box
            </p>
          </div>
          <p className="ml-2 text-sm">
            © {new Date().getFullYear()} Intuition Box, LLC. All rights reserved.
          </p>
        </div>

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


      <div className="mt-20">
        <GradientRevealText text="INTUITION" />
      </div>
    </footer>
  );
}
