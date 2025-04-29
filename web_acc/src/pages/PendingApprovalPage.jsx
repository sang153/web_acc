// src/pages/PendingApprovalPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PendingApprovalPage.css';

function PendingApprovalPage() {
    const [pendingAccounts, setPendingAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchPendingAccounts();
    }, []);

    const fetchPendingAccounts = async () => {
        try {
            // Lấy từ localStorage (tạm thời)
            const saved = localStorage.getItem('pendingAccounts');
            if (saved) {
                setPendingAccounts(JSON.parse(saved));
            }
            
            // Nếu có kết nối backend, bạn có thể gọi API ở đây
            // const response = await axios.get('/api/accounts/pending');
            // setPendingAccounts(response.data);
            
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi tải tài khoản chờ duyệt:", error);
            setLoading(false);
        }
    };

    const handleApprove = async (accountId) => {
        try {
            setLoading(true);
            
            // 1. Tìm account trong danh sách pending
            const accountToApprove = pendingAccounts.find(acc => 
                acc.TenTaiKhoan === accountId
            );
            
            if (!accountToApprove) return;
            
            // 2. Chuẩn bị dữ liệu để gửi lên server
            const accountData = {
                TenTaiKhoan: accountToApprove.TenTaiKhoan,
                MatKhauTaiKhoan: accountToApprove.MatKhauTaiKhoan || '', // Thêm mật khẩu nếu có
                MoTa: accountToApprove.MoTa || '',
                GiaBan: accountToApprove.GiaBan || 0,
                TrangThai: 1, // 1 = Đã duyệt
                MaGame: accountToApprove.MaGame || 1 // Mặc định game Liên Minh Huyền Thoại
            };
    
            // 3. Gửi request POST để thêm vào database
            const response = await axios.post('http://127.0.0.1:8000/api/taikhoan', accountData);
            
            // 4. Cập nhật localStorage (xóa account đã duyệt)
            const updatedAccounts = pendingAccounts.filter(
                acc => acc.TenTaiKhoan !== accountId
            );
            localStorage.setItem('pendingAccounts', JSON.stringify(updatedAccounts));
            setPendingAccounts(updatedAccounts);
            
            setMessage({
                text: `Đã duyệt và thêm tài khoản ${accountToApprove.TenTaiKhoan} vào hệ thống!`,
                type: 'success'
            });
            
        } catch (error) {
            console.error("Lỗi khi duyệt tài khoản:", error);
            setMessage({
                text: error.response?.data?.message || 'Có lỗi xảy ra khi duyệt tài khoản',
                type: 'error'
            });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        }
    };

    const handleReject = (accountId) => {
        try {
            // 1. Xóa khỏi danh sách pending
            const updatedAccounts = pendingAccounts.filter(
                acc => acc.TenTaiKhoan !== accountId
            );
            
            // 2. Cập nhật localStorage
            localStorage.setItem('pendingAccounts', JSON.stringify(updatedAccounts));
            setPendingAccounts(updatedAccounts);
            
            setMessage({
                text: `Đã từ chối tài khoản ${accountId}`,
                type: 'info'
            });
            
        } catch (error) {
            console.error("Lỗi khi từ chối tài khoản:", error);
            setMessage({
                text: 'Có lỗi xảy ra khi từ chối tài khoản',
                type: 'error'
            });
        } finally {
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        }
    };

    const handleBack = () => {
        navigate('/admin/dashboard');
    };

    if (loading) {
        return <div className="loading">Đang tải danh sách tài khoản...</div>;
    }

    return (
        <div className="pending-approval-page">
            <h1>Tài khoản đang chờ duyệt</h1>
            
            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}
            
            {pendingAccounts.length === 0 ? (
                <p className="no-accounts">Bạn chưa có tài khoản nào chờ duyệt.</p>
            ) : (
                <div className="pending-list">
                    {pendingAccounts.map((account, index) => (
                        <div key={index} className="pending-item">
                            <h3>Tài khoản: {account.TenTaiKhoan}</h3>
                            <p><strong>Mật khẩu:</strong> {account.MatKhauTaiKhoan}</p>
                            <p><strong>Game:</strong> Liên Minh Huyền Thoại</p>
                            <p><strong>Giá bán:</strong> {account.GiaBan.toLocaleString()} VNĐ</p>
                            <p><strong>Mô tả:</strong> {account.MoTa}</p>
                            <p><strong>Ngày tạo:</strong> {new Date(account.NgayTao).toLocaleString()}</p>
                            
                            <div className="action-buttons">
                                <button 
                                    onClick={() => handleApprove(account.TenTaiKhoan)}
                                    className="approve-btn"
                                    disabled={loading}
                                >
                                    Chấp nhận
                                </button>
                                <button 
                                    onClick={() => handleReject(account.TenTaiKhoan)}
                                    className="reject-btn"
                                    disabled={loading}
                                >
                                    Từ chối
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <button onClick={handleBack} className="back-button">
                Quay lại trang Dashboard
            </button>
        </div>
    );
}

export default PendingApprovalPage; 