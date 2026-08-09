import { Link } from "react-router";
import { Wallet, RefreshCcw } from "lucide-react";
import { getCreditTransactions, getCreditBalance } from "../../data/CreditBalance";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export default function CreditBalance() {
  const transactions = [...getCreditTransactions()].sort(
    (a, b) => new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime()
  );
  const balance = getCreditBalance();

  return (
    <div className="flex flex-col gap-4">
      {/* Balance summary card */}
      <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
        <h1 className="mb-4 text-lg font-bold text-gray-900 sm:text-xl">Credit Balance</h1>

        <div className="flex flex-col items-start gap-4 rounded-2xl bg-gradient-to-br from-[#3654D6] to-[#2d47bd] p-5 text-white sm:p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
            <Wallet className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-white/70">
              Available Credit
            </p>
            <p className="mt-1 text-2xl font-bold sm:text-3xl">{formatNaira(balance)}</p>
          </div>
          <p className="text-xs text-white/70">
            Credit is automatically applied at checkout on your next order.
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-1 text-sm font-bold text-gray-900">Credit History</h2>
        <p className="mb-4 text-xs text-gray-400">
          A record of every refund credited to your account.
        </p>

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <p className="text-sm text-gray-500">You have no credit yet.</p>
            <p className="text-xs text-gray-400">
              Credit is added here automatically if an order is cancelled and refunded.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {transactions.map((t) => (
              <Link
                key={t.id}
                to={`/account/orders/${t.orderId}`}
                className="flex items-start gap-3 rounded-2xl border border-gray-100 p-3 transition-colors hover:border-brand-blue/40 hover:bg-gray-50 sm:p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <RefreshCcw className="h-4 w-4" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900">Refund — Order {t.orderId}</p>
                    <span className="shrink-0 text-sm font-bold text-green-600">
                      +{formatNaira(t.amount)}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-gray-600">{t.itemNames.join(", ")}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{t.reason}</p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    Processed {formatDate(t.processedAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}