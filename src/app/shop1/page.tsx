"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/footer";
import "@/styles/Shop1.css";
import "@/styles/Base.css";

export default function Home() {
  const [products, setProducts] = useState([]);

  // Gọi API để lấy danh sách sản phẩm
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <main>
      <header>
        <div className="logo">
          <a href="#">Ăn Vặt 247</a>
        </div>
        <nav>
          <ul>
            <li><Link href="/">Trang Chủ</Link></li>
            <li><Link href="/Shopproduct1">Đồ ăn vặt</Link></li>
            <li><Link href="/#best-sellers">Đồ ăn đêm</Link></li>
            <li><Link href="/#best-sellers">Đồ uống</Link></li>
            <li><Link href="/#best-sellers">Tin tức</Link></li>
            <li><Link href="/#contact">Liên hệ</Link></li>
          </ul>
        </nav>
        <div className="account-cart">
          <Link href="/auth">Đăng nhập</Link>
          <a href="#"><i className="fa fa-shopping-cart" style={{ fontSize: "24px" }}></i></a>
        </div>
      </header>

      <div className="container">
        <div className="content-wrapper">
          {/* Sidebar */}
          <aside className="sidebar">
            <h3>Bộ lọc</h3>
            <div className="filter-group">
              <h4>Danh mục</h4>
              <label><input type="checkbox" /> Bánh tráng</label>
              <label><input type="checkbox" /> Xoài lắc</label>
              <label><input type="checkbox" /> Gà rán</label>
            </div>
            <div className="filter-group">
              <h4>Tìm kiếm</h4>
              <input type="text" placeholder="Nhập tên sản phẩm..." />
            </div>
          </aside>

          {/* Danh sách sản phẩm */}
          <section className="product-list" id="product-list">
            {products.length === 0 ? (
              <p>Đang tải sản phẩm...</p>
            ) : (
              products.map((product) => (
                <div key={product._id?.toString()} className="product">
                  <img src={product.imageUrl} alt={product.name} />
                  <h3>{product.name}</h3>
                </div>
              ))
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
