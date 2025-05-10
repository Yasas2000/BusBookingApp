import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/store";
import { checkTokenExpiration, getUserEmailFromToken, removeAuthDetails, setAuthDetails } from "src/auth/AuthUtils";
import axios from "axios";

export default function AuthGuard() {
  const isAuthenticated = useSelector((state:RootState) => state.user.authenticated);
  const navigate  = useNavigate();
  const location = useLocation();

  useEffect(() => {
      const fetchUserData = async () => {
        try {
          if (await checkTokenExpiration()) {
            const refreshToken = localStorage.getItem("refresh_token");
            const response = await axios.post(`/user/refresh`, { refreshToken: refreshToken });
            setAuthDetails(response.data);
        }
        } catch (error) {
          removeAuthDetails();
          navigate("/login", { replace: true });
        }
      };
    
      fetchUserData();
    }, [location.pathname]);

      return isAuthenticated ? (
        <Outlet />
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      );
}