"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Footer from "@/components/footer";
import Header from "@/components/Header";
import Link from "next/link";
import "@/styles/Shop1.css";
import "@/styles/Base.css";

// 🟢 Định nghĩa kiểu dữ liệu
type Product = {
  _id: string;
  name: string;
  image: string;
  category: string;
};

type Category = {
  _id: string;
  name: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 🟢 Lấy danh sách sản phẩm
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu sản phẩm");
        const data: Product[] = await res.json();
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

  // 🟢 Lấy danh mục sản phẩm từ API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Lỗi khi lấy danh mục");
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh mục");
      }
    }
    fetchCategories();
  }, []);

  // 🟢 Áp dụng bộ lọc
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      const matchesSearch = searchQuery
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <main>
      <Header />

      <div className="container">
        <div className="content-wrapper">
          {/* Sidebar */}
          <aside className="sidebar">
            <h3>Bộ lọc</h3>

            {/* 🟢 Lọc theo danh mục */}
            <div className="filter-group">
              <h4>Danh mục</h4>
              {categories.length === 0 ? (
                <p>Đang tải danh mục...</p>
              ) : (
                categories.map((category) => (
                  <label key={category._id} className="box-label-checkbox-product">
                    <input
                      type="radio"
                      name="category"
                      value={category.name}
                      checked={selectedCategory === category.name}
                      onChange={() => setSelectedCategory(category.name)}
                    />
                    {category.name}
                  </label>
                ))
              )}
              <button className="btn-clear-filter" onClick={() => setSelectedCategory(null)}>
                Xóa lọc
              </button>
            </div>

            {/* 🟢 Tìm kiếm sản phẩm */}
            <div className="filter-group">
              <h4>Tìm kiếm</h4>
              <input
                type="text"
                placeholder="Nhập tên sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-search-sidebar-product">Tìm kiếm</button>
            </div>
          </aside>

          {/* 🟢 Danh sách sản phẩm */}
          <section className="product-list" id="product-list">
            {loading ? (
              <p>Đang tải sản phẩm...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : filteredProducts.length === 0 ? (
              <p>Không có sản phẩm nào phù hợp.</p>
            ) : (
              filteredProducts.map((product) => {
                const imageUrl = product.image
                ? `/api/images?filename=${(product.image)}`
                : "/images/default-product.jpg";

                return (
                  <Link key={product._id} href={`/Showproduct/${product._id}`} className="product">
                    <div className="cursor-pointer">
                      {/* ✅ Sử dụng next/image để tối ưu ảnh */}
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        width={300}
                        height={300}
                        loading="lazy"
                        className="product-image"
                      />

                      <h3 className="text-blue-500 hover:underline">{product.name}</h3>
                    </div>
                  </Link>
                );
              })
            )}
          </section>
        </div>

        {/* 🟢 Nút Xem thêm */}
        <button className="btn-load-more" id="load-more">
          Xem thêm
        </button>
      </div>

      <Footer />
    </main>
  );
}
