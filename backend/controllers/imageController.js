import Image from "../models/Image"; // Kiểm tra đường dẫn đúng chưa

export const getImages = async (req, res) => {
  try {
    const images = await Image.find({});
    res.status(200).json(images);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách ảnh:", error);
    res.status(500).json({ error: "Lỗi server khi lấy ảnh!" });
  }
};
