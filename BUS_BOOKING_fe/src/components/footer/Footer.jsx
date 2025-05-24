import React from "react";
import { FaMapPin } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Logo from "src/assets/logo.png";

const Footer = () => {
  return (
    <footer className="w-full px-4 sm:px-7 md:px-16 lg:px-28 py-8 bg-neutral-200/60 dark:bg-neutral-900/70">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & Description */}
        <div className="space-y-4">
          <Link to="/" className="inline-block">
            <img src={Logo} alt="logo" className="w-36 h-auto object-contain" />
          </Link>
          <p className="text-neutral-600 dark:text-neutral-500 text-base">
            Seamless and convenient bus ticket booking. Making travel easy for
            everyone, with a wide range of routes and services.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-2">Company</h2>
            <ul className="space-y-1 text-neutral-600 dark:text-neutral-500">
              <li>
                <Link to="#" className="hover:text-violet-600 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-violet-600 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-violet-600 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-violet-600 transition">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Services</h2>
            <ul className="space-y-1 text-neutral-600 dark:text-neutral-500">
              <li>
                <Link to="#" className="hover:text-violet-600 transition">
                  Safety Guarantee
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-violet-600 transition">
                  FAQ & Support
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-violet-600 transition">
                  Luxury Buses
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Get In Touch</h2>
          <div className="flex items-start gap-3">
            <FaMapPin className="text-xl text-neutral-600 dark:text-neutral-500 mt-1" />
            <div>
              <p className="text-xs text-neutral-600 dark:text-neutral-500">
                Support & Reservations
              </p>
              <p className="text-sm text-neutral-700 dark:text-neutral-400">
                123, Main Street, Anytown, SL
              </p>
              <p className="text-sm text-neutral-700 dark:text-neutral-400">
                +1 234 567 8900
              </p>
              <p className="text-sm text-neutral-700 dark:text-neutral-400">
                support@example.com
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className="mt-8 text-center text-xs text-neutral-500 dark:text-neutral-600">
        &copy; {new Date().getFullYear()} Bus Booking Platform. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
