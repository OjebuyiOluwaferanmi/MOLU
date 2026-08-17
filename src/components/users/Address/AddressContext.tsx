import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "molu_addresses";

export interface Address {
  id: string;
  label: string; // "Home", "Work", "Other", etc.
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
}

type AddressInput = Omit<Address, "id" | "isDefault">;

interface AddressContextValue {
  addresses: Address[];
  addAddress: (input: AddressInput) => void;
  updateAddress: (id: string, input: AddressInput) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const AddressContext = createContext<AddressContextValue | undefined>(undefined);

export function AddressProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setAddresses(JSON.parse(stored));
    } catch {
      // corrupted value or storage unavailable — start empty
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    } catch {
      // e.g. private browsing storage limits — fail silently
    }
  }, [addresses, isLoaded]);

  const addAddress = useCallback((input: AddressInput) => {
    setAddresses((prev) => {
      const isFirst = prev.length === 0;
      return [
        ...prev,
        { ...input, id: `addr-${Date.now()}`, isDefault: isFirst },
      ];
    });
  }, []);

  const updateAddress = useCallback((id: string, input: AddressInput) => {
    setAddresses((prev) =>
      prev.map((addr) => (addr.id === id ? { ...addr, ...input } : addr))
    );
  }, []);

  const removeAddress = useCallback((id: string) => {
    setAddresses((prev) => {
      const filtered = prev.filter((addr) => addr.id !== id);
      // If the removed address was default, promote the first remaining one.
      const hadDefault = prev.find((a) => a.id === id)?.isDefault;
      if (hadDefault && filtered.length > 0) {
        filtered[0] = { ...filtered[0], isDefault: true };
      }
      return filtered;
    });
  }, []);

  const setDefaultAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.map((addr) => ({ ...addr, isDefault: addr.id === id })));
  }, []);

  return (
    <AddressContext.Provider
      value={{ addresses, addAddress, updateAddress, removeAddress, setDefaultAddress }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddresses() {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error("useAddresses must be used within an AddressProvider");
  return ctx;
}