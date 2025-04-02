// src/pages/RegisterPage.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './LoginPage.css'; // Giả sử dùng chung CSS với Login


// Thiết lập baseURL cho Axios
axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.withCredentials = true; // Quan trọng: Gửi cookie với request

// Gọi CSRF cookie trước khi đăng ký
const getCSRFToken = async () => {
  try {
    await axios.get('/sanctum/csrf-cookie');
    console.log("CSRF token set!");
  } catch (error) {
    console.error("Lỗi khi lấy CSRF token:", error);
  }
};

const handleRegister = async () => {
  try {
    await axios.get("/sanctum/csrf-cookie"); // Lấy CSRF token

    const response = await axios.post("/api/auth/register", {
      name: formData.user,  // Đổi username thành name
      email: formData.email,
      password: formData.password,
    }, { withCredentials: true });

    console.log("Đăng ký thành công:", response.data);
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error.response ? error.response.data : error);
  }
};

// Gọi trước khi gửi request register
const handleSubmit = async (event) => {
  event.preventDefault();
  setIsLoading(true);
  setError('');

  // Xác định loại định danh (Email hay Username)
  const isEmail = identifier.includes('@') && identifier.includes('.');

  // Kiểm tra mật khẩu và tên đăng nhập
  if (password.length < 8) {
    setError("Mật khẩu phải có ít nhất 8 ký tự.");
    setIsLoading(false);
    return;
  }

  if (!isEmail && identifier.length < 8) {
    setError("Tên đăng nhập phải có ít nhất 8 ký tự.");
    setIsLoading(false);
    return;
  }

  let requestData = {
    password: password, // Chỉ gửi mật khẩu vào requestData
  };

  // Kiểm tra nếu là email hay username
  if (isEmail) {
    requestData.email = identifier;
  } else {
    requestData.username = identifier;
  }

  try {
    const response = await axios.post('/api/auth/register', requestData, { withCredentials: true });

    if (response.status === 200 || response.status === 201) {
      const userData = response.data?.user;
      const authToken = response.data?.token;
      if (userData && authToken) {
        login(userData, authToken);
        toast.success("Đăng ký thành công!");
        navigate('/');
      } else {
        setError('Đăng ký thành công.');
      }
    } else {
      setError(response.data?.message || 'Có lỗi xảy ra từ server.');
    }
  } catch (err) {
    console.error('Lỗi khi đăng ký:', err);
    if (err.response) {
      setError(err.response.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } else {
      setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.');
    }
  } finally {
    setIsLoading(false);
  }
};
// --- Import Firebase ---
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../firebase';
// ---------------------

import { toast } from 'react-toastify';

function RegisterPage() {
  // --- THAY ĐỔI STATE ---
  const [identifier, setIdentifier] = useState(''); // Đổi từ email sang identifier
  const [password, setPassword] = useState('');
  // const [name, setName] = useState(''); // Bỏ comment nếu cần trường tên

  // State chung
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- HÀM ĐĂNG KÝ THƯỜNG (ĐÃ THÊM VALIDATION) ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    // --- Xác định loại định danh (Email hay Username) ---
    // Thực hiện việc này trước để dùng cho validation
    const isEmail = identifier.includes('@') && identifier.includes('.');
    // -------------------------------------------------

    // === BẮT ĐẦU KIỂM TRA VALIDATION ===
    // 1. Kiểm tra độ dài Mật khẩu
    if (password.length < 8) {
        setError("Mật khẩu phải có ít nhất 8 ký tự.");
        setIsLoading(false); // Tắt loading trước khi dừng
        return; // Dừng hàm, không gửi API
    }

    // 2. Kiểm tra độ dài Tên đăng nhập (chỉ khi là username)
    if (!isEmail && identifier.length < 8) {
        setError("Tên đăng nhập phải có ít nhất 8 ký tự.");
        setIsLoading(false); // Tắt loading trước khi dừng
        return; // Dừng hàm, không gửi API
    }
    // === KẾT THÚC KIỂM TRA VALIDATION ===


    // --- Chuẩn bị dữ liệu gửi đi (sau khi validation thành công) ---
    let requestData = {
        password: password
        // name: name // Nếu có trường tên
    };
    if (isEmail) {
        requestData.email = identifier;
    } else {
        requestData.username = identifier;
    }
    // -----------------------------------------------------------


    // Nếu tất cả validation ở trên đều OK thì mới tiếp tục gọi API
    try {
      const response = await axios.post(
        '/api/auth/register', // <<< !!! Nhớ xác nhận URL !!!
        requestData
      );

      // Xử lý thành công
      if (response.status === 200 || response.status === 201) {
          const userData = response.data?.user;
          const authToken = response.data?.token;
          if (userData && authToken) {
            login(userData, authToken);
            toast.success("Đăng ký thành công!");
            navigate('/');
          } else {
            setError('Đăng ký thành công.');
          }
      } else {
        setError(response.data?.message || 'Có lỗi xảy ra từ server.');
      }

    } catch (err) {
      // Xử lý lỗi
      console.error('Lỗi khi đăng ký thường:', err);
      if (err.response) {
        setError(err.response.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      } else if (err.request) {
        setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.');
      } else {
        setError('Có lỗi xảy ra khi gửi yêu cầu đăng ký.');
      }
    } finally {
      // Khối finally này chỉ chạy nếu không bị return sớm do validation
      setIsLoading(false);
    }
  };
  // --- KẾT THÚC HÀM ĐĂNG KÝ THƯỜNG ---


  // --- Hàm xử lý đăng nhập/đăng ký bằng Google (Giữ nguyên logic cũ) ---
  const handleGoogleSignIn = async () => {
    // ... (code giữ nguyên như trước) ...
    setIsGoogleLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      console.log('Firebase Google Sign-In Success:', firebaseUser);
      const idToken = await firebaseUser.getIdToken();
      console.log("Firebase ID Token:", idToken);

      try {
        const backendApiUrl = '/api/auth/google'; // <<< !!! THAY BẰNG URL API THỰC TẾ !!!
        console.log(`Sending token to ${backendApiUrl}`);
        const response = await axios.post(backendApiUrl, { token: idToken });

        if (response.status === 200 && response.data) {
          // !!! CẦN XÁC NHẬN cấu trúc response.data từ backend !!!
          const laravelUserData = response.data.user;
          const laravelAuthToken = response.data.token;
          if (laravelUserData && laravelAuthToken) {
            login(laravelUserData, laravelAuthToken);
            console.log('Login/Register successful via Google, navigating home.');
            toast.success("Đăng ký thành công!");
            navigate('/');
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
    } catch (firebaseError) {
      console.error("Lỗi Firebase Google Sign-In:", firebaseError);
      if (firebaseError.code === 'auth/popup-closed-by-user' || firebaseError.code === 'auth/cancelled-popup-request') {
        setError('Bạn đã hủy đăng nhập bằng Google.');
      } else {
        setError('Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };
  // -------------------------------------------------------


  // --- Phần return JSX (ĐÃ SỬA INPUT EMAIL/USERNAME) ---
  return (
 
      <div className="register-page register-page-background">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Đăng Ký Tài Khoản Mới</h2>
        {error && <p className="error-message">{error}</p>}

        {/* --- Form đăng ký thường --- */}
        {/* Input đã đổi thành identifier */}
        <div className="form-group">
          <label htmlFor="register-identifier">Email :</label>
          <input
            type="text" // Đổi type thành text
            id="register-identifier" // Đổi id
            value={identifier} // Bind state mới
            onChange={(e) => setIdentifier(e.target.value)} // Cập nhật state mới
            required
            autoComplete="username" // Gợi ý cho trình duyệt
            disabled={isLoading || isGoogleLoading}
          />
        </div>
        {/* --- Kết thúc sửa input --- */}

        {/* Input cho các trường khác nếu cần */}
        {/*
        <div className="form-group">
          <label htmlFor="register-name">Tên của bạn:</label>
          <input type="text" id="register-name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading || isGoogleLoading}/>
        </div>
        */}
        <div className="form-group">
          <label htmlFor="register-password">Mật khẩu:</label>
          <input
            type="password"
            id="register-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password" // Gợi ý cho trình duyệt
            disabled={isLoading || isGoogleLoading}
          />
        </div>
        {/* Input cho password_confirmation nếu backend yêu cầu */}
        {/*
        <div className="form-group">
          <label htmlFor="register-password-confirm">Xác nhận mật khẩu:</label>
          <input type="password" id="register-password-confirm" required disabled={isLoading || isGoogleLoading}/>
        </div>
        */}
        <button type="submit" disabled={isLoading || isGoogleLoading}>
          {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
        </button>
        {/* ------------------------ */}

        {/* --- Phần đăng ký bằng Google (Nút đã sửa) --- */}
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
          {isGoogleLoading ? 'Đang xử lý...' : 'Đăng ký bằng Google'}
        </button>
        {/* ----------------------------- */}

        <p style={{ marginTop: '20px',color:'black' }}>
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </form>
    </div>
    
  );
}

export default RegisterPage;