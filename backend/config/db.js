import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://UresDB:khoi12345@cluster0.npwrc.mongodb.net/test?retryWrites=true&w=majority";


const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("✅ MongoDB already connected!");
    return mongoose.connection.db;
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected Successfully!");

    const db = mongoose.connection.db;
    if (!db) {
      console.error("❌ Database connection failed.");
      return null;
    }
    const adminEmail = "admin@shopfood.com";
    const adminPassword = "Admin@123";
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
  }
};

export default connectDB;