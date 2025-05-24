import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "src/components/navbar/Navbar";
import Footer from "src/components/footer/Footer";

export default function Layout() {
  return (
    <div>
      <Navbar />
      <div>
        {" "}
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
