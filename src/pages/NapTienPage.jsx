// src/pages/NapTienPage.jsx
import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import './NapTienPage.css'; // Đảm bảo file này tồn tại nếu bạn import

const qrCodeImageUrl = '/qr.png';

function NapTienPage() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div>Đang tải thông tin người dùng... Vui lòng đăng nhập để nạp tiền.</div>;
  }

  const transactionMemo = `nạp tiền vào tài khoản ${user.TenDangNhap}`;

  return (
    <div className="nap-tien-page-container naptien-page-background">
      {/* ===>>> THÊM DIV BAO BỌC NÀY <<<=== */}
      <div className="content-wrapper">

        {/* Toàn bộ nội dung trang đặt bên trong content-wrapper */}
        <h1>Nạp tiền vào tài khoản</h1>

        <div className="qr-section">
          <p>Vui lòng quét mã QR dưới đây bằng ứng dụng ngân hàng hoặc ví điện tử của bạn.</p>
          <img
            src={qrCodeImageUrl}
            alt="Mã QR Nạp tiền"
            className="qr-code-image"
          />
        </div>

        <div className="instructions-box">
          <h2>Hướng dẫn quan trọng:</h2>
          <p className="memo-label">
            Nội dung chuyển khoản BẮT BUỘC ghi chính xác:
          </p>
          <p className="memo-text">
            {transactionMemo}
          </p>
          <p>Ví dụ: Nếu bạn nạp 100.000 VNĐ, hãy chuyển khoản 100.000 VNĐ với nội dung trên.</p>
          <p>Sau khi chuyển khoản thành công, hệ thống sẽ cần thời gian để xác nhận và cộng tiền vào tài khoản của bạn (do quy trình thủ công).</p>
          <p>Nếu sau 15-30 phút chưa thấy tiền vào tài khoản, vui lòng liên hệ bộ phận hỗ trợ.</p>
        </div>

      </div> {/* ===>>> ĐÓNG DIV content-wrapper <<<=== */}
    </div>
  );
}

export default NapTienPage;