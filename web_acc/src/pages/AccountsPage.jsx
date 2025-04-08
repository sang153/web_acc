// src/pages/AccountsPage.jsx
import React, { useState, useEffect } from 'react'; // Thêm useState, useEffect
import axios from 'axios';                         // Thêm axios
import { Link } from 'react-router-dom';             // Thêm Link
import './AccountsPage.css';                      // Import CSS riêng cho trang này

function AccountsPage() {
    // --- State ---
    const [accounts, setAccounts] = useState([]);    // Lưu danh sách tài khoản
    const [loading, setLoading] = useState(true);    // Trạng thái loading
    const [error, setError] = useState(null);        // Lưu lỗi

    // --- Gọi API để lấy danh sách tài khoản ---
    useEffect(() => {
        const fetchAccounts = async () => {
            setLoading(true);
            setError(null);
            try {
                // !!! QUAN TRỌNG: Thay '/api/taikhoan' bằng API endpoint đúng từ Laravel !!!
                // API này phải trả về mảng các tài khoản hợp lệ (đã duyệt, công khai)
                const response = await axios.get('/api/taikhoan');

                // Giả sử API trả về mảng trong response.data
                // Nếu là { data: [...] } thì dùng response.data.data
                setAccounts(response.data || []); // Đảm bảo accounts luôn là mảng

            } catch (err) {
                console.error("Lỗi khi fetch tài khoản:", err);
                setError('Không thể tải danh sách tài khoản. Vui lòng thử lại sau.');
            } finally {
                setLoading(false); // Kết thúc loading
            }
        };

        fetchAccounts(); // Chạy hàm fetch khi component mount
    }, []); // [] đảm bảo chỉ chạy 1 lần

    // --- Hàm render nội dung ---
    const renderContent = () => {
        // 1. Đang loading
        if (loading) {
            return <p style={{ textAlign: 'center', padding: '50px' }}>Đang tải danh sách tài khoản...</p>;
        }

        // 2. Có lỗi
        if (error) {
            // Class error-message này có thể định nghĩa trong AccountsPage.css
            return <p className="error-message" style={{ textAlign: 'center', padding: '50px' }}>{error}</p>;
        }

        // 3. Thành công nhưng không có tài khoản
        if (accounts.length === 0) {
            return <p style={{ textAlign: 'center' }}>Hiện tại không có tài khoản nào đang bán.</p>;
        }

        // 4. Thành công và có tài khoản -> Hiển thị danh sách
        return (
            // Container lưới (class này cần được style trong AccountsPage.css)
            <div className="accounts-list">
                {accounts.map((account) => (
                    // Thẻ tài khoản (class này cần được style trong AccountsPage.css)
                    <div className="account-card" key={account.MaTaiKhoan}>
                        {/* Phần mô tả */}
                        <div className="account-description">
                           <strong>Mô tả:</strong> {account.MoTa || 'Không có mô tả'}
                        </div>
                        {/* Phần giá tiền */}
                        <div className="account-price">
                            Giá: {(account.GiaBan || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </div>
                        {/* Nút xem chi tiết */}
                        <Link
                            to={`/account/${account.MaTaiKhoan}`} // Đường dẫn đến trang chi tiết
                            className="details-button"          // Class để style nút
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
        // Div chính với class background
        <div className="accounts-page accounts-page-background">
            <h1>Danh sách tài khoản đang bán</h1>
            {/* Render nội dung dựa trên state */}
            {renderContent()}
        </div>
    );
}

export default AccountsPage;