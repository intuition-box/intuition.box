import Link from 'next/link';
import { Button } from '@waveso/ui/button';
import { Logomark } from '@/components/logomark';
import { appName } from '@/lib/shared';
import { GRANTS_URL } from '@/lib/github/constants';

const NAV_LINKS = [
  { label: 'Missions', href: '/missions' },
  { label: 'Docs', href: '/docs' },
  { label: 'Grants', href: GRANTS_URL, external: true },
] as const;

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-fd-border bg-fd-background/80 backdrop-blur supports-[backdrop-filter]:bg-fd-background/60">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Logomark size={24} />
            <span className="font-semibold">{appName}</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {NAV_LINKS.map((link) => (
              <div key={link.label}>
                {'external' in link && link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              render={<a href="https://github.com/intuition-box" target="_blank" rel="noopener noreferrer" />}
            >
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}