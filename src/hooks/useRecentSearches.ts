import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "molu_recent_searches";
const MAX_RECENT = 5;

/**
 * useRecentSearches
 * -----------------------------------------------------------------------
 * Backed by localStorage so it survives refreshes. Caps at the last 5
 * unique terms, most recent first. Re-searching an existing term just
 * moves it back to the top instead of duplicating it.
 */
export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load once on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {
      // corrupted value or storage unavailable — just start empty
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Persist on every change (skip the first render, before load finishes,
  // so we don't overwrite storage with an empty array on mount)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches));
    } catch {
      // e.g. private browsing storage limits — fail silently
    }
  }, [recentSearches, isLoaded]);

  const addSearch = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const withoutDuplicate = prev.filter(
        (item) => item.toLowerCase() !== trimmed.toLowerCase()
      );
      return [trimmed, ...withoutDuplicate].slice(0, MAX_RECENT);
    });
  }, []);

  const removeSearch = useCallback((term: string) => {
    setRecentSearches((prev) => prev.filter((item) => item !== term));
  }, []);

  const clearSearches = useCallback(() => setRecentSearches([]), []);

  return { recentSearches, addSearch, removeSearch, clearSearches };
}