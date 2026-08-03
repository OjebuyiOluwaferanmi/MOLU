import type { MockProduct } from "../../../data/mockSearchItems";
import { FacebookIcon, InstagramIcon, TwitterIcon, WhatsAppIcon } from "./icons";

interface ProductGalleryProps {
  product: MockProduct;
  activeImage: string | undefined;
  onSelectImage: (img: string) => void;
  onOpenPreview: (img: string) => void;
}

function ShareRow() {
  return (
    <div className="flex items-center gap-2">
      <button type="button" aria-label="Share on Facebook" className="cursor-pointer hover:opacity-80">
        <FacebookIcon />
      </button>
      <button type="button" aria-label="Share on Instagram" className="cursor-pointer hover:opacity-80">
        <InstagramIcon />
      </button>
      <button type="button" aria-label="Share on WhatsApp" className="cursor-pointer hover:opacity-80">
        <WhatsAppIcon />
      </button>
      <button type="button" aria-label="Share on X" className="cursor-pointer hover:opacity-80">
        <TwitterIcon />
      </button>
    </div>
  );
}

/**
 * Main product image + thumbnail strip. Renders the desktop "Share with
 * others" row under the thumbnails — the mobile share row lives in
 * ProductInfo.tsx instead, since it sits under the details text there.
 */
export function ProductGallery({ product, activeImage, onSelectImage, onOpenPreview }: ProductGalleryProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row-reverse md:items-start">
      <button
        type="button"
        onClick={() => onOpenPreview(activeImage!)}
        aria-label="Open image preview"
        className="aspect-square w-full max-w-xs cursor-pointer overflow-hidden rounded-xl bg-gray-50 md:w-64"
      >
        <img src={activeImage} alt={product.name} className="h-full w-full object-contain" />
      </button>

      <div className="flex flex-row gap-3 md:flex-col">
        {product.images.map((img, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelectImage(img)}
            aria-label={`Show product image ${index + 1}`}
            className={`h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-lg border transition-colors sm:h-16 sm:w-16 ${
              activeImage === img ? "border-[#3654D6]" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <img
              src={img}
              alt={`${product.name} thumbnail ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}

        <div className="mt-1 hidden flex-col gap-2 md:flex">
          <p className="text-xs text-gray-500">Share with others:</p>
          <ShareRow />
        </div>
      </div>
    </div>
  );
}

/** Mobile-only share row — rendered separately from ProductInfo so it sits
 * under the details text on small screens (there's no room under a
 * horizontal thumbnail row like there is on desktop). */
export function MobileShareRow() {
  return (
    <div className="mt-3 border-t border-gray-100 pt-3 md:hidden">
      <p className="text-xs text-gray-500">Share with others:</p>
      <div className="mt-2">
        <ShareRow />
      </div>
    </div>
  );
}