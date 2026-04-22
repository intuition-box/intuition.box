import Link from 'next/link';
import { GradientRevealText } from '@/components/gradient-reveal-text';
import { AnimateOnView } from '@/components/animate';
import { Logomark } from '@/components/logomark';

const COLUMNS = [
  {
    title: 'Developers',
    links: [
      { label: 'Docs', href: '/docs' },
      { label: 'GitHub', href: 'https://github.com/intuition-box', external: true },
      { label: 'Colony', href: 'https://app.colony.io/intuition_box', external: true },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Governance', href: 'https://atlas.discourse.group/c/governance/intuition-box/35', external: true },
      { label: 'Missions', href: '/missions' },
      { label: 'Grants', href: 'https://atlas.discourse.group/c/ecosystem-development/grant-applications/36', external: true },
      { label: 'Discord', href: 'https://discord.gg/0xintuition', external: true },
      { label: 'X', href: 'https://x.com/intuition_box', external: true },
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
      <div className="px-8 flex flex-col text-fd-muted-foreground sm:flex-row sm:space-between">
        <p className="flex flex-col gap-4 items-center font-medium sm:mr-auto">
          <Logomark size={60} />
          <span className="text-sm">
            © {new Date().getFullYear()} Intuition Box, LLC
          </span>
        </p>

        <div className="mt-8 flex flex-col text-center gap-10 sm:mt-0 sm:grid sm:grid-cols-3 lg:grid-cols-3">
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
        <GradientRevealText className="mt-20 px-8" text="INTUITION" colors={['#8df1c9', '#8df1c9']} hoverOpacity={0.3} strokeWidth={0.1} />
      </AnimateOnView>
    </footer>
  );
}
