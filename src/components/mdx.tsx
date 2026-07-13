import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import {
  OrderBookPreview,
  OrderReviewPreview,
  QuoteDisplayPreview,
  RecentTradesPreview,
  TradeTicketPreview,
  TradingChartPreview,
} from '@/components/mosaic/previews';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    OrderBookPreview,
    OrderReviewPreview,
    QuoteDisplayPreview,
    RecentTradesPreview,
    TradeTicketPreview,
    TradingChartPreview,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
