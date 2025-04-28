import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import ShopIntro from '../components/ShopIntro';

function HomePage() {
    const [showIntro, setShowIntro] = useState(true);
    const [featuredAccounts, setFeaturedAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleCloseIntro = () => {
        setShowIntro(false);
    };

    useEffect(() => {
        const fetchFeaturedAccounts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('/api/taikhoan', {
                    params: {
                      
                      limit: 4
                    }
                });

                // Thêm bộ lọc chỉ hiển thị tài khoản chưa bán (TrangThai = 0)
                const availableAccounts = response.data.filter(account => account.TrangThai === 0);
                setFeaturedAccounts(availableAccounts || []);

                const shuffled = [...availableAccounts].sort(() => 0.5 - Math.random());
                setFeaturedAccounts(shuffled.slice(0, 4));

            } catch (err) {
                console.error("Lỗi khi fetch tài khoản nổi bật:", err);
                setError('Không thể tải tài khoản nổi bật.');
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedAccounts();
    }, []);

    const renderFeaturedAccounts = () => {
        if (loading) {
            return <p style={{ textAlign: 'center', marginTop: '20px' }}>Đang tải tài khoản nổi bật...</p>;
        }
        if (error) {
            return <p className="error-message" style={{ textAlign: 'center', marginTop: '20px' }}>{error}</p>;
        }
        if (featuredAccounts.length === 0) {
            return <p style={{ textAlign: 'center', marginTop: '20px' }}>Không có tài khoản nổi bật nào.</p>;
        }

        return (
            <div className={styles.categoryGrid}>
                {featuredAccounts
                    // Thêm điều kiện kiểm tra trạng thái trước khi hiển thị
                    .filter(account => account.TrangThai === 0)
                    .map((account) => (
                        <div className={styles.featuredAccountCard} key={account.MaTaiKhoan}>
                            <div className={styles.accountDescription}>
                                <strong>Mô tả:</strong> {account.MoTa || 'Không có mô tả'}
                            </div>
                            <div className={styles.accountPrice}>
                                Giá: {(account.GiaBan || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </div>
                            <Link
                                to={`/account/${account.MaTaiKhoan}`}
                                className={styles.detailsButton}
                            >
                                Xem Chi Tiết
                            </Link>
                        </div>
                    ))
                }
            </div>
        );
    };

    return (
        <div className="home-page home-page-background">
            {showIntro && <ShopIntro onClose={handleCloseIntro} />}

            <div className={styles.categorySection}>
                <h2 className={styles.sectionTitle}>TÀI KHOẢN NỔI BẬT</h2>
                {renderFeaturedAccounts()}
            </div>
        </div>
    );
}

export default HomePage;