"use client";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  image?: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data));
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-lg font-semibold">Danh sách sản phẩm</h3>
      <ul className="mt-2 space-y-2">
        {products.length === 0 ? (
          <p>Không có sản phẩm nào.</p>
        ) : (
          products.map((product: Product) => (
            <li key={product._id} className="p-2 border rounded-md flex justify-between items-center">
              <span>{product.name}</span>
              {product.image && <img src={`/api/images/${product.image}`} alt={product.name} className="w-12 h-12 object-cover rounded" />}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
