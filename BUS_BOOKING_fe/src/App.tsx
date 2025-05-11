import Login from 'src/auth/Login';
import AuthGuard from 'src/auth/AuthGuard';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from 'src/components/Layout';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import HomeContainer from 'src/pages/home_container/HomeContainer';
import Bus from 'src/pages/bus/Bus';
import Details from 'src/pages/bus/Details';
import Checkout from 'src/pages/checkout/Checkout';
import Register from 'src/auth/Register';

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.user.authenticated);
  
  return (
    <BrowserRouter>
      <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-300 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            {/* proteced routes */}
            <Route element={<AuthGuard />}>
              <Route path="profile" element={<div>Profile Page</div>} />
              <Route path="details/checkout" element={<Checkout />} />
              <Route path="detail" element={<Details />} />
            </Route>
            {/* unprotected routes */}
            <Route path="dashboard" element={<HomeContainer/>} />
            <Route path="bus" element={<Bus />} />
          </Route>
        </Routes>
      </div>
      
    </BrowserRouter>
  );
}

export default App;