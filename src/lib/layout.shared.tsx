import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { gitConfig } from './shared';

function ZagvarTitle() {
  return (
    <span className="flex items-center gap-2.5 font-semibold tracking-tight">
      <span
        aria-hidden="true"
        className="grid size-7 place-items-center rounded-lg bg-fd-primary text-xs font-bold text-fd-primary-foreground shadow-sm"
      >
        Z
      </span>
      <span>Zagvar</span>
    </span>
  );
}

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <ZagvarTitle />,
    },
    links: [
      {
        text: 'Mosaic',
        url: '/docs/mosaic',
        active: 'nested-url',
      },
      {
        text: 'Relay',
        url: '/docs/relay',
        active: 'nested-url',
      },
      {
        text: 'Decimal',
        url: '/docs/decimal',
        active: 'nested-url',
      },
      {
        text: 'Integration guides',
        url: '/docs/guides',
        active: 'nested-url',
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    searchToggle: {
      enabled: true,
    },
    themeSwitch: {
      enabled: true,
    },
  };
}
