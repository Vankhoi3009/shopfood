import Link from "next/link";
import BannerSlider  from "@/components/home";
import ContactForm from "@/components/contactform";
import Footer from "@/components/footer";
import "@/styles/Home.css";
import "@/styles/Base.css";


export default function Home() {
    return (
        <main>
    <header>
      <div className="logo">
        <a href="#">Ăn Vặt 247</a>
      </div>
      <nav>
  <ul>
    <li>
      <Link href="/">Trang Chủ</Link>
    </li>
    <li>
      <Link href="/shop1">Đồ ăn vặt</Link>
    </li>
    <li>
      <Link href="/#best-sellers">Đồ ăn đêm</Link>
    </li>
    <li>
      <Link href="/#best-sellers">Đồ uống</Link>
    </li>
    <li>
      <Link href="/#best-sellers">Tin tức</Link>
    </li>
    <li>
      <Link href="/#contact">Liên hệ</Link>
    </li>
  </ul>
</nav>
      <div className="account-cart">
      <Link href="/auth">Đăng nhập</Link>
        <a href="#">
          <i className="fa fa-shopping-cart" style={{ fontSize: "24px" }}></i>
        </a>
      </div>
    </header>
            <BannerSlider />
            <section id="about">
        <h2>Giới thiệu</h2>
        <p>Ăn Vặt 247 chuyên cung cấp các món ăn vặt ngon, chất lượng.</p>
        <img src="img/gt.jpg" alt="" />
      </section>

      <section id="new-products">
        <h2>Sản phẩm mới</h2>
        <div className="product-list">
          <div className="product">
            <img src="img/product 1.jpg" alt="" />
            <h3>Sản phẩm 1</h3>
          </div>
          <div className="product">
            <img src="img/product2.jpg" alt="" />
            <h3>Sản phẩm 2</h3>
          </div>
          <div className="product">
            <img src="img/product3.jpg" alt="" />
            <h3>Sản phẩm 3</h3>
          </div>
          <div className="product">
            <img src="img/produc4.jpg" alt="" />
            <h3>Sản phẩm 4</h3>
          </div>
        </div>
      </section>

      <section id="best-sellers">
        <h2>Sản phẩm bán chạy</h2>
        <div className="product-list">
          <div className="product">
            <img src="img/product5.jpg" alt="" />
            <h3>Sản phẩm 5</h3>
          </div>
          <div className="product">
            <img src="img/product6.jpg" alt="" />
            <h3>Sản phẩm 6</h3>
          </div>
          <div className="product">
            <img src="img/product7.jpg" alt="" />
            <h3>Sản phẩm 7</h3>
          </div>
          <div className="product">
            <img src="img/product8.jpg" alt="" />
            <h3>Sản phẩm 8</h3>
          </div>
        </div>
      </section>
            <ContactForm />
            < Footer  />
        </main>
    );
}
