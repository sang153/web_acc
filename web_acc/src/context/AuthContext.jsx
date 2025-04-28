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

  // Hàm kiểm tra vai trò admin
  const checkAdminRole = useCallback((userData) => {
    return userData?.VaiTro === 1;
  }, []);

  // Hàm cập nhật ví
  const updateWallet = useCallback((newBalance) => {
    setAuthState(prev => ({
      ...prev,
      wallet: newBalance
    }));
  }, []);

  // Hàm clear auth
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

  // Khởi tạo auth 
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');
        
        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          const isAdmin = checkAdminRole(userData);
          
          if (!isAdmin) {
            const response = await axios.get('http://127.0.0.1:8000/api/user', {
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
            setAuthState({
              isLoggedIn: true,
              isAdmin: true,
              user: userData,
              token: storedToken,
              wallet: 0,
              isLoading: false,
            });
          }
          return;
        }
      } catch (error) {
        console.error("Lỗi khi khởi tạo auth:", error);
        clearAuth(); 
      }
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
      }));
    };
  
    initializeAuth();
  }, [checkAdminRole, clearAuth]);

  // Hàm login 
  const login = useCallback(async (userData, authToken) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/user', {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      localStorage.setItem('authToken', authToken);
      localStorage.setItem('authUser', JSON.stringify(userData));

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

  // Thêm hàm adminLogin
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
        wallet: 0, 
        isLoading: false,
      });
    } catch (error) {
      console.error("Lỗi khi lưu trạng thái admin:", error);
      throw error;
    }
  }, [checkAdminRole]);

  // Hàm logout 
  const logout = useCallback(async () => {
    try {
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
    checkAdminRole, 
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