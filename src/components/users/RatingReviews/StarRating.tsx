import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  /** Omit for read-only display; pass to make stars clickable. */
  onChange?: (rating: number) => void;
  size?: "sm" | "md";
}

/** Read-only stars when `onChange` is omitted (used on completed reviews);
 * interactive click-to-rate stars when it's passed (used in the write-review form). */
export function StarRating({ rating, onChange, size = "sm" }: StarRatingProps) {
  const starSize = size === "sm" ? "h-4 w-4" : "h-6 w-6";
  const isInteractive = Boolean(onChange);

  return (
    <div className="flex items-center gap-1" role={isInteractive ? "radiogroup" : undefined} aria-label="Rating">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          disabled={!isInteractive}
          onClick={() => onChange?.(value)}
          aria-label={`${value} star${value > 1 ? "s" : ""}`}
          className={isInteractive ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            className={starSize}
            fill={value <= rating ? "#f59e0b" : "none"}
            color={value <= rating ? "#f59e0b" : "#d1d5db"}
            strokeWidth={1.8}
          />
        </button>
      ))}
    </div>
  );
}