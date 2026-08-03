import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * ScrollToTop
 * -----------------------------------------------------------------------
 * React Router doesn't reset scroll position on navigation (unlike a
 * full page load). Mount this once near the root — every route change
 * scrolls the window back to the top.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}