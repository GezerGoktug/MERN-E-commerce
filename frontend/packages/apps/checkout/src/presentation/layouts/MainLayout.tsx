import { MainLayout as LayoutKitMainLayout } from "@forever/layout-kit";
import { useTotalCartQuantities } from "../../application/store/cart/hooks";
import { isAccess } from "../../application/store/auth/hooks";
import { useGetFavProductsCountQuery } from "../../application/use-cases/product.use-cases";
import SupportChatBot from "../components/SupportChatBot/SupportChatBot";

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
