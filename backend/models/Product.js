import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: mongoose.Schema.Types.ObjectId, ref: "Image" }, // Liên kết với ảnh
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "test" }
);

export default mongoose.model("test", ProductSchema);
