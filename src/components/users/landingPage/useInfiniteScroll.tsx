import { useEffect, useRef } from "react";

/**
 * useInfiniteScroll
 * -----------------------------------------------------------------------
 * Attach the returned `sentinelRef` to an empty div at the bottom of a
 * list. Whenever that div scrolls into view, `onIntersect` fires — call
 * your "load more" logic from there.
 *
 * Usage:
 *   const sentinelRef = useInfiniteScroll(() => {
 *     if (!isLoading && hasMore) loadMore();
 *   });
 *
 *   return (
 *     <>
 *       {items.map(...)}
 *       <div ref={sentinelRef} />
 *     </>
 *   );
 */
export function useInfiniteScroll(onIntersect: () => void) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onIntersect();
      },
      { rootMargin: "200px" } // start loading a bit before it's actually on-screen
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onIntersect]);

  return sentinelRef;
}