import { NextRequest } from "next/server"; // ✅ Chỉ import NextRequest
import connectDB from "@backend/config/db";
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import { Readable } from "stream";

// ✅ API Lấy Ảnh từ MongoDB GridFS (Không thay đổi code cũ)
export async function GET(req: NextRequest, { params }: { params: { filename: string } }) {
  await connectDB();

  if (mongoose.connection.readyState !== 1) {
    return new Response("MongoDB connection failed", { status: 500 });
  }

  const db = mongoose.connection.db;
  if (!db) {
    return new Response("Database not found", { status: 500 });
  }

  const bucket = new GridFSBucket(db, { bucketName: "uploads" });

  try {
    const file = await db.collection("uploads.files").findOne({ filename: params.filename });

    if (!file) {
      return new Response("File not found", { status: 404 });
    }

    const stream = bucket.openDownloadStreamByName(params.filename);
    
    return new Response(new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => controller.enqueue(chunk));
        stream.on("end", () => controller.close());
        stream.on("error", (err) => controller.error(err));
      },
    }), {
      status: 200,
      headers: { "Content-Type": file.contentType || "image/jpeg" }, // ✅ Xác định type từ file lưu trong DB
    });
  } catch (error) {
    console.error("❌ Error fetching image:", error);
    return new Response("Error fetching image", { status: 500 });
  }
}

// ✅ API Thêm Ảnh vào MongoDB GridFS
export async function POST(req: NextRequest) {
  await connectDB();

  if (mongoose.connection.readyState !== 1) {
    return new Response("MongoDB connection failed", { status: 500 });
  }

  const db = mongoose.connection.db;
  if (!db) {
    return new Response("Database not found", { status: 500 });
  }

  const bucket = new GridFSBucket(db, { bucketName: "uploads" });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response("No file uploaded", { status: 400 });
    }

    const reader = file.stream().getReader();
    const fileStream = Readable.from({
      async *[Symbol.asyncIterator]() {
        const done = false;
        while (!done) {
          const { value, done: isDone } = await reader.read();
          if (isDone) break;
          yield value;
        }
      }
    });
    
    const uploadStream = bucket.openUploadStream(file.name, { contentType: file.type });

    await new Promise<void>((resolve, reject) => {
      fileStream.pipe(uploadStream).on("error", reject).on("finish", resolve);
    });

    return new Response(JSON.stringify({ message: "Upload thành công!", filename: file.name }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error uploading image:", error);
    return new Response("Error uploading image", { status: 500 });
  }
}