import { NextRequest, NextResponse } from "next/server";
import connectDB from "@backend/config/db";
import { GridFSBucket, Db, MongoClient } from "mongodb";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  const filename = decodeURIComponent(request.nextUrl.pathname.split("/").pop() || "");

  if (!filename) {
    return NextResponse.json({ error: "Filename is required" }, { status: 400 });
  }

  await connectDB();

  if (mongoose.connection.readyState !== 1) {
    console.error("❌ MongoDB connection failed");
    return NextResponse.json({ error: "MongoDB connection failed" }, { status: 500 });
  }

  try {
    const client = mongoose.connection.getClient() as unknown as MongoClient;
    const dbName = mongoose.connection.db?.databaseName || mongoose.connection.name || "test";
    const db = client.db(dbName) as Db;

    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    const file = await db.collection("uploads.files").findOne({ filename });

    if (!file) {
      console.error(`❌ File not found: ${filename}`);
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Tạo stream để đọc file từ GridFS
    const stream = bucket.openDownloadStreamByName(filename);

    // Chuyển đổi stream MongoDB thành ReadableStream của web API
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
