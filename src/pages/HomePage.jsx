// src/pages/HomePage.jsx
import React from 'react';
// Bạn có thể import thêm các component khác cần thiết cho trang chủ ở đây
// Ví dụ: import FeaturedAccounts from '../components/FeaturedAccounts';
// import Banner from '../components/Banner';
// import './HomePage.css'; // Import CSS riêng cho trang chủ nếu cần

function HomePage() {
  return (
    <div className="home-page"> {/* Thêm class để style nếu cần */}
      <h1>Chào mừng đến với Shop Acc Game!</h1>
      <p>Nơi cung cấp tài khoản game uy tín, chất lượng.</p>

      {/* --- Khu vực hiển thị nội dung khác của trang chủ --- */}

      {/* Ví dụ: Hiển thị banner quảng cáo */}
      {/* <Banner /> */}

      {/* Ví dụ: Hiển thị các tài khoản nổi bật */}
      {/* <FeaturedAccounts /> */}

      <p>
        Khám phá ngay các tài khoản Liên Minh Huyền Thoại đang được bán!
      </p>
      {/* Bạn có thể thêm Link để dẫn đến trang /accounts */}
      {/* import { Link } from 'react-router-dom'; */}
      {/* <Link to="/accounts">Xem danh sách tài khoản</Link> */}

      {/* ---------------------------------------------------- */}
    </div>
  );
}

export default HomePage;