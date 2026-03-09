import { type ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import ReturnTop from "../ReturnTop/ReturnTop";

interface MainLayoutProps {
  cartCount?: number;
  favCount?: number;
  isAuthenticated?: boolean;
  chatbot?: ReactNode;
}

const MainLayout = ({ cartCount, favCount, isAuthenticated, chatbot }: MainLayoutProps) => {
  return (
    <>
      <ReturnTop />
      {chatbot}
      <div className="container">
        <Header
          cartCount={cartCount}
          favCount={favCount}
          isAuthenticated={isAuthenticated}
        />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
