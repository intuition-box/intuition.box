import Link from 'next/link';
import { Logomark } from '@/components/logomark';
import { GOVERNANCE_URL } from '@/lib/github/constants';
import { spotlightsRoute } from '@/lib/shared';

const COLUMNS = [
  {
    title: 'Developers',
    links: [
      { label: 'Docs', href: '/docs' },
      { label: 'Missions', href: '/missions' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Governance', href: GOVERNANCE_URL, external: true },
      { label: 'Spotlights', href: spotlightsRoute },
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
    <footer className="w-full relative py-40">
      <div className="max-w-5xl mx-auto w-full px-8 flex flex-col text-fd-muted-foreground sm:flex-row sm:space-between">
        <p className="max-sm:items-start max-sm:mb-2 flex flex-col gap-4 items-center font-medium sm:mr-auto">
          <Logomark size={60} />
          <span className="text-sm">
            © {new Date().getFullYear()} Intuition Box, LLC
          </span>
        </p>

        <div className="mt-8 flex flex-col text-center gap-10 max-sm:text-left sm:mt-0 sm:grid sm:grid-cols-3 lg:grid-cols-3">
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
    </footer>
  );
}
