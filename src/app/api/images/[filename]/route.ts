import { NextRequest } from "next/server"; // ✅ Chỉ import NextRequest
import connectDB from "@backend/config/db";
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

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

    const webStream = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => controller.enqueue(chunk));
        stream.on("end", () => controller.close());
        stream.on("error", (err) => controller.error(err));
      },
    });

    return new Response(webStream, {
      status: 200,
      headers: { "Content-Type": "image/jpeg" }, // Bạn có thể thay đổi type tùy vào loại ảnh
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return new Response("Error fetching image", { status: 500 });
  }
}
