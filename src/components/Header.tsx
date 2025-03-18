"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // 🟢 Kiểm tra token khi load trang
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // 🟢 Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    alert("Đăng xuất thành công!"); // Hiển thị thông báo
    router.push("/auth"); // Chuyển hướng đến trang đăng nhập
  };

  return (
    <header>
      <div className="logo">
        <Link href="/">Ăn Vặt 247</Link>
      </div>
      <nav>
        <ul>
          <li><Link href="/">Trang Chủ</Link></li>
          <li><Link href="/shop1">Đồ ăn vặt</Link></li>
          <li><Link href="/#best-sellers">Đồ ăn đêm</Link></li>
          <li><Link href="/#best-sellers">Đồ uống</Link></li>
          <li><Link href="/#best-sellers">Tin tức</Link></li>
          <li><Link href="/#contact">Liên hệ</Link></li>
        </ul>
      </nav>
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
    </header>
  );
}
