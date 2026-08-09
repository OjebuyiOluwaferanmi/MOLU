import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { getReviewableItems, submitReview, type ReviewableItem } from "../../data/Reviews";
import { StarRating } from "../../components/users/RatingReviews/StarRating";

type FilterId = "all" | "pending" | "reviewed";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "To Review" },
  { id: "reviewed", label: "Reviewed" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function RatingReviews() {
  const [searchParams] = useSearchParams();
  const [reviews, setReviews] = useState<ReviewableItem[]>(() =>
    [...getReviewableItems()].sort(
      (a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime()
    )
  );
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [draftRating, setDraftRating] = useState(0);
  const [draftComment, setDraftComment] = useState("");

  // Deep-linked from OrderDetail's "Leave a Review" (?productId=&orderId=)
  // — jump straight to that item and open its form.
  useEffect(() => {
    const productId = searchParams.get("productId");
    const orderId = searchParams.get("orderId");
    if (!productId || !orderId) return;

    const target = reviews.find((r) => r.productId === productId && r.orderId === orderId);
    if (!target) return;

    setActiveFilter(target.rating === null ? "pending" : "reviewed");
    if (target.rating === null) startReview(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const pendingCount = reviews.filter((r) => r.rating === null).length;

  const visibleReviews = reviews.filter((r) => {
    if (activeFilter === "pending") return r.rating === null;
    if (activeFilter === "reviewed") return r.rating !== null;
    return true;
  });

  function startReview(review: ReviewableItem) {
    setExpandedId(review.id);
    setDraftRating(0);
    setDraftComment("");
  }

  function cancelReview() {
    setExpandedId(null);
    setDraftRating(0);
    setDraftComment("");
  }

  function handleSubmit(review: ReviewableItem) {
    if (draftRating === 0) return;
    submitReview(review.productId, review.orderId, draftRating, draftComment.trim());
    setReviews(getReviewableItems()); // re-pull, now includes the new submission
    cancelReview();
  }

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <h1 className="text-lg font-bold text-gray-900 sm:text-xl">Rating & Reviews</h1>
        {pendingCount > 0 && (
          <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-semibold text-white">
            {pendingCount} to review
          </span>
        )}
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveFilter(f.id)}
            className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeFilter === f.id
                ? "bg-[#3654D6] text-white hover:bg-[#2d47bd]"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visibleReviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <p className="text-sm text-gray-500">Nothing here yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {visibleReviews.map((review) => {
            const isPending = review.rating === null;
            const isExpanded = expandedId === review.id;

            return (
              <div
                key={review.id}
                className={`rounded-2xl border p-3 transition-colors sm:p-4 ${
                  isPending ? "border-blue-100 bg-blue-50/40" : "border-gray-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={review.productImage}
                    alt={review.productName}
                    className="h-10 w-10 shrink-0 rounded-xl bg-gray-50 object-contain"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-gray-700">
                        {review.productName}
                      </p>
                      <span className="shrink-0 text-xs text-gray-400">
                        {formatDate(review.purchasedAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-400">Order {review.orderId}</p>

                    {isPending ? (
                      !isExpanded && (
                        <button
                          type="button"
                          onClick={() => startReview(review)}
                          className="mt-2 cursor-pointer rounded-full bg-[#3654D6] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#2d47bd]"
                        >
                          Rate & Review
                        </button>
                      )
                    ) : (
                      <>
                        <div className="mt-1.5">
                          <StarRating rating={review.rating!} />
                        </div>
                        {review.comment && (
                          <p className="mt-1 text-sm text-gray-500">{review.comment}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-400">
                          Reviewed {formatDate(review.reviewedAt!)}
                        </p>
                      </>
                    )}
                  </div>

                  {isPending && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#3654D6]" aria-hidden="true" />
                  )}
                </div>

                {isExpanded && (
                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Your rating
                    </p>
                    <StarRating rating={draftRating} onChange={setDraftRating} size="md" />

                    <textarea
                      value={draftComment}
                      onChange={(e) => setDraftComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      rows={3}
                      className="mt-3 w-full resize-none rounded-2xl border border-gray-200 p-3 text-sm text-gray-700 outline-none focus:border-[#3654D6]"
                    />

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSubmit(review)}
                        disabled={draftRating === 0}
                        className="cursor-pointer rounded-full bg-[#3654D6] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2d47bd] disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        Submit Review
                      </button>
                      <button
                        type="button"
                        onClick={cancelReview}
                        className="cursor-pointer rounded-full px-5 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}