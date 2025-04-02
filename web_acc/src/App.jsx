// src/App.jsx
import React from 'react';
// Import các thành phần của React Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Import các component dùng chung và các component của từng trang
import Header from './components/Header';
import HomePage from './pages/HomePage';       // Trang chủ
import LoginPage from './pages/LoginPage';       // Trang đăng nhập
import AccountsPage from './pages/AccountsPage'; // Trang danh sách tài khoản
import RegisterPage from './pages/RegisterPage'; // Trang đăng ký
import Footer from './components/Footer';
import NapTienPage from './pages/NapTienPage'; // <<< Import component trang nạp tiền
// Import CSS cho App
import './App.css';

function App() {
  return (
    // Bọc toàn bộ ứng dụng trong Router để kích hoạt routing
    <Router>
      <div className="App">
      <ToastContainer
          position="top-right" // Vị trí hiển thị (top-left, top-center, bottom-right, etc.)
          autoClose={3000}    // Tự động đóng sau 3000ms (3 giây)
          hideProgressBar={false} // Hiện thanh thời gian chạy
          newestOnTop={false}   // Thông báo mới có đè lên thông báo cũ không
          closeOnClick          // Đóng khi click vào thông báo
          rtl={false}           // Hỗ trợ giao diện từ phải sang trái
          pauseOnFocusLoss    // Tạm dừng khi cửa sổ không được focus
          draggable           // Có thể kéo thông báo
          pauseOnHover        // Tạm dừng khi di chuột qua
          theme="light"         // Giao diện "light", "dark", hoặc "colored"
        />
        {/* ======================================== */}

        {/* Header hiển thị trên tất cả các trang */}
        <Header />

        {/* Khu vực nội dung chính, nơi các component trang sẽ được render */}
        <main className="main-content">
          {/* Component Routes chứa các định nghĩa Route */}
          <Routes>
            {/* Route cho trang chủ */}
            <Route path="/" element={<HomePage />} />

            {/* Route cho trang đăng nhập */}
            <Route path="/login" element={<LoginPage />} />

            {/* Route cho trang danh sách tài khoản */}
            <Route path="/accounts" element={<AccountsPage />} />

            {/* Route cho trang đăng ký */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/nap-tien" element={
                // <ProtectedRoute> {/* <<< Bọc trong ProtectedRoute */}
                  <NapTienPage />
                // </ProtectedRoute>
              }
            />

            {/* === Bạn có thể thêm các Route khác ở đây === */}
            {/* Ví dụ:
            <Route path="/admin/quan-ly-acc" element={<AdminManageAccountsPage />} />
            <Route path="/account/:accountId" element={<AccountDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
            */}
            {/* ======================================== */}
          </Routes>
        </main>

        {/* Bạn có thể thêm component Footer ở đây nếu muốn */}
        <Footer /> 
      </div>
    </Router>
  );
}

export default App;