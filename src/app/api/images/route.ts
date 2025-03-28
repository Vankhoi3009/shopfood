import { NextResponse } from "next/server";
import connectDB from "@backend/config/db";
import { MongoClient, GridFSBucket } from "mongodb";
import mongoose from "mongoose";

export const GET = async (req: Request, { params }: { params: { filename: string } }) => {
  try {
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
      console.error("❌ MongoDB connection failed");
      return NextResponse.json({ error: "MongoDB connection failed" }, { status: 500 });
    }

    const { filename } = params;
    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    // Kết nối database
    const client = mongoose.connection.getClient() as MongoClient;
    const dbName = mongoose.connection.db?.databaseName || mongoose.connection.name || "test";
    const db = client.db(dbName);

    // Kiểm tra file tồn tại
    const file = await db.collection("uploads.files").findOne({ filename });
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Lấy ảnh từ GridFS
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });
    const downloadStream = bucket.openDownloadStreamByName(filename);

    // Chuyển đổi stream thành ReadableStream cho Next.js
    const readableStream = new ReadableStream({
      start(controller) {
        downloadStream.on("data", (chunk) => controller.enqueue(chunk));
        downloadStream.on("end", () => controller.close());
        downloadStream.on("error", (err) => controller.error(err));
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": file.metadata?.contentType || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("❌ Error fetching image:", error);
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
};
