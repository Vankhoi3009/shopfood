import User from "../models/User.js";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// API đăng ký tài khoản (có thể tạo Admin)
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email đã tồn tại" });

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Nếu không có role hoặc role không phải "admin", mặc định là "user"
    const userRole = role === "admin" ? "admin" : "user";

    // Tạo user mới
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    // Lưu vào database
    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
