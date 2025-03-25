import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 
  "mongodb+srv://UresDB:khoi12345@cluster0.npwrc.mongodb.net/";

const connectDB = async () => {
  try {
    // Sử dụng cấu hình kết nối rõ ràng
    const connection = await mongoose.connect(MONGO_URI, {
      // Tắt các cảnh báo không cần thiết
      autoIndex: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Sử dụng IPv4
    });

    console.log("✅ MongoDB Connected Successfully!");
    return connection.connection.db;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;