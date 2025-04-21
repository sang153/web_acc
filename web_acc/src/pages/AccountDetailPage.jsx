import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './AccountDetailPage.css';

function AccountDetailPage() {
    const { accountId } = useParams();
    const [accountDetails, setAccountDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAccountDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8001/api/taikhoan/${accountId}`);
                
                // Kiểm tra dữ liệu trả về
                if (!response.data) throw new Error('Dữ liệu trống');
                
                setAccountDetails({
                    ...response.data,
                    MoTa: response.data.MoTa || 'Không có mô tả chi tiết',
                    GiaBan: response.data.GiaBan || 0
                });
                
            } catch (err) {
                console.error("Lỗi khi tải chi tiết:", err);
                setError(`Không tải được tài khoản #${accountId}`);
            } finally {
                setLoading(false);
            }
        };

        fetchAccountDetails();
    }, [accountId]);

    const renderDetailContent = () => {
        if (loading) {
            return <p className="loading-message">Đang tải thông tin tài khoản...</p>;
        }

        if (error) {
            return <p className="error-message">{error}</p>;
        }

        if (!accountDetails) {
            return <p className="no-data-message">Không tìm thấy thông tin</p>;
        }

        return (
            <div className="account-details-container">
                {/* Phần thông tin game */}
                <div className="game-info-section">
                    <h3>
                        <span className="game-icon">🎮</span> 
                        {accountDetails.MaGame === 1 ? 'Liên Minh Huyền Thoại' : 'Game #' + accountDetails.MaGame}
                    </h3>
                </div>

                {/* Phần thông tin chính */}
                <div className="main-info">
                    <h2>Tài khoản #{accountDetails.MaTaiKhoan}</h2>
                    
                    <div className="detail-section">
                        <h3 className="section-title">Thông tin chi tiết</h3>
                        <p className="full-description">{accountDetails.MoTa}</p>
                    </div>

                    <div className="price-section">
                        <h3 className="section-title inline-title">Giá bán: 
                            <span className="price-value">
                                {accountDetails.GiaBan.toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                })}
                            </span>
                        </h3>
                    </div>
                </div>

                {/* Phần hành động */}
                <div className="action-buttons">
                    <button className="buy-button">
                        🛒 Mua Ngay
                    </button>
                    <Link to="/accounts" className="back-link">
                        ↩ Quay lại danh sách
                    </Link>
                </div>
            </div>
        );
    };

    return (
        <div className="account-detail-page">
            <h1>
                <span className="title-icon">🔍</span> 
                Chi Tiết Tài Khoản
            </h1>
            {renderDetailContent()}
        </div>
    );
}

export default AccountDetailPage;