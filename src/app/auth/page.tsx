"use client";
// import Footertt from "@/components/footer";
// import Headertt from "@/components/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin ? { email, password } : { name, email, password };

    console.log("📡 Fetching:", endpoint);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      let data;
      try {
        data = await res.json();
      } catch (error) {
        console.error("❌ Lỗi parse JSON:", error);
        alert("Lỗi server, vui lòng thử lại!");
        return;
      }

      console.log("📥 Response:", data);

      if (res.ok) {
        alert(isLogin ? "Đăng nhập thành công!" : "Đăng ký thành công!");

        if (isLogin) {
          if (!data.token) {
            alert("Lỗi: Không có token!");
            return;
          }
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);

          console.log("🛠 Role:", data.role);
          if (data.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/");
          }
        } else {
          setIsLogin(true);
        }
      } else {
        alert(data.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi gọi API:", error);
      alert("Lỗi kết nối, vui lòng thử lại!");
    }
  };

  return (
    <div className="container">
      <h2>{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>
      <form className="form-login" onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Họ và tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? "Đăng nhập" : "Đăng ký"}</button>
      </form>
      <p className=" box-btn-login">
        <button className=" btn-login-login" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Chuyển sang Đăng ký" : "Chuyển sang Đăng nhập"}
        </button>
        {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
      </p>
    </div>
  );
}
