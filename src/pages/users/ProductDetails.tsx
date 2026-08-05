import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Fade } from "react-awesome-reveal";
import Navbar from "../../components/users/common/Navbar";
import PageContainer from "../../components/users/common/PageContainer";
import {
  ProductBreadcrumbs,
  type BreadcrumbItem,
} from "../../components/users/ProductDetails/ProductBreadCrumbs";
import { ProductGallery } from "../../components/users/ProductDetails/ProductGallery";
import { ProductInfo } from "../../components/users/ProductDetails/ProductInfo";
import { ProductCartPanel } from "../../components/users/ProductDetails/ProductCartPanel";
import { ProductDetailsTabs } from "../../components/users/ProductDetails/ProductDetailsTabs";
import { ImagePreviewModal } from "../../components/users/ProductDetails/ImagePreviewModal";
import { getProductById } from "../../data/mockSearchItems";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";
import { RelatedProducts } from "../../components/users/ProductDetails/RelatedProducts";
import { RecentlyViewed } from "../../components/users/landingPage/RecentlyViewed";
import { Footer } from "../../components/users/common/Footer";

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
    <div className="flex flex-col gap-4">
      <ProductBreadcrumbs items={breadcrumbItems} />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row">
              <ProductGallery
                product={product}
                activeImage={activeImage}
                onSelectImage={setActiveImage}
                onOpenPreview={openPreview}
              />
              <ProductInfo
                product={product}
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
                selectedMemory={selectedMemory}
                onSelectMemory={setSelectedMemory}
              />
            </div>
          </section>

          <ProductDetailsTabs product={product} onOpenPreview={openPreview} />
        </div>

        <ProductCartPanel
  product={product}
  quantity={quantity}
  onIncrement={() => setQuantity((q) => q + 1)}
  onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
  isWishlisted={isWishlisted}
  onToggleWishlist={() => setIsWishlisted((prev) => !prev)}
  selectedColor={selectedColor}
  selectedMemory={selectedMemory}
/>
      </div>
    </div>
  </Fade>
</PageContainer>

      <Fade triggerOnce direction="up" duration={600} delay={200}>
        <PageContainer>
          <RelatedProducts />
        </PageContainer>
      </Fade>

      <Fade triggerOnce direction="up" duration={600} delay={200}>
        <PageContainer>
          <RecentlyViewed />
        </PageContainer>
      </Fade>

      <Fade triggerOnce direction="up" duration={600} delay={200}>
          <Footer />
      </Fade>


      <ImagePreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={product.name}
        activeImage={activeImage}
        images={product.images}
        onSelectImage={setActiveImage}
      />
    </div>
  );
}