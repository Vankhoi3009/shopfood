import { NextResponse } from "next/server";
import connectDB from "@backend/config/db";
import Category from "@backend/models/Category"; // Import model

export const GET = async () => {
  try {
    await connectDB(); // Kết nối DB qua Mongoose

    const categories = await Category.find(); // Lấy danh mục từ Mongoose Model
    return NextResponse.json(categories);
  } catch (error) {
    console.error("❌ GET Categories Error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
};
