/**
 * CreditBalance.ts — derives the user's store credit from real order data.
 * -----------------------------------------------------------------------
 * Credit is earned when an order is refunded (paymentStatus === "refunded"
 * in Mockorders.ts) — there's no separate "credit ledger" yet, so this
 * reads directly off MOCK_ORDERS rather than maintaining its own list.
 * Swap for a real GET /credit-balance call later; consumers only care
 * about the shape below, not where it came from.
 */

import { MOCK_ORDERS, getOrderItemsWithProduct, getOrderTotal, type MockOrder } from "./Mockorders";

export type CreditTransactionType = "refund";

export interface CreditTransaction {
  id: string;
  type: CreditTransactionType;
  orderId: string;
  amount: number;
  reason: string;
  /** When the refund was actually processed — falls back to placedAt if
   *  no explicit event is found in the order's status history. */
  processedAt: string; // ISO
  itemNames: string[];
}

function getRefundProcessedDate(order: MockOrder): string {
  const cancelledEvent = order.statusHistory.find((e) => e.status === "cancelled");
  return cancelledEvent?.timestamp ?? order.placedAt;
}

/** Every refunded order becomes one credit transaction. Sorted
 *  newest-first by the caller if needed — this just returns them. */
export function getCreditTransactions(): CreditTransaction[] {
  return MOCK_ORDERS.filter((order) => order.paymentStatus === "refunded").map((order) => {
    const items = getOrderItemsWithProduct(order);
    return {
      id: order.id,
      type: "refund",
      orderId: order.id,
      amount: getOrderTotal(order),
      reason: order.cancellationReason ?? "Order refunded",
      processedAt: getRefundProcessedDate(order),
      itemNames: items.map((i) => i.product.name),
    };
  });
}

/** Total available credit — sum of all refund transactions.
 *  Once credit can be spent (e.g. applied at checkout), this should
 *  subtract a "spent" ledger too — not needed yet since nothing consumes
 *  credit in the app so far. */
export function getCreditBalance(): number {
  return getCreditTransactions().reduce((sum, t) => sum + t.amount, 0);
}