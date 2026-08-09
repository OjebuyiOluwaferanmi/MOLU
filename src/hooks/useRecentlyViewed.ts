import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "molu_recently_viewed";
const MAX_RECENT = 50; // raised from 10 — that cap was sized for the homepage row, not a full history page

/**
 * useRecentlyViewed
 * -----------------------------------------------------------------------
 * Mirrors useRecentSearches — localStorage-backed, most recent first,
 * capped at MAX_RECENT. Call addViewedProduct(id) from ProductDetails on
 * mount; read viewedIds from the RecentlyViewed section / Browsing
 * History page to render them.
 */
export function useRecentlyViewed() {
  const [viewedIds, setViewedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setViewedIds(JSON.parse(stored));
    } catch {
      // corrupted value or storage unavailable — start empty
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(viewedIds));
    } catch {
      // e.g. private browsing storage limits — fail silently
    }
  }, [viewedIds, isLoaded]);

  const addViewedProduct = useCallback((productId: string) => {
    setViewedIds((prev) => {
      const withoutDuplicate = prev.filter((id) => id !== productId);
      return [productId, ...withoutDuplicate].slice(0, MAX_RECENT);
    });
  }, []);

  const removeViewedProduct = useCallback((productId: string) => {
    setViewedIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const clearHistory = useCallback(() => setViewedIds([]), []);

  return { viewedIds, addViewedProduct, removeViewedProduct, clearHistory };
}