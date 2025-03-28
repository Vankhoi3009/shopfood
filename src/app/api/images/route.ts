import { NextResponse } from "next/server";
import connectDB from "@backend/config/db";
import { Db, MongoClient } from "mongodb";
import mongoose from "mongoose";

export const GET = async () => {
  try {
    // Kết nối MongoDB
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
      console.error("❌ MongoDB connection failed");
      return NextResponse.json({ error: "MongoDB connection failed" }, { status: 500 });
    }

    // Lấy database từ Mongoose
    const client = mongoose.connection.getClient() as unknown as MongoClient;
    const dbName = mongoose.connection.db?.databaseName || mongoose.connection.name || "test";
    const db = client.db(dbName) as Db;

    // Lấy danh sách file từ GridFS
    const files = await db.collection("uploads.files").find({}).toArray();

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No images found" }, { status: 404 });
    }

    // Tạo danh sách ảnh
    const images = files.map(file => ({
      filename: file.filename.normalize("NFC"), // Chuẩn hóa Unicode
      contentType: file.metadata?.contentType || "image/jpeg",
    }));

    return NextResponse.json(images);
  } catch (error) {
    console.error("❌ Error fetching images:", error);
    return NextResponse.json({
      error: "Failed to fetch images",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
};
