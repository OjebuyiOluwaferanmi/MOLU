import { useCallback, useMemo, useRef, useState } from "react";
import { Tabs } from "@heroui/react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { useInfiniteScroll } from "./useInfiniteScroll";
import { MOCK_SEARCH_ITEMS, type MockProduct } from "../../../data/mockSearchItems";

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

const TABS = [{ id: "recommended", label: "Recommended" }, ...CATEGORIES];

const BATCH_SIZE = 6;

function getCategoryProducts(categoryId: string): MockProduct[] {
  if (categoryId === "recommended") return MOCK_SEARCH_ITEMS;
  return MOCK_SEARCH_ITEMS.filter((item) => item.categoryId === categoryId);
}

function CategoryProductGrid({ categoryId }: { categoryId: string }) {
  const allProducts = useMemo(() => getCategoryProducts(categoryId), [categoryId]);
  const [visibleCount, setVisibleCount] = useState(
    Math.min(BATCH_SIZE, allProducts.length)
  );
  const isLoadingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasMore = visibleCount < allProducts.length;

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsLoading(true);

    // Simulated network delay — remove once this is wired to a real,
    // paginated API call.
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, allProducts.length));
      isLoadingRef.current = false;
      setIsLoading(false);
    }, 400);
  }, [hasMore, allProducts.length]);

  const sentinelRef = useInfiniteScroll(loadMore);
  const products = allProducts.slice(0, visibleCount);

  if (products.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-400">
        No products in this category yet.
      </p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="mt-8 flex justify-center">
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more...
            </div>
          )}
        </div>
      )}
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
        <div className="w-full rounded-full bg-white px-6 py-4 shadow-sm">
          <h2 className="text-center text-lg font-bold text-[#3654D6] sm:text-xl">
            Select an Option
          </h2>
        </div>

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

        <div className="mt-4 w-full rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          {TABS.map((tab) => (
            <Tabs.Panel key={tab.id} id={tab.id}>
              <CategoryProductGrid categoryId={tab.id} />
            </Tabs.Panel>
          ))}
        </div>
      </Tabs>
    </section>
  );
}