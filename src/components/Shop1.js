document.addEventListener("DOMContentLoaded", function () {
    const productList = document.getElementById("product-list");
    const loadMoreBtn = document.getElementById("load-more");

    let currentProducts = 6; // Số sản phẩm đang hiển thị
    const totalProducts = 12; // Tổng số sản phẩm có thể hiển thị

    loadMoreBtn.addEventListener("click", function () {
        for (let i = currentProducts + 1; i <= Math.min(currentProducts + 4, totalProducts); i++) {
            let product = document.createElement("div");
            product.className = "product";
            product.innerHTML = `<img src="p${i}.jpg" alt="Sản phẩm ${i}"><h3>Sản phẩm ${i}</h3>`;
            productList.appendChild(product);
        }
        currentProducts += 4;

        // Ẩn nút nếu đã hiển thị hết sản phẩm
        if (currentProducts >= totalProducts) {
            loadMoreBtn.style.display = "none";
        }
    });
});
