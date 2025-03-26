import { NextResponse } from "next/server";
import connectDB from "@backend/config/db";
import mongoose from "mongoose";

export const GET = async () => {
  try {
    // Kết nối database
    await connectDB();

    // Kiểm tra kết nối MongoDB
    if (mongoose.connection.readyState !== 1) {
      return NextResponse.json({ error: "MongoDB connection failed" }, { status: 500 });
    }

    // Lấy client MongoDB
    const client = mongoose.connection.getClient();
    const dbName = mongoose.connection.db?.databaseName || 'test';
    const db = client.db(dbName);

    // Fetch all files from the uploads.files collection
    const files = await db.collection("uploads.files").find({}).toArray();

    // Return the files as JSON response
    return NextResponse.json(files);
  } catch (error) {
    // Ghi log chi tiết lỗi
    console.error("Error fetching images:", error);
    return NextResponse.json({ 
      error: "Failed to fetch images", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
};