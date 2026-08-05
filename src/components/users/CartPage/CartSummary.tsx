import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { CartItem } from "../../users/CartPage/CartContext";
import { getProductById } from "../../../data/mockSearchItems";
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

  const products = items
    .map((item) => ({ item, product: getProductById(item.productId) }))
    .filter((entry): entry is { item: CartItem; product: NonNullable<ReturnType<typeof getProductById>> } =>
      Boolean(entry.product)
    );

  const subtotal = products.reduce(
    (sum, { item, product }) => sum + product.originalPrice * item.quantity,
    0
  );
  const discountAmount = products.reduce(
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
  const shippingFee = hasItems ? SHIPPING_FEE : 0;
  const taxFee = hasItems ? TAX_FEE : 0;
  const total = subtotal - discountAmount + shippingFee + taxFee;

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
          <span className="font-medium text-rose-500">- ₦{discountAmount.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Shipping Fee</span>
          <span className="font-medium text-gray-900">₦{shippingFee.toLocaleString()}</span>
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

      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="Add promo code"
          className="min-w-0 flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#3654D6] focus:outline-none"
        />
        {/* TODO: wire up to a real promo/coupon endpoint once the backend exists */}
        <button
          type="button"
          className="shrink-0 cursor-pointer rounded-full bg-[#3654D6] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2d47bd]"
        >
          Apply
        </button>
      </div>

      <button
        type="button"
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