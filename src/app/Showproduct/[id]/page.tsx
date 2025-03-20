"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Footer from "@/components/footer";
import Header from "@/components/Header";
import Link from "next/link";
import "@/styles/Shop1.css";
import "@/styles/Base.css";
import "@/styles/ProductDetail.css";

type ProductDetail = {
  _id: string;
  name: string;
  image: string;
  countInStock: number;
};
export default function ProductDetail() {
  const pathname = usePathname();
  const productId = pathname.split("/").pop();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductDetail() {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu sản phẩm");
        const data = await res.json();

        console.log("📌 Chi tiết sản phẩm:", data); // Debug
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    }

    fetchProductDetail();
  }, [productId]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    // Thêm sản phẩm vào giỏ hàng (có thể thêm logic xử lý ở đây)
    console.log(`Đã thêm ${quantity} sản phẩm ${product.name} vào giỏ hàng`);
    alert(`Đã thêm ${quantity} sản phẩm ${product.name} vào giỏ hàng`);
  };

  return (
    <main>
      <Header />

      <div className="container">
        <div className="breadcrumb">
          <Link href="/">Trang chủ</Link> &gt; <Link href="/Shop1">Sản phẩm</Link> &gt; {product?.name || "Chi tiết sản phẩm"}
        </div>

        {loading ? (
          <div className="loading-container">
            <p>Đang tải thông tin sản phẩm...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <Link href="/Shop1" className="btn btn-back">
              Quay lại danh sách sản phẩm
            </Link>
          </div>
        ) : product ? (
          <div className="product-detail-wrapper">
            <div className="product-detail-image">
              <Image
                src={product.image ? `/api/images/${product.image}` : "/images/default-product.jpg"}
                alt={product.name}
                width={500}
                height={500}
                quality={90}
                className="product-image-detail"
              />
            </div>

            <div className="product-detail-info">
              <h1 className="product-detail-title">{product.name}</h1>


              

              

              
              <div className="product-detail-actions">
                <div className="quantity-selector">
                  <label htmlFor="quantity">Số lượng:</label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={product.countInStock || 1}
                    value={quantity}
                    onChange={handleQuantityChange}
                    disabled={product.countInStock <= 0}
                  />
                </div>
                
                <button 
                  className="btn-add-to-cart"
                  onClick={handleAddToCart}
                  disabled={product.countInStock <= 0}
                >
                  {product.countInStock > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="not-found-container">
            <p>Không tìm thấy sản phẩm</p>
            <Link href="/Shop1" className="btn btn-back">
              Quay lại danh sách sản phẩm
            </Link>
          </div>
        )}

        {product && (
          <div className="related-products">
            <h2>Sản phẩm liên quan</h2>
            <p>Tính năng đang phát triển...</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
