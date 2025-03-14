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
