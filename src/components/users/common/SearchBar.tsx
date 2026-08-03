import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { SearchField } from "@heroui/react";
import { X, Clock, Search } from "lucide-react";
import { useRecentSearches } from "../../../hooks/useRecentSearches";
import { MOCK_SEARCH_ITEMS } from "../../../data/mockSearchItems";

interface SearchBarProps {
  className?: string;
  inputName?: string;
  placeholder?: string;
}

export default function SearchBar({
  className = "",
  inputName = "search",
  placeholder = "Search Molu",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { recentSearches, addSearch, removeSearch } = useRecentSearches();

  const trimmedQuery = query.trim();
  const lowerQuery = trimmedQuery.toLowerCase();

  // TODO: once a real search endpoint exists, replace this with a
  // debounced API call (e.g. GET /search?q=) — everything else below
  // (rendering, selection, recent-search saving) stays the same.
  const matches =
    trimmedQuery.length > 0
      ? MOCK_SEARCH_ITEMS.filter((item) => item.name.toLowerCase().includes(lowerQuery))
          .sort((a, b) => {
            const aStarts = a.name.toLowerCase().startsWith(lowerQuery);
            const bStarts = b.name.toLowerCase().startsWith(lowerQuery);
            if (aStarts === bStarts) return 0;
            return aStarts ? -1 : 1;
          })
          .slice(0, 8)
      : [];

  // Close on outside click — using mousedown (not blur) so clicking a
  // suggestion registers before the dropdown closes.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Selecting a suggestion (recent search OR a live match) now takes you
  // straight to that product's page, the same way clicking a ProductCard
  // does. `productId` is only present for live matches — recent searches
  // are just saved strings, so those fall back to filling the input.
  const handleSelect = (term: string, productId?: string) => {
    addSearch(term);
    setQuery(term);
    setIsOpen(false);
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  const handleSubmit = () => {
    if (!trimmedQuery) return;
    // Enter with no exact suggestion clicked — just save the term.
    // TODO: once a search results page exists, navigate there with `term`
    // instead of only saving it.
    handleSelect(trimmedQuery);
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <SearchField
        name={inputName}
        aria-label="Search MOLU"
        value={query}
        onChange={setQuery}
      >
        <SearchField.Group className="rounded-full border border-gray-200 bg-gray-50 focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue">
          <SearchField.SearchIcon className="ml-3 text-gray-400" />
          <SearchField.Input
            placeholder={placeholder}
            className="bg-transparent py-2 text-sm placeholder:text-gray-400"
            onFocus={() => setIsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape") setIsOpen(false);
            }}
          />
          <SearchField.ClearButton className="mr-2" />
        </SearchField.Group>
      </SearchField>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-2 shadow-lg">
          {trimmedQuery.length === 0 ? (
            recentSearches.length > 0 ? (
              <>
                <p className="px-2 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Recent Searches
                </p>
                {recentSearches.map((term) => (
                  <div
                    key={term}
                    className="group flex items-center justify-between rounded-lg px-2 py-2 hover:bg-gray-50"
                  >
                    <button
                      type="button"
                      onClick={() => handleSelect(term)}
                      className="flex flex-1 items-center gap-2 text-left text-sm text-gray-700"
                    >
                      <Clock className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      <span className="truncate">{term}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSearch(term)}
                      aria-label={`Remove "${term}" from recent searches`}
                      className="ml-2 shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </>
            ) : (
              <p className="px-2 py-3 text-center text-sm text-gray-400">
                No recent searches yet
              </p>
            )
          ) : matches.length > 0 ? (
            matches.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.name, item.id)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                <Search className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                <span className="truncate">{item.name}</span>
                <span className="ml-auto shrink-0 text-xs text-gray-400">
                  {item.categoryLabel}
                </span>
              </button>
            ))
          ) : (
            <p className="px-2 py-3 text-center text-sm text-gray-400">
              No results for &quot;{trimmedQuery}&quot;
            </p>
          )}
        </div>
      )}
    </div>
  );
}