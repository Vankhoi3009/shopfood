"use client";
import { useState, useEffect } from "react";

interface Image {
  _id: string;
  filename: string;
}

export default function AddProduct() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(""); // Danh mục sản phẩm
  const [description, setDescription] = useState(""); // Chi tiết sản phẩm
  const [price, setPrice] = useState<number | "">("");
  const [oldPrice, setOldPrice] = useState<number | "">("");
  const [countInStock, setCountInStock] = useState<number | "">("");
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
      body: JSON.stringify({
        name,
        category,
        description,
        price: price !== "" ? parseFloat(price.toString()) : null,
        oldPrice: oldPrice !== "" ? parseFloat(oldPrice.toString()) : null,
        countInStock: countInStock !== "" ? parseInt(countInStock.toString()) : 0,
        image: selectedImage,
      }),
    });
    alert("Sản phẩm đã được thêm!");
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Thêm sản phẩm</h3>

      {/* Tên sản phẩm */}
      <input
        type="text"
        placeholder="Tên sản phẩm"
        className="border p-2 w-full mb-3"
        onChange={(e) => setName(e.target.value)}
      />

      {/* Danh mục sản phẩm */}
      <input
        type="text"
        placeholder="Danh mục sản phẩm (Ví dụ: Bánh tráng, Đồ ăn vặt...)"
        className="border p-2 w-full mb-3"
        onChange={(e) => setCategory(e.target.value)}
      />

      {/* Chi tiết sản phẩm */}
      <textarea
        placeholder="Chi tiết sản phẩm..."
        className="border p-2 w-full mb-3"
        rows={3}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      {/* Giá gốc */}
      <input
        type="number"
        placeholder="Giá gốc (VNĐ)"
        className="border p-2 w-full mb-3"
        onChange={(e) => setOldPrice(e.target.value ? parseFloat(e.target.value) : "")}
      />

      {/* Giá giảm */}
      <input
        type="number"
        placeholder="Giá giảm (VNĐ)"
        className="border p-2 w-full mb-3"
        onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : "")}
      />

      {/* Số lượng tồn kho */}
      <input
        type="number"
        placeholder="Số lượng tồn kho"
        className="border p-2 w-full mb-3"
        onChange={(e) => setCountInStock(e.target.value ? parseInt(e.target.value) : "")}
      />

      {/* Chọn ảnh */}
      <select className="border p-2 w-full mb-3" onChange={(e) => setSelectedImage(e.target.value)}>
        <option value="">Chọn ảnh</option>
        {images.map((img: Image) => (
          <option key={img._id} value={img.filename}>
            {img.filename}
          </option>
        ))}
      </select>

      {/* Nút thêm sản phẩm */}
      <button onClick={handleAddProduct} className="mt-2 p-2 bg-green-500 text-white rounded w-full">
        Thêm sản phẩm
      </button>
    </div>
  );
}
