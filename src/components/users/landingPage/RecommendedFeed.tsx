import { useCallback, useRef, useState } from "react";
import { Tabs } from "@heroui/react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { ProductCard, type Product } from "./ProductCard";
import { useInfiniteScroll } from "./useInfiniteScroll";
import hdmiCable from "../../../assets/hdmi.jpg";

/**
 * NOTE ON CATEGORIES
 * -----------------------------------------------------------------------
 * These 10 are placeholders. Once the backend exposes the real
 * "top 10 categories" endpoint, swap this array for that response —
 * everything else (tabs, per-tab filtering, infinite scroll) stays
 * exactly the same.
 */
const CATEGORIES = [
  { id: "fashion", label: "Fashion" },
  { id: "electronics", label: "Electronics" },
  { id: "computing", label: "Computing" },
  { id: "health", label: "Health" },
  { id: "home-office", label: "Home & Office" },
  { id: "groceries", label: "Groceries" },
  { id: "baby-products", label: "Baby Products" },
  { id: "automotive", label: "Automotive" },
  { id: "sporting-goods", label: "Sporting Goods" },
  { id: "phones-tablets", label: "Phones & Tablets" },
];

// "Recommended" is first and selected by default — remove this line and
// use CATEGORIES directly if you only want the 10 plain category tabs.
const TABS = [{ id: "recommended", label: "Recommended" }, ...CATEGORIES];

const BATCH_SIZE = 10;

/**
 * Temporary mock data generator — swap for a real paginated API call
 * later (e.g. GET /products?category=X&page=Y). Signature deliberately
 * mirrors what that real call will look like, so swapping it out later
 * is a one-line change inside loadMore below.
 */
function generateMockBatch(categoryId: string, page: number): Product[] {
  return Array.from({ length: BATCH_SIZE }).map((_, i) => {
    const seed = page * BATCH_SIZE + i;
    return {
      id: `${categoryId}-${seed}`,
      name: "Original HDMI Cable 1080p High Speed",
      price: 5000 + (seed % 5) * 500,
      originalPrice: 9500,
      discountPercent: 10 + (seed % 4) * 5,
      rating: 3 + (seed % 3) * 0.5,
      soldCount: 10 + (seed % 20),
      image: hdmiCable,
    };
  });
}

function CategoryProductGrid({ categoryId }: { categoryId: string }) {
  const [products, setProducts] = useState<Product[]>(() =>
    generateMockBatch(categoryId, 0)
  );
  const [isLoading, setIsLoading] = useState(false);
  const pageRef = useRef(0);
  const isLoadingRef = useRef(false);

  const loadMore = useCallback(() => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsLoading(true);

    // Simulated network delay — remove once this is wired to a real API
    setTimeout(() => {
      pageRef.current += 1;
      setProducts((prev) => [
        ...prev,
        ...generateMockBatch(categoryId, pageRef.current),
      ]);
      isLoadingRef.current = false;
      setIsLoading(false);
    }, 500);
  }, [categoryId]);

  const sentinelRef = useInfiniteScroll(loadMore);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Infinite scroll trigger + loading indicator */}
      <div ref={sentinelRef} className="mt-8 flex justify-center">
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading more...
          </div>
        )}
      </div>
    </div>
  );
}

export function RecommendedFeed() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollTabs = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  return (
    <section className="mt-4 w-full">
      <Tabs className="w-full bg-transparent" defaultSelectedKey="recommended">
        {/* Heading pill */}
        <div className="w-full rounded-full bg-white px-6 py-4 shadow-sm">
          <h2 className="text-center text-lg font-bold text-[#3654D6] sm:text-xl">
            Select an Option
          </h2>
        </div>

        {/* Tabs pill */}
        <div className="relative mt-4 w-full rounded-full bg-white px-4 py-3 shadow-sm sm:px-6">
          <Tabs.ListContainer className="bg-white">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollTabs("left")}
                aria-label="Scroll categories left"
                className="flex shrink-0 items-center justify-center rounded-full p-1 text-[#3654D6] hover:bg-blue-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div ref={scrollRef} className="scrollbar-hide flex-1 overflow-x-auto bg-white">
                <Tabs.List
                  aria-label="Product categories"
                  className="flex w-max items-center gap-2 bg-white sm:gap-3"
                >
                  {TABS.map((tab) => (
                    <Tabs.Tab
                      key={tab.id}
                      id={tab.id}
                      className="cursor-pointer whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#3654D6] outline-none transition-colors data-[selected=true]:bg-[#3654D6] data-[selected=true]:text-white sm:text-base"
                    >
                      {tab.label}
                      <Tabs.Indicator className="hidden" />
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
              </div>

              <button
                type="button"
                onClick={() => scrollTabs("right")}
                aria-label="Scroll categories right"
                className="flex shrink-0 items-center justify-center rounded-full p-1 text-[#3654D6] hover:bg-blue-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </Tabs.ListContainer>
        </div>

        {/* Product grid card — one panel per tab, each with its own independent infinite scroll */}
        <div className="mt-4 w-full  rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          {TABS.map((tab) => (
            <Tabs.Panel key={tab.id} id={tab.id} >
              <CategoryProductGrid categoryId={tab.id} />
            </Tabs.Panel>
          ))}
        </div>
      </Tabs>
    </section>
  );
}