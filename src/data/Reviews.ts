/**
 * Reviews.ts — derives the account "Rating & Reviews" list from real
 * delivered orders, instead of a hand-authored fake list.
 * -----------------------------------------------------------------------
 * Two moving parts:
 *  - getReviewableItems(): every (product, order) pair from a delivered
 *    order, merged with a submitted review if one exists.
 *  - SUBMITTED_REVIEWS: in-memory store of what the user has actually
 *    written — swap for a real POST/GET /reviews once there's a backend.
 *
 * Because productId here is a REAL id from mockSearchItems.ts, a review
 * submitted through this page is also readable from getSubmittedReviewsForProduct(),
 * which ProductDetailsTabs.tsx uses to show it on the product page too.
 */

import { MOCK_ORDERS } from "./Mockorders";
import { getProductById } from "./mockSearchItems";

export interface SubmittedReview {
  id: string; // `${productId}-${orderId}` — one review per item per order
  productId: string;
  orderId: string;
  rating: number;
  comment: string;
  reviewedAt: string; // ISO
}

// Seeded with one example so "Reviewed" state has something to show —
// matches the iPhone 14 Pro Max from the delivered MLU-20260728-104 order.
const SUBMITTED_REVIEWS: SubmittedReview[] = [
  {
    id: "1-MLU-20260728-104",
    productId: "1",
    orderId: "MLU-20260728-104",
    rating: 5,
    comment: "Fast delivery and the phone works perfectly. Camera quality is amazing, exactly as described.",
    reviewedAt: "2026-07-30T10:12:00Z",
  },
];

export interface ReviewableItem {
  id: string; // `${productId}-${orderId}`
  productId: string;
  productName: string;
  productImage: string;
  orderId: string;
  purchasedAt: string; // ISO — order's placedAt
  rating: number | null; // null = not yet reviewed
  comment: string | null;
  reviewedAt: string | null;
}

/** Every item from a delivered order becomes a reviewable entry, merged
 *  with a submitted review if the user already left one. Re-run this
 *  after submitReview() to get a fresh, up-to-date list. */
export function getReviewableItems(): ReviewableItem[] {
  const items: ReviewableItem[] = [];
  const deliveredOrders = MOCK_ORDERS.filter((o) => o.status === "delivered");

  for (const order of deliveredOrders) {
    for (const entry of order.items) {
      const product = getProductById(entry.productId);
      if (!product) continue;

      const id = `${entry.productId}-${order.id}`;
      const submitted = SUBMITTED_REVIEWS.find((r) => r.id === id);

      items.push({
        id,
        productId: entry.productId,
        productName: product.name,
        productImage: product.image,
        orderId: order.id,
        purchasedAt: order.placedAt,
        rating: submitted?.rating ?? null,
        comment: submitted?.comment ?? null,
        reviewedAt: submitted?.reviewedAt ?? null,
      });
    }
  }

  return items;
}

/** Mutates the in-memory store to simulate submitting a review — swap for
 *  a real POST /reviews call once the backend exists. Handles both first
 *  submission and editing an existing review for the same item/order. */
export function submitReview(
  productId: string,
  orderId: string,
  rating: number,
  comment: string
) {
  const id = `${productId}-${orderId}`;
  const existing = SUBMITTED_REVIEWS.find((r) => r.id === id);
  const reviewedAt = new Date().toISOString();

  if (existing) {
    existing.rating = rating;
    existing.comment = comment;
    existing.reviewedAt = reviewedAt;
  } else {
    SUBMITTED_REVIEWS.push({ id, productId, orderId, rating, comment, reviewedAt });
  }
}

/** All user-submitted reviews for a given product — read by
 *  ProductDetailsTabs.tsx to merge into that product's review list. */
export function getSubmittedReviewsForProduct(productId: string): SubmittedReview[] {
  return SUBMITTED_REVIEWS.filter((r) => r.productId === productId);
}