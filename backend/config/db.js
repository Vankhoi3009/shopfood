import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "@backend/models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://UresDB:khoi12345@cluster0.npwrc.mongodb.net/";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("✅ MongoDB already connected!");
    return mongoose.connection.db;
  }

  try {
    await mongoose.connect(MONGO_URI); // Loại bỏ các options không cần thiết
    console.log("✅ MongoDB Connected Successfully!");

    const db = mongoose.connection.db;
    if (!db) {
      console.error("❌ Database connection failed.");
      return null;
    }

    // Kiểm tra và tạo tài khoản admin mặc định nếu chưa tồn tại
    const adminEmail = "admin@shopfood.com";
    const adminPassword = "Admin@123"; // Thay đổi nếu cần
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const newAdmin = new User({
        name: "Admin ShopFood",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });

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
