"use client";
import { useState, useEffect } from "react";
import { Request, Response } from "express";

interface Image {
  _id: string;
  filename: string;
}
export const getImages = async (req: Request, res: Response) => {
  try {
    res.json({ message: "API images đang hoạt động!" }); // Sử dụng `res.json()`
  } catch (error) {
    console.error("Lỗi khi lấy ảnh:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

export default function AddProduct() {
  const [name, setName] = useState("");
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    fetch("/api/images")
      .then((res) => res.json())
      .then((data: Image[]) => setImages(data));
  }, []);

  const handleAddProduct = async () => {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, image: selectedImage }),
    });
    alert("Sản phẩm đã được thêm!");
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-lg font-semibold">Thêm sản phẩm</h3>
      <input
        type="text"
        placeholder="Tên sản phẩm"
        className="border p-2 w-full"
        onChange={(e) => setName(e.target.value)}
      />
      <select className="border p-2 w-full mt-2" onChange={(e) => setSelectedImage(e.target.value)}>
        <option value="">Chọn ảnh</option>
        {images.map((img: Image) => (
          <option key={img._id} value={img.filename}>
            {img.filename}
          </option>
        ))}
      </select>
      <button onClick={handleAddProduct} className="mt-2 p-2 bg-green-500 text-white rounded">
        Thêm
      </button>
    </div>
  );
}
