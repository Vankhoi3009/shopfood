import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://UresDB:khoi12345@cluster0.npwrc.mongodb.net/";

const connectDB = async () => {
  // Kiểm tra kết nối đã tồn tại chưa
  if (mongoose.connection.readyState >= 1) {
    console.log("✅ MongoDB already connected!");
    return mongoose.connection.db;
  }

  try {
    // Kết nối đến MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected Successfully!");

    const db = mongoose.connection.db;
    if (!db) {
      console.error("❌ Database connection failed.");
      return null;
    }

    // Quy trình tạo tài khoản admin mặc định
    const adminEmail = "admin@shopfood.com";
    const adminPassword = "Admin@123";
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      // Tạo tài khoản admin mới
      const newAdmin = new User({
        name: "Admin ShopFood",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      
      // Lưu tài khoản admin
      await newAdmin.save();
      console.log("🔹 Tài khoản admin mặc định đã được tạo!");
    } else {
      console.log("🔹 Admin mặc định đã tồn tại!");
    }

    return db;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;