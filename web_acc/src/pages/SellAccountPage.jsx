// src/pages/SellAccountPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Cài đặt axios: npm install axios (hoặc dùng fetch)
import { useNavigate } from 'react-router-dom'; // Để chuyển hướng sau khi gửi
// import './SellAccountPage.css'; // Import file CSS của bạn
import './SellAccountPage.css';
function SellAccountPage() {
    // --- State cho Form ---
    const [gameId, setGameId] = useState(1); // Mặc định là 1 (Liên Minh Huyền Thoại)
    const [tenTaiKhoan, setTenTaiKhoan] = useState('');
    const [matKhauTaiKhoan, setMatKhauTaiKhoan] = useState('');
    const [moTa, setMoTa] = useState('');
    const [giaBan, setGiaBan] = useState('');

    // --- State cho trạng thái và thông báo ---
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate(); // Hook để chuyển hướng

    // --- TODO: Kiểm tra đăng nhập ---
    // Logic kiểm tra người dùng đã đăng nhập hay chưa sẽ ở đây
    // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
    // Ví dụ:
    // const { isLoggedIn } = useAuth(); // Giả sử bạn có một custom hook useAuth
    // useEffect(() => {
    //   if (!isLoggedIn) {
    //     navigate('/login');
    //   }
    // }, [isLoggedIn, navigate]);

    // --- Hàm xử lý khi gửi Form ---
    const handleSubmit = async (event) => {
        event.preventDefault(); // Ngăn trình duyệt gửi form theo cách mặc định
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
            MaGame: gameId, // Luôn là 1 trong trường hợp này
            TenTaiKhoan: tenTaiKhoan,
            MatKhauTaiKhoan: matKhauTaiKhoan,
            MoTa: moTa,
            GiaBan: parseFloat(giaBan),
            // MaNguoiDungBan sẽ được Laravel tự động lấy từ user đang đăng nhập
            // TrangThai sẽ được Laravel đặt là "chờ duyệt"
        };

        try {
            // !!! Đảm bảo bạn của bạn tạo API endpoint này trên Laravel !!!
            // Endpoint này cần được bảo vệ, chỉ user đăng nhập mới gọi được
            const response = await axios.post('/api/taikhoan/submit-for-approval', accountData, {
                 // Gửi kèm token xác thực nếu cần (ví dụ: Bearer token)
                 // headers: {
                 //   Authorization: `Bearer ${yourAuthToken}`
                 // }
            });

            setLoading(false);
            setSuccessMessage('Đăng bán tài khoản thành công! Chờ quản trị viên duyệt.');
            // Xóa form sau khi thành công
            setTenTaiKhoan('');
            setMatKhauTaiKhoan('');
            setMoTa('');
            setGiaBan('');
            // Có thể chuyển hướng người dùng sau vài giây
            // setTimeout(() => navigate('/my-accounts'), 3000); // Ví dụ chuyển đến trang quản lý acc của user

        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Đã xảy ra lỗi khi đăng bán. Vui lòng thử lại.');
            console.error("Lỗi đăng bán:", err);
        }
    };

    // --- Render JSX ---
    return (
        // Thêm class cho background nếu cần, ví dụ: className="sell-account-page sell-account-page-background"
        <div className="sell-account-page sell-account-page-background">
            <h1>Đăng bán tài khoản game</h1>

            <form onSubmit={handleSubmit}>
                {/* 1. Chọn Game (Hiển thị tĩnh vì chỉ có 1 game) */}
                <div className="form-group">
                    <label htmlFor="game">Game:</label>
                    {/* Bạn có thể làm ẩn input này nếu không muốn user thấy */}
                    <input type="text" id="game" value="Liên Minh Huyền Thoại" readOnly disabled />
                    {/* Hoặc nếu muốn dùng select dù chỉ có 1 option:
                    <select id="game" value={gameId} onChange={(e) => setGameId(Number(e.target.value))} disabled>
                         <option value={1}>Liên Minh Huyền Thoại</option>
                    </select>
                    */}
                </div>

                {/* 2. Tên Tài Khoản */}
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

                {/* 3. Mật Khẩu Tài Khoản */}
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
                    
                {/* 4. Mô Tả */}
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

                {/* 5. Giá Bán */}
                <div className="form-group">
                    <label htmlFor="giaBan">Giá Bán (VNĐ):</label>
                    <input
                        type="number"
                        id="giaBan"
                        value={giaBan}
                        onChange={(e) => setGiaBan(e.target.value)}
                        required
                        min="0" 
                        placeholder="VD:50.000 VND"// Hoặc một giá trị tối thiểu hợp lý
                    />
                </div>

                {/* Thông báo lỗi/thành công */}
                {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}

                {/* 6. Nút Gửi */}
                <button type="submit" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Đăng Bán (Chờ Duyệt)'}
                </button>
            </form>
        </div>
    );
}

export default SellAccountPage;