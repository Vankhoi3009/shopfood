"use client";
// import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import UploadImage from "../components/UploadImage";
import AddProduct from "../components/AddProduct";
import ProductList from "../components/ProductList";
export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UploadImage />
          <AddProduct />
          <ProductList />
        </div>
        
      </div>
    </div>
  );
}