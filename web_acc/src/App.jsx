import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import LoginAdminPage from './pages/LoginAdminPage';
import AccountsPage from './pages/AccountsPage';
import RegisterPage from './pages/RegisterPage';
import NapTienPage from './pages/NapTienPage';
import RutTienPage from './pages/RutTienPage';
import SellAccountPage from './pages/SellAccountPage';
import AccountDetailPage from './pages/AccountDetailPage';
import AdminAccountsPage from './pages/AdminAccountsPage';
import PendingApprovalPage from './pages/PendingApprovalPage';
import AuthContext from './context/AuthContext';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminRutTienPage from './pages/AdminRutTienPage';
import './App.css';

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useContext(AuthContext);
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function AdminRoute({ children }) {
  const { isLoggedIn, isAdmin } = useContext(AuthContext);
  
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function LayoutWrapper({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      <main className="main-content">
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <LayoutWrapper>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account/:accountId" element={<AccountDetailPage />} />

            {/* Protected routes for regular users */}
            <Route
              path="/nap-tien"
              element={
                <ProtectedRoute>
                  <NapTienPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rut-tien"
              element={
                <ProtectedRoute>
                  <RutTienPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sell-account"
              element={
                <ProtectedRoute>
                  <SellAccountPage />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route path="/admin" element={<LoginAdminPage />} />
            <Route
              path="/admin/accounts"
              element={
                <AdminRoute>
                  <AdminAccountsPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsersPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/pending-approval"
              element={
                <AdminRoute>
                  <PendingApprovalPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/yeu-cau-rut-tien"
              element={
                <AdminRoute>
                  <AdminRutTienPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }
            />

            {/* Redirects */}
            <Route path="/admin" element={<Navigate to="/admin/accounts" replace />} />
          </Routes>
        </LayoutWrapper>
      </div>
    </Router>
  );
}

export default App;