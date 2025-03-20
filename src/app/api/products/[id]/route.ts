// /app/api/products/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@backend/config/db";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  context: { params?: { id?: string } }
) {
  try {
    const { params } = context;

    // 🛑 Kiểm tra params tồn tại trước khi sử dụng
    if (!params || !params.id) {
      return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
    }

    const id = params.id;

    // 🛑 Kiểm tra ID có hợp lệ không
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    // ✅ Kết nối database
    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    // ✅ Tìm sản phẩm trong MongoDB
    const product = await db.collection("test").findOne({ _id: new ObjectId(id) });

    // 🛑 Kiểm tra nếu sản phẩm không tồn tại
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("❌ Lỗi khi lấy chi tiết sản phẩm:", error);
    return NextResponse.json({ error: "Failed to fetch product details" }, { status: 500 });
  }
}
// Thêm PATCH và DELETE nếu cần
export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: "Database connection failed" }, { status: 500 });

    const id = params.id;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const updates = await req.json();
    const result = await db.collection("test").updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("❌ PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: "Database connection failed" }, { status: 500 });

    const id = params.id;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const result = await db.collection("test").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("❌ DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
};