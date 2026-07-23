"use client";

import {
  createOrderSummary,
  type AssetRules,
  type MarketCandle,
  type MarketQuote,
  type MarketTrade,
  type OrderBookSnapshot,
  type OrderIntent,
} from "@zagvar/mosaic-core";
import {
  canonicalizeUnsignedDecimalLiteral,
  type DecimalString,
} from "@zagvar/decimal";
import {
  OrderBook,
  OrderReview,
  QuoteDisplay,
  RecentTrades,
  TradeTicket,
  TradingChart,
  type OrderBookClassNames,
  type OrderReviewClassNames,
  type QuoteDisplayClassNames,
  type RecentTradesClassNames,
  type TradeTicketClassNames,
  type TradingChartClassNames,
} from "@zagvar/mosaic-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

const baseTimestamp = "2026-07-13T04:00:00.000Z";

const quoteClassNames: QuoteDisplayClassNames = {
  root: "mosaic-quote",
  symbol: "mosaic-quote-symbol",
  quotes: "mosaic-quote-grid",
  quote: "mosaic-quote-item",
  label: "mosaic-market-label",
  price: "mosaic-market-price",
  quantity: "mosaic-market-quantity",
  spread: "mosaic-quote-spread",
};

const recentTradesClassNames: RecentTradesClassNames = {
  root: "mosaic-table-card",
  header: "mosaic-table-header",
  title: "mosaic-table-title",
  table: "mosaic-market-table",
  columns: "mosaic-trade-row mosaic-table-columns",
  column: "mosaic-table-column",
  rows: "mosaic-table-rows",
  row: "mosaic-trade-row mosaic-selectable-row",
  buyRow: "mosaic-trade-buy",
  sellRow: "mosaic-trade-sell",
  unknownRow: "mosaic-trade-unknown",
  price: "mosaic-market-price",
  quantity: "mosaic-market-quantity",
  time: "mosaic-market-time",
  empty: "mosaic-empty",
};

const orderBookClassNames: OrderBookClassNames = {
  root: "mosaic-table-card",
  header: "mosaic-table-header",
  title: "mosaic-table-title",
  table: "mosaic-market-table",
  side: "mosaic-book-side",
  columnHeaders: "mosaic-book-row mosaic-table-columns",
  columnHeader: "mosaic-table-column",
  levels: "mosaic-table-rows",
  level: "mosaic-book-row mosaic-selectable-row",
  bidLevel: "mosaic-book-bid",
  askLevel: "mosaic-book-ask",
  depthBar: "mosaic-book-depth",
  price: "mosaic-market-price",
  quantity: "mosaic-market-quantity",
  total: "mosaic-market-quantity",
  spread: "mosaic-book-spread",
  empty: "mosaic-empty",
};

const ticketClassNames: TradeTicketClassNames = {
  root: "mosaic-ticket",
  availableBalance: {
    root: "mosaic-balance",
    label: "mosaic-muted",
    value: "mosaic-balance-value",
  },
  sideToggle: {
    root: "mosaic-field",
    label: "mosaic-field-label",
    options: "mosaic-segment-options",
    field: "mosaic-segment-field mosaic-side-field",
    button: "mosaic-segment-button",
  },
  typeToggle: {
    root: "mosaic-field",
    label: "mosaic-field-label",
    options: "mosaic-segment-options",
    field: "mosaic-segment-field",
    button: "mosaic-segment-button",
  },
  tifSelect: {
    root: "mosaic-field",
    label: "mosaic-field-label",
    trigger: "mosaic-select-trigger",
    value: "mosaic-select-value",
    indicator: "mosaic-select-indicator",
    popover: "mosaic-select-popover",
    listBox: "mosaic-select-listbox",
    item: "mosaic-select-item",
  },
  numberField: {
    root: "mosaic-field",
    label: "mosaic-field-label",
    control: "mosaic-number-control",
    input: "mosaic-number-input",
    suffix: "mosaic-number-suffix",
    description: "mosaic-muted",
    error: "mosaic-field-error",
  },
  amountPresets: {
    root: "mosaic-presets",
    button: "mosaic-preset-button",
  },
  alert: "mosaic-alert",
  submissionError: "mosaic-field-error",
  submitButton: "mosaic-primary-button",
};

const reviewClassNames: OrderReviewClassNames = {
  root: "mosaic-review",
  title: "mosaic-review-title",
  details: "mosaic-review-details",
  row: "mosaic-review-row",
  term: "mosaic-muted",
  value: "mosaic-review-value",
  warnings: "mosaic-review-warnings",
  warningsTitle: "mosaic-review-warning-title",
  warningList: "mosaic-review-warning-list",
  warning: "mosaic-review-warning",
  actions: "mosaic-review-actions",
  cancelButton: "mosaic-secondary-button",
  refreshButton: "mosaic-secondary-button",
  confirmButton: "mosaic-primary-button",
  confirmationError: "mosaic-field-error",
};

const chartClassNames: TradingChartClassNames = {
  root: "mosaic-chart",
  header: "mosaic-chart-header",
  title: "mosaic-table-title",
  attribution: "mosaic-muted",
  chart: "mosaic-chart-canvas",
};

