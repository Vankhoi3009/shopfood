import Image from "next/image";

const images = [
  { src: "/img/product1.jpg", social: "instagram" },
  { src: "/img/product2.jpg", social: "instagram" },
  { src: "/img/product3.jpg", social: "instagram" },
  { src: "/img/produc4.jpg", social: "instagram" },
  { src: "/img/product5.jpg", social: "twitter" },
  { src: "/img/product6.jpg", social: "facebook" },
  { src: "/img/product7.jpg", social: "facebook" },
  { src: "/img/product8.jpg", social: "facebook" },
];

const ShareMoments = () => {
  return (
    <section className=" ss-imgfm py-10 text-center">
      <h2 className="text-3xl font-bold">Chia sẻ khoảnh khắc của bạn</h2>
      <p className="text-orange-600 mt-2">
        
Hãy lan tỏa những khoảnh khắc truyền cảm hứng của bạn với Ăn vặt 247
      </p>
      <div className=" box-all-img grid grid-cols-4 gap-4 p-6 max-w-6xl mx-auto" >
        {images.map((img, index) => (
          <div key={index} className="relative rounded-lg overflow-hidden">
            <Image src={img.src} alt="Moment" width={300} height={200} className="w-full h-auto" />
            <span className="absolute bottom-2 left-2 bg-white p-1 rounded-full">
              {img.social === "instagram" && <span>📸</span>}
              {img.social === "twitter" && <span>🐦</span>}
              {img.social === "facebook" && <span>📘</span>}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShareMoments;
