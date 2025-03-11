"use client"; // Chỉ định rằng đây là component chạy trên client-side

import { useEffect, useState } from "react";

export default function BannerSlider() {
  const [index, setIndex] = useState(0);
  const slides = ["/img/banner.jpg", "/img/banner2.jpg"]; // Danh sách ảnh banner

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, [slides.length]);

  return (
    <section className="banner">
      {slides.map((src, i) => (
        <div key={i} className={`slide ${i === index ? "active" : "hidden"}`}>
          <img src={src} alt={`Banner ${i + 1}`} />
          <div className="banner-text">
            <h1>{i === 0 ? "Chào mừng đến với Ăn Vặt 247" : "Hương vị truyền thống, chất lượng hàng đầu"}</h1>
            <a href="#contact" className="btn">
              Xem ngay
            </a>
          </div>
        </div>
      ))}
      <style jsx>{`
        .banner {
          position: relative;
          overflow: hidden;
        }
        .slide {
          display: none;
          position: absolute;
          width: 100%;
        }
        .active {
          display: block;
        }
        .hidden {
          display: none;
        }
      `}</style>
    </section>
  );
}
