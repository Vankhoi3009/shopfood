"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ✅ Định nghĩa kiểu dữ liệu cho user
interface User {
  name: string;
  email?: string;
}

const AccountCart = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("/api/auth/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data: User) => {
          if (data.name) {
            setUser(data);
          } else {
            setUser(null);
          }
        })
        .catch(() => setUser(null));
    }
  }, []);

  return (
    <div className="account-cart flex items-center gap-4">
      {user ? (
        <span className="text-lg font-bold">👋 Xin chào, {user.name}!</span>
      ) : (
        <Link href="/auth" className="text-blue-500 hover:underline">
          Đăng nhập
        </Link>
      )}
      <a href="#" className="text-gray-700">
        <i className="fa fa-shopping-cart" style={{ fontSize: "24px" }}></i>
      </a>
    </div>
  );
};

export default AccountCart;
