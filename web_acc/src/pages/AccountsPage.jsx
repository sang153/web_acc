import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AccountsPage.css';

function AccountsPage() {
    // --- State ---
    const [accounts, setAccounts] = useState([]);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [priceRange, setPriceRange] = useState([0, 10000000]); // [min, max]
    const [inputValues, setInputValues] = useState({
        min: 0,
        max: 10000000
    });

    // --- Gọi API để lấy danh sách tài khoản ---
    useEffect(() => {
        const fetchAccounts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/taikhoan');
                // Lọc ra chỉ những tài khoản đang bán (TrangThai = 0)
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

    // --- Lọc tài khoản theo khoảng giá ---
    useEffect(() => {
        if (accounts.length > 0) {
            const filtered = accounts.filter(account => {
                const price = account.GiaBan || 0;
                return price >= priceRange[0] && price <= priceRange[1];
            });
            setFilteredAccounts(filtered);
        }
    }, [priceRange, accounts]);

    // --- Xử lý thay đổi giá trị input ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputValues(prev => ({
            ...prev,
            [name]: parseInt(value) || 0
        }));
    };

    // --- Áp dụng bộ lọc ---
    const applyFilter = () => {
        setPriceRange([inputValues.min, inputValues.max]);
    };

    // --- Reset bộ lọc ---
    const resetFilter = () => {
        setInputValues({ min: 0, max: 10000000 });
        setPriceRange([0, 10000000]);
    };

    // --- Hàm render nội dung ---
    const renderContent = () => {
        if (loading) {
            return <p className="loading-message">Đang tải danh sách tài khoản...</p>;
        }

        if (error) {
            return <p className="error-message">{error}</p>;
        }

        if (filteredAccounts.length === 0) {
            return <p className="no-accounts-message">Không có tài khoản nào phù hợp với bộ lọc hiện tại.</p>;
        }

        return (
            <div className="accounts-list">
                {filteredAccounts.map((account) => (
                    <div className="account-card" key={account.MaTaiKhoan}>
                        <div className="account-title">
                            <strong>Tài khoản:</strong> {account.TenTaiKhoan || 'Không có tên'}
                        </div>
                        
                        {account.MaGame && (
                            <div className="game-info">
                                <strong>Game ID:</strong> {account.MaGame}
                            </div>
                        )}
                        
                        <div className="account-price">
                            Giá: {(account.GiaBan || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </div>
                        
                        <Link
                            to={`/account/${account.MaTaiKhoan}`}
                            className="details-button"
                        >
                            Xem Chi Tiết
                        </Link>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="accounts-page accounts-page-background">
            <h1>Danh sách tài khoản đang bán</h1>
            
            <div className="accounts-container">
                {/* Thanh lọc bên trái */}
                <div className="filter-sidebar">
                    <h3>Lọc theo giá</h3>
                    
                    <div className="price-filter">
                        <div className="price-input-group">
                            <label>Giá thấp nhất (VND)</label>
                            <input
                                type="number"
                                name="min"
                                value={inputValues.min}
                                onChange={handleInputChange}
                                min="0"
                            />
                        </div>
                        
                        <div className="price-input-group">
                            <label>Giá cao nhất (VND)</label>
                            <input
                                type="number"
                                name="max"
                                value={inputValues.max}
                                onChange={handleInputChange}
                                min="0"
                            />
                        </div>
                        
                        <div className="filter-buttons">
                            <button onClick={applyFilter} className="apply-filter-btn">
                                Áp dụng
                            </button>
                            <button onClick={resetFilter} className="reset-filter-btn">
                                Đặt lại
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Danh sách sản phẩm bên phải */}
                <div className="accounts-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default AccountsPage;