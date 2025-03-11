"use client";

import Link from "next/link";

export default function Header() {
    return (
        <header>
            <div className="logo">
                <Link href="/">Ăn Vặt 247</Link>
            </div>
            <nav>
                <ul>
                    <li><Link href="/">Trang Chủ</Link></li>
                    <li><Link href="/shop">Đồ ăn vặt</Link></li>
                    <li><Link href="#contact">Liên hệ</Link></li>
                </ul>
            </nav>
            <div className="account-cart">
                <Link href="#">Đăng nhập</Link>
                <Link href="#">
                    <i className="fa fa-shopping-cart" style={{ fontSize: "24px" }}></i>
                </Link>
            </div>
        </header>
    );
}
