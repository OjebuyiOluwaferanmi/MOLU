import { ProductCard } from "./ProductCard";
import { useRecentlyViewed } from "../../../hooks/useRecentlyViewed.ts";
import { getProductById } from "../../../data/mockSearchItems";

export function RecentlyViewed() {
  const { viewedIds } = useRecentlyViewed();

  const products = viewedIds
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (products.length === 0) return null;

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