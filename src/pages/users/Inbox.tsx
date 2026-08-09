import { Link } from "react-router";
import { MOCK_MESSAGES, type MessageType } from "../../data/Messages";
import { MessageTypeIcon } from "../../components/users/Inbox/MessageTypeIcon";

const FILTERS: { id: MessageType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "order", label: "Orders" },
  { id: "support", label: "Support" },
  { id: "promo", label: "Promos" },
  { id: "system", label: "System" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
  });
}

export default function Inbox() {
  const messages = [...MOCK_MESSAGES].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <h1 className="text-lg font-bold text-gray-900 sm:text-xl">Inbox</h1>
        {unreadCount > 0 && (
          <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-semibold text-white">
            {unreadCount} new
          </span>
        )}
      </div>

      {/* TODO: filter tabs are presentational only for now — wire up
          actual filtering once this list grows beyond a handful of items */}
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className="cursor-pointer rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-600 transition-colors first:bg-[#3654D6] first:text-white hover:bg-gray-200 first:hover:bg-[#2d47bd]"
          >
            {f.label}
          </button>
        ))}
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <p className="text-sm text-gray-500">You have no messages yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {messages.map((message) => (
            <Link
              key={message.id}
              to={`/account/inbox/${message.id}`}
              className={`flex items-start gap-3 rounded-2xl border p-3 transition-colors hover:border-brand-blue/40 hover:bg-gray-50 sm:p-4 ${
                message.isRead ? "border-gray-100" : "border-blue-100 bg-blue-50/40"
              }`}
            >
              <MessageTypeIcon type={message.type} />

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`truncate text-sm ${
                      message.isRead ? "font-medium text-gray-700" : "font-bold text-gray-900"
                    }`}
                  >
                    {message.senderName}
                  </p>
                  <span className="shrink-0 text-xs text-gray-400">
                    {formatDate(message.createdAt)}
                  </span>
                </div>
                <p
                  className={`mt-0.5 truncate text-sm ${
                    message.isRead ? "text-gray-500" : "font-semibold text-gray-800"
                  }`}
                >
                  {message.subject}
                </p>
                <p className="mt-0.5 truncate text-xs text-gray-400">{message.preview}</p>
              </div>

              {!message.isRead && (
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#3654D6]" aria-hidden="true" />
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}