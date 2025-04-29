/* src/pages/HomePage.jsx */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import ShopIntro from '../components/ShopIntro';

function HomePage() {
    const [accounts, setAccounts] = useState([]);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showIntro, setShowIntro] = useState(true);

    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const [inputValues, setInputValues] = useState({
        min: 0,
        max: 10000000
    });

    const handleCloseIntro = () => {
        setShowIntro(false);
    };

    useEffect(() => {
        const fetchAccounts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('/api/taikhoan');
                const availableAccounts = response.data.filter(account => account.TrangThai === 0);
                setAccounts(availableAccounts || []);
                setFilteredAccounts(availableAccounts || []);
            } catch (err) {
                console.error("Lỗi khi fetch tài khoản:", err);
                setError('Không thể tải danh sách tài khoản. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };
        fetchAccounts();
    }, []);

    useEffect(() => {
        const filtered = accounts.filter(account => {
            const price = account.GiaBan || 0;
            const maxPrice = !priceRange[1] || isNaN(priceRange[1]) || priceRange[1] === 0 ? Infinity : priceRange[1];
            const minPrice = !priceRange[0] || isNaN(priceRange[0]) ? 0 : priceRange[0];
            return price >= minPrice && price <= maxPrice;
        });
        setFilteredAccounts(filtered);
    }, [priceRange, accounts]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const numericValue = parseInt(value, 10);
        setInputValues(prev => ({
            ...prev,
            [name]: isNaN(numericValue) || numericValue < 0 ? 0 : numericValue
        }));
    };

    const applyFilter = () => {
        let min = inputValues.min;
        let max = inputValues.max;

        if (max !== 0 && min > max) {
           max = min;
           setInputValues(prev => ({ ...prev, max: min }));
        }
        setPriceRange([min, max]);
    };

    const resetFilter = () => {
        const defaultMin = 0;
        const defaultMax = 10000000;
        setInputValues({ min: defaultMin, max: defaultMax });
        setPriceRange([defaultMin, defaultMax]);
    };

    const renderAccountsList = () => {
        if (loading) {
            return <p className={styles.loadingMessage}>Đang tải danh sách tài khoản...</p>;
        }
        if (error) {
            return <p className={styles.errorMessage}>{error}</p>;
        }
        if (filteredAccounts.length === 0) {
            return <p className={styles.noAccountsMessage}>Không có tài khoản nào phù hợp với bộ lọc hiện tại.</p>;
        }

        return (
            <div className={styles.accountsGrid}>
                {filteredAccounts.map((account) => (
                    <div className={styles.accountCard} key={account.MaTaiKhoan}>
                        <div className={styles.accountDescription}>
                            <strong>Mô tả:</strong> {account.MoTa || 'Chưa có mô tả'}
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
                ))}
            </div>
        );
    };

    return (
        <div className={`${styles.homePage} ${styles.homePageBackground}`}>
            {showIntro && ShopIntro && <ShopIntro onClose={handleCloseIntro} />}
            <div className={styles.mainContainer}>
                <div className={styles.accountsContent}>
                    <h2 className={styles.sectionTitle}>DANH SÁCH TÀI KHOẢN</h2>
                    {renderAccountsList()}
                </div>
                <div className={styles.filterSidebar}>
                    <h3>Lọc theo giá</h3>
                    <div className={styles.priceFilter}>
                        <div className={styles.priceInputGroup}>
                            <label htmlFor="min-price">Giá thấp nhất (VND)</label>
                            <input
                                id="min-price"
                                type="number"
                                name="min"
                                value={inputValues.min}
                                onChange={handleInputChange}
                                min="0"
                                className={styles.priceInput}
                                placeholder="VD: 0"
                            />
                        </div>
                        <div className={styles.priceInputGroup}>
                            <label htmlFor="max-price">Giá cao nhất (VND)</label>
                             <input
                                id="max-price"
                                type="number"
                                name="max"
                                value={inputValues.max}
                                onChange={handleInputChange}
                                min="0"
                                className={styles.priceInput}
                                placeholder="VD: 500000"
                             />
                        </div>
                        <div className={styles.filterButtons}>
                            <button onClick={applyFilter} className={styles.applyFilterBtn}>
                                Áp dụng
                            </button>
                            <button onClick={resetFilter} className={styles.resetFilterBtn}>
                                Đặt lại
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;