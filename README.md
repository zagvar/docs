# Zagvar Docs

Unified documentation for [Mosaic](https://github.com/zagvar/mosaic) and
[Relay](https://github.com/zagvar/relay).

Mosaic provides accessible, composable trading UI foundations. Relay provides
provider-neutral market-data ingestion, caching, pub/sub, hydration, and
realtime delivery. This site documents each project independently and explains
how applications can use them together without coupling their package
boundaries.

## Development

Requires pnpm 11.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```bash
pnpm types:check
pnpm lint
pnpm build
```

## Content

Documentation pages live in `content/docs`. Fumadocs navigation is controlled
by the `meta.json` files in each content directory.

The site is content-first and does not depend directly on unpublished local
Mosaic or Relay packages.
