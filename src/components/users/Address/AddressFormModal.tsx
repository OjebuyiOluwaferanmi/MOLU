import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type { Address } from "./AddressContext";

interface AddressFormModalProps {
  initialValue?: Address;
  onClose: () => void;
  onSave: (input: Omit<Address, "id" | "isDefault">) => void;
}

const inputClass =
  "rounded-full border border-gray-200 px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#3654D6] focus:outline-none";

export function AddressFormModal({ initialValue, onClose, onSave }: AddressFormModalProps) {
  const [form, setForm] = useState({
    label: initialValue?.label ?? "",
    fullName: initialValue?.fullName ?? "",
    phone: initialValue?.phone ?? "",
    addressLine1: initialValue?.addressLine1 ?? "",
    addressLine2: initialValue?.addressLine2 ?? "",
    city: initialValue?.city ?? "",
    state: initialValue?.state ?? "",
    country: initialValue?.country ?? "",
  });

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">
            {initialValue ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer rounded-full p-1 text-gray-400 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">Label</label>
            <input
              required
              value={form.label}
              onChange={update("label")}
              placeholder="Home, Work, etc."
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">Full Name</label>
              <input
                required
                value={form.fullName}
                onChange={update("fullName")}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">Phone Number</label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={update("phone")}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">Address Line 1</label>
            <input
              required
              value={form.addressLine1}
              onChange={update("addressLine1")}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">
              Address Line 2 <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input value={form.addressLine2} onChange={update("addressLine2")} className={inputClass} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">City</label>
              <input required value={form.city} onChange={update("city")} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">State</label>
              <input required value={form.state} onChange={update("state")} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">Country</label>
              <input required value={form.country} onChange={update("country")} className={inputClass} />
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 w-full cursor-pointer rounded-full bg-[#3654D6] py-3 text-sm font-bold text-white transition-colors hover:bg-[#2d47bd]"
          >
            Save Address
          </button>
        </form>
      </div>
    </div>
  );
}