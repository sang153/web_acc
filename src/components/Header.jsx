// src/components/Header.jsx
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom'; // <<< Import Link và useNavigate
import './Header.css';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const isAdmin = user?.VaiTro === 1;
  const navigate = useNavigate(); // <<< Dùng để chuyển hướng sau logout

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
     if (typeof logout === 'function') {
         logout();
         navigate('/'); // <<< Chuyển về trang chủ sau khi logout
     } else {
         console.error("Hàm logout không được cung cấp bởi AuthContext");
     }
     setIsMobileMenuOpen(false);
  }

  // Hàm xử lý khi nhấn vào link trên mobile menu
  const handleMobileLinkClick = () => {
      setIsMobileMenuOpen(false);
  }

  return (
    <header className={`app-header ${isMobileMenuOpen ? 'mobile-menu-active' : ''}`}>
      <nav className="main-nav">
        <div className="logo">
          {/* Thay <a> bằng <Link> */}
          <Link to="/">SHOPACCRIOT.COM</Link>
        </div>

        <button className="mobile-menu-icon" onClick={toggleMobileMenu} aria-label="Mở menu" aria-expanded={isMobileMenuOpen}>
          ☰
        </button>

        <div className={`nav-links-container ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-links">
            <li className="mobile-close-item">
                <button className="mobile-close-icon" onClick={toggleMobileMenu} aria-label="Đóng menu">×</button>
            </li>
            {/* Thay <a> bằng <Link>, thêm onClick={handleMobileLinkClick} */}
            <li><Link to="/" onClick={handleMobileLinkClick}>TRANG CHỦ</Link></li>
            <li><Link to="/accounts" onClick={handleMobileLinkClick}>MUA ACC</Link></li>

            { isLoggedIn && isAdmin && (
              <li><Link to="/admin/quan-ly-acc" onClick={handleMobileLinkClick}>QUẢN LÝ ACC</Link></li>
            )}

            {isLoggedIn ? (
              <>
                {/* <li><Link to="/profile" onClick={handleMobileLinkClick}>Tài khoản ({user?.HoTen})</Link></li> */}
                {/* Logout dùng button hoặc thẻ a với onClick */}
                <li className="mobile-only-auth"><a href="#!" onClick={handleLogout}>Đăng xuất</a></li>
              </>
            ) : (
              <>
                <li className="mobile-only-auth"><Link to="/login" onClick={handleMobileLinkClick}>Đăng nhập</Link></li>
                <li className="mobile-only-auth"><Link to="/register" onClick={handleMobileLinkClick}>Đăng ký</Link></li>
              </>
            )}
          </ul>
        </div>

        <div className="auth-links desktop-only-auth">
          {isLoggedIn ? (
            <>
              {/* <span style={{ marginRight: '15px', color: '#ddd' }}>Chào, {user?.HoTen}!</span> */}
              {/* Nút đăng xuất */}
              <button onClick={handleLogout} className="logout-button">Đăng xuất</button> {/* Style nút này trong CSS nếu cần */}
            </>
          ) : (
            <>
              {/* Thay <a> bằng <Link> */}
              <Link to="/login" className="auth-link-item">Đăng nhập</Link>
              <Link to="/register" className="auth-link-item">Đăng ký</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

// CSS cho nút logout và link auth (thêm vào Header.css nếu muốn)
/*
.logout-button, .auth-link-item {
  color: white;
  text-decoration: none;
  margin-left: 15px;
  padding: 8px 12px;
  border: 1px solid white;
  border-radius: 4px;
  transition: background-color 0.2s ease, color 0.2s ease;
  background-color: transparent; // Cho nút logout
  cursor: pointer; // Cho nút logout
  font-size: inherit; // Cho nút logout
  font-family: inherit; // Cho nút logout
}

.logout-button:hover, .auth-link-item:hover {
    background-color: white;
    color: #333;
}
*/


export default Header;