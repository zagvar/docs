"use client";

import { compareDecimals } from "@zagvar/decimal";
import {
  matchesOrdersQuery,
  ordersQuerySchema,
  type OrderDetailsRecord,
  type OrderListItem,
  type OrdersPage,
  type OrdersQuery,
} from "@zagvar/mosaic-core";
import {
  OrderDetails,
  OrdersPanel,
  type OrderDetailsClassNames,
  type OrdersPanelClassNames,
} from "@zagvar/mosaic-react";
import { useMemo, useState } from "react";
import { PreviewFrame } from "./previews";

const previewTimestamp = "2026-07-23T03:30:00.000Z";

const equityOrder: OrderListItem = {
  symbol: "AAPL",
  assetClass: "equity",
  venue: "NASDAQ",
  orderId: "order-aapl-1042",
  accountId: "account-primary",
  replacesOrderId: "order-aapl-1039",
  side: "buy",
  type: "limit",
  tif: "day",
  status: "partially_filled",
  version: 4,
  quoteCurrency: "USD",
  quantity: "1.25",
  filledQuantity: "0.25",
  remainingQuantity: "1",
  filledNotional: "53.03125",
  limitPrice: "212.125",
  averageFillPrice: "212.125",
  submittedAt: "2026-07-23T03:12:00.000Z",
  updatedAt: "2026-07-23T03:17:00.000Z",
  capabilities: {
    cancel: true,
    replace: true,
  },
};

const cryptoOrder: OrderListItem = {
  symbol: "BTC/USD",
  assetClass: "crypto",
  venue: "COINBASE",
  baseAsset: "BTC",
  quoteAsset: "USD",
  orderId: "order-btc-8841",
  accountId: "account-primary",
  side: "sell",
  type: "limit",
  tif: "gtc",
  status: "open",
  version: 2,
  quoteCurrency: "USD",
  quantity: "0.0025",
  filledQuantity: "0",
  remainingQuantity: "0.0025",
  limitPrice: "68420.5",
  submittedAt: "2026-07-23T03:20:00.000Z",
  updatedAt: "2026-07-23T03:20:01.000Z",
  capabilities: {
    cancel: true,
    replace: true,
  },
};

const filledOrder: OrderListItem = {
  symbol: "MSFT",
  assetClass: "equity",
  venue: "NASDAQ",
  orderId: "order-msft-3190",
  accountId: "account-primary",
  side: "sell",
  type: "market",
  tif: "day",
  status: "filled",
  version: 3,
  quoteCurrency: "USD",
  quantity: "3",
  filledQuantity: "3",
  remainingQuantity: "0",
  filledNotional: "1290.39",
  averageFillPrice: "430.13",
  submittedAt: "2026-07-22T23:05:00.000Z",
  updatedAt: "2026-07-22T23:05:02.000Z",
  completedAt: "2026-07-22T23:05:02.000Z",
  capabilities: {
    cancel: false,
    replace: false,
  },
};

const previewOrders = [cryptoOrder, equityOrder, filledOrder];

const orderDetails: OrderDetailsRecord = {
  order: equityOrder,
  fills: [
    {
      fillId: "fill-aapl-1",
      orderId: equityOrder.orderId,
      price: "212.125",
      quantity: "0.25",
      notional: "53.03125",
      liquidity: "maker",
      venue: "NASDAQ",
      timestamp: "2026-07-23T03:17:00.000Z",
      sequence: 1,
    },
  ],
  fees: [
    {
      feeId: "fee-aapl-1",
      orderId: equityOrder.orderId,
      fillId: "fill-aapl-1",
      type: "commission",
      amount: "0.125",
      currency: "USD",
      fractionDigits: 3,
      timestamp: "2026-07-23T03:17:01.000Z",
    },
    {
      feeId: "rebate-aapl-1",
      orderId: equityOrder.orderId,
      fillId: "fill-aapl-1",
      type: "other",
      amount: "-0.005",
      currency: "USD",
      fractionDigits: 3,
      timestamp: "2026-07-23T03:17:01.000Z",
    },
  ],
  events: [
    {
      eventId: "event-aapl-1",
      orderId: equityOrder.orderId,
      status: "pending",
      timestamp: "2026-07-23T03:12:00.000Z",
      sequence: 1,
    },
    {
      eventId: "event-aapl-2",
      orderId: equityOrder.orderId,
      status: "open",
      timestamp: "2026-07-23T03:12:01.000Z",
      sequence: 2,
      reason: {
        code: "broker",
        message: "Accepted by the broker.",
      },
    },
    {
      eventId: "event-aapl-3",
      orderId: equityOrder.orderId,
      status: "partially_filled",
      timestamp: "2026-07-23T03:17:00.000Z",
      sequence: 3,
    },
  ],
  statusReason: {
    code: "broker",
    message: "The remaining quantity is still working.",
  },
};

