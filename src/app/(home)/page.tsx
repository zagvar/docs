import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-24">
      <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-fd-muted-foreground">
        Trading foundations
      </p>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
        Build the trading product. Keep the foundation adaptable.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-fd-muted-foreground">
        Mosaic provides accessible trading interfaces. Relay provides
        provider-neutral market-data infrastructure. Use either independently or
        compose both through your application.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/docs"
          className="rounded-full bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground"
        >
          Read the documentation
        </Link>
        <Link
          href="/docs/guides"
          className="rounded-full border border-fd-border px-5 py-2.5 text-sm font-medium"
        >
          Build with both
        </Link>
      </div>
    </main>
  );
}
