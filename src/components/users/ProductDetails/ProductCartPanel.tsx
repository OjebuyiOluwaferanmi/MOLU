import { useState } from "react";
import { Check, Heart } from "lucide-react";
import type { MockProduct } from "../../../data/mockSearchItems";
import { useCart } from "../../users/CartPage/CartContext";
import { useWishlist } from "../../users/Wishlist/WishlistContext";

interface ProductCartPanelProps {
  product: MockProduct;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  selectedColor?: string;
  selectedMemory?: string;
}

/** Sticky right-hand price/cart card — total price, stock badge, quantity
 * stepper, add to cart, add to wishlist. */
export function ProductCartPanel({
  product,
  quantity,
  onIncrement,
  onDecrement,
  selectedColor,
  selectedMemory,
}: ProductCartPanelProps) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [justAdded, setJustAdded] = useState(false);

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart({ productId: product.id, quantity, selectedColor, selectedMemory });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <aside className="flex w-full shrink-0 flex-col gap-5 rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:w-72 lg:sticky lg:top-24 lg:self-start">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total Price:</p>
        <p className="mt-1 text-xl font-bold text-[#3654D6] sm:text-2xl">
          ₦{(product.price * quantity).toLocaleString()}
        </p>

        <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
              product.inStock ? "bg-[#3654D6]" : "bg-gray-300"
            }`}
          >
            <Check className="h-3 w-3" color="white" strokeWidth={3} />
          </span>
          {product.inStock ? "In Stock" : "Out of Stock"}
        </div>

        <div className="mt-5 flex items-center justify-between rounded-full border-2 border-[#3654D6] px-6 py-3">
          <button
            type="button"
            onClick={onDecrement}
            aria-label="Decrease quantity"
            className="cursor-pointer text-xl font-bold text-[#3654D6]"
          >
            −
          </button>
          <span className="text-lg font-bold text-[#3654D6]">{quantity}</span>
          <button
            type="button"
            onClick={onIncrement}
            aria-label="Increase quantity"
            className="cursor-pointer text-xl font-bold text-[#3654D6]"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-5 w-full cursor-pointer rounded-full bg-[#3654D6] py-3.5 text-base font-bold text-white transition-colors hover:bg-[#2d47bd]"
        >
          {justAdded ? "Added to Cart ✓" : "Add to Cart"}
        </button>
      </div>

      <button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        aria-pressed={wishlisted}
        className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#3654D6]"
      >
        <Heart
          className="h-5 w-5"
          color="#3654D6"
          fill={wishlisted ? "#3654D6" : "none"}
          strokeWidth={1.8}
        />
        Add to wishlist
      </button>
    </aside>
  );
}