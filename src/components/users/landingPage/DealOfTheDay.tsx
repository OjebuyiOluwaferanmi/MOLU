import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { getProductById } from "../../../data/mockSearchItems";

interface DealOfTheDayProps {
  /** Which product from the catalog to feature. Defaults to id "2"
   *  (Samsung Galaxy S23 Ultra) — change this to whichever product you
   *  want spotlighted as today's deal. */
  productId?: string;
}

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-3.5 w-3.5 ${className}`}
      fill="currentColor"
    >
      <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L10 14.9l-5.2 2.62.99-5.8-4.21-4.1 5.82-.85L10 1.5z" />
    </svg>
  );
}

function Star({ fillPercent }: { fillPercent: number }) {
  return (
    <span className="relative inline-block h-3.5 w-3.5">
      <StarIcon className="absolute inset-0 text-gray-300" />
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${fillPercent}%` }}
      >
        <StarIcon className="text-[#3654D6]" />
      </span>
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fillPercent = Math.max(0, Math.min(1, rating - i)) * 100;
        return <Star key={i} fillPercent={fillPercent} />;
      })}
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 transition-colors"
      fill={filled ? "#3654D6" : "none"}
      stroke="#3654D6"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s-6.7-4.35-9.33-8.2C1.02 10.6 1.4 7.4 3.8 5.7c2.2-1.55 5-1.05 6.55.9L12 8.4l1.65-1.8c1.55-1.95 4.35-2.45 6.55-.9 2.4 1.7 2.78 4.9 1.13 7.1C18.7 16.65 12 21 12 21z"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function getMsUntilMidnight() {
  const now = new Date();
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );
  return endOfDay.getTime() - now.getTime();
}

function useCountdownToMidnight() {
  const [msLeft, setMsLeft] = useState(getMsUntilMidnight());

  useEffect(() => {
    const interval = setInterval(() => {
      setMsLeft(getMsUntilMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalSeconds = Math.max(0, Math.floor(msLeft / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

export function DealOfTheDay({ productId = "2" }: DealOfTheDayProps) {
  const product = getProductById(productId);
  const navigate = useNavigate();
  const { hours, minutes, seconds } = useCountdownToMidnight();

  const [activeImage, setActiveImage] = useState(product?.images[0]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Keep the gallery in sync if productId ever changes at runtime.
  useEffect(() => {
    setActiveImage(product?.images[0]);
  }, [product]);

  if (!product) return null; // bad productId passed in — fail quietly

  const countdownUnits = [
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  const goToProduct = () => navigate(`/product/${product.id}`);

  return (
    <section className="w-full rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      <h2 className="mb-6 text-center text-lg font-bold text-[#3654D6] sm:text-xl">
        Deal Of The Day
      </h2>

      <div className="flex flex-col items-start gap-6 md:flex-row md:items-stretch md:gap-8">
        {/* Gallery */}
        <div className="flex w-full flex-col gap-3 md:w-1/2 md:flex-row-reverse md:items-stretch">
          <div
            onClick={() => setIsModalOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setIsModalOpen(true);
            }}
            aria-label="Open image preview"
            className="aspect-[4/3] w-full shrink-0 cursor-pointer overflow-hidden rounded-xl bg-gray-50 px-3 sm:px-4 md:aspect-auto md:h-full md:w-auto md:flex-1"
          >
            <img
              src={activeImage}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-row gap-3 md:flex-col">
            {product.images.map((thumb, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveImage(thumb)}
                aria-label={`Show product image ${index + 1}`}
                className={`h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-lg border transition-colors sm:h-16 sm:w-16 ${
                  activeImage === thumb
                    ? "border-[#3654D6]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={thumb}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex w-full flex-1 flex-col gap-2 text-left">
          <h3
            onClick={goToProduct}
            className="cursor-pointer text-base font-bold leading-snug text-gray-900 hover:text-[#3654D6] sm:text-lg"
          >
            {product.name}
          </h3>
          <p className="text-sm text-gray-500">
            Brand: <span className="font-medium text-[#3654D6]">{product.brand}</span>
          </p>
          <p className="text-sm text-gray-500">Product Code: {product.productCode}</p>

          <div className="mt-1 flex items-center gap-3">
            <StarRating rating={product.rating} />
            <span className="text-xs text-gray-400">{product.rating}</span>
            <span className="ml-auto text-xs text-gray-500">
              {product.soldCount} Sold
            </span>
          </div>

          <div className="mt-1 flex items-center gap-3">
            <span className="text-lg font-bold text-[#3654D6] sm:text-xl">
              ₦{product.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-400 line-through">
              ₦{product.originalPrice.toLocaleString()}
            </span>
            <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">
              -{product.discountPercent}%
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between gap-4">
            <div className="flex flex-col items-start gap-1">
              <span className="text-xs text-gray-500">
                Hurry up! Deal will end in
              </span>
              <div className="flex items-end gap-1">
                {countdownUnits.map((unit, index) => (
                  <div key={unit.label} className="flex items-end gap-1">
                    <div className="flex flex-col items-center">
                      <span className="mb-0.5 text-[9px] uppercase tracking-wide text-gray-400">
                        {unit.label}
                      </span>
                      <span className="text-base font-semibold tabular-nums text-gray-900 sm:text-lg">
                        {unit.value}
                      </span>
                    </div>
                    {index < countdownUnits.length - 1 && (
                      <span className="pb-0.5 text-base font-semibold text-gray-900 sm:text-lg">
                        :
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsWishlisted((prev) => !prev)}
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              aria-pressed={isWishlisted}
              className="shrink-0 cursor-pointer p-2 rounded-full hover:bg-blue-50 transition-colors"
            >
              <HeartIcon filled={isWishlisted} />
            </button>
          </div>

          <button
            type="button"
            onClick={goToProduct}
            className="mt-3 w-full cursor-pointer rounded-full bg-[#3654D6] py-3 font-semibold text-white transition-colors hover:bg-[#2d47bd]"
          >
            View Details
          </button>
        </div>
      </div>

      {isModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black/90 p-4 sm:p-8"
            onClick={() => setIsModalOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close image preview"
              className="absolute right-4 top-4 z-10 cursor-pointer text-white transition-opacity hover:opacity-80"
            >
              <CloseIcon />
            </button>

            <div
              className="flex max-h-[70vh] w-full max-w-4xl items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeImage}
                alt={product.name}
                className="max-h-[70vh] max-w-full object-contain"
              />
            </div>

            <div
              className="flex shrink-0 flex-row gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              {product.images.map((thumb, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveImage(thumb)}
                  aria-label={`Show product image ${index + 1}`}
                  className={`h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-colors sm:h-16 sm:w-16 ${
                    activeImage === thumb
                      ? "border-white"
                      : "border-white/30 hover:border-white/70"
                  }`}
                >
                  <img
                    src={thumb}
                    alt={`Thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}