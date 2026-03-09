import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Cart from "./presentation/pages/Cart/Cart";
import MainLayout from "./presentation/layouts/MainLayout";
import PlaceOrder from "./presentation/pages/PlaceOrder/PlaceOrder";
import { Toaster } from "react-hot-toast";
import { isAccess } from "./application/store/auth/hooks";
import PaymentResult from "./presentation/pages/PaymentResult/PaymentResult";
import ErrorBoundary from "./ErrorBoundary";
import AuthGuard from "./presentation/guards/AuthGuard";

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
            <Route path="/cart" element={<Cart />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route element={<PrivateRoute />}>
              <Route path="/payment/result" element={<PaymentResult />} />
            </Route>
            <Route path="*" element={<Navigate to="/cart" replace />} />
          </Route>
        </Routes>
      </AuthGuard>
    </ErrorBoundary>
  );
}

export default App;
