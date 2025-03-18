"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🟢 Cập nhật formData
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🟢 Xử lý đăng nhập/đăng ký
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin ? { email: formData.email, password: formData.password } : formData;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        alert(isLogin ? "Đăng nhập thành công!" : "Đăng ký thành công!");
        if (isLogin) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);
          router.push(data.role === "admin" ? "/admin" : "/");
        } else {
          setIsLogin(true); // Chuyển về trang đăng nhập
        }
      } else {
        alert(data.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("❌ Lỗi API:", error);
      alert("Lỗi kết nối, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>
      <form className="form-login" onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Họ và tên"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
        </button>
      </form>
      <p className="box-btn-login">
        <button className="btn-login-login" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Chuyển sang Đăng ký" : "Chuyển sang Đăng nhập"}
        </button>
        {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
      </p>
    </div>
  );
}
