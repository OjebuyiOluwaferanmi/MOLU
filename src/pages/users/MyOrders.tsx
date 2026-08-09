import { Link } from "react-router";
import {
  MOCK_ORDERS,
  getOrderItemsWithProduct,
  getOrderTotal,
  type OrderStatus,
} from "../../data/Mockorders";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MyOrders() {
  const orders = [...MOCK_ORDERS].sort(
    (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
  );

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
      <h1 className="mb-4 text-lg font-bold text-gray-900 sm:text-xl">My Orders</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <p className="text-sm text-gray-500">You haven&apos;t placed any orders yet.</p>
          <Link to="/" className="text-sm font-medium text-brand-blue hover:underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => {
            const itemsWithProduct = getOrderItemsWithProduct(order);
            const firstItem = itemsWithProduct[0];
            const extraCount = itemsWithProduct.length - 1;

            return (
              <Link
                key={order.id}
                to={`/account/orders/${order.id}`}
                className="flex flex-col gap-3 rounded-2xl border border-gray-100 p-3 transition-colors hover:border-brand-blue/40 hover:bg-gray-50 sm:flex-row sm:items-center sm:gap-4 sm:p-4"
              >
                {firstItem && (
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                    <img
                      src={firstItem.product.image}
                      alt={firstItem.product.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{order.id}</p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[order.status]}`}
                    >
                      {STATUS_LABEL[order.status]}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-gray-600">
                    {firstItem?.product.name}
                    {extraCount > 0 && ` + ${extraCount} more item${extraCount > 1 ? "s" : ""}`}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">Placed on {formatDate(order.placedAt)}</p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-[#3654D6]">
                    ₦{getOrderTotal(order).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {order.paymentStatus === "paid"
                      ? "Paid"
                      : order.paymentStatus === "refunded"
                      ? "Refunded"
                      : "Unpaid"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}