import { Trash2 } from "lucide-react";
import { Link } from "react-router";
import type { CartItem } from "../../users/CartPage/CartContext";
import { getProductById } from "../../../data/mockSearchItems";
import { useCart } from "../../users/CartPage/CartContext";

export function CartItemRow({ item }: { item: CartItem }) {
  const { incrementItem, decrementItem, removeFromCart } = useCart();
  const product = getProductById(item.productId);

  if (!product) return null; // stale cart entry pointing at a removed product

  return (
    <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
      <Link to={`/product/${product.id}`} className="flex cursor-pointer items-center gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
          <img
            src={item.selectedColor ? product.image : product.image}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="flex flex-col gap-0.5 text-left">
          <div className="flex items-start justify-between gap-3 sm:hidden">
            <h3 className="text-sm font-bold text-gray-900 hover:text-[#3654D6]">{product.name}</h3>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeFromCart(item.cartItemId);
              }}
              aria-label="Remove item"
              className="shrink-0 cursor-pointer text-rose-500 hover:opacity-80"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
          <h3 className="hidden text-sm font-bold text-gray-900 hover:text-[#3654D6] sm:block">
            {product.name}
          </h3>

          {item.selectedMemory && (
            <p className="text-xs text-gray-500">
              Memory Size: <span className="font-medium text-gray-700">{item.selectedMemory}</span>
            </p>
          )}
          {item.selectedColor && (
            <p className="text-xs text-gray-500">
              Color: <span className="font-medium text-gray-700">{item.selectedColor}</span>
            </p>
          )}

          <p className="mt-1 text-base font-bold text-[#3654D6]">
            ₦{product.price.toLocaleString()}
          </p>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="flex items-center gap-3 rounded-full bg-gray-100 px-4 py-2">
          <button
            type="button"
            onClick={() => decrementItem(item.cartItemId)}
            aria-label="Decrease quantity"
            className="cursor-pointer text-sm font-bold text-gray-600"
          >
            −
          </button>
          <span className="text-sm font-semibold text-gray-900">{item.quantity}</span>
          <button
            type="button"
            onClick={() => incrementItem(item.cartItemId)}
            aria-label="Increase quantity"
            className="cursor-pointer text-sm font-bold text-gray-600"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={() => removeFromCart(item.cartItemId)}
          aria-label="Remove item"
          className="hidden cursor-pointer text-rose-500 hover:opacity-80 sm:block"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}