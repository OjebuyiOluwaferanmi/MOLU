import { Fade } from "react-awesome-reveal";
import { Link } from "react-router";
import Navbar from "../../components/users/common/Navbar";
import PageContainer from "../../components/users/common/PageContainer";
import { ProductBreadcrumbs } from "../../components/users/ProductDetails/ProductBreadCrumbs";
import { CartItemRow } from "../../components/users/CartPage/CartItemRow";
import { CartSummary } from "../../components/users/CartPage/CartSummary";
import { useCart } from "../../components/users/CartPage/CartContext";
import { RecentlyViewed } from "../../components/users/landingPage/RecentlyViewed";
import { Footer } from "../../components/users/common/Footer";

export default function Cart() {
  const { items } = useCart();

  return (
    <div className="bg-[#F1F1F1] min-h-screen">
      <Navbar />
      <PageContainer>
        <Fade triggerOnce direction="up" duration={600}>
          <ProductBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
        </Fade>

        <Fade triggerOnce direction="up" duration={600} delay={100}>
          {items.length === 0 ? (
            <div className="mt-4 rounded-3xl bg-white p-10 text-center shadow-sm">
              <p className="text-lg font-semibold text-gray-700">Your cart is empty.</p>
              <Link
                to="/"
                className="mt-4 inline-block cursor-pointer font-semibold text-[#3654D6] hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start">
              <div className="flex-1 divide-y divide-gray-100 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
                {items.map((item) => (
                  <CartItemRow key={item.cartItemId} item={item} />
                ))}
              </div>

              <CartSummary items={items} />
            </div>
          )}
        </Fade>
      </PageContainer>
      <Fade triggerOnce direction="up" duration={600} delay={200}>
              <PageContainer>
                <RecentlyViewed />
              </PageContainer>
            </Fade>
      
            <Fade triggerOnce direction="up" duration={600} delay={200}>
                <Footer />
            </Fade>
    </div>
  );
}