import { MainLayout as LayoutKitMainLayout } from "@forever/layout-kit";
import { useTotalCartQuantities } from "../store/cart/hooks";
import { isAccess } from "../store/auth/hooks";
import { useGetFavProductsCountQuery } from "../services/hooks/queries/product.query";
import SupportChatBot from "../components/layouts/SupportChatBot/SupportChatBot";

const MainLayout = () => {
  const cartCount = useTotalCartQuantities();
  const isAuthenticated = isAccess();

  const { data: favData } = useGetFavProductsCountQuery(
    [isAuthenticated ? "favProductEnabled" : "favProductDisabled"],
    { enabled: isAuthenticated }
  );

  return (
    <LayoutKitMainLayout
      cartCount={cartCount}
      favCount={favData?.data.count ?? 0}
      isAuthenticated={isAuthenticated}
      chatbot={<SupportChatBot />}
    />
  );
};

export default MainLayout;
