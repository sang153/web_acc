import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Header.css';
import axios from 'axios';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { 
    isLoggedIn, 
    user, 
    wallet, 
    logout,
    updateWallet
  } = useContext(AuthContext);
  
  const isAdmin = user?.VaiTro === 1;
  const navigate = useNavigate();
  const [isWalletLoading, setIsWalletLoading] = useState(false);
 

  // Hàm lấy số dư ví từ API
  const fetchWalletBalance = async () => {
    if (!isLoggedIn) return;
    
    setIsWalletLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8001/api/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        withCredentials: true
      });
      
      console.log('API Wallet Response:', response.data);
      
      // Cập nhật số dư vào AuthContext
      const walletData = response.data.wallet;
      if (typeof walletData !== 'undefined') {
        updateWallet(walletData);
      } else {
        console.warn('Wallet data not found in response');
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin ví:', error);
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setIsWalletLoading(false);
    }
  };

  // Gọi API khi component mount hoặc khi trạng thái đăng nhập thay đổi
  useEffect(() => {
    let intervalId;
    
    if (isLoggedIn) {
      fetchWalletBalance(); // Gọi ngay lập tức
      intervalId = setInterval(fetchWalletBalance, 30000); // Cập nhật mỗi 30s
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isLoggedIn]);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  // Hàm toggle menu mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Đóng menu khi resize màn hình
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Hàm đóng menu khi click vào link
  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`app-header ${isMobileMenuOpen ? 'mobile-menu-active' : ''}`}>
      <nav className="main-nav">
        {/* Logo */}
        <div className="logo">
          <Link to="/">SHOPACCRIOT.COM</Link>
        </div>

        {/* Nút menu mobile */}
        <button 
          className="mobile-menu-icon" 
          onClick={toggleMobileMenu} 
          aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? '×' : '☰'}
        </button>

        {/* Menu điều hướng */}
        <div className={`nav-links-container ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-links">
            {/* Nút đóng menu trên mobile */}
            <li className="mobile-close-item">
              <button 
                className="mobile-close-icon" 
                onClick={toggleMobileMenu} 
                aria-label="Đóng menu"
              >
                ×
              </button>
            </li>

            {/* Các link chính */}
            <li><Link to="/" onClick={handleMobileLinkClick}>TRANG CHỦ</Link></li>
            <li><Link to="/accounts" onClick={handleMobileLinkClick}>MUA ACC</Link></li>
            
            {/* Link cho người dùng đã đăng nhập */}
            {isLoggedIn && (
              <>
                <li>
                  <Link to="/sell-account" onClick={handleMobileLinkClick}>BÁN ACC</Link>
                </li>
                <li className="mobile-only-nav-item"> 
                  <Link to="/nap-tien" onClick={handleMobileLinkClick}>NẠP TIỀN</Link>
                </li> 
              </>
            )}
            
            {/* Link cho admin */}
            {isLoggedIn && isAdmin && (
              <li><Link to="/admin/quan-ly-acc" onClick={handleMobileLinkClick}>QUẢN LÝ ACC</Link></li>
            )}

            {/* Link đăng nhập/đăng xuất trên mobile */}
            {isLoggedIn ? (
              <li className="mobile-only-auth">
                <button onClick={handleLogout} className="logout-link">ĐĂNG XUẤT</button>
              </li>
            ) : (
              <>
                <li className="mobile-only-auth">
                  <Link to="/login" onClick={handleMobileLinkClick}>ĐĂNG NHẬP</Link>
                </li>
                <li className="mobile-only-auth">
                  <Link to="/register" onClick={handleMobileLinkClick}>ĐĂNG KÝ</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Các link xác thực trên desktop */}
        <div className="auth-links desktop-only-auth">
          {isLoggedIn ? (
            <>
              <Link to="/nap-tien" className="auth-link-item">NẠP TIỀN</Link>
              <Link to="/rut-tien" className="auth-link-item">RÚT TIỀN</Link>
              <button onClick={handleLogout} className="logout-button">ĐĂNG XUẤT</button>
              
              {/* Hiển thị số dư ví */}
              <div className="wallet-display">
                {isWalletLoading ? (
                  <span className="wallet-loading">ĐANG TẢI...</span>
                ) : (
                  <>
                    <span className="wallet-label">SỐ DƯ:</span>
                    <span className="wallet-amount">
                      {wallet.toLocaleString('vi-VN', { 
                        style: 'currency', 
                        currency: 'VND',
                        minimumFractionDigits: 0
                      })}
                    </span>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-link-item">ĐĂNG NHẬP</Link>
              <Link to="/register" className="auth-link-item">ĐĂNG KÝ</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;