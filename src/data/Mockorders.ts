import { getProductById } from "./mockSearchItems";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "paid" | "unpaid" | "refunded";

export interface OrderAddress {
  label: string;
  recipientName: string;
  recipientPhone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  landmark?: string;
}

export interface OrderItemEntry {
  productId: string;
  quantity: number;
  /** Snapshot of the price at purchase time — never read live product.price
   *  for an existing order, since prices can change after the fact. */
  priceAtPurchase: number;
}

export interface StatusEvent {
  status: OrderStatus;
  timestamp: string; // ISO date string
}

export interface MockOrder {
  id: string;
  placedAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: "Paystack" | "Pay on Delivery";
  items: OrderItemEntry[];
  address: OrderAddress;
  serviceFee: number;
  deliveryFee: number;
  discount: number;
  statusHistory: StatusEvent[];
  cancellationReason?: string;
}

const sampleAddress: OrderAddress = {
  label: "Home",
  recipientName: "Oluwaferanmi Ojebuyi",
  recipientPhone: "+234 913 253 1257",
  addressLine1: "14 Adeyemi Street",
  addressLine2: "Off Allen Avenue",
  city: "Ikeja",
  state: "Lagos",
  landmark: "Behind Zenith Bank",
};

export const MOCK_ORDERS: MockOrder[] = [
  {
    id: "MLU-20260728-104",
    placedAt: "2026-07-28T10:15:00Z",
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "Paystack",
    items: [
      { productId: "1", quantity: 1, priceAtPurchase: 850000 },
      { productId: "5", quantity: 1, priceAtPurchase: 210000 },
    ],
    address: sampleAddress,
    serviceFee: 500,
    deliveryFee: 0,
    discount: 0,
    statusHistory: [
      { status: "pending", timestamp: "2026-07-28T10:15:00Z" },
      { status: "confirmed", timestamp: "2026-07-28T11:02:00Z" },
      { status: "shipped", timestamp: "2026-07-29T09:40:00Z" },
      { status: "delivered", timestamp: "2026-07-31T14:20:00Z" },
    ],
  },
  {
    id: "MLU-20260802-057",
    placedAt: "2026-08-02T16:42:00Z",
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "Paystack",
    items: [{ productId: "9", quantity: 2, priceAtPurchase: 35000 }],
    address: sampleAddress,
    serviceFee: 100,
    deliveryFee: 0,
    discount: 3000,
    statusHistory: [
      { status: "pending", timestamp: "2026-08-02T16:42:00Z" },
      { status: "confirmed", timestamp: "2026-08-02T17:10:00Z" },
      { status: "shipped", timestamp: "2026-08-03T08:05:00Z" },
    ],
  },
  {
    id: "MLU-20260804-233",
    placedAt: "2026-08-04T09:05:00Z",
    status: "confirmed",
    paymentStatus: "unpaid",
    paymentMethod: "Pay on Delivery",
    items: [{ productId: "20", quantity: 1, priceAtPurchase: 78000 }],
    address: sampleAddress,
    serviceFee: 150,
    deliveryFee: 0,
    discount: 0,
    statusHistory: [
      { status: "pending", timestamp: "2026-08-04T09:05:00Z" },
      { status: "confirmed", timestamp: "2026-08-04T09:30:00Z" },
    ],
  },
  {
    id: "MLU-20260805-018",
    placedAt: "2026-08-05T12:00:00Z",
    status: "pending",
    paymentStatus: "unpaid",
    paymentMethod: "Paystack",
    items: [{ productId: "3", quantity: 1, priceAtPurchase: 420000 }],
    address: sampleAddress,
    serviceFee: 200,
    deliveryFee: 0,
    discount: 0,
    statusHistory: [{ status: "pending", timestamp: "2026-08-05T12:00:00Z" }],
  },
  {
    id: "MLU-20260701-091",
    placedAt: "2026-07-01T08:20:00Z",
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "Paystack",
    items: [{ productId: "7", quantity: 1, priceAtPurchase: 480000 }],
    address: sampleAddress,
    serviceFee: 200,
    deliveryFee: 0,
    discount: 0,
    statusHistory: [
      { status: "pending", timestamp: "2026-07-01T08:20:00Z" },
      { status: "cancelled", timestamp: "2026-07-01T09:00:00Z" },
    ],
    cancellationReason: "Cancelled by customer before shipping",
  },
];

export function getOrderById(id: string): MockOrder | undefined {
  return MOCK_ORDERS.find((order) => order.id === id);
}

/** Resolves each order line's productId into the full product record
 *  (image, name) — pairs it with the order-specific quantity/price. */
export function getOrderItemsWithProduct(order: MockOrder) {
  return order.items
    .map((entry) => {
      const product = getProductById(entry.productId);
      if (!product) return null;
      return { ...entry, product };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));
}

export function getOrderTotal(order: MockOrder) {
  const itemsTotal = order.items.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  );
  return itemsTotal + order.serviceFee + order.deliveryFee - order.discount;
}