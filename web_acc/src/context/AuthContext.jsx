import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

// Tạo context với giá trị mặc định
const AuthContext = createContext({
  isLoggedIn: false,
  isAdmin: false,
  user: null,
  token: null,
  isLoading: true,
  login: () => {},
  adminLogin: () => {},
  logout: () => {},
  checkAdminRole: () => false,
});

// Hook tùy chỉnh để sử dụng AuthContext
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
    isLoading: true,
  });

  // Hàm kiểm tra vai trò admin
  const checkAdminRole = useCallback((userData) => {
    return userData?.VaiTro === 1; // Chỉ kiểm tra VaiTro
  }, []);

  // Khởi tạo trạng thái auth từ localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');
        
        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          const isAdmin = checkAdminRole(userData);
          
          setAuthState({
            isLoggedIn: true,
            isAdmin,
            user: userData,
            token: storedToken,
            isLoading: false,
          });
          return;
        }
      } catch (error) {
        console.error("Lỗi khi khởi tạo auth:", error);
      }
      
      // Nếu không có thông tin đăng nhập hoặc có lỗi
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
      }));
    };

    initializeAuth();
  }, [checkAdminRole]);

  // Hàm clear thông tin đăng nhập
  const clearAuth = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setAuthState({
      isLoggedIn: false,
      isAdmin: false,
      user: null,
      token: null,
      isLoading: false,
    });
  }, []);

  // Hàm đăng nhập thông thường
  const login = useCallback((userData, authToken) => {
    try {
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('authUser', JSON.stringify(userData));
      
      setAuthState({
        isLoggedIn: true,
        isAdmin: checkAdminRole(userData),
        user: userData,
        token: authToken,
        isLoading: false,
      });
    } catch (error) {
      console.error("Lỗi khi lưu trạng thái đăng nhập:", error);
      throw error;
    }
  }, [checkAdminRole]);

  // Hàm đăng nhập admin
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
        isLoading: false,
      });
    } catch (error) {
      console.error("Lỗi khi lưu trạng thái admin:", error);
      throw error;
    }
  }, [checkAdminRole]);

  // Hàm đăng xuất
  const logout = useCallback(async () => {
    try {
      // Gọi API logout nếu cần
      // await api.post('/auth/logout');
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  // Giá trị context sẽ cung cấp
  const contextValue = {
    ...authState,
    login,
    adminLogin,
    logout,
    checkAdminRole,
  };

  // Hiển thị loading khi đang khởi tạo
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