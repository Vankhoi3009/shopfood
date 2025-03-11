type Product = {
    id: number;
    name: string;
    image: string;
};

export default function ProductList() {
    const products: Product[] = [
        { id: 1, name: "Sản phẩm 1", image: "/img/product1.jpg" },
        { id: 2, name: "Sản phẩm 2", image: "/img/product2.jpg" },
        { id: 3, name: "Sản phẩm 3", image: "/img/product3.jpg" },
        { id: 4, name: "Sản phẩm 4", image: "/img/product4.jpg" },
    ];

    return (
        <section className="product-list">
            {products.map((product) => (
                <div key={product.id} className="product">
                    <img src={product.image} alt={product.name} />
                    <h3>{product.name}</h3>
                </div>
            ))}
        </section>
    );
}
