"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import BannerSlider from "@/components/home";
import ContactForm from "@/components/contactform";
import Footer from "@/components/footer";
import Header from "@/components/Header";
import ShareMoments from "@/components/imageforme";
import "@/styles/Home.css";
import "@/styles/Base.css";

// 🟢 Định nghĩa kiểu dữ liệu sản phẩm
interface Product {
  _id: string;
  name: string;
  image: string;
}

// 🟢 Định nghĩa kiểu dữ liệu User
interface User {
  name: string;
  email?: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("/api/auth/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data: User) => {
          if (data.name) {
            setUser(data);
          } else {
            setUser(null);
          }
        })
        .catch(() => setUser(null));
    }
  }, []);

  // 🟢 Lấy sản phẩm từ API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Lỗi khi lấy sản phẩm");
        const data: Product[] = await res.json();

        setProducts(data.slice(0, 4)); // 🟢 Lấy 4 sản phẩm đầu tiên (Sản phẩm nổi bật)
        setFavoriteProducts(data.slice(-4)); // 🟢 Lấy 4 sản phẩm cuối cùng (Sản phẩm được yêu thích nhất)
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
      <BannerSlider />

      <section id="about">
        <h2>Giới thiệu</h2>
        <p>Ăn Vặt 247 chuyên cung cấp các món ăn vặt ngon, chất lượng.</p>
        <img src="img/gt.jpg" alt="" />
      </section>

      {/* 🟢 Sản phẩm nổi bật */}
      <section className="product-section">
        <h2>Sản phẩm nổi bật</h2>
        <div className="product-list-home">
          {loading ? (
            <p>Đang tải sản phẩm...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            products.map((product) => (
              <Link key={product._id} href={`/Showproduct/${product._id}`} className="product-home">
                <div className="product-card">
                  <Image
                    src={`/api/images/${product.image}`}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="product-image"
                  />
                  <h3>{product.name}</h3>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* 🟢 Sản phẩm được yêu thích nhất */}
      <section className="product-section">
        <h2>Sản phẩm được yêu thích nhất</h2>
        <div className="product-list-home">
          {loading ? (
            <p>Đang tải sản phẩm...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            favoriteProducts.map((product) => (
              <Link key={product._id} href={`/Showproduct/${product._id}`} className="product-home">
                <div className="product-card">
                  <Image
                    src={`/api/images/${product.image}`}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="product-image"
                  />
                  <h3>{product.name}</h3>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      <ContactForm />
      <ShareMoments />
      <Footer />
    </main>
  );
}
