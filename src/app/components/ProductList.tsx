"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  image?: string;
}

interface Image {
  _id: string;
  filename: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data));

    fetch("/api/images")
      .then((res) => res.json())
      .then((data: Image[]) => setImages(data));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error("Xóa sản phẩm thất bại");

      setProducts((prev) => prev.filter((product) => product._id !== id));
      alert("Sản phẩm đã được xóa!");
    } catch (error) {
      console.error(error);
      alert("Lỗi khi xóa sản phẩm!");
    }
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
  };

  const handleUpdateProduct = async () => {
    if (!editProduct) return;

    try {
      const res = await fetch(`/api/products/${editProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProduct),
      });

      if (!res.ok) throw new Error("Cập nhật sản phẩm thất bại");

      setProducts((prev) =>
        prev.map((p) => (p._id === editProduct._id ? editProduct : p))
      );
      setEditProduct(null);
      alert("Sản phẩm đã được cập nhật!");
    } catch (error) {
      console.error(error);
      alert("Lỗi khi cập nhật sản phẩm!");
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-lg font-semibold">Danh sách sản phẩm</h3>
      <ul className="mt-2 space-y-2">
        {products.length === 0 ? (
          <p>Không có sản phẩm nào.</p>
        ) : (
          products.map((product) => (
            <li
              key={product._id}
              className="p-2 border rounded-md flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                {product.image && (
                  <img
                    src={`/api/images/${product.image}`}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <span>{product.name}</span>
              </div>

              {isAdmin && (
                <div className="flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                    onClick={() => handleEdit(product)}
                  >
                    Sửa
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => handleDelete(product._id)}
                  >
                    Xóa
                  </button>
                </div>
              )}
            </li>
          ))
        )}
      </ul>

      {editProduct && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-100">
          <h3 className="text-lg font-semibold">Chỉnh sửa sản phẩm</h3>
          <input
            type="text"
            className="border p-2 w-full mt-2"
            value={editProduct.name}
            onChange={(e) =>
              setEditProduct((prev) =>
                prev ? { ...prev, name: e.target.value } : prev
              )
            }
          />
          <select
            className="border p-2 w-full mt-2"
            value={editProduct.image || ""}
            onChange={(e) =>
              setEditProduct((prev) =>
                prev ? { ...prev, image: e.target.value } : prev
              )
            }
          >
            <option value="">Chọn ảnh</option>
            {images.map((img) => (
              <option key={img._id} value={img.filename}>
                {img.filename}
              </option>
            ))}
          </select>
          <button
            className="mt-2 p-2 bg-green-500 text-white rounded"
            onClick={handleUpdateProduct}
          >
            Cập nhật
          </button>
        </div>
      )}
    </div>
  );
}
