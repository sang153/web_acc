// src/App.jsx
import React from 'react';
// Import các thành phần của React Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import các component dùng chung và các component của từng trang
import Header from './components/Header';
import HomePage from './pages/HomePage';       // Trang chủ
import LoginPage from './pages/LoginPage';       // Trang đăng nhập
import AccountsPage from './pages/AccountsPage'; // Trang danh sách tài khoản
import RegisterPage from './pages/RegisterPage'; // Trang đăng ký

// Import CSS cho App
import './App.css';

function App() {
  return (
    // Bọc toàn bộ ứng dụng trong Router để kích hoạt routing
    <Router>
      <div className="App">
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
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;