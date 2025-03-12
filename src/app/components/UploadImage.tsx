"use client";
import { useState } from "react";

export default function UploadImage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    await fetch("/api/upload", { method: "POST", body: formData });
    alert("Ảnh đã được tải lên!");
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-lg font-semibold">Tải ảnh lên</h3>
      <input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} className="mt-2 p-2 bg-blue-500 text-white rounded">Upload</button>
    </div>
  );
}
