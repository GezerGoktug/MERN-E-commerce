import { Outlet } from "react-router-dom";
import Header from "../components/layouts/Header/Header";
import Footer from "../components/layouts/Footer/Footer";
import ReturnTop from "../components/layouts/ReturnTopButton/ReturnTop";
import SupportChatBot from "../components/layouts/SupportChatBot/SupportChatBot";

const MainLayout = () => {
  return (
    <>
      <ReturnTop />
      <SupportChatBot/>
      {/* <ThemeButton/> */}
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
