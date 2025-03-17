import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  filename: { type: String, required: true }, // Tên file ảnh
  url: { type: String, required: true }, // Đường dẫn ảnh (có thể từ Firebase)
});

const Image = mongoose.models.Image || mongoose.model("Image", ImageSchema);
export default Image;