const cryptoRules: AssetRules = {
  assetClass: "crypto",
  symbol: "BTC/USDT",
  allowedOrderTypes: ["market", "limit"],
  allowedTifs: ["gtc", "ioc"],
  supportsNotional: true,
  notionalOrderTypes: ["market"],
  minQuantity: "0.000001",
  minNotional: "1",
  minPrice: "0.01",
  quantityPrecision: 6,
  pricePrecision: 2,
  notionalPrecision: 2,
  lotSize: "0.000001",
  tickSize: "0.01",
  quoteIncrement: "0.01",
};

const initialQuote: MarketQuote = {
  symbol: "BTC/USDT",
  assetClass: "crypto",
  bidPrice: "67249.8",
  bidQuantity: "0.8421",
  askPrice: "67250.4",
  askQuantity: "0.6148",
  lastPrice: "67250.1",
  timestamp: baseTimestamp,
  mode: "real_time",
  displaySource: "Simulated feed",
};

const initialTrades: MarketTrade[] = Array.from({ length: 8 }, (_, index) => ({
  symbol: "BTC/USDT",
  assetClass: "crypto",
  tradeId: `fixture-${index}`,
  price: toPreviewDecimal(
    67_250.1 + (index % 2 === 0 ? index * 0.18 : -index * 0.14),
    2,
  ),
  quantity: toPreviewDecimal(0.0042 + index * 0.0017, 6),
  side: index % 3 === 0 ? "sell" : "buy",
  timestamp: new Date(Date.parse(baseTimestamp) - index * 1_700).toISOString(),
  sequence: 100 - index,
}));

const orderBookSnapshot: OrderBookSnapshot = {
  symbol: "BTC/USDT",
  assetClass: "crypto",
  bids: createLevels("bid", 67_249.8, 8),
  asks: createLevels("ask", 67_250.4, 8),
  timestamp: baseTimestamp,
  sequence: 100,
  displaySource: "Simulated venue",
};

const reviewOrder: OrderIntent = {
  symbol: "BTC/USDT",
  assetClass: "crypto",
  side: "buy",
  type: "limit",
  tif: "gtc",
  quantity: "0.025",
  limitPrice: "67250",
};

const reviewSummary = createOrderSummary(reviewOrder, {
  marketReference: {
    symbol: "BTC/USDT",
    assetClass: "crypto",
    price: "67250.4",
    kind: "ask",
    timestamp: baseTimestamp,
    mode: "real_time",
    displaySource: "Simulated venue",
  },
  fees: [{ type: "commission", amount: "0.42", currency: "USDT" }],
  now: Date.parse(baseTimestamp),
});

const candles = createCandles();

export function QuoteDisplayPreview() {
  const [quote, setQuote] = useState(initialQuote);
  const tick = useRef(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      tick.current += 1;
      const movement = Math.sin(tick.current * 0.9) * 1.8;
      const bidPrice = 67_249.8 + movement;

      setQuote({
        ...initialQuote,
        bidPrice: toPreviewDecimal(bidPrice, 2),
        askPrice: toPreviewDecimal(bidPrice + 0.6, 2),
        lastPrice: toPreviewDecimal(bidPrice + 0.3, 2),
        bidQuantity: toPreviewDecimal(
          0.7 + (tick.current % 4) * 0.08,
          4,
        ),
        askQuantity: toPreviewDecimal(
          0.58 + (tick.current % 3) * 0.07,
          4,
        ),
        timestamp: new Date().toISOString(),
      });
    }, 1_800);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <PreviewFrame label="Simulated live data">
      <QuoteDisplay
        quote={quote}
        quoteCurrency="USDT"
        priceFractionDigits={2}
        quantityFractionDigits={4}
        classNames={quoteClassNames}
      />
    </PreviewFrame>
  );
}

export function RecentTradesPreview() {
  const [trades, setTrades] = useState(initialTrades);
  const sequence = useRef(101);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const current = sequence.current;
      sequence.current += 1;
      const side = current % 3 === 0 ? "sell" : "buy";
      const movement = Math.sin(current * 0.7) * 2.4;
      const nextTrade: MarketTrade = {
        symbol: "BTC/USDT",
        assetClass: "crypto",
        tradeId: `simulated-${current}`,
        price: toPreviewDecimal(67_250 + movement, 2),
        quantity: toPreviewDecimal(0.002 + (current % 7) * 0.0013, 6),
        side,
        timestamp: new Date().toISOString(),
        sequence: current,
      };

      setTrades((currentTrades) => [nextTrade, ...currentTrades].slice(0, 8));
    }, 2_100);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <PreviewFrame label="Simulated live data">
      <RecentTrades
        trades={trades}
        quoteCurrency="USDT"
        depth={8}
        priceFractionDigits={2}
        quantityFractionDigits={6}
        classNames={recentTradesClassNames}
      />
    </PreviewFrame>
  );
}

