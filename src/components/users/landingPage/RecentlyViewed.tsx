import { useState } from "react";
import hdmiCable from "../../../assets/hdmi.jpg";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  soldCount: number;
  image: string;
}

const products: Product[] = Array.from({ length: 1 }).map((_, i) => ({
  id: `hdmi-${i + 1}`,
  name: "Original HDMI Cable 1080p High Speed",
  price: 5000,
  originalPrice: 9500,
  discountPercent: 15,
  rating: 3.5,
  soldCount: 14,
  image: hdmiCable,
}));

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
      className="h-4 w-4 shrink-0 transition-colors sm:h-5 sm:w-5"
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

function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
            <div className="flex flex-col text-left p-2 transition-shadow duration-200 hover:shadow-lg rounded-xl cursor-pointer hover:scale-105 transition-transform">
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain"
        />
      </div>

      <h3 className="mt-3 truncate text-sm font-semibold text-gray-900">
        {product.name}
      </h3>

      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="text-base font-bold text-[#3654D6] sm:text-lg">
          ₦{product.price.toLocaleString()}
        </span>
        <button
          type="button"
          onClick={() => setIsWishlisted((prev) => !prev)}
          aria-label={
            isWishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
          aria-pressed={isWishlisted}
          className="cursor-pointer p-1 rounded-full hover:bg-blue-50 transition-colors"
        >
          <HeartIcon filled={isWishlisted} />
        </button>
      </div>

      <span className="text-xs text-gray-400 line-through">
        ₦{product.originalPrice.toLocaleString()}
      </span>

      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold text-white">
          -{product.discountPercent}%
        </span>
        <span className="text-xs text-gray-500">{product.soldCount} Sold</span>
      </div>

      <div className="mt-1">
        <StarRating rating={product.rating} />
      </div>
    </div>
  );
}

export function RecentlyViewed() {
  return (
    <section className="w-full rounded-3xl mt-4 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="mb-6 text-center text-lg font-bold text-[#3654D6] sm:text-xl">
        Recently Viewed
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          className="cursor-pointer rounded-full border border-[#3654D6] px-8 py-2.5 text-sm font-semibold text-[#3654D6] transition-colors hover:bg-[#3654D6] hover:text-white"
        >
          View All
        </button>
      </div>
    </section>
  );
}