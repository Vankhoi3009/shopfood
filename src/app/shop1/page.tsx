import Link from "next/link";
import Footer from "@/components/footer";
import "@/styles/Shop1.css";
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
      <Link href="/Shopproduct1">Đồ ăn vặt</Link>
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
    <div className="container">
      <div className="content-wrapper">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3>Bộ lọc</h3>
          <div className="filter-group">
            <h4>Danh mục</h4>
            <label>
              <input type="checkbox" /> Bánh tráng
            </label>
            <label>
              <input type="checkbox" /> Xoài lắc
            </label>
            <label>
              <input type="checkbox" /> Gà rán
            </label>
          </div>
          <div className="filter-group">
            <h4>Tìm kiếm</h4>
            <input type="text" placeholder="Nhập tên sản phẩm..." />
          </div>
        </aside>

        {/* Danh sách sản phẩm */}
        <section className="product-list" id="product-list">
          {[
            { img: "img/product 1.jpg", name: "Sản phẩm 1" },
            { img: "img/product2.jpg", name: "Sản phẩm 2" },
            { img: "img/product3.jpg", name: "Sản phẩm 3" },
            { img: "img/produc4.jpg", name: "Sản phẩm 4" },
            { img: "img/product5.jpg", name: "Sản phẩm 5" },
            { img: "img/product6.jpg", name: "Sản phẩm 6" },
            { img: "img/product 1.jpg", name: "Sản phẩm 1" },
            { img: "img/product2.jpg", name: "Sản phẩm 2" },
            { img: "img/product3.jpg", name: "Sản phẩm 3" },
            { img: "img/produc4.jpg", name: "Sản phẩm 4" },
            { img: "img/product5.jpg", name: "Sản phẩm 5" },
            { img: "img/product6.jpg", name: "Sản phẩm 6" },
          ].map((product, index) => (
            <div key={index} className="product">
              <img src={product.img} alt="" />
              <h3>{product.name}</h3>
            </div>
          ))}
        </section>
      </div>

      {/* Nút Xem thêm */}
      <button className="btn-load-more" id="load-more">
        Xem thêm
      </button>
    </div>
    < Footer  />
        </main>
    );
}
