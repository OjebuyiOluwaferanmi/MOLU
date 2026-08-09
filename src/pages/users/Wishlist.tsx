import { Link } from "react-router";
import { useWishlist } from "../../components/users/Wishlist/WishlistContext";
import { getProductById } from "../../data/mockSearchItems";
import { ProductCard } from "../../components/users/landingPage/ProductCard";

export default function Wishlist() {
  const { productIds } = useWishlist();

  const products = productIds
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
      <h1 className="mb-4 text-lg font-bold text-gray-900 sm:text-xl">My Wishlist</h1>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <p className="text-sm text-gray-500">You haven&apos;t added anything to your wishlist yet.</p>
          <Link to="/" className="text-sm font-medium text-brand-blue hover:underline">
            Start shopping
          </Link>
        </div>
      ) : (
       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
  {products.map((product) => (
    <div
      key={product.id}
      className="rounded-xl border border-gray-100 sm:border-0"
    >
      <ProductCard product={product} />
    </div>
  ))}
</div>
      )}
    </div>
  );
}