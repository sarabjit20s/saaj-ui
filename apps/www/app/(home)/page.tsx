import React from 'react';
import Link from 'next/link';
import { Github, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col w-full gap-4 justify-center items-center">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-fd-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <Hero />
    </main>
  );
}

function Hero() {
  return (
    <div className="relative flex min-h-[500px] w-full flex-col items-center justify-center overflow-hidden mt-2 py-24 px-6 md:py-32">
      <div className="z-10 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
        <Link
          href="/docs"
          className="inline-flex items-center rounded-full border border-fd-border bg-fd-muted px-4 py-1.5 text-sm font-medium transition-colors hover:bg-fd-accent"
        >
          <span className="flex h-2 w-2 rounded-full bg-fd-primary mr-2 animate-pulse" />
          Introducing Saaj UI <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Link>

        <h1 className="mt-8 max-w-4xl text-5xl font-bold tracking-tighter text-fd-foreground sm:text-6xl md:text-7xl">
          Build{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fd-primary to-fd-primary/60">
            React Native
          </span>{' '}
          <br />
          Apps Faster.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-fd-muted-foreground sm:text-xl leading-relaxed">
          Beautifully designed, accessible, and customizable components built
          with{' '}
          <a
            href="https://unistyles.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:underline"
          >
            Unistyles
          </a>
          . Free, open source, and yours to keep.
        </p>

        <div className="mt-10 gap-4 flex flex-col sm:flex-row w-full sm:w-auto">
          <Button
            size="lg"
            asChild
            className="rounded-full w-full sm:w-auto h-12 px-8 shadow-xl shadow-fd-primary/10 transition-transform active:scale-95"
          >
            <Link href="/docs">Browse Components</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="rounded-full w-full sm:w-auto h-12 px-8 bg-transparent border-fd-border transition-transform active:scale-95 hover:bg-fd-muted"
          >
            <Link href="https://github.com/sarabjit20s/saaj-ui">
              <Github className="mr-2 h-4 w-4" /> Github
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
