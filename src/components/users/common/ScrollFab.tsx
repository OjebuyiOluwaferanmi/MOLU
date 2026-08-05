import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowUp, ShoppingCart } from "lucide-react";
import { useCart } from "../../users/CartPage/CartContext";

// Percentage of total scrollable page height the user must pass before the
// scroll-to-top button appears. Tweak to taste.
const SCROLL_THRESHOLD_PERCENT = 5;

export function ScrollFab() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolledPercent =
        scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
      setShowScrollTop(scrolledPercent > SCROLL_THRESHOLD_PERCENT);
    };

    // Run once on mount in case the page loads already scrolled
    // (e.g. an anchor-link navigation) — otherwise stays hidden by default.
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-4 z-40 flex flex-col items-center gap-3 sm:right-6">
      {/* Cart button — now shown on all screen sizes, same behavior as
          before (badge count, hover scale) just no longer hidden on lg+ */}
      <Link
        to="/cart"
        aria-label={`View cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#3654D6] text-white shadow-lg transition-transform hover:scale-105"
      >
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </Link>

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-black text-white shadow-lg transition-transform hover:scale-105"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}