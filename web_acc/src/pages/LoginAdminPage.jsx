import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import './LoginAdminPage.css';

function LoginAdminPage() {
  const [tenDangNhap, setTenDangNhap] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { isLoggedIn, isAdmin, adminLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (isLoggedIn && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isLoggedIn, isAdmin, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8001/api/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          TenDangNhap: tenDangNhap, 
          MatKhau: matKhau 
        }),
      });

      const data = await response.json().catch(() => {
        throw new Error('Không thể phân tích phản hồi từ máy chủ');
      });

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      // Kiểm tra cả hai cách đặt tên token (access_token hoặc token)
      const token = data.access_token || data.token;
      const user = data.user || data.data;

      if (!user || !token) {
        throw new Error('Thông tin đăng nhập không hợp lệ');
      }

      // Kiểm tra vai trò admin
      if (user.VaiTro !== 1) {
        throw new Error('Bạn không có quyền truy cập admin');
      }

      adminLogin(user, token);
      toast.success('Đăng nhập admin thành công!');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      setError(err.message);
      toast.error(err.message || 'Đăng nhập thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-admin-container">
      <div className="login-admin-card">
        <h2 className="login-admin-title">Đăng Nhập Admin</h2>
        
        {error && <div className="login-admin-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-admin-form">
          <div className="form-group">
            <label htmlFor="tenDangNhap">Tên đăng nhập:</label>
            <input
              type="text"
              id="tenDangNhap"
              value={tenDangNhap}
              onChange={(e) => setTenDangNhap(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="matKhau">Mật khẩu:</label>
            <input
              type="password"
              id="matKhau"
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="login-admin-button"
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginAdminPage;