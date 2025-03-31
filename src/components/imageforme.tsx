import Image from "next/image";

const images = [
  { src: "/image/product1.jpg", social: "instagram" },
  { src: "/image/product2.jpg", social: "instagram" },
  { src: "/image/product3.jpg", social: "instagram" },
  { src: "/image/produc4.jpg", social: "instagram" },
  { src: "/image/product5.jpg", social: "twitter" },
  { src: "/image/product6.jpg", social: "facebook" },
  { src: "/image/product7.jpg", social: "facebook" },
  { src: "/image/product8.jpg", social: "facebook" },
];

const ShareMoments = () => {
  return (
    <section className="ss-img-moment-home py-10 text-center bg-gray-100">
      <h2 className="text-3xl font-bold text-gray-800">Chia sẻ khoảnh khắc của bạn</h2>
      <p className="text-orange-600 mt-2 max-w-xl mx-auto px-4">
        Hãy lan tỏa những khoảnh khắc truyền cảm hứng của bạn với Ăn vặt 247
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6 max-w-6xl mx-auto">
        {images.map((image, index) => (
          <div key={index} className="relative rounded-lg overflow-hidden shadow-lg">
            <Image 
              src={image.src} 
              alt="Moment" 
              width={300} 
              height={200} 
              className="w-full h-auto object-cover"
            />
            <span className="absolute bottom-2 left-2 bg-white p-1 rounded-full shadow">
              {image.social === "instagram" && <span>📸</span>}
              {image.social === "twitter" && <span>🐦</span>}
              {image.social === "facebook" && <span>📘</span>}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShareMoments;
