import LandingPage from './pages/users/LandingPage'
import { ScrollFab } from "./components/users/common/ScrollFab";
import { ScrollToTop } from "./components/users/common/ScrollToTop";
import { Routes, Route, useLocation } from "react-router";
import ProductDetails from "./pages/users/ProductDetails";
import Cart from "./pages/users/Cart";
import { CartProvider } from "./components/users/CartPage/CartContext";
import Login from "./pages/users/Login";
import Signup from "./pages/users/Signup";
import ForgotPassword from "./pages/users/ForgotPassword";
import AccountLayout from "./components/users/MyOrders/AccountLayout";
import MyOrders from "./pages/users/MyOrders";
import OrderDetail from "./pages/users/OrderDetail";
import { AuthProvider } from "./components/users/Auth/AuthContext";
import { WishlistProvider } from "./components/users/Wishlist/WishlistContext";
import Wishlist from "./pages/users/Wishlist";
import BrowsingHistory from "./pages/users/BrowsingHistory";
import CouponsOffers from "./pages/users/CouponsOffers";
import Inbox from "./pages/users/Inbox";
import MessageDetail from "./pages/users/MessageDetail";
import RatingReviews from "./pages/users/RatingReviews";
import CreditBalance from "./pages/users/CreditBalance";
import { AddressProvider } from "./components/users/Address/AddressContext";
import AddressBook from "./pages/users/AddressBook";
import AccountManagement from "./pages/users/AccountManagement";


// Routes where the scroll-to-top/cart FAB shouldn't appear.
const HIDDEN_FAB_ROUTES = ["/login", "/signup", "/forgot-password"];

function App() {
  const location = useLocation();
  const hideFab = HIDDEN_FAB_ROUTES.includes(location.pathname);

  return (
    <AddressProvider>
    <AuthProvider>
    <WishlistProvider>
    <CartProvider>
      <ScrollToTop />
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/account" element={<AccountLayout />}>
          <Route path="orders" element={<MyOrders />} />
          <Route path="orders/:orderId" element={<OrderDetail />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="browsing-history" element={<BrowsingHistory />} />
          <Route path="coupons" element={<CouponsOffers />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="inbox/:messageId" element={<MessageDetail />} />
          <Route path="reviews" element={<RatingReviews />} />
          <Route path="credit-balance" element={<CreditBalance />} />
          <Route path="address" element={<AddressBook />} />
          <Route path="profile" element={<AccountManagement />} />
        </Route>
      </Routes>

      {!hideFab && <ScrollFab />}
    </CartProvider>
    </WishlistProvider>
    </AuthProvider>
    </AddressProvider>

  )
}

export default App