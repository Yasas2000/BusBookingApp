import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";

export default function Layout() {

    return (
        <div>
            <Navbar />
            <div> <Outlet/></div>
            <Footer />
        </div>
    );
}