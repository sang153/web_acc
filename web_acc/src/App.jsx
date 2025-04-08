// src/App.jsx
import React from 'react';
// Import các thành phần của React Router
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Đảm bảo có Navigate

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import các component dùng chung và các component của từng trang
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';       // Trang chủ
import LoginPage from './pages/LoginPage';       // Trang đăng nhập
import AccountsPage from './pages/AccountsPage'; // Trang danh sách tài khoản
import RegisterPage from './pages/RegisterPage'; // Trang đăng ký
import NapTienPage from './pages/NapTienPage'; // Trang nạp tiền
import SellAccountPage from './pages/SellAccountPage'; // Trang bán acc
import AccountDetailPage from './pages/AccountDetailPage';
// Import CSS cho App
import './App.css';

// ============================================
// Định nghĩa ProtectedRoute Component
// (Bạn có thể tách ra file riêng nếu muốn: src/components/ProtectedRoute.jsx)
// ============================================
function ProtectedRoute({ children }) {
  // --- Lấy trạng thái đăng nhập ---
  // !!! QUAN TRỌNG: Thay thế logic này bằng cách kiểm tra đăng nhập thực tế của bạn !!!
  // Ví dụ đơn giản: kiểm tra xem có 'authToken' trong localStorage không
  const isLoggedIn = !!localStorage.getItem('authToken');
  //
  // CÁC CÁCH KHÁC PHỔ BIẾN:
  // - Dùng Context API: const { user } = useContext(AuthContext); const isLoggedIn = !!user;
  // - Dùng Redux: const user = useSelector(state => state.auth.user); const isLoggedIn = !!user;
  // - Hoặc bất kỳ cách nào bạn dùng để lưu trạng thái đăng nhập.
  // ---------------------------------

  if (!isLoggedIn) {
    // Nếu chưa đăng nhập, chuyển hướng về trang login
    // `replace` để không lưu trang hiện tại vào lịch sử trình duyệt
    // Cân nhắc thêm `state={{ from: location }}` nếu bạn muốn quay lại trang cũ sau login
    // (cần import thêm `useLocation` từ react-router-dom)
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, hiển thị component con được truyền vào (children)
  return children;
}
// ============================================


// ============================================
// Component App chính
// ============================================
function App() {
  return (
    // Bọc toàn bộ ứng dụng trong Router để kích hoạt routing
    <Router>
      <div className="App">
        {/* Container cho thư viện thông báo Toastify */}
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

        {/* Header hiển thị trên tất cả các trang */}
        <Header />

        {/* Khu vực nội dung chính, nơi các component trang sẽ được render */}
        <main className="main-content">
          {/* Component Routes chứa các định nghĩa Route */}
          <Routes>
            {/* --- Các Route công khai --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* --- Các Route cần đăng nhập (được bảo vệ) --- */}
            <Route
              path="/nap-tien"
              element={
                <ProtectedRoute>
                  <NapTienPage />
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

            {/* === Bạn có thể thêm các Route khác ở đây === */}
            {/* Ví dụ:
            <Route path="/admin/quan-ly-acc" element={<ProtectedRoute><AdminManageAccountsPage /></ProtectedRoute>} />
            <Route path="/account/:accountId" element={<AccountDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
            */}
                <Route path="/account/:accountId" element={<AccountDetailPage />} />
            {/* ============================================== */}

            {/* Route cho trang không tìm thấy (nên đặt cuối cùng) */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}

          
            {/* ======================================== */}
          </Routes>
        </main>

        {/* Footer hiển thị trên tất cả các trang */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;