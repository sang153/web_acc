import React from 'react';
import { Link } from 'react-router-dom'; 
import styles from './AccountCategoryCard.module.css';

function AccountCategoryCard({ cardData }) {
  const {
    imageUrl,
    topText = "SHOPACCRIOT.COM", 
    mainTitle,
    subTitle,
    accountCount,
    linkUrl = "/accounts"
  } = cardData;
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