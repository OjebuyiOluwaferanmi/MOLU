import { useState } from "react";
import { Check, Copy, Truck, Percent, Tag } from "lucide-react";
import type { MockCoupon } from "../../../data/MockCoupons";

const STATUS_STYLES: Record<MockCoupon["status"], string> = {
  active: "bg-green-100 text-green-700",
  used: "bg-gray-100 text-gray-500",
  expired: "bg-red-100 text-red-700",
};

const STATUS_LABEL: Record<MockCoupon["status"], string> = {
  active: "Active",
  used: "Used",
  expired: "Expired",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function CouponIcon({ type }: { type: MockCoupon["type"] }) {
  if (type === "free-shipping") return <Truck className="h-5 w-5" />;
  if (type === "percentage") return <Percent className="h-5 w-5" />;
  return <Tag className="h-5 w-5" />;
}

export function CouponCard({ coupon }: { coupon: MockCoupon }) {
  const [copied, setCopied] = useState(false);
  const isUsable = coupon.status === "active";

  const handleCopy = async () => {
    if (!isUsable) return;
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — fail silently, code is still visible on card
    }
  };

  return (
    <div
      className={`relative flex flex-col gap-3 overflow-hidden rounded-2xl border p-4 sm:p-5 ${
        isUsable ? "border-gray-100" : "border-gray-100 opacity-60"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#3654D6]">
            <CouponIcon type={coupon.type} />
          </span>
          <div>
            <p className="text-sm font-bold text-gray-900">{coupon.title}</p>
            {coupon.categoryLabel && (
              <p className="text-xs text-gray-400">{coupon.categoryLabel}</p>
            )}
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[coupon.status]}`}
        >
          {STATUS_LABEL[coupon.status]}
        </span>
      </div>

      <p className="text-sm text-gray-600">{coupon.description}</p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
        {coupon.minSpend && <span>Min. spend ₦{coupon.minSpend.toLocaleString()}</span>}
        <span>Expires {formatDate(coupon.expiresAt)}</span>
      </div>

      <div className="mt-1 flex items-center justify-between gap-2 rounded-xl border border-dashed border-gray-200 px-3 py-2.5">
        <span className="font-mono text-sm font-semibold tracking-wide text-gray-800">
          {coupon.code}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!isUsable}
          aria-label={copied ? "Code copied" : "Copy coupon code"}
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            isUsable
              ? "cursor-pointer bg-[#3654D6] text-white hover:bg-[#2d47bd]"
              : "cursor-not-allowed bg-gray-100 text-gray-400"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}