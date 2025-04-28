import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext({
  isLoggedIn: false,
  isAdmin: false,
  user: null,
  token: null,
  isLoading: true,
  wallet: 0,
  login: () => {},
  adminLogin: () => {},
  logout: () => {},
  updateWallet: () => {},
  checkAdminRole: () => false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    isAdmin: false,
    user: null,
    token: null,
    wallet: 0,
    isLoading: true,
  });

  // Hàm kiểm tra vai trò admin (giống code thứ 3)
  const checkAdminRole = useCallback((userData) => {
    return userData?.VaiTro === 1;
  }, []);

  // Hàm cập nhật ví (giữ từ code thứ 2)
  const updateWallet = useCallback((newBalance) => {
    setAuthState(prev => ({
      ...prev,
      wallet: newBalance
    }));
  }, []);

  // Hàm clear auth (tương tự code thứ 3)
  const clearAuth = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setAuthState({
      isLoggedIn: false,
      isAdmin: false,
      user: null,
      token: null,
      wallet: 0,
      isLoading: false,
    });
  }, []);

  // Khởi tạo auth (kết hợp cả 2 code)
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');
        
        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          const isAdmin = checkAdminRole(userData);
          
          // CHỈ gọi API user nếu không phải admin
          if (!isAdmin) {
            const response = await axios.get('http://127.0.0.1:8001/api/user', {
              headers: { Authorization: `Bearer ${storedToken}` }
            });
            
            setAuthState({
              isLoggedIn: true,
              isAdmin: false,
              user: userData,
              token: storedToken,
              wallet: response.data.wallet || 0,
              isLoading: false,
            });
          } else {
            // Đối với admin, không cần gọi API user
            setAuthState({
              isLoggedIn: true,
              isAdmin: true,
              user: userData,
              token: storedToken,
              wallet: 0, // Admin không cần wallet
              isLoading: false,
            });
          }
          return;
        }
      } catch (error) {
        console.error("Lỗi khi khởi tạo auth:", error);
        clearAuth(); // Clear auth nếu có lỗi
      }
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
      }));
    };
  
    initializeAuth();
  }, [checkAdminRole, clearAuth]);

  // Hàm login chung (kết hợp cả 2 code)
  const login = useCallback(async (userData, authToken) => {
    try {
      // Thêm lấy thông tin ví như code thứ 2
      const response = await axios.get('http://127.0.0.1:8001/api/user', {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      localStorage.setItem('authToken', authToken);
      localStorage.setItem('authUser', JSON.stringify(userData));
      
      // Thêm kiểm tra admin như code thứ 3
      const isAdmin = checkAdminRole(userData);
      
      setAuthState({
        isLoggedIn: true,
        isAdmin,
        user: userData,
        token: authToken,
        wallet: response.data.wallet || 0,
        isLoading: false,
      });
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      throw error;
    }
  }, [checkAdminRole]);

  // Thêm hàm adminLogin riêng như code thứ 3
  const adminLogin = useCallback((adminData, authToken) => {
    try {
      if (!checkAdminRole(adminData)) {
        throw new Error('Người dùng không có quyền admin');
      }
      
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('authUser', JSON.stringify(adminData));
      
      setAuthState({
        isLoggedIn: true,
        isAdmin: true,
        user: adminData,
        token: authToken,
        wallet: 0, // Thêm wallet mặc định là 0
        isLoading: false,
      });
    } catch (error) {
      console.error("Lỗi khi lưu trạng thái admin:", error);
      throw error;
    }
  }, [checkAdminRole]);

  // Hàm logout (kết hợp cả 2 code)
  const logout = useCallback(async () => {
    try {
      // Có thể thêm gọi API logout nếu cần
      // await axios.post('/api/logout');
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const contextValue = {
    ...authState,
    login,
    adminLogin,
    logout,
    updateWallet,
    checkAdminRole, // Thêm vào context value như code thứ 3
  };

  if (authState.isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Đang tải thông tin đăng nhập...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;