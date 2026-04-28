import Link from 'next/link';
import { Button } from '@waveso/ui/button';

export default function HomeNotFound() {
  return (
    <main className="max-w-3xl mx-auto px-6 md:px-8 pt-24 pb-24 text-center">
      <p className="text-xs tracking-widest text-fd-muted-foreground uppercase mb-4">
        404
      </p>
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight m-0 mb-4">
        Page not found
      </h1>
      <p className="text-fd-muted-foreground max-w-xl mx-auto mb-10">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div className="flex justify-center gap-3 flex-wrap">
        <Button variant="outline" render={<Link href="/blog" />}>
          Read the blog
        </Button>
        <Button render={<Link href="/" />}>Back home</Button>
      </div>
    </main>
  );
}
