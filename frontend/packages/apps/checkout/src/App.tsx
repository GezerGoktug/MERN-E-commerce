import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Cart from "./pages/Cart/Cart";
import MainLayout from "./layouts/MainLayout";
import PlaceOrder from "./pages/PlaceOrder";
import { Toaster } from "react-hot-toast";
import { isAccess } from "./store/auth/hooks";
import PaymentResult from "./pages/PaymentResult/PaymentResult";
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
          <Route element={<MainLayout />}>
            <Route path="/checkout/cart" element={<Cart />} />
            <Route path="/checkout/place-order" element={<PlaceOrder />} />
            <Route element={<PrivateRoute />}>
              <Route path="/checkout/payment/result" element={<PaymentResult />} />
            </Route>
            <Route path="*" element={<Navigate to="/checkout/cart" replace />} />
          </Route>
        </Routes>
      </AuthGuard>
    </ErrorBoundary>
  );
}

export default App;
