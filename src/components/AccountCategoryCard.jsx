// src/components/AccountCategoryCard.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Dùng Link nếu nút dẫn đến trang khác trong app
import styles from './AccountCategoryCard.module.css';

// Component nhận props là dữ liệu của một card
function AccountCategoryCard({ cardData }) {
  // Destructuring props để dễ sử dụng
  const {
    imageUrl,
    topText = "SHOPACCRIOT.COM", // Giá trị mặc định nếu không có
    mainTitle,
    subTitle,
    accountCount,
    linkUrl = "/accounts" // Link mặc định nếu không có
  } = cardData;

  // Tạo style inline cho background image
  const cardStyle = {
    backgroundImage: `url(${imageUrl})`
  };

  return (
    <div className={styles.card} style={cardStyle}>
      {/* Lớp phủ tối màu */}
      <div className={styles.overlay}></div>

      {/* Nội dung text nằm trên lớp phủ */}
      <div className={styles.content}>
        <div className={styles.topText}>{topText}</div>
        <div className={styles.mainTitle}>{mainTitle}</div>
        <div className={styles.subTitle}>{subTitle}</div>
        <div className={styles.accountCount}>Số tài khoản : {accountCount}</div>
        <Link to={linkUrl} className={styles.button}>
          XEM TẤT CẢ
        </Link>
      </div>
    </div>
  );
}

export default AccountCategoryCard;