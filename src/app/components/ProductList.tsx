"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // 🟢 Thay vì useRouter()

interface Product {
  _id: string;
  name: string;
  image?: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const pathname = usePathname(); // 🟢 Lấy đường dẫn trang hiện tại
  const isAdmin = pathname.startsWith("/admin"); // 🟢 Kiểm tra nếu là trang admin

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data));
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

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-lg font-semibold">Danh sách sản phẩm</h3>
      <ul className="mt-2 space-y-2">
        {products.length === 0 ? (
          <p>Không có sản phẩm nào.</p>
        ) : (
          products.map((product) => (
            <li key={product._id} className="p-2 border rounded-md flex justify-between items-center">
              <div className="flex items-center gap-4">
                {product.image && (
                  <Image
                    src={`/api/images?filename=${encodeURIComponent(product.image)}`}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="object-cover rounded"
                    priority 
                  />

                )}
                <span>{product.name}</span>
              </div>

              {/* Chỉ hiển thị nút xóa nếu là admin */}
              {isAdmin && (
                <button
                  className="bg-red-500 btn-delete-product text-white px-3 py-1 rounded hover:bg-red-700"
                  onClick={() => handleDelete(product._id)}
                >
                  Xóa
                </button>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}