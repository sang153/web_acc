// src/components/Header.jsx
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // Đảm bảo bạn có file CSS này hoặc style theo cách khác

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const isAdmin = user?.VaiTro === 1;
  const navigate = useNavigate();

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
         navigate('/'); // Chuyển về trang chủ
     } else {
         console.error("Hàm logout không được cung cấp bởi AuthContext");
     }
     setIsMobileMenuOpen(false); // Đóng menu mobile sau khi logout
  }

  // Hàm xử lý khi nhấn vào link trên mobile menu để đóng menu lại
  const handleMobileLinkClick = () => {
      setIsMobileMenuOpen(false);
  }

  return (
    // Thêm class 'mobile-menu-active' khi menu mobile mở để có thể style riêng
    <header className={`app-header ${isMobileMenuOpen ? 'mobile-menu-active' : ''}`}>
      <nav className="main-nav">
        <div className="logo">
          <Link to="/">SHOPACCRIOT.COM</Link>
        </div>

        {/* Nút bật/tắt menu mobile */}
        <button className="mobile-menu-icon" onClick={toggleMobileMenu} aria-label="Mở menu" aria-expanded={isMobileMenuOpen}>
          ☰
        </button>

        {/* Container chứa các link điều hướng, xử lý hiển thị mobile */}
        <div className={`nav-links-container ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-links">
            {/* Nút đóng menu trên mobile */}
            <li className="mobile-close-item">
                <button className="mobile-close-icon" onClick={toggleMobileMenu} aria-label="Đóng menu">×</button>
            </li>

            {/* Các link chính */}
            <li><Link to="/" onClick={handleMobileLinkClick}>TRANG CHỦ</Link></li>
            <li><Link to="/accounts" onClick={handleMobileLinkClick}>MUA ACC</Link></li>

            {/* ===>>> THÊM LINK NẠP TIỀN (CHỈ HIỂN THỊ KHI ĐÃ LOGIN) - MOBILE <<<=== */}
            {isLoggedIn && (
              <li className="mobile-only-nav-item"> 
                <Link to="/nap-tien" onClick={handleMobileLinkClick}>NẠP TIỀN</Link>
              </li>
            )}
            {/* ===================================================================== */}


            {/* Link Quản lý chỉ hiển thị cho Admin đã login */}
            {isLoggedIn && isAdmin && (
              <li><Link to="/admin/quan-ly-acc" onClick={handleMobileLinkClick}>QUẢN LÝ ACC</Link></li>
            )}

            {/* Các link Đăng nhập/Đăng ký/Đăng xuất hiển thị trên Mobile */}
            {isLoggedIn ? (
              <>
                {/* Có thể thêm link profile ở đây nếu muốn */}
                {/* <li><Link to="/profile" onClick={handleMobileLinkClick}>Tài khoản ({user?.HoTen})</Link></li> */}
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

        {/* Các link xác thực chỉ hiển thị trên Desktop */}
        <div className="auth-links desktop-only-auth">
          {isLoggedIn ? (
            <>
              {/* ===>>> THÊM LINK NẠP TIỀN (CHỈ HIỂN THỊ KHI ĐÃ LOGIN) - DESKTOP <<<=== */}
              <Link to="/nap-tien" className="auth-link-item">NẠP TIỀN</Link>
              {/* ======================================================================= */}

              {/* Có thể hiển thị tên user nếu muốn */}
              {/* <span style={{ marginRight: '15px', color: '#ddd' }}>Chào, {user?.HoTen}!</span> */}

              <button onClick={handleLogout} className="logout-button">Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-link-item">Đăng nhập</Link>
              <Link to="/register" className="auth-link-item">Đăng ký</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;

/* --- CSS gợi ý cho nút logout và link (thêm vào Header.css) --- */
/*
.logout-button, .auth-link-item {
  color: white;
  text-decoration: none;
  margin-left: 15px;
  padding: 8px 12px;
  border: 1px solid white;
  border-radius: 4px;
  transition: background-color 0.2s ease, color 0.2s ease;
  background-color: transparent;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
}

.logout-button:hover, .auth-link-item:hover {
    background-color: white;
    color: #333;
}

// CSS để ẩn/hiện link theo màn hình (ví dụ)
.mobile-only-auth { display: none; } // Mặc định ẩn trên desktop
.desktop-only-auth { display: flex; align-items: center; } // Mặc định hiện trên desktop

@media (max-width: 768px) {
  .mobile-only-auth { display: block; } // Hiện trên mobile
  .desktop-only-auth { display: none; } // Ẩn trên mobile
  // Cần thêm các style khác cho menu mobile hoạt động đúng
}
*/