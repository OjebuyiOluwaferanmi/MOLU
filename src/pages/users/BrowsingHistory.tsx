import { Link } from "react-router";
import { X } from "lucide-react";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";
import { getProductById } from "../../data/mockSearchItems";
import { ProductCard } from "../../components/users/landingPage/ProductCard";

export default function BrowsingHistory() {
  const { viewedIds, removeViewedProduct, clearHistory } = useRecentlyViewed();

  const products = viewedIds
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="text-lg font-bold text-gray-900 sm:text-xl">Browsing History</h1>
        {products.length > 0 && (
          <button
            type="button"
            onClick={clearHistory}
            className="cursor-pointer text-sm font-medium text-brand-red hover:underline"
          >
            Clear History
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <p className="text-sm text-gray-500">Items you view will show up here.</p>
          <Link to="/" className="text-sm font-medium text-brand-blue hover:underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="relative rounded-xl border border-gray-100 sm:border-0">
              {/* Sits as a sibling on top of ProductCard's own <Link>, not
                  nested inside it — so clicking it never triggers navigation,
                  no stopPropagation gymnastics needed. */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeViewedProduct(product.id);
                }}
                aria-label="Remove from browsing history"
                className="absolute right-2 top-2 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-sm hover:bg-white hover:text-brand-red"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}