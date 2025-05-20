import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux/store";
import { checkTokenExpiration, getUserEmailFromToken, isAccessTokenAvailable, removeAuthDetails, setAuthDetails } from "src/auth/AuthUtils";
import axios from "axios";
import { setIsAuthenticated, setUser } from "src/redux/userSlice";

export default function AuthGuard() {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const [loading, setLoading] = useState(true);
  const navigate  = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
      const fetchUserData = async () => {
        try {
          const accessTokenAvailable = await isAccessTokenAvailable();
          if (accessTokenAvailable) {
            const isTokenExpired = await checkTokenExpiration();
            if (isTokenExpired) {
              const refreshToken = localStorage.getItem("refresh_token");
              const response = await axios.post(`/user/refresh`, { refreshToken: refreshToken });
              setAuthDetails(response.data);
              dispatch(setIsAuthenticated(true));
            } else if (accessTokenAvailable && isAuthenticated){
              dispatch(setIsAuthenticated(true));
            } else {
              const userEmail = await getUserEmailFromToken();
              const response = await axios.get(`user/whoami?email=${userEmail}`);
              dispatch(setUser(response.data));
              dispatch(setIsAuthenticated(true));
            }
          }
        } catch (error) {
          removeAuthDetails();
          navigate("/login", { replace: true });
        } finally {
          setLoading(false);
        }
      };
    
      fetchUserData();
    }, [location.pathname]);

    if (loading) {
      return <div>Loading...</div>;
    }

      return isAuthenticated ? (
        <Outlet />
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      );
}