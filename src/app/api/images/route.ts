import { NextResponse } from "next/server";
import connectDB from "@backend/config/db";
import mongoose from "mongoose";

export const GET = async () => {
  try {
    await connectDB(); // Đảm bảo đã kết nối DB

    console.log("📌 MongoDB ReadyState:", mongoose.connection.readyState);

    const db = mongoose.connection.useDb("test");
    const files = await db.collection("uploads.files").find().toArray();

    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
};
