// "use client";
// import { useState, useEffect } from "react";

// interface Image {
//   _id: string;
//   filename: string;
// }

// interface Product {
//   _id: string;
//   name: string;
//   image: string;
// }

// export default function EditProduct({ product, onUpdate }: { product: Product; onUpdate: () => void }) {
//   const [name, setName] = useState(product.name);
//   const [images, setImages] = useState<Image[]>([]);
//   const [selectedImage, setSelectedImage] = useState(product.image);

//   useEffect(() => {
//     fetch("/api/images")
//       .then((res) => res.json())
//       .then((data: Image[]) => setImages(data));
//   }, []);

//   const handleUpdateProduct = async () => {
//     const res = await fetch(`/api/products/${product._id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, image: selectedImage }),
//     });

//     if (!res.ok) {
//       const result = await res.json();
//       alert(result.error || "Cập nhật sản phẩm thất bại");
//       return;
//     }

//     alert("Sản phẩm đã được cập nhật!");
//     onUpdate();
//   };

//   return (
//     <div className="p-4 bg-white shadow rounded-lg">
//       <h3 className="text-lg font-semibold">Cập nhật sản phẩm</h3>
//       <input
//         type="text"
//         placeholder="Tên sản phẩm"
//         value={name}
//         className="border p-2 w-full"
//         onChange={(e) => setName(e.target.value)}
//       />
//       <select
//         className="border p-2 w-full mt-2"
//         value={selectedImage}
//         onChange={(e) => setSelectedImage(e.target.value)}
//       >
//         <option value="">Chọn ảnh</option>
//         {images.map((img: Image) => (
//           <option key={img._id} value={img.filename}>
//             {img.filename}
//           </option>
//         ))}
//       </select>
//       <button onClick={handleUpdateProduct} className="mt-2 p-2 bg-blue-500 text-white rounded">
//         Cập nhật
//       </button>
//     </div>
//   );
// }
