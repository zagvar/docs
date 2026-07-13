import Link from "next/link";
import { ArrowRight, Blocks, Rotate3D } from "lucide-react";

const productCards = [
  {
    name: "Mosaic",
    label: "Frontend foundation",
    description:
      "Accessible, composable React components and framework-free trading behavior.",
    href: "/docs/mosaic",
    icon: Blocks,
    accent: "zagvar-card-mosaic",
  },
  {
    name: "Relay",
    label: "Backend foundation",
    description:
      "Provider-neutral ingestion, caching, pub/sub, hydration, and real-time delivery.",
    href: "/docs/relay",
    icon: Rotate3D,
    accent: "zagvar-card-relay",
  },
] as const;

export default function HomePage() {
  return (
    <main className="zagvar-home relative isolate overflow-hidden">
      <div className="zagvar-grid absolute inset-0 -z-20" aria-hidden="true" />

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-24 sm:pb-24 sm:pt-32">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-fd-muted-foreground">
          Open-source trading foundations
        </p>

        <h1 className="max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
          Build the trading product.{" "}
          <span className="text-fd-muted-foreground">
            Keep the foundation adaptable.
          </span>
        </h1>

        <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-fd-muted-foreground">
          Mosaic handles the interface. Relay handles market-data delivery.
          Adopt either independently or connect both through an application
          boundary you control.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-full bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
          >
            Read the documentation
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/docs/guides"
            className="rounded-full border border-fd-border bg-fd-background/70 px-5 py-2.5 text-sm font-medium backdrop-blur transition-colors hover:bg-fd-accent"
          >
            Build with both
          </Link>
        </div>
      </section>

      <section
        className="mx-auto grid w-full max-w-6xl gap-4 px-6 pb-12 md:grid-cols-2"
        aria-label="Zagvar projects"
      >
        {productCards.map((product) => {
          const Icon = product.icon;

          return (
            <Link
              key={product.name}
              href={product.href}
              className={`zagvar-product-card group relative overflow-hidden rounded-2xl border border-fd-border bg-fd-card/80 p-6 shadow-sm backdrop-blur ${product.accent}`}
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-fd-muted-foreground">
                    {product.label}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                    {product.name}
                  </h2>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-fd-border bg-fd-background/80">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-5 max-w-md leading-7 text-fd-muted-foreground">
                {product.description}
              </p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
                Explore {product.name}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          );
        })}
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24 pt-8">
        <div className="rounded-2xl border border-fd-border bg-fd-muted/35 px-6 py-7 sm:px-8">
          <p className="text-sm font-medium">
            One application-controlled boundary
          </p>
          <div className="mt-5 grid gap-3 text-sm text-fd-muted-foreground sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
            <span className="rounded-lg border border-fd-border bg-fd-background px-4 py-3 text-fd-foreground">
              Market-data providers
            </span>
            <ArrowRight className="hidden size-4 sm:block" aria-hidden="true" />
            <span className="rounded-lg border border-fd-border bg-fd-background px-4 py-3 text-fd-foreground">
              Relay + application state
            </span>
            <ArrowRight className="hidden size-4 sm:block" aria-hidden="true" />
            <span className="rounded-lg border border-fd-border bg-fd-background px-4 py-3 text-fd-foreground">
              Mosaic interface
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
