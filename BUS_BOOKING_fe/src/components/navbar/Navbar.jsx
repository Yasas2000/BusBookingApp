import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "src/assets/logo.png";
import { LiaTimesSolid } from "react-icons/lia";
import { FaBars, FaPhone, FaCartShopping } from "react-icons/fa6";
import Theme from "../theme/Theme";
import {
  checkTokenExpiration,
  getRoleFromToken,
  isAccessTokenAvailable,
  removeAuthDetails,
} from "src/auth/AuthUtils";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "src/redux/userSlice";
import { fetchCartData } from "src/redux/cartSlice";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("user");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const cartCount = useSelector((state) => state.cart.fares.length);
  const location = useLocation();
  const navRef = useRef(null);

  const navLinks = [{ href: "/dashboard", label: "Home" }];

  // Fetch cart count when component mounts and when authentication changes
  useEffect(() => {
    const getCartCount = async () => {
      if (isAuthenticated) {
        setLoading(true);

        try {
          setRole(getRoleFromToken);
          await dispatch(fetchCartData());
        } catch (error) {
          console.log(error);
        }
      }
    };
    getCartCount();
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && navRef.current && !navRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    // Add event listener when menu is open
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchend", handleClickOutside);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, [open]);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const logout = () => {
    setRole("");
    setIsAuthenticated(false);
    removeAuthDetails();
    dispatch(removeUser());
    navigate("/dashboard");
  };

  useEffect(() => {
    if (isAccessTokenAvailable() && !checkTokenExpiration()) {
      setIsAuthenticated(true);
    }
  }, [location.pathname]);

  return (
    <div className="w-full h-[8ch] bg-neutral-100 dark:bg-neutral-900 flex items-center md:flex-row lg:px-28 md:px-16 sm:px-7 px-4 fixed top-0 z-50">
      <Link to={"/"} className="mr-16">
        <img src={Logo} alt="logo" className="w-28 h-auto object-contain" />
      </Link>

      <button
        onClick={handleClick}
        className="flex-1 lg:hidden text-neutral-600 dark:text-neutral-300 ease-in-out duration-300 flex items-center justify-end"
      >
        {open ? (
          <LiaTimesSolid className="text-xl" />
        ) : (
          <FaBars className="text-xl" />
        )}
      </button>

      <div
        ref={navRef}
        className={`${open
            ? "flex absolute top-14 left-0 w-full h-auto md:h-auto md:relative"
            : "hidden"
          } flex-1 md:flex flex-col md:flex-row gap-x-5 gap-y-2 md:items-center md:p-0 sm:p-4 p-4 justify-between md:bg-transparent bg-neutral-100 md:shadow-none shadow-md rounded-md`}
      >
        <ul className="list-none flex md:items-center items-start gap-x-5 gap-y-1 flex-wrap md:flex-row flex-col text-base text-neutral-600 dark:text-neutral-500 font-medium">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link
                to={link.href}
                onClick={handleClose}
                className="hover:text-violet-600 ease-in-out duration-300"
              >
                {link.label}
              </Link>
            </li>
          ))}
          {role === "bus" && (
            <li>
              <Link
                to="/bus-routes"
                onClick={handleClose}
                className="hover:text-violet-600 ease-in-out duration-300"
              >
                Bus
              </Link>
            </li>
          )}
          {role === "admin" && (
            <li>
              <Link
                to="/bus-register"
                onClick={handleClose}
                className="hover:text-violet-600 ease-in-out duration-300"
              >
                Add Bus
              </Link>
            </li>
          )}
          {role === "admin" && (
            <li>
              <Link
                to="/register"
                onClick={handleClose}
                className="hover:text-violet-600 ease-in-out duration-300"
              >
                Add User
              </Link>
            </li>
          )}
          {isAuthenticated && (
            <li>
              <Link
                to="/booking"
                onClick={handleClose}
                className="hover:text-violet-600 ease-in-out duration-300"
              >
                My Booking
              </Link>
            </li>
          )}
        </ul>

        <div className="flex md:items-center items-start gap-x-6 gap-y-2 flex-wrap md:flex-row flex-col text-base font-medium text-neutral-800">
          {isAuthenticated && (
            <Link
              to="/cart"
              onClick={handleClose}
              className="relative flex items-center justify-center w-10 h-10 mr-4"
            >
              <FaCartShopping className="text-2xl text-violet-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          <div className="relative bg-violet-600 rounded-md px-8 py-2 w-fit cursor-pointer navbar-call-us">
            <div className="absolute top-[50%] -left-6 translate-y-[-50%] w-9 h-9 rounded-full bg-violet-600 border-4 border-neutral-100 dark:border-neutral-900 flex items-center justify-center">
              <FaPhone className="text-neutral-50 text-sm" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-neutral-200 font-light">Need Help?</p>
              <p className="text-xs font-normal text-neutral-50 tracking-wide">
                +94 117878787
              </p>
            </div>
          </div>
          <Theme />
          {isAuthenticated ? (
            <button
              type="button"
              className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              onClick={() => {
                logout();
                handleClose();
              }}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={handleClose}
              className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
