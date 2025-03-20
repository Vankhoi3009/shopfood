import mongoose from "mongoose";

// Định nghĩa schema cho danh mục
const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" }, // Mô tả danh mục
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "categories" } // Đặt tên collection trong MongoDB
);

// Xuất model để sử dụng
export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
