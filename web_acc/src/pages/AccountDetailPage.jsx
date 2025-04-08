// src/pages/AccountDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Thêm Link nếu cần quay lại
// import axios from 'axios'; // Tạm thời comment axios vì chưa dùng API thật

// Import CSS nếu bạn tạo file riêng (ví dụ: import './AccountDetailPage.css';)
import './AccountDetailPage.css'; // Giả sử bạn tạo file CSS này

function AccountDetailPage() {
    const { accountId } = useParams(); // Lấy ID từ URL

    // State
    const [accountDetails, setAccountDetails] = useState(null);
    const [loading, setLoading] = useState(true); // Ban đầu là true
    const [error, setError] = useState(null);    // Vẫn giữ state error phòng trường hợp sau này

    // --- Dữ liệu giả (Mock Data) ---
    // Tạo một đối tượng mẫu chứa cấu trúc dữ liệu bạn mong đợi từ API
    // Sử dụng accountId lấy từ URL để dữ liệu trông "thật" hơn
    const getMockAccountDetails = (id) => ({
        MaTaiKhoan: parseInt(id) || 0, // Chuyển id từ URL thành số
        MoTa: `Đây là mô tả RẤT RẤT chi tiết cho tài khoản #${id}. Tài khoản này có nhiều tướng, nhiều trang phục cực hiếm, rank cao thủ thách đấu mùa trước nhưng giờ xuống Đồng V do chủ nick bận đi làm. Thông tin hoàn toàn trắng, chưa liên kết số điện thoại hay email. Mua về đổi mật khẩu là chiến ngay! Bao uy tín, giao dịch nhanh gọn. Acc bao gồm 150 tướng, 300 trang phục, 20 bảng ngọc, 10 trang bị thần thoại...`,
        GiaBan: (parseInt(id) || 1) * 50000 + Math.floor(Math.random() * 50000), // Giá giả ngẫu nhiên
        MaGame: 1, // Giả sử là Liên Minh
        // Thêm các trường khác nếu API dự kiến trả về (KHÔNG phải thông tin nhạy cảm)
        // ViDu:
        // HinhAnh: ['/path/to/img1.jpg', '/path/to/img2.jpg'], // Nếu có ảnh
        // nguoiBan: { TenDangNhap: 'SellerExample' } // Thông tin người bán (công khai)
    });
    // --------------------------------

    // --- Tạm thời không gọi API, chỉ set dữ liệu giả ---
    useEffect(() => {
        setLoading(true);
        setError(null);

        // Giả lập thời gian chờ gọi API (ví dụ: 500ms)
        const timer = setTimeout(() => {
            const mockData = getMockAccountDetails(accountId);
            setAccountDetails(mockData);
            setLoading(false);
        }, 500); // Chờ 0.5 giây rồi hiển thị dữ liệu giả

        // Cleanup timer khi component unmount hoặc accountId thay đổi
        return () => clearTimeout(timer);

        /*
        // ----- PHẦN GỌI API THẬT (SẼ DÙNG SAU KHI BACKEND SẴN SÀNG) -----
        const fetchAccountDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`/api/taikhoan/${accountId}`);
                setAccountDetails(response.data);
            } catch (err) {
                console.error("Lỗi fetch chi tiết tài khoản:", err);
                setError(`Không thể tải thông tin cho tài khoản ID: ${accountId}.`);
            } finally {
                setLoading(false);
            }
        };
        fetchAccountDetails();
        */

    }, [accountId]); // Vẫn giữ dependency là accountId

    // ----- Render nội dung -----
     const renderDetailContent = () => {
        if (loading) {
            return <p className="loading-message">Đang tải thông tin tài khoản...</p>;
        }
        // Vẫn kiểm tra error phòng khi có lỗi khác xảy ra
        if (error) {
            return <p className="error-message">{error}</p>;
        }
        if (!accountDetails) {
            // Trường hợp này ít xảy ra với mock data, nhưng vẫn nên có
            return <p>Không tìm thấy thông tin tài khoản.</p>;
        }

        // --- Hiển thị chi tiết tài khoản từ DỮ LIỆU GIẢ ---
        return (
            // Container cho phần chi tiết (cần style trong CSS)
            <div className="account-details-container">
                {/* Có thể chia cột: một cột cho ảnh (nếu có), một cột cho thông tin */}
                {/* <div className="account-images"> ... ảnh ... </div> */}
                <div className="account-info">
                    <h2>Thông tin chi tiết Tài khoản #{accountDetails.MaTaiKhoan}</h2>

                    <div className="detail-section">
                        <h3>Mô tả:</h3>
                        {/* Hiển thị mô tả đầy đủ */}
                        <p className="full-description">{accountDetails.MoTa}</p>
                    </div>

                    <div className="detail-section price-section">
                        <h3>Giá bán:</h3>
                        <p className="price">
                            {(accountDetails.GiaBan).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </p>
                    </div>

                    {/* === KHÔNG HIỂN THỊ THÔNG TIN NHẠY CẢM === */}

                    {/* Nút Mua hoặc các hành động khác */}
                    <div className="actions">
                       <button className="buy-button">Mua Ngay</button>
                       {/* Có thể thêm nút quay lại trang danh sách */}
                       <Link to="/accounts" className="back-button">Quay lại danh sách</Link>
                    </div>
                </div>
            </div>
        );
    };

    // --- Return component chính ---
    // Thêm class background (account-detail-page-background?) nếu bạn tạo nó trong CSS
    return (
        <div className="account-detail-page account-detail-page-background">
             {/* Class này cần có style trong file CSS tương ứng */}
            <h1>Chi Tiết Tài Khoản</h1>
            {/* <p>(ID lấy từ URL: {accountId})</p> */}
            {renderDetailContent()}
        </div>
    );
}

export default AccountDetailPage;