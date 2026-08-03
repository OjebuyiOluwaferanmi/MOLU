import { createPortal } from "react-dom";
import { X as CloseX } from "lucide-react";

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  activeImage: string | undefined;
  images: string[];
  onSelectImage: (img: string) => void;
}

/** Fullscreen click-to-preview gallery modal — same pattern used in
 * DealOfTheDay.tsx, extracted here so ProductDetails can reuse it. */
export function ImagePreviewModal({
  isOpen,
  onClose,
  productName,
  activeImage,
  images,
  onSelectImage,
}: ImagePreviewModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black/90 p-4 sm:p-8"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image preview"
        className="absolute right-4 top-4 z-10 cursor-pointer text-white transition-opacity hover:opacity-80"
      >
        <CloseX className="h-6 w-6" />
      </button>

      <div
        className="flex max-h-[70vh] w-full max-w-4xl items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={activeImage} alt={productName} className="max-h-[70vh] max-w-full object-contain" />
      </div>

      <div className="flex shrink-0 flex-row gap-3" onClick={(e) => e.stopPropagation()}>
        {images.map((thumb, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelectImage(thumb)}
            aria-label={`Show product image ${index + 1}`}
            className={`h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-colors sm:h-16 sm:w-16 ${
              activeImage === thumb ? "border-white" : "border-white/30 hover:border-white/70"
            }`}
          >
            <img src={thumb} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
}