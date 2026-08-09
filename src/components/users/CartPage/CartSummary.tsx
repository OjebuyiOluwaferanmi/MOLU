import { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router";
import type { CartItem } from "../../users/CartPage/CartContext";
import { getProductById } from "../../../data/mockSearchItems";
import { MOCK_COUPONS, type MockCoupon } from "../../../data/MockCoupons";
import { useAuth } from "../Auth/AuthContext";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  WhatsAppIcon,
} from "../ProductDetails/icons";

// Flat placeholder fees — swap for real shipping/tax calculation once the
// backend exists.
const SHIPPING_FEE = 3500;
const TAX_FEE = 4000;

export function CartSummary({ items }: { items: CartItem[] }) {
  const [promoCode, setPromoCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<MockCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  const products = items
    .map((item) => ({ item, product: getProductById(item.productId) }))
    .filter((entry): entry is { item: CartItem; product: NonNullable<ReturnType<typeof getProductById>> } =>
      Boolean(entry.product)
    );

  const subtotal = products.reduce(
    (sum, { item, product }) => sum + product.originalPrice * item.quantity,
    0
  );
  const productDiscount = products.reduce(
    (sum, { item, product }) => sum + (product.originalPrice - product.price) * item.quantity,
    0
  );

  // Only show a single "-X%" label when every line item shares the same
  // discount percent — otherwise the amount alone is shown.
  const discountPercents = new Set(products.map(({ product }) => product.discountPercent));
  const discountLabel =
    discountPercents.size === 1 && products.length > 0
      ? `Discount (-${products[0].product.discountPercent}%)`
      : "Discount";

  const hasItems = products.length > 0;
  const amountAfterProductDiscount = subtotal - productDiscount;

  // What the coupon actually takes off, based on its type.
  let couponDiscount = 0;
  let freeShipping = false;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percentage") {
      const raw = (amountAfterProductDiscount * appliedCoupon.value) / 100;
      couponDiscount = appliedCoupon.maxDiscount ? Math.min(raw, appliedCoupon.maxDiscount) : raw;
    } else if (appliedCoupon.type === "fixed") {
      couponDiscount = appliedCoupon.value;
    } else if (appliedCoupon.type === "free-shipping") {
      freeShipping = true;
    }
  }

  const shippingFee = hasItems ? (freeShipping ? 0 : SHIPPING_FEE) : 0;
  const taxFee = hasItems ? TAX_FEE : 0;
  const total = Math.max(0, amountAfterProductDiscount - couponDiscount + shippingFee + taxFee);

  const handleApplyCoupon = () => {
    const code = promoCode.trim().toUpperCase();
    setCouponError(null);

    if (!code) return;

    const match = MOCK_COUPONS.find((c) => c.code.toUpperCase() === code);

    if (!match) {
      setAppliedCoupon(null);
      setCouponError("That coupon code isn't valid.");
      return;
    }
    if (match.status === "used") {
      setAppliedCoupon(null);
      setCouponError("You've already used this coupon.");
      return;
    }
    if (match.status === "expired" || new Date(match.expiresAt) < new Date()) {
      setAppliedCoupon(null);
      setCouponError("This coupon has expired.");
      return;
    }
    if (match.minSpend && amountAfterProductDiscount < match.minSpend) {
      setAppliedCoupon(null);
      setCouponError(`Spend at least ₦${match.minSpend.toLocaleString()} to use this coupon.`);
      return;
    }

    setAppliedCoupon(match);
    setCouponError(null);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    setPromoCode("");
  };

  const handleCheckout = () => {
    if (!hasItems) return;

    if (isSignedIn) {
      // /checkout doesn't exist yet — this will 404 until it's built,
      // which is expected at this stage.
      navigate("/checkout");
    } else {
      // Same pattern as RequireAuth: remember where they were, so Login
      // can send them right back here once they've signed in.
      navigate("/login", { state: { from: "/cart" } });
    }
  };

  return (
    <aside className="w-full shrink-0 rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:w-80 lg:sticky lg:top-24 lg:self-start">
      <h2 className="text-base font-bold text-gray-900">Order Summary</h2>

      <div className="mt-4 flex flex-col gap-2.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium text-gray-900">₦{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">{discountLabel}</span>
          <span className="font-medium text-rose-500">- ₦{productDiscount.toLocaleString()}</span>
        </div>
        {appliedCoupon && (
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Coupon ({appliedCoupon.code})</span>
            <span className="font-medium text-rose-500">
              {appliedCoupon.type === "free-shipping"
                ? "Free shipping"
                : `- ₦${couponDiscount.toLocaleString()}`}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Shipping Fee</span>
          <span className="font-medium text-gray-900">
            {freeShipping ? (
              <>
                <span className="mr-1 text-gray-400 line-through">₦{SHIPPING_FEE.toLocaleString()}</span>
                ₦0
              </>
            ) : (
              `₦${shippingFee.toLocaleString()}`
            )}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Tax & Service Fee</span>
          <span className="font-medium text-gray-900">₦{taxFee.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="text-base font-bold text-gray-900">Total</span>
        <span className="text-lg font-bold text-[#3654D6]">₦{total.toLocaleString()}</span>
      </div>

      <div className="mt-4">
        {appliedCoupon ? (
          <div className="flex items-center justify-between gap-2 rounded-full border border-dashed border-[#3654D6] bg-blue-50 px-4 py-2.5">
            <span className="text-sm font-semibold text-[#3654D6]">{appliedCoupon.code} applied</span>
            <button
              type="button"
              onClick={handleRemoveCoupon}
              aria-label="Remove coupon"
              className="flex shrink-0 cursor-pointer items-center justify-center rounded-full p-1 text-[#3654D6] hover:bg-blue-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value);
                if (couponError) setCouponError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleApplyCoupon();
                }
              }}
              placeholder="Add promo code"
              className="min-w-0 flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#3654D6] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={!promoCode.trim()}
              className="shrink-0 cursor-pointer rounded-full bg-[#3654D6] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2d47bd] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        )}
        {couponError && <p className="mt-2 text-xs text-rose-500">{couponError}</p>}
      </div>

      <button
        type="button"
        onClick={handleCheckout}
        disabled={!hasItems}
        className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#3654D6] py-3.5 text-base font-bold text-white transition-colors hover:bg-[#2d47bd] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Go to Checkout
        <ArrowRight className="h-4 w-4" />
      </button>

      <div className="mt-5 flex flex-col items-center gap-2">
        <p className="text-xs text-gray-500">Share your cart with others:</p>
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Share on Facebook" className="cursor-pointer hover:opacity-80">
            <FacebookIcon />
          </button>
          <button type="button" aria-label="Share on Instagram" className="cursor-pointer hover:opacity-80">
            <InstagramIcon />
          </button>
          <button type="button" aria-label="Share on WhatsApp" className="cursor-pointer hover:opacity-80">
            <WhatsAppIcon />
          </button>
          <button type="button" aria-label="Share on X" className="cursor-pointer hover:opacity-80">
            <TwitterIcon />
          </button>
        </div>
      </div>
    </aside>
  );
}