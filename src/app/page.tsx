"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
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
export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        <Image 
          src="/image/gt.jpg" 
          alt="Mô tả ảnh"
          width={500} 
          height={300} 
          style={{ width: "50%", height: "auto" }}
        />

      </section>

      {/* 🟢 Sản phẩm nổi bật */}
      <section id="new-products">
        <h2>Sản phẩm nổi bật</h2>
        <div className="product-list-home">
          {loading ? (
            <p>Đang tải sản phẩm...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            products.map((product) => (
              <Link key={product._id} href={`/Showproduct/${product._id}`} className="product-home">
                <Image
                  src={`/api/images/${product.image}`}
                  alt={product.name}
                  width={200}
                  height={200}
                  priority 
                />
                <h3>{product.name}</h3>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* 🟢 Sản phẩm được yêu thích nhất */}
      <section id="best-sellers">
        <h2>Sản phẩm được yêu thích nhất</h2>
        <div className="product-list-home">
          {loading ? (
            <p>Đang tải sản phẩm...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            favoriteProducts.map((product) => (
              <Link key={product._id} href={`/Showproduct/${product._id}`} className="product-home">
                <Image
                  src={`/api/images/${product.image}`}
                  alt={product.name}
                  width={200}
                  height={200}
                  priority 
                />
                <h3>{product.name}</h3>
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
