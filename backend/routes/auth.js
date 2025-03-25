import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { check, validationResult } from "express-validator";

// Middleware kiểm tra dữ liệu đầu vào
export const validateRegister = [
  check("name", "Tên không được để trống").notEmpty(),
  check("email", "Email không hợp lệ").isEmail(),
  check("password", "Mật khẩu phải ít nhất 6 ký tự").isLength({ min: 6 }),
];

export const register = async (req, res) => {
  try {
    // Kiểm tra lỗi validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email đã tồn tại" });

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Xác định role, mặc định là "user" nếu không có hoặc không hợp lệ
    const userRole = role === "admin" ? "admin" : "user";

    // Tạo user mới
    const newUser = new User({ name, email, password: hashedPassword, role: userRole });
    await newUser.save();

    // Xóa password trước khi trả về dữ liệu user
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ message: "Đăng ký thành công", user: userResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
