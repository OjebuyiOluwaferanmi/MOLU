/**
 * MockMessages.ts — placeholder for the user's Inbox.
 * -----------------------------------------------------------------------
 * Shaped like a real GET /messages response would be, so swapping this
 * for a live fetch later only touches this file — Inbox.tsx and
 * MessageDetail.tsx don't need to know or care where the data comes from.
 *
 * "Read" state lives here in-memory for now (see markAsRead below) —
 * once there's a backend, that becomes a real PATCH /messages/:id call
 * instead of mutating this array directly.
 */

export type MessageType = "order" | "support" | "promo" | "system";

export interface MockMessage {
  id: string;
  type: MessageType;
  senderName: string;
  subject: string;
  preview: string;
  body: string;
  isRead: boolean;
  createdAt: string; // ISO date
  /** If this message relates to a specific order, link straight to it. */
  relatedOrderId?: string;
}

export const MOCK_MESSAGES: MockMessage[] = [
  {
    id: "msg-1",
    type: "order",
    senderName: "Molu Logistics",
    subject: "Your order has been shipped",
    preview: "Good news! Your order MLU-20260805-018 is on its way...",
    body: "Good news! Your order MLU-20260805-018 is on its way and should arrive within 2-3 business days. You can track its progress from the order details page at any time.",
    isRead: false,
    createdAt: "2026-08-07T09:14:00Z",
    relatedOrderId: "MLU-20260805-018",
  },
  {
    id: "msg-2",
    type: "support",
    senderName: "Molu Support",
    subject: "Re: Question about my Basmati Rice order",
    preview: "Thanks for reaching out! We've confirmed with the seller that...",
    body: "Thanks for reaching out! We've confirmed with the seller that your order will be repackaged before dispatch to avoid the issue you mentioned. Let us know if you have any other questions.",
    isRead: false,
    createdAt: "2026-08-06T15:42:00Z",
    relatedOrderId: "MLU-20260804-233",
  },
  {
    id: "msg-3",
    type: "promo",
    senderName: "Molu Deals",
    subject: "Flash Sale: Up to 30% off Electronics this weekend",
    preview: "Don't miss out — our biggest electronics sale of the month starts...",
    body: "Don't miss out — our biggest electronics sale of the month starts Friday at midnight and runs through Sunday. Headphones, speakers, and laptops all included. Set a reminder so you don't miss it!",
    isRead: true,
    createdAt: "2026-08-05T08:00:00Z",
  },
  {
    id: "msg-4",
    type: "system",
    senderName: "Molu",
    subject: "Your password was changed",
    preview: "This is a confirmation that your account password was...",
    body: "This is a confirmation that your account password was successfully changed. If you didn't make this change, please contact support immediately and secure your account.",
    isRead: true,
    createdAt: "2026-08-03T18:20:00Z",
  },
  {
    id: "msg-5",
    type: "order",
    senderName: "Molu Logistics",
    subject: "Your order was delivered",
    preview: "Your order MLU-20260728-104 has been delivered. We hope you...",
    body: "Your order MLU-20260728-104 has been delivered. We hope you love it! If anything's not right, you have 7 days to request a return from the order details page.",
    isRead: true,
    createdAt: "2026-07-28T13:05:00Z",
    relatedOrderId: "MLU-20260728-104",
  },
  {
    id: "msg-6",
    type: "system",
    senderName: "Molu",
    subject: "Your refund has been processed",
    preview: "We've processed your refund for order MLU-20260701-091...",
    body: "We've processed your refund for order MLU-20260701-091. The amount should reflect in your original payment method within 5-7 business days.",
    isRead: true,
    createdAt: "2026-07-02T11:30:00Z",
    relatedOrderId: "MLU-20260701-091",
  },
];

export function getMessageById(id: string): MockMessage | undefined {
  return MOCK_MESSAGES.find((m) => m.id === id);
}

/** Mutates the mock array directly to simulate marking a message read —
 * swap for a real PATCH /messages/:id/read call once the backend exists. */
export function markMessageAsRead(id: string) {
  const message = MOCK_MESSAGES.find((m) => m.id === id);
  if (message) message.isRead = true;
}