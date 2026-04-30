import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { Footer } from '@/components/footer';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="flex flex-1 flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </HomeLayout>
  );
}
