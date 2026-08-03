import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { createPortal } from "react-dom";
import { Fade } from "react-awesome-reveal";
import { Tabs } from "@heroui/react";
import { useId } from "react";
import {
  Check,
  MessageCircle,
  SlidersHorizontal,
  ChevronDown,
  User as UserIcon,
  X as CloseX,
  Heart,
} from "lucide-react";
import Navbar from "../../components/users/common/Navbar";
import PageContainer from "../../components/users/common/PageContainer";
import {
  ProductBreadcrumbs,
  type BreadcrumbItem,
} from "../../components/users/ProductDetails/ProductBreadCrumbs";
import { getProductById } from "../../data/mockSearchItems";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`h-4 w-4 ${className}`} fill="currentColor">
      <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L10 14.9l-5.2 2.62.99-5.8-4.21-4.1 5.82-.85L10 1.5z" />
    </svg>
  );
}

function Star({ fillPercent }: { fillPercent: number }) {
  return (
    <span className="relative inline-block h-4 w-4">
      <StarIcon className="absolute inset-0 text-gray-300" />
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercent}%` }}>
        <StarIcon className="text-[#3654D6]" />
      </span>
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fillPercent = Math.max(0, Math.min(1, rating - i)) * 100;
        return <Star key={i} fillPercent={fillPercent} />;
      })}
    </div>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#1877F2">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94z" />
    </svg>
  );
}

function InstagramIcon() {
  const gradientId = useId();
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={`url(#${gradientId})`} strokeWidth={2}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FED576" />
          <stop offset="30%" stopColor="#F47133" />
          <stop offset="60%" stopColor="#BC3081" />
          <stop offset="100%" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37a4 4 0 1 1-7.914 1.174A4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2.5} />
    </svg>
  );
}
function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#111111">
      <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.3 22H1.2l8.1-9.3L1 2h7.1l4.9 6.1L18.9 2zm-1.2 18h1.9L7.4 3.9H5.4L17.7 20z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366]">
      <MessageCircle className="h-3 w-3" color="white" fill="white" />
    </span>
  );
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(id) : undefined;
  const { addViewedProduct } = useRecentlyViewed();

  const [activeImage, setActiveImage] = useState(product?.images[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name);
  const [selectedMemory, setSelectedMemory] = useState(product?.memoryOptions?.[0]);

  useEffect(() => {
    if (!product) return;
    addViewedProduct(product.id);
    setActiveImage(product.images[0]);
    setQuantity(1);
    setSelectedColor(product.colors?.[0]?.name);
    setSelectedMemory(product.memoryOptions?.[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  if (!product) {
    return (
      <div className="bg-[#F1F1F1] min-h-screen">
        <Navbar />
        <PageContainer>
          <div className="mt-6 rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-gray-700">
              Sorry, we couldn't find that product.
            </p>
            <Link to="/" className="mt-4 inline-block cursor-pointer font-semibold text-[#3654D6] hover:underline">
              Back to Home
            </Link>
          </div>
        </PageContainer>
      </div>
    );
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: product.categoryLabel, href: `/category/${product.categoryId}` },
    ...(product.subcategoryId
      ? [
          {
            label: product.subcategoryLabel ?? product.subcategoryId,
            href: `/category/${product.categoryId}/${product.subcategoryId}`,
          },
        ]
      : []),
    { label: product.name },
  ];

  const openPreview = (img: string) => {
    setActiveImage(img);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-[#F1F1F1] min-h-screen">
      <Navbar />
      <PageContainer>
        <Fade triggerOnce direction="up" duration={600}>
          <ProductBreadcrumbs items={breadcrumbItems} />
        </Fade>

        {/* Gallery + info + price panel */}
        <Fade triggerOnce direction="up" duration={600} delay={100}>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-stretch">
            {/* Main card: thumbnails+share | main image | details */}
            <section className="flex-1 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row">
                {/* Left column: thumbnail stack + share row underneath */}
                <div className="flex shrink-0 flex-row gap-3 sm:flex-col">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      aria-label={`Show product image ${index + 1}`}
                      className={`h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-lg border transition-colors sm:h-16 sm:w-16 ${
                        activeImage === img
                          ? "border-[#3654D6]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}

                  {/* Share row — sits under the thumbnails on desktop */}
                  <div className="mt-1 hidden flex-col gap-2 sm:flex">
                    <p className="text-xs text-gray-500">Share with others:</p>
                    <div className="flex items-center gap-2">
                      <button type="button" aria-label="Share on Facebook" className="cursor-pointer hover:opacity-80">
                        <FacebookIcon />
                      </button>
                      <button type="button" aria-label="Share on Instagram" className="cursor-pointer hover:opacity-80">
                        <InstagramIcon />
                      </button>
                      <button type="button" aria-label="Share on WhatsApp" className="cursor-pointer hover:opacity-80">
                        <WhatsAppIcon />
                      </button>
                      <button type="button" aria-label="Share on X" className="cursor-pointer hover:opacity-80">
                        <TwitterIcon />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main image */}
                <button
                  type="button"
                  onClick={() => openPreview(activeImage!)}
                  aria-label="Open image preview"
                  className="aspect-square w-full max-w-xs cursor-pointer overflow-hidden rounded-xl bg-gray-50 sm:w-64"
                >
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                </button>

                {/* Details */}
                <div className="flex flex-1 flex-col gap-2 text-left">
                  <h1 className="text-lg font-bold leading-snug text-gray-900 sm:text-xl">
                    {product.name}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Brand: <span className="font-medium text-[#3654D6]">{product.brand}</span>
                  </p>
                  <p className="text-sm text-gray-500">Product Code: {product.productCode}</p>

                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    <span className="text-sm text-gray-400 line-through">
                      ₦{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">
                      -{product.discountPercent}%
                    </span>
                  </div>
                  <span className="text-xl font-bold text-[#3654D6] sm:text-2xl">
                    ₦{product.price.toLocaleString()}
                  </span>

                  {/* Colors */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="mt-3 border-t border-gray-100 pt-3">
                      <p className="text-sm text-gray-500">
                        Select Colors:{" "}
                        <span className="font-medium text-gray-700">{selectedColor}</span>
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        {product.colors.map((color) => {
                          const isSelected = selectedColor === color.name;
                          return (
                            <button
                              key={color.name}
                              type="button"
                              onClick={() => setSelectedColor(color.name)}
                              aria-label={`Select color ${color.name}`}
                              aria-pressed={isSelected}
                              className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 transition-colors ${
                                isSelected ? "border-[#3654D6]" : "border-transparent hover:border-gray-300"
                              }`}
                              style={{ backgroundColor: color.hex }}
                            >
                              {isSelected && (
                                <Check
                                  className="h-3.5 w-3.5"
                                  color={color.hex === "#111111" ? "#FFFFFF" : "#111111"}
                                  strokeWidth={3}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Memory sizes */}
                  {product.memoryOptions && product.memoryOptions.length > 0 && (
                    <div className="mt-3 border-t border-gray-100 pt-3">
                      <p className="text-sm text-gray-500">
                        Choose Memory Size:{" "}
                        <span className="font-medium text-gray-700">{selectedMemory}</span>
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {product.memoryOptions.map((size) => {
                          const isSelected = selectedMemory === size;
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setSelectedMemory(size)}
                              aria-pressed={isSelected}
                              className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
                                isSelected
                                  ? "border-[#3654D6] bg-[#3654D6] text-white"
                                  : "border-[#3654D6] text-[#3654D6] hover:bg-blue-50"
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Share row — mobile only, since desktop shows it under thumbnails */}
                  <div className="mt-3 border-t border-gray-100 pt-3 sm:hidden">
                    <p className="text-xs text-gray-500">Share with others:</p>
                    <div className="mt-2 flex items-center gap-3">
                      <button type="button" aria-label="Share on Facebook" className="cursor-pointer hover:opacity-80">
                        <FacebookIcon />
                      </button>
                      <button type="button" aria-label="Share on Instagram" className="cursor-pointer hover:opacity-80">
                        <InstagramIcon />
                      </button>
                      <button type="button" aria-label="Share on WhatsApp" className="cursor-pointer hover:opacity-80">
                        <WhatsAppIcon />
                      </button>
                      <button type="button" aria-label="Share on X" className="cursor-pointer hover:opacity-80">
                        <TwitterIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Price / cart panel */}
            <aside className="w-full shrink-0 rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:w-72">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Total Price:
              </p>
              <p className="mt-1 text-xl font-bold text-[#3654D6] sm:text-2xl">
  ₦{(product.price * quantity).toLocaleString()}
</p>

              <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    product.inStock ? "bg-[#3654D6]" : "bg-gray-300"
                  }`}
                >
                  <Check className="h-3 w-3" color="white" strokeWidth={3} />
                </span>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </div>

              <div className="mt-5 flex items-center justify-between rounded-full border-2 border-[#3654D6] px-6 py-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="cursor-pointer text-xl font-bold text-[#3654D6]"
                >
                  −
                </button>
                <span className="text-lg font-bold text-[#3654D6]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="cursor-pointer text-xl font-bold text-[#3654D6]"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="mt-5 w-full cursor-pointer rounded-full bg-[#3654D6] py-3.5 text-base font-bold text-white transition-colors hover:bg-[#2d47bd]"
              >
                Add to Cart
              </button>

              <button
                type="button"
                onClick={() => setIsWishlisted((prev) => !prev)}
                aria-pressed={isWishlisted}
                className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#3654D6]"
              >
                <Heart
                  className="h-5 w-5"
                  color="#3654D6"
                  fill={isWishlisted ? "#3654D6" : "none"}
                  strokeWidth={1.8}
                />
                Add to wishlist
              </button>
            </aside>
          </div>
        </Fade>

        {/* Tabs: Product Details / Rating & Reviews */}
        <Fade triggerOnce direction="up" duration={600} delay={150}>
          <section className="mt-4 w-full">
            <Tabs className="w-full" defaultSelectedKey="details">
              <Tabs.ListContainer className="w-full rounded-full bg-white p-2 shadow-sm">
                <Tabs.List
                  aria-label="Product detail sections"
                  className="grid w-full grid-cols-2"
                >
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

              {/* Product Details panel */}
              <Tabs.Panel id="details" className="pt-4">
                <div className="flex flex-col gap-6 rounded-3xl bg-white p-6 text-left shadow-sm sm:p-8">
                  {product.specifications && (
  <div>
    <h3 className="mb-2 font-semibold text-gray-900">Specifications</h3>
    <ul className="text-sm text-gray-600">
      {product.specifications.map((spec) => (
        <li
          key={spec.label}
          className="flex items-start gap-2 border-b border-gray-100 py-2.5"
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
          <span>
            <span className="font-semibold text-gray-900">{spec.label}:</span>{" "}
            {spec.value}
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
                          onClick={() => openPreview(img)}
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

              {/* Rating & Reviews panel */}
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
                      <p className="mt-1 text-xs text-gray-400">
                        All reviews are from verified purchases
                      </p>
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
                            <span className="text-sm font-medium text-gray-800">
                              {review.reviewerName}
                            </span>
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
        </Fade>
      </PageContainer>

      {/* Fullscreen image preview modal */}
      {isModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black/90 p-4 sm:p-8"
            onClick={() => setIsModalOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close image preview"
              className="absolute right-4 top-4 z-10 cursor-pointer text-white transition-opacity hover:opacity-80"
            >
              <CloseX className="h-6 w-6" />
            </button>

            <div
              className="flex max-h-[70vh] w-full max-w-4xl items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeImage}
                alt={product.name}
                className="max-h-[70vh] max-w-full object-contain"
              />
            </div>

            <div className="flex shrink-0 flex-row gap-3" onClick={(e) => e.stopPropagation()}>
              {product.images.map((thumb, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveImage(thumb)}
                  aria-label={`Show product image ${index + 1}`}
                  className={`h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-colors sm:h-16 sm:w-16 ${
                    activeImage === thumb
                      ? "border-white"
                      : "border-white/30 hover:border-white/70"
                  }`}
                >
                  <img
                    src={thumb}
                    alt={`Thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}