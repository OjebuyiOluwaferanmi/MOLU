import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { getMessageById, markMessageAsRead } from "../../data/Messages";
import { MessageTypeIcon } from "../../components/users/Inbox/MessageTypeIcon";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MessageDetail() {
  const { messageId } = useParams<{ messageId: string }>();
  const message = messageId ? getMessageById(messageId) : undefined;

  // Mark as read the moment the message is opened — mirrors what a real
  // inbox does; swap markMessageAsRead's internals for a real API call
  // once the backend exists, this call site doesn't need to change.
  useEffect(() => {
    if (message && !message.isRead) {
      markMessageAsRead(message.id);
    }
  }, [message]);

  if (!message) {
    return (
      <div className="rounded-3xl bg-white p-6 text-center shadow-sm sm:p-8">
        <p className="text-sm text-gray-500">This message doesn't exist.</p>
        <Link
          to="/account/inbox"
          className="mt-3 inline-block cursor-pointer text-sm font-semibold text-[#3654D6] hover:underline"
        >
          Back to Inbox
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
      <Link
        to="/account/inbox"
        className="mb-4 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#3654D6]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Inbox
      </Link>

      <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
        <MessageTypeIcon type={message.type} />
        <div className="min-w-0 flex-1">
          <h1 className="text-base font-bold text-gray-900 sm:text-lg">{message.subject}</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            From <span className="font-medium text-gray-700">{message.senderName}</span>
          </p>
          <p className="mt-0.5 text-xs text-gray-400">{formatDateTime(message.createdAt)}</p>
        </div>
      </div>

      <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-700">
        {message.body}
      </p>

      {message.relatedOrderId && (
        <Link
          to={`/account/orders/${message.relatedOrderId}`}
          className="mt-5 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#3654D6] px-4 py-2 text-sm font-semibold text-[#3654D6] transition-colors hover:bg-[#3654D6] hover:text-white"
        >
          View Order {message.relatedOrderId}
        </Link>
      )}
    </div>
  );
}