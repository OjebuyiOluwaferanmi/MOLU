/**
 * MockCoupons.ts — placeholder for admin-generated coupons/offers.
 * -----------------------------------------------------------------------
 * In v1, coupons are created by admins (via the admin panel, built later)
 * and just consumed here. This file stands in for that: shape it exactly
 * like the real GET /coupons response will look, so swapping this for a
 * real fetch later is a one-file change — CouponsOffers.tsx doesn't need
 * to know or care where the data comes from.
 */

export type CouponType = "percentage" | "fixed" | "free-shipping";
export type CouponStatus = "active" | "used" | "expired";

export interface MockCoupon {
  id: string;
  code: string;
  title: string;
  description: string;
  type: CouponType;
  /** Percentage off (0-100) when type is "percentage", or a flat naira
   *  amount off when type is "fixed". Ignored for "free-shipping". */
  value: number;
  /** Minimum cart subtotal required to use this coupon, in naira. */
  minSpend?: number;
  /** Optional cap on how much a percentage coupon can discount, in naira. */
  maxDiscount?: number;
  categoryLabel?: string;
  expiresAt: string; // ISO date
  status: CouponStatus;
}

export const MOCK_COUPONS: MockCoupon[] = [
  {
    id: "cpn-1",
    code: "WELCOME15",
    title: "15% Off Your First Order",
    description: "New to Molu? Get 15% off any order, up to ₦10,000 off.",
    type: "percentage",
    value: 15,
    minSpend: 10000,
    maxDiscount: 10000,
    expiresAt: "2026-09-30",
    status: "active",
  },
  {
    id: "cpn-2",
    code: "PHONES5K",
    title: "₦5,000 Off Phones & Tablets",
    description: "Save ₦5,000 on any phone or tablet purchase above ₦100,000.",
    type: "fixed",
    value: 5000,
    minSpend: 100000,
    categoryLabel: "Phones & Tablets",
    expiresAt: "2026-08-25",
    status: "active",
  },
  {
    id: "cpn-3",
    code: "FREESHIP",
    title: "Free Shipping",
    description: "Free delivery on any order, no minimum spend required.",
    type: "free-shipping",
    value: 0,
    expiresAt: "2026-08-31",
    status: "active",
  },
  {
    id: "cpn-4",
    code: "FASHION20",
    title: "20% Off Fashion",
    description: "20% off everything in Fashion, up to ₦8,000 off.",
    type: "percentage",
    value: 20,
    minSpend: 15000,
    maxDiscount: 8000,
    categoryLabel: "Fashion",
    expiresAt: "2026-07-15",
    status: "expired",
  },
  {
    id: "cpn-5",
    code: "AUG10",
    title: "₦10,000 Off Electronics",
    description: "Save big on electronics purchases above ₦150,000.",
    type: "fixed",
    value: 10000,
    minSpend: 150000,
    categoryLabel: "Electronics",
    expiresAt: "2026-08-10",
    status: "used",
  },
];