"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function BannerSlider() {
  const [index, setIndex] = useState(0);
  const slides = ["/image/banner.jpg", "/image/banner55.jpg"];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="banner">
      {slides.map((src, i) => (
        <div key={i} className={`slide ${i === index ? "active" : "hidden"}`}>
          <Image
            src={src}
            alt={`Banner ${i + 1}`}
            width={1920}
            height={800}
            priority={i === 0} // Chỉ ưu tiên tải ảnh đầu tiên
            className="banner-image"
          />
          <div className="banner-text">
            <h1>{i === 0 ? "Chào mừng đến với Ăn Vặt 247" : "Hương vị truyền thống, chất lượng hàng đầu"}</h1>
            <a href="#contact" className="btn">Xem ngay</a>
          </div>
        </div>
      ))}
      <style jsx>{`
        .banner {
          position: relative;
          width: 100%;
          min-height: 400px;
        }
        @media (min-width: 768px) { .banner { min-height: 500px; } }
        @media (min-width: 1024px) { .banner { min-height: 600px; } }
        .slide {
          display: none;
          position: absolute;
          width: 100%;
          height: 100%;
        }
        .active { display: block; }
        .hidden { display: none; }
        .banner-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .banner-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: white;
          background: rgba(0, 0, 0, 0.4);
          padding: 20px;
          border-radius: 10px;
        }
        .btn {
          display: inline-block;
          padding: 10px 20px;
          background: red;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          transition: background 0.3s;
        }
        .btn:hover { background: darkred; }
      `}</style>
    </section>
  );
}
