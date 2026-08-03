import LandingPage from './pages/users/LandingPage'
import { ScrollFab } from "./components/users/common/ScrollFab";
import { ScrollToTop } from "./components/users/common/ScrollToTop";
import { Routes, Route } from "react-router";
import ProductDetails from "./pages/users/ProductDetails";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>

      <ScrollFab cartCount={3} />
    </>
  )
}

export default App