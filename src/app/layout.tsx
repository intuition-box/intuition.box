import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Google_Sans_Flex } from 'next/font/google';

const sans = Google_Sans_Flex({
  subsets: ['latin'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={sans.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          // Force dark by default while we finalize the light theme. The
          // toggle UI is hidden via `themeSwitch.enabled = false` in
          // layout.shared.tsx, but the provider stays so we can re-enable
          // the toggle later without changing the underlying setup.
          theme={{ defaultTheme: 'dark', enableSystem: false }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
