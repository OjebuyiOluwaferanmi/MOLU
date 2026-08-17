import { useState } from "react";
import { Plus, Pencil, Trash2, MapPin, Star } from "lucide-react";
import { useAddresses, type Address } from "../../components/users/Address/AddressContext";
import { AddressFormModal } from "../../components/users/Address/AddressFormModal";

export default function AddressBook() {
  const { addresses, addAddress, updateAddress, removeAddress, setDefaultAddress } = useAddresses();
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = (input: Omit<Address, "id" | "isDefault">) => {
    if (editingAddress) {
      updateAddress(editingAddress.id, input);
      setEditingAddress(null);
    } else {
      addAddress(input);
      setIsAdding(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900 sm:text-xl">Address Book</h1>
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#3654D6] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2d47bd]"
        >
          <Plus className="h-4 w-4" />
          Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <MapPin className="h-8 w-8 text-gray-300" />
          <p className="text-sm text-gray-500">You haven&apos;t saved any addresses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`flex flex-col gap-2 rounded-2xl border p-4 ${
                address.isDefault ? "border-[#3654D6]" : "border-gray-100"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">{address.label}</span>
                  {address.isDefault && (
                    <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[#3654D6]">
                      <Star className="h-2.5 w-2.5 fill-current" />
                      Default
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingAddress(address)}
                    aria-label="Edit address"
                    className="cursor-pointer rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#3654D6]"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAddress(address.id)}
                    aria-label="Delete address"
                    className="cursor-pointer rounded-full p-1.5 text-gray-400 hover:bg-red-50 hover:text-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm font-medium text-gray-800">{address.fullName}</p>
              <p className="text-sm text-gray-500">{address.phone}</p>
              <p className="text-sm text-gray-500">
                {address.addressLine1}
                {address.addressLine2 && `, ${address.addressLine2}`}
              </p>
              <p className="text-sm text-gray-500">
                {address.city}, {address.state}, {address.country}
              </p>

              {!address.isDefault && (
                <button
                  type="button"
                  onClick={() => setDefaultAddress(address.id)}
                  className="mt-1 cursor-pointer self-start text-xs font-semibold text-[#3654D6] hover:underline"
                >
                  Set as default
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {(isAdding || editingAddress) && (
        <AddressFormModal
          initialValue={editingAddress ?? undefined}
          onClose={() => {
            setIsAdding(false);
            setEditingAddress(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}