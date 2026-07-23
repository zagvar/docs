# Zagvar Docs

Unified documentation for [Decimal](https://github.com/zagvar/decimal),
[Mosaic](https://github.com/zagvar/mosaic), and
[Relay](https://github.com/zagvar/relay).

Decimal provides strict decimal-string contracts and exact arithmetic. Mosaic
provides accessible, composable trading UI building blocks. Relay provides
provider-neutral market-data ingestion, caching, pub/sub, hydration, and
real-time delivery. This site documents each project and explains how they fit
together in a trading application.

## Development

Requires pnpm 11.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```bash
pnpm verify
```

This runs type generation and checking, ESLint, and the production build.

Set `NEXT_PUBLIC_SITE_URL` to the public origin in deployment environments so
canonical social metadata and generated Open Graph image URLs use the correct
host. Vercel deployments fall back to `VERCEL_PROJECT_PRODUCTION_URL`.

## Content

Documentation pages live in `content/docs`. Fumadocs navigation is controlled
by the `meta.json` files in each content directory.

The site is content-first and compiles its examples against published Zagvar
packages rather than unpublished local source.
