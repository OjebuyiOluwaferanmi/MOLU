import { Check } from "lucide-react";
import type { MockProduct } from "../../../data/mockSearchItems";
import { MobileShareRow } from "./ProductGallery";

interface ProductInfoProps {
  product: MockProduct;
  selectedColor: string | undefined;
  onSelectColor: (name: string) => void;
  selectedMemory: string | undefined;
  onSelectMemory: (size: string) => void;
}

/** Title, brand, price, and the color/memory variant pickers — the text
 * column that sits next to the gallery. */
export function ProductInfo({
  product,
  selectedColor,
  onSelectColor,
  selectedMemory,
  onSelectMemory,
}: ProductInfoProps) {
  return (
    <div className="flex flex-1 flex-col gap-2 text-left">
      <h1 className="text-lg font-bold leading-snug text-gray-900 sm:text-xl">{product.name}</h1>
      <p className="text-sm text-gray-500">
        Brand: <span className="font-medium text-[#3654D6]">{product.brand}</span>
      </p>
      <p className="text-sm text-gray-500">Product Code: {product.productCode}</p>

      <div className="mt-1 flex flex-wrap items-center gap-3">
        <span className="text-sm text-gray-400 line-through">
          ₦{product.originalPrice.toLocaleString()}
        </span>
        <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">
          -{product.discountPercent}%
        </span>
      </div>
      <span className="text-xl font-bold text-[#3654D6] sm:text-2xl">
        ₦{product.price.toLocaleString()}
      </span>

      {product.colors && product.colors.length > 0 && (
        <div className="mt-3 border-t border-gray-100 pt-3">
          <p className="text-sm text-gray-500">
            Select Colors: <span className="font-medium text-gray-700">{selectedColor}</span>
          </p>
          <div className="mt-2 flex items-center gap-2">
            {product.colors.map((color) => {
              const isSelected = selectedColor === color.name;
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => onSelectColor(color.name)}
                  aria-label={`Select color ${color.name}`}
                  aria-pressed={isSelected}
                  className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 transition-colors ${
                    isSelected ? "border-[#3654D6]" : "border-transparent hover:border-gray-300"
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && (
                    <Check
                      className="h-3.5 w-3.5"
                      color={color.hex === "#111111" ? "#FFFFFF" : "#111111"}
                      strokeWidth={3}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {product.memoryOptions && product.memoryOptions.length > 0 && (
        <div className="mt-3 border-t border-gray-100 pt-3">
          <p className="text-sm text-gray-500">
            Choose Memory Size: <span className="font-medium text-gray-700">{selectedMemory}</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.memoryOptions.map((size) => {
              const isSelected = selectedMemory === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSelectMemory(size)}
                  aria-pressed={isSelected}
                  className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
                    isSelected
                      ? "border-[#3654D6] bg-[#3654D6] text-white"
                      : "border-[#3654D6] text-[#3654D6] hover:bg-blue-50"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <MobileShareRow />
    </div>
  );
}