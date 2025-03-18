import { useState } from "react";
import Link from "next/link";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className={styles.header}>
            <Link href="/" className={styles.logo}>LOGO</Link>
            
            <div className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </div>

            <nav>
                <ul className={menuOpen ? `${styles.navList} ${styles.active}` : styles.navList}>
            <li><Link href="/">Trang Chủ</Link></li>
            <li><Link href="/shop1">Đồ ăn vặt</Link></li>
            <li><Link href="/#best-sellers">Đồ ăn đêm</Link></li>
            <li><Link href="/#best-sellers">Đồ uống</Link></li>
            <li><Link href="/#best-sellers">Tin tức</Link></li>
            <li><Link href="/#contact">Liên hệ</Link></li>
                </ul>
            </nav>
        </header>
    );
}
