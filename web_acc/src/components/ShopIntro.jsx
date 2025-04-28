
import React from 'react';
import styles from './ShopIntro.module.css';

function ShopIntro({ onClose }) {
  return (
   
    <div className={styles.introContainer}>
  
       <button
          className={styles.closeButton}
          onClick={onClose} 
          aria-label="Đóng giới thiệu" 
       >
         &times; 
       </button>
      <h1 className={styles.title}>

        Chào mừng đến với <span className={styles.shopName}>Shop AccGameRiot.com!</span>
      </h1>
      <p className={styles.subtitle}>
        Nơi cung cấp tài khoản game uy tín, chất lượng.
      </p>
      <p className={styles.callToAction}>
      
        Khám phá ngay các tài khoản <span className={styles.highlight}>Liên Minh Huyền Thoại</span> đang được bán!
      </p>

    </div>
  );
}

export default ShopIntro;