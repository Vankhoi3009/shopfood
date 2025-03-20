import { NextRequest, NextResponse } from "next/server";
import connectDB from "@backend/config/db";

export const GET = async () => {
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: "Database connection failed" }, { status: 500 });

    // Lấy danh sách sản phẩm từ database
    const products = await db.collection("test").find().toArray();
    return NextResponse.json(products);
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: "Database connection failed" }, { status: 500 });

    // Nhận dữ liệu từ request
    const { name, image, category, description, price, oldPrice, countInStock } = await req.json();

    // Kiểm tra dữ liệu đầu vào
    if (!name || !category || !description || !price || !countInStock) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Chuyển đổi giá trị số
    const productData = {
      name,
      image,
      category,
      description,
      price: parseFloat(price),
      oldPrice: oldPrice ? parseFloat(oldPrice) : null,
      countInStock: parseInt(countInStock),
      createdAt: new Date(),
    };

    // Thêm sản phẩm vào database
    await db.collection("test").insertOne(productData);

    return NextResponse.json({ message: "Product added successfully", product: productData });
  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
};
