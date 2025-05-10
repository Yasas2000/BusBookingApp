
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { RootState } from "src/redux/store";

export default function AuthGuard() {
    const isAuthenticated = useSelector((state: RootState) => state.user.authenticated);
    const location = useLocation();

      return isAuthenticated ? (
        <Outlet />
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      );
}