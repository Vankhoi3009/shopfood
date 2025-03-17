// "use client";
// import { useState, useEffect } from "react";

// interface Image {
//   _id: string;
//   filename: string;
// }

// interface Product {
//   _id?: string;
//   name: string;
//   image: string;
// }

// interface ProductFormProps {
//   mode: "add" | "edit";
//   product: Product;
//   onSuccess: () => void;
// }

// export default function ProductForm({ mode, product, onSuccess }: ProductFormProps) {
//   const [name, setName] = useState(product?.name || "");
//   const [images, setImages] = useState<Image[]>([]);
//   const [selectedImage, setSelectedImage] = useState(product?.image || "");

//   useEffect(() => {
//     fetch("/api/images")
//       .then((res) => res.json())
//       .then((data: Image[]) => setImages(data));
//   }, []);

//   const handleSubmit = async () => {
//     const url = mode === "edit" ? `/api/products/${product?._id}` : "/api/products";
//     const method = mode === "edit" ? "PUT" : "POST";

//     const res = await fetch(url, {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, image: selectedImage }),
//     });

//     if (!res.ok) {
//       const result = await res.json();
//       alert(result.error || `${mode === "edit" ? "Cập nhật" : "Thêm"} sản phẩm thất bại`);
//       return;
//     }

//     alert(`Sản phẩm đã được ${mode === "edit" ? "cập nhật" : "thêm"}!`);
//     onSuccess();
//   };

//   return (
//     <div className="p-4 bg-white shadow rounded-lg">
//       <h3 className="text-lg font-semibold">{mode === "edit" ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}</h3>
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
//       <button
//         onClick={handleSubmit}
//         className={`mt-2 p-2 rounded text-white ${mode === "edit" ? "bg-blue-500" : "bg-green-500"}`}
//       >
//         {mode === "edit" ? "Cập nhật" : "Thêm"}
//       </button>
//     </div>
//   );
// }
