// src/pages/LoginPage.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './LoginPage.css'; // CSS dùng chung

// --- Import Firebase ---
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../firebase';
// ---------------------

// --- Import react-toastify ---
import { toast } from 'react-toastify';
// ---------------------------

function LoginPage() {
  // --- THAY ĐỔI STATE ---
  const [identifier, setIdentifier] = useState(''); // Đổi từ email sang identifier
  const [password, setPassword] = useState('');
  // ---------------------

  // State cho lỗi và loading
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Lấy hàm login từ Context
  const { login } = useContext(AuthContext);
  // Hook điều hướng
  const navigate = useNavigate();

  // --- HÀM XỬ LÝ ĐĂNG NHẬP THƯỜNG (ĐÃ CẬP NHẬT) ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(''); // Xóa lỗi cũ

    // --- Chuẩn bị dữ liệu gửi đi ---
    let requestData = {
      // !!! GIẢ ĐỊNH tên trường mật khẩu là "password". Cần xác nhận với backend !!!
      password: password
    };
    // Kiểm tra đơn giản xem identifier có giống email không
    if (identifier.includes('@') && identifier.includes('.')) {
      requestData.email = identifier; // Gửi trường 'email'
    } else {
      // !!! GIẢ ĐỊNH tên trường username là "username". Cần xác nhận với backend !!!
      requestData.username = identifier; // Gửi trường 'username'
    }
    // -----------------------------

    try {
      // !!! CẦN XÁC NHẬN URL API ĐĂNG NHẬP THỰC TẾ TỪ BACKEND !!!
      const response = await axios.post('/api/login', requestData); // <<< Endpoint API login thường

      // Xử lý thành công
      if (response.status === 200 && response.data) {
        // !!! CẦN XÁC NHẬN cấu trúc response.data từ backend !!!
        const userData = response.data.user;
        const authToken = response.data.token;

        if (userData && authToken) {
          login(userData, authToken);
          // --- Hiển thị thông báo thành công ---
          toast.success("Đăng nhập thành công!");
          // -----------------------------------
          navigate('/'); // Chuyển hướng về trang chủ
        } else {
          setError('Dữ liệu trả về từ server không hợp lệ.');
        }
      } else {
         // !!! CẦN XÁC NHẬN cấu trúc response.data từ backend khi có lỗi !!!
         setError(response.data?.message || 'Đã có lỗi xảy ra.');
      }
    } catch (err) {
      // Xử lý lỗi
      console.error('Lỗi đăng nhập:', err);
      if (err.response) {
        // !!! CẦN XÁC NHẬN cấu trúc err.response.data từ backend khi có lỗi !!!
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
  // --- KẾT THÚC HÀM ĐĂNG NHẬP THƯỜNG ---


  // --- Hàm xử lý đăng nhập bằng Google (ĐÃ THÊM TOAST) ---
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      // Gọi API Backend
      try {
          // !!! CẦN XÁC NHẬN URL API GOOGLE AUTH THỰC TẾ TỪ BACKEND !!!
          const backendApiUrl = '/api/auth/google';
          const response = await axios.post(backendApiUrl, { token: idToken });

          if (response.status === 200 && response.data) {
            // !!! CẦN XÁC NHẬN cấu trúc response.data từ backend !!!
            const laravelUserData = response.data.user;
            const laravelAuthToken = response.data.token;
            if (laravelUserData && laravelAuthToken) {
              login(laravelUserData, laravelAuthToken);
              // --- Hiển thị thông báo thành công ---
              toast.success("Đăng nhập thành công!");
              // -----------------------------------
              navigate('/');
            } else {
              setError('Phản hồi từ server không hợp lệ.');
            }
          } else {
            setError(response.data?.message || 'Lỗi từ server.');
          }
      } catch (backendError) {
          if (backendError.response) {
            setError(backendError.response.data?.message || 'Lỗi khi giao tiếp với server.');
          } else {
            setError('Không thể kết nối đến server để hoàn tất đăng nhập Google.');
          }
      }
    } catch (firebaseError) {
      // Xử lý lỗi Firebase
      console.error("Lỗi Google Sign-In:", firebaseError);
      if (firebaseError.code === 'auth/popup-closed-by-user' || firebaseError.code === 'auth/cancelled-popup-request') {
        setError('Bạn đã hủy đăng nhập bằng Google.');
      } else {
        setError('Đăng nhập bằng Google thất bại.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };
  // -----------------------------------------------------------


  // --- Phần return JSX (ĐÃ SỬA INPUT EMAIL/USERNAME) ---
  return (
    
      <div className="login-page login-page-background">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Đăng Nhập</h2>
        {error && <p className="error-message">{error}</p>}

        {/* Input đã đổi thành identifier */}
        <div className="form-group">
          <label htmlFor="login-identifier">Email hoặc Tên đăng nhập:</label>
          <input
            type="text" // Đổi type
            id="login-identifier" // Đổi id
            value={identifier} // Bind state mới
            onChange={(e) => setIdentifier(e.target.value)} // Cập nhật state mới
            required
            autoComplete="username"
            disabled={isLoading || isGoogleLoading}
           />
        </div>
        {/* --- Kết thúc sửa input --- */}

        <div className="form-group">
          <label htmlFor="login-password">Mật khẩu:</label>
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password" // Gợi ý cho trình duyệt
            disabled={isLoading || isGoogleLoading}
          />
        </div>
        <button type="submit" disabled={isLoading || isGoogleLoading}>
          {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
        </button>

        {/* Phần đăng nhập bằng Google */}
        <div className="social-login-divider">
          <span>HOẶC</span>
        </div>
        <button
          type="button"
          className="google-signin-button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
        >
          <img src="/images.png" alt="Google logo" width="20" height="20" style={{ marginRight: '10px', verticalAlign: 'middle' }}/>
          {isGoogleLoading ? 'Đang xử lý...' : 'Đăng nhập bằng Google'}
        </button>

        <p style={{ marginTop: '20px', color:'black'}}>
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </form>
    </div>
   
  );
}

export default LoginPage;