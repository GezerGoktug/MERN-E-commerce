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
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import { Toaster } from "react-hot-toast";
import { isAccess, isAdmin } from "./store/auth/hooks";
import PaymentResult from "./pages/PaymentResult/PaymentResult";
import AdminStats from "./pages/Admin/Stats/AdminStats";
import AdminAddProduct from "./pages/Admin/AddProduct/AdminAddProduct";
import AdminProducts from "./pages/Admin/Products/AdminProducts";
import AdminOrders from "./pages/Admin/Orders/AdminOrders";
import Favourites from "./pages/Favourites";

const PrivateRoute = () => {
  return isAccess() ? <Outlet /> : <Navigate to="/auth" />;
};

const AdminPrivateRoute = () => {
  return isAdmin() ? <Outlet /> : <Navigate to="/auth" />;
};

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
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
        <Route element={<AdminPrivateRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="stats" element={<AdminStats />} />
            <Route path="add-product" element={<AdminAddProduct />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="*" element={<Error isAdmin />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
