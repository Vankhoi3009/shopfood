import { NextResponse } from "next/server";
import connectDB from "@backend/config/db";
import Product from "@backend/models/Product";

export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    await connectDB();

    const { id } = params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });
    }

    return NextResponse.json({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    console.error("Lỗi xóa sản phẩm:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
};

// 🟢 API cập nhật sản phẩm
export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    const { id } = params;
    const body = await req.json();

    console.log("🔍 Dữ liệu nhận được:", body); // Debug log

    if (!body.name || !body.image) {
      return NextResponse.json({ error: "Thiếu dữ liệu sản phẩm!" }, { status: 400 });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name: body.name, image: body.image },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Không tìm thấy sản phẩm!" }, { status: 404 });
    }

    return NextResponse.json({ message: "Cập nhật thành công!", product: updatedProduct });
  } catch (error) {
    console.error("❌ Lỗi cập nhật sản phẩm:", error);
    return NextResponse.json({ error: "Lỗi server!" }, { status: 500 });
  }
};