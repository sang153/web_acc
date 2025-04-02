// src/pages/AccountsPage.jsx
import React from 'react';
// import './AccountsPage.css'; // Tạo file CSS nếu cần style riêng

function AccountsPage() {
  return (
    <div className="accounts-page"> {/* Thêm class để style nếu cần */}
      <h1>Danh Sách Tài Khoản</h1>
      <p>Đây là nơi hiển thị danh sách các tài khoản Liên Minh Huyền Thoại đang được bán.</p>

      {/*
        Sau này bạn sẽ thêm logic ở đây để:
        1. Gọi API từ Laravel để lấy danh sách tài khoản (bảng TAIKHOAN).
        2. Dùng useState và useEffect để lưu và hiển thị danh sách đó.
        3. Tạo các component con (ví dụ: AccountCard) để hiển thị từng tài khoản.
      */}
    </div>
  );
}

export default AccountsPage;