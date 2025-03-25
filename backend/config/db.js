import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Load biến môi trường ngay khi file được chạy
dotenv.config();

console.log("🔍 MONGO_URI from .env:", process.env.MONGO_URI);

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  if (!MONGO_URI) {
    console.error("❌ MONGO_URI không tồn tại! Kiểm tra lại file .env.");
    process.exit(1);
  }

  if (mongoose.connection.readyState >= 1) {
    console.log("✅ MongoDB đã kết nối trước đó!");
    return mongoose.connection.db;
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Kết nối MongoDB thành công!");

    const db = mongoose.connection.db;
    if (!db) {
      console.error("❌ Lỗi: Database không thể kết nối.");
      return null;
    }

    // Tạo admin nếu chưa có
    const adminEmail = "admin@shopfood.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);
      const newAdmin = new User({
        name: "Admin ShopFood",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });

      await newAdmin.save();
      console.log("🔹 Tạo tài khoản admin mặc định!");
    } else {
      console.log("🔹 Admin mặc định đã tồn tại!");
    }

    return db;
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
