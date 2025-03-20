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
  price: number;
  oldPrice?: number;
  discount?: number;
  countInStock: number;
  category: string;
  description: string;
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
            {/* Hình ảnh sản phẩm */}
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

            {/* Thông tin sản phẩm */}
            <div className="product-detail-info">
              <h1 className="product-detail-title">{product.name}</h1>
              <p className="product-category">Danh mục: {product.category}</p>
              <p className="product-description">{product.description}</p>

              {/* Hiển thị giá & khuyến mãi */}
              <div className="product-price">
                {product.oldPrice ? (
                  <>
                    <span className="old-price">{product.oldPrice.toLocaleString()}đ</span>
                    <span className="discount-price">{product.price.toLocaleString()}đ</span>
                    <span className="discount-badge">-{product.discount}%</span>
                  </>
                ) : (
                  <span className="final-price">{product.price.toLocaleString()}đ</span>
                )}
              </div>

              {/* Chọn số lượng */}
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

                {/* Nút thêm vào giỏ hàng */}
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
      </div>

      <Footer />
    </main>
  );
}
