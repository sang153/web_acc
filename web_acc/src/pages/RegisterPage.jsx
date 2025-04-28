import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './LoginPage.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.withCredentials = true;

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate
    if (formData.password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError("Mật khẩu xác nhận không khớp");
      setIsLoading(false);
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError("Email không hợp lệ");
      setIsLoading(false);
      return;
    }

    try {
      // Lấy CSRF token trước
      await axios.get('/sanctum/csrf-cookie');

      const response = await axios.post('/api/auth/register', {
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      });

      if (response.status === 200 || response.status === 201) {
        const userData = response.data?.user;
        const authToken = response.data?.token;
        
        if (userData && authToken) {
          login(userData, authToken);
          toast.success("Đăng ký thành công!");
          navigate('/');
        } else {
          setError('Đăng ký thành công nhưng thiếu thông tin người dùng');
        }
      }
    } catch (err) {
      console.error('Lỗi đăng ký:', err.response?.data);
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat();
        setError(errorMessages.join(', '));
      } else {
        setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page register-page-background">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Đăng Ký Tài Khoản Mới</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password_confirmation">Xác nhận mật khẩu:</label>
          <input
            type="password"
            id="password_confirmation"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
        </button>

        <p style={{ marginTop: '20px', color: 'black' }}>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;