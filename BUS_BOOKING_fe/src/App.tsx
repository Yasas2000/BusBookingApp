import Login from 'src/auth/Login';
import AuthGuard from 'src/auth/AuthGuard';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from 'src/components/Layout';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import HomeContainer from './pages/home_container/HomeContainer';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Bus from './pages/bus/Bus';
import Details from './pages/bus/Details';
import Checkout from './pages/checkout/Checkout';

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.user.authenticated);
  return (
    <BrowserRouter>
      <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-300 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar />
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />

          <Route element={<AuthGuard />}>
            <Route path="/" element={<Layout />}>
              <Route path="profile" element={<div>Profile Page</div>} />
              <Route path="details/checkout" element={<Checkout />} />
              <Route path="detail" element={<Details />} />
            </Route>
          </Route>
          <Route path="/" element={<Layout />}>
              <Route path="dashboard" element={<HomeContainer/>} />
              <Route path="bus" element={<Bus />} />
          </Route>

        </Routes>
        {/* Footer */}
        <Footer />
      </div>
      
    </BrowserRouter>
  );
}

export default App;