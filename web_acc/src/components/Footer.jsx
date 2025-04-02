// src/components/Footer/Footer.jsx

import React from 'react';
import './Footer.css'; // Tùy chọn: Import file CSS để định kiểu

function Footer() {
  // Lấy năm hiện tại một cách tự động
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">

        {/* Phần 1: Giới thiệu ngắn hoặc liên kết nhanh (tùy chọn) */}
        <div className="footer-section footer-about">
          <h4>SHOPACCRIOT.COM</h4>
          <p>
            Hệ thống bán acc LMHT . Đảm bảo uy tín và chất lượng.
            Cam kết đem đến sự hài lòng cho khách hàng.
          </p>
          {/* Bạn có thể thêm các liên kết khác ở đây nếu muốn */}
          {/* Ví dụ: <a href="/about">Về chúng tôi</a> | <a href="/terms">Điều khoản</a> */}
        </div>

        {/* Phần 2: Thông tin liên hệ (theo yêu cầu của bạn) */}
        <div className="footer-section footer-contact">
          <h4>Thông Tin Liên Hệ</h4>
          <p>
            Email Hỗ Trợ: {' '} {/* Thêm khoảng trắng nếu cần */}
            <a href="mailto:your-email@example.com">
             truongtsang153@gmail.com
            </a>
            {/* !!! THAY THẾ BẰNG EMAIL THỰC TẾ CỦA BẠN !!! */}
          </p>
          <p>
            Số Điện Thoại:{' '} {/* Thêm khoảng trắng nếu cần */}
            <a href="tel:+84123456789">
             0947979373
            </a>
            {/* !!! THAY THẾ BẰNG SỐ ĐIỆN THOẠI THỰC TẾ CỦA BẠN !!! */}
          </p>
          {/* Bạn có thể thêm liên kết mạng xã hội ở đây nếu muốn */}
          {/* Ví dụ: Facebook, Zalo... */}
        </div>

        {/* Phần 3: Có thể thêm thông tin khác nếu cần */}
        {/*
        <div className="footer-section footer-links">
          <h4>Liên kết hữu ích</h4>
          <ul>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/policy">Chính sách bảo mật</a></li>
          </ul>
        </div>
        */}

      </div>

      {/* Phần dưới cùng: Copyright */}
      <div className="footer-bottom">
        <p>
          Copyright © {currentYear}, SHOPACCRIOT.COM - All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;