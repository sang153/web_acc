// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react'; // Thêm useEffect
import axios from 'axios';                         // Thêm axios
import { Link } from 'react-router-dom';             // Thêm Link

// Import Components
import ShopIntro from '../components/ShopIntro';
// import AccountCategoryCard from '../components/AccountCategoryCard'; // <<< XÓA import này

// Import CSS Module for HomePage specific styles
import styles from './HomePage.module.css'; // Bạn có thể đổi tên class trong file này nếu muốn

// --- Dữ liệu giả đã được XÓA ---

function HomePage() {
    // State để quản lý việc hiển thị/ẩn component giới thiệu (ShopIntro)
    const [showIntro, setShowIntro] = useState(true);

    // --- State mới để lưu tài khoản nổi bật ---
    const [featuredAccounts, setFeaturedAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // ------------------------------------------

    // Hàm được gọi khi nhấn nút X trên ShopIntro
    const handleCloseIntro = () => {
        setShowIntro(false);
    };

    // --- Gọi API lấy tài khoản nổi bật ---
    useEffect(() => {
        const fetchFeaturedAccounts = async () => {
            setLoading(true);
            setError(null);
            try {
                // !!! QUAN TRỌNG: Backend cần tạo API endpoint này !!!
                // Ví dụ: Lấy 4 tài khoản nổi bật
                const response = await axios.get('/api/taikhoan/featured?limit=4');

                // Giả sử API trả về mảng trong response.data
                // Hoặc response.data.data nếu có phân trang/resource
                setFeaturedAccounts(response.data || []);

            } catch (err) {
                console.error("Lỗi khi fetch tài khoản nổi bật:", err);
                setError('Không thể tải tài khoản nổi bật.');
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedAccounts();
    }, []); // Chỉ chạy 1 lần

    // --- Hàm render phần tài khoản nổi bật ---
    const renderFeaturedAccounts = () => {
        if (loading) {
            return <p style={{ textAlign: 'center', marginTop: '20px' }}>Đang tải tài khoản nổi bật...</p>;
        }
        if (error) {
            // Có thể style class này trong HomePage.module.css hoặc CSS chung
            return <p className="error-message" style={{ textAlign: 'center', marginTop: '20px' }}>{error}</p>;
        }
        if (featuredAccounts.length === 0) {
            return <p style={{ textAlign: 'center', marginTop: '20px' }}>Không có tài khoản nổi bật nào.</p>;
        }

        return (
             // Sử dụng class từ CSS module (có thể đổi tên thành featuredGrid)
            <div className={styles.categoryGrid}>
                {featuredAccounts.map((account) => (
                     // Cấu trúc thẻ tương tự như trên AccountsPage
                     // Class "account-card" này có thể lấy style từ App.css hoặc AccountsPage.css
                     // Hoặc bạn định nghĩa style riêng trong HomePage.module.css
                    <div className={styles.featuredAccountCard} key={account.MaTaiKhoan}>
                        <div className={styles.accountDescription}>
                            <strong>Mô tả:</strong> {account.MoTa || 'Không có mô tả'}
                        </div>
                        <div className={styles.accountPrice}>
                            Giá: {(account.GiaBan || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </div>
                        <Link
                            to={`/account/${account.MaTaiKhoan}`}
                            className={styles.detailsButton} // Sử dụng class từ CSS module
                        >
                            Xem Chi Tiết
                        </Link>
                    </div>
                ))}
            </div>
        );
    };

    // --- Render component chính ---
    return (
        <div className="home-page home-page-background">
            {showIntro && <ShopIntro onClose={handleCloseIntro} />}

             {/* Sử dụng class từ CSS module (có thể đổi tên thành featuredSection) */}
            <div className={styles.categorySection}>
                <h2 className={styles.sectionTitle}>TÀI KHOẢN NỔI BẬT</h2> {/* Đổi tiêu đề */}
                {renderFeaturedAccounts()} {/* Gọi hàm render mới */}
            </div>

            {/* Các section khác nếu có */}
        </div>
    );
}

export default HomePage;