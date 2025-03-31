"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    alert("Đăng xuất thành công!");
    router.refresh();
  };

  return (
    <header>
      <div className="logo">
        <Link href="/">Ăn Vặt 247</Link>
      </div>

      {/* Icon menu mobile */}
      <div className="mobile-menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* Menu chính */}
      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <ul>
          <li><Link href="/" onClick={() => setMenuOpen(false)}>Trang Chủ</Link></li>
          <li><Link href="/shop1" onClick={() => setMenuOpen(false)}>Đồ ăn vặt</Link></li>
          <li><Link href="/#best-sellers" onClick={() => setMenuOpen(false)}>Đồ ăn đêm</Link></li>
          <li><Link href="/#best-sellers" onClick={() => setMenuOpen(false)}>Đồ uống</Link></li>
          <li><Link href="/#best-sellers" onClick={() => setMenuOpen(false)}>Tin tức</Link></li>
          <li><Link href="/#contact" onClick={() => setMenuOpen(false)}>Liên hệ</Link></li>
        </ul>
      </nav>

      {/* Tài khoản + Giỏ hàng */}
      <div className="account-cart">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
        ) : (
          <Link href="/auth">Đăng nhập</Link>
        )}
        <Link href="#">
          <i className="fa fa-shopping-cart" style={{ fontSize: "24px" }}></i>
        </Link>
      </div>

      {/* Overlay khi menu mobile mở */}
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}

      <style jsx>{`
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: #FF4500;
          color: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        .logo {
          font-size: 22px;
          font-weight: bold;
        }
        .mobile-menu-icon {
          display: none;
          font-size: 30px;
          cursor: pointer;
        }
        .nav-links {
          display: flex;
        }
        .nav-links ul {
          display: flex;
          gap: 20px;
        }
        .nav-links ul li {
          list-style: none;
        }
        .nav-links ul li a {
          color: white;
          text-decoration: none;
          font-weight: bold;
          padding: 10px 15px;
          transition: background 0.3s, transform 0.2s;
          border-radius: 5px;
        }
        .nav-links ul li a:hover {
          background: #FF5722;
          transform: scale(1.05);
        }
        .account-cart {
          display: flex;
          gap: 15px;
          align-items: center;
        }
        .logout-btn {
          background: red;
          color: white;
          padding: 8px 12px;
          border: none;
          cursor: pointer;
          border-radius: 5px;
          font-weight: bold;
        }
        
        /* Overlay khi menu mobile mở */
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          z-index: 5;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .mobile-menu-icon {
            display: block;
          }
          .nav-links {
            position: fixed;
            top: 0;
            left: -100%;
            width: 80%;
            height: 100vh;
            background: #E64A19;
            color: white;
            flex-direction: column;
            padding-top: 60px;
            transition: left 0.3s ease-in-out;
            z-index: 1000;
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
          }
          .nav-links.open {
            left: 0;
          }
          .nav-links ul {
            flex-direction: column;
            padding: 20px;
            gap: 20px;
          }
          .nav-links ul li a {
            font-size: 18px;
            color: white;
            font-weight: bold;
            padding: 12px 0;
          }
          .nav-links ul li a:hover {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 5px;
          }
        }
      `}</style>
    </header>
  );
}