const ordersPanelClassNames: OrdersPanelClassNames = {
  root: "mosaic-orders",
  header: "mosaic-orders-header",
  title: "mosaic-orders-title",
  scopes: "mosaic-orders-scopes",
  scopeButton: "mosaic-orders-scope-button",
  activeScopeButton: "mosaic-orders-scope-active",
  filters: "mosaic-orders-filters",
  symbolFilterForm: "mosaic-orders-symbol-form",
  symbolFilterField: "mosaic-orders-symbol-field",
  symbolFilterInput: "mosaic-orders-input",
  filterLabel: "mosaic-orders-label",
  filterHint: "mosaic-orders-hint",
  filterError: "mosaic-orders-error",
  applyFilterButton: "mosaic-orders-button",
  filterGroup: "mosaic-orders-filter-group",
  filterSummary: "mosaic-orders-filter-summary",
  filterOptions: "mosaic-orders-filter-options",
  filterOption: "mosaic-orders-filter-option",
  clearFiltersButton: "mosaic-orders-button",
  sortControls: "mosaic-orders-sort",
  sortField: "mosaic-orders-sort-field",
  sortLabel: "mosaic-orders-label",
  sortSelect: "mosaic-orders-select",
  state: "mosaic-orders-state",
  tableContainer: "mosaic-orders-table-container",
  table: "mosaic-orders-table",
  tableHeader: "mosaic-orders-table-head",
  headerRow: "mosaic-orders-header-row",
  columnHeader: "mosaic-orders-column-header",
  body: "mosaic-orders-body",
  row: "mosaic-orders-row",
  buyRow: "mosaic-orders-buy",
  sellRow: "mosaic-orders-sell",
  instrumentCell: "mosaic-orders-cell mosaic-orders-instrument",
  symbol: "mosaic-orders-symbol",
  instrumentMeta: "mosaic-orders-secondary",
  orderCell: "mosaic-orders-cell",
  primary: "mosaic-orders-primary",
  secondary: "mosaic-orders-secondary",
  amountCell: "mosaic-orders-cell",
  priceCell: "mosaic-orders-cell",
  metric: "mosaic-orders-metric",
  metricLabel: "mosaic-orders-metric-label",
  metricValue: "mosaic-orders-metric-value",
  statusCell: "mosaic-orders-cell",
  statusBadge: "mosaic-orders-status",
  timeCell: "mosaic-orders-cell",
  timestamp: "mosaic-orders-timestamp",
  actionsCell: "mosaic-orders-actions-cell",
  detailsButton: "mosaic-orders-button",
  cancelButton: "mosaic-orders-button mosaic-orders-danger",
  replaceButton: "mosaic-orders-button",
  footer: "mosaic-orders-footer",
  pagination: "mosaic-orders-pagination",
  pageSizeField: "mosaic-orders-page-size",
  pageSizeLabel: "mosaic-orders-label",
  pageSizeSelect: "mosaic-orders-select",
  pageActions: "mosaic-orders-page-actions",
  paginationButton: "mosaic-orders-button",
  resultCount: "mosaic-orders-count",
};

