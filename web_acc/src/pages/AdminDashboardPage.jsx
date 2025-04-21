  // src/pages/AdminDashboardPage.jsx
  import React from 'react';
  import { useAuth } from '../context/AuthContext';
  import { useNavigate } from 'react-router-dom';

  const AdminDashboardPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
      logout();
    };

    return (
      <div style={{ 
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          textAlign: 'center',
          color: '#1976d2',
          marginBottom: '30px'
        }}>Trang Quản Trị Admin</h1>
        
        {user && (
          <div style={{ 
            background: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '30px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginTop: 0 }}>Thông tin Admin</h2>
            <p><strong>Tai Khoan:</strong> {user.TenDangNhap || 'Chưa cập nhật'}</p>
            <p><strong>Email:</strong> {user.Email}</p>
            <p><strong>Số điện thoại:</strong> {user.SoDienThoai || 'Chưa cập nhật'}</p>
          </div>
        )}
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Card Quản lý sản phẩm */}
          <div 
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.3s',
              ':hover': {
                transform: 'translateY(-5px)'
              }
            }}
            onClick={() => navigate('/admin/accounts')}
          >
            <h2 style={{ color: '#1976d2' }}>Quản lý sản phẩm</h2>
            <p>Xem, thêm, sửa, xóa sản phẩm trong hệ thống</p>
          </div>

          {/* Card Duyệt sản phẩm */}
          <div 
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.3s',
              ':hover': {
                transform: 'translateY(-5px)'
              }
            }}
            onClick={() => navigate('/admin/pending-approval')}
          >
            <h2 style={{ color: '#4caf50' }}>Duyệt sản phẩm</h2>
            <p>Duyệt các sản phẩm mới đang chờ phê duyệt</p>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button 
            style={{ 
              padding: '10px 20px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    );
  };

  export default AdminDashboardPage;