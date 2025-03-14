import Image from "next/image";

const Banner = () => {
  return (
    <section className="banner">
      <div className="slide active">
        <Image src="/img/banner.jpg" alt="Banner 1" width={1200} height={4400} />
        <div className="banner-text">
          <h1>Chào mừng đến với Ăn Vặt 247</h1>
          <a href="#contact" className="btn">Xem ngay</a>
        </div>
      </div>
      <div className="slide">
        <Image src="/img/banner3.jpg" alt="Banner 2" width={1200} height={4400} />
        <div className="banner-text">
          <h1>Hương vị truyền thống, chất lượng hàng đầu</h1>
          <a href="#contact" className="btn">Xem ngay</a>
        </div>
      </div>
    </section>
  );
};

export default Banner;
