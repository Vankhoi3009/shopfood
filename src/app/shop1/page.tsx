"use client";

import { useEffect, useState } from "react";
import Image from "next/image"; // Dùng Next.js Image để tối ưu ảnh
import Footer from "@/components/footer";
import Header from "@/components/Header";
import "@/styles/Shop1.css";
import "@/styles/Base.css";

// 🟢 Định nghĩa kiểu dữ liệu cho sản phẩm
type Product = {
  _id: string;
  name: string;
  image: string; // Đảm bảo API trả về đúng key này
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu");
        const data: Product[] = await res.json(); // 🟢 Cụ thể kiểu dữ liệu API

        console.log("📌 Dữ liệu sản phẩm:", data); // Debug

        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <main>
      <Header />

      <div className="container">
        <div className="content-wrapper">
          {/* Sidebar */}
          <aside className="sidebar">
            <h3>Bộ lọc</h3>
            <div className="filter-group">
              <h4>Danh mục</h4>
              <label className=" box-label-checkbox-product"><input className="box-input-checkbox-product" type="checkbox" /> Bánh tráng</label>
              <label className=" box-label-checkbox-product"><input className="box-input-checkbox-product" type="checkbox" /> Xoài lắc</label>
              <label className=" box-label-checkbox-product"><input className="box-input-checkbox-product" type="checkbox" /> Gà rán</label>
            </div>
            <div className="filter-group">
              <h4>Tìm kiếm</h4>
              <input type="text" placeholder="Nhập tên sản phẩm..." />
              <button className="btn btn-search-sidebar-product">Tìm kiếm</button>
            </div>
          </aside>

          {/* Danh sách sản phẩm */}
          <section className="product-list" id="product-list">
            {loading ? (
              <p>Đang tải sản phẩm...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : products.length === 0 ? (
              <p>Không có sản phẩm nào.</p>
            ) : (
              products.map((product) => {
                const imageUrl = product.image
                  ? `/api/images/${product.image}`
                  : "/images/default-product.jpg"; // Ảnh mặc định

                return (
                  <div key={product._id} className="product">
                    {/* ✅ Sử dụng next/image để tối ưu ảnh */}
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      width={300}
                      height={300}
                      loading="lazy"
                      className="product-image"
                    />
                    <h3>{product.name}</h3>
                  </div>
                );
              })
            )}
          </section>
        </div>

        {/* Nút Xem thêm */}
        <button className="btn-load-more" id="load-more">
          Xem thêm
        </button>
      </div>

      <Footer />
    </main>
  );
}
