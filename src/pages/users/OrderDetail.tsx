import { useParams, Link } from "react-router";
import { Check, MapPin, Phone, X as XIcon } from "lucide-react";
import {
  getOrderById,
  getOrderItemsWithProduct,
  getOrderTotal,
  type OrderStatus,
} from "../../data/Mockorders";

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "Pending" },
  { status: "confirmed", label: "Confirmed" },
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" },
];

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-gray-600">Order not found.</p>
        <Link to="/account/orders" className="mt-3 inline-block text-sm font-medium text-brand-blue hover:underline">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const itemsWithProduct = getOrderItemsWithProduct(order);
  const itemsTotal = order.items.reduce((sum, i) => sum + i.priceAtPurchase * i.quantity, 0);
  const total = getOrderTotal(order);
  const currentStepIndex = STEPS.findIndex((s) => s.status === order.status);
  // Matches the earlier decision: customer can cancel any time before "shipped".
  const canCancel = order.status === "pending" || order.status === "confirmed";

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
        <Link to="/account/orders" className="text-sm font-medium text-brand-blue hover:underline">
          ← Back to My Orders
        </Link>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-bold text-gray-900 sm:text-xl">Order {order.id}</h1>
            <p className="text-xs text-gray-400">Placed on {formatDateTime(order.placedAt)}</p>
          </div>
          {canCancel && (
            <button
              type="button"
              className="rounded-full border border-brand-red px-4 py-2 text-sm font-semibold text-brand-red transition-colors hover:bg-red-50"
            >
              Cancel Order
            </button>
          )}
        </div>

        {/* Status tracker */}
        <div className="mt-6">
          {order.status === "cancelled" ? (
            <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-red text-white">
                <XIcon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-brand-red">Order Cancelled</p>
                {order.cancellationReason && (
                  <p className="text-xs text-gray-500">{order.cancellationReason}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-start">
              {STEPS.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const eventTime = order.statusHistory.find((e) => e.status === step.status)?.timestamp;
                return (
                  <div key={step.status} className="flex flex-1 flex-col items-center text-center">
                    <div className="flex w-full items-center">
                      <div
                        className={`h-0.5 flex-1 ${
                          index === 0 ? "invisible" : isCompleted ? "bg-brand-blue" : "bg-gray-200"
                        }`}
                      />
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                          isCompleted ? "bg-brand-blue text-white" : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {isCompleted ? <Check className="h-3.5 w-3.5" /> : index + 1}
                      </span>
                      <div
                        className={`h-0.5 flex-1 ${
                          index === STEPS.length - 1
                            ? "invisible"
                            : index < currentStepIndex
                            ? "bg-brand-blue"
                            : "bg-gray-200"
                        }`}
                      />
                    </div>
                    <p className={`mt-2 text-xs font-medium ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                      {step.label}
                    </p>
                    {eventTime && (
                      <p className="text-[10px] text-gray-400">{formatDateTime(eventTime)}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-3 text-sm font-bold text-gray-900">Items</h2>
        <div className="flex flex-col divide-y divide-gray-100">
          {itemsWithProduct.map(({ product, quantity, priceAtPurchase }) => (
            <div key={product.id} className="flex items-center gap-3 py-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-400">Qty: {quantity}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-[#3654D6]">
                  ₦{(priceAtPurchase * quantity).toLocaleString()}
                </p>
                {order.status === "delivered" && (
                  // TODO: once the Rating & Reviews page exists, deep-link
                  // this to a pre-filled review form for this specific
                  // product/order-item instead of the general reviews page.
                  <Link
                    to="/account/reviews"
                    className="mt-1 inline-block text-xs font-medium text-brand-blue hover:underline"
                  >
                    Leave a Review
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Delivery address */}
        <div className="flex-1 rounded-3xl bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-3 text-sm font-bold text-gray-900">Delivery Address</h2>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
            <div className="text-sm text-gray-700">
              <p className="font-medium text-gray-900">
                {order.address.recipientName}{" "}
                <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
                  {order.address.label}
                </span>
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                <Phone className="h-3 w-3" /> {order.address.recipientPhone}
              </p>
              <p className="mt-1">
                {order.address.addressLine1}
                {order.address.addressLine2 ? `, ${order.address.addressLine2}` : ""}, {order.address.city},{" "}
                {order.address.state}
              </p>
              {order.address.landmark && (
                <p className="text-xs text-gray-400">Landmark: {order.address.landmark}</p>
              )}
            </div>
          </div>
        </div>

        {/* Price breakdown */}
        <div className="flex-1 rounded-3xl bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-3 text-sm font-bold text-gray-900">Order Summary</h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₦{itemsTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Service Fee</span>
              <span>₦{order.serviceFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>{order.deliveryFee > 0 ? `₦${order.deliveryFee.toLocaleString()}` : "Free"}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₦{order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="mt-2 flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-gray-900">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Payment method: {order.paymentMethod} —{" "}
              {order.paymentStatus === "paid"
                ? "Paid"
                : order.paymentStatus === "refunded"
                ? "Refunded"
                : "Unpaid"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}