const orderDetailsClassNames: OrderDetailsClassNames = {
  root: "mosaic-order-details",
  header: "mosaic-order-details-header",
  title: "mosaic-order-details-title",
  statusBadge: "mosaic-orders-status",
  closeButton: "mosaic-orders-button",
  statusReason: "mosaic-order-details-reason",
  statusReasonLabel: "mosaic-order-details-term",
  statusReasonValue: "mosaic-order-details-value",
  summary: "mosaic-order-details-section",
  sectionTitle: "mosaic-order-details-section-title",
  detailsList: "mosaic-order-details-list",
  detailRow: "mosaic-order-details-row",
  term: "mosaic-order-details-term",
  value: "mosaic-order-details-value",
  identifier: "mosaic-order-details-identifier",
  timestamp: "mosaic-order-details-timestamp",
  relatedOrderButton: "mosaic-order-details-related",
  fills: "mosaic-order-details-section",
  activityTable: "mosaic-order-details-table",
  activityTableHead: "mosaic-order-details-table-head",
  activityTableBody: "mosaic-order-details-table-body",
  activityRow: "mosaic-order-details-table-row",
  activityHeader: "mosaic-order-details-table-header",
  activityCell: "mosaic-order-details-table-cell",
  emptyState: "mosaic-order-details-empty",
  fees: "mosaic-order-details-section",
  timeline: "mosaic-order-details-section",
  timelineList: "mosaic-order-details-timeline",
  timelineItem: "mosaic-order-details-event",
  timelineHeader: "mosaic-order-details-event-header",
  eventStatus: "mosaic-orders-status",
  actions: "mosaic-order-details-actions",
  cancelButton: "mosaic-orders-button mosaic-orders-danger",
  replaceButton: "mosaic-orders-button",
};

export function OrdersPanelPreview() {
  const [query, setQuery] = useState<OrdersQuery>(() =>
    ordersQuerySchema.parse({ scope: "open" }),
  );
  const [status, setStatus] = useState(
    "The preview applies queries to local fixtures.",
  );

  const page = useMemo<OrdersPage>(() => {
    const direction = query.sort.direction === "asc" ? 1 : -1;
    const items = previewOrders
      .filter((order) => matchesOrdersQuery(order, query))
      .sort((left, right) => {
        const comparison =
          query.sort.field === "filledQuantity"
            ? compareDecimals(left.filledQuantity, right.filledQuantity)
            : comparePreviewFields(
                left[query.sort.field],
                right[query.sort.field],
              );

        return comparison * direction;
      });

    return {
      items,
      totalCount: items.length,
      asOf: previewTimestamp,
    };
  }, [query]);

  return (
    <PreviewFrame label="Mixed-instrument fixtures">
      <OrdersPanel
        page={page}
        query={query}
        onQueryChange={setQuery}
        getNumberFormat={(order) =>
          order.assetClass === "crypto"
            ? {
                quantityFractionDigits: 8,
                priceFractionDigits: 2,
                notionalFractionDigits: 2,
              }
            : {
                quantityFractionDigits: 2,
                priceFractionDigits: 3,
                notionalFractionDigits: 2,
              }
        }
        pageSizeOptions={[10, 25, 50]}
        classNames={ordersPanelClassNames}
        onSelectOrder={(order) =>
          setStatus(`Selected ${order.symbol} order ${order.orderId}.`)
        }
        onCancelOrder={(order) =>
          setStatus(`Cancellation requested locally for ${order.symbol}.`)
        }
        onReplaceOrder={(order) =>
          setStatus(`Replace flow requested locally for ${order.symbol}.`)
        }
      />
      <p className="mosaic-preview-status" aria-live="polite">
        {status}
      </p>
    </PreviewFrame>
  );
}

function comparePreviewFields(
  left: string | undefined,
  right: string | undefined,
): number {
  if (left === right) {
    return 0;
  }

  if (left === undefined) {
    return 1;
  }

  if (right === undefined) {
    return -1;
  }

  return left.localeCompare(right);
}

export function OrderDetailsPreview() {
  const [status, setStatus] = useState(
    "Actions in this preview do not call a trading API.",
  );

  return (
    <PreviewFrame label="Authorized details fixture">
      <OrderDetails
        details={orderDetails}
        numberFormat={{
          quantityFractionDigits: 2,
          priceFractionDigits: 3,
          notionalFractionDigits: 5,
        }}
        classNames={orderDetailsClassNames}
        onCancelOrder={(order) =>
          setStatus(`Cancellation requested locally for ${order.orderId}.`)
        }
        onReplaceOrder={(order) =>
          setStatus(`Replace flow requested locally for ${order.orderId}.`)
        }
        onClose={() => setStatus("Close requested locally.")}
        onSelectRelatedOrder={(orderId) =>
          setStatus(`Related order selected: ${orderId}.`)
        }
      />
      <p className="mosaic-preview-status" aria-live="polite">
        {status}
      </p>
    </PreviewFrame>
  );
}
