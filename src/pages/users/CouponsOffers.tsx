import { useState } from "react";
import { MOCK_COUPONS, type CouponStatus } from "../../data/MockCoupons";
import { CouponCard } from "../../components/users/Coupons/CouponCard";

const FILTERS: { id: CouponStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "used", label: "Used" },
  { id: "expired", label: "Expired" },
];

export default function CouponsOffers() {
  const [filter, setFilter] = useState<CouponStatus | "all">("all");

  const coupons =
    filter === "all" ? MOCK_COUPONS : MOCK_COUPONS.filter((c) => c.status === filter);

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
      <h1 className="mb-4 text-lg font-bold text-gray-900 sm:text-xl">Coupons & Offers</h1>

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f.id
                ? "bg-[#3654D6] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {coupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <p className="text-sm text-gray-500">No coupons here yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      )}
    </div>
  );
}