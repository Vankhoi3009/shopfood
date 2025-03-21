import { NextResponse, NextRequest } from "next/server";
import connectDB from "@backend/config/db";
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import { Readable } from "stream";

// Correctly typed params for Next.js App Router
export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;

  if (!filename) {
    return NextResponse.json({ error: "Filename is required" }, { status: 400 });
  }

  await connectDB();

  if (mongoose.connection.readyState !== 1) {
    console.error("❌ MongoDB connection failed");
    return NextResponse.json({ error: "MongoDB connection failed" }, { status: 500 });
  }

  const db = mongoose.connection.db;
  if (!db) {
    console.error("❌ Database not found");
    return NextResponse.json({ error: "Database not found" }, { status: 500 });
  }

  const bucket = new GridFSBucket(db, { bucketName: "uploads" });

  try {
    const file = await db.collection("uploads.files").findOne({ filename });

    if (!file) {
      console.error(`❌ File not found: ${filename}`);
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const stream = bucket.openDownloadStreamByName(filename);

    return new Response(new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => controller.enqueue(chunk));
        stream.on("end", () => controller.close());
        stream.on("error", (err) => controller.error(err));
      },
    }), {
      headers: { "Content-Type": file.contentType || "image/jpeg" },
    });

  } catch (error) {
    console.error("❌ Error fetching image:", error);
    return NextResponse.json({ error: "Error fetching image" }, { status: 500 });
  }
}

// POST handler for uploading images to MongoDB GridFS
export async function POST(req: NextRequest) {
  await connectDB();

  if (mongoose.connection.readyState !== 1) {
    return NextResponse.json({ error: "MongoDB connection failed" }, { status: 500 });
  }

  const db = mongoose.connection.db;
  if (!db) {
    return NextResponse.json({ error: "Database not found" }, { status: 500 });
  }

  const bucket = new GridFSBucket(db, { bucketName: "uploads" });

  try {
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
      }
    });
    
    const uploadStream = bucket.openUploadStream(file.name, { contentType: file.type });

    await new Promise<void>((resolve, reject) => {
      fileStream.pipe(uploadStream).on("error", reject).on("finish", resolve);
    });

    return NextResponse.json({ 
      message: "Upload thành công!", 
      filename: file.name 
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error uploading image:", error);
    return NextResponse.json({ error: "Error uploading image" }, { status: 500 });
  }
}
