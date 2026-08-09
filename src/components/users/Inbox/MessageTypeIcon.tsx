import { Truck, Headset, Megaphone, Bell } from "lucide-react";
import type { MessageType } from "../../../data/Messages";

const TYPE_STYLES: Record<MessageType, { icon: typeof Truck; bg: string; text: string }> = {
  order: { icon: Truck, bg: "bg-blue-50", text: "text-[#3654D6]" },
  support: { icon: Headset, bg: "bg-indigo-50", text: "text-indigo-600" },
  promo: { icon: Megaphone, bg: "bg-amber-50", text: "text-amber-600" },
  system: { icon: Bell, bg: "bg-gray-100", text: "text-gray-500" },
};

export function MessageTypeIcon({ type }: { type: MessageType }) {
  const { icon: Icon, bg, text } = TYPE_STYLES[type];
  return (
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${bg} ${text}`}>
      <Icon className="h-4 w-4" />
    </span>
  );
}