import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { SearchTrigger } from 'fumadocs-ui/layouts/shared/slots/search-trigger';
import { discordUrl, gitConfig, spotlightsRoute, twitterUrl } from './shared';
import { Logomark } from '@/components/logomark';
import { DiscordIcon, XIcon } from '@/components/brand-icons';
import { IconSearchTrigger } from '@/components/icon-search-trigger';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Logomark size={24} />,
    },
    links: [
      { text: 'Missions', url: '/missions', active: 'nested-url' },
      { text: 'Spotlights', url: spotlightsRoute, active: 'nested-url' },
      { text: 'Blog', url: '/blog', active: 'nested-url' },
      { text: 'Learn', url: '/learn', active: 'nested-url' },
      { text: 'Docs', url: '/docs', active: 'nested-url' },
      {
        type: 'icon',
        text: 'Discord',
        label: 'Join us on Discord',
        url: discordUrl,
        external: true,
        icon: <DiscordIcon className="size-4" />,
      },
      {
        type: 'icon',
        text: 'X',
        label: 'Follow us on X',
        url: twitterUrl,
        external: true,
        icon: <XIcon className="size-4" />,
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    // Hide the theme toggle UI for now (we'll re-enable when the light
    // theme is polished). The next-themes provider is still active in
    // app/layout.tsx with dark as the default, so theme functionality
    // is preserved — only the navbar button is hidden.
    themeSwitch: { enabled: false },
    // Use the compact icon-only search trigger on every breakpoint
    // (fumadocs's default `full` is a wide fake-input — confusing UX).
    slots: {
      searchTrigger: {
        sm: SearchTrigger,
        full: IconSearchTrigger,
      },
    },
  };
}