export function OrderBookPreview() {
  const [selectedPrice, setSelectedPrice] = useState<DecimalString>();

  return (
    <PreviewFrame label="Deterministic snapshot">
      <OrderBook
        snapshot={orderBookSnapshot}
        quoteCurrency="USDT"
        depth={6}
        priceFractionDigits={2}
        quantityFractionDigits={4}
        classNames={orderBookClassNames}
        onSelectPrice={(price) => setSelectedPrice(price)}
      />
      <SelectionStatus value={selectedPrice} />
    </PreviewFrame>
  );
}

export function TradeTicketPreview() {
  const [submittedOrder, setSubmittedOrder] = useState<OrderIntent>();

  return (
    <PreviewFrame label="Interactive example">
      <TradeTicket
        symbol="BTC/USDT"
        assetClass="crypto"
        assetRules={cryptoRules}
        cashAvailable="10000"
        assetQuantityAvailable="0.5"
        quoteCurrency="USDT"
        defaultValue={{
          side: "buy",
          type: "limit",
          tif: "gtc",
          quantity: "0.025",
          limitPrice: "67250",
        }}
        amountPresets={[25, 50, 75, 100]}
        classNames={ticketClassNames}
        onSubmit={(order) => setSubmittedOrder(order)}
      />
      <p className="mosaic-preview-status" aria-live="polite">
        {submittedOrder === undefined
          ? "Try changing the draft or submitting the sample order."
          : `${submittedOrder.side.toUpperCase()} ${submittedOrder.quantity ?? submittedOrder.notional} ${submittedOrder.symbol} intent created locally.`}
      </p>
    </PreviewFrame>
  );
}

export function OrderReviewPreview() {
  const [status, setStatus] = useState(
    "Review the application-provided estimate.",
  );

  return (
    <PreviewFrame label="Deterministic order summary">
      <OrderReview
        summary={reviewSummary}
        quoteCurrency="USDT"
        marketReferenceDisplay="full"
        priceFractionDigits={2}
        quantityFractionDigits={6}
        classNames={reviewClassNames}
        onCancel={() => setStatus("Review cancelled locally.")}
        onConfirm={() => setStatus("Order intent confirmed locally.")}
      />
      <p className="mosaic-preview-status" aria-live="polite">
        {status}
      </p>
    </PreviewFrame>
  );
}

export function TradingChartPreview() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    const updateTheme = () =>
      setTheme(root.classList.contains("dark") ? "dark" : "light");
    const observer = new MutationObserver(updateTheme);

    updateTheme();
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <PreviewFrame label="Deterministic candle data">
      <TradingChart
        symbol="BTC/USDT"
        candles={candles}
        height={360}
        showVolume
        theme={theme}
        classNames={chartClassNames}
      />
    </PreviewFrame>
  );
}

export function PreviewFrame({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="mosaic-preview not-prose">
      <div className="mosaic-preview-toolbar">
        <span className="mosaic-preview-dot" aria-hidden="true" />
        <span>Rendered from @zagvar/mosaic-react</span>
        <span className="mosaic-preview-label">{label}</span>
      </div>
      <div className="mosaic-preview-canvas">{children}</div>
      <p className="mosaic-preview-note">
        This preview applies Zagvar Docs styling. Mosaic provides accessible
        structure, behavior, and styling slots without imposing a visual theme.
      </p>
    </div>
  );
}

function SelectionStatus({ value }: { value: DecimalString | undefined }) {
  return (
    <p className="mosaic-preview-status" aria-live="polite">
      {value === undefined
        ? "Select a bid or ask level."
        : `Selected limit price: ${value} USDT`}
    </p>
  );
}

function createLevels(side: "bid" | "ask", bestPrice: number, count: number) {
  return Array.from({ length: count }, (_, index) => ({
    price: toPreviewDecimal(
      bestPrice + (side === "bid" ? -1 : 1) * index * 0.5,
      2,
    ),
    quantity: toPreviewDecimal(0.32 + ((index * 7) % 9) * 0.11, 4),
    orderCount: 2 + ((index * 3) % 8),
  }));
}

function createCandles(): MarketCandle[] {
  const start = Date.parse("2026-07-12T20:00:00.000Z");
  let close = 67_180;

  return Array.from({ length: 48 }, (_, index) => {
    const open = close;
    const drift = Math.sin(index / 4) * 24 + ((index * 17) % 31) - 13;
    close = Number((open + drift).toFixed(2));
    const high = Number(
      (Math.max(open, close) + 12 + (index % 5) * 4).toFixed(2),
    );
    const low = Number(
      (Math.min(open, close) - 10 - (index % 4) * 5).toFixed(2),
    );

    return {
      timestamp: new Date(start + index * 5 * 60_000).toISOString(),
      open: toPreviewDecimal(open, 2),
      high: toPreviewDecimal(high, 2),
      low: toPreviewDecimal(low, 2),
      close: toPreviewDecimal(close, 2),
      volume: toPreviewDecimal(1.2 + ((index * 11) % 23) * 0.28, 3),
    };
  });
}

function toPreviewDecimal(
  value: number,
  decimalPlaces: number,
): DecimalString {
  return canonicalizeUnsignedDecimalLiteral(value.toFixed(decimalPlaces));
}
