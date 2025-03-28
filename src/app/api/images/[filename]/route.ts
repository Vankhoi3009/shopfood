import { NextRequest, NextResponse } from "next/server";
import connectDB from "@backend/config/db";
import { GridFSBucket, Db, MongoClient } from "mongodb";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    // Lấy filename từ URL, giải mã & chuẩn hóa
    const { searchParams } = new URL(request.url);
    let filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    filename = decodeURIComponent(filename).trim();

    // Kết nối MongoDB
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
      console.error("❌ MongoDB connection failed");
      return NextResponse.json({ error: "MongoDB connection failed" }, { status: 500 });
    }

    // Lấy database từ Mongoose
    const client = mongoose.connection.getClient() as unknown as MongoClient;
    const dbName = mongoose.connection.db?.databaseName || mongoose.connection.name || "test";
    const db = client.db(dbName) as Db;
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    // Kiểm tra file trong GridFS
    const file = await db.collection("uploads.files").findOne({ filename });
    if (!file) {
      console.error(`❌ File not found: ${filename}`);
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Tạo stream đọc file từ GridFS
    const stream = bucket.openDownloadStreamByName(filename);

    // Chuyển đổi stream thành ReadableStream (dùng trong Next.js)
    const readableStream = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => controller.enqueue(chunk));
        stream.on("end", () => controller.close());
        stream.on("error", (err) => controller.error(err));
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": file.metadata?.contentType || "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });

  } catch (error) {
    console.error("❌ Error fetching image:", error);
    return NextResponse.json({ error: "Error fetching image" }, { status: 500 });
  }
}
