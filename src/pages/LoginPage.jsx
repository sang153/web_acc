// src/pages/LoginPage.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Thêm Link nếu cần
import AuthContext from '../context/AuthContext';
import './LoginPage.css'; // CSS dùng chung đã có style cho nút Google

// --- Import Firebase ---
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../firebase'; // Import đối tượng auth đã khởi tạo
// ---------------------

function LoginPage() {
  // State cho form đăng nhập thường
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State cho lỗi và loading
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading cho form thường
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Loading riêng cho Google

  // Lấy hàm login từ Context
  const { login } = useContext(AuthContext);
  // Hook điều hướng
  const navigate = useNavigate();

  // Hàm xử lý đăng nhập thường
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/login', { // <<< Endpoint API login thường
        email: email, // Hoặc TenDangNhap
        MatKhau: password,
      });
      if (response.status === 200 && response.data) {
        const userData = response.data.user;
        const authToken = response.data.token;
        if (userData && authToken) {
          login(userData, authToken);
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
      } else { /* ... xử lý lỗi mạng ... */ setError('Không thể kết nối.'); }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Hàm xử lý đăng nhập bằng Google (Giống hệt RegisterPage) ---
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      // Gọi API Backend để xác thực token và login/register user trong hệ thống Laravel
      const backendApiUrl = '/api/auth/google'; // <<< Dùng cùng endpoint với Register
      const response = await axios.post(backendApiUrl, { token: idToken });

      if (response.status === 200 && response.data) {
        const laravelUserData = response.data.user;
        const laravelAuthToken = response.data.token;
        if (laravelUserData && laravelAuthToken) {
          login(laravelUserData, laravelAuthToken); // Cập nhật Context
          navigate('/'); // Chuyển hướng
        } else {
          setError('Phản hồi từ server không hợp lệ.');
        }
      } else {
        setError(response.data?.message || 'Lỗi từ server.');
      }
    } catch (err) {
      // Xử lý lỗi (Firebase hoặc gọi API backend)
      console.error("Lỗi Google Sign-In hoặc gọi Backend:", err);
       if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
         setError('Bạn đã hủy đăng nhập bằng Google.');
       } else if (err.response) {
          setError(err.response.data?.message || 'Lỗi khi giao tiếp với server.');
       } else {
         setError('Đăng nhập bằng Google thất bại.');
       }
    } finally {
      setIsGoogleLoading(false);
    }
  };
  // -----------------------------------------------------------

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Đăng Nhập</h2>
        {error && <p className="error-message">{error}</p>}

        {/* --- Form đăng nhập thường --- */}
        <div className="form-group">
          <label htmlFor="login-email">Email hoặc Tên đăng nhập:</label>
          <input type="text" id="login-email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading || isGoogleLoading} />
        </div>
        <div className="form-group">
          <label htmlFor="login-password">Mật khẩu:</label>
          <input type="password" id="login-password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading || isGoogleLoading}/>
        </div>
        <button type="submit" disabled={isLoading || isGoogleLoading}>
          {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
        </button>
        {/* -------------------------- */}

        {/* --- Phần đăng nhập bằng Google --- */}
        <div className="social-login-divider">
          <span>HOẶC</span>
        </div>
        <button
          type="button"
          className="google-signin-button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
        >
          <img src="/google-logo.svg" alt="Google logo" width="20" height="20" style={{ marginRight: '10px', verticalAlign: 'middle' }}/>
          {isGoogleLoading ? 'Đang xử lý...' : 'Đăng nhập bằng Google'}
        </button>
        {/* ----------------------------- */}

        <p style={{ marginTop: '20px' }}>
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;