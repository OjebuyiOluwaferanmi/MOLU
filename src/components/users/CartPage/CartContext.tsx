import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "molu_cart";

export interface CartItem {
  /** Unique per product + variant combo — two Add to Cart clicks with the
   *  same product but different color/memory become separate line items. */
  cartItemId: string;
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedMemory?: string;
}

interface AddToCartInput {
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedMemory?: string;
}

interface CartContextValue {
  items: CartItem[];
  /** Total units across all line items — what badges (Navbar, ScrollFab) show. */
  cartCount: number;
  addToCart: (input: AddToCartInput) => void;
  removeFromCart: (cartItemId: string) => void;
  incrementItem: (cartItemId: string) => void;
  decrementItem: (cartItemId: string) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function buildCartItemId(productId: string, color?: string, memory?: string) {
  return [productId, color ?? "", memory ?? ""].join("::");
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // corrupted value or storage unavailable — start empty
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // e.g. private browsing storage limits — fail silently
    }
  }, [items, isLoaded]);

  const addToCart = useCallback(({ productId, quantity, selectedColor, selectedMemory }: AddToCartInput) => {
    const cartItemId = buildCartItemId(productId, selectedColor, selectedMemory);
    setItems((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { cartItemId, productId, quantity, selectedColor, selectedMemory }];
    });
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }, []);

  const incrementItem = useCallback((cartItemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decrementItem = useCallback((cartItemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  }, []);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, cartCount, addToCart, removeFromCart, incrementItem, decrementItem }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}