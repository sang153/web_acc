// src/pages/RegisterPage.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios'; // Bạn sẽ cần axios để gọi API Laravel
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './LoginPage.css'; // Tái sử dụng CSS hoặc tạo CSS riêng

// --- Import Firebase ---
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../firebase'; // Import đối tượng auth đã khởi tạo từ firebase.js
// ---------------------

function RegisterPage() {
  // State cho form đăng ký thường
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State chung
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading cho form thường
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Loading riêng cho Google

  // Lấy hàm login từ Context
  const { login } = useContext(AuthContext);
  // Hook điều hướng
  const navigate = useNavigate();

  // Hàm xử lý đăng ký thường (email/password) - giữ nguyên logic gọi API Laravel của bạn
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    console.log('Submit form đăng ký thường');
    // ... (Thêm logic gọi API đăng ký thường của Laravel ở đây) ...
    setIsLoading(false);
  };

  // --- Hàm xử lý đăng nhập/đăng ký bằng Google (Phần React) ---
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();

    try {
      // 1. Mở popup đăng nhập Google bằng Firebase Auth
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      console.log('Firebase Google Sign-In Success:', firebaseUser);

      // 2. Lấy Firebase ID Token
      const idToken = await firebaseUser.getIdToken();
      console.log("Firebase ID Token:", idToken); // Dùng để gửi cho backend

      // --- !!! PHẦN CẦN PHỐI HỢP VỚI BACKEND LARAVEL !!! ---
      // 3. Gửi ID Token lên API endpoint của Laravel để xác thực và xử lý
      //    (Bạn cần hỏi backend dev để biết chính xác URL và cấu trúc response)
      try {
        // Giả sử backend có endpoint POST /api/auth/google
        const backendApiUrl = '/api/auth/google'; // <<< Thay bằng URL API thực tế
        console.log(`Sending token to ${backendApiUrl}`);

        const response = await axios.post(backendApiUrl, {
          token: idToken // Gửi token lên backend
        });

        // 4. Xử lý phản hồi TỪ LARAVEL
        if (response.status === 200 && response.data) {
          // Giả sử Laravel trả về { user: {...}, token: "laravel_token" }
          const laravelUserData = response.data.user;
          const laravelAuthToken = response.data.token;

          if (laravelUserData && laravelAuthToken) {
            // 5. Cập nhật React Context bằng dữ liệu TỪ LARAVEL
            login(laravelUserData, laravelAuthToken);
            console.log('Login successful via Google, navigating home.');
            navigate('/'); // Chuyển hướng về trang chủ
          } else {
            console.error('Backend response missing user data or token.');
            setError('Phản hồi từ server không hợp lệ.');
          }
        } else {
           console.error('Backend response error:', response);
           setError(response.data?.message || 'Lỗi từ server.');
        }

      } catch (backendError) {
         console.error('Error calling backend API:', backendError);
         if (backendError.response) {
            setError(backendError.response.data?.message || 'Lỗi khi giao tiếp với server.');
         } else {
            setError('Không thể kết nối đến server để hoàn tất đăng nhập Google.');
         }
      }
      // --- KẾT THÚC PHẦN PHỐI HỢP BACKEND ---

    } catch (firebaseError) {
      // Xử lý lỗi từ chính Firebase signInWithPopup
      console.error("Lỗi Firebase Google Sign-In:", firebaseError);
      if (firebaseError.code === 'auth/popup-closed-by-user' || firebaseError.code === 'auth/cancelled-popup-request') {
        setError('Bạn đã hủy đăng nhập bằng Google.');
      } else {
        setError('Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
      }
    } finally {
      setIsGoogleLoading(false); // Kết thúc loading Google
    }
  };
  // -------------------------------------------------------

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Đăng Ký Tài Khoản Mới</h2>
        {error && <p className="error-message">{error}</p>}

        {/* --- Form đăng ký thường --- */}
        <div className="form-group">
          <label htmlFor="register-email">Email:</label>
          <input type="email" id="register-email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading || isGoogleLoading} />
        </div>
        <div className="form-group">
          <label htmlFor="register-password">Mật khẩu:</label>
          <input type="password" id="register-password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading || isGoogleLoading}/>
        </div>
        <button type="submit" disabled={isLoading || isGoogleLoading}>
          {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
        </button>
        {/* ------------------------ */}

        {/* --- Phần đăng ký bằng Google --- */}
        <div className="social-login-divider">
          <span>HOẶC</span>
        </div>
        <button
          type="button" // Quan trọng: để không submit form thường
          className="google-signin-button" // Class để style riêng
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading} // Disable khi đang loading
        >
          {/* Thay thế bằng logo Google nếu muốn */}
          <img src="/google-logo.svg" alt="Google logo" width="20" height="20" style={{ marginRight: '10px', verticalAlign: 'middle' }}/>
          {isGoogleLoading ? 'Đang xử lý...' : 'Đăng ký bằng Google'}
        </button>
        {/* ----------------------------- */}

        <p style={{ marginTop: '20px' }}>
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;