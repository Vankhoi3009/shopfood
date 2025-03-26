import { NextRequest, NextResponse } from "next/server";
import connectDB from "@backend/config/db";
import { GridFSBucket, Db, MongoClient } from 'mongodb';
import mongoose from "mongoose";
import { Readable } from "stream";

export async function GET(
  request: NextRequest
) {
  const filename = request.nextUrl.pathname.split('/').pop() || '';

  if (!filename) {
    return NextResponse.json({ error: "Filename is required" }, { status: 400 });
  }

  await connectDB();

  if (mongoose.connection.readyState !== 1) {
    console.error("❌ MongoDB connection failed");
    return NextResponse.json({ error: "MongoDB connection failed" }, { status: 500 });
  }

  try {
    // Lấy client MongoDB trực tiếp
    const client = mongoose.connection.getClient() as MongoClient;
    const dbName = mongoose.connection.db?.databaseName || mongoose.connection.name || 'test';
    
    // Lấy database
    const db = client.db(dbName) as Db;

    // Tạo GridFSBucket 
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    const file = await db.collection("uploads.files").findOne({ filename });

    if (!file) {
      console.error(`❌ File not found: ${filename}`);
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const stream = bucket.openDownloadStreamByName(filename);

    return new Response(
      new ReadableStream({
        start(controller) {
          stream.on("data", (chunk) => controller.enqueue(chunk));
          stream.on("end", () => controller.close());
          stream.on("error", (err) => controller.error(err));
        },
      }),
      {
        headers: { 
          "Content-Type": file.contentType || "image/jpeg",
          "Cache-Control": "public, max-age=86400"
        },
      }
    );
  } catch (error) {
    console.error("❌ Error fetching image:", error);
    return NextResponse.json({ error: "Error fetching image" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectDB();

  if (mongoose.connection.readyState !== 1) {
    return NextResponse.json({ error: "MongoDB connection failed" }, { status: 500 });
  }

  try {
    const client = mongoose.connection.getClient() as MongoClient;
    const dbName = mongoose.connection.db?.databaseName || mongoose.connection.name || 'test';
    const db = client.db(dbName) as Db;

    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const reader = file.stream().getReader();
    const fileStream = Readable.from({
      async *[Symbol.asyncIterator]() {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          yield value;
        }
      },
    });

    const uploadStream = bucket.openUploadStream(file.name, {
      contentType: file.type,
    });

    await new Promise<void>((resolve, reject) => {
      fileStream.pipe(uploadStream).on("error", reject).on("finish", resolve);
    });

    return NextResponse.json(
      {
        message: "Upload thành công!",
        filename: file.name,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error uploading image:", error);
    return NextResponse.json({ error: "Error uploading image" }, { status: 500 });
  }
}