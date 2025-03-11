import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import connectDB from "@backend/config/db";
import User from "@backend/models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "defaultsecret"; // Đảm bảo có giá trị fallback nếu thiếu env

export async function POST(req: NextRequest) {
  try {
    console.log("📌 Kết nối MongoDB...");
    await connectDB();

    const { email, password } = await req.json();
    console.log("📧 Email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ Email không tồn tại!");
      return NextResponse.json({ message: "Email không tồn tại!" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Mật khẩu không đúng!");
      return NextResponse.json({ message: "Mật khẩu không đúng!" }, { status: 400 });
    }

    console.log("🔍 JWT_SECRET:", process.env.JWT_SECRET ? "OK" : "MISSING");
    if (!process.env.JWT_SECRET) {
      console.error("❌ LỖI: Biến môi trường JWT_SECRET chưa được thiết lập!");
      return NextResponse.json({ message: "Lỗi server! (JWT_SECRET missing)" }, { status: 500 });
    }
    console.log("🔓 Tạo token đăng nhập...");
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      jwtSecret, // Sử dụng biến đã khai báo
      { expiresIn: "7d" }
    );

    console.log("✅ Đăng nhập thành công!");
    return NextResponse.json(
      { message: "Đăng nhập thành công!", token, role: user.role },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Lỗi server:", error);
    return NextResponse.json({ 
      message: "Lỗi server!", 
      error: error instanceof Error ? error.message : error 
    }, { status: 500 });
  }
}
