import { Tabs } from "@heroui/react";
import { SlidersHorizontal, ChevronDown, User as UserIcon } from "lucide-react";
import type { MockProduct } from "../../../data/mockSearchItems";
import { StarRating } from "./icons";

interface ProductDetailsTabsProps {
  product: MockProduct;
  onOpenPreview: (img: string) => void;
}

/** The "Product Details" / "Rating & Reviews" tab switcher, and both panels. */
export function ProductDetailsTabs({ product, onOpenPreview }: ProductDetailsTabsProps) {
  return (
    <section className="w-full">
      <Tabs className="w-full" defaultSelectedKey="details">
        <Tabs.ListContainer className="w-full rounded-full bg-white p-2 shadow-sm">
          <Tabs.List aria-label="Product detail sections" className="grid w-full grid-cols-2">
            <Tabs.Tab
              id="details"
              className="cursor-pointer rounded-full py-2.5 text-center text-sm font-semibold text-[#3654D6] outline-none transition-colors data-[selected=true]:bg-[#3654D6] data-[selected=true]:text-white sm:text-base"
            >
              Product Details
              <Tabs.Indicator className="hidden" />
            </Tabs.Tab>
            <Tabs.Tab
              id="reviews"
              className="cursor-pointer rounded-full py-2.5 text-center text-sm font-semibold text-[#3654D6] outline-none transition-colors data-[selected=true]:bg-[#3654D6] data-[selected=true]:text-white sm:text-base"
            >
              Rating & Reviews
              <Tabs.Indicator className="hidden" />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>

        <Tabs.Panel id="details" className="pt-4">
          <div className="flex flex-col gap-6 rounded-3xl bg-white p-6 text-left shadow-sm sm:p-8">
            {product.specifications && (
              <div>
                <h3 className="mb-2 font-semibold text-gray-900">Specifications</h3>
                <ul className="text-sm text-gray-600">
                  {product.specifications.map((spec) => (
                    <li key={spec.label} className="flex items-start gap-2 border-b border-gray-100 py-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      <span>
                        <span className="font-semibold text-gray-900">{spec.label}:</span> {spec.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="mb-2 font-semibold text-gray-900">Description</h3>
              <div className="border-t border-gray-100 pt-3">
                <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>
              </div>
            </div>

            {product.packageItemCount !== undefined && (
              <div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  Number of items in the delivery package
                </h3>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-sm text-gray-600">{product.packageItemCount}</p>
                </div>
              </div>
            )}

            {product.whatsInTheBox && (
              <div>
                <h3 className="mb-2 font-semibold text-gray-900">What is in the box</h3>
                <ul className="border-t border-gray-100">
                  {product.whatsInTheBox.map((thing) => (
                    <li
                      key={thing}
                      className="flex items-start gap-2 border-b border-gray-100 py-2.5 text-sm text-gray-600"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      <span>{thing}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="mb-3 font-semibold text-gray-900">Images</h3>
              <div className="flex flex-col items-center gap-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => onOpenPreview(img)}
                    aria-label={`Open image ${index + 1}`}
                    className="w-full max-w-sm cursor-pointer overflow-hidden rounded-xl bg-gray-50"
                  >
                    <img
                      src={img}
                      alt={`${product.name} image ${index + 1}`}
                      className="h-auto w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Tabs.Panel>

        <Tabs.Panel id="reviews" className="pt-4">
          <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 text-left shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">
                    All Reviews ({product.reviewCount ?? 0})
                  </h3>
                  <StarRating rating={product.rating} />
                  <span className="text-sm text-gray-500">{product.rating}/5</span>
                </div>
                <p className="mt-1 text-xs text-gray-400">All reviews are from verified purchases</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Filter reviews"
                  className="cursor-pointer rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-1 rounded-full border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Latest
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {product.reviews?.map((review) => (
                <div key={review.id} className="rounded-2xl bg-gray-50 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                        <UserIcon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium text-gray-800">{review.reviewerName}</span>
                    </div>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <StarRating rating={review.rating} />
                    <span className="text-xs text-gray-500">{review.rating}/5</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>

            <div className="mt-2 flex justify-center">
              <button
                type="button"
                className="cursor-pointer rounded-full border border-[#3654D6] px-8 py-2.5 text-sm font-semibold text-[#3654D6] transition-colors hover:bg-[#3654D6] hover:text-white"
              >
                View All
              </button>
            </div>
          </div>
        </Tabs.Panel>
      </Tabs>
    </section>
  );
}