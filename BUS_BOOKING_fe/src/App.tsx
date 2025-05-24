import Login from "src/auth/Login";
import AuthGuard from "src/auth/AuthGuard";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "src/components/Layout";
import HomeContainer from "src/pages/home_container/HomeContainer";
import Details from "src/pages/bus/Details";
import Checkout from "src/pages/checkout/Checkout";
import Search from "src/pages/search/Search";
import Cart from "src/pages/booking/Cart";
import UserBookings from "src/pages/booking/UserBooking";
import BusRoutes from "src/pages/routes/BusRoutes";
import SeatLayoutView from "src/pages/bus/SeatLayoutView";
import RegisterBusOperator from "src/pages/form/BusRegistrationForm";
import Register from "src/auth/Register";
import Success from "./pages/payment/Success";

function App() {
  return (
    <BrowserRouter>

      <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-300 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            {/* Protected routes */}
            <Route element={<AuthGuard />}>
              <Route path="profile" element={<div>Profile Page</div>} />
              <Route path="details/checkout" element={<Checkout />} />
              <Route path="payment/success" element={<Success />} />
              <Route path="detail" element={<Details />} />
              <Route path="cart" element={<Cart />} />
              <Route path="booking" element={<UserBookings />} />
              <Route path="bus-routes" element={<BusRoutes />} />
              <Route path="/operator/seats" element={<SeatLayoutView />} />
            </Route>

            {/* Unprotected routes */}
            <Route path="dashboard" element={<HomeContainer />} />
            <Route path="search" element={<Search />} />
            <Route path="bus-register" element={<RegisterBusOperator />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
