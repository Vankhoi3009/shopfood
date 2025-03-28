import { NextResponse } from "next/server";
import connectDB from "@backend/config/db";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    
    if (mongoose.connection.readyState !== 1) {
      return NextResponse.json({ error: "MongoDB connection failed" }, { status: 500 });
    }

    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    // Lấy danh sách file từ GridFS
    const files = await db.collection("uploads.files").find({}).toArray();

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No images found" }, { status: 404 });
    }

    // Tạo danh sách ảnh
    const images = files.map(file => ({
      filename: file.filename,
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
}