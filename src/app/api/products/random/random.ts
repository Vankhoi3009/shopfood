import { NextResponse } from "next/server";
import connectDB from "@backend/config/db";
import Product from "@backend/models/Product"; // Import model

export const GET = async () => {
  try {
    await connectDB(); // Kết nối MongoDB

    // 🟢 Lấy 4 sản phẩm ngẫu nhiên từ database
    const products = await Product.aggregate([{ $sample: { size: 4 } }]);

    return NextResponse.json(products);
  } catch (error) {
    console.error("❌ GET Random Products Error:", error);
    return NextResponse.json({ error: "Failed to fetch random products" }, { status: 500 });
  }
};
