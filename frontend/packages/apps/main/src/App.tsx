import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import Error from "./pages/Error/Error";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart/Cart";
import Auth from "./pages/Auth";
import Collections from "./pages/Collections/Collections";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Profile from "./pages/Profile";
import { Toaster } from "react-hot-toast";
import { isAccess } from "./store/auth/hooks";
import PaymentResult from "./pages/PaymentResult/PaymentResult";
import Favourites from "./pages/Favourites";
import ErrorBoundary from "./ErrorBoundary";
import AuthGuard from "./guards/AuthGuard";

const PrivateRoute = () => {
  return isAccess() ? <Outlet /> : <Navigate to="/auth" />;
};

function App() {
  return (
    <ErrorBoundary>
      <Toaster position="top-right" reverseOrder={false} />
      <AuthGuard>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/collection" element={<Collections />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/cart" element={<Cart />} />
            <Route element={<PrivateRoute />}>
              <Route path="/favourite" element={<Favourites />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="/payment/result" element={<PaymentResult />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/*" element={<Error />} />
          </Route>
        </Routes>
      </AuthGuard>
    </ErrorBoundary>
  );
}

export default App;
