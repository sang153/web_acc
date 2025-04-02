// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Tạo Context Object
// Giá trị mặc định ban đầu (sẽ được ghi đè bởi Provider)
const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

// Hook tùy chỉnh để sử dụng AuthContext dễ dàng hơn (tùy chọn)
export const useAuth = () => {
  return useContext(AuthContext);
};

// 2. Tạo Provider Component
export const AuthProvider = ({ children }) => {
  // State để lưu trạng thái đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // State để lưu thông tin người dùng (bao gồm VaiTro)
  const [user, setUser] = useState(null);
  // State để lưu token (nếu backend dùng token như JWT)
  const [token, setToken] = useState(null);
  // State để kiểm tra xem đã load xong trạng thái từ localStorage chưa
  const [isLoading, setIsLoading] = useState(true);

  // useEffect để kiểm tra localStorage khi component được mount lần đầu
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser)); // Parse chuỗi JSON thành object
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Lỗi khi đọc trạng thái đăng nhập từ localStorage:", error);
      // Đảm bảo trạng thái là đã đăng xuất nếu có lỗi
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      setIsLoggedIn(false);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false); // Đánh dấu đã load xong
    }
  }, []); // Mảng rỗng đảm bảo chỉ chạy 1 lần khi mount

  // Hàm xử lý khi đăng nhập thành công
  const login = (userData, authToken) => {
    try {
      localStorage.setItem('authToken', authToken);
      // Lưu user data dưới dạng chuỗi JSON
      localStorage.setItem('authUser', JSON.stringify(userData));
      setToken(authToken);
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
       console.error("Lỗi khi lưu trạng thái đăng nhập vào localStorage:", error);
    }
  };

  // Hàm xử lý khi đăng xuất
  const logout = () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      setToken(null);
      setUser(null);
      setIsLoggedIn(false);
      // Có thể gọi thêm API logout của backend ở đây nếu cần
      // Ví dụ: axios.post('/api/logout');
    } catch (error) {
       console.error("Lỗi khi xóa trạng thái đăng nhập khỏi localStorage:", error);
    }
  };

  // Tạo giá trị context sẽ được cung cấp cho các component con
  const contextValue = {
    isLoggedIn,
    user,
    token,
    login,
    logout,
    // Không truyền isLoading ra ngoài nếu component khác không cần biết
  };

  // Chỉ render children sau khi đã kiểm tra xong localStorage
  // để tránh hiện giao diện sai lúc đầu
  if (isLoading) {
    return <div>Loading...</div>; // Hoặc một spinner/component loading khác
  }

  // 3. Cung cấp Context Value cho các component con
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Export AuthContext để các component con có thể dùng useContext(AuthContext)
export default AuthContext;