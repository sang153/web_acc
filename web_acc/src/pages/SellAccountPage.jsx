import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SellAccountPage.css';

function SellAccountPage() {
    // --- State cho Form ---
    const [gameId, setGameId] = useState(1); 
    const [tenTaiKhoan, setTenTaiKhoan] = useState('');
    const [matKhauTaiKhoan, setMatKhauTaiKhoan] = useState('');
    const [moTa, setMoTa] = useState('');
    const [giaBan, setGiaBan] = useState('');

    // --- State cho trạng thái và thông báo ---
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    // --- State và hàm cho bộ tạm chờ duyệt ---
    const [pendingAccounts, setPendingAccounts] = useState(() => {
        const saved = localStorage.getItem('pendingAccounts');
        return saved ? JSON.parse(saved) : [];
    });

    // Hàm lưu account vào bộ tạm
    const saveToPending = (accountData) => {
        const newPendingAccounts = [...pendingAccounts, accountData];
        setPendingAccounts(newPendingAccounts);
        localStorage.setItem('pendingAccounts', JSON.stringify(newPendingAccounts));
        return newPendingAccounts;
    };

    // --- Hàm xử lý khi gửi Form ---
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage('');

        // --- Kiểm tra dữ liệu nhập (cơ bản) ---
        if (!tenTaiKhoan || !matKhauTaiKhoan || !moTa || !giaBan || parseFloat(giaBan) <= 0) {
            setError('Vui lòng điền đầy đủ thông tin và giá bán hợp lệ.');
            setLoading(false);
            return;
        }

        const accountData = {
            MaGame: gameId,
            TenTaiKhoan: tenTaiKhoan,
            MatKhauTaiKhoan: matKhauTaiKhoan,
            MoTa: moTa,
            GiaBan: parseFloat(giaBan),
            TrangThai: "Chờ duyệt",
            NgayTao: new Date().toISOString()
        };

        try {
            // Lưu vào bộ tạm thay vì gửi lên server
            saveToPending(accountData);
            
            setLoading(false);
            setSuccessMessage('Đăng bán tài khoản thành công! Tài khoản đang chờ duyệt.');
            
            // Xóa form sau khi thành công
            setTenTaiKhoan('');
            setMatKhauTaiKhoan('');
            setMoTa('');
            setGiaBan('');
            
            // Chuyển hướng đến trang đợi duyệt sau 2 giây
            setTimeout(() => navigate('/sell-account'), 2000);

        } catch (err) {
            setLoading(false);
            setError('Đã xảy ra lỗi khi lưu tài khoản. Vui lòng thử lại.');
            console.error("Lỗi lưu tài khoản:", err);
        }
    };

    return (
        <div className="sell-account-page sell-account-page-background">
            <h1>Đăng bán tài khoản game</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="game">Game:</label>
                    <input type="text" id="game" value="Liên Minh Huyền Thoại" readOnly disabled />
                </div>
                <div className="form-group">
                    <label htmlFor="tenTaiKhoan">Tên Tài Khoản (trong game):</label>
                    <input
                        type="text"
                        id="tenTaiKhoan"
                        value={tenTaiKhoan}
                        onChange={(e) => setTenTaiKhoan(e.target.value)}
                        required
                        aria-describedby="tenTaiKhoanHelp"
                    />
                    <small id="tenTaiKhoanHelp">Tên đăng nhập của tài khoản game bạn muốn bán.</small>
                </div>

                <div className="form-group">
                    <label htmlFor="matKhauTaiKhoan">Mật Khẩu Tài Khoản:</label>
                    <input
                        type="password"
                        id="matKhauTaiKhoan"
                        value={matKhauTaiKhoan}
                        onChange={(e) => setMatKhauTaiKhoan(e.target.value)}
                        required
                        aria-describedby="matKhauHelp"
                    />
                    <small id="matKhauHelp" style={{ color: 'red', display: 'block' }}>
                        CẢNH BÁO: Bạn đang nhập mật khẩu tài khoản game. Hãy chắc chắn bạn hiểu rõ rủi ro. Thông tin này sẽ được gửi cho quản trị viên để duyệt.
                    </small>
                </div>
                    
                <div className="form-group">
                    <label htmlFor="moTa">Mô Tả Chi Tiết:</label>
                    <textarea
                        id="moTa"
                        value={moTa}
                        onChange={(e) => setMoTa(e.target.value)}
                        rows="4"
                        required
                        placeholder="Ví dụ: Rank Vàng, 100 tướng, 50 trang phục,..."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="giaBan">Giá Bán (VNĐ):</label>
                    <input
                        type="number"
                        id="giaBan"
                        value={giaBan}
                        onChange={(e) => setGiaBan(e.target.value)}
                        required
                        min="0"
                        placeholder="VD: 50.000 VND"
                    />
                </div>

                
                {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}

            
                <button type="submit" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Đăng Bán (Chờ Duyệt)'}
                </button>
            </form>
        </div>
    );
}

export default SellAccountPage;