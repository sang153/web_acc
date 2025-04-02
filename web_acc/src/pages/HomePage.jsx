// src/pages/HomePage.jsx
import React, { useState } from 'react';

// Import Components
import ShopIntro from '../components/ShopIntro';
import AccountCategoryCard from '../components/AccountCategoryCard';

// Import CSS Module for HomePage specific styles (like the category grid)
import styles from './HomePage.module.css';

// --- Dữ liệu giả cho các danh mục tài khoản ---
// QUAN TRỌNG: Hãy thay thế '/path/to/your/...' bằng đường dẫn thật đến ảnh của bạn trong thư mục /public
const accountCategories = [
  {
    imageUrl: '/te.jpg', // <<< THAY THẾ PATH ẢNH
    mainTitle: 'SIÊU RẺ',
    subTitle: 'ACC LIÊN MINH SIÊU RẺ',
    accountCount: 26,
    linkUrl: '/accounts/sieu-re' // Link đến trang danh sách acc siêu rẻ
  },
  {
    imageUrl: '/te.jpg', // <<< THAY THẾ PATH ẢNH
    mainTitle: 'SIÊU VIP',
    subTitle: 'ACC LIÊN MINH SIÊU VIP',
    accountCount: 45,
    linkUrl: '/accounts/sieu-vip' // Link đến trang danh sách acc siêu vip
  },
  {
    imageUrl: '/te.jpg', // <<< THAY THẾ PATH ẢNH
    mainTitle: 'LV 30 - Full Tướng',
    subTitle: 'LEVEL 30 FULL TƯỚNG',
    accountCount: 32,
    linkUrl: '/accounts/lv30-full-tuong' // Link đến trang danh sách acc lv30
  },
  {
    imageUrl: '/te.jpg', // <<< THAY THẾ PATH ẢNH
    mainTitle: 'Zin Thông Thạo',
    subTitle: 'FULL TƯỚNG ZIN THÔNG THẠO',
    accountCount: 58,
    linkUrl: '/accounts/zin-thong-thao' // Link đến trang danh sách acc thông thạo
  }
  // Bạn có thể thêm các danh mục khác vào đây
];
// ---------------------------------------------


function HomePage() {
  // State để quản lý việc hiển thị/ẩn component giới thiệu (ShopIntro)
  const [showIntro, setShowIntro] = useState(true); // Ban đầu hiển thị

  // Hàm được gọi khi nhấn nút X trên ShopIntro
  const handleCloseIntro = () => {
    setShowIntro(false); // Ẩn component giới thiệu
  };

  return (
    // div chính của trang chủ, áp dụng ảnh nền từ App.css
    <div className="home-page home-page-background">

      {/* Component giới thiệu: Chỉ hiển thị khi showIntro là true */}
      {/* Truyền hàm handleCloseIntro xuống để xử lý sự kiện đóng */}
      {showIntro && <ShopIntro onClose={handleCloseIntro} />}

      {/* === Khu vực hiển thị các thẻ danh mục tài khoản === */}
      <div className={styles.categorySection}>
        {/* Tiêu đề cho khu vực danh mục */}
        <h2 className={styles.sectionTitle}>ACC LIÊN MINH HUYỀN THOẠI</h2>

        {/* Grid chứa các thẻ danh mục */}
        <div className={styles.categoryGrid}>
          {/* Lặp qua mảng dữ liệu 'accountCategories' */}
          {/* Với mỗi 'category' trong mảng, render một component AccountCategoryCard */}
          {accountCategories.map((category, index) => (
            <AccountCategoryCard
              key={index} // key là bắt buộc khi dùng map để render list
              cardData={category} // Truyền dữ liệu của category vào component card
            />
          ))}
        </div>
      </div>
      {/* ================================================== */}

       {/* Bạn có thể thêm các section/component khác cho trang chủ ở đây */}

    </div>
  );
}

export default HomePage;