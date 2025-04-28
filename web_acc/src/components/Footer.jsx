// src/components/Footer/Footer.jsx

import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-section footer-about">
          <h4>SHOPACCRIOT.COM</h4>
          <p>
            Hệ thống bán acc LMHT . Đảm bảo uy tín và chất lượng.
            Cam kết đem đến sự hài lòng cho khách hàng.
          </p>
        </div>
        <div className="footer-section footer-contact">
          <h4>Thông Tin Liên Hệ</h4>
          <p>
            Email Hỗ Trợ: {' '}
            <a href="mailto:your-email@example.com">
             truongtsang153@gmail.com
            </a>
          </p>
          <p>
            Số Điện Thoại:{' '}
            <a href="tel:+84123456789">
             0947979373
            </a>
          </p>
        </div>
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