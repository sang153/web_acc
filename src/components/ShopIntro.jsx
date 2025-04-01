// src/components/ShopIntro.jsx
import React from 'react';
// Import CSS Module riêng cho component này (sẽ tạo ở Bước 2)
import styles from './ShopIntro.module.css';

function ShopIntro({ onClose }) {
  return (
    // Container chính cho phần giới thiệu
    // Class 'introContainer' sẽ lấy style từ file CSS Module
    <div className={styles.introContainer}>
    {/* <<< 2. Thêm nút đóng (X) */}
       <button
          className={styles.closeButton}
          onClick={onClose} // <<< 3. Gọi hàm onClose khi nút được click
          aria-label="Đóng giới thiệu" // Thêm aria-label cho accessibility
       >
         &times; {/* Ký tự 'X' (multiplication sign) */}
       </button>
      <h1 className={styles.title}>
        {/* Phần tên shop được bọc trong span để style riêng nếu muốn */}
        Chào mừng đến với <span className={styles.shopName}>Shop Acc Game.com!</span>
      </h1>
      <p className={styles.subtitle}>
        Nơi cung cấp tài khoản game uy tín, chất lượng.
      </p>
      <p className={styles.callToAction}>
        {/* Phần tên game được bọc trong span để làm nổi bật */}
        Khám phá ngay các tài khoản <span className={styles.highlight}>Liên Minh Huyền Thoại</span> đang được bán!
      </p>
      {/* Bạn có thể thêm nút bấm ở đây nếu muốn */}
      {/* <button className={styles.ctaButton}>Khám Phá Ngay</button> */}
    </div>
  );
}

export default ShopIntro;