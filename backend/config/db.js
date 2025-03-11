import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "@backend/models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://UresDB:khoi12345@cluster0.npwrc.mongodb.net/", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully!");

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
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;
