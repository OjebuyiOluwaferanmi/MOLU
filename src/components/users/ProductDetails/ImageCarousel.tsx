import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  productName: string;
  onOpenPreview: (img: string) => void;
  /** Auto-advance interval in ms. Defaults to 2.5s. */
  intervalMs?: number;
}

const SWIPE_THRESHOLD = 60; // px of drag before it counts as a swipe, not a tap

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

/**
 * ImageCarousel
 * -----------------------------------------------------------------------
 * Auto-advances every `intervalMs` (default 2.5s), pauses on hover, and
 * lets people swipe (touch/drag) or click the dots/arrows to navigate.
 * Clicking the image itself opens the existing preview modal via
 * onOpenPreview — a drag that crosses SWIPE_THRESHOLD is treated as a
 * swipe instead, so dragging never accidentally opens the preview.
 */
export function ImageCarousel({
  images,
  productName,
  onOpenPreview,
  intervalMs = 2500,
}: ImageCarouselProps) {
  const [[index, direction], setSlide] = useState<[number, number]>([0, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const wasDraggedRef = useRef(false);

  const goTo = useCallback(
    (newIndex: number, dir: number) => {
      setSlide([((newIndex % images.length) + images.length) % images.length, dir]);
    },
    [images.length]
  );

  const goNext = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  // Auto-advance — resets its own timer after every slide change (manual
  // or automatic), and pauses while hovered or while only one image exists.
  useEffect(() => {
    if (images.length <= 1 || isPaused) return;
    const id = setInterval(() => {
      setSlide(([current]) => [(current + 1) % images.length, 1]);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images.length, isPaused, intervalMs, index]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) {
      goNext();
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      goPrev();
    }
    // Keep the "this was a drag" flag true for one tick so the click
    // handler (which fires right after dragEnd) knows to ignore it.
    wasDraggedRef.current = true;
    setTimeout(() => {
      wasDraggedRef.current = false;
    }, 0);
  };

  const handleImageClick = () => {
    if (wasDraggedRef.current) return;
    onOpenPreview(images[index]);
  };

  if (images.length === 0) return null;

  return (
    <div
      className="group relative w-full max-w-sm overflow-hidden rounded-xl bg-gray-50"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative aspect-square w-full">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={index}
            src={images[index]}
            alt={`${productName} image ${index + 1}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            drag={images.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={handleDragEnd}
            onClick={handleImageClick}
            className="absolute inset-0 h-full w-full cursor-pointer touch-pan-y object-contain"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 text-[#3654D6] opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 text-[#3654D6] opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white">
              {index + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 py-3">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i, i > index ? 1 : -1)}
              aria-label={`Go to image ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-[#3654D6]" : "w-1.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}