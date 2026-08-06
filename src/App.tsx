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

// Routes where the scroll-to-top/cart FAB shouldn't appear.
const HIDDEN_FAB_ROUTES = ["/login", "/signup", "/forgot-password"];

function App() {
  const location = useLocation();
  const hideFab = HIDDEN_FAB_ROUTES.includes(location.pathname);

  return (
    <CartProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>

      {!hideFab && <ScrollFab />}
    </CartProvider>
  )
}

export default App