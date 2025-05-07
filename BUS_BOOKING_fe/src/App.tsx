import Login from 'src/auth/Login';
import AuthGuard from 'src/auth/AuthGuard';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from 'src/components/Layout';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.user.authenticated);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />

        <Route element={<AuthGuard />}>
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<div>Dashboard Content</div>} />
            <Route path="profile" element={<div>Profile Page</div>} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;