import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './LoginPage.css';
import { toast } from 'react-toastify';

function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    let requestData = {
      password: password
    };

    if (identifier.includes('@') && identifier.includes('.')) {
      requestData.email = identifier;
    } else {
      requestData.username = identifier;
    }

    try {
      const response = await axios.post('/api/auth/login', requestData, { 
        withCredentials: true 
      });

      if (response.status === 200 && response.data) {
        const userData = response.data.user;
        const authToken = response.data.token;

        if (userData && authToken) {
          login(userData, authToken);
          toast.success("Đăng nhập thành công!");
          navigate('/');
        } else {
          setError('Dữ liệu trả về từ server không hợp lệ.');
        }
      } else {
        setError(response.data?.message || 'Đã có lỗi xảy ra.');
      }
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      if (err.response) {
        setError(err.response.data?.message || 'Sai thông tin đăng nhập hoặc lỗi server.');
      } else if (err.request) {
        setError('Không thể kết nối đến máy chủ.');
      } else {
        setError('Có lỗi xảy ra khi gửi yêu cầu đăng nhập.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page login-page-background">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Đăng Nhập</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="login-identifier">Email hoặc Tên đăng nhập:</label>
          <input
            type="text"
            id="login-identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            autoComplete="username"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Mật khẩu:</label>
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={isLoading}
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
        </button>

        <p style={{ marginTop: '20px', color: 'black' }}>
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;