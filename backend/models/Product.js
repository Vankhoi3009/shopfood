import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Tên sản phẩm
    image: { type: mongoose.Schema.Types.ObjectId, ref: "Image" }, // Liên kết với ảnh
    category: { type: String, required: true }, // Danh mục sản phẩm
    description: { type: String, required: true }, // Mô tả sản phẩm
    price: { type: Number, required: true }, // Giá hiện tại
    oldPrice: { type: Number, default: null }, // Giá cũ (nếu có)
    countInStock: { type: Number, required: true, default: 0 }, // Số lượng tồn kho
    createdAt: { type: Date, default: Date.now }, // Ngày tạo
  },
  { collection: "test" } // Đặt tên collection trong MongoDB
);

export default mongoose.model("test", ProductSchema);
