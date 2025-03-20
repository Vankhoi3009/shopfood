export function setupMobileMenu(setMenuOpen) {
    if (typeof window !== "undefined") {
      const menuIcon = document.querySelector(".mobile-menu-icon");
      const overlay = document.querySelector(".overlay");
  
      if (menuIcon) {
        menuIcon.addEventListener("click", () => setMenuOpen((prev) => !prev));
      }
  
      if (overlay) {
        overlay.addEventListener("click", () => setMenuOpen(false));
      }
    }
  }
  