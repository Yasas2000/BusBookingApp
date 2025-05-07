import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, Route, useLocation } from "react-router-dom";
import { setUser, User } from "src/redux/userSlice";
import { getUserEmailFromToken, removeAuthDetails } from "./AuthUtils";
import axios from "axios";
import { RootState } from "src/redux/store";

export default function AuthGuard() {
    const isAuthenticated = useSelector((state: RootState) => state.user.authenticated);
    const [tokenError, setTokenError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const userEmail = await getUserEmailFromToken();
            
            if (!isAuthenticated && userEmail) {
              const response = await axios.get(`user/whoami?email=${userEmail}`);
              dispatch(setUser(response.data));
              console.log(isAuthenticated)
            } 
          } catch (error) {
            setTokenError(true);
          } finally {
            setLoading(false);
          }
        };
      
        fetchUserData();
      }, []);

      useEffect(() => {
        if (tokenError) {
            removeAuthDetails();
        }
      }, [tokenError])
      

      if (loading) {
        return <div>Loading authentication...</div>;
      }

      return isAuthenticated ? (
        <Outlet />
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      );
}