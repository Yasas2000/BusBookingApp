import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux/store";
import { checkTokenExpiration, getUserEmailFromToken, removeAuthDetails, setAuthDetails } from "src/auth/AuthUtils";
import axios from "axios";
import { setUser } from "src/redux/userSlice";

export default function Layout() {
    const isAuthenticated = useSelector((state:RootState) => state.user.authenticated);
    const [tokenError, setTokenError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const dispatch = useDispatch();
    const navigate  = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            if (!isAuthenticated) {
              const userEmail = await getUserEmailFromToken();
              const response = await axios.get(`user/whoami?email=${userEmail}`);
              dispatch(setUser(response.data));
            } else {
                if (await checkTokenExpiration()) {
                    const refreshToken = localStorage.getItem("refresh_token");
                    const response = await axios.post(`/user/refresh`, { refreshToken: refreshToken });
                    setAuthDetails(response.data);
                }
            }
          } catch (error) {
            setTokenError(true);
            removeAuthDetails();
            navigate("/login", { replace: true });
          } finally {
            setLoading(false);
          }
        };
      
        fetchUserData();
      }, [location.pathname]);

      useEffect(() => {
        if (tokenError) {
            removeAuthDetails();
        }
      }, [tokenError])

      if (loading) {
        return <div>Loading authentication...</div>;
      }

    return (
        <div>
            <Navbar />
            <div> <Outlet/></div>
            <Footer />
        </div>
    );
}