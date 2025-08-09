import { Outlet } from "react-router-dom";
import Header from "../components/layouts/Header/Header";
import Footer from "../components/layouts/Footer/Footer";
import ReturnTop from "../components/layouts/ReturnTopButton/ReturnTop";
import ThemeButton from "../components/layouts/ThemeButton/ThemeButton";

const MainLayout = () => {
  return (
    <>
      <ReturnTop />
      <ThemeButton/>
      <div className="container">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
